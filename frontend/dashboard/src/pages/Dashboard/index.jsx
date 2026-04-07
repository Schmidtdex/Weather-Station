import StatCard from "../../components/StatCard";
import HumidityBar from "../../components/Humiditybar";
import TemporalChart from "../../components/Temporalchart";
import { useLiveReading } from "../../hooks/useLiveReadings";
import { useStatistics } from "../../hooks/useStatistics";

function calcDewPoint(temp, rh) {
  const a = 17.27,
    b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(rh / 100);
  return ((b * alpha) / (a - alpha)).toFixed(1);
}

export default function Dashboard() {
  const { leituras, loading, error, lastUp } = useLiveReading();
  const { stats } = useStatistics();

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <span
            className="material-symbols-outlined animate-spin block"
            style={{ fontSize: 40, color: "var(--primary)", textShadow: "0 0 10px rgba(114,220,255,0.4)" }}
          >
            autorenew
          </span>
          <p
            className="font-headline text-xs uppercase tracking-widest mt-3"
            style={{ color: "var(--on-surface-variant)" }}
          >
            Carregando stream...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="font-headline text-sm" style={{ color: "var(--error)" }}>
          {error}
        </p>
      </div>
    );

  const latest = leituras[leituras.length - 1];

  const chartData = leituras.map((l) => ({
    time: l.timestamp?.slice(11, 16) ?? "",
    Temperatura: l.temperatura,
    Umidade: l.umidade,
  }));

  const dewPoint = latest
    ? calcDewPoint(latest.temperatura, latest.umidade)
    : null;

  const pressureBars = leituras.slice(-7).map((l) => l.pressao ?? 1013);
  const pMax = Math.max(...pressureBars, 1);
  const pMin = Math.min(...pressureBars);
  const pRange = pMax - pMin || 1;

  return (
    <div className="relative min-h-screen pl-65 pr-8 py-8 flex flex-col">
      {/* Background*/}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(114,220,255,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 grid grid-cols-12 gap-5">
        {/* ── LEFT COLUMN ── */}
        <div className="col-span-3 flex flex-col gap-5">
          {/* Panel de Pressão */}
          <section
            className="glass-panel rounded-xl p-5 relative overflow-hidden"
            style={{
              background: "rgba(10, 12, 16, 0.6)",
              border: "1px solid rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2
                  className="font-headline text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "var(--primary)" }}
                >
                  Gradiente de Pressão
                </h2>
                <p
                  className="font-headline font-bold text-3xl mt-1"
                  style={{ color: "var(--on-surface)", textShadow: "0 0 10px rgba(255,255,255,0.1)" }}
                >
                  {latest?.pressao ? latest.pressao.toFixed(1) : "—"}
                  <span
                    className="text-xs font-normal ml-1"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    hPa
                  </span>
                </p>
              </div>
              <span
                className="material-symbols-outlined opacity-70"
                style={{ color: "var(--primary)", fontSize: 22 }}
              >
                waves
              </span>
            </div>


            <div className="h-28 flex items-end gap-1 px-1 border-b border-[rgba(255,255,255,0.05)] pb-1">
              {(pressureBars.length ? pressureBars : Array(7).fill(50)).map(
                (v, i) => {
                  const h = Math.round(((v - pMin) / pRange) * 70 + 20);
                  const isLast = i === pressureBars.length - 1;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all duration-700"
                      style={{
                        height: `${h}%`,
                        background: isLast
                          ? "var(--primary)"
                          : `rgba(114,220,255,${0.05 + i * 0.05})`,
                        boxShadow: isLast
                          ? "0 0 12px rgba(114,220,255,0.4)"
                          : "none",
                      }}
                    />
                  );
                },
              )}
            </div>
          </section>

          {/* Status panel */}
          <section
            className="glass-panel rounded-xl p-5 flex-1 flex flex-col justify-between"
            style={{
              background: "rgba(10, 12, 16, 0.6)",
              border: "1px solid rgba(255,255,255,0.02)",
            }}
          >
            <div>
              <h2
                className="font-headline text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--secondary)" }}
              >
                Status do Sistema
              </h2>
              <div
                className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-[rgba(208,188,255,0.1)]"
                style={{ background: "rgba(47,0,118,0.15)" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: "var(--secondary)",
                    fontSize: 22,
                    textShadow: "0 0 8px rgba(208,188,255,0.5)",
                  }}
                >
                  sensors
                </span>
                <div>
                  <p
                    className="font-headline text-xs font-bold tracking-wide"
                    style={{ color: "var(--secondary)" }}
                  >
                    LEITURA ATIVA
                  </p>
                  <p
                    className="font-headline text-[10px]"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    Atualiza a cada 10s
                  </p>
                </div>
              </div>

              {/* Histórico*/}
              <div className="mt-5 flex flex-col gap-3">
                {leituras
                  .slice(-3)
                  .reverse()
                  .map((l) => (
                    <div
                      key={l.id}
                      className="flex justify-between items-center"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.02)",
                        paddingBottom: 6,
                      }}
                    >
                      <span
                        className="font-headline text-[10px] uppercase tracking-wider"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        {l.timestamp?.slice(11, 16)}
                      </span>
                      <span
                        className="font-headline text-xs font-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        {l.temperatura}°C
                      </span>
                      <span
                        className="font-headline text-xs"
                        style={{ color: "var(--tertiary)" }}
                      >
                        {l.umidade}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        </div>

        {/* ── CENTER COLUMN ── */}
        <div className="col-span-6 flex flex-col gap-5">
          {/* Hero temperature */}
          <div className="flex-1 relative flex items-center justify-center min-h-[40vh] bg-[rgba(10,12,16,0.3)] rounded-xl border border-[rgba(255,255,255,0.02)]">
            <div
              className="absolute top-5 left-5 p-3 opacity-60"
              style={{
                borderLeft: "2px solid var(--primary-dim)",
                borderTop: "2px solid var(--primary-dim)",
              }}
            >
            </div>

            <div className="text-center">
              <p
                className="font-headline font-bold leading-none tracking-tighter"
                style={{
                  fontSize: "clamp(90px, 11vw, 150px)",
                  color: "var(--primary)",
                  textShadow: "0 0 30px rgba(114,220,255,0.3), 0 0 10px rgba(114,220,255,0.1)",
                }}
              >
                {latest ? `${latest.temperatura}°C` : "—°C"}
              </p>
              <div className="mt-4 flex flex-col items-center gap-1">
                <p
                  className="font-headline text-sm uppercase tracking-[0.4em]"
                  style={{ color: "var(--on-surface)" }}
                >
                  {latest?.localizacao ?? "Aguardando dados"}
                </p>
                {lastUp && (
                  <p
                    className="font-headline text-[10px] uppercase tracking-widest opacity-50"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    SYNC: {lastUp.toLocaleTimeString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gráfico Temporal */}
          <div className="glass-panel rounded-xl p-4 bg-[rgba(10,12,16,0.6)] border border-[rgba(255,255,255,0.02)]">
            <TemporalChart data={chartData} />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="col-span-3 flex flex-col gap-5">
            <HumidityBar
              value={latest ? Math.round(latest.umidade) : 0}
              dewPoint={dewPoint}
            />

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Temp Média"
              value={stats?.temp_media}
              unit="°C"
              accentColor="var(--primary)"
              delay={0}
            />
            <StatCard
              label="Temp Mín"
              value={stats?.temp_min}
              unit="°C"
              accentColor="var(--secondary)"
              delay={80}
            />
            <StatCard
              label="Temp Máx"
              value={stats?.temp_max}
              unit="°C"
              accentColor="var(--on-error-container)"
              delay={160}
            />
            <StatCard
              label="Umid Média"
              value={stats?.umid_media}
              unit="%"
              accentColor="var(--tertiary)"
              delay={240}
            />
          </div>
        </div>
      </div>
    </div>
  );
}