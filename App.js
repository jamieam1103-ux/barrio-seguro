import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import Encabezado from "./components/Encabezado";
import MapaBarrio from "./components/MapaBarrio";
import FiltroChips from "./components/FiltroChips";
import { ToastProvider, useToast } from "./components/Toast";
import useReportes from "./hooks/useReportes";
import { iniciarSimulacion, setSimulacion } from "./services/reportesService";
import {
  TIPOS,
  LISTA_TIPOS,
  URGENCIAS,
  LISTA_URGENCIAS,
  ESTADOS,
  LISTA_ESTADOS,
} from "./constants/tipos";
import { ajustarPunto, MI_UBICACION } from "./constants/barrio";
import { COLORES } from "./constants/colores";

const OPCIONES_FILTRO = [
  { id: "todos", label: "Todos", icono: "layers", color: COLORES.acento },
  ...LISTA_TIPOS.map((t) => ({ id: t.id, label: t.corto, icono: t.icono, color: t.color })),
];

const haceTiempo = (ts) => {
  const min = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  return h < 24 ? `Hace ${h} h` : `Hace ${Math.floor(h / 24)} d`;
};

function PantallaPrincipal() {
  const toast = useToast();
  const {
    cargando,
    error,
    incidentes,
    confirmados,
    agregarReporte,
    confirmar,
    cambiarEstado,
    restablecer,
  } = useReportes();

  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [soloAbiertos, setSoloAbiertos] = useState(false);
  const [capas, setCapas] = useState({ lit: true, route: false, risk: true, me: true });
  const [modoVivo, setModoVivo] = useState(true);

  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [puntoNuevo, setPuntoNuevo] = useState(() => ajustarPunto(MI_UBICACION.x, MI_UBICACION.y));
  const [tipoNuevo, setTipoNuevo] = useState("alumbrado");
  const [urgenciaNueva, setUrgenciaNueva] = useState("media");
  const [descNueva, setDescNueva] = useState("");
  const [anonimo, setAnonimo] = useState(false);

  useEffect(() => {
    setSimulacion(modoVivo);
    const detener = iniciarSimulacion();
    return detener;
  }, [modoVivo]);

  const filtrados = useMemo(() => {
    return [...incidentes]
      .filter((i) => (filtroTipo === "todos" ? true : i.tipo === filtroTipo))
      .filter((i) => (soloAbiertos ? i.estado !== "resuelto" : true))
      .sort((a, b) => b.ts - a.ts);
  }, [incidentes, filtroTipo, soloAbiertos]);

  const seleccionado = useMemo(
    () => incidentes.find((i) => i.id === seleccionadoId) || null,
    [incidentes, seleccionadoId],
  );

  const stats = useMemo(() => {
    const pendientes = incidentes.filter((i) => i.estado === "pendiente").length;
    const enAtencion = incidentes.filter((i) => i.estado === "atencion").length;
    const resueltos = incidentes.filter((i) => i.estado === "resuelto").length;
    return { pendientes, enAtencion, resueltos };
  }, [incidentes]);

  const toggleCapa = (k) => setCapas((prev) => ({ ...prev, [k]: !prev[k] }));

  const abrirNuevoEnPunto = (x, y) => {
    const p = ajustarPunto(x, y);
    setPuntoNuevo(p);
    setModalNuevo(true);
  };

  const guardarNuevoReporte = async () => {
    if (!descNueva.trim()) {
      toast.mostrar("Describe brevemente la incidencia.");
      return;
    }
    const creado = await agregarReporte({
      tipo: tipoNuevo,
      desc: descNueva.trim(),
      loc: puntoNuevo.loc,
      x: puntoNuevo.x,
      y: puntoNuevo.y,
      urgencia: urgenciaNueva,
      anonimo,
    });
    setDescNueva("");
    setModalNuevo(false);
    setSeleccionadoId(creado.id);
    toast.mostrar("Reporte registrado y publicado en el mapa.");
  };

  const manejarConfirmar = async (id) => {
    const res = await confirmar(id);
    toast.mostrar(res.ok ? "Confirmación vecinal añadida." : res.mensaje);
  };

  const manejarEstado = async (id, nuevoEstado) => {
    const res = await cambiarEstado(id, nuevoEstado);
    if (res.ok) toast.mostrar(`Estado actualizado a: ${ESTADOS[nuevoEstado].label}`);
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color={COLORES.acento} />
        <Text style={{ marginTop: 10, color: COLORES.suave }}>Cargando mapa del barrio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <StatusBar style="light" />
      <Encabezado
        titulo="Monitoreo Vecinal"
        subtitulo="Reporta fallas de iluminación, robos e incidencias con seguimiento en tiempo real."
      />

      <ScrollView contentContainerStyle={styles.contenido}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* RESUMEN DE SEGUIMIENTO (SC04) */}
        <View style={styles.resumenFila}>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORES.peligro }]}>{stats.pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORES.info }]}>{stats.enAtencion}</Text>
            <Text style={styles.statLabel}>En atención</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: COLORES.ok }]}>{stats.resueltos}</Text>
            <Text style={styles.statLabel}>Resueltos</Text>
          </View>
        </View>

        {/* MAPA INTERACTIVO */}
        <View style={styles.seccion}>
          <View style={styles.filaEntre}>
            <Text style={styles.secTitulo}>Mapa del barrio</Text>
            <Text style={styles.ayuda}>Toca el mapa para reportar ahí</Text>
          </View>

          <MapaBarrio
            incidentes={filtrados}
            capas={capas}
            seleccionadoId={seleccionadoId}
            onSeleccionar={(id) => setSeleccionadoId(id === seleccionadoId ? null : id)}
            onTocarMapa={(x, y) => abrirNuevoEnPunto(x, y)}
          />

          {/* CONTROLES DE CAPAS */}
          <View style={styles.capasFila}>
            {[
              { k: "lit", label: "Zona iluminada", icono: "wb-sunny" },
              { k: "risk", label: "Zonas de riesgo", icono: "warning" },
              { k: "route", label: "Ruta segura", icono: "directions-walk" },
              { k: "me", label: "Mi ubicación", icono: "my-location" },
            ].map((c) => {
              const on = capas[c.k];
              return (
                <TouchableOpacity
                  key={c.k}
                  style={[styles.capaBtn, on && styles.capaBtnOn]}
                  onPress={() => toggleCapa(c.k)}
                >
                  <MaterialIcons name={c.icono} size={14} color={on ? "#FFF" : COLORES.texto} />
                  <Text style={[styles.capaTxt, on && { color: "#FFF" }]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* FILTROS DE INCIDENCIAS */}
        <FiltroChips opciones={OPCIONES_FILTRO} valor={filtroTipo} onCambio={setFiltroTipo} />

        <View style={[styles.filaEntre, { paddingHorizontal: 16, marginTop: 6 }]}>
          <Text style={styles.secTitulo}>Incidencias ({filtrados.length})</Text>
          <TouchableOpacity onPress={() => setSoloAbiertos(!soloAbiertos)} style={styles.filtroAbiertos}>
            <MaterialIcons
              name={soloAbiertos ? "check-box" : "check-box-outline-blank"}
              size={18}
              color={COLORES.acento}
            />
            <Text style={styles.filtroAbiertosTxt}>Solo sin resolver</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE REPORTES */}
        <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 8 }}>
          {filtrados.map((item) => {
            const t = TIPOS[item.tipo] || TIPOS.otro;
            const u = URGENCIAS[item.urgencia] || URGENCIAS.media;
            const est = ESTADOS[item.estado] || ESTADOS.pendiente;
            const yaConfirmado = confirmados.includes(item.id);

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, item.id === seleccionadoId && styles.cardSel]}
                onPress={() => setSeleccionadoId(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.filaEntre}>
                  <View style={styles.badgeTipo}>
                    <View style={[styles.iconoCirculo, { backgroundColor: t.color }]}>
                      <MaterialIcons name={t.icono} size={15} color="#FFF" />
                    </View>
                    <Text style={styles.cardTipo}>{t.label}</Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: est.fondo }]}>
                    <Text style={[styles.pillTxt, { color: est.texto }]}>{est.label}</Text>
                  </View>
                </View>

                <Text style={styles.cardDesc}>{item.desc}</Text>

                <View style={styles.metaFila}>
                  <Text style={styles.metaTxt}>
                    📍 {item.loc} · {haceTiempo(item.ts)}
                  </Text>
                  <View style={[styles.pill, { backgroundColor: u.fondo }]}>
                    <Text style={[styles.pillTxt, { color: u.texto }]}>Riesgo {u.label}</Text>
                  </View>
                </View>

                <View style={styles.cardAcciones}>
                  <TouchableOpacity
                    style={[styles.btnConfirmar, yaConfirmado && styles.btnConfirmado]}
                    onPress={() => manejarConfirmar(item.id)}
                  >
                    <MaterialIcons
                      name="thumb-up"
                      size={14}
                      color={yaConfirmado ? COLORES.ok : COLORES.acento}
                    />
                    <Text style={[styles.btnConfirmarTxt, yaConfirmado && { color: COLORES.ok }]}>
                      {yaConfirmado ? "Confirmado" : "Confirmar"} ({item.confirmaciones})
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.verDetalle}>Ver seguimiento →</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.demoBox}>
          <View style={styles.filaEntre}>
            <Text style={styles.demoTxt}>Simular reportes vecinales en vivo</Text>
            <Switch value={modoVivo} onValueChange={setModoVivo} />
          </View>
          <TouchableOpacity
            onPress={async () => {
              await restablecer();
              setSeleccionadoId(null);
              toast.mostrar("Datos restablecidos a ejemplos iniciales.");
            }}
          >
            <Text style={styles.resetTxt}>Restablecer datos de prueba</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => abrirNuevoEnPunto(MI_UBICACION.x, MI_UBICACION.y)}
        activeOpacity={0.9}
      >
        <MaterialIcons name="add-alert" size={22} color="#FFF" />
        <Text style={styles.fabTxt}>Reportar incidencia</Text>
      </TouchableOpacity>

      <Modal
        visible={modalNuevo}
        animationType="slide"
        transparent
        onRequestClose={() => setModalNuevo(false)}
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            <View style={styles.filaEntre}>
              <Text style={styles.modalTitulo}>Nuevo reporte vecinal</Text>
              <TouchableOpacity onPress={() => setModalNuevo(false)}>
                <MaterialIcons name="close" size={24} color={COLORES.suave} />
              </TouchableOpacity>
            </View>

            <Text style={styles.ubicacionTag}>📍 Ubicación detectada: {puntoNuevo.loc}</Text>

            <Text style={styles.label}>Tipo de incidencia</Text>
            <View style={styles.gridOpciones}>
              {LISTA_TIPOS.map((t) => {
                const sel = tipoNuevo === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.opcionChip,
                      sel && { backgroundColor: t.color, borderColor: t.color },
                    ]}
                    onPress={() => {
                      setTipoNuevo(t.id);
                      setUrgenciaNueva(t.urgencia);
                    }}
                  >
                    <MaterialIcons name={t.icono} size={15} color={sel ? "#FFF" : t.color} />
                    <Text style={[styles.opcionTxt, sel && { color: "#FFF" }]}>{t.corto}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Nivel de urgencia</Text>
            <View style={styles.gridOpciones}>
              {LISTA_URGENCIAS.map((u) => {
                const sel = urgenciaNueva === u.id;
                return (
                  <TouchableOpacity
                    key={u.id}
                    style={[
                      styles.opcionChip,
                      sel && { backgroundColor: u.texto, borderColor: u.texto },
                    ]}
                    onPress={() => setUrgenciaNueva(u.id)}
                  >
                    <Text style={[styles.opcionTxt, sel && { color: "#FFF" }]}>{u.etiquetaForm}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Descripción del problema</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Poste apagado frente al parque desde anoche..."
              value={descNueva}
              onChangeText={setDescNueva}
              multiline
            />

            <View style={[styles.filaEntre, { marginTop: 4 }]}>
              <Text style={styles.metaTxt}>Publicar de forma anónima</Text>
              <Switch value={anonimo} onValueChange={setAnonimo} />
            </View>

            <TouchableOpacity style={styles.btnPrimario} onPress={guardarNuevoReporte}>
              <Text style={styles.btnPrimarioTxt}>Publicar reporte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!seleccionado}
        animationType="fade"
        transparent
        onRequestClose={() => setSeleccionadoId(null)}
      >
        {seleccionado ? (
          <View style={styles.modalFondo}>
            <View style={styles.modalCaja}>
              <View style={styles.filaEntre}>
                <Text style={styles.modalTitulo}>Reporte #{seleccionado.id}</Text>
                <TouchableOpacity onPress={() => setSeleccionadoId(null)}>
                  <MaterialIcons name="close" size={24} color={COLORES.suave} />
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTipo}>{(TIPOS[seleccionado.tipo] || TIPOS.otro).label}</Text>
              <Text style={styles.cardDesc}>{seleccionado.desc}</Text>
              <Text style={styles.metaTxt}>
                📍 {seleccionado.loc} · {haceTiempo(seleccionado.ts)}
              </Text>

              <Text style={styles.label}>Actualizar estado de atención:</Text>
              <View style={styles.gridOpciones}>
                {LISTA_ESTADOS.map((e) => {
                  const activo = seleccionado.estado === e.id;
                  return (
                    <TouchableOpacity
                      key={e.id}
                      style={[
                        styles.opcionChip,
                        activo && { backgroundColor: e.texto, borderColor: e.texto },
                      ]}
                      onPress={() => manejarEstado(seleccionado.id, e.id)}
                    >
                      <Text style={[styles.opcionTxt, activo && { color: "#FFF" }]}>{e.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Historial de trazabilidad:</Text>
              <View style={styles.historialBox}>
                {(seleccionado.hist || []).map((h, idx) => (
                  <Text key={idx} style={styles.histItem}>
                    • {h.texto} ({haceTiempo(h.ts)})
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <PantallaPrincipal />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: COLORES.fondo || "#F4F7F5" },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
  contenido: { paddingBottom: 100 },
  error: { color: COLORES.peligro, padding: 16, textAlign: "center" },
  resumenFila: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 14 },
  statCard: {
    flex: 1,
    backgroundColor: COLORES.superficie || "#FFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORES.linea || "#E2E8F0",
  },
  statNum: { fontSize: 20, fontWeight: "bold" },
  statLabel: { fontSize: 11, color: COLORES.suave, marginTop: 2 },
  seccion: { paddingHorizontal: 16, marginTop: 16 },
  filaEntre: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  secTitulo: { fontSize: 16, fontWeight: "bold", color: COLORES.texto, marginBottom: 8 },
  ayuda: { fontSize: 11, color: COLORES.suave, marginBottom: 8 },
  capasFila: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10, marginBottom: 8 },
  capaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORES.superficie || "#FFF",
    borderWidth: 1,
    borderColor: COLORES.linea || "#CBD5E1",
  },
  capaBtnOn: { backgroundColor: COLORES.barra, borderColor: COLORES.barra },
  capaTxt: { fontSize: 11, fontWeight: "600", color: COLORES.texto },
  filtroAbiertos: { flexDirection: "row", alignItems: "center", gap: 4 },
  filtroAbiertosTxt: { fontSize: 12, color: COLORES.texto, fontWeight: "600" },
  card: {
    backgroundColor: COLORES.superficie || "#FFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORES.linea || "#E2E8F0",
    gap: 8,
  },
  cardSel: { borderColor: COLORES.acento, borderWidth: 2 },
  badgeTipo: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconoCirculo: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  cardTipo: { fontWeight: "bold", fontSize: 14, color: COLORES.texto },
  cardDesc: { fontSize: 13, color: COLORES.texto, lineHeight: 19 },
  metaFila: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaTxt: { fontSize: 12, color: COLORES.suave },
  pill: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999 },
  pillTxt: { fontSize: 11, fontWeight: "700" },
    cardAcciones: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORES.linea || "#F1F5F9",
    paddingTop: 8,
  },
  btnConfirmar: { flexDirection: "row", alignItems: "center", gap: 5 },
  btnConfirmado: { opacity: 0.9 },
  btnConfirmarTxt: { fontSize: 12, fontWeight: "700", color: COLORES.acento },
  verDetalle: { fontSize: 12, color: COLORES.info, fontWeight: "600" },
  demoBox: {
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORES.superficie || "#FFF",
    borderWidth: 1,
    borderColor: COLORES.linea || "#E2E8F0",
    gap: 8,
  },
  demoTxt: { fontSize: 13, fontWeight: "600", color: COLORES.texto },
  resetTxt: { fontSize: 12, color: COLORES.peligro, fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    backgroundColor: COLORES.acento,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 999,
    elevation: 6,
  },
  fabTxt: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  modalFondo: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", padding: 16 },
  modalCaja: { backgroundColor: "#FFF", borderRadius: 16, padding: 18, gap: 10 },
  modalTitulo: { fontSize: 18, fontWeight: "bold", color: COLORES.texto },
  ubicacionTag: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORES.info,
    backgroundColor: COLORES.infoClaro || "#E0F2FE",
    padding: 8,
    borderRadius: 8,
  },
  label: { fontSize: 13, fontWeight: "700", color: COLORES.texto, marginTop: 4 },
  gridOpciones: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  opcionTxt: { fontSize: 12, fontWeight: "600", color: COLORES.texto },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 10,
    minHeight: 70,
    textAlignVertical: "top",
    fontSize: 13,
  },
  btnPrimario: {
    backgroundColor: COLORES.acento,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  btnPrimarioTxt: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  historialBox: { backgroundColor: "#F8FAFC", padding: 10, borderRadius: 8, gap: 4 },
  histItem: { fontSize: 12, color: COLORES.texto },
});