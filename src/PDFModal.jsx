// Componente reutilizável — abre PDF em tela cheia dentro do app
// Uso: <PDFModal url={blobUrl} nome="arquivo.pdf" onClose={() => setPdf(null)} />

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1={12} y1={15} x2={12} y2={3}/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/>
  </svg>
);

export default function PDFModal({ url, nome, onClose }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-95">

      {/* Barra superior */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <span className="text-sm text-slate-200 font-mono truncate max-w-lg">{nome}</span>
        <div className="flex items-center gap-3">
          {/* Botão baixar */}
          <a
            href={url}
            download={nome}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-amber-400 px-3 py-1.5 rounded-lg border border-slate-600 hover:border-amber-400 transition-colors"
          >
            <DownloadIcon/> Baixar
          </a>
          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
          >
            <XIcon/>
          </button>
        </div>
      </div>

      {/* Visualizador */}
      <iframe
        src={url}
        title={nome}
        className="flex-1 w-full border-0 bg-slate-950"
      />
    </div>
  );
}