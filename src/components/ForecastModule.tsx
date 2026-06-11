import React, { useState } from "react";
import { 
  TrendingUp, 
  AlertTriangle, 
  ChevronDown, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Cpu, 
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

// 12 Rolling Months Forecast Data for 2025-2026 (Actual vs Predicted with Confidence bands)
const FORECAST_DATA = [
  { month: "Jan 25", actual: 120, forecast: 120, low: 110, high: 130 },
  { month: "Fév 25", actual: 140, forecast: 135, low: 120, high: 150 },
  { month: "Mar 25", actual: 180, forecast: 175, low: 155, high: 195 },
  { month: "Avr 25", actual: 165, forecast: 160, low: 140, high: 180 },
  { month: "Mai 25", actual: null, forecast: 210, low: 190, high: 230 },
  { month: "Jun 25", actual: null, forecast: 245, low: 220, high: 270 },
  { month: "Jul 25", actual: null, forecast: 190, low: 170, high: 210 },
  { month: "Aoû 25", actual: null, forecast: 115, low: 95, high: 135 },
  { month: "Sep 25", actual: null, forecast: 180, low: 160, high: 200 },
  { month: "Oct 25", actual: null, forecast: 240, low: 215, high: 265 },
  { month: "Nov 25", actual: null, forecast: 380, low: 340, high: 420 }, // Peak
  { month: "Déc 25", actual: null, forecast: 420, low: 370, high: 470 }  // Peak
];

const SECTOR_REFERENCE_PRICES = [
  { category: "Aménagement d'espaces verts (par Hectare)", refPrice: "185 000 MAD", range: "120k - 250k", trend: "up", count: 42 },
  { category: "Licence ERP Cloud (par usager/an)", refPrice: "8 400 MAD", range: "7.2k - 9.8k", trend: "down", count: 89 },
  { category: "Bitume routier standard AC20 (par Tonne)", refPrice: "12 500 MAD", range: "11k - 14k", trend: "up", count: 124 },
  { category: "Masque chirurgical chirurgical (Carton de 1000)", refPrice: "650 MAD", range: "580 - 720", trend: "flat", count: 210 },
  { category: "PC portable bureautique i5 (par unité)", refPrice: "6 800 MAD", range: "6k - 7.5k", trend: "down", count: 340 }
];

// Heatmap months matrix
const MONTHS_HEATMAP = [
  { name: "Jan", label: "يناير", btp: "optimal", tech: "optimal", medical: "congested" },
  { name: "Fév", label: "فبراير", btp: "optimal", tech: "optimal", medical: "optimal" },
  { name: "Mar", label: "مارس", btp: "optimal", tech: "congested", medical: "congested" },
  { name: "Avr", label: "أبريل", btp: "congested", tech: "optimal", medical: "optimal" },
  { name: "Mai", label: "ماي", btp: "optimal", tech: "optimal", medical: "optimal" },
  { name: "Jun", label: "يونيو", btp: "congested", tech: "congested", medical: "optimal" },
  { name: "Jul", label: "يوليوز", btp: "optimal", tech: "congested", medical: "optimal" },
  { name: "Aug", label: "غشت", btp: "congested", tech: "optimal", medical: "optimal" },
  { name: "Sep", label: "شتنبر", btp: "optimal", tech: "optimal", medical: "congested" },
  { name: "Oct", label: "أكتوبر", btp: "optimal", tech: "optimal", medical: "optimal" },
  { name: "Nov", label: "نونبر", btp: "congested", tech: "congested", medical: "congested" }, // Peak congestion
  { name: "Dec", label: "دجنبر", btp: "congested", tech: "congested", medical: "congested" }  // Peak congestion
];

export default function ForecastModule() {
  const [selectedMinistry, setSelectedMinistry] = useState<string>("sante");
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  const getHeatmapColor = (status: string) => {
    return status === "optimal" 
      ? "bg-[#2D6A4F]/25 border-[#2D6A4F]/50 text-[#2D6A4F]" 
      : "bg-[#C1121F]/15 border-[#C1121F]/30 text-[#C1121F]";
  };

  return (
    <div className="space-y-6" id="forecast-budgets-container">
      
      {/* Header with predictive badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Prévision & Optimisation Budgétaire
            </h2>
            <span className="bg-[#D4A017]/15 text-[#D4A017] border border-[#D4A017]/40 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#D4A017]" /> MOTEUR PRÉDICTIF PROPHET
            </span>
          </div>
          <h3 className="text-xs text-neutral-400 mt-1 leading-relaxed">
            محرك التوقعات والتحكم في النفقات الاستباقي لتلافي فترات الضغط والازدحام التمويلي
          </h3>
        </div>

        {/* Filters and selectors */}
        <div className="flex items-center gap-2.5">
          <select 
            value={selectedMinistry} 
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="bg-[#111] border border-white/5 rounded-lg py-2 px-3 text-xs outline-none focus:border-[#C1121F] text-neutral-300"
          >
            <option value="sante">Ministère de la Santé / الصحة</option>
            <option value="education">Ministère de l'Éducation / التعليم</option>
            <option value="transports">Ministère des Transports / النقل</option>
            <option value="mef">Ministère des Finances / المالية</option>
          </select>

          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-[#111] border border-white/5 rounded-lg py-2 px-3 text-xs outline-none focus:border-[#C1121F] text-neutral-300 font-mono"
          >
            <option value="2025">Année 2025</option>
            <option value="2026">Année 2026</option>
          </select>
        </div>
      </div>

      {/* Main visualization area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Previsions volumes AREA Chart (60%) */}
        <div className="lg:col-span-3 bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between h-[380px] relative">
          
          <div className="mb-3 flex justify-between items-start">
            <div>
              <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-widest font-mono">
                Prévision des Volumes d'Achat (2025-2026)
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Valeurs mensuelles de passations planifiées par lot d'agrément (En M MAD)</p>
            </div>
            
            {/* Warning peak Annotation directly positioned */}
            <div className="flex items-center gap-1.5 bg-[#C1121F]/10 border border-[#C1121F]/30 p-1.5 rounded-lg animate-pulse text-[9px] text-[#C1121F]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Saisonnalité : Pic suspect prévu en Novembre</span>
            </div>
          </div>

          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  {/* Confidence Interval gradient */}
                  <linearGradient id="confidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40916C" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#40916C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#888" }} />
                <YAxis tick={{ fontSize: 9, fill: "#888" }} />
                <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px" }} />
                
                {/* Simulated Confidence Interval band using Area hack */}
                <Area type="monotone" dataKey="high" stroke="transparent" fill="url(#confidenceGrad)" fillOpacity={1} name="Fourchette Haute" />
                <Area type="monotone" dataKey="low" stroke="transparent" fill="transparent" name="Fourchette Basse" />

                <Area type="monotone" dataKey="actual" stroke="#D4A017" strokeWidth="2.5" fill="none" name="Historique Réel" strokeLinecap="round" />
                <Area type="monotone" dataKey="forecast" stroke="#C1121F" strokeWidth="2" strokeDasharray="4,4" fill="none" name="Prévision IA (XGBoost)" />
                
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px", paddingTop: "5px" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: reference prices table (40%) */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="border-b border-white/5 pb-2">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-200">
              🏷️ Observatoire National des Prix de Référence
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Calculé automatiquement par scraping des BPU déposés</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[260px] dark-scrollbar mt-3">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-900/60 text-neutral-500 font-mono text-[9px] uppercase border-b border-white/5">
                  <th className="p-2.5">Catégorie</th>
                  <th className="p-2.5">Index Moyen</th>
                  <th className="p-2.5">Tendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {SECTOR_REFERENCE_PRICES.map((p, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01]">
                    <td className="p-2.5 font-semibold text-neutral-300">
                      <div>{p.category}</div>
                      <div className="text-[9px] text-neutral-500 font-mono mt-0.5">Échantillon: {p.count} marchés</div>
                    </td>
                    <td className="p-2.5 font-mono text-neutral-200">
                      <div className="font-bold text-[#D4A017]">{p.refPrice}</div>
                      <div className="text-[9px] text-neutral-500">Gamme: {p.range}</div>
                    </td>
                    <td className="p-2.5">
                      {p.trend === "up" ? (
                        <span className="text-red-500 font-mono text-[10px] flex items-center gap-0.5">
                          <ArrowUp className="w-3.5 h-3.5" /> +5.4%
                        </span>
                      ) : p.trend === "down" ? (
                        <span className="text-emerald-500 font-mono text-[10px] flex items-center gap-0.5">
                          <ArrowDown className="w-3.5 h-3.5" /> -3.2%
                        </span>
                      ) : (
                        <span className="text-neutral-500 font-mono text-[10px]">Stable</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bottom Row matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Under-execution alerts and annotations (40%) */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 md:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
              Alertes de Consommation MEF
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Alertes critiques émises par le Ministère de l'Économie et des Finances</p>
          </div>

          <div className="space-y-3.5 my-4">
            <div className="p-3.5 bg-[#C1121F]/5 border border-[#C1121F]/20 rounded-lg flex gap-3">
              <AlertTriangle className="w-4 h-4 text-[#C1121F] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-red-400 font-bold">SOUS-EXÉCUTION CLINIQUE</span>
                <p className="text-[11px] text-neutral-300 leading-normal mt-1">
                  Ministère de la Santé : 234M MAD non engagés à fin Octobre. Risque de perte d'imputation financière pour la région Souss-Massa.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-yellow-950/10 border border-yellow-905/20 rounded-lg flex gap-3">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold">Régulation Calendaire</span>
                <p className="text-[11px] text-neutral-300 leading-normal mt-1">
                  Recommandation : Reporter les lancements technologiques ADD de Novembre à Janvier pour éviter l'asphyxie logistique de fin d'année.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-neutral-500 flex justify-between">
            <span>Optimisation : MPI calendar-engine v2</span>
            <span>Royaume du Maroc</span>
          </div>
        </div>

        {/* Heatmap calendar visualizer (60%) */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 md:col-span-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
              Calendrier d'Émission Optimal (Congestion Heatmap)
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Périodes recommandées pour lancer les appels d'offres (Vert = Optimal, Rouge = Surchargé)</p>
          </div>

          {/* Grid heatmap */}
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 my-4">
            {MONTHS_HEATMAP.map((m, idx) => {
              const btpGrad = getHeatmapColor(m.btp);
              const techGrad = getHeatmapColor(m.tech);
              const medGrad = getHeatmapColor(m.medical);

              return (
                <div 
                  key={idx} 
                  className="bg-white/[0.01] border border-white/5 p-2 rounded flex flex-col items-center justify-between space-y-2 hover:border-white/10 transition-all"
                >
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-neutral-200">{m.name}</div>
                    <div className="text-[8px] text-neutral-500 mt-0.5 font-serif">{m.label}</div>
                  </div>
                  
                  {/* Micro lines for sectors */}
                  <div className="w-full space-y-1">
                    <div 
                      className={`h-3 w-full rounded border flex items-center justify-center text-[7px] font-mono ${btpGrad}`}
                      title="Secteur BTP"
                    >
                      BTP
                    </div>
                    <div 
                      className={`h-3 w-full rounded border flex items-center justify-center text-[7px] font-mono ${techGrad}`}
                      title="Secteur TECH"
                    >
                      TEC
                    </div>
                    <div 
                      className={`h-3 w-full rounded border flex items-center justify-center text-[7px] font-mono ${medGrad}`}
                      title="Secteur MEDICAL"
                    >
                      MED
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[9px] font-mono text-neutral-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-[#2D6A4F]/25 border border-[#2D6A4F]/50" />
              <span>Optimal (Peu de concurrence, délais légaux dilatés)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-[#C1121F]/15 border border-[#C1121F]/30" />
              <span>Saturé (Goulot d'étranglement de fin d'exercice fiscal)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
