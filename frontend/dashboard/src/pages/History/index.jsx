import { useState } from "react";
import EditModal from "../../components/Editmodal";
import { useReadings } from "../../hooks/useReadings";
import { http } from "../../api/api";

export default function History() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, loading, error, refetch } = useReadings(page);

  const handleDelete = async (id) => {
    setDeleting(id);
    await http.delete(`/leituras/${id}`);
    await refetch();
    setDeleting(null);
  };

  if (error)
    return (
      <p className="font-headline text-sm" style={{ color: "var(--error)" }}>
        {error}
      </p>
    );

  const COLS = [
    "#",
    "Temperatura",
    "Umidade",
    "Pressão",
    "Localização",
    "Timestamp",
    "Ações",
  ];

  return (
    <div className="relative page-enter min-h-screen">
      {/* Ambient radial suavizado */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, rgba(208,188,255,0.03) 0%, transparent 60%)",
        }}
      />

      {editing && (
        <EditModal
          leitura={editing}
          onClose={() => setEditing(null)}
          onSave={refetch}
        />
      )}

      <div className="relative z-10">
        {/* Page header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1
              className="font-headline font-bold"
              style={{ fontSize: 32, color: "var(--on-surface)" }}
            >
              Histórico de{" "}
              <span
                style={{
                  color: "var(--secondary)",
                  textShadow: "0 0 15px rgba(208,188,255,0.3)",
                }}
              >
                Registros
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className="font-headline text-xs tracking-wider uppercase"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Total: {data?.total || 0}
            </span>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[rgba(208,188,255,0.1)]"
              style={{
                background: "rgba(10,12,16,0.6)",
                color: "var(--on-secondary-container)",
              }}
            >
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-xs font-mono">
                PÁG {page}/{data?.pages || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div
          className="rounded-xl overflow-hidden bg-[rgba(10,12,16,0.6)]"
          style={{ border: "1px solid rgba(255,255,255,0.03)" }}
        >
          {/* Table header limpo */}
          <div
            className="grid px-6 py-4"
            style={{
              gridTemplateColumns: "60px 1fr 1fr 1fr 1fr 1fr 120px",
              background: "rgba(0,0,0,0.4)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {COLS.map((h) => (
              <span
                key={h}
                className="font-headline text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {loading ? (
            <div className="py-20 text-center">
              <span
                className="material-symbols-outlined animate-spin"
                style={{
                  fontSize: 32,
                  color: "var(--primary)",
                  textShadow: "0 0 10px rgba(114,220,255,0.3)",
                }}
              >
                autorenew
              </span>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="py-20 text-center">
              <span
                className="font-headline text-xs tracking-widest uppercase opacity-50"
                style={{ color: "var(--on-surface-variant)" }}
              >
                Nenhuma leitura encontrada.
              </span>
            </div>
          ) : (
            data.data.map((l) => (
              <div
                key={l.id}
                className="grid px-6 py-4 transition-colors duration-200 hover:bg-white/2"
                style={{
                  gridTemplateColumns: "60px 1fr 1fr 1fr 1fr 1fr 120px",
                  borderBottom: "1px solid rgba(255,255,255,0.02)",
                  alignItems: "center",
                }}
              >
                <span
                  className="font-mono text-xs opacity-50"
                  style={{ color: "var(--on-surface)" }}
                >
                  {l.id.toString().padStart(4, "0")}
                </span>
                <span
                  className="font-headline text-sm font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {l.temperatura}°C
                </span>
                <span
                  className="font-headline text-sm font-bold"
                  style={{ color: "var(--tertiary)" }}
                >
                  {l.umidade}%
                </span>
                <span
                  className="font-body text-sm opacity-80"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {l.pressao ? `${l.pressao} hPa` : "—"}
                </span>
                <span
                  className="font-body text-sm opacity-80"
                  style={{ color: "var(--on-surface-variant)" }}
                >
                  {l.localizacao}
                </span>
                <span
                  className="font-mono text-[10px] opacity-60"
                  style={{ color: "var(--on-surface)" }}
                >
                  {l.timestamp?.slice(11, 19) || l.timestamp}
                </span>

                {/* Botões de Ação Refinados */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(l)}
                    className="flex items-center justify-center w-8 h-8 rounded border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16 }}
                    >
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    disabled={deleting === l.id}
                    className="flex items-center justify-center w-8 h-8 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16 }}
                    >
                      {deleting === l.id ? "hourglass_empty" : "delete"}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Refinada */}
        {data?.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded font-headline text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/5 disabled:opacity-30"
              style={{ color: "var(--on-surface)" }}
            >
              ANTERIOR
            </button>

            {Array.from({ length: data.pages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === data.pages || Math.abs(p - page) <= 1,
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={i} className="opacity-30">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs transition-colors"
                    style={
                      p === page
                        ? {
                            background: "rgba(114,220,255,0.1)",
                            color: "var(--primary)",
                            border: "1px solid rgba(114,220,255,0.4)",
                            boxShadow: "inset 0 0 10px rgba(114,220,255,0.1)",
                          }
                        : {
                            color: "var(--on-surface-variant)",
                            border: "1px solid transparent",
                          }
                    }
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page === data.pages}
              className="px-4 py-2 rounded font-headline text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/5 disabled:opacity-30"
              style={{ color: "var(--on-surface)" }}
            >
              PRÓXIMO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
