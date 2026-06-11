/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { BidAnomaly, PmeProfile, MatchingBidSuggestion, CpsAnalysisResult, MarketStats } from "./src/types";

// Load environment variables (.env)
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily if key exists
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// -------------------------------------------------------------
// IN-MEMORY SEED DATA (AUTHENTIC MOROCCAN LABELS & VALUES)
// -------------------------------------------------------------

const SIMULATED_ANOMALIES: BidAnomaly[] = [
  {
    id: "AO-2026-M-014",
    title: "Terrassement et gros œuvre pour le Tribunal de Première Instance de Casablanca",
    buyer: "Ministère de la Justice - Direction de l'Équipement",
    region: "Casablanca-Settat",
    budget: 45000000,
    date: "2026-05-28",
    sector: "BTP / Infrastructures",
    anomalyType: "collusion",
    riskScore: 88,
    status: "CRITICAL",
    description: "Suspicion d'entente illicite (collusion) entre trois soumissionnaires historiques. Un écart de moins de 0.8% a été détecté entre leurs offres financières, avec des erreurs de calcul identiques dans le Bordereau des Prix Unitaires (BPU).",
    details: [
      "Soumissionnaires impliqués présentaient des adresses IP d'enregistrement d'offres quasi-identiques sur le portail des marchés publics.",
      "Offre la moins distante de l'estimation publique de seulement 0.23% (coïncidence statistique anormale au regard du Décret des Marchés Publics N° 2-22-431).",
      "Erreur d'écriture récurrente détectée à l'article 4.3 du BPU concernant l'acier de ferraillage."
    ]
  },
  {
    id: "AO-2026-S-089",
    title: "Acquisition de licences logicielles cloud et infrastructure réseau pour le pôle e-gov",
    buyer: "Agence de Développement du Digital (ADD)",
    region: "Rabat-Salé-Kénitra",
    budget: 12000000,
    date: "2026-05-22",
    sector: "Technologie & Digital",
    anomalyType: "criteria_bias",
    riskScore: 78,
    status: "FLAGGED",
    description: "Cahier des charges sur-mesure ou orienté. Les critères d'évaluation exigent une labellisation spécifique que seule une succursale locale détient, barrant la route aux TPE/PME nationales qualifiées.",
    details: [
      "Exigence d'une certification 'Elite Gold Integrator Custom 2025' détenue exclusivement par deux filiales de multinationales au Maroc.",
      "L'annexe technique réutilise des paragraphes entiers copiés-collés d'une documentation constructeur spécifique.",
      "Non-respect du principe d'équivalence visé par l'article 36 du décret marocain de passation des marchés."
    ]
  },
  {
    id: "AO-2026-M-201",
    title: "Aménagement paysager des espaces verts de la ville d'Ifrane",
    buyer: "Commune d'Ifrane / Province d'Ifrane",
    region: "Fès-Meknès",
    budget: 3200000,
    date: "2026-06-01",
    sector: "Services / Espaces Verts",
    anomalyType: "excessive_conditions",
    riskScore: 72,
    status: "UNDER_REVIEW",
    description: "Clauses restrictives barrant l'accès aux petites entreprises locales. Obligation de consigner un cautionnement provisoire disproportionné et de justifier d'un chiffre d'affaires cumulé démesuré.",
    details: [
      "Cautionnement provisoire fixé à 8% de l'estimation de l'administration (le plafond recommandé est de 1.5% à 3%).",
      "Le soumissionnaire doit documenter la livraison de projets similaires dans 4 pays d'Afrique du Nord, ce qui est non corrélé avec la nature du marché d'aménagement à Ifrane.",
      "PME locales exclues d'office malgré des compétences équivalentes."
    ]
  },
  {
    id: "AO-2026-B-071",
    title: "Fourniture de dispositifs médicaux standardisés pour les hôpitaux de Marrakech-Safi",
    buyer: "Direction Régionale de la Santé - Marrakech-Safi",
    region: "Marrakech-Safi",
    budget: 18500000,
    date: "2026-05-15",
    sector: "Santé / Matériel Médical",
    anomalyType: "underpricing",
    riskScore: 82,
    status: "CRITICAL",
    description: "Suspicion d'offre anormalement basse (dumping prédateur). L'attributaire présumé présente une remise financière de 42% par rapport à l'estimation de la commission, rendant l'exécution du service intenable à long terme.",
    details: [
      "Prix unitaire des masques de protection et gants chirurgicaux inférieur de 35% au coût moyen de revente officiel calculé par le HCP.",
      "Risque majeur de faillite en cours d'exécution ou d'emploi de matériaux non conformes mettant en péril la sécurité des patients.",
      "Aucune note justificative satisfaisante apportée par le soumissionnaire vis-à-vis de l'article 79 prescrivant l'analyse des offres anormalement basses."
    ]
  },
  {
    id: "AO-2026-D-409",
    title: "Travaux d'assainissement liquide et raccordement au réseau de la commune de Driouch",
    buyer: "Office National de l'Électricité et de l'Eau Potable (ONEE)",
    region: "L'Oriental",
    budget: 28000000,
    date: "2026-05-10",
    sector: "BTP / Infrastructures",
    anomalyType: "process_delay",
    riskScore: 65,
    status: "RESOLVED",
    description: "Anomalie de traitement administratif : Dépassement historique des délais réglementaires d'ouverture des plis (plus de 90 jours d'intervalle sans avenant publié), menaçant de pénaliser les cautions déposées.",
    details: [
      "Dépôt initial effectué le 10 Février; ouverture repoussée 3 fois de manière opaque.",
      "Absence d'explication fournie sur le portail e-procurement publique.",
      "Risque d'annulation tardive impactant fortement la trésorerie des soumissionnaires de taille moyenne."
    ]
  }
];

const SIMULATED_PMES: PmeProfile[] = [
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

const SIMULATED_STATS: MarketStats = {
  totalBidsAnalyzed: 1450,
  totalBudgetMAD: 12845000000, // 12.84 Mds MAD
  averageRiskScore: 34.2,
  anomaliesDetectedCount: 112,
  pmeInclusionRate: 38.5
};

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. [GET] /api/stats
app.get("/api/stats", (req, res) => {
  res.json({
    status: "success",
    timestamp: new Date().toISOString(),
    data: SIMULATED_STATS
  });
});

// 2. [GET] /api/anomalies (Recent public auctions and procurement contracts with risk evaluations)
app.get("/api/anomalies", (req, res) => {
  // Option to filter by risk level or sector
  const sector = req.query.sector as string;
  const minRisk = parseInt(req.query.minRisk as string || "0");

  let filtered = [...SIMULATED_ANOMALIES];

  if (sector) {
    filtered = filtered.filter(a => a.sector.toLowerCase().includes(sector.toLowerCase()));
  }

  filtered = filtered.filter(a => a.riskScore >= minRisk);

  res.json({
    status: "success",
    count: filtered.length,
    data: filtered
  });
});

// 3. [POST] /api/anomalies/create (Add user trial simulated anomalies)
app.post("/api/anomalies/create", (req, res) => {
  const { title, buyer, region, budget, sector, anomalyType, description, details } = req.body;

  if (!title || !buyer || !budget || !sector || !anomalyType) {
    return res.status(400).json({ error: "Champs obligatoires manquants." });
  }

  const newAnomaly: BidAnomaly = {
    id: `AO-2026-NEW-${Math.floor(100 + Math.random() * 900)}`,
    title,
    buyer,
    region: region || "Casablanca-Settat",
    budget: parseFloat(budget),
    date: new Date().toISOString().split('T')[0],
    sector,
    anomalyType,
    riskScore: Math.floor(60 + Math.random() * 38), // High simulated score
    status: "FLAGGED",
    description,
    details: details || ["Analyse automatisée réalisée à partir du cahier des charges soumis."]
  };

  SIMULATED_ANOMALIES.unshift(newAnomaly);
  SIMULATED_STATS.anomaliesDetectedCount += 1;
  SIMULATED_STATS.totalBidsAnalyzed += 1;
  SIMULATED_STATS.totalBudgetMAD += parseFloat(budget);

  res.status(201).json({
    status: "success",
    message: "Alerte d'anomalie enregistrée avec succès.",
    data: newAnomaly
  });
});

// 4. [GET] /api/pmes
app.get("/api/pmes", (req, res) => {
  res.json({
    status: "success",
    data: SIMULATED_PMES
  });
});

// 5. [GET] /api/pme-matching (Recommended bids based on PME profile or custom attributes)
app.get("/api/pme-matching", (req, res) => {
  const pmeId = req.query.pmeId as string;
  const pme = SIMULATED_PMES.find(p => p.id === pmeId);

  if (!pme) {
    return res.status(404).json({
      status: "error",
      message: `PME avec ID '${pmeId}' non trouvée.`
    });
  }

  // Matching logic of AO (from anomalies or similar markets) with PME metrics
  // Criteria:
  // - Sector must match (partial match allowed)
  // - AO Budget <= PME maximum capacity config (pme.maxCapacity)
  // - Anomaly status with lower riskScore means better suitability
  const suggestions: MatchingBidSuggestion[] = [
    {
      bidId: "AO-2026-REC-01",
      title: pme.sector === "BTP / Infrastructures" 
        ? "Réhabilitation de la route provinciale de Taroudant (P1709)" 
        : pme.sector === "Technologie & Digital"
        ? "Mise en place d'un système CRM de gestion des réclamations"
        : pme.sector === "Services / Espaces Verts"
        ? "Entretien arboricole et reboisement de l'Université Al Akhawayn"
        : "Fourniture de consommables médicaux universels pour cliniques de solidarité",
      buyer: pme.sector === "BTP / Infrastructures"
        ? "Ministère de l'Équipement - Direction de Taroudant"
        : pme.sector === "Technologie & Digital"
        ? "Ministère du Commerce, de l'Industrie et de l'Économie Verte"
        : pme.sector === "Services / Espaces Verts"
        ? "Direction Provinciale des Eaux et Forêts - Ifrane"
        : "CHIS - Centre Hospitalier Ibn Sina de Rabat",
      budget: Math.floor(pme.maxCapacity * 0.7),
      suitabilityScore: 92,
      reasonCount: "Parfaitement conforme au décret N°2-22-431 sur l'intégration des PME.",
      reasons: [
        `Budget proposé (${(pme.maxCapacity * 0.7 / 1000000).toFixed(1)}M MAD) inférieur à votre limite financière d'engagement de ${(pme.maxCapacity / 1000000).toLocaleString()}M MAD.`,
        "Secteur d'activité correspondant exactement à votre fiche d'enregistrement HCP/OMPIC.",
        "Le cahier des charges spécifie l'allègement obligatoire du cautionnement provisoire pour les jeunes PME nationales."
      ],
      keyRequirements: [
        "Agréments d'exécution classe C ou équivalent",
        "Chiffre d'affaires annuel détenant un ratio supérieur à 0.5 fois le budget estimé"
      ]
    },
    {
      bidId: "AO-2026-REC-02",
      title: pme.sector === "BTP / Infrastructures" 
        ? "Aménagement de pistes rurales dans la province d'Essaouira" 
        : pme.sector === "Technologie & Digital"
        ? "Développement d'une plateforme d'intelligence géospatiale interactive"
        : pme.sector === "Services / Espaces Verts"
        ? "Aménagement paysager des ronds-points de la ville de Meknès"
        : "Distribution de moniteurs d'anesthésie légers pour hôpitaux de campagne",
      buyer: pme.sector === "BTP / Infrastructures"
        ? "Province d'Essaouira - Conseil Provincial"
        : pme.sector === "Technologie & Digital"
        ? "Haut-Commissariat au Plan (HCP)"
        : pme.sector === "Services / Espaces Verts"
        ? "Commune Urbaine de Meknès"
        : "Délégation Provinciale de la Santé - Errachidia",
      budget: Math.floor(pme.maxCapacity * 0.4),
      suitabilityScore: 84,
      reasonCount: "Excellent potentiel de sous-traitance ou de co-traitance PME.",
      reasons: [
        "Allotissement géographique optimal réduisant les charges opérationnelles de logistique.",
        "Clause de paiement d'intérêts moratoires automatiques sous 45 jours garantie.",
        "Région d'exécution valorisant la proximité géographique locale."
      ],
      keyRequirements: [
        "Déclaration sur l'honneur signée électroniquement via la carte CNIE.",
        "Garantie de service ou caution de 1.5% maximum du montant alloué."
      ]
    }
  ];

  res.json({
    status: "success",
    pmeProfile: pme,
    suggestions: suggestions
  });
});

// 6. [POST] /api/analyze-cps (Uses Gemini AI or fallbacks to analyze Moroccan public tender specs for restrictive PME clauses)
app.post("/api/analyze-cps", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Veuillez fournir un extrait textuel du cahier des charges (CPS) à analyser."
    });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      console.log(`[AI MPI] Analysing CPS snippet using gemini-3.5-flash (${text.length} chars)...`);
      
      const prompt = `
        Vous êtes l'IA "Maroc Procurement Intelligence" (MPI). Votre tâche est d'analyser un extrait de cahier des charges (CPS / Cahier des Prescriptions Spéciales) d'un marché public marocain à la recherche de clauses restrictives, discriminatoires ou pénalisantes pour les TPE/PME nationales, en conformité avec le Décret des Marchés Publics Marocains (Décret N° 2-22-431 et lois de gouvernance de l'État).

        Voici l'extrait du CPS à analyser :
        """
        ${text}
        """

        Veuillez réaliser une analyse objective de cet extrait et retourner un rapport complet au format JSON respectant stricto sensu le schéma technique ci-dessous :
        {
          "summary": "Résumé concis de la nature du marché et des enjeux d'accès pour les PME.",
          "overallPmeAccessScore": 85, // Note sur 100 de l'accessibilité PME (100 = totalement accessible, < 50 = très discriminant)
          "restrictiveClauses": [
            {
              "id": "REF-01",
              "text": "Extrait exact de la clause restrictive",
              "category": "Financial Guarantees" ou "Required References" ou "Certification/Label" ou "Technical Criteria",
              "severity": "CRITICAL" ou "WARNING" ou "INFO",
              "suggestion": "Suggestion de modification claire pour ouvrir le marché aux PME",
              "referenceDecree": "Référence réglementaire (ex: Décret N° 2-22-431, Article 156 favorisant les PME)"
            }
          ],
          "standardizationSuggestions": [
            {
              "originalSnippet": "Texte d'origine complexe ou biaisé",
              "suggestedAlternative": "Texte reformulé et standardisé préconisé",
              "benefit": "En quoi cela garantit l'équité et l'open data"
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              overallPmeAccessScore: { type: Type.INTEGER },
              restrictiveClauses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    category: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    suggestion: { type: Type.STRING },
                    referenceDecree: { type: Type.STRING }
                  },
                  required: ["id", "text", "category", "severity", "suggestion", "referenceDecree"]
                }
              },
              standardizationSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    originalSnippet: { type: Type.STRING },
                    suggestedAlternative: { type: Type.STRING },
                    benefit: { type: Type.STRING }
                  },
                  required: ["originalSnippet", "suggestedAlternative", "benefit"]
                }
              }
            },
            required: ["summary", "overallPmeAccessScore", "restrictiveClauses", "standardizationSuggestions"]
          }
        }
      });

      const analysisRawText = response.text;
      if (!analysisRawText) {
        throw new Error("No response from Gemini");
      }

      console.log("[AI MPI] Gemini response successfully retrieved!");
      const parsedResult: CpsAnalysisResult = JSON.parse(analysisRawText.trim());
      
      // Inject date
      parsedResult.analysisDate = new Date().toISOString().split('T')[0];

      return res.json({
        status: "success",
        backend: "gemini-3.5-flash",
        data: parsedResult
      });

    } catch (error) {
      console.error("[AI MPI] Gemini API Error:", error);
      // Fallback to offline processor on API failure
    }
  }

  // -------------------------------------------------------------
  // REVOLUTIONARY OFFLINE / FALLBACK ANALYZER
  // (Analyzes Moroccan documents based on keyword matching)
  // -------------------------------------------------------------
  console.log(`[AI MPI] Generating Offline / Rule-Based Analysis of CPS (No API Key or fallback active)...`);
  
  const textLower = text.toLowerCase();
  const clauses: CpsAnalysisResult['restrictiveClauses'] = [];
  const standardSugs: CpsAnalysisResult['standardizationSuggestions'] = [];
  let score = 90;

  // Let's analyze caution/garantie
  if (textLower.includes("cautionnement") || textLower.includes("garantie") || textLower.includes("caution")) {
    score -= 15;
    clauses.push({
      id: "C-FIN-01",
      text: "Le soumissionnaire devra consigner un cautionnement définitif équivalent à 10% du montant du marché exigible dans les 10 jours suivant l'attribution.",
      category: "Financial Guarantees",
      severity: "WARNING",
      suggestion: "Ramener le cautionnement définitif à 3% ou proposer un nantissement progressif prélevé sur les acomptes mensuels pour préserver la trésorerie opérationnelle de la PME.",
      referenceDecree: "Décret N° 2-22-431, Article 142 portant sur les mécanismes de cautionnement préférentiel des Coopératives et PME."
    });
    
    standardSugs.push({
      originalSnippet: "cautionnement définitif équivalent à 10% du montant global",
      suggestedAlternative: "cautionnement définitif plafonné à 3% pour les TPE/PME nationales",
      benefit: "Permet aux PME à faible capitalisation de soumissionner sans bloquer leur capacité d'emprunt bancaire."
    });
  }

  // Let's analyze references
  if (textLower.includes("chiffre") || textLower.includes("expéri") || textLower.includes("référen") || textLower.includes("année")) {
    score -= 20;
    clauses.push({
      id: "C-REF-02",
      text: "Le candidat doit prouver la réalisation de projets similaires d'une valeur minimale unitaire de 20M MAD sur les 5 dernières années avec attestation d'administration publique.",
      category: "Required References",
      severity: "CRITICAL",
      suggestion: "Permettre l'évaluation par lots réduits (allotissement) et accepter les projets du secteur privé d'un montant de 2M à 5M MAD, ainsi que les groupements.",
      referenceDecree: "Décret N° 2-22-431, Article 156 (Réservation obligatoire d'un quota de 30% des marchés publics prévisionnels aux PMEs locales)."
    });

    standardSugs.push({
      originalSnippet: "justifier de la réalisation d'au moins 3 projets d'envergure nationale sur 5 ans",
      suggestedAlternative: "justifier de la réalisation de 1 projet ou acceptation de co-traitance et de cotisations d'experts",
      benefit: "Donne leur chance aux structures d'ingénierie marocaines récemment incubées par l'ADD."
    });
  }

  // Let's analyze certificates / labels
  if (textLower.includes("norme") || textLower.includes("iso") || textLower.includes("certif") || textLower.includes("label")) {
    score -= 15;
    clauses.push({
      id: "C-CERT-03",
      text: "L'équipe d'exécution doit détenir obligatoirement la double certification exclusive de l'industrie ISO 9005 et ISO 27018.",
      category: "Certification/Label",
      severity: "INFO",
      suggestion: "Autoriser l'équivalence d'autres standards de qualité nationaux ou donner un délai de 6 mois après démarrage pour acquérir la certification ad-hoc.",
      referenceDecree: "Loi 06-12 relative à la normalisation de l'Institut Marocain de Normalisation (IMANOR)."
    });
  }

  // Fallback default response if no keywords matched
  if (clauses.length === 0) {
    score = 95;
    clauses.push({
      id: "C-GEN-01",
      text: "Extrait de spécifications techniques standards.",
      category: "Technical Criteria",
      severity: "INFO",
      suggestion: "Le texte analysé est globalement neutre et n'établit pas d'obstacles tarifaires visibles, ce qui encourage l'émergence des artisans et PMEs.",
      referenceDecree: "Principes généraux de transparence et égalité d'accès aux commandes publiques au Maroc."
    });
  }

  const result: CpsAnalysisResult = {
    summary: "Analyse automatisée de l'extrait CPS soumis. Notre système de règles expertes à identifié " + clauses.length + " élément(s) de vigilance réglementaire liés à l'inclusion des PME marocaines.",
    overallPmeAccessScore: Math.max(20, score),
    restrictiveClauses: clauses,
    standardizationSuggestions: standardSugs,
    analysisDate: new Date().toISOString().split('T')[0]
  };

  res.json({
    status: "success",
    backend: "expert-rules-offline",
    data: result
  });
});

// -------------------------------------------------------------
// VITE AND STATIC SERVING
// -------------------------------------------------------------

// Serve Static Assets & SPA Router
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[MPI Server] Dev Mode - Initializing Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[MPI Server] Production Mode - Serving static production folder...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MPI Server] Success! Server started and running at:`);
    console.log(`            👉 http://0.0.0.0:${PORT}`);
  });
}

startServer();
