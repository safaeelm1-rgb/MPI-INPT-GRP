import React, { useState } from "react";
import { 
  ShieldAlert, 
  TrendingUp, 
  Coins, 
  Users, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bell, 
  Search, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from "recharts";
import { BidAnomaly, MarketStats } from "../types";
import MoroccoMap from "./MoroccoMap";

interface DashboardProps {
  role: string;
  stats: MarketStats;
  anomalies: BidAnomaly[];
  onSelectAnomaly: (id: string) => void;
  onNavigateTab: (tab: string) => void;
  onSimulateClick: () => void;
}

// Recharts Sample Data for the 3 visual plots
const BUDGET_TREND_DATA = [
  { name: "Jan", engage: 650, realise: 520 },
  { name: "Fév", engage: 780, realise: 600 },
  { name: "Mar", engage: 950, realise: 810 },
  { name: "Avr", engage: 1100, realise: 940 },
  { name: "Mai", engage: 1450, realise: 1120 },
  { name: "Jun", engage: 1600, realise: 1350 },
  { name: "Jul", engage: 1200, realise: 1100 },
  { name: "Aoû", engage: 850, realise: 800 },
  { name: "Sep", engage: 1050, realise: 950 },
  { name: "Oct", engage: 1300, realise: 1180 },
  { name: "Nov", engage: 1800, realise: 1400 },
  { name: "Déc", engage: 2100, realise: 1750 }
];

const CONTRACT_TYPE_DATA = [
  { name: "Travaux / أشغال", value: 5800000000, color: "#C1121F" },
  { name: "Services / خدمات", value: 4300000000, color: "#2D6A4F" },
  { name: "Fournitures / توريدات", value: 2745000000, color: "#D4A017" }
];

const BUYER_ANOMALY_RANKING = [
  { name: "Santé", anomalies: 28, cost: 42, color: "#C1121F" },
  { name: "Éducation", anomalies: 22, cost: 25, color: "#D97706" },
  { name: "Équipement", anomalies: 19, cost: 34, color: "#D4A017" },
  { name: "ONEE", anomalies: 15, cost: 18, color: "#2D6A4F" },
  { name: "Justice", anomalies: 8, cost: 10, color: "#40916C" }
];

export default function Dashboard({ 
  role, 
  stats, 
  anomalies, 
  onSelectAnomaly, 
  onNavigateTab,
  onSimulateClick
}: DashboardProps) {

  const [regionFilter, setRegionFilter] = useState<string>("Toutes Régions");

  // Helper formatting values
  const formatMAD = (amount: number) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(2) + " Mds MAD";
    }
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + " M MAD";
    }
    return amount.toLocaleString() + " MAD";
  };

  const getRoleBadge = () => {
    switch(role) {
      case "acheteur":
        return { name: "Bureau Acheteur Public / المشتري العمومي", color: "border-[#C1121F] bg-[#C1121F]/10 text-[#C1121F]" };
      case "pme":
        return { name: "Profil PME Nationale / المقاولات الصغرى", color: "border-[#2D6A4F] bg-[#2D6A4F]/10 text-emerald-400" };
      case "controleur":
        return { name: "Auditeur Transparence / المفتش العام", color: "border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]" };
      default:
        return { name: "Citoyen (Accès Ouvert) / بوابة المواطن", color: "border-neutral-700 bg-neutral-900 text-neutral-300" };
    }
  };

  const activeRoleBadge = getRoleBadge();

  return (
    <div className="space-y-6" id="mpi-dashboard-mission-control">
      
      {/* Adaptative header card */}
      <div className="p-5 bg-gradient-to-r from-red-950/20 via-neutral-900 to-emerald-950/15 border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border ${activeRoleBadge.color}`}>
              {activeRoleBadge.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#20bf6b] animate-ping" />
          </div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight mt-1.5 flex items-center gap-2">
            Mission Control Central / مركز البيانات الوطني
            {role === "acheteur" && <span className="text-xs font-normal text-amber-500 font-mono">(Session Active / الدورة النشطة)</span>}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cartographie des risques, intégrité nationale et optimisation de l'accès PME
          </p>
        </div>

        {/* Call to Actions based on specific roles */}
        <div className="flex flex-wrap items-center gap-2.5">
          {role === "acheteur" && (
            <button 
              onClick={onSimulateClick} 
              className="bg-[#C1121F] hover:bg-[#8B0D15] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              Simuler Alerte / اختبار محاكاة
            </button>
          )}
          {role === "pme" && (
            <button 
              onClick={() => onNavigateTab("pme")} 
              className="bg-[#2D6A4F] hover:bg-[#1e4634] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              Postuler Marchés / البحث عن صفقات
            </button>
          )}
          {role === "controleur" && (
            <button 
              onClick={() => onNavigateTab("notifications")} 
              className="bg-[#D4A017] hover:bg-[#aa8012] text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Saisines IGAT ({anomalies.filter(a => a.status === "CRITICAL").length})
            </button>
          )}
          <button 
            onClick={() => window.open("/api/stats", "_blank")} 
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2"
          >
            Export API <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Top row: 5 live KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* KPI 1 : Active Markets */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase">Marchés Actifs / صفقات نشطة</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-neutral-100 tracking-tight">
              {stats.totalBidsAnalyzed}
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs an-1</span>
            </div>
          </div>
        </div>

        {/* KPI 2 : Committed Budget */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase">Budget Engagé / صفقات عمومية</span>
            <Coins className="w-4 h-4 text-[#D4A017]" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-[#D4A017] tracking-tight">
              {formatMAD(stats.totalBudgetMAD).split(" ")[0]} <span className="text-xs font-normal">Mds MAD</span>
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Souveraineté</span>
            </div>
          </div>
        </div>

        {/* KPI 3 : Anomalies Count (With Red Pulse Alert) */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase">Anomalies / تنبيه المخاطر</span>
            <span className="w-2 h-2 rounded-full bg-[#C1121F] animate-ping" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-[#C1121F] tracking-tight flex items-baseline gap-1.5">
              {stats.anomaliesDetectedCount}
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/40 text-[#C1121F] border border-red-900/15">SDA</span>
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>9 requièrent examen critique</span>
            </div>
          </div>
        </div>

        {/* KPI 4 : Execution Rate */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase">Exécution Budgétaire / نسبة الإنجاز</span>
            <TrendingUp className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-neutral-100 tracking-tight">
              74.8%
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1">
              <ArrowDownRight className="w-3 h-3" />
              <span>-1.5% pic saisonnier</span>
            </div>
          </div>
        </div>

        {/* KPI 5 : PME Inclusion */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-[10px] font-mono uppercase">Insertion PME / إقحام المقاولات الصغرى</span>
            <Users className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="mt-2.5">
            <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
              {stats.pmeInclusionRate}%
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
              <Sparkles className="w-3 h-3 text-[#D4A017]" />
              <span>Cible MEF : 30% dépassée</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main split dashboard layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left (60%): Morocco Interactive SVG Map */}
        <div className="lg:col-span-3 flex flex-col">
          <MoroccoMap onRegionSelect={(reg) => setRegionFilter(reg)} />
        </div>

        {/* Right (40%): Live anomaly feed with pulsing red alerts */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-xl p-5 flex flex-col h-[460px] lg:h-auto overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h3 className="text-sm uppercase font-mono tracking-wider text-neutral-200 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
                Live Feed SDA-MP / البث المباشر للإنذارات
              </h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">Flux d'infractions mis à jour en temps réel</p>
            </div>
            
            {regionFilter !== "Toutes Régions" && (
              <button 
                onClick={() => setRegionFilter("Toutes Régions")} 
                className="text-[9px] font-mono text-[#D4A017] hover:underline"
              >
                Tout réinitialiser
              </button>
            )}
          </div>

          {regionFilter !== "Toutes Régions" && (
            <div className="mt-2 text-[10px] text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded flex justify-between items-center">
              <span>Région active : <strong className="text-white">{regionFilter}</strong></span>
              <span className="text-[9px] font-mono text-emerald-500">Filtré par carte</span>
            </div>
          )}

          {/* Scrolling alarm box */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-3 dark-scrollbar">
            {anomalies
              .filter(a => regionFilter === "Toutes Régions" || a.region === regionFilter)
              .map((anomaly) => {
                const isCrit = anomaly.riskScore >= 75;
                return (
                  <div 
                    key={anomaly.id}
                    onClick={() => {
                      onNavigateTab("anomalies");
                      onSelectAnomaly(anomaly.id);
                    }}
                    className={`p-3 rounded-lg border flex flex-col transition-all cursor-pointer hover:-translate-y-0.5 ${
                      isCrit 
                        ? "bg-[#C1121F]/5 border-[#C1121F]/20 hover:border-[#C1121F]/60" 
                        : "bg-white/[0.01] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isCrit ? "bg-[#C1121F] animate-pulse" : "bg-[#D97706]"}`} />
                        <span className="text-[10px] font-mono text-neutral-400 font-bold tracking-wider">{anomaly.id}</span>
                      </div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        isCrit ? "bg-[#C1121F]/10 text-[#C1121F]" : "bg-amber-950/40 text-amber-500"
                      }`}>
                        Risque: {anomaly.riskScore}/100
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-200 mt-2 line-clamp-1">
                      {anomaly.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 truncate mt-1">
                      {anomaly.buyer}
                    </p>

                    <div className="flex justify-between items-center text-[9px] text-neutral-400 mt-3 pt-2 border-t border-white/[0.03]">
                      <span>{anomaly.region}</span>
                      <span className="text-[#D4A017] font-bold">{formatMAD(anomaly.budget)}</span>
                    </div>
                  </div>
                );
              })}

            {anomalies.filter(a => regionFilter === "Toutes Régions" || a.region === regionFilter).length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 p-8 text-xs">
                Aucune anomalie critique signalée dans la région {regionFilter}.
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <button 
              onClick={() => onNavigateTab("anomalies")} 
              className="w-full text-center py-2 bg-neutral-900 border border-white/5 hover:bg-[#C1121F] hover:text-white rounded-lg text-xs font-mono text-neutral-400 transition-all uppercase flex items-center justify-center gap-1"
            >
              Examen complet des anomalies <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Row - 3 Recharts Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-recharts-viz-container">
        
        {/* Plot 1: Area Chart (Commitments vs Executed) */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col h-[320px]">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
              Consommation Budgétaire / تتبع الإنفاق
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Budget engagé vs réalisé (12 mois glissants en M MAD)</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BUDGET_TREND_DATA} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="engageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C1121F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C1121F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="realiseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.29}/>
                    <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#888" }} />
                <YAxis tick={{ fontSize: 9, fill: "#888" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }} 
                  labelClassName="text-white font-bold"
                />
                <Area type="monotone" dataKey="engage" name="Engagé" stroke="#C1121F" strokeWidth="2" fillOpacity={1} fill="url(#engageGrad)" />
                <Area type="monotone" dataKey="realise" name="Réalisé" stroke="#2D6A4F" strokeWidth="2" fillOpacity={1} fill="url(#realiseGrad)" />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px", paddingTop: "5px" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plot 2: Donut Chart (Allocation by sectors) */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col h-[320px]">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
              Répartition des Marchés / أصناف الطلبيات
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Ventilation des montants par typologie récréative</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center relative">
            <div className="absolute flex flex-col items-center">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Total</span>
              <span className="text-base font-black text-neutral-100 tracking-tight">12.8 Mds</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CONTRACT_TYPE_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CONTRACT_TYPE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => formatMAD(val)}
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }} 
                />
                <Legend iconSize={8} layout="horizontal" align="center" wrapperStyle={{ fontSize: "8.5px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plot 3: Bar Chart (Top risk ministries) */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col h-[320px]">
          <div className="mb-3">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
              Sensibilité Administative / مؤشر الجهات الأكثر خطورة
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Top acheteurs par volume d'anomalies détectées</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BUYER_ANOMALY_RANKING} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#888" }} />
                <YAxis tick={{ fontSize: 9, fill: "#888" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }} 
                />
                <Bar dataKey="anomalies" name="Signalements SDA" radius={[4, 4, 0, 0]}>
                  {BUYER_ANOMALY_RANKING.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px", paddingTop: "5px" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
