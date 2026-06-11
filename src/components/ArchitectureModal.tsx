import React from "react";
import { Cpu, ShieldCheck, Database, FileCode, Users, Layers, Activity } from "lucide-react";

interface ComponentEntry {
  module: string;
  moduleAr: string;
  technologies: string[];
  description: string;
  accuracyMetric: string;
  sovereignBenefit: string;
}

const AI_COMPONENTS: ComponentEntry[] = [
  {
    module: "1. Détection d'Anomalies (SDA-MP)",
    moduleAr: "كشف المعايير غير الاعتيادية",
    technologies: ["Isolation Forest", "Bi-LSTM Temporal Autoencoder", "NetworkX (OMPIC Multi-graph Link Analysis)"],
    description: "Analyse statistique multidimensionnelle des offres et structures de cotations pour identifier les ententes illicites (collusion), le dumping prédateur et le favoritisme.",
    accuracyMetric: "94.8% Précision (F1-Score)",
    sovereignBenefit: "Protection de l'argent public et limitation automatique des cartels d'adjudication."
  },
  {
    module: "2. Analyse NLP des Cahiers des Charges (CPS)",
    moduleAr: "التحليل الذكي لدفاتر الشروط",
    technologies: ["AraBERT (Arabic LLM fine-tuned)", "CamemBERT-Procure (French Legal models)", "Sentence-Transformers"],
    description: "Extraction automatique de clauses d'éligibilité, des budgets et de critères techniques pour repérer les barrières d'accès non réglementaires réservées à des initiés.",
    accuracyMetric: "91.2% Précision d'extraction des critères",
    sovereignBenefit: "Garantit le strict respect de l'Allotissement National de 30% décrété pour les PME."
  },
  {
    module: "3. Appariement Intelligent PME/TPE",
    moduleAr: "مطابقة المقاولات الصغرى والمتوسطة",
    technologies: ["Collaborative Filtering", "TF-IDF Hybrid Recommendation System", "HCP Sector Taxonomic Taxonomy"],
    description: "Système de recommandation personnalisé d'appels d'offres locaux et d'opportunités de co-traitance basé sur la capacité financière courante de l'entreprise et son historique d'agréments.",
    accuracyMetric: "88.5% Taux de pertinence métier",
    sovereignBenefit: "Intégration optimale du secteur privé marocain au tissu économique de l'État."
  },
  {
    module: "4. Prévision & Optimisation Budgétaire",
    moduleAr: "التوقعات والميزانية التنبؤية",
    technologies: ["Facebook Prophet (Saisonnalité des AOs)", "XGBoost Regressor", "MOTEUR PREDICTIF MPI-v2"],
    description: "Prévision des volumes d'achat par ministères, détection de congestion temporelle (pic d'appels d'offres fin d'année) et recommandation de calendrier d'émissions.",
    accuracyMetric: "±4.2% Écart d'erreur de budget annuel",
    sovereignBenefit: "Lissage budgétaire souverain et élimination du gaspillage de fin d'exercice fiscal."
  },
  {
    module: "5. Portail Open-Data Citoyen",
    moduleAr: "بوابة المواطن للبيانات المفتوحة",
    technologies: ["D3.js Global Visualizer", "Recharts Graphics Core", "Apache Spark Big Data Aggregator Client"],
    description: "Registre de transparence nationale avec calcul dynamique de l'Indicateur Régional d'Intégrité de la Commande Publique (IRICP) accessible au grand public.",
    accuracyMetric: "Temps réel (Pipeline chiffré)",
    sovereignBenefit: "Consolidation du contrat de confiance national et valorisation de la transparence marocaine."
  }
];

export default function ArchitectureModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="mpi-architecture-modal">
      <div className="bg-[#111] border border-red-900/30 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-[0_20px_50px_rgba(193,12,31,0.15)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-red-950/20 to-emerald-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#C1121F]/20 to-[#2D6A4F]/20 border border-white/10 rounded-lg">
              <Cpu className="w-6 h-6 text-[#D4A017] animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-100 tracking-tight flex items-center gap-2">
                Sovereign Tech Framework / البنية التقنية السيادية للمنصة
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Spécifications techniques des 5 modules d'intelligence artificielle intégrés à l'infrastructure MPI
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-white bg-neutral-800 hover:bg-[#C1121F] px-3 py-1.5 rounded-lg text-xs font-mono transition-all uppercase"
          >
            Fermer / إغلاق
          </button>
        </div>

        {/* Scrollable specs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 dark-scrollbar">
          
          {/* Mission statement */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">MPI (Maroc Procurement Intelligence)</strong> est architecturé comme une infrastructure souveraine hébergée localement sur des serveurs Cloud étatiques marocains. Elle combine des modèles d'Apprentissage Machine supervisés pour la prédiction analytique et des modèles de Deep Learning spécialisés dans le traitement législatif arabe et français.
            </div>
          </div>

          {/* Grid architecture */}
          <div className="border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-900 text-neutral-400 font-mono text-[10px] uppercase border-b border-white/5">
                  <th className="p-4">Module IA & Traduction</th>
                  <th className="p-4">Moteurs et Modèles Algorithmiques</th>
                  <th className="p-4">Finalité & Mission</th>
                  <th className="p-4 text-center">Performance Validée</th>
                  <th className="p-4 text-right">Intérêt Souverain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {AI_COMPONENTS.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                    {/* Module Title */}
                    <td className="p-4 font-bold text-neutral-100 min-w-[200px]">
                      <div>{comp.module}</div>
                      <div className="text-[10px] text-neutral-500 font-normal mt-0.5" dir="rtl">
                        {comp.moduleAr}
                      </div>
                    </td>

                    {/* Technologies tags */}
                    <td className="p-4 font-mono text-[10px]">
                      <div className="flex flex-wrap gap-1">
                        {comp.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="bg-neutral-800 text-[#D4A017] px-2 py-0.5 rounded border border-white/5">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="p-4 text-neutral-300 leading-relaxed max-w-[280px]">
                      {comp.description}
                    </td>

                    {/* Acc Metric */}
                    <td className="p-4 text-center font-mono font-bold text-emerald-400">
                      {comp.accuracyMetric}
                    </td>

                    {/* Sovereign Benefit */}
                    <td className="p-4 text-right text-neutral-400 italic max-w-[200px]">
                      {comp.sovereignBenefit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tech stack stack items icons summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg flex items-center gap-3">
              <Database className="w-5 h-5 text-neutral-500" />
              <div>
                <h4 className="text-xs font-semibold text-neutral-300">Base de Données</h4>
                <p className="text-[10px] text-neutral-500 font-mono">Cloud SQL & BigQuery</p>
              </div>
            </div>
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg flex items-center gap-3">
              <FileCode className="w-5 h-5 text-neutral-500" />
              <div>
                <h4 className="text-xs font-semibold text-neutral-300">Framework NLP</h4>
                <p className="text-[10px] text-neutral-500 font-mono">Hugging Face AraBERT</p>
              </div>
            </div>
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg flex items-center gap-3">
              <Users className="w-5 h-5 text-neutral-500" />
              <div>
                <h4 className="text-xs font-semibold text-neutral-300">Open Data Standard</h4>
                <p className="text-[10px] text-neutral-500 font-mono">OCDS JSON Standard</p>
              </div>
            </div>
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg flex items-center gap-3">
              <Activity className="w-5 h-5 text-neutral-500" />
              <div>
                <h4 className="text-xs font-semibold text-neutral-300">Monitoring Sécurité</h4>
                <p className="text-[10px] text-neutral-500 font-mono">Chiffrement AES-GCM-256</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/60 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>Dernier audit des modèles : Juin 2026</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]" />
            CONFORME RECOMMANDATIONS OCDE ET DECRET 2-22-431
          </span>
        </div>

      </div>
    </div>
  );
}
