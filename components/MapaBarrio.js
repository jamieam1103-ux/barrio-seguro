import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TIPOS } from "../constants/tipos";
import {
  ANCHO,
  ALTO,
  CALLES_H,
  CALLES_V,
  PARQUE,
  RUTA,
  PUNTOS_RUTA,
  MI_UBICACION,
  ZONA_ILUMINADA,
  pesoUrgencia,
  zonaMasInsegura,
} from "../constants/barrio";
import { COLORES } from "../constants/colores";

const SOLO_DECORACION = { pointerEvents: "none" };

export default function MapaBarrio({
  incidentes = [],
  capas = {},
  seleccionadoId = null,
  onSeleccionar,
  pin = null,
  onTocarMapa,
}) {
  const [ancho, setAncho] = useState(0);
  const e = ancho / ANCHO;

  const circulo = (cx, cy, r, color, clave) => (
    <View
      key={clave}
      style={{
        position: "absolute",
        left: (cx - r) * e,
        top: (cy - r) * e,
        width: 2 * r * e,
        height: 2 * r * e,
        borderRadius: r * e,
        backgroundColor: color,
      }}
    />
  );

  const etiqueta = (x, y, texto, rojo, clave) => (
    <View
      key={clave}
      style={{
        position: "absolute",
        left: Math.max(0, Math.min(ancho - 210, x * e - 105)),
        top: Math.max(4, y * e - 10),
        width: 210,
        alignItems: "center",
        zIndex: 15,
      }}
    >
      <View style={[styles.etiqueta, rojo && styles.etiquetaRoja]}>
        <Text style={styles.etiquetaTexto}>{texto}</Text>
      </View>
    </View>
  );

  const tramos = [];
  for (let k = 0; k < RUTA.length - 1; k++) {
    const [x1, y1] = RUTA[k];
    const [x2, y2] = RUTA[k + 1];
    if (x1 === x2) {
      tramos.push({
        left: x1 * e - 2.5,
        top: Math.min(y1, y2) * e,
        width: 5,
        height: Math.abs(y2 - y1) * e,
      });
    } else {
      tramos.push({
        left: Math.min(x1, x2) * e,
        top: y1 * e - 2.5,
        width: Math.abs(x2 - x1) * e,
        height: 5,
      });
    }
  }

  // Solo considerar robos activos para las zonas rojas de riesgo
  const robosActivos = incidentes.filter((i) => i.tipo === "robo" && i.estado !== "resuelto");
  const insegura = capas.risk ? zonaMasInsegura(robosActivos) : null;

  return (
    <Pressable
      style={styles.contenedor}
      onLayout={(ev) => setAncho(ev.nativeEvent.layout.width)}
      onPress={
        onTocarMapa
          ? (ev) => onTocarMapa(ev.nativeEvent.locationX / e, ev.nativeEvent.locationY / e)
          : undefined
      }
    >
      {ancho > 0 ? (
        <>
          {/* FONDO DEL BARRIO */}
          <View style={[StyleSheet.absoluteFill, SOLO_DECORACION]}>
            <View
              style={[
                styles.parque,
                {
                  left: PARQUE.x * e,
                  top: PARQUE.y * e,
                  width: PARQUE.w * e,
                  height: PARQUE.h * e,
                },
              ]}
            >
              <Text style={styles.parqueTexto}>PARQUE</Text>
            </View>

            {CALLES_H.map((c, idx) => (
              <View
                key={`ch-${idx}`}
                style={[styles.calleH, { top: c.v * e - 7 * e, height: 14 * e }]}
              >
                <Text style={styles.calleTexto} numberOfLines={1}>
                  {c.n}
                </Text>
              </View>
            ))}

            {CALLES_V.map((c, idx) => (
              <View
                key={`cv-${idx}`}
                style={[styles.calleV, { left: c.v * e - 7 * e, width: 14 * e }]}
              />
            ))}
          </View>

          {/* CAPAS DE ILUMINACIÓN, RUTA Y ZONAS ROJAS (SOLO ROBOS) */}
          <View style={[StyleSheet.absoluteFill, SOLO_DECORACION]}>
            {capas.lit
              ? circulo(ZONA_ILUMINADA.x, ZONA_ILUMINADA.y, ZONA_ILUMINADA.r, "rgba(46,196,109,0.22)", "lit")
              : null}

            {capas.route
              ? tramos.map((t, i) => <View key={`t${i}`} style={[styles.tramo, t]} />)
              : null}
            {capas.route
              ? PUNTOS_RUTA.map(([x, y], i) => (
                  <View key={`p${i}`} style={[styles.nodo, { left: x * e - 6, top: y * e - 6 }]} />
                ))
              : null}

            {capas.risk
              ? robosActivos.map((i) => {
                  const w = pesoUrgencia(i.urgencia);
                  return circulo(i.x, i.y, 28 + w * 8, "rgba(226,59,59,0.20)", `r${i.id}`);
                })
              : null}

            {capas.lit
              ? etiqueta(ZONA_ILUMINADA.x, ZONA_ILUMINADA.y + 10, "Zona iluminada (bajo riesgo)", false, "el")
              : null}
            {insegura
              ? etiqueta(insegura.x, insegura.y - 34, "Zona insegura (alertas de robo)", true, "ei")
              : null}
          </View>

          {/* PINES DE INCIDENCIAS */}
          {incidentes.map((i) => {
            const seleccionado = i.id === seleccionadoId;
            const tam = seleccionado ? 36 : 28;
            const t = TIPOS[i.tipo] || Object.values(TIPOS);
            return (
              <Pressable
                key={i.id}
                onPress={() => onSeleccionar && onSeleccionar(i.id)}
                hitSlop={8}
                style={[
                  styles.pin,
                  {
                    width: tam,
                    height: tam,
                    borderRadius: tam / 2,
                    left: i.x * e - tam / 2,
                    top: i.y * e - tam / 2,
                    backgroundColor: t.color,
                    zIndex: seleccionado ? 12 : 5,
                  },
                  seleccionado && { borderColor: COLORES.barra, borderWidth: 3 },
                ]}
              >
                <MaterialIcons name={t.icono} size={seleccionado ? 19 : 15} color="#FFF" />
              </Pressable>
            );
          })}

          {/* MI UBICACIÓN (SIEMPRE POR ENCIMA DE LOS PINES) */}
          {capas.me ? (
            <View style={[StyleSheet.absoluteFill, SOLO_DECORACION, { zIndex: 25 }]}>
              {circulo(MI_UBICACION.x, MI_UBICACION.y, 18, "rgba(37, 99, 235, 0.28)", "me1")}
              <View style={[styles.yo, { left: MI_UBICACION.x * e - 10, top: MI_UBICACION.y * e - 10 }]} />
              <View
                style={[
                  styles.yoBadge,
                  { left: MI_UBICACION.x * e - 22, top: MI_UBICACION.y * e + 12 },
                ]}
              >
                <Text style={styles.yoTexto}>Tú</Text>
              </View>
            </View>
          ) : null}

          {/* MARCADOR AL CREAR REPORTE */}
          {pin ? (
            <View
              style={[
                styles.marcador,
                SOLO_DECORACION,
                { left: pin.x * e - 20, top: pin.y * e - 38, zIndex: 30 },
              ]}
            >
              <MaterialIcons name="place" size={40} color={COLORES.peligro} />
            </View>
          ) : null}
        </>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    aspectRatio: ANCHO / ALTO,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: COLORES.mapaFondo || "#E9EEF2",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  calleH: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingLeft: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#CBD5E1",
  },
  calleV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#CBD5E1",
  },
  calleTexto: {
    fontSize: 8,
    color: "#64748B",
    fontWeight: "600",
  },
  parque: {
    position: "absolute",
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#86EFAC",
    alignItems: "center",
    justifyContent: "center",
  },
  parqueTexto: {
    fontSize: 9,
    fontWeight: "700",
    color: "#15803D",
  },
  tramo: { position: "absolute", backgroundColor: "#2EC46D", borderRadius: 3 },
  nodo: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#17835A",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  yo: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    borderWidth: 3,
    borderColor: "#FFF",
    elevation: 8,
  },
  yoBadge: {
    position: "absolute",
    width: 44,
    backgroundColor: "#1E3A8A",
    borderRadius: 6,
    paddingVertical: 1,
    alignItems: "center",
  },
  yoTexto: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  pin: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    elevation: 3,
  },
  marcador: { position: "absolute" },
  etiqueta: { backgroundColor: COLORES.barra, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  etiquetaRoja: { backgroundColor: "#B02525" },
  etiquetaTexto: { color: "#FFF", fontSize: 10, fontWeight: "600" },
});
