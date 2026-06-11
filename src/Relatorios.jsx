import { useState, useEffect } from "react";

const API = "";

// ── Helpers de data ────────────────────────────────────────────────────────────
// HTML date input → formato da API (ddMMYYYY)
function toApiDate(htmlDate) {
  if (!htmlDate) return "";
  const [y, m, d] = htmlDate.split("-");
  return `${d}${m}${y}`;
}

// JS Date → HTML date input (YYYY-MM-DD)
function toHtml(date) {
  return date.toISOString().slice(0, 10);
}

// Períodos rápidos
function periodoEsteMes() {
  const hoje = new Date();
  return {
    di: toHtml(new Date(hoje.getFullYear(), hoje.getMonth(), 1)),
    df: toHtml(hoje),
  };
}
function periodoMesAnterior() {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
  const fim    = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
  return { di: toHtml(inicio), df: toHtml(fim) };
}
function periodoUltimos3Meses() {
  const hoje   = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
  return { di: toHtml(inicio), df: toHtml(hoje) };
}

function labelPeriodo(di, df) {
  if (!di || !df) return "—";
  const fmt = (s) => new Date(s + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  return `${fmt(di)} → ${fmt(df)}`;
}

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icons = {
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx={9} cy={7} r={4}/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/>
      <rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/>
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/>
      <line x1={6} y1={20} x2={6} y2={14}/><line x1={2} y1={20} x2={22} y2={20}/>
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1={16} y1={13} x2={8} y2={13}/><line x1={16} y1={17} x2={8} y2={17}/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx={12} cy={12} r={3}/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1={12} y1={15} x2={12} y2={3}/>
    </svg>
  ),
  Spinner: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx={12} cy={12} r={10}/>
      <line x1={15} y1={9} x2={9} y2={15}/><line x1={9} y1={9} x2={15} y2={15}/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x={3} y={4} width={18} height={18} rx={2} ry={2}/>
      <line x1={16} y1={2} x2={16} y2={6}/><line x1={8} y1={2} x2={8} y2={6}/>
      <line x1={3} y1={10} x2={21} y2={10}/>
    </svg>
  ),
  FileClock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/>
      <polyline points="14 2 14 8 20 8"/>
      <circle cx={8} cy={16} r={6}/>
      <polyline points="8 13 8 16 10 16"/>
    </svg>
  ),
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onDismiss }) {
  if (!msg) return null;
  return (
    <div onClick={onDismiss} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${
      msg.ok ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
             : "bg-red-950 border border-red-800 text-red-300"
    }`}>
      {msg.ok ? <Icons.Check/> : <Icons.X/>}
      {msg.text}
    </div>
  );
}

const NAV = [
  { id: "dashboard",    label: "Dashboard",     Icon: Icons.Dashboard },
  { id: "funcionarios", label: "Funcionários",  Icon: Icons.Users     },
  { id: "relatorios",   label: "Relatórios",    Icon: Icons.BarChart  },
  { id: "tratamentos",  label: "Tratamentos",   Icon: Icons.FileText  },
  { id: "config",       label: "Configurações", Icon: Icons.Settings  },
];

const inputCls = "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors";

// ── Página ────────────────────────────────────────────────────────────────────
export default function Relatorios({ onNavigate }) {
  const [periodo, setPeriodo]       = useState(periodoEsteMes);
  const [quickSel, setQuickSel]     = useState("este-mes");
  const [escopo, setEscopo]         = useState("todos");      // "todos" | "especifico"
  const [funcionarios, setFuncs]    = useState([]);
  const [funcSel, setFuncSel]       = useState("");           // pis selecionado
  const [loading, setLoading]       = useState({ mte: false, horas: false, funcs: true });
  const [toast, setToast]           = useState(null);

  // Carrega lista de funcionários para o seletor
  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      try {
        const res  = await fetch(`${API}/api/funcionarios`);
        const data = await res.json();
        if (!cancelado) {
          setFuncs(data.filter((f) => f.ativo !== false));
          if (data.length > 0) setFuncSel(String(data[0].pis));
        }
      } catch {
        // silencioso — lista de funcs é opcional
      } finally {
        if (!cancelado) setLoading((p) => ({ ...p, funcs: false }));
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // Seleção de período rápido
  function selecionarPeriodo(id) {
    setQuickSel(id);
    if (id === "este-mes")    setPeriodo(periodoEsteMes());
    if (id === "mes-anterior") setPeriodo(periodoMesAnterior());
    if (id === "ultimos-3")   setPeriodo(periodoUltimos3Meses());
  }

  // Quando o usuário edita as datas manualmente, deseleciona o quick select
  function setDi(v) { setPeriodo((p) => ({ ...p, di: v })); setQuickSel(""); }
  function setDf(v) { setPeriodo((p) => ({ ...p, df: v })); setQuickSel(""); }

  // Download de PDF
  async function baixar(tipo) {
    if (!periodo.di || !periodo.df) {
      setToast({ ok: false, text: "Selecione o período antes de gerar o relatório." });
      return;
    }
    if (escopo === "especifico" && !funcSel) {
      setToast({ ok: false, text: "Selecione um funcionário." });
      return;
    }

    const key = tipo === "mte" ? "mte" : "horas";
    setLoading((p) => ({ ...p, [key]: true }));

    const pis      = escopo === "especifico" ? funcSel : null;
    const endpoint = tipo === "mte"
      ? pis ? `/api/mte/espelho/${pis}/pdf`       : `/api/mte/espelho/todos/pdf`
      : pis ? `/api/relatorio/horas/${pis}/pdf`   : `/api/relatorio/horas/todos/pdf`;

    const nomeFuncionario = pis
      ? (funcionarios.find((f) => String(f.pis) === pis)?.nome ?? pis)
      : "todos";
    const nomeArquivo = `chronus_${tipo}_${nomeFuncionario}_${toApiDate(periodo.di)}-${toApiDate(periodo.df)}.pdf`;

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataInicial: toApiDate(periodo.di), dataFinal: toApiDate(periodo.df) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = nomeArquivo;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ ok: true, text: `PDF gerado — verifique sua pasta de downloads.` });
    } catch {
      setToast({ ok: false, text: "Erro ao gerar PDF. Verifique se há dados no período selecionado." });
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
    }
  }

  const periodoLabel = labelPeriodo(periodo.di, periodo.df);
  const funcLabel    = escopo === "todos"
    ? `Todos os funcionários (${funcionarios.length} ativos)`
    : (funcionarios.find((f) => String(f.pis) === funcSel)?.nome ?? "—");

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
                id === "relatorios"
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
          <h1 className="font-semibold text-lg text-slate-100 leading-none">Relatórios</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gere espelhos e relatórios de horas em PDF</p>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          <Toast msg={toast} onDismiss={() => setToast(null)}/>

          {/* ── Filtros ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-6">

            {/* Período */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icons.Calendar/>
                <span className="text-sm font-medium text-slate-300">Período</span>
              </div>

              {/* Quick select */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: "este-mes",     label: "Este mês"      },
                  { id: "mes-anterior", label: "Mês anterior"  },
                  { id: "ultimos-3",    label: "Últimos 3 meses" },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => selecionarPeriodo(id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      quickSel === id
                        ? "bg-amber-400 text-slate-900 border-amber-400"
                        : "text-slate-400 border-slate-600 hover:border-slate-500 hover:text-slate-200"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Datas customizadas */}
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Data inicial</label>
                  <input type="date" value={periodo.di} onChange={(e) => setDi(e.target.value)} className={inputCls}/>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Data final</label>
                  <input type="date" value={periodo.df} onChange={(e) => setDf(e.target.value)} className={inputCls}/>
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="border-t border-slate-700"/>

            {/* Funcionário */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icons.Users/>
                <span className="text-sm font-medium text-slate-300">Funcionário</span>
              </div>

              <div className="flex gap-3 mb-4">
                {[
                  { id: "todos",      label: "Todos"       },
                  { id: "especifico", label: "Específico"  },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setEscopo(id)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      escopo === id
                        ? "bg-amber-400 text-slate-900 border-amber-400"
                        : "text-slate-400 border-slate-600 hover:border-slate-500 hover:text-slate-200"
                    }`}>
                    {label}
                  </button>
                ))}
              </div>

              {escopo === "especifico" && (
                <div className="max-w-sm">
                  <label className="block text-xs text-slate-500 mb-1.5">Selecionar funcionário</label>
                  {loading.funcs ? (
                    <div className="h-10 bg-slate-700 rounded-lg animate-pulse"/>
                  ) : (
                    <select
                      value={funcSel}
                      onChange={(e) => setFuncSel(e.target.value)}
                      className={`${inputCls} cursor-pointer`}
                    >
                      {funcionarios.map((f) => (
                        <option key={f.pis} value={String(f.pis)}>
                          {f.nome} {f.cargo ? `— ${f.cargo}` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Resumo da seleção ── */}
          <div className="bg-slate-800 border border-slate-600 rounded-xl px-5 py-3 flex items-center gap-4 text-sm">
            <span className="text-slate-500 text-xs uppercase tracking-widest font-medium">Seleção atual</span>
            <span className="text-amber-400 font-mono text-xs">{periodoLabel}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs">{funcLabel}</span>
          </div>

          {/* ── Cards de relatório ── */}
          <div className="grid grid-cols-2 gap-4">

            {/* Espelho MTE */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-950 rounded-xl flex items-center justify-center text-rose-400 flex-shrink-0">
                  <Icons.FileClock/>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">Espelho de Ponto</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Registro completo de horários no formato exigido pelo MTE (Portaria 1510/2009).
                    Inclui entradas, saídas e intervalos de cada dia.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Formato: <span className="text-slate-300 font-mono">PDF</span>
                </div>
                <button
                  onClick={() => baixar("mte")}
                  disabled={loading.mte}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 disabled:text-rose-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
                >
                  {loading.mte ? <><Icons.Spinner/> Gerando...</> : <><Icons.Download/> Baixar PDF</>}
                </button>
              </div>
            </div>

            {/* Relatório de Horas */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-950 rounded-xl flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Icons.BarChart/>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-100">Relatório de Horas</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Resumo de horas trabalhadas, horas extras, faltas e saldo do período.
                    Ideal para folha de pagamento.
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Formato: <span className="text-slate-300 font-mono">PDF</span>
                </div>
                <button
                  onClick={() => baixar("horas")}
                  disabled={loading.horas}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-900 disabled:text-sky-700 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
                >
                  {loading.horas ? <><Icons.Spinner/> Gerando...</> : <><Icons.Download/> Baixar PDF</>}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}