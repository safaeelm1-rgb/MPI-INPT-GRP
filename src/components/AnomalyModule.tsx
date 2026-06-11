import React, { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  SlidersHorizontal, 
  Building, 
  Calendar, 
  Users, 
  AlertOctagon, 
  MapPin, 
  Send, 
  Archive, 
  CheckCircle2, 
  X,
  FileCheck,
  Cpu,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { BidAnomaly } from "../types";
import NetworkGraph from "./NetworkGraph";

interface AnomalyModuleProps {
  anomalies: BidAnomaly[];
  selectedAnomalyId: string | null;
  onSelectAnomaly: (id: string | null) => void;
  onTransmitToIgat: (id: string) => void;
}

// Risk Bell Curve Data
const HISTOGRAM_RISK_DATA = [
  { bin: "0-10", count: 18, active: false },
  { bin: "11-20", count: 42, active: false },
  { bin: "21-30", count: 110, active: false },
  { bin: "31-40", count: 240, active: false },
  { bin: "41-50", count: 320, active: false },
  { bin: "51-60", count: 280, active: false },
  { bin: "61-70", count: 160, active: false },
  { bin: "71-80", count: 95, active: false },
  { bin: "81-90", count: 42, active: false },
  { bin: "91-100", count: 18, active: false }
];

export default function AnomalyModule({ 
  anomalies, 
  selectedAnomalyId, 
  onSelectAnomaly,
  onTransmitToIgat
}: AnomalyModuleProps) {

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [buyerFilter, setBuyerFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [minRisk, setMinRisk] = useState<number>(50);
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Feedback notifications after actions
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleAction = (id: string, actionName: string) => {
    setFeedbackMsg(`Succès : L'action "${actionName}" a été exécutée pour ${id}.`);
    if (actionName === "Transmettre à l'IGAT") {
      onTransmitToIgat(id);
    }
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // Get matching icon and badge for anomaly types
  const getAnomalyVisuals = (type: string) => {
    switch (type) {
      case "collusion":
        return { label: "Collusion probable / شبهة تواطؤ", color: "text-red-500 bg-red-950/20", icon: Users };
      case "underpricing":
        return { label: "Prix anormalement bas / ثمن منخفض بشكل غير عادي", color: "text-orange-500 bg-orange-950/20", icon: alertIconMap("underpricing") };
      case "excessive_conditions":
        return { label: "Clauses discriminatoires / شروط إقصائية", color: "text-[#D4A017] bg-yellow-950/20", icon: alertIconMap("excessive") };
      case "criteria_bias":
        return { label: "Cahier des charges biaisé / انحياز الشروط", color: "text-[#C1121F] bg-red-950/20", icon: alertIconMap("bias") };
      default:
        return { label: "Réseau lié / شبكة شركات متحالفة", color: "text-blue-500 bg-blue-950/20", icon: ShieldAlert };
    }
  };

  function alertIconMap(term: string) {
    return ShieldAlert;
  }

  // Filter list
  const filtered = anomalies.filter(an => {
    const textMatch = an.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      an.id.toLowerCase().includes(searchQuery.toLowerCase());
    const buyerMatch = !buyerFilter || an.buyer.toLowerCase().includes(buyerFilter.toLowerCase());
    const typeMatch = !typeFilter || an.anomalyType === typeFilter;
    const riskMatch = an.riskScore >= minRisk;
    const statusMatch = !statusFilter || an.status === statusFilter;

    return textMatch && buyerMatch && typeMatch && riskMatch && statusMatch;
  });

  const selectedAnomaly = anomalies.find(a => a.id === selectedAnomalyId) || null;

  // Let's identify the active histogram bin for active anomaly
  const getActiveHistogramData = () => {
    if (!selectedAnomaly) return HISTOGRAM_RISK_DATA;
    const score = selectedAnomaly.riskScore;
    return HISTOGRAM_RISK_DATA.map(bin => {
      const [low, high] = bin.bin.split("-").map(Number);
      return {
        ...bin,
        active: score >= low && score <= high
      };
    });
  };

  return (
    <div className="space-y-6" id="sda-mp-anomalies-container">
      
      {/* Header section with Purple AI badge and Arab representation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
              Système de Détection d'Anomalies (SDA-MP)
            </h2>
            <span className="bg-purple-950 text-purple-400 border border-purple-900 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3" /> MODEL v4.2 PRO
            </span>
          </div>
          <h3 className="text-xs text-neutral-400 mt-1 leading-relaxed">
            نظام الكشف التلقائي عن الإخلالات بالمنافسة والصفقات المشبوهة
          </h3>
        </div>
      </div>

      {/* Action feedback message */}
      {feedbackMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-900 text-emerald-400 rounded-lg text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {feedbackMsg}
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-[#111] border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-[#C1121F] text-neutral-200"
            placeholder="Rechercher AO ou Réf..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Ministère dropdown */}
        <select
          className="bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-xs outline-none focus:border-[#C1121F] text-neutral-400"
          value={buyerFilter}
          onChange={(e) => setBuyerFilter(e.target.value)}
        >
          <option value="">Tous les Acheteurs / الجهات</option>
          <option value="Santé">Ministère de la Santé</option>
          <option value="Éducation">Ministère de l'Éducation</option>
          <option value="ONEE">ONEE</option>
          <option value="Justice">Ministère de la Justice</option>
          <option value="Finances">Ministère des Finances</option>
        </select>

        {/* Anomaly type */}
        <select
          className="bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-xs outline-none focus:border-[#C1121F] text-neutral-400"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Toutes les infractions</option>
          <option value="collusion">🔴 Collusion probable</option>
          <option value="underpricing">🟠 Prix anormalement bas</option>
          <option value="excessive_conditions">🟡 Clauses discriminatoires</option>
          <option value="criteria_bias">🔴 Cahier des charges biaisé</option>
        </select>

        {/* Status */}
        <select
          className="bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-xs outline-none focus:border-[#C1121F] text-neutral-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="CRITICAL">Critique</option>
          <option value="FLAGGED">Signalé</option>
          <option value="UNDER_REVIEW">En cours d'examen</option>
          <option value="RESOLVED">Résolu</option>
        </select>

        {/* Min Risk Slider */}
        <div className="flex flex-col px-1">
          <span className="text-[9px] font-mono uppercase text-neutral-500 flex justify-between">
            <span>Score Risque Min:</span>
            <strong className="text-[#C1121F]">{minRisk}%</strong>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={minRisk}
            onChange={(e) => setMinRisk(Number(e.target.value))}
            className="w-full accent-[#C1121F] mt-1.5 h-1 bg-neutral-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Main split: Table registry (Left 65%) vs sliding context detail sidepanel (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Registry Table */}
        <div className="lg:col-span-3 bg-[#111] border border-white/5 rounded-xl p-5 overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-900/60 text-neutral-500 uppercase font-mono text-[9px] border-b border-white/5">
                  <th className="p-3">Référence / Réf</th>
                  <th className="p-3">Objet & Acheteur</th>
                  <th className="p-3">Type d'Infraction</th>
                  <th className="p-3 text-center">Score Risque</th>
                  <th className="p-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((an) => {
                  const vis = getAnomalyVisuals(an.anomalyType);
                  const isSDASelected = selectedAnomalyId === an.id;
                  
                  return (
                    <tr 
                      key={an.id}
                      onClick={() => onSelectAnomaly(an.id)}
                      className={`cursor-pointer transition-all hover:bg-neutral-800/40 ${isSDASelected ? "bg-red-950/15" : ""}`}
                    >
                      <td className="p-3 font-mono font-bold text-neutral-200">
                        {an.id}
                      </td>
                      <td className="p-3 max-w-[200px]">
                        <div className="text-neutral-100 font-bold truncate" title={an.title}>
                          {an.title}
                        </div>
                        <div className="text-[10px] text-neutral-500 truncate mt-0.5" title={an.buyer}>
                          {an.buyer}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] inline-flex items-center gap-1 font-semibold ${vis.color}`}>
                          <vis.icon className="w-3 h-3" />
                          {vis.label.split(" / ")[0]}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5 flex-col">
                          <span className={`font-mono font-bold ${an.riskScore >= 75 ? "text-[#C1121F]" : "text-amber-500"}`}>
                            {an.riskScore}%
                          </span>
                          <div className="w-16 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${an.riskScore}%`, 
                                backgroundColor: an.riskScore >= 75 ? "#C1121F" : "#D97706" 
                              }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider font-mono ${
                          an.status === "CRITICAL" ? "bg-red-950/40 text-red-400 border border-red-900/30" : 
                          an.status === "FLAGGED" ? "bg-orange-950/20 text-orange-400 border border-orange-900/20" :
                          an.status === "UNDER_REVIEW" ? "bg-amber-950/25 text-amber-500 border border-yellow-900/20" :
                          "bg-emerald-950/20 text-emerald-400 border border-emerald-900/20"
                        }`}>
                          {an.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500 font-mono text-xs">
                      Aucune alerte d'anomalie enregistrée ne répond à ces critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sliding detail side panel */}
        <div className="lg:col-span-2">
          {selectedAnomaly ? (
            <div className="bg-[#111111] border border-red-900/20 rounded-xl p-5 flex flex-col justify-between h-full space-y-5 animate-fade-in">
              {/* Card top reference */}
              <div className="flex items-start justify-between border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#C1121F]">
                    Détail de l'Alerte Souveraine
                  </span>
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-tight mt-0.5">
                    {selectedAnomaly.id} · {selectedAnomaly.title}
                  </h3>
                </div>
                <button 
                  onClick={() => onSelectAnomaly(null)}
                  className="text-neutral-500 hover:text-white p-1 rounded-md hover:bg-neutral-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Big circular score gauge directly designed inside */}
              <div className="flex items-center gap-4 bg-white/[0.01] p-3 rounded-lg border border-white/5">
                
                {/* Circular Gauge visual representation using SVG */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke={selectedAnomaly.riskScore >= 75 ? "#C1121F" : "#D97706"} 
                      strokeWidth="4" 
                      fill="none" 
                      strokeDasharray={175} 
                      strokeDashoffset={175 - (175 * selectedAnomaly.riskScore) / 100} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs">
                    {selectedAnomaly.riskScore}%
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-200">Indicateur National de Danger</h4>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Déduit par recoupement des conditions restrictives des cahiers de charges et de la relation actionnariale.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleAction(selectedAnomaly.id, "Transmettre à l'IGAT")}
                  className="bg-[#C1121F] hover:bg-[#8B0D15] text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  IGAT / IGF
                </button>
                <button 
                  onClick={() => handleAction(selectedAnomaly.id, "Demander justification")}
                  className="bg-[#2D6A4F] hover:bg-[#1e4634] text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Justifier
                </button>
                <button 
                  onClick={() => handleAction(selectedAnomaly.id, "Classer sans suite")}
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <Archive className="w-3.5 h-3.5" />
                  Archiver
                </button>
              </div>

              {/* Explanation plain French */}
              <div className="space-y-1.5 text-xs text-neutral-300">
                <h4 className="text-[10px] uppercase font-mono text-neutral-500">Explication analytique</h4>
                <div className="p-3 bg-black/40 border border-white/[0.04] rounded-lg leading-relaxed">
                  {selectedAnomaly.description}
                </div>
              </div>

              {/* Side-by-side textual evidence comparison (Only if collusion type) */}
              {selectedAnomaly.anomalyType === "collusion" && (
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <h4 className="text-[10px] uppercase font-mono text-neutral-500">Forensics : similarités textuelles d'offres</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-red-950/10 border border-red-900/10 rounded">
                      <span className="text-[8px] font-mono font-bold text-red-500">Soumissionnaire A</span>
                      <p className="text-[9px] mt-1 leading-normal">
                        "Les travaux de <span className="bg-red-950 text-red-200 border-b border-red-500 font-bold">terrassement d'acier de type FE E500 pour le gros œuvre</span> comprennent la fourniture..."
                      </p>
                    </div>
                    <div className="p-2 bg-red-950/10 border border-red-900/10 rounded">
                      <span className="text-[8px] font-mono font-bold text-red-500">Soumissionnaire B</span>
                      <p className="text-[9px] mt-1 leading-normal">
                        "Les travaux de <span className="bg-red-950 text-red-200 border-b border-red-500 font-bold">terrassement d'acier de type FE E500 pour le gros œuvre</span> incluent la pose..."
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* OMPIC Network visualizer Embedded */}
              <div>
                <NetworkGraph marketId={selectedAnomaly.id} />
              </div>

              {/* Evidence details */}
              <div className="space-y-1">
                <h4 className="text-[10px] uppercase font-mono text-neutral-500">Éléments de Preuve d'Intégrité</h4>
                <ul className="text-[10px] text-neutral-400 space-y-1.5">
                  {selectedAnomaly.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#C1121F] shrink-0 font-bold">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="bg-[#111] border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center text-neutral-500 h-full">
              <ShieldAlert className="w-8 h-8 text-neutral-700 animate-pulse mb-3" />
              <p className="text-xs font-mono">Sélectionnez une ligne du registre pour auditer l'infraction en direct d'OMPIC & SDA-MP.</p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom section: Histogram Bell curve + Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Risk Score Bell Curve distribution */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 md:col-span-2">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest font-mono">
                Distribution Statistique des alertes
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Où se positionne le marché audité par rapport à la courbe nationale (Isolation Forest)</p>
            </div>
            {selectedAnomaly && (
              <span className="text-[9px] px-2 py-0.5 bg-red-950 text-red-400 font-mono rounded font-bold uppercase">
                Audit : {selectedAnomaly.id}
              </span>
            )}
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getActiveHistogramData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="bin" tick={{ fontSize: 9, fill: "#888" }} />
                <YAxis tick={{ fontSize: 9, fill: "#888" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px" }}
                />
                <Bar dataKey="count" fill="rgba(193, 18, 31, 0.2)" radius={[3, 3, 0, 0]}>
                  {getActiveHistogramData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.active ? "#C1121F" : "rgba(255,255,255,0.1)"} 
                      stroke={entry.active ? "#C1121F" : "transparent"} 
                      strokeWidth={entry.active ? 1.5 : 0} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical incidents logs */}
        <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#D4A017] uppercase tracking-widest font-mono">
              Historique des adjudicataires
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Recoupements d'infractions cumulatives</p>
          </div>

          <div className="space-y-4 my-4 flex-1 overflow-y-auto max-h-[140px] pr-2 dark-scrollbar text-xs">
            <div className="border-l-2 border-[#C1121F] pl-3.5 relative">
              <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#C1121F]" />
              <div className="font-bold text-neutral-200">Mai 2026</div>
              <p className="text-[10px] text-neutral-500 mt-1">TechMaghreb SARL sanctionné pour similarité d'offres de 96% avec DataNet.</p>
            </div>
            <div className="border-l-2 border-amber-600 pl-3.5 relative">
              <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-amber-600" />
              <div className="font-bold text-neutral-200">Février 2026</div>
              <p className="text-[10px] text-neutral-500 mt-1">Dépassement du seuil recommandé de cautionnement sur 4 marchés.</p>
            </div>
            <div className="border-l-2 border-neutral-700 pl-3.5 relative">
              <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-neutral-600" />
              <div className="font-bold text-neutral-400">Novembre 2025</div>
              <p className="text-[10px] text-neutral-500 mt-1">Initialisation de la surveillance active des marchés forestiers d'Ifrane.</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>Algorithme isolation</span>
            <span>Update: v4.2.0</span>
          </div>
        </div>

      </div>

    </div>
  );
}
