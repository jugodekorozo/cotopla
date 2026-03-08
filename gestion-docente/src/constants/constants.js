/* Accent colors — fixed regardless of theme */
export const C = {
  green: "#6eb42c", magenta: "#e7027c", orange: "#f2992e",
  gray: "#a8a8a8",
  /* Surface tokens — adapt via CSS custom properties injected by App.jsx */
  black: "var(--t-bg, #000)",      // page background
  dark:  "var(--t-header, #0f0f0f)", // header / footer surface
  card:  "#1a1a1a",                // data cards — intentionally always dark
  input: "#222",                   // form inputs — always dark
};

export const G = {
  accentGradient: "linear-gradient(120deg, #e7027c 0%, #7a1f62 52%, #f2992e 100%)",
  successGradient: "linear-gradient(120deg, #f2992e 0%, #6eb42c 100%)",
  warningGradient: "linear-gradient(120deg, #facc15 0%, #f2992e 100%)",
  dangerGradient: "linear-gradient(120deg, #ef4444 0%, #e7027c 100%)",
  glassGradient: "linear-gradient(140deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
};

/* Theme token definitions */
export const THEMES = {
  dark: {
    bg:          "#000000",
    header:      "#0f0f0f",
    text:        "#eeeeee",
    textSoft:    "#a8a8a8",
    textMuted:   "#666666",
    border:      "#252525",
    input:       "#1e1e1e",
    navBtn:      "#1c1c1c",
    navBtnText:  "#888888",
    tooltipBg:   "#1e1e1e",
    tooltipText: "#eeeeee",
    gridLine:    "#252525",
    selectBg:    "#1e1e1e",
    selectText:  "#cccccc",
  },
  light: {
    bg:          "#f2f4f7",
    header:      "#ffffff",
    text:        "#111111",
    textSoft:    "#555555",
    textMuted:   "#999999",
    border:      "#e3e5e9",
    input:       "#f0f1f4",
    navBtn:      "#eeeeee",
    navBtnText:  "#555555",
    tooltipBg:   "#ffffff",
    tooltipText: "#111111",
    gridLine:    "#e3e5e9",
    selectBg:    "#f0f1f4",
    selectText:  "#111111",
  },
};

export const SCALE = [
  { val: 1, label: "Insuficiente", color: "#ef4444" },
  { val: 2, label: "Básico", color: C.orange },
  { val: 3, label: "Aceptable", color: "#eab308" },
  { val: 4, label: "Avanzado", color: C.green },
  { val: 5, label: "Excelente", color: C.green }
];

export const S751 = [
  { id: "111138141", name: "Gissel Yaneth Alvarez Lara" },
  { id: "111139450", name: "Luis Alberto Arias Fernandez" },
  { id: "111136400", name: "Cristina Armenta Montes" },
  { id: "111101626", name: "Valentina Barros Torres" },
  { id: "111116681", name: "Maryi Carolina Bermejo Martínez" },
  { id: "111134983", name: "Daniel Alejandro Cantillo Sánchez" },
  { id: "111132924", name: "Angelly Carolina Cardenas Toncel" },
  { id: "111133005", name: "Yorlis Esther De La Hoz Munera" },
  { id: "111065468", name: "Joel Escudero Lopez" },
  { id: "111080095", name: "Melany María Fonseca Meza" },
  { id: "111113134", name: "Katy Carolina Guerrero Cala" }
];
export const S752 = [
  { id: "111100662", name: "Cesar David Fernandez Dagil" },
  { id: "111131389", name: "Samuel Enrique Guerra Nieto" },
  { id: "111113228", name: "Diego Andres Joya Munar" },
  { id: "111102367", name: "Arianna Rosa Marulanda Camargo" },
  { id: "111141479", name: "Mariangel Mendoza Orozco" },
  { id: "111133891", name: "Isabela Mendoza Ramírez" },
  { id: "105643536", name: "Stefany Andrea Mendoza Ustariz" },
  { id: "111065889", name: "Hernan Jose Miranda Gomez" },
  { id: "111134851", name: "Johan Camilo Moreno Troya" },
  { id: "111149937", name: "Adrian Miguel Murgas Lagos" },
  { id: "111081440", name: "Merari Liceth Pachecho Chona" },
  { id: "111132695", name: "Miguel Angel Pinto Duran" },
  { id: "111139103", name: "Andres Felipe Ruiz Pallares" },
  { id: "111169506", name: "Edgardo Sadith Teran Colpas" }
];
export const SANIM = [
  { id: "111136400", name: "Cristina Armenta Montes" },
  { id: "111101626", name: "Valentina Barros Torres" },
  { id: "111080365", name: "Cristian Camilo Bello Guarnizo" },
  { id: "111116681", name: "Maryi Carolina Bermejo Martínez" },
  { id: "111134983", name: "Daniel Alejandro Cantillo Sánchez" },
  { id: "111132924", name: "Angelly Carolina Cardenas Toncel" },
  { id: "111141568", name: "Jhoan Estiben Daza Blandon" },
  { id: "111100662", name: "Cesar David Fernandez Dagil" },
  { id: "111080095", name: "Melany María Fonseca Meza" },
  { id: "111113134", name: "Katy Carolina Guerrero Cala" },
  { id: "111129737", name: "Carlos Antonio Hernandez Ariza" },
  { id: "111095383", name: "Katherine Sharith Ibarra Peña" },
  { id: "111113228", name: "Diego Andres Joya Munar" },
  { id: "111143221", name: "Kamilo Andres Julio Benavides" },
  { id: "105632882", name: "Carlos Daniel Maestre Avila" },
  { id: "111094512", name: "Valerin Sofía Mendoza Mendoza" },
  { id: "111133891", name: "Isabela Mendoza Ramírez" },
  { id: "111140702", name: "Sebastian Andres Murgas Amador" },
  { id: "111139651", name: "Samuel Peñaranda Melendez" },
  { id: "111132955", name: "Delimer Dinoi Perez Villadiego" },
  { id: "111132695", name: "Miguel Angel Pinto Duran" },
  { id: "111130277", name: "Nicole Carolina Remolina Maestre" },
  { id: "111139103", name: "Andres Felipe Ruiz Pallares" },
  { id: "111140381", name: "Jesús David Socarras Moya" },
  { id: "111133805", name: "Ashley Luz Tovar Arevalo" }
];
export const S602 = [
  { id: "111140803", name: "Juan Manuel Ariza Brochero" },
  { id: "111156960", name: "Emmanuel Bacca Coronado" },
  { id: "111139034", name: "Leidys Del Carmen Baquero Mizar" },
  { id: "111101626", name: "Valentina Barros Torres" },
  { id: "111160864", name: "Ivan David Bastidas Arias" },
  { id: "111160221", name: "Ana Masiel Cadena Vega" },
  { id: "111160892", name: "Cesar David Caraballo Manrique" },
  { id: "111154350", name: "Maicol Andres Carmona Manjarrez" },
  { id: "111125416", name: "Carlos David Castillo Rachath" },
  { id: "111153663", name: "Saray Vanessa Contreras Bolaño" },
  { id: "111095383", name: "Katherine Sharith Ibarra Peña" },
  { id: "111136286", name: "Yarilsa Gisselle Jimenez Castro" },
  { id: "105632882", name: "Carlos Daniel Maestre Avila" },
  { id: "111140978", name: "Oscar Andrés Manjarres Banda" },
  { id: "105635160", name: "Robinson Alexis Marin Rendon" },
  { id: "111158636", name: "Farhat Jousset Palomino Molina" },
  { id: "111160811", name: "Camilo Armando Roa Jovien" },
  { id: "111154938", name: "Mario Santiago Rodriguez Pinto" },
  { id: "111163650", name: "Maria Del Carmen Romero Villegas" },
  { id: "111111248", name: "Sebastian Javier Urueta Ahumada" },
  { id: "111141621", name: "Lisney Zareth Vasquez Zambrano" },
  { id: "111094302", name: "Danna Sofia Villalba Lascarro" }
];
export const S692 = [
  { id: "105527975", name: "Jhosua Kavir Acosta Mendoza" },
  { id: "111140803", name: "Juan Manuel Ariza Brochero" },
  { id: "111201318", name: "Maria Del Mar Avila Luquez" },
  { id: "111139034", name: "Leidys Del Carmen Baquero Mizar" },
  { id: "111160221", name: "Ana Masiel Cadena Vega" },
  { id: "111160628", name: "Sharick Jhasay Camargo Epiayu" },
  { id: "111125416", name: "Carlos David Castillo Rachath" },
  { id: "111153663", name: "Saray Vanessa Contreras Bolaño" },
  { id: "111152355", name: "Mariangel Cotes Ortiz" },
  { id: "105596245", name: "Paula Andrea Garcia Calderon" },
  { id: "111136286", name: "Yarilsa Gisselle Jimenez Castro" },
  { id: "105632882", name: "Carlos Daniel Maestre Avila" },
  { id: "111178799", name: "Zareth L. Martinez Peña" },
  { id: "105640704", name: "Diosedin Mileth Medina Serrano" },
  { id: "111130496", name: "Sebastian Monsalvo Novoa" },
  { id: "111132955", name: "Delimer Dinoi Perez Villadiego" },
  { id: "111163650", name: "Maria Del Carmen Romero Villegas" },
  { id: "111154837", name: "Jeyfer David Torres Mendoza" },
  { id: "111141621", name: "Lisney Zareth Vasquez Zambrano" }
];
export const S104 = [
  { id: "111267901", name: "Isabel Cristina Alvarez Camargo" },
  { id: "111263626", name: "Samuel David Araujo Charris" },
  { id: "111276228", name: "Jesus David Arrieta Angulo" },
  { id: "111263514", name: "Luis Daniel Baleta Pinto" },
  { id: "111272263", name: "Solangel Bermudez Gil" },
  { id: "111259851", name: "Alfredo Jesus Buendia Martinez" },
  { id: "111268475", name: "Nesmy Kamyla Corzo Mendoza" },
  { id: "111268880", name: "Juley Denis Forero Fragozo" },
  { id: "111261646", name: "Natalia Carolina Gómez Morales" },
  { id: "111273436", name: "Janher David Hernández Infante" },
  { id: "111238425", name: "Josue David Mercado Pacheco" },
  { id: "111261001", name: "Luisa Sarai Meza Obregón" },
  { id: "111258560", name: "Michell Carolina Mejia Montero" },
  { id: "111266048", name: "Karen Alejandra Navarro Lengua" },
  { id: "111271671", name: "Sofia Navarro Pombo" },
  { id: "111265597", name: "Christian Camilo Peñas Mattos" },
  { id: "111272286", name: "Valeria Maria Pezzano Pezzano" },
  { id: "111267681", name: "Manuel David Polo De Los Reyes" },
  { id: "111245316", name: "Isabel Sofia Polo Vega" },
  { id: "111262064", name: "Alejandro Jose Rodriguez Arrieta" },
  { id: "111263728", name: "Samuel Elias Rodriguez Orcasita" },
  { id: "111272919", name: "Natalia Romero Sanchez" },
  { id: "111263199", name: "Luisa Fernanda Rueda Gomez" },
  { id: "111248263", name: "Jesús Manuel Saldarriaga Rivas" },
  { id: "111265669", name: "Maria De Los Angeles Solano Albornoz" },
  { id: "111261612", name: "Mariangel Torres Lopez" },
  { id: "111262197", name: "Sara Valentina Velasquez Liñan" }
];
export const S105 = [
  { id: "111273282", name: "Maria Celeste Ascanio Soto" },
  { id: "111276848", name: "Emely Vanessa Baquero Madrid" },
  { id: "111245160", name: "Merielys Anyely Barragan Ochoa" },
  { id: "111268217", name: "Sharik Dayanna Barreto Romero" },
  { id: "111265102", name: "Mariana Rosio Barrios Carcamo" },
  { id: "111269057", name: "María Isabella Bello Patarroyo" },
  { id: "111261217", name: "Adriana Margarita Cerchiaro Vidal" },
  { id: "111263920", name: "Gustavo Andres Corzo Restrepo" },
  { id: "111264995", name: "Danna Sofia Gonzalez Sanchez" },
  { id: "111264535", name: "Juan Esteban Henriquez Calderon" },
  { id: "111262256", name: "Abril Yareth Hinojosa Yanes" },
  { id: "111268783", name: "Napoleón David Ladrón De Guevara Fragozo" },
  { id: "111261300", name: "Dayanis Jiret Layemand Lopez" },
  { id: "111260054", name: "María Gabriela López Quintero" },
  { id: "111264533", name: "Lara Nicole Manjarrez Palacio" },
  { id: "111263810", name: "Keinnis Nicole Martinez Martinez" },
  { id: "111265408", name: "Veronica Nieto Ramos" },
  { id: "111142524", name: "Juan Manuel Ortega Namen" },
  { id: "111268942", name: "Luz Angela Perez Guerra" },
  { id: "111270406", name: "Isabella Perez Rosado" },
  { id: "111272373", name: "Yuranis Daniela Pinto Pérez" },
  { id: "111269006", name: "Isabel Sofia Romero Montes" },
  { id: "111261613", name: "Luciana Maria Saltaren Jimenez" },
  { id: "111267985", name: "Lineth Margarita Sanchez Hernandez" },
  { id: "111271968", name: "Keren Nicolle Villamizar García" }
];

export function mkCourse(id, name, sem, grp, sts) {
  return {
    id, name, semester: sem, group: grp,
    cortes: [{ id: 1, weight: 30 }, { id: 2, weight: 30 }, { id: 3, weight: 40 }],
    students: sts, encargos: {}, grades: {}
  };
}

export const DEFAULT_COURSES = [
  mkCourse("c1", "Ilustración Publicitaria", 7, "751", S751),
  mkCourse("c2", "Ilustración Publicitaria", 7, "752", S752),
  mkCourse("c3", "Animación Experimental", 0, "único", SANIM),
  mkCourse("c4", "Dibujo Animado Digital", 6, "602", S602),
  mkCourse("c5", "Ilustración Infantil", 6, "692", S692),
  mkCourse("c6", "Diseño Básico", 1, "104", S104),
  mkCourse("c7", "Diseño Básico", 1, "105", S105)
];
