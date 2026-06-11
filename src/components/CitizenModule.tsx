import React, { useState } from "react";
import { 
  Globe, 
  Search, 
  Download, 
  TrendingUp, 
  Award, 
  Users, 
  CheckCircle2, 
  Sliders, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Coins
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie,
  Legend
} from "recharts";

// 5 years PME participation trend
const PME_PARTICIPATION_5_YEARS = [
  { year: "2022", rate: 21 },
  { year: "2023", rate: 26 },
  { year: "2024", rate: 32 },
  { year: "2025", rate: 36 },
  { year: "2026", rate: 38.5 }
];

const PAYMENT_DELAYS_BY_SECTOR = [
  { sector: "BTP", days: 38, color: "#C1121F" },
  { sector: "Services", days: 25, color: "#2D6A4F" },
  { sector: "Tech", days: 18, color: "#D4A017" },
  { sector: "Santé", days: 42, color: "#D97706" }
];

const RESOLVED_ANOMALIES_STATUS = [
  { name: "Transmises IGAT", value: 34, color: "#C1121F" },
  { name: "Sous examen", value: 45, color: "#D97706" },
  { name: "Classées conformes", value: 23, color: "#2D6A4F" },
  { name: "Archivées", value: 10, color: "#40916C" }
];

const REGISTERED_AWARDS = [
  { id: "AO-2026-004", title: "Extension réseau télécom fibre optique", buyer: "Ministère de la Transition Numérique", supplier: "TechMaghreb SARL", budget: "8 500 000 MAD", date: "15-05-2026" },
  { id: "AO-2026-118", title: "Acquisition de consommables d'hémodialyse", buyer: "Direction Régionale Santé Casablanca", supplier: "MedicaDistri Maroc", budget: "12 400 000 MAD", date: "12-05-2026" },
  { id: "AO-2026-602", title: "Restauration du monument historique de Chellah", buyer: "Ministère de la Culture", supplier: "Driouch Patrimoine S.A.", budget: "4 200 000 MAD", date: "01-05-2026" },
  { id: "AO-2026-091", title: "Prestations d'entretien et reboisement Rabat", buyer: "ONEE - Branche Eau Potable", supplier: "Jardins de l'Atlas", budget: "1 900 000 MAD", date: "28-04-2026" },
  { id: "AO-2026-056", title: "Licences d'infrastructure cloud e-gov", buyer: "Agence de Développement du Digital (ADD)", supplier: "Atlas Solution", budget: "6 000 000 MAD", date: "24-04-2026" }
];

const MINISTRIES_TRANSPARENCY_RANKING = [
  { rank: 1, name: "Ministère de la Justice / العدل", score: 94, trend: "+2.4%", count: 114, status: "EXEMPLAIRE", color: "bg-emerald-950 text-emerald-400 border-emerald-900" },
  { rank: 2, name: "Ministère des Finances / المالية", score: 92, trend: "+1.5%", count: 215, status: "EXEMPLAIRE", color: "bg-emerald-950 text-emerald-400 border-emerald-900" },
  { rank: 3, name: "Ministère de l'Équipement / التجهيز", score: 86, trend: "-0.5%", count: 320, status: "CONFORME", color: "bg-[#2D6A4F]/20 text-emerald-400 border-[#2D6A4F]/30" },
  { rank: 4, name: "Ministère de l'Éducation / التعليم", score: 72, trend: "+4.1%", count: 480, status: "CONFORME", color: "bg-[#2D6A4F]/20 text-emerald-400 border-[#2D6A4F]/30" },
  { rank: 5, name: "Ministère de la Santé / الصحة", score: 64, trend: "-3.2%", count: 340, status: "A_AMELIORER", color: "bg-red-950 text-red-400 border-red-900/30" }
];

export default function CitizenModule() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const handleCsvExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);

    // Simulated CSV generation
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Référence,Objet,Acheteur,Titulaire,Montant,Date"].join(",") + "\n"
      + REGISTERED_AWARDS.map(e => [e.id, e.title, e.buyer, e.supplier, e.budget.replace(/\s/g, ""), e.date].join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registre_marchis_publics_maroc.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAwards = REGISTERED_AWARDS.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8" id="citizen-transparency-portal">
      
      {/* Hero Open-Data layout banner */}
      <div className="relative text-center p-8 bg-gradient-to-br from-red-950/20 via-[#111] to-emerald-950/15 border border-white/5 rounded-2xl space-y-4 overflow-hidden">
        {/* Sovereign background star watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-80 h-80 text-white">
            <polygon points="50,5 64,36 98,36 71,57 81,91 50,70 19,91 29,57 2,36 36,36" />
          </svg>
        </div>

        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 text-[#40916C] border border-[#2D6A4F]/30 rounded-full text-[10px] font-mono tracking-wider font-bold uppercase mx-auto">
            <Globe className="w-3.5 h-3.5 animate-spin" /> Portail Public National / بوابة الشفافية
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight">
            La commande publique marocaine en toute transparence
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Consultez le registre complet d'adjudication, l'évaluation de l'intégrité des ministères et les statistiques macroéconomiques de la souveraineté.
          </p>
        </div>
      </div>

      {/* Grid: 1. Explorer les marchés list (Left 55%) vs 2. Ministry rankings (Right 45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Registry Open AO table (55%) */}
        <div className="lg:col-span-3 bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300">
                  1. Explorer les adjudications / أرشيف الصفقات الممنوحة
                </h4>
                <p className="text-[10px] text-neutral-500 mt-0.5">Registre de contrôle public des marchés attribués</p>
              </div>

              {/* Action buttons */}
              <button 
                onClick={handleCsvExport} 
                className="bg-[#2D6A4F] hover:bg-[#1e4634] text-white px-3 py-1.5 rounded text-[11px] font-mono uppercase transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export OCDS CSV
              </button>
            </div>

            {/* Quick search register bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                className="w-full bg-black/40 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-[#C1121F] text-neutral-200"
                placeholder="Filtrer par société, objet, ID marché..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-900/60 text-neutral-500 font-mono text-[9px] uppercase border-b border-white/5">
                    <th className="p-3">Ref</th>
                    <th className="p-3">Attribuable</th>
                    <th className="p-3">Titulaire</th>
                    <th className="p-3 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredAwards.map((aw) => (
                    <tr key={aw.id} className="hover:bg-white/[0.01]">
                      <td className="p-3 font-mono font-bold text-[#D4A017]">{aw.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-neutral-200">{aw.title}</div>
                        <div className="text-[10px] text-neutral-500 lg:max-w-[200px] truncate">{aw.buyer}</div>
                      </td>
                      <td className="p-3 font-semibold text-neutral-300">{aw.supplier}</td>
                      <td className="p-3 text-right font-mono font-bold text-white whitespace-nowrap">{aw.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Ministries rankings (45%) */}
        <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/5 pb-2.5">
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300">
                2. Score d'Intégrité par Ministère / ترتيب نزاهة القطاعات الوزارية
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Calculé dynamiquement sur la base du SDA-MP et de l'accès PME</p>
            </div>

            {/* Table ranks */}
            <div className="space-y-3">
              {MINISTRIES_TRANSPARENCY_RANKING.map((min, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 text-[#D4A017] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-neutral-200">{min.name.split(" / ")[0]}</h3>
                      <span className="text-[8px] text-neutral-400 font-serif block mt-0.5" dir="rtl">{min.name.split(" / ")[1]}</span>
                      <span className="text-[9px] text-neutral-500 font-mono mt-1 inline-block">({min.count} marchés audités)</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-white font-mono">{min.score}%</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ml-1.5 block mt-1 ${min.color}`}>
                      {min.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* National infographics cards (3 main blocks) */}
      <div className="space-y-4">
        <div className="border-b border-white/5 pb-2">
          <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-300">
            3. Statistiques Nationales et Analyse Macroéconomique / الإحصائيات الوطنية الكبرى
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1 : PME Multi-year trend (Area Chart line) */}
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col h-[260px] justify-between">
            <div>
              <h4 className="text-xs font-bold text-neutral-200 font-mono">
                Évolution de la participation PME/TPE
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Quota d'attribution des marchés de l'État sur 5 ans</p>
            </div>
            <div className="flex-1 w-full text-xs py-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PME_PARTICIPATION_5_YEARS} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#888" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px" }} />
                  <Line type="monotone" dataKey="rate" stroke="#40916C" strokeWidth="2.5" name="Taux %" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Box 2 : Delays bar (Bar Chart) */}
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col h-[260px] justify-between">
            <div>
              <h4 className="text-xs font-bold text-neutral-200 font-mono">
                Délais moyens de paiement par secteur (Jours)
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Temps de carence de remboursement budgétaire TGR</p>
            </div>
            <div className="flex-1 w-full text-xs py-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PAYMENT_DELAYS_BY_SECTOR} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="sector" tick={{ fontSize: 9, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 9, fill: "#888" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px" }} />
                  <Bar dataKey="days" fill="#D4A017" name="Jours" radius={[3, 3, 0, 0]}>
                    {PAYMENT_DELAYS_BY_SECTOR.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Box 3 : Treated anomalies (Donut Chart) */}
          <div className="bg-[#111] border border-white/5 rounded-xl p-5 flex flex-col h-[260px] justify-between">
            <div>
              <h4 className="text-xs font-bold text-neutral-200 font-mono">
                Traitement des anomalies ce trimestre
              </h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">Actions correctrices ordonnées d'office</p>
            </div>
            <div className="flex-1 w-full text-xs relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RESOLVED_ANOMALIES_STATUS}
                    cx="50%"
                    cy="45%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {RESOLVED_ANOMALIES_STATUS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", fontSize: "10px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
