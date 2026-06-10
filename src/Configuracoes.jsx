import { useState, useEffect } from "react";

const API = "";

// ── Mapa de seções e campos ───────────────────────────────────────────────────
const SECOES = {
  SYNC: {
    label: "Sincronização",
    campos: {
      "sync.habilitado":         { label: "Sync automática habilitada",  tipo: "boolean" },
      "sync.intervalo.minutos":  { label: "Intervalo entre syncs (min)", tipo: "number", min: 1, max: 120 },
    },
  },
  EMPRESA: {
    label: "Empresa",
    campos: {
      "empresa.razao.social":    { label: "Razão social",           tipo: "text"     },
      "empresa.cnpj":            { label: "CNPJ",                   tipo: "text"     },
      "empresa.cei":             { label: "CEI",                    tipo: "text"     },
      "empresa.endereco":        { label: "Endereço completo",      tipo: "text"     },
      "empresa.num.fabricacao":  { label: "Nº fabricação REP",      tipo: "text"     },
    },
  },
  EMAIL: {
    label: "E-mail",
    campos: {
      "email.habilitado":        { label: "Envio de e-mails habilitado", tipo: "boolean"  },
      "email.smtp.host":         { label: "Servidor SMTP",               tipo: "text"     },
      "email.smtp.port":         { label: "Porta SMTP",                  tipo: "number", min: 1, max: 65535 },
      "email.smtp.username":     { label: "Usuário SMTP",                tipo: "text"     },
      "email.smtp.password":     { label: "Senha SMTP",                  tipo: "password" },
      "email.from":              { label: "Endereço remetente",          tipo: "text"     },
      "email.smtp.tls":          { label: "Habilitar TLS",               tipo: "boolean"  },
    },
  },
  WHATSAPP: {
    label: "WhatsApp",
    campos: {
      "whatsapp.habilitado":           { label: "WhatsApp habilitado",    tipo: "boolean" },
      "whatsapp.evolution.url":        { label: "URL da Evolution API",   tipo: "text"    },
      "whatsapp.evolution.apikey":     { label: "API Key",                tipo: "password"},
      "whatsapp.evolution.instancia":  { label: "Nome da instância",      tipo: "text"    },
      "whatsapp.resumo.hora":          { label: "Hora do resumo diário",  tipo: "number", min: 0, max: 23 },
    },
  },
  GERAL: {
    label: "Geral",
    campos: {
      "geral.nome.aplicacao":  { label: "Nome da aplicação", tipo: "text" },
      "geral.timezone":        { label: "Fuso horário",       tipo: "text" },
    },
  },
};

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icons = {
  Clock:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>,
  Users:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>,
  BarChart:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1={18} y1={20} x2={18} y2={10}/><line x1={12} y1={20} x2={12} y2={4}/><line x1={6} y1={20} x2={6} y2={14}/><line x1={2} y1={20} x2={22} y2={20}/></svg>,
  FileText:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1={16} y1={13} x2={8} y2={13}/><line x1={16} y1={17} x2={8} y2={17}/></svg>,
  Settings:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={3}/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>,
  Info:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx={12} cy={12} r={10}/><line x1={12} y1={16} x2={12} y2={12}/><line x1={12} y1={8} x2={12.01} y2={8}/></svg>,
  Check:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  X:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx={12} cy={12} r={10}/><line x1={15} y1={9} x2={9} y2={15}/><line x1={9} y1={9} x2={15} y2={15}/></svg>,
  Eye:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></svg>,
  EyeOff:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1={1} y1={1} x2={23} y2={23}/></svg>,
  Spinner:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
  Refresh:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
};

// ── Subcomponentes de campo ───────────────────────────────────────────────────
const inputCls = "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors";

function Toggle({ value, onChange }) {
  const ativo = value === "true";
  return (
    <div onClick={() => onChange(ativo ? "false" : "true")}
      className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative flex-shrink-0 ${ativo ? "bg-amber-400" : "bg-slate-600"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${ativo ? "left-5" : "left-1"}`}/>
    </div>
  );
}

function PasswordField({ value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} pr-10`}
        placeholder="••••••••"
      />
      <button type="button" onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
        {show ? <Icons.EyeOff/> : <Icons.Eye/>}
      </button>
    </div>
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

const NAV = [
  { id: "dashboard",    label: "Dashboard",     Icon: Icons.Dashboard },
  { id: "funcionarios", label: "Funcionários",  Icon: Icons.Users     },
  { id: "relatorios",   label: "Relatórios",    Icon: Icons.BarChart  },
  { id: "tratamentos",  label: "Tratamentos",   Icon: Icons.FileText  },
  { id: "config",       label: "Configurações", Icon: Icons.Settings  },
  { id: "sobre", label: "Sobre", Icon: Icons.Info },
];

// ── Página principal ──────────────────────────────────────────────────────────
export default function Configuracoes({ onNavigate }) {
  const [configs, setConfigs]     = useState({});   // { chave: valor }
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [abaAtiva, setAbaAtiva]   = useState("SYNC");
  const [toast, setToast]         = useState(null);

  // Carrega todas as configurações
  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      try {
        const res  = await fetch(`${API}/api/config`);
        const data = await res.json();
        if (!cancelado) {
          // Normaliza para { chave: valor } independente do formato da resposta
          const mapa = {};
          if (Array.isArray(data)) {
            data.forEach((c) => { mapa[c.chave] = c.valor; });
          } else if (typeof data === "object") {
            // Pode vir agrupado por categoria: { SYNC: [{chave, valor}], ... }
            Object.values(data).forEach((grupo) => {
              if (Array.isArray(grupo)) {
                grupo.forEach((c) => { mapa[c.chave] = c.valor; });
              }
            });
          }
          setConfigs(mapa);
        }
      } catch {
        if (!cancelado) setToast({ ok: false, text: "Não foi possível carregar as configurações." });
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  function setValor(chave, valor) {
    setConfigs((prev) => ({ ...prev, [chave]: valor }));
  }

  // Salva apenas as chaves da aba ativa
  async function salvar() {
    setSaving(true);
    try {
      const chavesDaAba = Object.keys(SECOES[abaAtiva].campos);
      const lote = {};
      chavesDaAba.forEach((k) => {
        if (configs[k] !== undefined) lote[k] = String(configs[k]);
      });
      const res = await fetch(`${API}/api/config/lote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lote),
      });
      if (!res.ok) throw new Error();
      setToast({ ok: true, text: `Configurações de ${SECOES[abaAtiva].label} salvas!` });
    } catch {
      setToast({ ok: false, text: "Erro ao salvar. Verifique a conexão com a API." });
    } finally {
      setSaving(false);
    }
  }

  const secaoAtual = SECOES[abaAtiva];
  const campos     = Object.entries(secaoAtual.campos);

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
                id === "config"
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
          <h1 className="font-semibold text-lg text-slate-100 leading-none">Configurações</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gerencie as configurações do sistema em tempo real</p>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5">
          <Toast msg={toast} onDismiss={() => setToast(null)}/>

          {/* Abas de categoria */}
          <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1.5">
            {Object.entries(SECOES).map(([id, { label }]) => (
              <button key={id} onClick={() => setAbaAtiva(id)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  abaAtiva === id
                    ? "bg-amber-400 text-slate-900"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Painel da seção ativa */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

            {/* Título da seção */}
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-100">{secaoAtual.label}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {campos.length} configuração{campos.length !== 1 ? "ões" : ""}
                </p>
              </div>
              {!loading && (
                <button onClick={salvar} disabled={saving}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-800 disabled:text-amber-600 text-slate-900 font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                  {saving ? <><Icons.Spinner/> Salvando...</> : <><Icons.Check/> Salvar {secaoAtual.label}</>}
                </button>
              )}
            </div>

            {/* Campos */}
            {loading ? (
              <div className="px-6 py-8 space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-700 rounded animate-pulse w-32"/>
                    <div className="h-10 bg-slate-700 rounded-lg animate-pulse"/>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-6 space-y-5">
                {campos.map(([chave, campo]) => (
                  <div key={chave}>
                    {campo.tipo === "boolean" ? (
                      /* Toggle */
                      <div className="flex items-center justify-between py-1">
                        <div>
                          <p className="text-sm font-medium text-slate-200">{campo.label}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{chave}</p>
                        </div>
                        <Toggle
                          value={configs[chave] ?? "false"}
                          onChange={(v) => setValor(chave, v)}
                        />
                      </div>
                    ) : (
                      /* Input text/number/password */
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                          {campo.label}
                        </label>
                        <p className="text-xs text-slate-600 font-mono mb-1.5">{chave}</p>
                        {campo.tipo === "password" ? (
                          <PasswordField
                            value={configs[chave] ?? ""}
                            onChange={(v) => setValor(chave, v)}
                          />
                        ) : (
                          <input
                            type={campo.tipo === "number" ? "number" : "text"}
                            min={campo.min}
                            max={campo.max}
                            value={configs[chave] ?? ""}
                            onChange={(e) => setValor(chave, e.target.value)}
                            className={inputCls}
                          />
                        )}
                      </div>
                    )}

                    {/* Divisor entre campos */}
                    <div className="border-b border-slate-700 mt-5"/>
                  </div>
                ))}

                {/* Botão salvar ao final também (conveniente em seções longas) */}
                <div className="flex justify-end pt-1">
                  <button onClick={salvar} disabled={saving}
                    className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-800 disabled:text-amber-600 text-slate-900 font-semibold text-sm px-5 py-2 rounded-lg transition-colors">
                    {saving ? <><Icons.Spinner/> Salvando...</> : <><Icons.Check/> Salvar {secaoAtual.label}</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}