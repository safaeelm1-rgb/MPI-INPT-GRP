import React, { useState, useEffect } from "react";
import { 
  Building, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  UserCheck, 
  Bell, 
  Globe, 
  LogOut, 
  Cpu, 
  BookOpen, 
  Lock, 
  Activity,
  Award,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BidAnomaly, MarketStats } from "./types";

// Modular Sub-Components imports
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AnomalyModule from "./components/AnomalyModule";
import NlpModule from "./components/NlpModule";
import PmeModule from "./components/PmeModule";
import ForecastModule from "./components/ForecastModule";
import CitizenModule from "./components/CitizenModule";
import NotificationCenter from "./components/NotificationCenter";
import ArchitectureModal from "./components/ArchitectureModal";

export default function App() {
  // Global State
  const [user, setUser] = useState<{ username: string; role: "acheteur" | "pme" | "controleur" | "citoyen" } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);

  const [stats, setStats] = useState<MarketStats>({
    totalBidsAnalyzed: 1450,
    totalBudgetMAD: 12845000000,
    averageRiskScore: 34.2,
    anomaliesDetectedCount: 112,
    pmeInclusionRate: 38.5
  });

  const [anomalies, setAnomalies] = useState<BidAnomaly[]>([]);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);

  // Sync state functions
  const fetchStatsAndAnomalies = async () => {
    try {
      const statsRes = await fetch("/api/stats");
      const statsJson = await statsRes.json();
      if (statsJson.status === "success") {
        setStats(statsJson.data);
      }

      const anomRes = await fetch("/api/anomalies");
      const anomJson = await anomRes.json();
      if (anomJson.status === "success") {
        setAnomalies(anomJson.data);
      }
    } catch (err) {
      console.error("Error fetching state:", err);
    }
  };

  useEffect(() => {
    fetchStatsAndAnomalies();
  }, []);

  // Update status locally when transmitted to IGAT
  const handleTransmitToIgat = (id: string) => {
    setAnomalies(prev => prev.map(an => {
      if (an.id === id) {
        return { ...an, status: "CRITICAL" as const, riskScore: Math.min(100, an.riskScore + 5) };
      }
      return an;
    }));
  };

  // Redirect automatic tab when role is switched
  const handleRoleChange = (role: "acheteur" | "pme" | "controleur" | "citoyen") => {
    if (user) {
      setUser({ ...user, role });
    } else {
      setUser({ username: "Visiteur", role });
    }
    
    // Switch to the most suitable view
    if (role === "citoyen") {
      setActiveTab("citizen");
    } else {
      setActiveTab("dashboard");
    }
  };

  // Sidebar navigation menu lists depending on custom user role
  const getNavItems = () => {
    const role = user?.role || "citoyen";
    
    const items = [
      {
        id: "dashboard",
        label: "Mission Control",
        arabLabel: "لوحة التحكم",
        icon: LayoutDashboard,
        roles: ["acheteur", "pme", "controleur"]
      },
      {
        id: "anomalies",
        label: "Détection d'Anomalies (IA)",
        arabLabel: "كشف الإخلالات",
        icon: ShieldAlert,
        roles: ["acheteur", "controleur"]
      },
      {
        id: "nlp",
        label: "Analyse Cahiers Charges (NLP)",
        arabLabel: "تحليل دفاتر الشروط",
        icon: FileText,
        roles: ["acheteur", "controleur"]
      },
      {
        id: "pme",
        label: "Matching PME / TPE",
        arabLabel: "مطابقة الفرص",
        icon: Users,
        roles: ["acheteur", "pme"]
      },
      {
        id: "forecast",
        label: "Prévisions Budgétaires",
        arabLabel: "التوقعات المالية",
        icon: Activity,
        roles: ["acheteur", "controleur"]
      },
      {
        id: "citizen",
        label: "Portail Citoyen Open-Data",
        arabLabel: "بوابة الشفافية",
        icon: Globe,
        roles: ["acheteur", "pme", "controleur", "citoyen"]
      },
      {
        id: "notifications",
        label: "Signalements & Saisines",
        arabLabel: "التبليغات والشكاوى",
        icon: Bell,
        roles: ["controleur"]
      }
    ];

    return items.filter(item => item.roles.includes(role));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 font-sans flex flex-col selection:bg-[#C1121F]/30 overflow-x-hidden">
      
      {/* Top Sovereignty bar representation */}
      <div className="bg-[#111111] border-b border-white/5 py-2 px-4 shadow-sm relative z-20 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs">
        <div className="flex items-center gap-3">
          <span className="p-1.5 py-0.5 rounded bg-[#C1121F]/15 border border-[#C1121F]/35 text-[#C1121F] font-black tracking-wider uppercase font-mono text-[9px]">
            Royaume du Maroc
          </span>
          <span className="text-neutral-500">·</span>
          <span className="text-neutral-400 font-medium">MPI — Maroc Procurement Intelligence</span>
        </div>

        <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono text-neutral-400 text-[10px]">
          <span className="hidden lg:flex items-center gap-1 text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-[#2D6A4F]" /> Chiffrement d'État SIMPL / CNIE 2.0
          </span>
          {user && (
            <div className="flex items-center gap-2">
              <span className="bg-neutral-800 border border-white/5 px-2 py-0.5 rounded text-neutral-300">
                Inspecteur : <strong>{user.username}</strong>
              </span>
              
              {/* Profile Jumper for immediate validation of different adaptations without logging out */}
              <select
                className="bg-[#2D6A4F]/25 border border-[#2D6A4F]/50 text-emerald-400 font-bold rounded px-1.5 py-0.5 text-[9px] outline-none cursor-pointer focus:border-white/20"
                value={user.role}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                title="Sauter de profil pour auditer les variations"
              >
                <option value="acheteur" className="bg-[#111] text-normal">Acheteur Public</option>
                <option value="pme" className="bg-[#111] text-normal">PME / TPE Nationale</option>
                <option value="controleur" className="bg-[#111] text-normal">Contrôleur / Audit</option>
                <option value="citoyen" className="bg-[#111] text-normal">Citoyen Open Data</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!user ? (
          /* Render interactive Landing & Login if session is not set */
          <motion.div 
            key="login-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage 
              onLogin={(role) => {
                const uName = role === "acheteur" ? "A. Benjelloun" : role === "controleur" ? "C. Alami" : role === "pme" ? "PME Administrateur" : "Citoyen Visiteur";
                setUser({ username: uName, role: role as any });
                if (role === "citoyen") {
                  setActiveTab("citizen");
                } else {
                  setActiveTab("dashboard");
                }
              }} 
            />
          </motion.div>
        ) : (
          /* Main Dashboard Interface Deck with Collapsible Sidebar */
          <motion.div 
            key="deck-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col md:flex-row relative z-10"
          >
            {/* Sidebar navigation */}
            <aside 
              className={`bg-[#111111]/95 border-r border-white/5 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 relative ${
                sidebarCollapsed ? "w-16" : "w-64"
              }`}
            >
              <div>
                
                {/* Brand / Logo Zone */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-[#C1121F] text-white flex items-center justify-center font-black text-sm shadow shadow-red-900/50">
                      M
                    </div>
                    {!sidebarCollapsed && (
                      <div>
                        <div className="text-xs font-bold font-mono text-neutral-300 flex items-center gap-1.5">
                          MPI PLATFORM
                          <span className="w-1.5 h-1.5 bg-[#40916C] rounded-full animate-ping" />
                        </div>
                        <span className="text-[9px] text-[#A3A3A3] block tracking-wide uppercase font-bold">Maroc Intelligence</span>
                      </div>
                    )}
                  </div>

                  {/* Collapse Toggle */}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1 rounded bg-neutral-800/40 border border-neutral-700/50 text-neutral-400 hover:text-white transition-all"
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>
                </div>

                {/* Sidebar menu list entries */}
                <nav className="p-3.5 space-y-2">
                  {getNavItems().map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setSelectedAnomalyId(null); // Reset detail pointer on tab change
                        }}
                        className={`w-full flex items-center gap-3.5 p-2.5 rounded-xl text-left border transition-all text-xs ${
                          isActive 
                            ? "bg-[#C1121F]/10 text-white border-red-900/30 font-bold shadow-lg" 
                            : "bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                        }`}
                      >
                        <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#C1121F]" : "text-neutral-500"}`} />
                        
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            <span className="block leading-none font-semibold truncate">{item.label}</span>
                            <span className="text-[8px] text-neutral-500 font-serif block mt-1" dir="rtl">{item.arabLabel}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>

              </div>

              {/* Bottom sidebar actions */}
              <div className="p-4 border-t border-white/5 space-y-4">
                
                {/* Tech Specs trigger button */}
                <button
                  onClick={() => setShowArchModal(true)}
                  className="w-full flex items-center gap-2 text-xs font-semibold text-[#D4A017] hover:text-white transition-all font-mono"
                >
                  <Cpu className="w-4 h-4 shrink-0 text-[#D4A017]" />
                  {!sidebarCollapsed && <span>MPI AI Tech Specs</span>}
                </button>

                {/* Logout */}
                <button
                  onClick={() => setUser(null)}
                  className="w-full flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-all font-bold"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span>Se déconnecter</span>}
                </button>
              </div>

            </aside>

            {/* Main Stage Desk frame */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen dark-scrollbar relative">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-6xl mx-auto"
                >
                  
                  {activeTab === "dashboard" && (
                    <Dashboard 
                      stats={stats} 
                      anomalies={anomalies} 
                      role={user.role} 
                      onSelectAnomaly={(id) => {
                        setSelectedAnomalyId(id);
                        setActiveTab("anomalies");
                      }}
                      onNavigateTab={(tab) => {
                        setActiveTab(tab);
                      }}
                      onSimulateClick={() => {
                        setActiveTab("anomalies");
                      }}
                    />
                  )}

                  {activeTab === "anomalies" && (
                    <AnomalyModule 
                      anomalies={anomalies} 
                      selectedAnomalyId={selectedAnomalyId}
                      onSelectAnomaly={setSelectedAnomalyId}
                      onTransmitToIgat={handleTransmitToIgat}
                    />
                  )}

                  {activeTab === "nlp" && (
                    <NlpModule />
                  )}

                  {activeTab === "pme" && (
                    <PmeModule role={user.role} />
                  )}

                  {activeTab === "forecast" && (
                    <ForecastModule />
                  )}

                  {activeTab === "citizen" && (
                    <CitizenModule />
                  )}

                  {activeTab === "notifications" && (
                    <NotificationCenter 
                      anomalies={anomalies} 
                      onTransmitToIgat={handleTransmitToIgat} 
                    />
                  )}

                </motion.div>
              </AnimatePresence>

            </main>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Tech Specifications modal */}
      <ArchitectureModal isOpen={showArchModal} onClose={() => setShowArchModal(false)} />

    </div>
  );
}
