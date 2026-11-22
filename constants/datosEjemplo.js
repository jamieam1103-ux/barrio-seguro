// Reportes de ejemplo (hace = minutos de antigüedad al momento de sembrar)
export const BASE = [
  { tipo: "alumbrado", desc: "Poste sin luz en toda la cuadra.", loc: "Calle Bolognesi 321", x: 440, y: 335, hace: 300, urgencia: "media", estado: "pendiente", confirmaciones: 0 },
  { tipo: "robo", desc: "Intento de robo de celular a una joven.", loc: "Jr. Lima 210", x: 80, y: 200, hace: 250, urgencia: "alta", estado: "resuelto", confirmaciones: 4 },
  { tipo: "accidente", desc: "Moto caída en la esquina, sin heridos graves.", loc: "Jr. Cusco 150", x: 200, y: 120, hace: 190, urgencia: "baja", estado: "resuelto", confirmaciones: 2 },
  { tipo: "apagon", desc: "Corte de luz en dos cuadras.", loc: "Av. Grau 330", x: 320, y: 300, hace: 95, urgencia: "media", estado: "atencion", confirmaciones: 6 },
  { tipo: "otro", desc: "Personas en actitud sospechosa.", loc: "Parque Central", x: 380, y: 205, hace: 12, urgencia: "baja", estado: "pendiente", confirmaciones: 1 },
  { tipo: "accidente", desc: "Choque de vehículos.", loc: "Av. Central 890", x: 320, y: 70, hace: 8, urgencia: "media", estado: "atencion", confirmaciones: 3 },
  { tipo: "apagon", desc: "Falla eléctrica en la zona.", loc: "Jr. Libertad 456", x: 200, y: 250, hace: 5, urgencia: "alta", estado: "atencion", confirmaciones: 5 },
  { tipo: "robo", desc: "Robo a transeúnte.", loc: "Av. Los Pinos 123", x: 410, y: 160, hace: 2, urgencia: "alta", estado: "pendiente", confirmaciones: 2 },
];

// Descripciones para los reportes simulados del modo demo
export const DESC_SIMULADOS = {
  robo: ["Arrebato de celular a una persona.", "Intento de robo en el paradero."],
  accidente: ["Choque leve entre dos autos.", "Moto caída en la pista."],
  apagon: ["Se cortó la luz en la cuadra.", "Falla eléctrica en varias casas."],
  alumbrado: ["Poste de luz apagado.", "Lámpara parpadeando toda la noche."],
  otro: ["Persona sospechosa merodeando.", "Peleas y ruido en la esquina."],
};
