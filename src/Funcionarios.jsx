import { useState, useEffect } from "react";

const API = "";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPIS(pis) {
  if (!pis) return "—";
  const s = String(pis).padStart(11, "0");
  return `${s.slice(0,3)}.${s.slice(3,8)}.${s.slice(8,10)}-${s.slice(10)}`;
}

// FORM_VAZIO — campos com nomes iguais ao que a API espera
const FORM_VAZIO = {
  pis: "", nome: "", code: "", matricula: "",
  cpf: "", rg: "", cargo: "", setor: "",
  email: "", celular: "", salario: "", dataAdmissao: "",
  supervisor: false,
  whatsappNumero: "", whatsappHabilitado: false,
  whatsappPreferencia: "RESUMO_DIA",
};

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
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/>
      <line x1={12} y1={8} x2={12.01} y2={8}/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
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
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/>
    </svg>
  ),
  UserCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx={9} cy={7} r={4}/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  ),
};

// ── Subcomponentes ────────────────────────────────────────────────────────────
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

function StatusBadge({ ativo }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
      ativo ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
             : "bg-slate-700 text-slate-400 border border-slate-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ativo ? "bg-emerald-400" : "bg-slate-500"}`}/>
      {ativo ? "Ativo" : "Inativo"}
    </span>
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

// ── Modal ─────────────────────────────────────────────────────────────────────
function ModalFuncionario({ modo, form, onChange, onSave, onClose, saving }) {
  const isEdicao = modo === "edit";

  function field(key) {
    return {
      value: form[key] ?? "",
      onChange: (e) => onChange(key, e.target.type === "checkbox" ? e.target.checked : e.target.value),
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-semibold text-slate-100">
              {isEdicao ? "Editar Funcionário" : "Novo Funcionário"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdicao ? `PIS: ${formatPIS(form.pis)}` : "Preencha os dados abaixo"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
            <Icons.X/>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">

            {!isEdicao && (
              <Campo label="PIS *">
                <input {...field("pis")} placeholder="00000000000" maxLength={11} className={inputCls} required/>
              </Campo>
            )}

            {/* nome — campo correto da API */}
            <Campo label="Nome completo *" span2={isEdicao}>
              <input {...field("nome")} placeholder="Nome do funcionário" className={inputCls} required/>
            </Campo>

            <Campo label="CPF">
              <input {...field("cpf")} placeholder="000.000.000-00" className={inputCls}/>
            </Campo>
            <Campo label="RG">
              <input {...field("rg")} placeholder="00.000.000-0" className={inputCls}/>
            </Campo>

            <Campo label="Cargo">
              <input {...field("cargo")} placeholder="Ex: Operador" className={inputCls}/>
            </Campo>
            <Campo label="Setor">
              <input {...field("setor")} placeholder="Ex: Produção" className={inputCls}/>
            </Campo>

            {/* matricula — campo correto da API */}
            <Campo label="Matrícula">
              <input {...field("matricula")} type="number" placeholder="0" className={inputCls}/>
            </Campo>
            <Campo label="Código no relógio">
              <input {...field("code")} type="number" placeholder="0" className={inputCls}/>
            </Campo>

            <Campo label="Data de admissão">
              <input {...field("dataAdmissao")} type="date" className={inputCls}/>
            </Campo>
            <Campo label="Salário (R$)">
              <input {...field("salario")} type="number" step="0.01" placeholder="0,00" className={inputCls}/>
            </Campo>

            <Campo label="E-mail">
              <input {...field("email")} type="email" placeholder="nome@empresa.com" className={inputCls}/>
            </Campo>
            <Campo label="Celular">
              <input {...field("celular")} placeholder="(11) 99999-9999" className={inputCls}/>
            </Campo>

            <Campo label="WhatsApp" span2>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => onChange("whatsappHabilitado", !form.whatsappHabilitado)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${form.whatsappHabilitado ? "bg-amber-400" : "bg-slate-600"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.whatsappHabilitado ? "left-4" : "left-0.5"}`}/>
                  </div>
                  <span className="text-sm text-slate-300">Habilitado</span>
                </label>
                {form.whatsappHabilitado && (
                  <>
                    <input {...field("whatsappNumero")} placeholder="5511999999999" className={`${inputCls} flex-1`}/>
                    <select {...field("whatsappPreferencia")} className={selectCls}>
                      <option value="RESUMO_DIA">Resumo do dia</option>
                      <option value="CADA_BATIDA">Cada batida</option>
                    </select>
                  </>
                )}
              </div>
            </Campo>

            <Campo label="Supervisor" span2>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => onChange("supervisor", !form.supervisor)}
                  className={`w-9 h-5 rounded-full transition-colors relative ${form.supervisor ? "bg-amber-400" : "bg-slate-600"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.supervisor ? "left-4" : "left-0.5"}`}/>
                </div>
                <span className="text-sm text-slate-300">Este funcionário é supervisor</span>
              </label>
            </Campo>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-600 hover:border-slate-500 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-800 disabled:text-amber-600 text-slate-900 font-semibold text-sm rounded-lg transition-colors">
            {saving ? "Salvando..." : isEdicao ? "Salvar alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ nome, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-slate-800 border border-red-800 rounded-xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="font-semibold text-slate-100 mb-2">Inativar funcionário?</h3>
        <p className="text-sm text-slate-400 mb-6">
          <span className="text-slate-200 font-medium">{nome}</span> não poderá mais registrar ponto.
          Você pode reativá-lo depois.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-400 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors">
            Inativar
          </button>
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
  { id: "sobre",        label: "Sobre",         Icon: Icons.Info      },
];

// ── Página ────────────────────────────────────────────────────────────────────
export default function Funcionarios({ onNavigate }) {
  const [lista, setLista]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch]         = useState("");
  const [filtro, setFiltro]         = useState("ativos");
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState(FORM_VAZIO);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);
  const [confirmar, setConfirmar]   = useState(null);

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      try {
        const res  = await fetch(`${API}/api/funcionarios`);
        const data = await res.json();
        if (!cancelado) setLista(data);
      } catch {
        if (!cancelado) setToast({ ok: false, text: "Não foi possível carregar os funcionários." });
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, [refreshKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Filtro + busca usando campo "nome" da API
  const visiveis = lista.filter((f) => {
    const matchFiltro =
      filtro === "todos"  ? true :
      filtro === "ativos" ? f.ativo !== false : f.ativo === false;
    const matchSearch = search
      ? (f.nome ?? "").toLowerCase().includes(search.toLowerCase()) ||
        String(f.pis ?? "").includes(search)
      : true;
    return matchFiltro && matchSearch;
  });

  function abrirNovo() {
    setForm(FORM_VAZIO);
    setModal("create");
  }

  function abrirEditar(func) {
    setForm({ ...FORM_VAZIO, ...func, salario: func.salario ?? "", dataAdmissao: func.dataAdmissao ?? "" });
    setModal("edit");
  }

  function onCampo(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function salvar() {
    // Validação usando "nome" — campo correto da API
    if (!form.nome?.trim()) { setToast({ ok: false, text: "O nome é obrigatório." }); return; }
    if (modal === "create" && !form.pis?.trim()) { setToast({ ok: false, text: "O PIS é obrigatório." }); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        code:      form.code      ? Number(form.code)      : null,
        matricula: form.matricula ? Number(form.matricula) : null,
        salario:   form.salario   ? Number(form.salario)   : null,
      };
      const url    = modal === "create" ? `${API}/api/funcionarios` : `${API}/api/funcionarios/${form.pis}`;
      const method = modal === "create" ? "POST" : "PUT";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setToast({ ok: true, text: modal === "create" ? "Funcionário cadastrado!" : "Alterações salvas!" });
      setModal(null);
      setRefreshKey((k) => k + 1);
    } catch {
      setToast({ ok: false, text: "Erro ao salvar. Verifique os dados e tente novamente." });
    } finally {
      setSaving(false);
    }
  }

  async function inativar(pis) {
    try {
      const res = await fetch(`${API}/api/funcionarios/${pis}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setToast({ ok: true, text: "Funcionário inativado." });
      setRefreshKey((k) => k + 1);
    } catch {
      setToast({ ok: false, text: "Erro ao inativar funcionário." });
    } finally {
      setConfirmar(null);
    }
  }

  async function reativar(pis) {
    try {
      const res = await fetch(`${API}/api/funcionarios/${pis}/reativar`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setToast({ ok: true, text: "Funcionário reativado!" });
      setRefreshKey((k) => k + 1);
    } catch {
      setToast({ ok: false, text: "Erro ao reativar funcionário." });
    }
  }

  const total  = lista.length;
  const ativos = lista.filter((f) => f.ativo !== false).length;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {modal && (
        <ModalFuncionario modo={modal} form={form} onChange={onCampo}
          onSave={salvar} onClose={() => setModal(null)} saving={saving}/>
      )}
      {confirmar && (
        <ConfirmDialog nome={confirmar.nome}
          onConfirm={() => inativar(confirmar.pis)}
          onCancel={() => setConfirmar(null)}/>
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
                id === "funcionarios"
                  ? "bg-amber-400 text-slate-900 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              }`}>
              <Icon/>{label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono text-amber-400">{ativos}</span>
            <span>/ {total} ativos</span>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-semibold text-lg text-slate-100 leading-none">Funcionários</h1>
            <p className="text-xs text-slate-500 mt-0.5">Cadastro e gestão de colaboradores</p>
          </div>
          <button onClick={abrirNovo}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            <Icons.Plus/> Novo Funcionário
          </button>
        </header>

        <main className="flex-1 overflow-hidden px-8 py-6 flex flex-col gap-5">
          <Toast msg={toast} onDismiss={() => setToast(null)}/>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icons.Search/></span>
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou PIS..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"/>
            </div>
            <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-1 gap-1">
              {[{ id: "ativos", label: "Ativos" }, { id: "inativos", label: "Inativos" }, { id: "todos", label: "Todos" }].map(({ id, label }) => (
                <button key={id} onClick={() => setFiltro(id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    filtro === id ? "bg-amber-400 text-slate-900" : "text-slate-400 hover:text-slate-200"
                  }`}>{label}</button>
              ))}
            </div>
            <span className="text-xs text-slate-500 ml-auto">
              {visiveis.length} resultado{visiveis.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {["Nome", "Cargo / Setor", "PIS", "Status", "Ações"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-slate-500 px-5 py-3 tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-700 last:border-0">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-5 py-3.5"><div className="h-4 bg-slate-700 rounded animate-pulse w-28"/></td>
                      ))}
                    </tr>
                  ))
                ) : visiveis.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-slate-500 text-sm">
                      {search ? "Nenhum funcionário encontrado para essa busca." : "Nenhum funcionário cadastrado ainda."}
                    </td>
                  </tr>
                ) : (
                  visiveis.map((f) => (
                    <tr key={f.pis} className="border-b border-slate-700 last:border-0 hover:bg-slate-700 transition-colors">
                      {/* nome — campo correto da API */}
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-200">{f.nome ?? "—"}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-300">{f.cargo ?? "—"}</span>
                        {f.setor && <span className="text-slate-500 text-xs ml-1">· {f.setor}</span>}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-400">{formatPIS(f.pis)}</td>
                      <td className="px-5 py-3.5"><StatusBadge ativo={f.ativo !== false}/></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(f)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 px-2 py-1 rounded-md hover:bg-slate-600 transition-colors">
                            <Icons.Edit/> Editar
                          </button>
                          {f.ativo !== false ? (
                            <button onClick={() => setConfirmar({ pis: f.pis, nome: f.nome })}
                              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded-md hover:bg-slate-600 transition-colors">
                              <Icons.Trash/> Inativar
                            </button>
                          ) : (
                            <button onClick={() => reativar(f.pis)}
                              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 px-2 py-1 rounded-md hover:bg-slate-600 transition-colors">
                              <Icons.UserCheck/> Reativar
                            </button>
                          )}
                        </div>
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