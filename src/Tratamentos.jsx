import { useState, useEffect } from "react";

const API = "";

// ── Helpers de data ────────────────────────────────────────────────────────────
function toApiDate(htmlDate) {
  if (!htmlDate) return "";
  const [y, m, d] = htmlDate.split("-");
  return `${d}${m}${y}`;
}
function toHtml(date) { return date.toISOString().slice(0, 10); }
function periodoEsteMes() {
  const hoje = new Date();
  return { di: toHtml(new Date(hoje.getFullYear(), hoje.getMonth(), 1)), df: toHtml(hoje) };
}
function periodoMesAnterior() {
  const hoje = new Date();
  return {
    di: toHtml(new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)),
    df: toHtml(new Date(hoje.getFullYear(), hoje.getMonth(), 0)),
  };
}
function fmtData(apiData) {
  if (!apiData) return "—";
  // apiData pode vir como "2026-05-06" (ISO) ou "06052026" (API)
  if (apiData.includes("-")) {
    return new Date(apiData + "T00:00:00").toLocaleDateString("pt-BR");
  }
  const d = apiData.slice(0,2), m = apiData.slice(2,4), y = apiData.slice(4);
  return `${d}/${m}/${y}`;
}

const FORM_VAZIO = { pis: "", data: toHtml(new Date()), horario: "", ocorrencia: "I", motivo: "" };

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icons = {
  Clock:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>,
  Users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>,
  BarChart:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/><line x1={6} y1={20} x2={6} y2={14}/><line x1={2} y1={20} x2={22} y2={20}/></svg>,
  FileText:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1={16} y1={13} x2={8} y2={13}/><line x1={16} y1={17} x2={8} y2={17}/></svg>,
  Settings:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={3}/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  Plus:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>,
  Trash:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Download:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1={12} y1={15} x2={12} y2={3}/></svg>,
  Paperclip: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Check:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  X:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx={12} cy={12} r={10}/><line x1={15} y1={9} x2={9} y2={15}/><line x1={9} y1={9} x2={15} y2={15}/></svg>,
  Calendar:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x={3} y={4} width={18} height={18} rx={2}/><line x1={16} y1={2} x2={16} y2={6}/><line x1={8} y1={2} x2={8} y2={6}/><line x1={3} y1={10} x2={21} y2={10}/></svg>,
  Spinner:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
};

// ── Badge por tipo de ocorrência ──────────────────────────────────────────────
const TIPOS = {
  I: { label: "Inclusão",        cor: "bg-emerald-950 text-emerald-400 border-emerald-800" },
  D: { label: "Desconsiderado",  cor: "bg-rose-950    text-rose-400    border-rose-800"    },
  P: { label: "Pré-assinalação", cor: "bg-violet-950  text-violet-400  border-violet-800"  },
};

function TipoBadge({ ocorrencia }) {
  const t = TIPOS[ocorrencia] ?? { label: ocorrencia, cor: "bg-slate-700 text-slate-400 border-slate-600" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${t.cor}`}>
      <span className="font-mono">{ocorrencia}</span>
      <span className="font-normal">{t.label}</span>
    </span>
  );
}

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

function Campo({ label, children, span2 = false }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls  = "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors";
const selectCls = `${inputCls} cursor-pointer`;

// ── Modal novo tratamento ─────────────────────────────────────────────────────
function ModalTratamento({ form, onChange, arquivo, onArquivo, onSave, onClose, saving, funcionarios }) {
  const precisaHorario = form.ocorrencia === "I" || form.ocorrencia === "D";
  const precisaMotivo  = form.ocorrencia === "I" || form.ocorrencia === "D";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">

        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-semibold text-slate-100">Novo Tratamento</h2>
            <p className="text-xs text-slate-500 mt-0.5">Registrar ocorrência D/I/P (Portaria MTE-1510)</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors"><Icons.X/></button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">

            {/* Funcionário */}
            <Campo label="Funcionário *" span2>
              <select value={form.pis} onChange={(e) => onChange("pis", e.target.value)} className={selectCls}>
                <option value="">Selecione...</option>
                {funcionarios.map((f) => (
                  <option key={f.pis} value={String(f.pis)}>{f.name}</option>
                ))}
              </select>
            </Campo>

            {/* Tipo */}
            <Campo label="Tipo de ocorrência *" span2>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(TIPOS).map(([id, { label, cor }]) => (
                  <button key={id} type="button"
                    onClick={() => onChange("ocorrencia", id)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${
                      form.ocorrencia === id
                        ? `${cor} border-2`
                        : "bg-slate-700 text-slate-400 border-slate-600 hover:border-slate-500"
                    }`}>
                    <span className="font-mono text-base font-bold">{id}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {form.ocorrencia === "I" && "Inclui um horário que não foi registrado no relógio."}
                {form.ocorrencia === "D" && "Remove um horário registrado incorretamente."}
                {form.ocorrencia === "P" && "Define pré-assinalação do período de repouso."}
              </p>
            </Campo>

            {/* Data */}
            <Campo label="Data *">
              <input type="date" value={form.data} onChange={(e) => onChange("data", e.target.value)} className={inputCls}/>
            </Campo>

            {/* Horário */}
            <Campo label={`Horário${precisaHorario ? " *" : " (opcional)"}`}>
              <input type="time" value={form.horario} onChange={(e) => onChange("horario", e.target.value)} className={inputCls}/>
            </Campo>

            {/* Motivo */}
            <Campo label={`Motivo${precisaMotivo ? " *" : " (opcional)"}`} span2>
              <textarea
                value={form.motivo}
                onChange={(e) => onChange("motivo", e.target.value)}
                placeholder="Descreva o motivo do tratamento..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </Campo>

            {/* Comprovante */}
            <Campo label="Comprovante (PDF, JPG ou PNG)" span2>
              <label className={`flex items-center gap-3 cursor-pointer ${inputCls} hover:border-slate-500`}>
                <Icons.Paperclip/>
                <span className={arquivo ? "text-slate-200" : "text-slate-500"}>
                  {arquivo ? arquivo.name : "Clique para selecionar arquivo..."}
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => onArquivo(e.target.files[0] ?? null)}
                />
              </label>
              {arquivo && (
                <button onClick={() => onArquivo(null)}
                  className="mt-1 text-xs text-slate-500 hover:text-red-400 transition-colors">
                  × remover arquivo
                </button>
              )}
            </Campo>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-800 disabled:text-amber-600 text-slate-900 font-semibold text-sm rounded-lg transition-colors">
            {saving ? <><Icons.Spinner/> Salvando...</> : "Registrar tratamento"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Diálogo de confirmação exclusão ──────────────────────────────────────────
function ConfirmExcluir({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-slate-800 border border-red-800 rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="font-semibold text-slate-100 mb-2">Excluir tratamento?</h3>
        <p className="text-sm text-slate-400 mb-6">O registro e o comprovante serão removidos permanentemente.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">Excluir</button>
        </div>
      </div>
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

// ── Página ────────────────────────────────────────────────────────────────────
export default function Tratamentos({ onNavigate }) {
  const [funcionarios, setFuncs]       = useState([]);
  const [funcSel, setFuncSel]          = useState("");
  const [periodo, setPeriodo]          = useState(periodoEsteMes);
  const [quickSel, setQuickSel]        = useState("este-mes");
  const [tratamentos, setTratamentos]  = useState([]);
  const [loadingFuncs, setLoadingFuncs]   = useState(true);
  const [loadingTrat, setLoadingTrat] = useState(true);
  const [saving, setSaving]            = useState(false);
  const [modal, setModal]              = useState(false);
  const [form, setForm]                = useState(FORM_VAZIO);
  const [arquivo, setArquivo]          = useState(null);
  const [toast, setToast]              = useState(null);
  const [confirmar, setConfirmar]      = useState(null);
  const [refreshTrat, setRefreshTrat]  = useState(0);

  // Carrega funcionários
  useEffect(() => {
    let cancelado = false;
    async function load() {
      try {
        const res  = await fetch(`${API}/api/funcionarios`);
        const data = await res.json();
        if (!cancelado) {
          const ativos = data.filter((f) => f.ativo !== false);
          setFuncs(ativos);
          if (ativos.length > 0) setFuncSel(String(ativos[0].pis));
        }
      } catch {
        // silencioso
      } finally {
        if (!cancelado) setLoadingFuncs(false);
      }
    }
    load();
    return () => { cancelado = true; };
  }, []);

  // Carrega tratamentos quando funcionário ou período muda
  useEffect(() => {
    if (!funcSel) return;
    let cancelado = false;
    async function load() {
      try {
        const url = `${API}/api/tratamentos/${funcSel}/periodo?di=${toApiDate(periodo.di)}&df=${toApiDate(periodo.df)}`;
        const res  = await fetch(url);
        const data = await res.json();
        if (!cancelado) setTratamentos(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelado) setTratamentos([]);
      } finally {
        if (!cancelado) setLoadingTrat(false);
      }
    }
    load();
    return () => { cancelado = true; };
  }, [funcSel, periodo.di, periodo.df, refreshTrat]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  function selecionarPeriodo(id) {
    setQuickSel(id);
    if (id === "este-mes")     setPeriodo(periodoEsteMes());
    if (id === "mes-anterior") setPeriodo(periodoMesAnterior());
  }

  function onCampo(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function abrirModal() {
    setForm({ ...FORM_VAZIO, pis: funcSel });
    setArquivo(null);
    setModal(true);
  }

  async function salvar() {
    if (!form.pis)  { setToast({ ok: false, text: "Selecione o funcionário." }); return; }
    if (!form.data) { setToast({ ok: false, text: "Informe a data." }); return; }
    if ((form.ocorrencia === "I" || form.ocorrencia === "D") && !form.horario) {
      setToast({ ok: false, text: "Horário obrigatório para esse tipo de ocorrência." }); return;
    }
    if ((form.ocorrencia === "I" || form.ocorrencia === "D") && !form.motivo.trim()) {
      setToast({ ok: false, text: "Motivo obrigatório para esse tipo de ocorrência." }); return;
    }

    setSaving(true);
    try {
      // 1. Cria o tratamento
      const payload = {
        pis:        form.pis,
        data:       toApiDate(form.data),
        horario:    form.horario || null,
        ocorrencia: form.ocorrencia,
        motivo:     form.motivo || null,
      };
      const res  = await fetch(`${API}/api/tratamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const criado = await res.json();

      // 2. Upload do comprovante (se selecionado)
      if (arquivo && criado.id) {
        const fd = new FormData();
        fd.append("arquivo", arquivo);
        await fetch(`${API}/api/tratamentos/${criado.id}/documento`, { method: "POST", body: fd });
      }

      setToast({ ok: true, text: "Tratamento registrado com sucesso!" });
      setModal(false);
      setRefreshTrat((k) => k + 1);
    } catch {
      setToast({ ok: false, text: "Erro ao registrar tratamento. Verifique os dados." });
    } finally {
      setSaving(false);
    }
  }

  async function excluir(id) {
    try {
      const res = await fetch(`${API}/api/tratamentos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast({ ok: true, text: "Tratamento excluído." });
      setRefreshTrat((k) => k + 1);
    } catch {
      setToast({ ok: false, text: "Erro ao excluir tratamento." });
    } finally {
      setConfirmar(null);
    }
  }

  async function baixarDoc(id, nomeArquivo) {
    try {
      const res  = await fetch(`${API}/api/tratamentos/${id}/documento`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = nomeArquivo ?? `comprovante_${id}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setToast({ ok: false, text: "Erro ao baixar o comprovante." });
    }
  }

  const funcNome = funcionarios.find((f) => String(f.pis) === funcSel)?.name ?? "";

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">

      {modal && (
        <ModalTratamento
          form={form} onChange={onCampo}
          arquivo={arquivo} onArquivo={setArquivo}
          onSave={salvar} onClose={() => setModal(false)}
          saving={saving} funcionarios={funcionarios}
        />
      )}
      {confirmar !== null && (
        <ConfirmExcluir
          onConfirm={() => excluir(confirmar)}
          onCancel={() => setConfirmar(null)}
        />
      )}

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
                id === "tratamentos"
                  ? "bg-amber-400 text-slate-900 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              }`}>
              <Icon/>{label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700 text-xs text-slate-500">
          {tratamentos.length > 0 && (
            <span><span className="text-amber-400 font-mono">{tratamentos.length}</span> registro{tratamentos.length !== 1 ? "s" : ""} no período</span>
          )}
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-semibold text-lg text-slate-100 leading-none">Tratamentos</h1>
            <p className="text-xs text-slate-500 mt-0.5">Ocorrências D/I/P — Portaria 1510/MTE</p>
          </div>
          <button onClick={abrirModal}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            <Icons.Plus/> Novo Tratamento
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">
          <Toast msg={toast} onDismiss={() => setToast(null)}/>

          {/* Filtros */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-6">

              {/* Funcionário */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">Funcionário</label>
                {loadingFuncs ? (
                  <div className="h-10 bg-slate-700 rounded-lg animate-pulse"/>
                ) : (
                  <select value={funcSel} onChange={(e) => setFuncSel(e.target.value)} className={selectCls}>
                    {funcionarios.map((f) => (
                      <option key={f.pis} value={String(f.pis)}>{f.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Período */}
              <div>
                <label className="block text-xs text-slate-500 mb-2">Período</label>
                <div className="flex gap-2 mb-2">
                  {[{ id: "este-mes", label: "Este mês" }, { id: "mes-anterior", label: "Mês anterior" }].map(({ id, label }) => (
                    <button key={id} onClick={() => selecionarPeriodo(id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        quickSel === id
                          ? "bg-amber-400 text-slate-900 border-amber-400"
                          : "text-slate-400 border-slate-600 hover:border-slate-500"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="date" value={periodo.di}
                    onChange={(e) => { setPeriodo((p) => ({ ...p, di: e.target.value })); setQuickSel(""); }}
                    className={`${inputCls} flex-1`}/>
                  <span className="self-center text-slate-600 text-xs">→</span>
                  <input type="date" value={periodo.df}
                    onChange={(e) => { setPeriodo((p) => ({ ...p, df: e.target.value })); setQuickSel(""); }}
                    className={`${inputCls} flex-1`}/>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {funcNome && <span className="text-slate-200">{funcNome} — </span>}
                Tratamentos no período
              </span>
              {loadingTrat && <Icons.Spinner/>}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {["Data", "Horário", "Tipo", "Motivo", "Comprovante", "Ações"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3 tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingTrat ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700 last:border-0">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-5 py-3.5"><div className="h-4 bg-slate-700 rounded animate-pulse w-20"/></td>
                      ))}
                    </tr>
                  ))
                ) : !funcSel ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">Selecione um funcionário para ver os tratamentos.</td></tr>
                ) : tratamentos.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">Nenhum tratamento encontrado no período.</td></tr>
                ) : (
                  tratamentos.map((t) => (
                    <tr key={t.id} className="border-b border-slate-700 last:border-0 hover:bg-slate-700 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-300 whitespace-nowrap">{fmtData(t.data)}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-300">{t.horario ?? "—"}</td>
                      <td className="px-5 py-3.5"><TipoBadge ocorrencia={t.ocorrencia}/></td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 max-w-xs truncate">{t.motivo ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        {t.documentoNome ? (
                          <button onClick={() => baixarDoc(t.id, t.documentoNome)}
                            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 transition-colors">
                            <Icons.Download/> {t.documentoNome}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-600">sem comprovante</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setConfirmar(t.id)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded-md hover:bg-slate-600 transition-colors">
                          <Icons.Trash/> Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}