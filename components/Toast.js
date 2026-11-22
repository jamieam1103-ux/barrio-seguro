import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";

const ToastContext = createContext({ mostrar: () => {} });
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [mensaje, setMensaje] = useState(null);
  const opacidad = useRef(new Animated.Value(0)).current;
  const temporizador = useRef(null);

  const mostrar = useCallback(
    (texto) => {
      clearTimeout(temporizador.current);
      setMensaje(texto);
      Animated.timing(opacidad, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      temporizador.current = setTimeout(() => {
        Animated.timing(opacidad, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
          setMensaje(null),
        );
      }, 2800);
    },
    [opacidad],
  );

  return (
    <ToastContext.Provider value={{ mostrar }}>
      {children}
      {mensaje ? (
        <Animated.View style={[styles.toast, { opacity: opacidad }]} pointerEvents="none">
          <Text style={styles.texto}>{mensaje}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 100,
    backgroundColor: "#10241B",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 8,
  },
  texto: { color: "#FFF", textAlign: "center", fontSize: 14 },
});
