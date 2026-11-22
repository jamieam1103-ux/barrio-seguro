import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TIPOS, URGENCIAS, ESTADOS } from "../data/tipos";
import { COLORES } from "../theme/colores";

export const InsigniaTipo = ({ tipo, tam = 30 }) => (
  <View
    style={{
      width: tam,
      height: tam,
      borderRadius: tam / 2,
      backgroundColor: TIPOS[tipo].color,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <MaterialIcons name={TIPOS[tipo].icono} size={Math.round(tam * 0.55)} color="#FFF" />
  </View>
);

export const PildoraUrgencia = ({ urgencia }) => {
  const u = URGENCIAS[urgencia];
  return (
    <View style={[styles.pildora, { backgroundColor: u.fondo }]}>
      <Text style={[styles.pildoraTexto, { color: u.texto }]}>{u.label}</Text>
    </View>
  );
};

export const PildoraEstado = ({ estado }) => {
  const e = ESTADOS[estado];
  return (
    <View
      style={[
        styles.pildora,
        { backgroundColor: e.fondo },
        estado === "pendiente" && { borderWidth: 1, borderColor: COLORES.linea },
      ]}
    >
      <Text style={[styles.pildoraTexto, { color: e.texto }]}>{e.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pildora: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: 999, alignSelf: "flex-start" },
  pildoraTexto: { fontSize: 12, fontWeight: "700" },
});
