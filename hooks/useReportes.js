import { useEffect, useState } from "react";
import {
  inicializar,
  suscribir,
  agregarReporte,
  confirmar,
  cambiarEstado,
  restablecer,
} from "../services/reportesService";

export default function useReportes() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    const quitar = suscribir((d) => {
      if (activo) setDatos(d);
    });
    inicializar()
      .then((d) => {
        if (activo) setDatos(d);
      })
      .catch(() => {
        if (activo) setError("No se pudieron cargar los reportes.");
      });
    return () => {
      activo = false;
      quitar();
    };
  }, []);

  return {
    cargando: !datos && !error,
    error,
    incidentes: datos ? datos.incidentes : [],
    ultimoNuevo: datos ? datos.ultimoNuevo : null,
    confirmados: datos ? datos.confirmados : [],
    agregarReporte,
    confirmar,
    cambiarEstado,
    restablecer,
  };
}
