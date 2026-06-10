// ── Ícones ────────────────────────────────────────────────────────────────────
const Icons = {
    Clock:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>,
    Users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>,
    BarChart:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/><line x1={6} y1={20} x2={6} y2={14}/><line x1={2} y1={20} x2={22} y2={20}/></svg>,
    FileText:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1={16} y1={13} x2={8} y2={13}/><line x1={16} y1={17} x2={8} y2={17}/></svg>,
    Settings:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={3}/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
    Info:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/></svg>,
    Code:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    Zap:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    Shield:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    Globe:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx={12} cy={12} r={10}/><line x1={2} y1={12} x2={22} y2={12}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    Mail:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    Package:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1={16.5} y1={9.4} x2={7.5} y2={4.21}/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1={12} y1={22.08} x2={12} y2={12}/></svg>,
  };
  
  const NAV = [
    { id: "dashboard",    label: "Dashboard",     Icon: Icons.Dashboard },
    { id: "funcionarios", label: "Funcionários",  Icon: Icons.Users     },
    { id: "relatorios",   label: "Relatórios",    Icon: Icons.BarChart  },
    { id: "tratamentos",  label: "Tratamentos",   Icon: Icons.FileText  },
    { id: "config",       label: "Configurações", Icon: Icons.Settings  },
    { id: "sobre", label: "Sobre", Icon: Icons.Info },
  ];
  
  // ── Logo ATOM (SVG) ───────────────────────────────────────────────────────────
  function LogoATOM() {
    return (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
        {/* Núcleo */}
        <circle cx="40" cy="40" r="6" fill="#f59e0b"/>
        {/* Órbita 1 */}
        <ellipse cx="40" cy="40" rx="32" ry="14" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.8"/>
        {/* Órbita 2 (rotacionada 60°) */}
        <ellipse cx="40" cy="40" rx="32" ry="14" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5"
          transform="rotate(60 40 40)"/>
        {/* Órbita 3 (rotacionada 120°) */}
        <ellipse cx="40" cy="40" rx="32" ry="14" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.3"
          transform="rotate(120 40 40)"/>
        {/* Elétrons */}
        <circle cx="72" cy="40" r="3" fill="#fbbf24"/>
        <circle cx="23" cy="27" r="3" fill="#fbbf24" opacity="0.7"/>
        <circle cx="23" cy="53" r="3" fill="#fbbf24" opacity="0.5"/>
      </svg>
    );
  }
  
  // ── Tecnologias ───────────────────────────────────────────────────────────────
  const STACK = [
    { nome: "Java 21",        cor: "bg-orange-950 text-orange-400 border-orange-800"   },
    { nome: "Spring Boot 4",  cor: "bg-green-950  text-green-400  border-green-800"    },
    { nome: "React 19",       cor: "bg-sky-950    text-sky-400    border-sky-800"      },
    { nome: "Tailwind CSS 4", cor: "bg-cyan-950   text-cyan-400   border-cyan-800"     },
    { nome: "PostgreSQL 16",  cor: "bg-blue-950   text-blue-400   border-blue-800"     },
    { nome: "Docker",         cor: "bg-indigo-950 text-indigo-400 border-indigo-800"   },
    { nome: "Nginx",          cor: "bg-emerald-950 text-emerald-400 border-emerald-800"},
    { nome: "Evolution API",  cor: "bg-violet-950 text-violet-400 border-violet-800"   },
  ];
  
  // ── Página ────────────────────────────────────────────────────────────────────
  export default function Sobre({ onNavigate }) {
    return (
      <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
  
        {/* Sidebar */}
        <aside className="w-56 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
          <div className="px-5 py-5 border-b border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-900">
              <Icons.Clock/>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100 leading-none">Chronus</p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">Ponto Eletrônico</p>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => onNavigate?.(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  id === "sobre"
                    ? "bg-amber-400 text-slate-900 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
                }`}>
                <Icon/>{label}
              </button>
            ))}
          </nav>
        </aside>
  
        {/* Conteúdo */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex-shrink-0">
            <h1 className="font-semibold text-lg text-slate-100 leading-none">Sobre</h1>
            <p className="text-xs text-slate-500 mt-0.5">Sobre o sistema e a empresa desenvolvedora</p>
          </header>
  
          <main className="flex-1 overflow-y-auto px-8 py-8">
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
  
              {/* Card ATOM */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
                <LogoATOM/>
                <div>
                  <h2 className="text-3xl font-bold tracking-widest text-amber-400">ATOM</h2>
                  <p className="text-slate-400 text-sm mt-1">Soluções em Software</p>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  Desenvolvemos sistemas sob medida para pequenas e médias empresas,
                  com foco em automação, integração e simplicidade de uso.
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <a href="mailto:contato@atom.dev.br"
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors">
                    <Icons.Mail/> contato@atom.dev.br
                  </a>
                  <span className="text-slate-700">·</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    <Icons.Globe/> atom.dev.br
                  </span>
                </div>
              </div>
  
              {/* Card Chronus */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-900 flex-shrink-0">
                    <Icons.Clock/>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Chronus — Ponto Eletrônico</h3>
                    <p className="text-xs text-slate-500">Versão 1.0.0 · Junho / 2026</p>
                  </div>
                </div>
  
                <p className="text-sm text-slate-400 leading-relaxed">
                  Sistema de registro eletrônico de ponto integrado ao relógio biométrico
                  <span className="text-slate-300"> iDClass ControlID</span>.
                  Realiza sincronização automática das batidas, gera espelhos conforme a
                  <span className="text-slate-300"> Portaria 1510/MTE</span>,
                  envia notificações por e-mail e WhatsApp e oferece gestão completa de funcionários.
                </p>
  
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {[
                    { Icon: Icons.Zap,    label: "Sync automática",  desc: "a cada N minutos" },
                    { Icon: Icons.Shield, label: "Portaria 1510",    desc: "espelho MTE"      },
                    { Icon: Icons.Package,label: "Docker",           desc: "containerizado"   },
                  ].map(({ Icon, label, desc }) => (
                    <div key={label} className="bg-slate-700 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                      <span className="text-amber-400"><Icon/></span>
                      <p className="text-xs font-medium text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Stack tecnológica */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Icons.Code/>
                  <h3 className="font-semibold text-slate-100">Stack tecnológica</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STACK.map(({ nome, cor }) => (
                    <span key={nome} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${cor}`}>
                      {nome}
                    </span>
                  ))}
                </div>
              </div>
  
              {/* Rodapé */}
              <p className="text-center text-xs text-slate-600 pb-4">
                © 2026 ATOM — Todos os direitos reservados ·
                Desenvolvido para <span className="text-slate-500">JOSE NATAL CLERICE -ME</span>
              </p>
  
            </div>
          </main>
        </div>
      </div>
    );
  }