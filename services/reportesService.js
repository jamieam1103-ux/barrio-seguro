import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE, DESC_SIMULADOS } from "../constants/datosEjemplo";
import { TIPOS, LISTA_TIPOS, ESTADOS } from "../constants/tipos";
import { CALLES_H, CALLES_V, ajustarPunto } from "../constants/barrio";

const CLAVE = "reporteya.v1";
const MAX_REPORTES = 60;

const oyentes = new Set();
let estado = { incidentes: [], seq: 0, ultimoNuevo: null, confirmados: [] };
let listo = false;
let simulando = true;

const copia = () => ({ ...estado });
const avisar = () => oyentes.forEach((fn) => fn(copia()));
const guardar = async () => {
  try {
    await AsyncStorage.setItem(
      CLAVE,
      JSON.stringify({ seq: estado.seq, incidentes: estado.incidentes, confirmados: estado.confirmados }),
    );
  } catch (e) {
    console.log("No se pudo guardar:", e.message);
  }
};

export const suscribir = (fn) => {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
};

const sembrar = () => {
  const ahora = Date.now();
  const min = 60000;
  let seq = 0;
  const incidentes = BASE.map((b) => {
    const id = ++seq;
    const ts = ahora - b.hace * min;
    const hist = [{ ts, texto: "Reporte creado" }];
    if (b.estado !== "pendiente") hist.push({ ts: ts + 4 * min, texto: "Estado: En atención" });
    if (b.estado === "resuelto") hist.push({ ts: ts + 40 * min, texto: "Estado: Resuelto" });
    return {
      id, tipo: b.tipo, desc: b.desc, loc: b.loc, x: b.x, y: b.y, ts,
      urgencia: b.urgencia, estado: b.estado, confirmaciones: b.confirmaciones || 0,
      hist, foto: null, anonimo: false, sim: false,
    };
  });
  return { seq, incidentes, ultimoNuevo: null, confirmados: [] };
};

export const inicializar = async () => {
  if (listo) return copia();
  try {
    const raw = await AsyncStorage.getItem(CLAVE);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && Array.isArray(o.incidentes) && o.incidentes.length) {
        estado = {
          incidentes: o.incidentes,
          seq: o.seq || o.incidentes.reduce((a, i) => Math.max(a, i.id), 0),
          ultimoNuevo: null,
          confirmados: o.confirmados || [],
        };
        listo = true;
        return copia();
      }
    }
  } catch (e) {
    console.log("Datos guardados ilegibles, se cargan los de ejemplo:", e.message);
  }
  estado = sembrar();
  listo = true;
  await guardar();
  return copia();
};

const crear = (datos, propio) => {
  const id = estado.seq + 1;
  const it = {
    id,
    tipo: datos.tipo,
    desc: datos.desc,
    loc: datos.loc,
    x: datos.x,
    y: datos.y,
    ts: datos.ts || Date.now(),
    urgencia: datos.urgencia,
    estado: "pendiente",
    confirmaciones: 0,
    hist: [{ ts: datos.ts || Date.now(), texto: "Reporte creado" }],
    foto: datos.foto || null,
    anonimo: !!datos.anonimo,
    sim: !!datos.sim,
  };
  estado = {
    ...estado,
    seq: id,
    incidentes: [...estado.incidentes, it],
    ultimoNuevo: id,
    confirmados: propio ? [...estado.confirmados, id] : estado.confirmados,
  };
  return it;
};

// Reporte hecho por la persona que usa la app (cuenta como ya confirmado por ella)
export const agregarReporte = async (datos) => {
  await inicializar();
  const it = crear(datos, true);
  await guardar();
  avisar();
  return it;
};

export const confirmar = async (id) => {
  await inicializar();
  const it = estado.incidentes.find((i) => i.id === id);
  if (!it) return { ok: false, mensaje: "El reporte ya no existe." };
  if (estado.confirmados.includes(id)) return { ok: false, mensaje: "Ya confirmaste este reporte." };
  estado = {
    ...estado,
    confirmados: [...estado.confirmados, id],
    incidentes: estado.incidentes.map((i) =>
      i.id === id
        ? {
            ...i,
            confirmaciones: i.confirmaciones + 1,
            hist: [...i.hist, { ts: Date.now(), texto: "Un vecino confirmó el reporte" }],
          }
        : i,
    ),
  };
  await guardar();
  avisar();
  return { ok: true };
};

export const cambiarEstado = async (id, nuevo) => {
  await inicializar();
  const it = estado.incidentes.find((i) => i.id === id);
  if (!it || it.estado === nuevo || !ESTADOS[nuevo]) return { ok: false };
  estado = {
    ...estado,
    incidentes: estado.incidentes.map((i) =>
      i.id === id
        ? { ...i, estado: nuevo, hist: [...i.hist, { ts: Date.now(), texto: `Estado: ${ESTADOS[nuevo].label}` }] }
        : i,
    ),
  };
  await guardar();
  avisar();
  return { ok: true };
};

export const restablecer = async () => {
  estado = sembrar();
  listo = true;
  await guardar();
  avisar();
};

/* ---------- modo demo: reportes simulados que llegan "en vivo" ---------- */
const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];
const entre = (a, b) => a + Math.random() * (b - a);

export const simular = async () => {
  if (!listo || estado.incidentes.length >= MAX_REPORTES) return;
  const tipo = elegir(LISTA_TIPOS).id;
  let x, y;
  if (Math.random() < 0.5) {
    y = elegir(CALLES_H).v;
    x = entre(30, 570);
  } else {
    x = elegir(CALLES_V).v;
    y = entre(30, 370);
  }
  const p = ajustarPunto(x, y);
  crear({ tipo, desc: elegir(DESC_SIMULADOS[tipo]), loc: p.loc, x: p.x, y: p.y, urgencia: TIPOS[tipo].urgencia, sim: true }, false);
  await guardar();
  avisar();
};

export const simulacionActiva = () => simulando;
export const setSimulacion = (valor) => {
  simulando = !!valor;
};

export const iniciarSimulacion = () => {
  const t = setInterval(() => {
    if (simulando && Math.random() < 0.85) simular();
  }, 12000);
  return () => clearInterval(t);
};
