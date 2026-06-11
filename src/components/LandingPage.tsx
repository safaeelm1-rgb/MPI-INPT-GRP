import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, ArrowRight, UserCheck, Key, Lock, Globe, FileText, Settings, Users, Activity } from "lucide-react";

interface LandingPageProps {
  onLogin: (role: string) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [selectedRole, setSelectedRole] = useState<string>("acheteur");
  const [password, setPassword] = useState<string>("••••••••");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Statistics counters
  const [statVolume, setStatVolume] = useState<number>(100);
  const [statAoCount, setStatAoCount] = useState<number>(10000);
  const [statPme, setStatPme] = useState<number>(50);

  useEffect(() => {
    // Elegant load animation for statistics counters
    const dur = 1500;
    const steps = 60;
    const interval = dur / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStatVolume(Math.floor(100 + (200 - 100) * (step / steps)));
      setStatAoCount(Math.floor(10000 + (127000 - 10000) * (step / steps)));
      setStatPme(Math.floor(50 + (95 - 50) * (step / steps)));

      if (step >= steps) {
        setStatVolume(200);
        setStatAoCount(127000);
        setStatPme(95);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // HTML5 Particle Canvas Background representing public procurement nodes and links
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.innerHeight || 600);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      label?: string;
    }> = [];

    // Create contract and supplier nodes representing Morocco entities
    const sectors = ["Santé", "BTP", "ADD Digital", "Transport", "ONEE", "Justice", "Finance"];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 3.5 + 1.5,
        color: i % 3 === 0 ? "#C1121F" : i % 3 === 1 ? "#2D6A4F" : "#D4A017", // Red, Green, Gold
        label: i < 7 ? `AO-${sectors[i]}` : undefined
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background network edges (connections)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 120)})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 1, 0, Math.PI * 2);
        ctx.fillStyle = "transparent";
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Labels
        if (p.label) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.font = "8px monospace";
          ctx.fillText(p.label, p.x + 8, p.y + 3);
        }

        // Adjust position
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ROLES = [
    {
      id: "acheteur",
      title: "Acheteur Public",
      titleAr: "المشتري العمومي",
      desc: "Officier ministériel de passation des marchés et gestion des AO.",
      icon: Users,
      defaultUser: "s.alami@justice.gov.ma"
    },
    {
      id: "pme",
      title: "PME / TPE Nationale",
      titleAr: "المقاولات الصغرى والمتوسطة",
      desc: "Soumissionnaire marocain, recherche d'allotissement et matching.",
      icon: Globe,
      defaultUser: "contact@casadigital.ma"
    },
    {
      id: "controleur",
      title: "Contrôleur / IGAT / IGF",
      titleAr: "مراقب عمومي / المفتشية",
      desc: "Auditeur de la transparence nationale et examen des anomalies.",
      icon: ShieldCheck,
      defaultUser: "inspector@igat.interior.gov.ma"
    },
    {
      id: "citoyen",
      title: "Citoyen / Observateur",
      titleAr: "المواطن والمجتمع المدني",
      desc: "Accès libre, intégrité publique et consultation open-data.",
      icon: Activity,
      defaultUser: "visiteur@transparence.ma"
    }
  ];

  const currentRoleInfo = ROLES.find((r) => r.id === selectedRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col justify-between overflow-x-hidden selection:bg-[#C1121F]/30 selection:text-white" id="mpi-landing-container">
      {/* Dynamic Animated Particle Canvas Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full opacity-60 z-0" />

      {/* Top Header Row with Morocco Flag Emblem & Seal */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-white/[0.04] bg-[#0A0A0A]/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Sovereign Morocco Flag Seal */}
          <div className="w-12 h-8 bg-[#C1121F] border border-white/10 rounded flex items-center justify-center relative overflow-hidden shadow-inner">
            <svg viewBox="0 0 100 60" className="w-8 h-8 select-none text-[#2D6A4F]">
              {/* Star Green */}
              <polygon
                points="50,15 54,28 66,28 57,36 60,49 50,41 40,49 43,36 34,28 46,28"
                fill="none"
                stroke="#2D6A4F"
                strokeWidth="3.5"
                strokeMiterlimit="10"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-neutral-100 font-sans flex items-center gap-1">
              MAROC PROCUREMENT INTELLIGENCE
            </h1>
            <h2 className="text-[10px] tracking-widest text-[#D4A017] font-mono">
              مديرية المشتريات العمومية الذكية
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20bf6b] animate-pulse" />
            SOUVERAINETÉ ALGORIHMIC PORTAL
          </div>
          <button 
            onClick={() => onLogin("citoyen")} 
            className="border border-[#2D6A4F]/40 hover:bg-[#2D6A4F]/10 text-neutral-100 hover:text-white px-3.5 py-1.5 rounded text-[11px] font-mono tracking-wide uppercase transition-all"
          >
            Open Data Citoyen / بيانات مفتوحة
          </button>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 flex flex-col justify-center py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          {/* Left Column Text details & counters */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 text-[#C1121F] border border-red-900/20 rounded-full text-xs font-mono tracking-wider font-bold uppercase">
                👑 Royaume du Maroc · Secrétariat Général
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-neutral-100 tracking-tight leading-[1.1] font-sans">
                L'intelligence artificielle <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1121F] via-[#D4A017] to-[#2D6A4F]">
                  au service de l'État Algorithmique
                </span>
              </h2>
              {/* Bilingual arabic tag */}
              <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-md font-sans">
                MPI — Maroc Procurement Intelligence optimise la commande publique par l'analyse NLPAraBERT des cahiers de charges et de la détection de fraudes et d'ententes.
              </p>
              <p className="text-xs text-[#D4A017] leading-relaxed max-w-md font-serif" dir="rtl">
                الذكاء الاصطناعي في خدمة الطلبيات العمومية المغربية · الشفافية والشمولية الاقتصادية للمقاولات الصغرى والمتوسطة.
              </p>
            </div>

            {/* National statistics cards */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-white/[0.05] py-6 max-w-lg">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-neutral-500">Volume Annuel</span>
                <span className="text-xl sm:text-3xl font-extrabold text-[#C1121F] mt-1 font-sans">
                  {statVolume} Mds
                </span>
                <span className="text-[9px] text-[#D4A017] font-mono">MAD / درهم</span>
              </div>
              <div className="flex flex-col border-l border-white/[0.05] pl-4">
                <span className="text-[10px] uppercase font-mono text-neutral-500">Appels Publiés</span>
                <span className="text-xl sm:text-3xl font-extrabold text-[#D4A017] mt-1 font-sans">
                  {statAoCount.toLocaleString()}+
                </span>
                <span className="text-[9px] text-neutral-400 font-mono">AO par an</span>
              </div>
              <div className="flex flex-col border-l border-white/[0.05] pl-4">
                <span className="text-[10px] uppercase font-mono text-neutral-500">Quota PME / TPE</span>
                <span className="text-xl sm:text-3xl font-extrabold text-[#2D6A4F] mt-1 font-sans">
                  {statPme}%
                </span>
                <span className="text-[9px] text-neutral-400 tracking-tight font-mono">Entreprises du pays</span>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Login Cards & Forms */}
          <div className="lg:col-span-2">
            <div className="bg-[#111111]/90 backdrop-blur border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              
              {/* Sovereign Red ribbon corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C1121F] to-transparent opacity-10 pointer-events-none" />

              {/* Login Title */}
              <div className="border-b border-white/[0.04] pb-4 mb-4">
                <h3 className="text-sm uppercase font-mono tracking-wider text-neutral-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#C1121F]" />
                  Portail Souverain d'Accès
                </h3>
                <p className="text-[10px] text-neutral-400 mt-1">Sélectionnez votre identité institutionnelle</p>
              </div>

              {/* Roles matrix selector grids */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isCur = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`text-left p-3 rounded-lg border text-xs transition-all flex flex-col justify-between ${
                        isCur
                          ? "bg-[#C1121F]/10 border-[#C1121F] text-white shadow-[0_0_15px_rgba(193,18,31,0.15)] scale-[1.02]"
                          : "bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon className={`w-4 h-4 ${isCur ? "text-[#C1121F]" : "text-neutral-500"}`} />
                        {isCur && <span className="w-1.5 h-1.5 rounded-full bg-[#C1121F]" />}
                      </div>
                      <div>
                        <div className="font-bold tracking-tight">{role.title}</div>
                        <div className="text-[8px] font-serif font-light text-neutral-400 truncate mt-0.5" dir="rtl">
                          {role.titleAr}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Authentic Pre-filled login credentials form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1.5">
                    Identifiant Bureau de Passation / البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 text-xs">
                      @
                    </span>
                    <input
                      type="text"
                      className="w-full bg-black/60 border border-white/5 rounded-lg py-2.5 pl-8 pr-3 text-xs text-neutral-200 outline-none focus:border-[#C1121F] transition-all font-mono"
                      value={currentRoleInfo?.defaultUser || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-500 mb-1.5">
                    Clé OTP Sécurisée / كود المرور
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                      <Key className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="password"
                      className="w-full bg-black/60 border border-white/5 rounded-lg py-2.5 pl-9 pr-3 text-xs text-neutral-200 outline-none focus:border-[#C1121F] transition-all font-mono"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1 bg-[#C1121F] hover:bg-[#8B0D15] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(193,18,31,0.25)]"
                >
                  Authentification Sécurisée / دخول
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>

              {/* Informative credentials note */}
              <p className="text-[9px] text-neutral-500 text-center font-mono mt-4">
                Canal chiffré TLS 1.3 · Système hébergé sous contrôle du MEF
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Logos footer strip */}
      <footer className="relative z-10 bg-[#070707] border-t border-white/[0.04] py-6 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">
              Sources d'intégration nationales interconnectées
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 items-center opacity-60 hover:opacity-90 transition-all text-[10px] font-bold text-neutral-400 font-mono">
              <span className="hover:text-amber-500">🏛️ BANK AL-MAGHRIB</span>
              <span className="hover:text-green-500">📈 HCP MAROC</span>
              <span className="hover:text-red-500">🏢 OMPIC CASABLANCA</span>
              <span className="hover:text-[#D4A017]">🛃 ADII DOUANES</span>
              <span className="hover:text-blue-400">🌐 PORTAIL TGR MAROC</span>
            </div>
          </div>
          <p className="text-center text-[9px] text-neutral-600 mt-6 font-mono">
            © 2026 Royaume du Maroc - Ministère de la Transition Numérique et de la Réforme de l'Administration — Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
