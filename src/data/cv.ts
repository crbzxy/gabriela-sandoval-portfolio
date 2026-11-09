/** Fuente: "semblanza web.docx" (gabriela-sandoval-portfolio/página web). */

/** Semblanza completa, tal como aparece en el documento. */
export const bio = [
  'Artista visual, carpintera y museógrafa independiente, actualmente se encuentra cursando la Maestría en Investigación en Artes (UNAM), sus intereses giran en torno a la producción de arte en contextos específicos, y la construcción de espacios expositivos eventuales.',
  'Ha participado en varias exposiciones colectivas en México, Estados Unidos, Francia y Holanda. En formato individual, en Proyectos Puente (2025), Galería Unión (2022), Museo de Arte de Sinaloa (2019), en la Galería de la Esmeralda (2018), y en La Casa de Cultura Talavera de la UACM (2017).',
  'Ha sido acreedora a becas de producción entre las que destacan, Jóvenes Creadores FONCA (2020-2021 y 2016-2017), PECDA CDMX (2019), Me sobra barrio del Centro de la Imagen (2018).',
  'Formó parte de la tercera generación de acompañamiento Lolita Pank (2023), así como de la 5ta generación del Seminario Medios Múltiples (2017).',
  'Actualmente co-coordina el proyecto Canalla, sobre estrategias expositivas callejeras en el contexto de Nezahualcóyotl, proyecto con el que han obtenido el apoyo de Fomento cultural Jumex, Apoyo del Patronato de Arte Contemporáneo (PAC), Programa de acompañamiento para Iniciativas Culturales. Piso 16 (UNAM), y mención honorífica en el Premio William Bullock (MUAC).',
];

export interface CvSection {
  title: string;
  entries: { year: string; items: string[] }[];
}

export const cv: CvSection[] = [
  {
    title: 'Exposiciones individuales',
    entries: [
      { year: '2025', items: ['Proyectos Puente'] },
      { year: '2022', items: ['Galería Unión'] },
      { year: '2019', items: ['Museo de Arte de Sinaloa'] },
      { year: '2018', items: ['Galería de la Esmeralda'] },
      { year: '2017', items: ['Casa de Cultura Talavera, UACM'] },
    ],
  },
  {
    title: 'Becas',
    entries: [
      { year: '2020–2021', items: ['Jóvenes Creadores, FONCA'] },
      { year: '2019', items: ['PECDA CDMX'] },
      { year: '2018', items: ['Me sobra barrio, Centro de la Imagen'] },
      { year: '2016–2017', items: ['Jóvenes Creadores, FONCA'] },
    ],
  },
  {
    title: 'Formación',
    entries: [
      { year: 'actual', items: ['Maestría en Investigación en Artes, UNAM'] },
      { year: '2023', items: ['Acompañamiento Lolita Pank, 3.ª generación'] },
      { year: '2017', items: ['Seminario Medios Múltiples, 5.ª generación'] },
    ],
  },
  {
    title: 'Canalla (co-coordinación)',
    entries: [
      {
        year: '',
        items: [
          'Apoyo de Fomento Cultural Jumex',
          'Apoyo del Patronato de Arte Contemporáneo (PAC)',
          'Programa de acompañamiento para Iniciativas Culturales, Piso 16 (UNAM)',
          'Mención honorífica, Premio William Bullock (MUAC)',
        ],
      },
    ],
  },
];
