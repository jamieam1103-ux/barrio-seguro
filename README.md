# 🛡️ Barrio Seguro — Monitoreo Vecinal e Incidencias (SC04)

Prototipo interactivo desarrollado para abordar el reto **SC04: Seguridad Ciudadana**, enfocado en solucionar la **atención tardía y falta de seguimiento ordenado** ante condiciones inseguras en el barrio (robos, fallas de alumbrado público, apagones, accidentes y otros riesgos).

---

## 🎯 Problema y Objetivo

En muchas comunidades, los reportes de seguridad e infraestructura urbana se envían por grupos de mensajería desordenados, provocando que la información se pierda y no exista control sobre su atención.

**Barrio Seguro** centraliza las alertas vecinales en un mapa interactivo en tiempo real para brindar:
* **Prevención:** Visualización de zonas iluminadas, zonas de alerta por robos y rutas seguras.
* **Rapidez:** Registro geolocalizado de incidencias con un toque en el mapa y opción de reporte anónimo.
* **Trazabilidad:** Seguimiento transparente paso a paso (*Pendiente → En atención → Resuelto*) respaldado por confirmación comunitaria.

---

## ✨ Funcionalidades Principales

* **Mapa Interactivo del Barrio:**
  * Detección automática de calles e intersecciones al tocar cualquier punto del mapa.
  * Capas activables: **Zona iluminada** (bajo riesgo), **Zonas de riesgo** (alertas de robo activas), **Ruta segura** y **Mi ubicación**.
* **Gestión y Filtrado de Incidencias:**
  * Categorías: *Robo*, *Accidente vehicular*, *Apagón / Falla eléctrica*, *Falla de alumbrado* y *Otro incidente*.
  * Filtros por tipo de incidencia y opción *"Solo sin resolver"*.
* **Validación Vecinal y Trazabilidad:**
  * Botón **Confirmar** para que otros vecinos validen la veracidad del reporte.
  * Historial cronológico detallado de creación, confirmaciones y cambios de estado.
* **Acceso Rápido a Emergencias (Perú):**
  * Modal de llamada directa a **Policía Nacional (105)**, **Bomberos (116)** y **SAMU (106)**.
* **Simulación en Vivo:**
  * Generador controlado de incidencias entrantes para demostraciones en tiempo real.

---

## 🛠️ Tecnologías Utilizadas

* **React Native & Expo:** Desarrollo multiplataforma (ejecutable en navegador Web, Android e iOS desde una misma base de código).
* **JavaScript (ES6+):** Lógica modular separada por responsabilidades.
* **AsyncStorage:** Persistencia local de reportes, confirmaciones e historial.
* **@expo/vector-icons (MaterialIcons):** Iconografía visual por categoría y estado.

---

## 📂 Estructura del Proyecto

```text
barrio-seguro/
├── assets/                 # Íconos y recursos gráficos de la app
├── components/             # Componentes reutilizables de interfaz (UI)
│   ├── Encabezado.js       # Barra superior y modal de llamadas de emergencia
│   ├── FiltroChips.js      # Filtros horizontales por categoría
│   ├── MapaBarrio.js       # Mapa interactivo, capas de seguridad y pines
│   └── Toast.js            # Notificaciones emergentes de retroalimentación
├── constants/              # Configuración, paleta de colores y datos base
│   ├── barrio.js           # Coordenadas de calles, parque, rutas y cálculo de riesgo
│   ├── colores.js          # Paleta institucional de colores
│   ├── datosEjemplo.js     # Reportes iniciales y textos de simulación
│   └── tipos.js            # Categorías, niveles de urgencia y estados
├── hooks/                  # Hooks personalizados
│   └── useReportes.js      # Estado reactivo y conexión con el servicio
├── services/               # Capa de datos y lógica de negocio
│   └── reportesService.js  # CRUD local, persistencia, trazabilidad y simulación
├── utils/                  # Funciones auxiliares
│   └── formato.js          # Utilidades de formato
├── App.js                  # Pantalla principal, modales de reporte y seguimiento
└── app.json                # Configuración de Expo
```

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com
   cd barrio-seguro
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```
   * Presiona **`w`** para abrir en el navegador web.
   * Presiona **`a`** para abrir en emulador Android o escanea el código QR con **Expo Go**.

---

## 🗺️ Escalabilidad a Futuro

1. **App Móvil Nativa:** Despliegue en Android e iOS con interfaz rediseñada, modo nocturno y carga de evidencia fotográfica desde la cámara.
2. **Geolocalización GPS Real:** Integración con Google Maps / Mapbox y ubicación satelital en tiempo real.
3. **Nube y Notificaciones Push:** Sincronización multiusuario en tiempo real (Firebase / Supabase) y alertas inmediatas ante incidentes cercanos.
4. **Panel de Gestión Municipal:** Portal web para que Serenazgo y autoridades gestionen y cierren incidencias oficialmente.
