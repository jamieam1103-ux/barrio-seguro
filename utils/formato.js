const pad = (n) => String(n).padStart(2, "0");

export const fmtId = (n) => String(n).padStart(3, "0");

export const fmtFecha = (ts) => {
  const d = new Date(ts);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const haceTiempo = (ts) => {
  const m = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (m < 1) return "Hace instantes";
  if (m < 60) return `Hace ${m} min`;
  if (m < 1440) return `Hace ${Math.floor(m / 60)} h`;
  return `Hace ${Math.floor(m / 1440)} d`;
};

export const esHoy = (ts) => {
  const a = new Date(ts);
  const b = new Date();
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};
