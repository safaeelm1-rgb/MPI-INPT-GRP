import React, { useState } from "react";
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  Trash2, 
  CheckSquare, 
  Square,
  Clock,
  Briefcase,
  AlertOctagon,
  Calendar,
  Send,
  Archive,
  ChevronRight,
  Filter
} from "lucide-react";
import { BidAnomaly } from "../types";

interface NotificationCenterProps {
  anomalies: BidAnomaly[];
  onTransmitToIgat: (id: string) => void;
}

export default function NotificationCenter({ anomalies, onTransmitToIgat }: NotificationCenterProps) {
  const [activeNotificationTab, setActiveNotificationTab] = useState<"all" | "critical" | "review" | "resolved">("all");
  const [viewMode, setViewMode] = useState<"chrono" | "market">("chrono");
  const [selectedAlerts, setSelectedAlerts] = useState<Record<string, boolean>>({});
  const [sessionLogs, setSessionLogs] = useState<string[]>([]);

  // Toggle single selection
  const toggleSelect = (id: string) => {
    setSelectedAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle selection for all filtered anomalies
  const getFilteredAnomalies = () => {
    return anomalies.filter(an => {
      if (activeNotificationTab === "critical") return an.riskScore >= 75 && an.status !== "RESOLVED";
      if (activeNotificationTab === "review") return an.status === "UNDER_REVIEW" || an.status === "FLAGGED";
      if (activeNotificationTab === "resolved") return an.status === "RESOLVED";
      return true; // all
    });
  };

  const handleSelectAll = () => {
    const list = getFilteredAnomalies();
    const allSelected = list.every(an => selectedAlerts[an.id]);

    const nextState: Record<string, boolean> = { ...selectedAlerts };
    list.forEach(an => {
      nextState[an.id] = !allSelected;
    });
    setSelectedAlerts(nextState);
  };

  const handleBulkTransmit = () => {
    const selectedIds = Object.keys(selectedAlerts).filter(id => selectedAlerts[id]);
    if (selectedIds.length === 0) return;

    selectedIds.forEach(id => onTransmitToIgat(id));
    setSessionLogs(prev => [
      `Transmis en bloc à l'IGAT : ${selectedIds.join(", ")} (${new Date().toLocaleTimeString()})`,
      ...prev
    ]);
    setSelectedAlerts({});
  };

  const handleBulkArchive = () => {
    const selectedIds = Object.keys(selectedAlerts).filter(id => selectedAlerts[id]);
    if (selectedIds.length === 0) return;

    setSessionLogs(prev => [
      `Archivage groupé de : ${selectedIds.join(", ")} (${new Date().toLocaleTimeString()})`,
      ...prev
    ]);
    setSelectedAlerts({});
  };

  const formatMAD = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + " M MAD";
    }
    return amount.toLocaleString() + " MAD";
  };

  const filtered = getFilteredAnomalies();
  const selectedCount = Object.keys(selectedAlerts).filter(id => selectedAlerts[id]).length;

  return (
    <div className="space-y-6" id="notifications-and-saisines-center">
      
      {/* Header alert management */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight flex items-center gap-2">
            Centre des Signalements & Saisines / مركز التمييز والمتابعة
          </h2>
          <h3 className="text-xs text-neutral-400 mt-1 leading-relaxed">
            Boite de réception réglementaire d'office pour les inspecteurs de l'IGAT, de l'IGF et auditeurs de l'État
          </h3>
        </div>

        {/* View Toggle Chrono vs Grouped */}
        <div className="flex bg-neutral-900 border border-white/5 rounded-lg p-1 text-xs">
          <button
            onClick={() => setViewMode("chrono")}
            className={`px-3 py-1.5 rounded-md font-mono transition-all ${
              viewMode === "chrono" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500 hover:text-white"
            }`}
          >
            Vue Chronologie
          </button>
          <button
            onClick={() => setViewMode("market")}
            className={`px-3 py-1.5 rounded-md font-mono transition-all ${
              viewMode === "market" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500 hover:text-white"
            }`}
          >
            Groupement Marchés
          </button>
        </div>
      </div>

      {sessionLogs.length > 0 && (
        <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg text-xs space-y-1 font-mono text-neutral-400">
          <div className="text-[10px] text-neutral-500 uppercase font-bold">Trace d'Exécution Session :</div>
          {sessionLogs.map((log, lIdx) => (
            <div key={lIdx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#D4A017] rounded-full shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tabs list alerts */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111] p-3 rounded-xl border border-white/5">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => { setActiveNotificationTab("all"); setSelectedAlerts({}); }}
            className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-all ${
              activeNotificationTab === "all" ? "bg-[#C1121F] text-white border-[#C1121F]" : "bg-black/50 border-white/5 text-neutral-400 hover:text-white"
            }`}
          >
            Toutes ({anomalies.length})
          </button>
          <button
            onClick={() => { setActiveNotificationTab("critical"); setSelectedAlerts({}); }}
            className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-all ${
              activeNotificationTab === "critical" ? "bg-[#C1121F] text-white border-[#C1121F]" : "bg-black/50 border-white/5 text-neutral-400 hover:text-white"
            }`}
          >
            Critiques ({anomalies.filter(a => a.riskScore >= 75 && a.status !== "RESOLVED").length})
          </button>
          <button
            onClick={() => { setActiveNotificationTab("review"); setSelectedAlerts({}); }}
            className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-all ${
              activeNotificationTab === "review" ? "bg-[#C1121F] text-white border-[#C1121F]" : "bg-black/50 border-white/5 text-neutral-400 hover:text-white"
            }`}
          >
            En Attente / Signalés ({anomalies.filter(a => a.status === "UNDER_REVIEW" || a.status === "FLAGGED").length})
          </button>
          <button
            onClick={() => { setActiveNotificationTab("resolved"); setSelectedAlerts({}); }}
            className={`px-3.5 py-1.5 rounded-lg border font-semibold transition-all ${
              activeNotificationTab === "resolved" ? "bg-[#C1121F] text-white border-[#C1121F]" : "bg-black/50 border-white/5 text-neutral-400 hover:text-white"
            }`}
          >
            Traitées ({anomalies.filter(a => a.status === "RESOLVED").length})
          </button>
        </div>

        {/* Bulk action buttons */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 animate-pulse text-xs">
            <span className="text-neutral-400 font-mono">({selectedCount}) Sélectionnés :</span>
            <button 
              onClick={handleBulkTransmit}
              className="bg-[#C1121F] hover:bg-[#8B0D15] text-white px-2.5 py-1 rounded font-mono uppercase text-[10px] flex items-center gap-1"
            >
              <Send className="w-3 h-3" /> Transmettre IGAT
            </button>
            <button 
              onClick={handleBulkArchive}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 rounded font-mono uppercase text-[10px]"
            >
              Classer
            </button>
          </div>
        )}
      </div>

      {/* Main timeline listing */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden p-5">
        
        {/* Bulk select check */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-4 text-xs text-neutral-500 font-mono">
            <button 
              onClick={handleSelectAll} 
              className="flex items-center gap-2 text-neutral-400 hover:text-white font-mono"
            >
              {filtered.every(an => selectedAlerts[an.id]) ? <CheckSquare className="w-4 h-4 text-red-500" /> : <Square className="w-4 h-4" />}
              <span>Sélectionner tout le flux filtré</span>
            </button>
            <span>Affichage : {filtered.length} signalements</span>
          </div>
        )}

        {/* Chrono Timeline Visual Loop */}
        {viewMode === "chrono" && (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((an) => {
              const isSelected = !!selectedAlerts[an.id];
              const isCrit = an.riskScore >= 75;

              return (
                <div 
                  key={an.id}
                  className={`py-4 transition-all flex items-start gap-4 ${isSelected ? "bg-red-950/5 pl-2 rounded-lg" : ""}`}
                >
                  {/* Select check */}
                  <button 
                    onClick={() => toggleSelect(an.id)}
                    className="text-neutral-500 hover:text-white mt-1 shrink-0"
                  >
                    {isSelected ? <CheckSquare className="w-4.5 h-4.5 text-[#C1121F]" /> : <Square className="w-4.5 h-4.5" />}
                  </button>

                  {/* Impact visual badge icon */}
                  <div className="p-2 py-3 rounded-lg bg-neutral-900 border border-white/5 shrink-0 flex flex-col items-center justify-center min-w-[50px]">
                    <Clock className="w-4 h-4 text-neutral-500" />
                    <span className="text-[8px] font-mono text-neutral-500 mt-1">{an.date.split("-").slice(1).join("/")}</span>
                  </div>

                  {/* Context body block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-mono text-[#D4A017] font-bold">{an.id}</span>
                      <span className="text-neutral-500 text-[10px]">•</span>
                      <span className="text-neutral-300 font-semibold text-xs truncate max-w-sm" title={an.title}>{an.title}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isCrit ? "bg-red-950/40 text-red-400 border border-red-900/15" : "bg-neutral-800 text-neutral-400 border border-white/[0.03]"
                      }`}>
                        Score de Danger: {an.riskScore}/100
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-500 mt-1 font-mono">
                      Acheteur: <strong className="text-neutral-400">{an.buyer}</strong> · Région : {an.region}
                    </p>

                    <div className="p-2.5 bg-black/40 rounded border border-white/[0.02] text-[10px] text-neutral-400 mt-2 font-light leading-relaxed">
                      {an.description}
                    </div>

                    <div className="flex items-center gap-3 mt-3 text-[10px]">
                      <span className="text-neutral-500">Estimé : <strong className="text-white">{formatMAD(an.budget)}</strong></span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-500">Assigné : <strong className="text-neutral-300">Modèles SDA MPI</strong></span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <span className={`text-[8px] font-mono rounded px-1 text-center py-0.5 ${
                      an.status === "CRITICAL" ? "bg-red-950/40 text-[#C1121F] border border-red-900/15" : "bg-yellow-950/20 text-yellow-500 border border-yellow-900/20"
                    }`}>
                      {an.status}
                    </span>
                    <button 
                      onClick={() => onTransmitToIgat(an.id)} 
                      className="bg-[#C1121F] hover:bg-[#8B0D15] text-white p-1 px-2 text-[8px] rounded uppercase font-mono font-bold"
                    >
                      Transmettre
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grouped by market view mode */}
        {viewMode === "market" && (
          <div className="space-y-4">
            <div className="p-4 bg-[#1e1e1e]/60 border border-white/5 rounded-xl">
              <h4 className="text-xs font-bold text-[#D4A017] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Secteur d'Aménagement Ministériel / BTP & Espaces Verts
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5 pl-5">Regroupe les anomalies de conditions démesurées de cautionnement bancaire</p>
              
              <div className="mt-3 divide-y divide-white/[0.04] pl-5">
                {filtered.filter(a => a.sector === "BTP / Infrastructures" || a.sector === "Services / Espaces Verts").map(an => (
                  <div key={an.id} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-300">{an.id} · {an.title}</span>
                    <span className="text-[10px] font-mono text-[#C0392B] bg-red-950/40 px-2 py-0.5 rounded font-bold">Risque: {an.riskScore}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#1e1e1e]/60 border border-white/5 rounded-xl">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Secteur Technologie & Digitalisation / Informatique
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5 pl-5">Regroupe les anomalies de spécifications clauses constructeur fermées</p>
              
              <div className="mt-3 divide-y divide-white/[0.04] pl-5">
                {filtered.filter(a => a.sector === "Technologie & Digital").map(an => (
                  <div key={an.id} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-300">{an.id} · {an.title}</span>
                    <span className="text-[10px] font-mono text-[#C0392B] bg-red-950/40 px-2 py-0.5 rounded font-bold">Risque: {an.riskScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="h-44 flex flex-col items-center justify-center text-center text-neutral-500 text-xs font-mono">
            Aucun signalement d'infraction à traiter dans ce sous-registre filtré.
          </div>
        )}

      </div>

    </div>
  );
}
