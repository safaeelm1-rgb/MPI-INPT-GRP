import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, TrendingUp, MapPin } from "lucide-react";

interface RegionData {
  id: string;
  name: string;
  nameAr: string;
  riskScore: number;
  anomaliesCount: number;
  majorAnomaly: string;
  topBuyer: string;
  activeBudget: string;
  // Approximated path/polygon parameters for premium abstract viz
  bx: number; 
  by: number;
  width: number;
  height: number;
  // SVG coordinates for a beautiful, responsive layout representing Morocco's shape
  svgPath: string;
}

const REGION_LIST: RegionData[] = [
  {
    id: "tanger",
    name: "Tanger-Tétouan-Al Hoceïma",
    nameAr: "طنجة - تطوان - الحسيمة",
    riskScore: 35,
    anomaliesCount: 12,
    majorAnomaly: "Écarts suspects d'adjudication",
    topBuyer: "Wilaya de Tanger-Tétouan",
    activeBudget: "1.2 Md MAD",
    svgPath: "M 130 50 L 145 60 L 138 72 L 122 68 L 115 58 Z"
  },
  {
    id: "oriental",
    name: "L'Oriental",
    nameAr: "الجهة الشرقية",
    riskScore: 42,
    anomaliesCount: 15,
    majorAnomaly: "Délais de remise trop restreints",
    topBuyer: "Conseil Régional de l'Oriental",
    activeBudget: "850 M MAD",
    svgPath: "M 145 60 L 165 75 L 155 110 L 135 105 L 138 72 Z"
  },
  {
    id: "fes",
    name: "Fès-Meknès",
    nameAr: "فاس - مكناس",
    riskScore: 58,
    anomaliesCount: 19,
    majorAnomaly: "Attributaire unique répété",
    topBuyer: "Université Sidi Mohamed Ben Abdellah",
    activeBudget: "1.4 Md MAD",
    svgPath: "M 122 68 L 138 72 L 135 105 L 118 100 L 115 80 Z"
  },
  {
    id: "rabat",
    name: "Rabat-Salé-Kénitra",
    nameAr: "الرباط - سلا - القنيطرة",
    riskScore: 65,
    anomaliesCount: 22,
    majorAnomaly: "Clauses discriminatoires (ADD)",
    topBuyer: "Ministère de la Transition Numérique",
    activeBudget: "3.2 Mds MAD",
    svgPath: "M 115 58 L 122 68 L 115 85 L 102 75 L 108 60 Z"
  },
  {
    id: "casa",
    name: "Casablanca-Settat",
    nameAr: "الدار البيضاء - سطات",
    riskScore: 85,
    anomaliesCount: 34,
    majorAnomaly: "Collusion d'offres (BTP)",
    topBuyer: "Wilaya de Casablanca-Settat",
    activeBudget: "5.4 Mds MAD",
    svgPath: "M 102 75 L 115 85 L 108 108 L 88 100 L 90 85 Z"
  },
  {
    id: "beni",
    name: "Béni Mellal-Khénifra",
    nameAr: "بني ملال - خنيفرة",
    riskScore: 28,
    anomaliesCount: 8,
    majorAnomaly: "Cahier des charges standardisé",
    topBuyer: "Académie Régionale d'Éducation (AREF)",
    activeBudget: "600 M MAD",
    svgPath: "M 118 100 L 135 105 L 122 130 L 105 125 L 108 108 Z"
  },
  {
    id: "marrakech",
    name: "Marrakech-Safi",
    nameAr: "مراكش - آسفي",
    riskScore: 74,
    anomaliesCount: 21,
    majorAnomaly: "Offre anormalement basse (Santé)",
    topBuyer: "Direction Régionale de la Santé",
    activeBudget: "1.9 Md MAD",
    svgPath: "M 88 100 L 105 125 L 95 150 L 72 135 L 75 112 Z"
  },
  {
    id: "draa",
    name: "Drâa-Tafilalet",
    nameAr: "درعة - تافيلالت",
    riskScore: 19,
    anomaliesCount: 5,
    majorAnomaly: "Délai d'approbation allongé",
    topBuyer: "Province d'Errachidia",
    activeBudget: "450 M MAD",
    svgPath: "M 105 125 L 122 130 L 132 165 L 110 178 L 95 150 Z"
  },
  {
    id: "souss",
    name: "Souss-Massa",
    nameAr: "سوس - ماسة",
    riskScore: 38,
    anomaliesCount: 11,
    majorAnomaly: "Marché sans concurrence active",
    topBuyer: "Conseil Régional Souss-Massa",
    activeBudget: "1.1 Md MAD",
    svgPath: "M 72 135 L 95 150 L 85 190 L 58 178 L 62 152 Z"
  },
  {
    id: "guelmim",
    name: "Guelmim-Oued Noun",
    nameAr: "كلميم - واد نون",
    riskScore: 15,
    anomaliesCount: 3,
    majorAnomaly: "Absence de clauses d'allotissement",
    topBuyer: "Agence de l'Oriental & Sud",
    activeBudget: "350 M MAD",
    svgPath: "M 58 178 L 85 190 L 72 230 L 42 205 L 48 185 Z"
  },
  {
    id: "laayoune",
    name: "Laâyoune-Sakia El Hamra",
    nameAr: "العيون - الساقية الحمراء",
    riskScore: 12,
    anomaliesCount: 2,
    majorAnomaly: "Faible participation des PME",
    topBuyer: "Wilaya de Laâyoune",
    activeBudget: "780 M MAD",
    svgPath: "M 42 205 L 72 230 L 55 270 L 25 240 Z"
  },
  {
    id: "dakhla",
    name: "Dakhla-Oued Ed-Dahab",
    nameAr: "الداخلة - وادي الذهب",
    riskScore: 8,
    anomaliesCount: 1,
    majorAnomaly: "Seuils d'admission rigides",
    topBuyer: "Conseil Régional Dakhla",
    activeBudget: "520 M MAD",
    svgPath: "M 25 240 L 55 270 L 30 338 L 10 290 Z"
  }
].map((reg, index) => {
  // Let's attach bounding details for visual map pointers
  return {
    ...reg,
    bx: 120 - index * 6,
    by: 80 + index * 18,
    width: 40,
    height: 35
  };
});

export default function MoroccoMap({ onRegionSelect }: { onRegionSelect?: (regName: string) => void }) {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(REGION_LIST[4]); // Casablanca default on load
  const [selectedRegionId, setSelectedRegionId] = useState<string>("casa");

  const getScoreColor = (score: number) => {
    if (score >= 75) return "#C1121F"; // Red Alert
    if (score >= 50) return "#D97706"; // Amber Warning
    return "#40916C"; // Green Safe
  };

  const getScoreColorBg = (score: number) => {
    if (score >= 75) return "rgba(193, 18, 31, 0.25)";
    if (score >= 50) return "rgba(217, 119, 6, 0.2)";
    return "rgba(64, 145, 108, 0.2)";
  };

  const getScoreColorBorder = (score: number) => {
    if (score >= 75) return "rgba(193, 18, 31, 1)";
    if (score >= 50) return "rgba(217, 119, 6, 1)";
    return "rgba(64, 145, 108, 1)";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full h-full" id="root-morocco-map">
      {/* Map visual */}
      <div className="flex-1 min-h-[380px] lg:min-h-[460px] bg-[#111] border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-4 left-4 z-10">
          <h4 className="text-sm font-mono tracking-wider text-neutral-400 uppercase">
            Carte Vectorielle Souveraine / الخريطة الوطنية للمخاطر
          </h4>
          <p className="text-xs text-neutral-500 mt-1">Interagir pour filtrer les indicateurs régionaux</p>
        </div>

        {/* Flag Red-Green Micro-Accent */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-md border border-white/5">
          <span className="w-2 h-2 rounded-full bg-[#C1121F] animate-ping" />
          <span className="text-[10px] uppercase font-mono text-[#D4A017]">SIG-MPI LIVE</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-white/5 text-xs">
          <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold mb-1">Indice de Risque</div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#C1121F]" />
            <span className="text-neutral-300">Critique / مرتفع (≥ 75%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#D97706]" />
            <span className="text-neutral-300">Modéré / متوسط (50-74%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#40916C]" />
            <span className="text-neutral-300">Sous Contrôle / متحكم فيه (&lt; 50%)</span>
          </div>
        </div>

        {/* Dynamic Map Body */}
        <div className="w-full flex-1 flex items-center justify-center py-6">
          <svg
            viewBox="0 0 190 360"
            className="w-full max-w-[280px] h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] cursor-crosshair transform scale-105"
            style={{ maxHeight: "380px" }}
          >
            {/* Grid Coordinates behind map */}
            <g className="opacity-15 font-mono text-[6px]" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25">
              <line x1="10" y1="50" x2="180" y2="50" />
              <line x1="10" y1="110" x2="180" y2="110" />
              <line x1="10" y1="180" x2="180" y2="180" />
              <line x1="10" y1="250" x2="180" y2="250" />
              <line x1="10" y1="310" x2="180" y2="310" />
              <line x1="45" y1="10" x2="45" y2="350" />
              <line x1="100" y1="10" x2="100" y2="350" />
              <line x1="150" y1="10" x2="150" y2="350" />
            </g>

            <g>
              {REGION_LIST.map((region) => {
                const isHovered = hoveredRegion?.id === region.id;
                const isSelected = selectedRegionId === region.id;
                const color = getScoreColor(region.riskScore);
                const fillBg = getScoreColorBg(region.riskScore);
                const borderPrimary = getScoreColorBorder(region.riskScore);

                return (
                  <path
                    key={region.id}
                    d={region.svgPath}
                    fill={isHovered || isSelected ? color : fillBg}
                    stroke={isSelected ? "#D4A017" : borderPrimary}
                    strokeWidth={isSelected ? "1.5" : isHovered ? "1" : "0.5"}
                    opacity={isHovered ? 0.95 : isSelected ? 0.9 : 0.75}
                    className="transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] hover:opacity-100"
                    onMouseEnter={() => setHoveredRegion(region)}
                    onClick={() => {
                      setSelectedRegionId(region.id);
                      if (onRegionSelect) onRegionSelect(region.name);
                    }}
                  />
                );
              })}
            </g>

            {/* Glowing active state indicators */}
            {REGION_LIST.map((reg) => {
              if (reg.riskScore >= 70) {
                // Return pulsing circle on critical threat spots
                const extractCoords = reg.svgPath.match(/M\s+(\d+)\s+(\d+)/);
                if (extractCoords) {
                  const cx = parseInt(extractCoords[1]);
                  const cy = parseInt(extractCoords[2]);
                  return (
                    <g key={`ping-${reg.id}`}>
                      <circle cx={cx} cy={cy} r="2.5" fill="#C1121F" />
                      <circle cx={cx} cy={cy} r="6" stroke="#C1121F" strokeWidth="0.5" fill="none" className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                    </g>
                  );
                }
              }
              return null;
            })}
          </svg>
        </div>
      </div>

      {/* Region details sidebar */}
      <div className="w-full lg:w-[320px] bg-[#111111] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
        {hoveredRegion ? (
          <div className="flex-1 flex flex-col" key={hoveredRegion.id}>
            <div className="flex items-start justify-between border-b border-white/5 pb-3">
              <div>
                <div className="flex items-center gap-1 text-xs text-[#D4A017] uppercase tracking-wider font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  Territoire Marocain
                </div>
                <h3 className="text-lg font-bold text-neutral-100 mt-1 tracking-tight">
                  {hoveredRegion.name}
                </h3>
                <h4 className="text-xs text-neutral-400 font-serif leading-relaxed mt-0.5" dir="rtl">
                  {hoveredRegion.nameAr}
                </h4>
              </div>
            </div>

            {/* Main stats matrix */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase font-mono">Score de Risque</span>
                <span className="text-2xl font-bold tracking-tight mt-1" style={{ color: getScoreColor(hoveredRegion.riskScore) }}>
                  {hoveredRegion.riskScore}%
                </span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col">
                <span className="text-[10px] text-neutral-400 uppercase font-mono">Incidents SDA</span>
                <span className="text-2xl font-bold text-neutral-100 tracking-tight mt-1">
                  {hoveredRegion.anomaliesCount} AOs
                </span>
              </div>
            </div>

            {/* Extra details list */}
            <div className="space-y-3.5 mt-5 flex-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-500 uppercase font-mono">Alerte Prioritaire</span>
                <p className="text-xs text-neutral-200 bg-red-950/20 border border-red-900/10 p-2.5 rounded-lg">
                  🚨 {hoveredRegion.majorAnomaly}
                </p>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                  <span className="text-neutral-500 font-mono">Acheteur Dominant:</span>
                  <span className="text-neutral-300 font-medium truncate max-w-[160px]" title={hoveredRegion.topBuyer}>
                    {hoveredRegion.topBuyer}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                  <span className="text-neutral-500 font-mono">Budget Engagé Région:</span>
                  <span className="text-[#D4A017] font-bold">
                    {hoveredRegion.activeBudget}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-neutral-500 font-mono">Niveau d'Analyse AI:</span>
                  <span className="text-[#2D6A4F] font-bold">100% (Modèle LSTM)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5">
              <button 
                onClick={() => onRegionSelect && onRegionSelect(hoveredRegion.name)} 
                className="w-full text-center py-2.5 rounded-lg bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-[#C1121F] hover:text-white transition-all pointer-events-auto"
              >
                Filtrer Mission Control
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-neutral-500 text-xs">
            Survolez une région pour afficher ses indicateurs détaillés.
          </div>
        )}
      </div>
    </div>
  );
}
