import React, { useState, useEffect } from "react";
import { 
  Users, 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  MapPin, 
  Briefcase, 
  FolderOpen, 
  TrendingUp, 
  Award,
  Bell,
  Eye,
  FileCheck,
  Building,
  ArrowRight
} from "lucide-react";
import { MatchingBidSuggestion, PmeProfile } from "../types";

interface PmeModuleProps {
  role: string;
}

export default function PmeModule({ role }: PmeModuleProps) {
  // Profiles selector (authentic PME records configured in the server)
  const PME_PROFILES: PmeProfile[] = [
    {
      id: "PME-8849-MA",
      name: "Carthago Travaux & Infrastructures SARL",
      sector: "BTP / Infrastructures",
      location: "Agadir",
      maxCapacity: 15000000,
      annualRevenue: 8500000,
      employeeCount: 35,
      certified: true
    },
    {
      id: "PME-1277-MA",
      name: "Atlas Digital Technologies SARL",
      sector: "Technologie & Digital",
      location: "Casablanca",
      maxCapacity: 5000000,
      annualRevenue: 2800000,
      employeeCount: 12,
      certified: true
    },
    {
      id: "PME-5541-MA",
      name: "Jardins de l'Atlas Espaces Verts",
      sector: "Services / Espaces Verts",
      location: "Meknès",
      maxCapacity: 4000000,
      annualRevenue: 1900000,
      employeeCount: 8,
      certified: false
    },
    {
      id: "PME-4110-MA",
      name: "MedicaDistri Maroc S.A.",
      sector: "Santé / Matériel Médical",
      location: "Rabat",
      maxCapacity: 25000000,
      annualRevenue: 18000000,
      employeeCount: 22,
      certified: true
    }
  ];

  const [selectedPmeId, setSelectedPmeId] = useState<string>("PME-1277-MA"); // Casablanca Tech default
  const [suggestions, setSuggestions] = useState<MatchingBidSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Filters for PME matching on opportunities
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [sectorFilter, setSectorFilter] = useState<string>("");
  
  // Alert settings
  const [alertToggles, setAlertToggles] = useState<Record<string, boolean>>({});

  // Checklist of required documents
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; status: "✅ Fourni" | "⏳ En cours" | "❌ Manquant" }>>([
    { id: "doc1", name: "Déclaration sur l'honneur (Modèle réglementaire unique)", status: "✅ Fourni" },
    { id: "doc2", name: "Attestation fiscale de régularité DGI (Moins de 6 mois)", status: "✅ Fourni" },
    { id: "doc3", name: "Attestation d'affiliation active CNSS Maroc", status: "⏳ En cours" },
    { id: "doc4", name: "Dossier technique de références de projets d'envergure", status: "❌ Manquant" },
    { id: "doc5", name: "Certificat d'immatriculation au Registre du Commerce (RC)", status: "✅ Fourni" }
  ]);

  const [selectedBidForChecklist, setSelectedBidForChecklist] = useState<string>("AO-2026-REC-01");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchSuggestions = async (pmeId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pme-matching?pmeId=${pmeId}`);
      const json = await res.json();
      if (json.status === "success") {
        setSuggestions(json.suggestions);
      }
    } catch (err) {
      console.error("Error fetching matching sugestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(selectedPmeId);
  }, [selectedPmeId]);

  const toggleAlert = (bidId: string) => {
    setAlertToggles(prev => {
      const updated = { ...prev, [bidId]: !prev[bidId] };
      setNotification(`Succès : Alerte SMS & Email programmée pour l'AO #${bidId}.`);
      setTimeout(() => setNotification(null), 3000);
      return updated;
    });
  };

  const handleDocumentAction = (docId: string) => {
    setDocuments(prev => 
      prev.map(doc => {
        if (doc.id === docId) {
          const nextStatus = doc.status === "❌ Manquant" ? "✅ Fourni" : "❌ Manquant";
          return { ...doc, status: nextStatus as any };
        }
        return doc;
      })
    );
  };

  const handleInvitePme = (pmeName: string) => {
    setNotification(`Succès : Invitation protocolaire officiellement adressée aux administrateurs de ${pmeName}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const activePme = PME_PROFILES.find(p => p.id === selectedPmeId) || PME_PROFILES[1];

  return (
    <div className="space-y-6" id="pme-module-container">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-100 tracking-tight">
            Matching & Opportunités PME / TPE
          </h2>
          <h3 className="text-xs text-neutral-400 mt-1 leading-relaxed">
            مواءمة الصفقات وتسهيل ولوج المقاولات الوطنية الصغرى والمتوسطة وفقاً للمقاييس التفضيلية
          </h3>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/40 border border-[#2D6A4F] text-emerald-400 rounded-lg text-xs font-mono flex items-center justify-between animate-bounce">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-[10px] hover:underline uppercase">Fermer</button>
        </div>
      )}

      {/* Rôle 1: PME / TPE View */}
      {role === "pme" && (
        <div className="space-y-6">
          
          {/* Profile Quick Change Bar representing different users */}
          <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500">Choisir une simulation d'entreprise</span>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {PME_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPmeId(p.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        selectedPmeId === p.id 
                          ? "bg-[#2D6A4F] text-white border-[#2D6A4F] font-bold" 
                          : "bg-black/40 border-white/5 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {p.name.split(" ")[0]} ({p.location})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile completion rate bar */}
            <div className="w-full md:w-60 text-xs">
              <div className="flex justify-between items-center mb-1 text-[10px] font-mono text-neutral-400">
                <span>Dossier Administratif</span>
                <span className="text-emerald-400 font-bold">70% complet</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "70%" }} />
              </div>
              <p className="text-[9px] text-[#D4A017] mt-1 italic">Complétez les 30% restants pour de meilleures recommandations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Left Opportunities columns (60%) */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300">
                  Opportunités préconisées par l'algorithmique d'appariement
                </h4>
                <div className="text-[10px] text-neutral-500">Modifiée selon le secteur d'activité : <strong>{activePme.sector}</strong></div>
              </div>

              {loading ? (
                <div className="h-44 bg-neutral-900 border border-white/5 rounded-xl flex items-center justify-center text-xs font-mono">
                  Calcul en cours...
                </div>
              ) : (
                suggestions.map((sug) => (
                  <div 
                    key={sug.bidId}
                    className="p-4 bg-white/[0.01] border border-white/5 rounded-xl hover:border-emerald-600/30 transition-all space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#D4A017] font-bold">{sug.bidId}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#2D6A4F]/10 text-emerald-400 border border-[#2D6A4F]/25 text-[9px] font-bold">
                            92% compatible
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-100 mt-1.5 tracking-tight">{sug.title}</h3>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{sug.buyer}</p>
                      </div>

                      {/* SMS alerts config */}
                      <button 
                        onClick={() => toggleAlert(sug.bidId)}
                        className={`p-2 rounded-lg transition-all ${
                          alertToggles[sug.bidId] 
                            ? "bg-[#2D6A4F]/10 text-emerald-400 border border-[#2D6A4F]" 
                            : "bg-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                        title="Programmer une alerte par SMS"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Explanations of suitability matches */}
                    <div className="p-3 bg-neutral-900/40 rounded-lg text-xs space-y-2">
                      <div className="text-[10px] font-mono text-neutral-400 font-bold uppercase">{sug.reasonCount}</div>
                      <ul className="space-y-1 text-[11px] text-neutral-300">
                        {sug.reasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-[#2D6A4F] font-bold shrink-0">✓</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <div>
                        <span className="text-neutral-500">Estimation Budget : </span>
                        <strong className="text-[#D4A017]">{(sug.budget / 1000000).toFixed(1)} M MAD</strong>
                      </div>
                      <button 
                        onClick={() => setSelectedBidForChecklist(sug.bidId)}
                        className="text-neutral-400 hover:text-white flex items-center gap-1 hover:underline text-[11px]"
                      >
                        Vérifier mon dossier <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Right checklist column (40%) */}
            <div className="lg:col-span-2">
              <div className="bg-[#111111] border border-white/5 rounded-xl p-5 space-y-4">
                <div className="border-b border-white/5 pb-2.5">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-200">
                    📂 Assistant Dossier TGR / الصفقات
                  </h4>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Vérification de conformité pour le marché {selectedBidForChecklist}</p>
                </div>

                <div className="space-y-3.5">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id}
                      className="p-2.5 rounded-lg bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-start gap-2.5 max-w-[200px]">
                        <input
                          type="checkbox"
                          checked={doc.status === "✅ Fourni"}
                          onChange={() => handleDocumentAction(doc.id)}
                          className="accent-[#2D6A4F] mt-1 cursor-pointer h-3.5 w-3.5"
                        />
                        <div>
                          <p className="text-[11px] font-semibold text-neutral-200 leading-normal">{doc.name}</p>
                          <span className={`text-[9px] font-mono mt-1 inline-block ${
                            doc.status === "✅ Fourni" ? "text-emerald-400" : doc.status === "⏳ En cours" ? "text-amber-500" : "text-red-500"
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      </div>

                      {doc.status !== "✅ Fourni" && (
                        <button 
                          onClick={() => handleDocumentAction(doc.id)} 
                          className="text-[9px] uppercase font-mono text-[#D4A017] hover:underline"
                        >
                          Fournir / تحميل
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-900 p-3 rounded-lg flex items-center gap-2 justify-between">
                  <div className="text-[10px] text-neutral-400">Prêt pour dépôt de signature électronique?</div>
                  <button className="bg-[#2D6A4F] hover:bg-[#1e4634] text-white font-bold py-1 px-2.5 rounded text-[10px] uppercase font-mono">
                    Valider le dossier
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Rôle 2: Acheteur Public adaptation view */}
      {role === "acheteur" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-2">
            <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300">
              Analyse de Capacité : Recommandation de PMEs Nationales pour vos marchés d'allotissement
            </h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Le Décret N° 2-22-431 prescrit d'inviter préférentiellement des PMEs pour les marchés d'études et travaux &lt; 15M MAD</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PME_PROFILES.map((pme) => (
              <div 
                key={pme.id}
                className="bg-[#111111] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-48"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-neutral-500">{pme.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      pme.certified ? "bg-emerald-950 text-emerald-400" : "bg-neutral-800 text-neutral-400"
                    }`}>
                      {pme.certified ? "PROFIL AGRÉÉ" : "RECHERCHE GROUPAGE"}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-neutral-100 mt-2 tracking-tight">{pme.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{pme.location}</span>
                  </div>

                  <div className="mt-2.5 border-t border-white/[0.04] pt-2 flex justify-between text-[10px]">
                    <span className="text-neutral-500">Capacité max :</span>
                    <strong className="text-[#D4A017]">{(pme.maxCapacity / 1000000).toFixed(1)} M MAD</strong>
                  </div>
                </div>

                <button 
                  onClick={() => handleInvitePme(pme.name)}
                  className="w-full text-center py-2 bg-[#2D6A4F] hover:bg-[#1e4634] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Inviter à Soumissionner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom status bar in Moroccan public statistics */}
      <div className="bg-[#111] border border-white/5 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono text-neutral-500">PME/TPE inscrites sur MPI Maroc</span>
          <span className="text-lg font-black text-white mt-1">12 487 Sociétés nationales</span>
        </div>
        <div className="flex flex-col border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0">
          <span className="text-[10px] uppercase font-mono text-neutral-500">Marchés attribués ce trimestre</span>
          <span className="text-lg font-black text-[#D4A017] mt-1">1 245 M MAD (Quota 38.5%)</span>
        </div>
        <div className="flex flex-col border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0">
          <span className="text-[10px] uppercase font-mono text-neutral-500">Province la plus active active</span>
          <span className="text-lg font-black text-emerald-400 mt-1">Région Casablanca-Settat</span>
        </div>
      </div>

    </div>
  );
}
