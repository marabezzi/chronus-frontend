import { useState, useEffect, useCallback, useRef } from "react";

// URL relativa: em dev o Vite faz proxy /api → localhost:8081
//               em prod o nginx faz proxy /api → chronus-api:8081
const API = "";

// ── Mock data (fallback quando a API está offline) ─────────────────────────────
const MOCK_LOGS = [
  { id: 1, dataHora: "2026-06-10T09:45:12", tipo: "BATIDAS",  status: "SUCESSO", novasBatidas: 3, erro: null },
  { id: 2, dataHora: "2026-06-10T09:40:08", tipo: "BATIDAS",  status: "SUCESSO", novasBatidas: 1, erro: null },
  { id: 3, dataHora: "2026-06-10T09:35:00", tipo: "COMPLETO", status: "ERRO",    novasBatidas: 0, erro: "Timeout ao conectar com iDClass" },
  { id: 4, dataHora: "2026-06-10T09:30:05", tipo: "BATIDAS",  status: "SUCESSO", novasBatidas: 5, erro: null },
  { id: 5, dataHora: "2026-06-10T09:25:01", tipo: "BATIDAS",  status: "SUCESSO", novasBatidas: 2, erro: null },
  { id: 6, dataHora: "2026-06-10T09:20:33", tipo: "BATIDAS",  status: "SUCESSO", novasBatidas: 0, erro: null },
];
const MOCK_FUNCS = Array.from({ length: 12 }, (_, i) => ({ pis: String(i), ativo: true }));

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDT(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function timeSince(iso) {
  if (!iso) return null;
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60)   return `${s}s atrás`;
  if (s < 3600) return `${Math.floor(s / 60)}min atrás`;
  return `${Math.floor(s / 3600)}h atrás`;
}

function mesAtual() {
  const hoje = new Date();
  const fmt  = (d) =>
    `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}${d.getFullYear()}`;
  return { di: fmt(new Date(hoje.getFullYear(), hoje.getMonth(), 1)), df: fmt(hoje) };
}

// ── Ícones (SVG inline) ───────────────────────────────────────────────────────
const Icons = {
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx={9} cy={7} r={4} />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Refresh: ({ spin = false }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      className={`w-4 h-4 ${spin ? "animate-spin" : ""}`}>
      <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} />
    </svg>
  ),
  BarChart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} />
      <line x1={6} y1={20} x2={6} y2={14} /><line x1={2} y1={20} x2={22} y2={20} />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx={12} cy={12} r={10} />
      <line x1={15} y1={9} x2={9} y2={15} /><line x1={9} y1={9} x2={15} y2={15} />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx={12} cy={12} r={3} />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} />
      <rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} />
    </svg>
  ),
};

// ── Subcomponentes ────────────────────────────────────────────────────────────
function PulseDot({ color }) {
  return (
    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${color}`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

function StatCard({ label, value, sub, IconComp, accent, loading: isLoading }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">{label}</span>
        <span className={accent}><IconComp /></span>
      </div>
      {isLoading
        ? <div className="h-8 bg-slate-700 rounded animate-pulse w-16" />
        : <span className={`font-mono text-3xl font-bold leading-none ${accent}`}>{value}</span>
      }
      <span className="text-xs text-slate-500">{sub}</span>
    </div>
  );
}

function Toast({ msg, onDismiss }) {
  if (!msg) return null;
  return (
    <div
      onClick={onDismiss}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer ${
        msg.ok
          ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
          : "bg-red-950 border border-red-800 text-red-300"
      }`}
    >
      {msg.ok ? <Icons.Check /> : <Icons.X />}
      <span>{msg.text}</span>
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

// ── Dashboard (página) ────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [logs, setLogs]                 = useState([]);
  const [loading, setLoading]           = useState({ data: true, sync: false, mte: false, rel: false });
  const [now, setNow]                   = useState(new Date());
  const [toast, setToast]               = useState(null);
  const [isDemo, setIsDemo]             = useState(false);
  const [activeNav, setActiveNav]       = useState("dashboard");
  const mountedRef                      = useRef(false);   // ← evita setState no efeito

  // Relógio ao vivo
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-dismiss do toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Busca dados (agora pura, sem tocar em loading)
  const fetchData = useCallback(async () => {
    try {
      const [fRes, lRes] = await Promise.all([
        fetch(`${API}/api/funcionarios`),
        fetch(`${API}/api/sync/logs`),
      ]);
      if (!fRes.ok || !lRes.ok) throw new Error();
      setFuncionarios(await fRes.json());
      setLogs(await lRes.json());
      setIsDemo(false);
    } catch {
      setFuncionarios(MOCK_FUNCS);
      setLogs(MOCK_LOGS);
      setIsDemo(true);
    }
  }, []);

  // Efeito único de montagem – NÃO chama setState
  useEffect(() => {
    if (mountedRef.current) return;      // já montou, não executa de novo
    mountedRef.current = true;
    fetchData().finally(() => {
      setLoading(p => ({ ...p, data: false }));   // só aqui, após a Promise resolver
    });
  }, [fetchData]);

  // Sync manual
  const syncManual = async () => {
    setLoading((p) => ({ ...p, sync: true }));
    setToast(null);
    try {
      const res  = await fetch(`${API}/api/sync/batidas`, { method: "POST" });
      const data = await res.json();
      setToast({ ok: true, text: `Sync concluída — ${data.novasBatidas ?? 0} nova(s) batida(s)` });
      fetchData();
    } catch {
      setToast({ ok: false, text: "Falha na sync. Verifique a conexão com o relógio iDClass." });
    } finally {
      setLoading((p) => ({ ...p, sync: false }));
    }
  };

  // Gerar PDF
  const gerarPDF = async (tipo) => {
    const key      = tipo === "mte" ? "mte" : "rel";
    const endpoint = tipo === "mte"
      ? "/api/mte/espelho/todos/pdf"
      : "/api/relatorio/horas/todos/pdf";
    setLoading((p) => ({ ...p, [key]: true }));
    try {
      const { di, df } = mesAtual();
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ di, df }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `chronus_${tipo}_${mesAtual().df}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ ok: true, text: "PDF gerado — verifique sua pasta de downloads." });
    } catch {
      setToast({ ok: false, text: "Erro ao gerar PDF. API indisponível ou sem dados no período." });
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
    }
  };

  // Métricas
  const totalAtivos = funcionarios.filter((f) => f.ativo !== false).length;
  const lastLog     = logs[0] ?? null;
  const lastSyncOk  = lastLog?.status === "SUCESSO";
  const batidasHoje = logs
    .filter((l) => l.dataHora?.startsWith(new Date().toISOString().slice(0, 10)))
    .reduce((acc, l) => acc + (l.novasBatidas ?? 0), 0);

  const handleNav = (id) => {
    setActiveNav(id);
    onNavigate?.(id);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-900">
            <Icons.Clock />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 leading-none">Chronus</p>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Ponto Eletrônico</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeNav === id
                  ? "bg-amber-400 text-slate-900 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-slate-700">
          {isDemo ? (
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <PulseDot color="bg-amber-400" />
              <span>Modo demo — API offline</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <PulseDot color="bg-emerald-400" />
              <span>API online</span>
            </div>
          )}
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-semibold text-lg text-slate-100 leading-none">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Visão geral do sistema</p>
          </div>
          {/* Relógio ao vivo — elemento marcante */}
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-amber-400 tracking-widest leading-none">
              {now.toLocaleTimeString("pt-BR")}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {now.toLocaleDateString("pt-BR", {
                weekday: "short", day: "2-digit", month: "2-digit", year: "numeric",
              })}
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <Toast msg={toast} onDismiss={() => setToast(null)} />

          {/* Barra de status */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {loading.data ? (
                <PulseDot color="bg-slate-500" />
              ) : lastSyncOk ? (
                <PulseDot color="bg-emerald-400" />
              ) : (
                <PulseDot color="bg-red-400" />
              )}
              <span className="text-sm font-medium text-slate-300">
                {loading.data ? "Verificando..." : lastSyncOk ? "Último sync OK" : "Último sync com erro"}
              </span>
              {lastLog && !loading.data && (
                <span className="text-xs text-slate-500 font-mono">
                  {formatDT(lastLog.dataHora)} · {timeSince(lastLog.dataHora)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLoading((p) => ({ ...p, data: true }));
                  fetchData().finally(() => setLoading(p => ({ ...p, data: false })));
                }}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
              >
                Atualizar
              </button>
              <button
                onClick={syncManual}
                disabled={loading.sync}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-800 disabled:text-amber-600 text-slate-900 font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors"
              >
                <Icons.Refresh spin={loading.sync} />
                {loading.sync ? "Sincronizando..." : "Sync Manual"}
              </button>
            </div>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Funcionários ativos" value={loading.data ? "—" : totalAtivos}
              sub="cadastrados no sistema" IconComp={Icons.Users} accent="text-sky-400" loading={loading.data} />
            <StatCard label="Status da sync"
              value={loading.data ? "—" : lastSyncOk ? "OK" : "ERRO"}
              sub={lastLog ? `Tipo: ${lastLog.tipo}` : "Nenhuma sync registrada"}
              IconComp={Icons.Activity}
              accent={loading.data ? "text-slate-500" : lastSyncOk ? "text-emerald-400" : "text-red-400"}
              loading={loading.data} />
            <StatCard label="Batidas hoje" value={loading.data ? "—" : batidasHoje}
              sub="via sync automática" IconComp={Icons.Clock} accent="text-amber-400" loading={loading.data} />
            <StatCard label="Último sync"
              value={loading.data ? "—" : lastLog ? (timeSince(lastLog.dataHora) ?? "—") : "—"}
              sub={lastLog ? formatDT(lastLog.dataHora) : "Nenhuma sync"}
              IconComp={Icons.Refresh} accent="text-violet-400" loading={loading.data} />
          </div>

          {/* Ações rápidas */}
          <div>
            <h2 className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">Ações rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => gerarPDF("mte")} disabled={loading.mte}
                className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl p-5 flex items-center gap-4 text-left transition-all group disabled:opacity-50">
                <div className="w-10 h-10 bg-rose-950 rounded-lg flex items-center justify-center text-rose-400 group-hover:bg-rose-900 transition-colors flex-shrink-0">
                  <Icons.FileText />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-100 text-sm">Espelho MTE — PDF</p>
                  <p className="text-xs text-slate-500 mt-0.5">Gera espelho do mês atual (Portaria 1510)</p>
                </div>
                <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
                  {loading.mte ? <Icons.Refresh spin /> : <Icons.Download />}
                </div>
              </button>

              <button onClick={() => gerarPDF("horas")} disabled={loading.rel}
                className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl p-5 flex items-center gap-4 text-left transition-all group disabled:opacity-50">
                <div className="w-10 h-10 bg-sky-950 rounded-lg flex items-center justify-center text-sky-400 group-hover:bg-sky-900 transition-colors flex-shrink-0">
                  <Icons.BarChart />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-100 text-sm">Relatório de Horas — PDF</p>
                  <p className="text-xs text-slate-500 mt-0.5">Gera relatório de horas do mês atual</p>
                </div>
                <div className="text-slate-600 group-hover:text-slate-400 transition-colors">
                  {loading.rel ? <Icons.Refresh spin /> : <Icons.Download />}
                </div>
              </button>
            </div>
          </div>

          {/* Tabela de logs */}
          <div>
            <h2 className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-3">Logs de sincronização</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    {["Data / Hora", "Tipo", "Status", "Batidas", "Detalhe"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3 tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading.data ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-700 last:border-0">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-5 py-3">
                            <div className="h-4 bg-slate-700 rounded animate-pulse w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-slate-500 text-sm">
                        Nenhum log encontrado. Execute uma sync para começar.
                      </td>
                    </tr>
                  ) : (
                    logs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="border-b border-slate-700 last:border-0 hover:bg-slate-700 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-300 whitespace-nowrap">{formatDT(log.dataHora)}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{log.tipo}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-medium ${log.status === "SUCESSO" ? "text-emerald-400" : "text-red-400"}`}>
                            {log.status === "SUCESSO" ? <Icons.Check /> : <Icons.X />}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-slate-300">
                          {(log.novasBatidas ?? 0) > 0 ? `+${log.novasBatidas}` : "—"}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500 max-w-xs truncate">{log.erro ?? "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}