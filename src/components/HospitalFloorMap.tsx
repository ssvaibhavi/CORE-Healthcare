import React from 'react';
import {
  HOSPITAL_EDGES,
  HOSPITAL_NODES,
  HospitalNodeId,
  SELECTABLE_DESTINATION_IDS,
} from '../data/hospitalMapData';
import { ComputedRoute } from '../utils/wayfinding';
import { Language } from '../types';
import {
  Accessibility,
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  Footprints,
  Info,
  MapPin,
  Navigation,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface HospitalFloorMapProps {
  language: Language;
  startId: HospitalNodeId;
  destinationId: HospitalNodeId;
  accessibleOnly: boolean;
  route: ComputedRoute;
  baselineRoute?: ComputedRoute;
  disabledEdgeIds?: string[];
  disruptionReason?: string;
  routeChanged?: boolean;
  noAccessibleRouteFound?: boolean;
  onStartChange: (id: HospitalNodeId) => void;
  onDestinationChange: (id: HospitalNodeId) => void;
  onToggleAccessible: () => void;
  onSwapLocations: () => void;
  onSimulatePreset?: (edgeIds: string[], label: string) => void;
  onResetSimulation?: () => void;
  reduceMotion?: boolean;
}

export const HospitalFloorMap: React.FC<HospitalFloorMapProps> = ({
  language,
  startId,
  destinationId,
  accessibleOnly,
  route,
  baselineRoute,
  disabledEdgeIds = [],
  disruptionReason,
  routeChanged = false,
  noAccessibleRouteFound = false,
  onStartChange,
  onDestinationChange,
  onToggleAccessible,
  onSwapLocations,
  onSimulatePreset,
  onResetSimulation,
  reduceMotion = false,
}) => {
  const activeNodeIds = new Set(route.nodes.map((n) => n.id));
  const activeEdgeIds = new Set(route.steps.map((s) => s.edgeId));
  const disabledSet = new Set(disabledEdgeIds);

  const titleText =
    language === 'kn'
      ? 'ಸಂವಾದಾತ್ಮಕ ಆಸ್ಪತ್ರೆ ಮಹಡಿ ನಕ್ಷೆ (ಕಾಲ್ಪನಿಕ ಪ್ರಾತ್ಯಕ್ಷಿಕೆ)'
      : language === 'te'
      ? 'ఇంటరాక్టివ్ ఆసుపత్రి ఫ్లోర్ మ్యాప్ (నమూనా ప్రోటోటైప్)'
      : 'Interactive Hospital Floor Map (Fictional Demonstration)';

  const routeStrokeColor = accessibleOnly ? '#4A6347' : '#8A6D3F';

  const handleNodeActivate = (nodeId: HospitalNodeId) => {
    if (!HOSPITAL_NODES[nodeId]?.isDestination) return;
    if (nodeId === startId) return;
    onDestinationChange(nodeId);
  };

  const renderNodeLabelLines = (raw: string): [string, string?] => {
    const clean = raw.replace(/\s*\([^)]*\)\s*/g, '').trim();
    if (clean.length <= 14) return [clean];
    const parts = clean.split(' ');
    if (parts.length <= 1) return [clean];
    const mid = Math.ceil(parts.length / 2);
    return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')];
  };

  return (
    <div className="bg-white border border-[#BEA06D]/45 rounded-3xl p-4 sm:p-6 shadow-xs space-y-5">
      {/* Map Header & Fictional Disclaimer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6D3F] uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-[#C88F98]" />
            <span>{titleText}</span>
          </div>
          <p className="text-xs text-[#493C39]/80 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#BEA06D] shrink-0 mt-0.5" />
            <span>
              {language === 'kn'
                ? 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು ಮತ್ತು ದಾರಿಗಳು ಕಲಿಕಾ ಪ್ರಾತ್ಯಕ್ಷಿಕೆಗಾಗಿ ರೂಪಿಸಿದ ಕಾಲ್ಪನಿಕ ವಿನ್ಯಾಸವಾಗಿದೆ — ನಿಜವಾದ ಆಸ್ಪತ್ರೆ ನಕ್ಷೆಯಲ್ಲ.'
                : language === 'te'
                ? 'ఇది కేవలం నమూనా ప్రదర్శన కోసం రూపొందించిన కల్పిత ఆసుపత్రి మ్యాప్ — నిజమైన ఆసుపత్రి ప్లాన్ కాదు.'
                : 'Fictional Demonstration Map — Not an actual hospital layout. Always confirm room numbers with reception staff in person.'}
            </span>
          </p>
        </div>

        {/* Accessible Step-Free Toggle */}
        <button
          type="button"
          onClick={onToggleAccessible}
          aria-pressed={accessibleOnly}
          className={`py-2.5 px-4 rounded-2xl border-2 font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
            accessibleOnly
              ? 'bg-[#4A6347] border-[#4A6347] text-white shadow-xs'
              : 'bg-[#FCF9F5] border-[#BEA06D]/45 text-[#493C39] hover:border-[#4A6347]'
          }`}
        >
          <Accessibility className="w-4 h-4 shrink-0" />
          <span>
            {language === 'kn'
              ? accessibleOnly
                ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ದಾರಿ: ಸಕ್ರಿಯ'
                : 'ಮೆಟ್ಟಿಲು ರಹಿತ ಸುಲಭ ದಾರಿ ಆರಿಸಿ'
              : language === 'te'
              ? accessibleOnly
                ? 'మెట్లు లేని లిఫ్ట్ మార్గం: ఆన్'
                : 'మెట్లు లేని సులభ మార్గం ఎంచుకోండి'
              : accessibleOnly
              ? 'Step-Free Accessible Route: ON'
              : 'Use Accessible Route (Avoid Stairs)'}
          </span>
        </button>
      </div>

      {/* Start & Destination Selector Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end bg-[#FCF9F5] border border-[#BEA06D]/25 rounded-2xl p-3.5 sm:p-4">
        <div className="space-y-1">
          <label
            htmlFor="nav-start-select"
            className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider block"
          >
            {language === 'kn'
              ? 'ನೀವು ಇರುವ ಸ್ಥಳ (Start)'
              : language === 'te'
              ? 'మీరు ఉన్న ప్రదేశం (Start)'
              : 'Starting Point'}
          </label>
          <select
            id="nav-start-select"
            value={startId}
            onChange={(e) => onStartChange(e.target.value as HospitalNodeId)}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#BEA06D]/50 bg-white text-sm font-semibold text-[#322826]"
          >
            {SELECTABLE_DESTINATION_IDS.map((id) => (
              <option key={id} value={id}>
                {HOSPITAL_NODES[id].name[language]}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSwapLocations}
          aria-label={
            language === 'kn'
              ? 'ಆರಂಭ ಮತ್ತು ಗಮ್ಯಸ್ಥಾನ ಬದಲಿಸಿ'
              : language === 'te'
              ? 'ప్రారంభ మరియు గమ్య స్థానాలను మార్చండి'
              : 'Swap start and destination'
          }
          className="min-w-[44px] min-h-[44px] px-3 py-2 rounded-xl bg-white border border-[#BEA06D]/45 hover:border-[#C88F98] text-[#8A6D3F] inline-flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer self-end"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span className="sm:hidden">
            {language === 'kn' ? 'ಸ್ಥಳ ಬದಲಿಸಿ' : language === 'te' ? 'మార్చు' : 'Swap'}
          </span>
        </button>

        <div className="space-y-1">
          <label
            htmlFor="nav-dest-select"
            className="text-xs font-bold text-[#4A6347] uppercase tracking-wider block"
          >
            {language === 'kn'
              ? 'ತಲುಪಬೇಕಾದ ಸ್ಥಳ (Destination)'
              : language === 'te'
              ? 'చేరవలసిన ప్రదేశం (Destination)'
              : 'Destination'}
          </label>
          <select
            id="nav-dest-select"
            value={destinationId}
            onChange={(e) => onDestinationChange(e.target.value as HospitalNodeId)}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-[#4A6347]/50 bg-white text-sm font-semibold text-[#322826]"
          >
            {SELECTABLE_DESTINATION_IDS.map((id) => (
              <option key={id} value={id}>
                {HOSPITAL_NODES[id].name[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Route Replanning Simulation Bar (when enabled) */}
      {onSimulatePreset && (
        <div className="bg-[#FCF9F5] border border-[#BEA06D]/35 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#8A6D3F] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#C88F98]" />
              <span>
                {language === 'kn'
                  ? 'ತಾತ್ಕಾಲಿಕ ದಾರಿ ಬದಲಾವಣೆ ಪರೀಕ್ಷಿಸಿ (Simulation)'
                  : language === 'te'
                  ? 'తాత్కాలిక మార్పుల రీప్లానింగ్ పరీక్ష (Simulation)'
                  : 'Test Dynamic Route Replanning (Fictional Closure)'}
              </span>
            </span>

            {disabledEdgeIds.length > 0 && onResetSimulation && (
              <button
                type="button"
                onClick={onResetSimulation}
                className="compact-chip py-1 px-3 rounded-full bg-white border border-[#BEA06D]/50 hover:border-[#4A6347] text-xs font-bold text-[#493C39] inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#4A6347]" />
                <span>
                  {language === 'kn'
                    ? 'ಮರುಹೊಂದಿಸಿ'
                    : language === 'te'
                    ? 'రీసెట్'
                    : 'Reset Simulation'}
                </span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              {
                id: 'reception-waiting',
                edges: ['reception-waiting'],
                label:
                  language === 'kn'
                    ? 'ನಿರೀಕ್ಷಣಾ ಹಾಲ್ ದಾರಿ ಮುಚ್ಚಿದೆ'
                    : language === 'te'
                    ? 'వెయిటింగ్ హాల్ దారి మూసివేత'
                    : 'Block Central Waiting Hall',
              },
              {
                id: 'lift-vertical',
                edges: ['lift-vertical'],
                label:
                  language === 'kn'
                    ? 'ಸುಲಭ ಲಿಫ್ಟ್ ಬಂದ್ (Lift Out)'
                    : language === 'te'
                    ? 'యాక్సెసిబుల్ లిఫ్ట్ బంద్'
                    : 'Accessible Lift Unavailable',
              },
              {
                id: 'waiting-pharmacy',
                edges: ['waiting-pharmacy'],
                label:
                  language === 'kn'
                    ? 'ಔಷಧಾಲಯ ಕಾರಿಡಾರ್ ಬಂದ್'
                    : language === 'te'
                    ? 'ఫార్మసీ కారిడార్ బంద్'
                    : 'Block Pharmacy Corridor',
              },
            ].map((sim) => {
              const active = sim.edges.every((eid) => disabledSet.has(eid));
              return (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => onSimulatePreset(sim.edges, sim.label)}
                  className={`compact-chip px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#C88F98] border-[#C88F98] text-white shadow-xs'
                      : 'bg-white border-[#BEA06D]/40 text-[#493C39] hover:border-[#C88F98]'
                  }`}
                >
                  {sim.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Responsive Architectural SVG Hospital Floor Plan */}
      <div className="rounded-2xl border border-[#BEA06D]/35 bg-[#FCF9F5] p-2 sm:p-4 overflow-hidden">
        <svg
          viewBox="0 0 840 500"
          role="img"
          aria-label={titleText}
          className="w-full h-auto block select-none"
        >
          <defs>
            <marker
              id="routeArrowStandard"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,1 L7,4 L0,7 Z" fill="#8A6D3F" />
            </marker>
            <marker
              id="routeArrowAccessible"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M0,1 L7,4 L0,7 Z" fill="#4A6347" />
            </marker>
          </defs>

          {/* Outer Hospital Wing Architectural Frame */}
          <rect
            x="16"
            y="16"
            width="808"
            height="468"
            rx="24"
            fill="#FFFFFF"
            stroke="#BEA06D"
            strokeOpacity="0.45"
            strokeWidth="2"
          />

          {/* Zone 1: Upper Diagnostic Wing (Level 1) */}
          <rect
            x="36"
            y="36"
            width="768"
            height="122"
            rx="16"
            fill="#F9F4EC"
            stroke="#BEA06D"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <text
            x="52"
            y="58"
            fill="#8A6D3F"
            fontSize="12"
            fontWeight="700"
            letterSpacing="0.06em"
          >
            {language === 'kn'
              ? 'ಮಹಡಿ 1 · ಪರೀಕ್ಷಾ ಮತ್ತು ವೈದ್ಯರ ವಿಭಾಗ (LEVEL 1 DIAGNOSTIC WING)'
              : language === 'te'
              ? 'లెవెల్ 1 · పరీక్షలు & వైద్యుల విభాగం (DIAGNOSTIC WING)'
              : 'LEVEL 1 · DIAGNOSTIC & CONSULTATION WING (FICTIONAL DEMO)'}
          </text>

          {/* Zone 2: Vertical Transition Band (Lift vs Stairs) */}
          <rect
            x="36"
            y="166"
            width="768"
            height="42"
            rx="10"
            fill="#FCF9F5"
            stroke="#E6C1C4"
            strokeOpacity="0.7"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x="420"
            y="191"
            textAnchor="middle"
            fill="#493C39"
            fillOpacity="0.68"
            fontSize="11"
            fontWeight="600"
          >
            {accessibleOnly
              ? language === 'kn'
                ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ದಾರಿ ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತಿದೆ'
                : language === 'te'
                ? 'మెట్లు లేని లిఫ్ట్ మార్గం మాత్రమే ఉపయోగించబడుతోంది'
                : 'STEP-FREE LIFT CORRIDOR ACTIVE · STAIRS AVOIDED'
              : language === 'kn'
              ? 'ಮೆಟ್ಟಿಲುಗಳು ಅಥವಾ ಸುಲಭ ಲಿಫ್ಟ್ ಮೂಲಕ ಸಂಪರ್ಕ'
              : language === 'te'
              ? 'మెట్లు లేదా యాక్సెసిబుల్ లిఫ్ట్ ద్వారా పై అంతస్తుకు దారి'
              : 'LEVEL TRANSITION · ACCESSIBLE LIFT (WEST) OR STAIRS'}
          </text>

          {/* Zone 3: Ground Lobby */}
          <rect
            x="36"
            y="216"
            width="768"
            height="252"
            rx="16"
            fill="#FCF9F5"
            stroke="#BEA06D"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <text
            x="52"
            y="238"
            fill="#8A6D3F"
            fontSize="12"
            fontWeight="700"
            letterSpacing="0.06em"
          >
            {language === 'kn'
              ? 'ನೆಲ ಮಹಡಿ · ಸ್ವಾಗತ ಮತ್ತು ನೋಂದಣಿ (GROUND LOBBY · STEP-FREE)'
              : language === 'te'
              ? 'గ్రౌండ్ లాబీ · రిసెప్షన్ & నమోదు (మెట్లు లేవు)'
              : 'GROUND LOBBY · RECEPTION, REGISTRATION & PHARMACY (STEP-FREE)'}
          </text>

          {/* Base Hallway Network Lines */}
          {HOSPITAL_EDGES.map((edge) => {
            const fromNode = HOSPITAL_NODES[edge.from];
            const toNode = HOSPITAL_NODES[edge.to];
            const isDimmedStair = accessibleOnly && edge.viaStairs;
            const isBlocked = disabledSet.has(edge.id);
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            return (
              <g key={`base-${edge.id}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isBlocked ? '#C88F98' : isDimmedStair ? '#D8CFC6' : '#E3D5C3'}
                  strokeWidth={edge.isLiftRide ? 8 : 6}
                  strokeLinecap="round"
                  strokeDasharray={isBlocked ? '4 6' : edge.viaStairs ? '4 5' : undefined}
                  opacity={isBlocked ? 0.55 : isDimmedStair ? 0.45 : 0.85}
                />
                {isBlocked && (
                  <g>
                    <circle cx={midX} cy={midY} r="12" fill="#C88F98" stroke="#FFFFFF" strokeWidth="2" />
                    <path
                      d={`M${midX - 4},${midY - 4} L${midX + 4},${midY + 4} M${midX + 4},${midY - 4} L${midX - 4},${midY + 4}`}
                      stroke="#FFFFFF"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {/* Baseline Ghost Path when Route Recalculated */}
          {routeChanged && baselineRoute?.found && (
            <g opacity="0.55">
              {baselineRoute.steps.map((bStep, idx) => (
                <line
                  key={`baseline-ghost-${bStep.edgeId}-${idx}`}
                  x1={bStep.from.x}
                  y1={bStep.from.y}
                  x2={bStep.to.x}
                  y2={bStep.to.y}
                  stroke="#C88F98"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )}

          {/* Active Deterministic Route Highlight */}
          {route.steps.map((step, idx) => (
            <g key={`active-step-${step.edgeId}-${idx}`}>
              <line
                x1={step.from.x}
                y1={step.from.y}
                x2={step.to.x}
                y2={step.to.y}
                stroke={routeStrokeColor}
                strokeOpacity="0.22"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <line
                x1={step.from.x}
                y1={step.from.y}
                x2={step.to.x}
                y2={step.to.y}
                stroke={routeStrokeColor}
                strokeWidth="5.5"
                strokeLinecap="round"
                className={reduceMotion ? undefined : 'route-path-animated'}
                markerEnd={
                  accessibleOnly ? 'url(#routeArrowAccessible)' : 'url(#routeArrowStandard)'
                }
              />
            </g>
          ))}

          {/* Hospital Room & Connector Nodes */}
          {(Object.keys(HOSPITAL_NODES) as HospitalNodeId[]).map((nodeId) => {
            const node = HOSPITAL_NODES[nodeId];
            const isStart = nodeId === startId;
            const isDest = nodeId === destinationId;
            const isOnRoute = activeNodeIds.has(nodeId);
            const isBypassedStair = accessibleOnly && node.isStairNode;

            if (!node.isDestination) {
              // Render compact architectural marker for Stairs or Lift Landing
              return (
                <g key={nodeId} opacity={isBypassedStair ? 0.42 : 1}>
                  <rect
                    x={node.x - 42}
                    y={node.y - 14}
                    width="84"
                    height="28"
                    rx="14"
                    fill={
                      node.isLiftNode
                        ? isOnRoute
                          ? '#4A6347'
                          : '#EEF4EC'
                        : isOnRoute
                        ? '#8A6D3F'
                        : '#F7EFEA'
                    }
                    stroke={node.isLiftNode ? '#4A6347' : '#C88F98'}
                    strokeWidth="1.5"
                    strokeDasharray={isBypassedStair ? '3 3' : undefined}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill={
                      isOnRoute
                        ? '#FFFFFF'
                        : node.isLiftNode
                        ? '#4A6347'
                        : '#493C39'
                    }
                  >
                    {node.shortLabel[language]}
                  </text>
                </g>
              );
            }

            const [line1, line2] = renderNodeLabelLines(node.shortLabel[language]);
            const boxW = 136;
            const boxH = line2 ? 54 : 46;

            let fillColor = '#FFFFFF';
            let strokeColor = '#BEA06D';
            let textColor = '#322826';
            if (isStart) {
              fillColor = '#493C39';
              strokeColor = '#493C39';
              textColor = '#FFFFFF';
            } else if (isDest) {
              fillColor = accessibleOnly ? '#4A6347' : '#8A6D3F';
              strokeColor = fillColor;
              textColor = '#FFFFFF';
            } else if (isOnRoute) {
              fillColor = accessibleOnly ? '#EEF5EC' : '#FBF4E8';
              strokeColor = accessibleOnly ? '#4A6347' : '#8A6D3F';
              textColor = '#322826';
            }

            const routeIdx = route.nodes.findIndex((n) => n.id === nodeId);

            return (
              <g
                key={nodeId}
                tabIndex={0}
                role="button"
                aria-label={`${node.name[language]}${isStart ? ' (Start)' : isDest ? ' (Destination)' : ''}`}
                onClick={() => handleNodeActivate(nodeId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNodeActivate(nodeId);
                  }
                }}
                style={{ cursor: nodeId === startId ? 'default' : 'pointer' }}
              >
                <rect
                  x={node.x - boxW / 2}
                  y={node.y - boxH / 2}
                  width={boxW}
                  height={boxH}
                  rx="14"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isStart || isDest ? '2.5' : isOnRoute ? '2' : '1.5'}
                />
                <text
                  x={node.x}
                  y={line2 ? node.y - 3 : node.y + 4}
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="700"
                  fill={textColor}
                >
                  {line1}
                </text>
                {line2 && (
                  <text
                    x={node.x}
                    y={node.y + 14}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight="700"
                    fill={textColor}
                  >
                    {line2}
                  </text>
                )}

                {/* Waypoint / Start / Destination Indicator Pill on SVG corner */}
                {(isStart || isDest || routeIdx > 0) && (
                  <g>
                    <circle
                      cx={node.x + boxW / 2 - 8}
                      cy={node.y - boxH / 2 + 2}
                      r="11"
                      fill={isStart ? '#BEA06D' : isDest ? '#C88F98' : routeStrokeColor}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={node.x + boxW / 2 - 8}
                      y={node.y - boxH / 2 + 6}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill="#FFFFFF"
                    >
                      {isStart ? 'S' : isDest ? 'D' : routeIdx}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Strip */}
        <div className="mt-3 pt-3 border-t border-[#BEA06D]/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#493C39]/85 px-1">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span className="w-3 h-3 rounded-full bg-[#493C39] inline-block" />
              {language === 'kn' ? 'S = ಆರಂಭ' : language === 'te' ? 'S = ప్రారంభం' : 'S = Start'}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: routeStrokeColor }}
              />
              {language === 'kn' ? 'D = ಗಮ್ಯಸ್ಥಾನ' : language === 'te' ? 'D = గమ్యం' : 'D = Destination'}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span className="w-5 border-t-2 border-dashed border-[#4A6347] inline-block" />
              {language === 'kn'
                ? 'ಸಕ್ರಿಯ ದಾರಿ (ಯಾವುದೇ ಸ್ಥಳ ಕ್ಲಿಕ್ ಮಾಡಿ)'
                : language === 'te'
                ? 'సక్రియ మార్గం (గదిని క్లిక్ చేయండి)'
                : 'Active Route (Tap any room to navigate there)'}
            </span>
          </div>
          <span className="text-[#8A6D3F] font-semibold">
            {activeEdgeIds.size} {language === 'kn' ? 'ಹಂತಗಳು' : language === 'te' ? 'దశలు' : 'segments'}
          </span>
        </div>
      </div>

      {/* Paired Accessible Text Route Summary (Screen-Reader Friendly) */}
      <div
        aria-live="polite"
        className={`rounded-2xl border p-4 flex flex-col gap-3 ${
          noAccessibleRouteFound
            ? 'bg-[#E6C1C4]/25 border-[#C88F98]'
            : route.accessibleOnly
            ? 'bg-[#A2B29B]/15 border-[#4A6347]/40'
            : 'bg-[#FCF9F5] border-[#BEA06D]/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {noAccessibleRouteFound ? (
                <span className="text-[#9E4958] inline-flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {language === 'kn'
                    ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ಪರ್ಯಾಯ ದಾರಿ ಸದ್ಯ ಲಭ್ಯವಿಲ್ಲ — ಮೆಟ್ಟಿಲುಗಳನ್ನು ಸೂಚಿಸಿಲ್ಲ'
                    : language === 'te'
                    ? 'ప్రత్యామ్నాయ మెట్లు లేని దారి లేదు — మెట్లను సూచించలేదు'
                    : 'No Step-Free Accessible Route Available — Stairs NOT Suggested'}
                </span>
              ) : route.accessibleOnly ? (
                <span className="text-[#4A6347] inline-flex items-center gap-1">
                  <Accessibility className="w-4 h-4" />
                  {routeChanged
                    ? language === 'kn'
                      ? 'ಪರ್ಯಾಯ ಮೆಟ್ಟಿಲು-ರಹಿತ ದಾರಿ ಮರುಲಭ್ಯ'
                      : language === 'te'
                      ? 'ప్రత్యామ్నాయ మెట్లు లేని మార్గం సిద్ధం'
                      : 'Alternative Step-Free Route Recalculated'
                    : language === 'kn'
                    ? 'ಮೆಟ್ಟಿಲು ರಹಿತ ಲಿಫ್ಟ್ ಮಾರ್ಗ ಸಕ್ರಿಯವಾಗಿದೆ'
                    : language === 'te'
                    ? 'మెట్లు లేని లిఫ్ట్ మార్గం సిద్ధం'
                    : 'Step-Free Accessible Route Verified'}
                </span>
              ) : route.usesStairs ? (
                <span className="text-[#8A6D3F] inline-flex items-center gap-1">
                  <Footprints className="w-4 h-4" />
                  {language === 'kn'
                    ? 'ಸಾಮಾನ್ಯ ದಾರಿ (ಮೆಟ್ಟಿಲುಗಳನ್ನು ಒಳಗೊಂಡಿದೆ)'
                    : language === 'te'
                    ? 'సాధారణ మార్గం (మెట్లు ఉన్నాయి)'
                    : 'Standard Route (Includes 1 Stair Section — Toggle Accessible Mode to Use Lift)'}
                </span>
              ) : (
                <span className="text-[#4A6347] inline-flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  {language === 'kn'
                    ? 'ಸಮತಟ್ಟಾದ ನೆಲ ಮಹಡಿ ಮಾರ್ಗ'
                    : language === 'te'
                    ? 'మెట్లు లేని సమతల మార్గం'
                    : 'Ground Level Step-Free Path'}
                </span>
              )}
            </div>

            {route.found ? (
              <p className="text-sm font-semibold text-[#322826]">
                {route.nodes.map((n) => n.name[language]).join(' → ')}
              </p>
            ) : (
              <p className="text-sm font-semibold text-[#322826]">
                {language === 'kn'
                  ? 'ಸ್ವಾಗತ ಕೇಂದ್ರದಲ್ಲಿ ಸಿಬ್ಬಂದಿ ಲಿಫ್ಟ್ ಅಥವಾ ನೆಲ ಮಹಡಿ ನೆರವು ಕೇಳಿ.'
                  : language === 'te'
                  ? 'రిసెప్షన్ వద్ద సిబ్బంది సర్వీస్ లిఫ్ట్ సహాయం అడగండి.'
                  : 'Ask Ground Reception for staff service-lift escort or ground-floor assistance.'}
              </p>
            )}
          </div>

          {route.found && (
            <div className="flex items-center gap-4 text-xs font-bold text-[#493C39] shrink-0 tabular-nums">
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#BEA06D]/35">
                <MapPin className="w-3.5 h-3.5 text-[#C88F98]" />
                {route.totalMeters} m
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#BEA06D]/35">
                <Clock className="w-3.5 h-3.5 text-[#8A6D3F]" />
                ~{route.estimatedMinutes}{' '}
                {language === 'kn' ? 'ನಿಮಿಷ' : language === 'te' ? 'నిమిషాలు' : 'min'}
              </span>
            </div>
          )}
        </div>

        {disruptionReason && (routeChanged || noAccessibleRouteFound || disabledEdgeIds.length > 0) && (
          <div className="pt-2.5 border-t border-[#BEA06D]/25 text-xs text-[#322826] leading-relaxed">
            <strong className="text-[#8A6D3F] mr-1.5">
              {language === 'kn'
                ? 'ಮಾರ್ಗ ಏಕೆ ಬದಲಾಗಿದೆ:'
                : language === 'te'
                ? 'దారి ఎందుకు మారింది:'
                : 'Why the route changed:'}
            </strong>
            <span>{disruptionReason}</span>
          </div>
        )}
      </div>
    </div>
  );
};
