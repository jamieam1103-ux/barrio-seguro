import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORES } from "../constants/colores";

// opciones: [{ id, label, icono?, color? }]
export default function FiltroChips({ opciones, valor, onCambio }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fila}>
      {opciones.map((o) => {
        const activo = valor === o.id;
        return (
          <TouchableOpacity
            key={o.id}
            style={[styles.chip, activo && styles.chipActivo]}
            onPress={() => onCambio(o.id)}
            activeOpacity={0.8}
          >
            {o.icono ? (
              <MaterialIcons name={o.icono} size={15} color={activo ? "#FFF" : o.color || COLORES.acento} />
            ) : null}
            <Text style={[styles.texto, activo && styles.textoActivo]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fila: { paddingHorizontal: 12, paddingVertical: 4, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.linea,
  },
  chipActivo: { backgroundColor: COLORES.acento, borderColor: COLORES.acento },
  texto: { color: COLORES.texto, fontWeight: "600", fontSize: 13 },
  textoActivo: { color: "#FFF" },
});
