// El mapa es una imagen (assets/mapa-barrio.png) de 600 x 400 "unidades".
// Todas las coordenadas de los reportes usan esas unidades, no latitud/longitud.
export const ANCHO = 600;
export const ALTO = 400;

export const CALLES_H = [
  { n: "Av. Central", v: 70 },
  { n: "Av. Los Pinos", v: 160 },
  { n: "Jr. Libertad", v: 250 },
  { n: "Calle Bolognesi", v: 335 },
];
export const CALLES_V = [
  { n: "Jr. Lima", v: 80 },
  { n: "Jr. Cusco", v: 200 },
  { n: "Av. Grau", v: 320 },
  { n: "Jr. Puno", v: 440 },
  { n: "Calle Tacna", v: 540 },
];
export const PARQUE = { x: 328, y: 168, w: 104, h: 74 };
export const MI_UBICACION = { x: 320, y: 250 };
export const ZONA_ILUMINADA = { x: 140, y: 205, r: 105 };

export const RUTA = [
  [ 320, 250 ],
  [ 200, 250 ],
  [ 200, 160 ],
  [ 80, 160 ],
  [ 80, 70 ],
];

export const PUNTOS_RUTA = [
  [ 200, 250 ],
  [ 200, 160 ],
  [ 80, 160 ],
];

// Lleva un toque cualquiera a la calle más cercana y arma una dirección aproximada
export const ajustarPunto = (x, y) => {
  x = Math.max(12, Math.min(588, x));
  y = Math.max(12, Math.min(388, y));
  if (x >= PARQUE.x && x <= PARQUE.x + PARQUE.w && y >= PARQUE.y && y <= PARQUE.y + PARQUE.h) {
    return { x, y, loc: "Parque Central" };
  }
  let mejor = null;
  CALLES_H.forEach((r) => {
    const d = Math.abs(y - r.v);
    if (!mejor || d < mejor.d) mejor = { d, k: "h", r, x, y: r.v };
  });
  CALLES_V.forEach((r) => {
    const d = Math.abs(x - r.v);
    if (d < mejor.d) mejor = { d, k: "v", r, x: r.v, y };
  });
  const numero = mejor.k === "h" ? Math.round(mejor.x * 1.5) : Math.round(mejor.y * 2);
  return { x: Math.round(mejor.x), y: Math.round(mejor.y), loc: `${mejor.r.n} ${numero}` };
};

const PESO = { alta: 3, media: 2, baja: 1 };
export const pesoUrgencia = (u) => PESO[u] || 1;

// Zona con más riesgo acumulado entre los incidentes abiertos (null si no llega al umbral)
export const zonaMasInsegura = (abiertos) => {
  let tope = null;
  let topePuntaje = 0;
  abiertos.forEach((i) => {
    const puntaje = abiertos.reduce(
      (a, j) => a + (Math.hypot(i.x - j.x, i.y - j.y) < 90 ? pesoUrgencia(j.urgencia) : 0),
      0,
    );
    if (puntaje > topePuntaje) {
      topePuntaje = puntaje;
      tope = i;
    }
  });
  return tope && topePuntaje >= 4 ? tope : null;
};
