import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Linking, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORES } from "../constants/colores";

const EMERGENCIAS = [
  { n: "Policía Nacional", t: "105" },
  { n: "Bomberos", t: "116" },
  { n: "SAMU (urgencias médicas)", t: "106" },
];

export default function Encabezado({ titulo, subtitulo }) {
  const insets = useSafeAreaInsets();
  const [abierto, setAbierto] = useState(false);

  const llamar = (numero) => Linking.openURL(`tel:${numero}`).catch(() => {});

  return (
    <View style={[styles.barra, { paddingTop: insets.top + 10 }]}>
      <View style={styles.fila}>
        <View style={styles.marca}>
          <MaterialIcons name="verified-user" size={26} color="#FFF" />
          <View>
            <Text style={styles.marcaNombre}>ReporteYa</Text>
            <Text style={styles.marcaSub}>Seguridad ciudadana</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.emergencia} onPress={() => setAbierto(true)} activeOpacity={0.85}>
          <MaterialIcons name="phone" size={18} color="#FFF" />
          <Text style={styles.emergenciaTexto}>Emergencia</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}

      <Modal visible={abierto} transparent animationType="fade" onRequestClose={() => setAbierto(false)}>
        <View style={styles.fondo}>
          <View style={styles.dialogo}>
            <View style={styles.dialogoCab}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dialogoTitulo}>Emergencia</Text>
                <Text style={styles.dialogoTexto}>Si hay peligro inmediato, llama ahora.</Text>
              </View>
              <TouchableOpacity onPress={() => setAbierto(false)} hitSlop={10}>
                <MaterialIcons name="close" size={24} color={COLORES.suave} />
              </TouchableOpacity>
            </View>
            {EMERGENCIAS.map((e) => (
              <View key={e.t} style={styles.item}>
                <Text style={styles.itemNombre}>{e.n}</Text>
                <Text style={styles.itemNumero}>{e.t}</Text>
                <TouchableOpacity style={styles.llamar} onPress={() => llamar(e.t)}>
                  <MaterialIcons name="phone" size={16} color="#FFF" />
                  <Text style={styles.llamarTexto}>Llamar</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.nota}>
              Verifica estos números con tu municipalidad antes de usarlos en una versión real.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: { backgroundColor: COLORES.barra, paddingHorizontal: 16, paddingBottom: 14 },
  fila: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  marca: { flexDirection: "row", alignItems: "center", gap: 10 },
  marcaNombre: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
  marcaSub: { color: COLORES.barraSuave, fontSize: 11 },
  emergencia: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORES.peligro,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  emergenciaTexto: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  titulo: { color: "#FFF", fontSize: 22, fontWeight: "bold", marginTop: 14 },
  subtitulo: { color: COLORES.barraSuave, fontSize: 13, marginTop: 4, lineHeight: 18 },
  fondo: { flex: 1, backgroundColor: "rgba(4,14,9,0.6)", justifyContent: "center", padding: 16 },
  dialogo: { backgroundColor: COLORES.superficie, borderRadius: 16, padding: 18, gap: 12 },
  dialogoCab: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  dialogoTitulo: { fontSize: 20, fontWeight: "bold", color: COLORES.texto },
  dialogoTexto: { fontSize: 13, color: COLORES.suave, marginTop: 2 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: COLORES.linea,
    borderRadius: 10,
    padding: 10,
  },
  itemNombre: { flex: 1, fontWeight: "700", color: COLORES.texto },
  itemNumero: { fontSize: 22, fontWeight: "bold", color: COLORES.texto },
  llamar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORES.acento,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  llamarTexto: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  nota: { fontSize: 12, color: COLORES.suave },
});
