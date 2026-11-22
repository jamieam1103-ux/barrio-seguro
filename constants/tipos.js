import { COLORES } from "./colores";

// "icono" es un nombre de MaterialIcons (@expo/vector-icons)
export const TIPOS = {
  robo: { id: "robo", label: "Robo", corto: "Robo", color: "#C62F2F", urgencia: "alta", icono: "security" },
  accidente: { id: "accidente", label: "Accidente vehicular", corto: "Accidente", color: "#D4620F", urgencia: "media", icono: "directions-car" },
  apagon: { id: "apagon", label: "Apagón / Falla eléctrica", corto: "Apagón", color: "#A77400", urgencia: "media", icono: "flash-on" },
  alumbrado: { id: "alumbrado", label: "Falla de alumbrado", corto: "Alumbrado", color: "#1D8A7E", urgencia: "media", icono: "lightbulb-outline" },
  otro: { id: "otro", label: "Otro incidente", corto: "Otro", color: "#7544C9", urgencia: "baja", icono: "warning" },
};
export const LISTA_TIPOS = Object.values(TIPOS);

export const URGENCIAS = {
  alta: { id: "alta", label: "Alta", etiquetaForm: "Alto", texto: COLORES.peligro, fondo: COLORES.peligroClaro },
  media: { id: "media", label: "Media", etiquetaForm: "Medio", texto: COLORES.aviso, fondo: COLORES.avisoClaro },
  baja: { id: "baja", label: "Baja", etiquetaForm: "Bajo", texto: COLORES.ok, fondo: COLORES.okClaro },
};
export const LISTA_URGENCIAS = ["baja", "media", "alta"].map((k) => URGENCIAS[k]);

export const ESTADOS = {
  pendiente: { id: "pendiente", label: "Pendiente", texto: COLORES.suave, fondo: COLORES.superficie2 },
  atencion: { id: "atencion", label: "En atención", texto: COLORES.info, fondo: COLORES.infoClaro },
  resuelto: { id: "resuelto", label: "Resuelto", texto: COLORES.ok, fondo: COLORES.okClaro },
};
export const LISTA_ESTADOS = Object.values(ESTADOS);
