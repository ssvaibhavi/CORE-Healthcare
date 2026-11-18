import React, { useState } from 'react';
import { Language, PageView } from '../types';
import { CAREFLOW_SCENARIOS, CareFlowScenario } from '../data/phase2Data';
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  RotateCcw,
  Undo2,
  Eye,
  EyeOff,
  CheckCircle2,
  Info
} from 'lucide-react';

interface CareFlowViewProps {
  currentLanguage: Language;
  onPageChange: (page: PageView) => void;
  onDecisionCompleted?: () => void;
}

interface PathRecord {
  nodeId: string;
  chosenOptionLabel?: Record<Language, string>;
}

export const CareFlowView: React.FC<CareFlowViewProps> = ({
  currentLanguage,
  onPageChange,
  onDecisionCompleted,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<CareFlowScenario>(CAREFLOW_SCENARIOS[0]);
  const [history, setHistory] = useState<PathRecord[]>([
    { nodeId: CAREFLOW_SCENARIOS[0].startNodeId },
  ]);
  const [showPathDiagram, setShowPathDiagram] = useState<boolean>(false);

  const currentRecord = history[history.length - 1];
  const currentNode = selectedScenario.nodes[currentRecord.nodeId];
  const isTerminal = !currentNode.options || currentNode.options.length === 0;

  const handleSelectScenario = (scenario: CareFlowScenario) => {
    setSelectedScenario(scenario);
    setHistory([{ nodeId: scenario.startNodeId }]);
  };

  const handleChooseOption = (option: NonNullable<typeof currentNode.options>[number]) => {
    const updatedPrev: PathRecord = {
      ...currentRecord,
      chosenOptionLabel: option.label,
    };
    const nextHistory = [...history.slice(0, -1), updatedPrev, { nodeId: option.nextNodeId }];
    setHistory(nextHistory);

    const nextNode = selectedScenario.nodes[option.nextNodeId];
    if (!nextNode.options || nextNode.options.length === 0) {
      onDecisionCompleted?.();
    }
  };

  const handleBack = () => {
    if (history.length <= 1) return;
    const sliced = history.slice(0, -1);
    const last = { nodeId: sliced[sliced.length - 1].nodeId };
    setHistory([...sliced.slice(0, -1), last]);
  };

  const handleRestart = () => {
    setHistory([{ nodeId: selectedScenario.startNodeId }]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 soft-fade-up">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onPageChange('home')}
          className="compact-chip inline-flex items-center gap-2 text-sm font-semibold text-[#8F7242] hover:text-[#3C3330] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {currentLanguage === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ' : currentLanguage === 'te' ? 'హోమ్‌కు తిరిగి వెళ్ళండి' : 'Back to Home'}
          </span>
        </button>

        <span className="text-xs text-[#8F7242] font-medium">
          {currentLanguage === 'kn'
            ? 'ಸಂವಾದಾತ್ಮಕ ಆಸ್ಪತ್ರೆ ಮಾರ್ಗದರ್ಶಿ ಸಿಮ್ಯುಲೇಟರ್'
            : currentLanguage === 'te'
            ? 'ఇంటరాక్టివ్ హాస్పిటల్ డెసిషన్ సిమ్యులేటర్'
            : 'Interactive Navigation Decision Tree · Simulation'}
        </span>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#8F7242] uppercase tracking-wider inline-flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-[#BEA06D]" />
          <span>CORE CareFlow</span>
        </span>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C3330]">
          {currentLanguage === 'kn'
            ? 'ನಿರ್ಧಾರ-ವೃಕ್ಷ ಆಸ್ಪತ್ರೆ ಮಾರ್ಗದರ್ಶಿ'
            : currentLanguage === 'te'
            ? 'నిర్ణయ-వృక్ష ఆసుపత్రి మార్గదర్శి'
            : 'Hospital Navigation Decision Simulator'}
        </h1>
        <p className="text-sm sm:text-base text-[#3C3330]/80">
          {currentLanguage === 'kn'
            ? 'ಒಂದು ವಾಸ್ತವಿಕ ಸನ್ನಿವೇಶವನ್ನು ಆರಿಸಿ, ಹಂತ-ಹಂತವಾಗಿ ಉತ್ತರಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಆಯ್ಕೆಯ ಮಾರ್ಗವನ್ನು ನೋಡಿ.'
            : currentLanguage === 'te'
            ? 'ఒక వాస్తవిక పరిస్థితిని ఎంచుకుని, దశల వారీగా ఎంచుకున్న మార్గాన్ని చూడండి.'
            : 'Pick a real-world hospital challenge below to explore guided branching steps and visualize your decision path.'}
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CAREFLOW_SCENARIOS.map((sc) => {
          const active = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleSelectScenario(sc)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                active
                  ? 'bg-[#BEA06D] border-[#BEA06D] text-white shadow-md'
                  : 'bg-white border-[#BEA06D]/30 text-[#3C3330] hover:border-[#BEA06D]'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold leading-snug">
                {sc.title[currentLanguage]}
              </span>
              <span className={`text-[11px] ${active ? 'text-white/85' : 'text-[#8F7242]'}`}>
                {sc.subtitle[currentLanguage]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Branching Workspace */}
      <div className="bg-white border-2 border-[#BEA06D]/45 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Simulator Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BEA06D]/20 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8F7242] uppercase tracking-wider">
            <span>
              {currentLanguage === 'kn'
                ? `ಹಂತ ${history.length}`
                : currentLanguage === 'te'
                ? `దశ ${history.length}`
                : `Node ${history.length}`}
            </span>
            <span aria-hidden="true">·</span>
            <span>{selectedScenario.title[currentLanguage]}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={history.length <= 1}
              className="compact-chip px-3 py-1.5 rounded-full border border-[#BEA06D]/40 bg-[#FCF9F5] text-xs font-semibold text-[#3C3330] disabled:opacity-40 hover:bg-[#BEA06D]/15 inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'kn' ? 'ಹಿಂದೆ' : currentLanguage === 'te' ? 'వెనుకకు' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="compact-chip px-3 py-1.5 rounded-full border border-[#BEA06D]/40 bg-[#FCF9F5] text-xs font-semibold text-[#8F7242] hover:bg-[#BEA06D]/15 inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'kn' ? 'ಮರುಪ್ರಾರಂಭಿಸಿ' : currentLanguage === 'te' ? 'మళ్ళీ ప్రారంభించండి' : 'Restart'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPathDiagram(!showPathDiagram)}
              className={`compact-chip px-3.5 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                showPathDiagram
                  ? 'bg-[#4A6347] border-[#4A6347] text-white'
                  : 'bg-white border-[#BEA06D] text-[#8F7242] hover:bg-[#FCF9F5]'
              }`}
            >
              {showPathDiagram ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>
                {currentLanguage === 'kn'
                  ? 'ನನ್ನ ಮಾರ್ಗ ತೋರಿಸಿ'
                  : currentLanguage === 'te'
                  ? 'నా మార్గాన్ని చూపించు'
                  : 'Show My Path'}
              </span>
            </button>
          </div>
        </div>

        {/* Active Decision Node */}
        <div key={currentNode.id} className="space-y-5 soft-fade-up">
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3C3330]">
              {currentNode.title[currentLanguage]}
            </h2>
            <p className="text-base sm:text-lg font-medium text-[#3C3330]">
              {currentNode.prompt[currentLanguage]}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCF9F5] border border-[#BEA06D]/30 flex items-start gap-3 text-xs sm:text-sm text-[#3C3330]/85">
            <Info className="w-5 h-5 text-[#8F7242] shrink-0 mt-0.5" />
            <p>{currentNode.explanation[currentLanguage]}</p>
          </div>

          {/* Branch Options OR Terminal Outcome */}
          {!isTerminal && currentNode.options ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {currentNode.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleChooseOption(opt)}
                  className="p-5 rounded-2xl border-2 border-[#BEA06D]/45 bg-[#FCF9F5] hover:bg-[#BEA06D]/15 hover:border-[#BEA06D] text-left transition-all flex items-center justify-between gap-4 cursor-pointer botanical-card-hover"
                >
                  <span className="text-sm sm:text-base font-bold text-[#3C3330]">
                    {opt.label[currentLanguage]}
                  </span>
                  <ArrowRight className="w-5 h-5 text-[#8F7242] shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#A2B29B]/15 border-2 border-[#4A6347]/50 space-y-4 soft-fade-up">
              <div className="flex items-center gap-2 text-[#4A6347] font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {currentLanguage === 'kn'
                    ? 'ಮಾರ್ಗದರ್ಶಿ ಫಲಿತಾಂಶ ಸಿದ್ಧವಾಗಿದೆ'
                    : currentLanguage === 'te'
                    ? 'మార్గదర్శక ఫలితం సిద్ధమైంది'
                    : 'Recommended Navigation Step Reached'}
                </span>
              </div>

              {currentNode.recommendedPage && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onPageChange(currentNode.recommendedPage!)}
                    className="py-3 px-6 rounded-full bg-[#4A6347] hover:bg-[#384d36] text-white font-bold text-sm inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>{currentNode.recommendedLabel?.[currentLanguage]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPathDiagram(true)}
                    className="py-3 px-5 rounded-full bg-white border border-[#4A6347]/40 text-[#4A6347] font-semibold text-sm cursor-pointer"
                  >
                    {currentLanguage === 'kn'
                      ? 'ನಾನು ಸಾಗಿದ ಮಾರ್ಗ ನೋಡಿ'
                      : currentLanguage === 'te'
                      ? 'నేను వెళ్ళిన మార్గం చూడండి'
                      : 'Visualize My Decision Path'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Connected Flowchart Path Visualizer */}
        {showPathDiagram && (
          <div className="pt-6 border-t-2 border-[#BEA06D]/25 space-y-4 soft-fade-up">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-[#3C3330]">
                {currentLanguage === 'kn'
                  ? 'ನಿಮ್ಮ ನಿರ್ಧಾರ ಪಥ (Decision Route Map)'
                  : currentLanguage === 'te'
                  ? 'మీరు ఎంచుకున్న నిర్ణయ మార్గం'
                  : 'Your Visual Decision Path'}
              </h3>
              <span className="text-xs text-[#8F7242] font-semibold">
                {history.length} {currentLanguage === 'kn' ? 'ಹಂತಗಳು' : currentLanguage === 'te' ? 'దశలు' : 'nodes visited'}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {history.map((item, idx) => {
                const node = selectedScenario.nodes[item.nodeId];
                const isLast = idx === history.length - 1;
                return (
                  <div key={`${item.nodeId}-${idx}`} className="flex flex-col items-start">
                    <div
                      className={`w-full p-4 rounded-2xl border-2 ${
                        isLast
                          ? 'bg-[#FCF9F5] border-[#4A6347]'
                          : 'bg-white border-[#BEA06D]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#BEA06D] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-sm sm:text-base text-[#3C3330]">
                          {node.title[currentLanguage]}
                        </span>
                      </div>
                      <p className="text-xs text-[#3C3330]/75 mt-1 pl-9">
                        {node.explanation[currentLanguage]}
                      </p>
                    </div>

                    {item.chosenOptionLabel && (
                      <div className="pl-7 py-2 flex items-center gap-2 text-xs font-semibold text-[#8F7242]">
                        <div className="w-0.5 h-6 bg-[#BEA06D]" />
                        <span className="px-3 py-1 rounded-full bg-[#E6C1C4]/30 border border-[#C98897]/40 text-[#3C3330]">
                          ↳ {item.chosenOptionLabel[currentLanguage]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
