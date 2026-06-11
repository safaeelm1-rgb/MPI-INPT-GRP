import React, { useState } from "react";
import { Users, Building, ShieldAlert, Key } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: "company" | "director";
  risk: "high" | "medium" | "low";
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  label: string;
  severity: "critical" | "warning" | "normal";
}

const SAMPLE_NETWORKS: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  "AO-2026-M-014": {
    nodes: [
      { id: "c1", label: "TechMaghreb SARL", type: "company", risk: "high", x: 60, y: 150 },
      { id: "c2", label: "DataNet SARL", type: "company", risk: "high", x: 340, y: 150 },
      { id: "d1", label: "Kamil Alami (Actionnaire 45%)", type: "director", risk: "high", x: 200, y: 70 },
      { id: "d2", label: "M. El Fassi (Administrateur)", type: "director", risk: "medium", x: 200, y: 230 },
      { id: "c3", label: "Atlas Solution S.A.", type: "company", risk: "low", x: 200, y: 310 }
    ],
    edges: [
      { source: "c1", target: "d1", label: "Bénéficiaire Effectif Commun", severity: "critical" },
      { source: "c2", target: "d1", label: "Bénéficiaire Effectif Commun", severity: "critical" },
      { source: "c1", target: "d2", label: "Signature Mandataire", severity: "warning" },
      { source: "c2", target: "d2", label: "Adresse physique identique OMPIC", severity: "critical" },
      { source: "c3", target: "d2", label: "Ancien administrateur", severity: "normal" }
    ]
  },
  "AO-2026-S-089": {
    nodes: [
      { id: "c1", label: "ADD Partner Pro", type: "company", risk: "medium", x: 80, y: 110 },
      { id: "c2", label: "Global System Morocco", type: "company", risk: "high", x: 320, y: 160 },
      { id: "d1", label: "Y. Bennani (Concepteur Cahier Charges)", type: "director", risk: "high", x: 200, y: 90 },
      { id: "d2", label: "F. Filali (Épouse de l'acheteur)", type: "director", risk: "high", x: 200, y: 220 }
    ],
    edges: [
      { source: "c1", target: "d1", label: "Avis consultatif exclusif", severity: "warning" },
      { source: "c2", target: "d2", label: "Porte-part sociale 50%", severity: "critical" },
      { source: "d1", target: "d2", label: "Lien de parenté direct", severity: "critical" }
    ]
  },
  "default": {
    nodes: [
      { id: "c1", label: "Carthago Travaux S.A.", type: "company", risk: "low", x: 90, y: 140 },
      { id: "c2", label: "Souss Gros Oeuvre SARL", type: "company", risk: "medium", x: 310, y: 140 },
      { id: "d1", label: "Omar Souss (Directeur Technique)", type: "director", risk: "medium", x: 200, y: 220 }
    ],
    edges: [
      { source: "c1", target: "d1", label: "Gérant Associé", severity: "normal" },
      { source: "c2", target: "d1", label: "Conseiller technique", severity: "warning" }
    ]
  }
};

export default function NetworkGraph({ marketId }: { marketId: string }) {
  const data = SAMPLE_NETWORKS[marketId] || SAMPLE_NETWORKS["default"];
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const getNodeColor = (node: Node) => {
    if (node.id === hoveredNode?.id) return "#D4A017"; // Gold for selection
    if (node.type === "company") {
      return node.risk === "high" ? "#C1121F" : node.risk === "medium" ? "#D97706" : "#2D6A4F";
    }
    return "#525252"; // Director grey
  };

  const getEdgeStroke = (edge: Edge) => {
    if (edge.severity === "critical") return "rgba(193, 18, 31, 0.75)";
    if (edge.severity === "warning") return "rgba(217, 119, 6, 0.6)";
    return "rgba(255, 255, 255, 0.15)";
  };

  return (
    <div className="w-full bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col justify-between h-96 relative overflow-hidden" id="node-link-network-graph">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400">
            Graphe Relationnel de Collusion (Registre OMPIC)
          </h4>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Survolez les entités pour auditer les liens d'intérêts croisés
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-900/15 px-2 py-0.5 rounded text-[10px] font-mono text-[#C1121F]">
          <ShieldAlert className="w-3 h-3" />
          SIG-OMPIC Connecté
        </div>
      </div>

      {/* SVG Canvas for Network Graph */}
      <div className="flex-1 w-full bg-black/40 rounded-lg border border-white/[0.03] relative min-h-[220px]">
        <svg viewBox="0 0 400 340" className="w-full h-full">
          {/* Definition of gradients and markers */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.25)" />
            </marker>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw Edges */}
          {data.edges.map((edge, idx) => {
            const sourceNode = data.nodes.find((n) => n.id === edge.source);
            const targetNode = data.nodes.find((n) => n.id === edge.target);

            if (!sourceNode || !targetNode) return null;

            const isEdgeHovered = hoveredNode?.id === sourceNode.id || hoveredNode?.id === targetNode.id;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={getEdgeStroke(edge)}
                  strokeWidth={edge.severity === "critical" ? "2.5" : "1.5"}
                  strokeDasharray={edge.severity === "warning" ? "4,4" : undefined}
                  className="transition-all duration-300"
                  opacity={isEdgeHovered ? 1.0 : 0.4}
                />
                
                {/* Animated flowing light dot for suspicious edges */}
                {edge.severity === "critical" && (
                  <circle r="3" fill="#C1121F" className="animate-shimmer">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M ${sourceNode.x} ${sourceNode.y} L ${targetNode.x} ${targetNode.y}`}
                    />
                  </circle>
                )}

                {/* Edge Annotation */}
                {isEdgeHovered && (
                  <foreignObject
                    x={(sourceNode.x + targetNode.x) / 2 - 50}
                    y={(sourceNode.y + targetNode.y) / 2 - 10}
                    width="100"
                    height="24"
                    className="overflow-visible pointer-events-none"
                  >
                    <div className="bg-[#1a1a1a] border border-white/10 text-[7px] text-[#D4A017] px-1 py-0.5 rounded text-center truncate font-mono shadow-md">
                      {edge.label}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}

          {/* Draw Nodes */}
          {data.nodes.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            const size = node.type === "company" ? 12 : 9;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node)}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <circle
                    r={size + 6}
                    fill="none"
                    stroke="#D4A017"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="animate-spin"
                    style={{ transformOrigin: "0px 0px" }}
                  />
                )}

                {/* Main Node */}
                <circle
                  r={size}
                  fill={getNodeColor(node)}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />

                {/* Icon identifier Inside */}
                {node.type === "company" ? (
                  <rect x="-3" y="-3" width="6" height="6" fill="#0A0A0A" />
                ) : (
                  <circle r="2.5" fill="#0A0A0A" />
                )}

                {/* Label text */}
                <text
                  y={size + 11}
                  textAnchor="middle"
                  className="fill-neutral-300 font-sans font-semibold pointer-events-none group-hover:fill-white selection:bg-transparent"
                  style={{ fontSize: "7px" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected target context drawer inside widget */}
        <div className="absolute bottom-2 left-2 right-2 bg-neutral-900/90 backdrop-blur p-2 rounded border border-white/5 text-[9px] flex items-center justify-between">
          {selectedNode ? (
            <div className="flex items-center gap-2 w-full">
              {selectedNode.type === "company" ? (
                <Building className="w-3.5 h-3.5 text-[#C1121F]" />
              ) : (
                <Users className="w-3.5 h-3.5 text-[#2D6A4F]" />
              )}
              <div className="flex-1 truncate">
                <span className="text-neutral-400 font-mono">Sélection : </span>
                <span className="text-neutral-200 font-bold">{selectedNode.label}</span>
              </div>
              <div className="flex items-center gap-1 bg-neutral-800 text-[#D4A017] px-1.5 py-0.5 rounded font-mono">
                Risque: {selectedNode.risk.toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="text-neutral-500 font-mono italic">
              Cliquez sur un noeud pour l'inspecter dans le registre des mandataires OMPIC.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
