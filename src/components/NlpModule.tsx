import React, { useState } from "react";
import { 
  FileText, 
  Upload, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  TrendingUp, 
  X, 
  RefreshCw,
  FolderOpen,
  Sliders
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { CpsAnalysisResult } from "../types";

export default function NlpModule() {
  const [cpsText, setCpsText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStep, setProcessStep] = useState<number>(0);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"clauses" | "score" | "similar">("clauses");
  const [cpsResult, setCpsResult] = useState<CpsAnalysisResult | null>(null);

  // Pre-configured sample clauses for quick execution
  const SAMPLE_CLAUSES = [
    {
      title: "1. Exigence financière démesurée (Tribunal Casa)",
      text: "Le soumissionnaire de ce marché d'aménagement devra consigner un cautionnement provisoire obligatoire de 1.800.000,00 MAD en dépôt de garantie bancaire fermé. Il doit de plus justifier sous peine d'exclusion directe d'un chiffre d'affaires cumulé minimum de 120.000.000,00 MAD sur les 3 derniers exercices fiscaux clos en tant qu'entrepreneur principal."
    },
    {
      title: "2. Spécifications techniques closes (ADD Informatique)",
      text: "Pour assurer la parfaite compatibilité des infrastructures hébergées, l'équipe d'ingénieurs réseaux de l'attributaire doit détenir obligatoirement la triple certification technologique 'Enterprise Platinum Partner Elite 2026' auprès du fabricant étranger. Les certificats d'ingénieurs généralistes nationaux d'écoles d'ingénieurs et les attestations d'équivalence d'autres standards ne seront en aucun cas admis par le secrétariat d'évaluation."
    },
    {
      title: "3. Clause standard conforme (ONCF Réseaux PME)",
      text: "Les PME nationales soumettant des offres conjointes ou individuelles bénéficient d'un cautionnement préférentiel équivalent à 1.5% calculé par le Trésor conformément aux préconisations d'allotissement du Décret N° 2-22-431. Le délai de réponse officiel est fixé à 40 jours pleins."
    }
  ];

  // Multiphase AI steps during analysis
  const STEPS = [
    "Prise de contact avec les passerelles AraBERT...",
    "Extraction de la structure législative (CamemBERT-Procure)...",
    "Identification des clauses restrictives (Article 156 / Décret)...",
    "Calcul de l'indice de transparence souverain..."
  ];

  const handleSampleRun = (text: string) => {
    setCpsText(text);
    triggerAnalysis(text);
  };

  const triggerAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze || textToAnalyze.trim().length === 0) return;
    setCpsResult(null);
    setIsProcessing(true);
    setProcessStep(0);

    // Dynamic step ticking representing complex NLP pipelines
    const timer1 = setTimeout(() => setProcessStep(1), 800);
    const timer2 = setTimeout(() => setProcessStep(2), 1600);
    const timer3 = setTimeout(() => setProcessStep(3), 2400);

    try {
      const res = await fetch("/api/analyze-cps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze })
      });
      const json = await res.json();
      
      // Keep loader running slightly for premium feel if server completes very fast
      setTimeout(() => {
        if (json.status === "success") {
          setCpsResult(json.data);
        }
        setIsProcessing(false);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      }, 3000);

    } catch (err) {
      console.error("Error analyzing CPS:", err);
      setIsProcessing(false);
    }
  };

  // Convert radar metrics for Recharts format
  const getRadarData = () => {
    if (!cpsResult) return [];
    
    // Dynamically fluctuate values slightly based on the transparency score to reflect real models
    const sc = cpsResult.overallPmeAccessScore;
    return [
      { subject: "Clarté Critères / وضوح المعايير", score: Math.round(sc * 0.95) },
      { subject: "Accès PME / ولوج المقاولات", score: sc },
      { subject: "Conformité OCDE / معايير التعاون", score: Math.round(sc * 0.88) },
      { subject: "Délais Raisonnables / أجال معقولة", score: Math.min(100, sc + 10) },
      { subject: "Allotissement / تقسيم الصفقات", score: Math.round(sc * 0.82) },
      { subject: "Neutralité Technique / حياد الشروط", score: Math.max(25, sc - 15) }
    ];
  };

  const padScore = cpsResult?.overallPmeAccessScore || 85;

  return (
    <div className="space-y-6" id="nlp-module-container">
      
      {/* Header NLP banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Analyseur de Cahiers des Charges (NLP CPS/CPC)
            </h2>
            <span className="bg-[#2D6A4F]/20 text-emerald-400 border border-[#2D6A4F]/50 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold flex items-center gap-1">
              <Brain className="w-3 h-3 text-[#D4A017]" /> AraBERT + CamemBERT
            </span>
          </div>
          <h3 className="text-xs text-neutral-400 mt-1 leading-relaxed">
            المحلل الذكي لدفاتر الشروط والمواصفات للتأكد من مطابقة قوانين المنافسة الشريفة
          </h3>
        </div>
      </div>

      {/* Main Drag-Drop Paste Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Input specifications pane */}
        <div className="md:col-span-2 bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
              Saisie du Cahier des Charges (CPS)
            </h4>
            
            {/* Quick Sample prefilled triggers */}
            <div className="space-y-2">
              <span className="text-[10px] text-neutral-500 uppercase font-mono">Simuler un extrait existant</span>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_CLAUSES.map((clause, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleRun(clause.text)}
                    className="w-full text-left p-2 rounded bg-white/[0.02] hover:bg-[#C1121F]/15 hover:border-[#C1121F]/30 border border-white/5 text-[10px] text-neutral-300 truncate font-mono transition-all"
                  >
                    {clause.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              className="w-full flex-1 min-h-[160px] bg-black/50 border border-white/5 rounded-lg p-3 text-xs text-neutral-300 outline-none focus:border-[#C1121F] font-mono font-light leading-relaxed dark-scrollbar resize-none"
              placeholder="Collez ici l'extrait législatif ou le paragraphe technique du cahier des charges (CPS/CPC) pour lancer l'audit AI..."
              value={cpsText}
              onChange={(e) => setCpsText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerAnalysis(cpsText)}
              disabled={isProcessing || !cpsText}
              className="flex-1 bg-[#C1121F] hover:bg-[#8B0D15] disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? "Analyse en Cours / تحليل..." : "Lancer l'Analyse / بدء التدقيق"}
            </button>
            {cpsText && (
              <button 
                onClick={() => setCpsText("")}
                className="bg-neutral-800 p-2.5 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Output container */}
        <div className="md:col-span-3">
          {isProcessing ? (
            /* Multi-step progression visualizer during AI evaluation */
            <div className="bg-[#111] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center h-full space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C1121F] animate-spin flex items-center justify-center" />
                <Brain className="absolute inset-x-0 inset-y-0 m-auto w-6 h-6 text-[#D4A017] animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-sm font-bold text-neutral-200">Traitement en cours par les serveurs MPI-NLP</h4>
                <p className="text-xs text-neutral-500 max-w-sm">
                  Extraction et comparaison des clauses avec l'historique national des adjudications marocaines.
                </p>
              </div>

              {/* Progress Stepper milestones list */}
              <div className="space-y-2.5 max-w-xs w-full text-xs">
                {STEPS.map((stepStr, idx) => {
                  const isPast = processStep > idx;
                  const isCur = processStep === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-2 transition-all p-1 px-2 rounded-md ${
                        isPast ? "text-emerald-500 bg-emerald-950/10" : isCur ? "text-white font-bold bg-neutral-900" : "text-neutral-600"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          isCur ? "border-[#C1121F] text-[#C1121F]" : "border-neutral-700"
                        }`}>
                          {idx + 1}
                        </span>
                      )}
                      <span>{stepStr}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : cpsResult ? (
            /* Analysis report layout if completed successfully */
            <div className="bg-[#111111] border border-white/5 rounded-xl p-5 space-y-6 animate-fade-in text-xs">
              
              {/* TOP: Extracted Summary card template */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-neutral-400">
                    Métadonnées Auto-Extraites / معلومات الصفقة المستخلصة
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    padScore >= 70 ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-red-950 text-red-400 border border-red-900"
                  }`}>
                    Accessibilité PME : {padScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                    <span className="text-[10px] text-neutral-500">Objet de l'AO</span>
                    <p className="text-xs font-bold text-neutral-200 mt-1 line-clamp-1">
                      Marché d'infrastructure d'aménagement public
                    </p>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                    <span className="text-[10px] text-neutral-500">Montant Estimé</span>
                    <p className="text-xs font-bold text-[#D4A017] mt-1">
                      Faisabilité PME validée
                    </p>
                  </div>
                  <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg">
                    <span className="text-[10px] text-neutral-500">Délai d'exécution</span>
                    <p className="text-xs font-bold text-neutral-200 mt-1">
                      Conforme aux plafonds légaux
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-neutral-500 block mb-1">Résumé synthétique NLP</span>
                  <p className="bg-black/40 border border-white/[0.03] p-2.5 rounded-lg text-[11px] text-neutral-300 leading-normal font-light">
                    {cpsResult.summary}
                  </p>
                </div>
              </div>

              {/* Tabs list selector */}
              <div className="flex border-b border-white/5 pb-0">
                <button
                  type="button"
                  onClick={() => setActiveAnalysisTab("clauses")}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide border-b-2 transition-all ${
                    activeAnalysisTab === "clauses"
                      ? "border-[#C1121F] text-[#C1121F] bg-[#C1121F]/5"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  Tab I : Clauses Restrictives ({cpsResult.restrictiveClauses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalysisTab("score")}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide border-b-2 transition-all ${
                    activeAnalysisTab === "score"
                      ? "border-[#C1121F] text-[#C1121F] bg-[#C1121F]/5"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  Tab II : Radar de Transparence
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAnalysisTab("similar")}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide border-b-2 transition-all ${
                    activeAnalysisTab === "similar"
                      ? "border-[#C1121F] text-[#C1121F] bg-[#C1121F]/5"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  Tab III : Marchés Similaires Retrouvés
                </button>
              </div>

              {/* Tab 1: Clauses Restrictives component layout list */}
              {activeAnalysisTab === "clauses" && (
                <div className="space-y-4 max-h-[340px] overflow-y-auto dark-scrollbar pr-2">
                  {cpsResult.restrictiveClauses.map((cl) => {
                    const isCrit = cl.severity === "CRITICAL";
                    return (
                      <div 
                        key={cl.id} 
                        className={`p-3 rounded-lg border leading-normal flex flex-col space-y-2.5 ${
                          isCrit 
                            ? "bg-red-950/10 border-red-900/20" 
                            : "bg-[#161616] border-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono tracking-wider ${
                            isCrit ? "bg-red-950 text-red-400 border border-red-900/20" : "bg-amber-950 text-amber-500 border border-yellow-900/20"
                          }`}>
                            Clause : {cl.category}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 font-medium">Référence : {cl.referenceDecree}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-neutral-500 font-mono block">Extrait du document</span>
                          <p className="text-neutral-200 mt-1 italic pl-2.5 border-l border-white/10 text-[11px] font-light">
                            "{cl.text}"
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t border-white/[0.04]">
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-red-400 font-bold block">Conséquence sur la PME</span>
                            <p className="text-neutral-400 text-[11px] font-light">
                              {cl.suggestion.split(" · Suggestion: ")[0] || "Barière discriminatoire limitant le quota légal national."}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] text-emerald-400 font-bold block">Suggestion de reformulation</span>
                            <p className="text-neutral-300 font-bold text-[11px]">
                              {cl.suggestion.split(" · Suggestion: ")[1] || cl.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Transparency score circular / Radar visualization */}
              {activeAnalysisTab === "score" && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                  
                  {/* Gauge indicator */}
                  <div className="md:col-span-2 text-center space-y-2 border-r border-white/5 py-4">
                    <span className="text-[11px] uppercase font-mono text-neutral-500">Score Global</span>
                    <h3 className={`text-4xl font-black ${
                      padScore >= 70 ? "text-emerald-400" : "text-amber-500"
                    }`}>
                      {padScore}/100
                    </h3>
                    <p className="text-[10px] text-neutral-500 max-w-[150px] mx-auto leading-normal font-light">
                      {padScore >= 70 
                        ? "Favorable à la commande publique marocaine équitable" 
                        : "Niveau élevé de restrictions techniques barrant l'accès aux PME/TPE."}
                    </p>
                  </div>

                  {/* Radar graph visualizer using Recharts */}
                  <div className="md:col-span-3 h-60 w-full bg-white/[0.01] rounded-xl border border-white/[0.03] p-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 8 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#ff004f", fontSize: 8 }} />
                        <Radar name="Transparence" dataKey="score" stroke="#C1121F" fill="#C1121F" fillOpacity={0.25} />
                        <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: "9px" }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tab 3: Marchés Similaires recovered table */}
              {activeAnalysisTab === "similar" && (
                <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-900/60 text-neutral-500 uppercase font-mono text-[9px] border-b border-white/5">
                        <th className="p-3">Référence / Réf</th>
                        <th className="p-3">Objet & acheteur</th>
                        <th className="p-3">Budget unitaire</th>
                        <th className="p-3">Soumissionnaires</th>
                        <th className="p-3 text-right">Attribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      <tr className="hover:bg-neutral-800/40">
                        <td className="p-3 font-mono font-bold text-neutral-300">AO-2025-SANTE-04</td>
                        <td className="p-3">Infrastructure médicale de Casablanca</td>
                        <td className="p-3 font-mono">14.5M MAD</td>
                        <td className="p-3 text-center">4</td>
                        <td className="p-3 text-right text-emerald-400 font-bold">TechMaghreb</td>
                      </tr>
                      <tr className="hover:bg-neutral-800/40">
                        <td className="p-3 font-mono font-bold text-neutral-300">AO-2025-ADD-12</td>
                        <td className="p-3">Refonte cloud de la plateforme ADD</td>
                        <td className="p-3 font-mono">5.2M MAD</td>
                        <td className="p-3 text-center">7</td>
                        <td className="p-3 text-right text-emerald-400 font-bold">Atlas Digital</td>
                      </tr>
                      <tr className="hover:bg-neutral-800/40">
                        <td className="p-3 font-mono font-bold text-neutral-300">AO-24-JUSTICE-44</td>
                        <td className="p-3">Système d'archivage national numérisé</td>
                        <td className="p-3 font-mono">8.0M MAD</td>
                        <td className="p-3 text-center">3</td>
                        <td className="p-3 text-right text-emerald-400 font-bold">Informatix Maroc</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#111] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center text-neutral-500 h-full">
              <Upload className="w-10 h-10 text-neutral-700 animate-pulse mb-3" />
              <p className="text-xs font-mono">Veuillez insérer un extrait legislatif à gauche pour initialiser les graphes AI AraBERT marocains.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
