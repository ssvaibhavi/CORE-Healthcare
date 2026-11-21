import {
  HOSPITAL_EDGES,
  HOSPITAL_NODES,
  HospitalEdge,
  HospitalNode,
  HospitalNodeId,
  InstructionDepthText,
} from '../data/hospitalMapData';
import { Language } from '../types';

export interface RouteStep {
  stepNumber: number;
  edgeId: string;
  from: HospitalNode;
  to: HospitalNode;
  meters: number;
  minutes: number;
  viaStairs: boolean;
  isLiftRide: boolean;
  instruction: Record<Language, InstructionDepthText>;
}

export interface ComputedRoute {
  found: boolean;
  start: HospitalNode;
  destination: HospitalNode;
  accessibleOnly: boolean;
  nodes: HospitalNode[];
  steps: RouteStep[];
  totalMeters: number;
  estimatedMinutes: number;
  usesLift: boolean;
  usesStairs: boolean;
  isSameLocation: boolean;
  disabledEdgeIds: string[];
  noAccessibleAlternative?: boolean;
}

export interface AdaptiveRouteComparison {
  baselineRoute: ComputedRoute;
  revisedRoute: ComputedRoute;
  hasDisruption: boolean;
  routeChanged: boolean;
  noAccessibleRouteFound: boolean;
  reason: Record<Language, string>;
}

interface DirectedEdgeRef {
  edge: HospitalEdge;
  from: HospitalNodeId;
  to: HospitalNodeId;
  reversed: boolean;
}

function getAdjacentEdges(
  nodeId: HospitalNodeId,
  accessibleOnly: boolean,
  disabledSet: Set<string>
): DirectedEdgeRef[] {
  const results: DirectedEdgeRef[] = [];
  for (const edge of HOSPITAL_EDGES) {
    if (disabledSet.has(edge.id)) {
      continue;
    }
    if (accessibleOnly && edge.viaStairs) {
      continue;
    }
    if (edge.from === nodeId) {
      results.push({ edge, from: edge.from, to: edge.to, reversed: false });
    } else if (edge.to === nodeId) {
      results.push({ edge, from: edge.to, to: edge.from, reversed: true });
    }
  }
  return results;
}

/**
 * Deterministic Dijkstra shortest-path solver on the fictional CORE hospital map graph.
 * When `accessibleOnly` is true, stair edges (`viaStairs: true`) are strictly excluded
 * and stairs are NEVER suggested even if the Accessible Lift is unavailable.
 */
export function findHospitalRoute(
  startId: HospitalNodeId,
  destinationId: HospitalNodeId,
  options: { accessibleOnly?: boolean; disabledEdgeIds?: string[] } = {}
): ComputedRoute {
  const accessibleOnly = Boolean(options.accessibleOnly);
  const disabledEdgeIds = (options.disabledEdgeIds || []).filter(Boolean);
  const disabledSet = new Set<string>(disabledEdgeIds);

  const startNode = HOSPITAL_NODES[startId];
  const destNode = HOSPITAL_NODES[destinationId];

  if (!startNode || !destNode) {
    throw new Error(`Invalid hospital location ID: ${startId} -> ${destinationId}`);
  }

  if (startId === destinationId) {
    return {
      found: true,
      start: startNode,
      destination: destNode,
      accessibleOnly,
      nodes: [startNode],
      steps: [],
      totalMeters: 0,
      estimatedMinutes: 0,
      usesLift: false,
      usesStairs: false,
      isSameLocation: true,
      disabledEdgeIds,
    };
  }

  const dist = new Map<HospitalNodeId, number>();
  const prev = new Map<HospitalNodeId, DirectedEdgeRef | null>();
  const unvisited = new Set<HospitalNodeId>(Object.keys(HOSPITAL_NODES) as HospitalNodeId[]);

  for (const id of unvisited) {
    dist.set(id, id === startId ? 0 : Infinity);
    prev.set(id, null);
  }

  while (unvisited.size > 0) {
    let current: HospitalNodeId | null = null;
    let smallestDist = Infinity;

    for (const candidate of unvisited) {
      const d = dist.get(candidate) ?? Infinity;
      if (d < smallestDist) {
        smallestDist = d;
        current = candidate;
      }
    }

    if (current === null || smallestDist === Infinity) {
      break;
    }

    if (current === destinationId) {
      break;
    }

    unvisited.delete(current);

    for (const link of getAdjacentEdges(current, accessibleOnly, disabledSet)) {
      if (!unvisited.has(link.to)) continue;
      const alt = smallestDist + link.edge.weightMeters;
      if (alt < (dist.get(link.to) ?? Infinity)) {
        dist.set(link.to, alt);
        prev.set(link.to, link);
      }
    }
  }

  const finalDistance = dist.get(destinationId) ?? Infinity;
  if (!Number.isFinite(finalDistance)) {
    return {
      found: false,
      start: startNode,
      destination: destNode,
      accessibleOnly,
      nodes: [],
      steps: [],
      totalMeters: 0,
      estimatedMinutes: 0,
      usesLift: false,
      usesStairs: false,
      isSameLocation: false,
      disabledEdgeIds,
      noAccessibleAlternative: accessibleOnly,
    };
  }

  const reversedLinks: DirectedEdgeRef[] = [];
  let cursor: HospitalNodeId = destinationId;
  while (cursor !== startId) {
    const link = prev.get(cursor);
    if (!link) break;
    reversedLinks.push(link);
    cursor = link.from;
  }
  const orderedLinks = reversedLinks.reverse();

  const nodes: HospitalNode[] = [startNode];
  const steps: RouteStep[] = orderedLinks.map((link, idx) => {
    const toNode = HOSPITAL_NODES[link.to];
    nodes.push(toNode);
    return {
      stepNumber: idx + 1,
      edgeId: link.edge.id,
      from: HOSPITAL_NODES[link.from],
      to: toNode,
      meters: link.edge.weightMeters,
      minutes: link.edge.estimatedMinutes,
      viaStairs: link.edge.viaStairs,
      isLiftRide: Boolean(link.edge.isLiftRide),
      instruction: link.reversed ? link.edge.reverse : link.edge.forward,
    };
  });

  const totalMeters = steps.reduce((acc, s) => acc + s.meters, 0);
  const estimatedMinutes = Math.max(1, steps.reduce((acc, s) => acc + s.minutes, 0));
  const usesLift = steps.some((s) => s.isLiftRide);
  const usesStairs = steps.some((s) => s.viaStairs);

  return {
    found: true,
    start: startNode,
    destination: destNode,
    accessibleOnly,
    nodes,
    steps,
    totalMeters,
    estimatedMinutes,
    usesLift,
    usesStairs,
    isSameLocation: false,
    disabledEdgeIds,
  };
}

/**
 * Compares the baseline shortest route against a recalculated route when corridors or lifts
 * are temporarily disrupted. Never substitutes stairs when `accessibleOnly` is true.
 */
export function computeAdaptiveRoute(
  startId: HospitalNodeId,
  destinationId: HospitalNodeId,
  options: { accessibleOnly?: boolean; disabledEdgeIds?: string[] } = {}
): AdaptiveRouteComparison {
  const disabledEdgeIds = (options.disabledEdgeIds || []).filter(Boolean);
  const baselineRoute = findHospitalRoute(startId, destinationId, {
    accessibleOnly: options.accessibleOnly,
    disabledEdgeIds: [],
  });
  const revisedRoute = findHospitalRoute(startId, destinationId, {
    accessibleOnly: options.accessibleOnly,
    disabledEdgeIds,
  });

  const hasDisruption = disabledEdgeIds.length > 0;
  const baselineIds = baselineRoute.nodes.map((n) => n.id).join('>');
  const revisedIds = revisedRoute.nodes.map((n) => n.id).join('>');
  const routeChanged =
    hasDisruption && (baselineIds !== revisedIds || baselineRoute.found !== revisedRoute.found);
  const noAccessibleRouteFound = hasDisruption && Boolean(options.accessibleOnly) && !revisedRoute.found;

  let reason: Record<Language, string>;
  if (!hasDisruption) {
    reason = {
      en: 'Normal hospital pathways are open. Showing the direct recommended path.',
      kn: 'ಆಸ್ಪತ್ರೆಯ ಎಲ್ಲಾ ದಾರಿಗಳು ತೆರೆದಿವೆ. ನೇರವಾದ ಮಾರ್ಗವನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
      te: 'ఆసుపత్రి మార్గాలన్నీ తెరిచి ఉన్నాయి. నేరుగా వెళ్లే దారిని చూపిస్తున్నాము.',
    };
  } else if (noAccessibleRouteFound) {
    reason = {
      en: `The Accessible Lift route to ${revisedRoute.destination.name.en} is temporarily unavailable, and no other step-free route exists. Because Step-Free Access is ON, CORE will NOT suggest stairs—please ask Reception for ground-level accommodation or staff lift support.`,
      kn: `${revisedRoute.destination.name.kn} ಗೆ ಹೋಗುವ ಸುಲಭ ಲಿಫ್ಟ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ ಮತ್ತು ಬೇರೆ ಮೆಟ್ಟಿಲು-ರಹಿತ ದಾರಿ ಇಲ್ಲ. ನೀವು ಮೆಟ್ಟಿಲು ರಹಿತ ದಾರಿ ಆಯ್ಕೆ ಮಾಡಿರುವುದರಿಂದ CORE ಮೆಟ್ಟಿಲುಗಳನ್ನು ಸೂಚಿಸುವುದಿಲ್ಲ — ದಯವಿಟ್ಟು ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ನೆರವು ಕೇಳಿ.`,
      te: `${revisedRoute.destination.name.te} కు వెళ్ళే యాక్సెసిబుల్ లిఫ్ట్ తాత్కాలికంగా అందుబాటులో లేదు మరియు వేరే మెట్లు లేని దారి లేదు. మీరు స్టెప్-ఫ్రీ మోడ్ ఎంచుకున్నందున CORE మెట్లను సూచించదు — దయచేసి రిసెప్షన్‌లో సహాయం అడగండి.`,
    };
  } else if (routeChanged && revisedRoute.found) {
    const newChainEn = revisedRoute.nodes.map((n) => n.shortLabel.en).join(' -> ');
    const newChainKn = revisedRoute.nodes.map((n) => n.shortLabel.kn).join(' -> ');
    const newChainTe = revisedRoute.nodes.map((n) => n.shortLabel.te).join(' -> ');
    reason = {
      en: `A section of your usual path is temporarily blocked. CORE recalculated an alternative ${
        revisedRoute.accessibleOnly ? 'step-free ' : ''
      }route (${newChainEn}, ~${revisedRoute.totalMeters}m).`,
      kn: `ನಿಮ್ಮ ಸಾಮಾನ್ಯ ದಾರಿಯ ಒಂದು ಭಾಗ ತಾತ್ಕಾಲಿಕವಾಗಿ ಮುಚ್ಚಿದೆ. CORE ಪರ್ಯಾಯ ${
        revisedRoute.accessibleOnly ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ' : ''
      }ಮಾರ್ಗವನ್ನು (${newChainKn}, ~${revisedRoute.totalMeters}ಮೀ) ಲೆಕ್ಕಹಾಕಿದೆ.`,
      te: `మీ సాధారణ మార్గంలో ఒక భాగం తాత్కాలికంగా మూసివేయబడింది. CORE ప్రత్యామ్నాయ ${
        revisedRoute.accessibleOnly ? 'మెట్లు లేని ' : ''
      }దారిని (${newChainTe}, ~${revisedRoute.totalMeters}మీ) సిద్ధం చేసింది.`,
    };
  } else if (!revisedRoute.found) {
    reason = {
      en: 'No connected corridor reaches this destination with the active closures. Ask Reception staff for assistance.',
      kn: 'ಪ್ರಸ್ತುತ ಮುಚ್ಚಿರುವ ದಾರಿಗಳಿಂದಾಗಿ ಈ ಸ್ಥಳಕ್ಕೆ ಮಾರ್ಗ ಸಿಗುತ್ತಿಲ್ಲ. ಸ್ವಾಗತ ಕೇಂದ್ರದ ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳಿ.',
      te: 'ప్రస్తుత మార్పుల వల్ల ఈ గమ్యస్థానానికి దారి అందుబాటులో లేదు. రిసెప్షన్ సిబ్బందిని అడగండి.',
    };
  } else {
    reason = {
      en: 'The simulated closure does not block your chosen destination path, so your primary route stays clear.',
      kn: 'ಪ್ರಸ್ತುತ ಅಡಚಣೆ ನಿಮ್ಮ ಆಯ್ಕೆಮಾಡಿದ ದಾರಿಗೆ ತೊಂದರೆ ಮಾಡುತ್ತಿಲ್ಲ — ಮೂಲ ಮಾರ್ಗವು ತೆರೆದಿದೆ.',
      te: 'ప్రస్తుత ఆటంకం మీ ఎంచుకున్న దారిని ప్రభావితం చేయలేదు — ప్రధాన మార్గం సురక్షితంగా ఉంది.',
    };
  }

  return {
    baselineRoute,
    revisedRoute,
    hasDisruption,
    routeChanged,
    noAccessibleRouteFound,
    reason,
  };
}

/**
 * Generates a strict, non-PII, deterministic summary of the current fictional floor map route
 * so Gemini Companion can explain steps and route recalculations accurately without inventing locations.
 */
export function buildNavigatorAiContextSummary(
  route: ComputedRoute,
  currentStage: number,
  lang: Language,
  comparison?: AdaptiveRouteComparison
): string {
  const approvedLocations = [
    'Main Entrance',
    'Reception',
    'Registration Counter',
    'Waiting Area',
    'Radiology',
    'Pharmacy',
    'Laboratory',
    'Consultation Rooms',
    'Accessible Lift',
  ].join(', ');

  if (route.isSameLocation) {
    return `FICTIONAL_DEMO_MAP | Stage ${currentStage}/5 | User is at ${route.start.name.en} (no walking needed) | AccessibleMode=${route.accessibleOnly ? 'ON' : 'OFF'} | ApprovedLocations=[${approvedLocations}]`;
  }

  if (!route.found) {
    const noAlt = route.noAccessibleAlternative
      ? 'NoAccessibleStepFreeRoute=TRUE (Do NOT suggest stairs; advise Reception assistance)'
      : 'NoRoute=TRUE';
    return `FICTIONAL_DEMO_MAP | Stage ${currentStage}/5 | ${noAlt} | Start=${route.start.name.en} | Destination=${route.destination.name.en} | BlockedEdges=[${route.disabledEdgeIds.join(',')}] | ApprovedLocations=[${approvedLocations}]`;
  }

  const pathChain = route.nodes.map((n) => n.name.en).join(' -> ');
  const stepLines = route.steps
    .map((s) => `${s.stepNumber}) ${s.instruction[lang]?.simple || s.instruction.en.simple}`)
    .join(' | ');

  const replanNote =
    comparison?.routeChanged
      ? `ReplannedFrom=[${comparison.baselineRoute.nodes.map((n) => n.shortLabel.en).join(' -> ')}] | Reason=${comparison.reason.en}`
      : 'Replanned=NO';

  return [
    `FICTIONAL_DEMO_MAP`,
    `Stage=${currentStage}/5`,
    `RouteMode=${route.accessibleOnly ? 'Step-Free Accessible (Lift, avoids stairs)' : 'Standard Shortest'}`,
    `Path=${pathChain}`,
    `Distance=${route.totalMeters}m (~${route.estimatedMinutes} min)`,
    replanNote,
    `Steps=[${stepLines}]`,
    `ApprovedLocations=[${approvedLocations}]`,
  ]
    .join(' | ')
    .slice(0, 1100);
}
