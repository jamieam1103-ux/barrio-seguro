# 🛡️ ReporteYa — Monitoreo Vecinal y Seguridad Ciudadana

Aplicación móvil y web desarrollada para atender la **atención tardía de condiciones inseguras del entorno** (Reto **SC04** — Temática: **Seguridad**), permitiendo a los vecinos reportar incidencias urbanas (fallas de iluminación, robos y accidentes) con seguimiento en tiempo real y visualización de rutas seguras.

---

## 📋 Información del Equipo — Four Code (`E01`)

* **Nombre del equipo:** Four Code
* **Código de equipo:** E01
* **Código de reto:** SC04
* **Temática:** Seguridad
* **Problemática:** Atención tardía de condiciones inseguras del entorno

### 👥 Integrantes y Roles

| # | Integrante | Rol | Institución | Responsabilidades en el Proyecto |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Jamie Alburquerque Melgarejo** | Backend Developer | Universidad Tecnológica del Perú (UTP) | Arquitectura de servicios (`reportesService.js`), gestión de estado y lógica de negocio (`useReportes.js`), persistencia de datos y estructura base del proyecto. |
| **2** | **Percy Bustos** | Diseñador UI/UX | Universidad Tecnológica del Perú (UTP) | Diseño visual de la interfaz, paleta cromática (`colores.js`), experiencia de usuario en el mapa interactivo, jerarquía de alertas e identidad gráfica. |
| **3** | **Justin Lopez** | Control de Calidad (QA) | CIBERTEC | Pruebas funcionales del flujo de reporte, validación de filtros por categoría y estado, verificación de cálculo de zonas de riesgo y detección de errores. |
| **4** | **Axel Vaye** | Frontend Developer | TECSUP | Implementación de componentes visuales (`MapaBarrio.js`, `Encabezado.js`, `FiltroChips.js`, `Toast.js`, `Insignias.js`), renderizado de capas del mapa y responsividad. |

---

## ✨ Funcionalidades Principales

* **🗺️ Mapa Interactivo del Barrio:** Visualización de calles, parques, ubicación actual del usuario, zonas iluminadas de bajo riesgo, rutas seguras y focos de inseguridad calculados dinámicamente según la urgencia de los reportes.
* **🚨 Reporte Rápido de Incidencias:** Registro inmediato de alertas (*Robo*, *Accidente*, *Falla de iluminación*) tocando directamente sobre el mapa o mediante el botón de emergencia.
* **📊 Panel de Seguimiento en Tiempo Real:** Contadores dinámicos de incidencias **Pendientes**, **En atención** y **Resueltas**.
* **🔍 Filtros Inteligentes:** Filtrado por tipo de incidencia (*Todos*, *Robo*, *Accidente*) y opción para visualizar únicamente casos sin resolver.

---

## 🛠️ Tecnologías Utilizadas

* **Framework:** React Native / Expo
* **Lenguaje:** JavaScript (ES6+)
* **Iconografía:** `@expo/vector-icons` (MaterialIcons)
* **Arquitectura:** Componentes modulares, *Custom Hooks* y capa de servicios desacoplada.

---

## 📂 Estructura del Proyecto

```text
reporta-ya/
├── assets/                # Íconos y recursos gráficos de la aplicación
├── components/            # Componentes reutilizables de interfaz
│   ├── Encabezado.js      # Cabecera institucional y botón de emergencia
│   ├── FiltroChips.js     # Filtros de categorías y estado
│   ├── MapaBarrio.js      # Renderizado del mapa, pines, zonas y rutas
│   └── Toast.js           # Notificaciones visuales de confirmación
├── constants/             # Configuraciones y datos base
│   ├── barrio.js          # Coordenadas de calles, zonas seguras y algoritmos de riesgo
│   ├── colores.js         # Paleta de colores de la aplicación
│   ├── datosEjemplo.js    # Dataset inicial de incidencias
│   └── tipos.js           # Definición de categorías e íconos
├── hooks/
│   └── useReportes.js     # Lógica de estado, filtros y métricas
├── services/
│   └── reportesService.js # Operaciones CRUD y gestión de reportes
├── utils/
│   └── formato.js         # Utilidades de formateo de fechas y textos
├── App.js                 # Punto de entrada principal
└── Insignias.js           # Componente de insignias y reconocimientos
```

---

## 🚀 Instalación y Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com
   cd reporta-ya
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npx expo start
   ```
   * Presiona **`w`** para abrir en el navegador web (`localhost:8081`).
   * Escanea el código QR con **Expo Go** para probarlo en Android o iOS.