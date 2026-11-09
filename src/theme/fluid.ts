/**
 * Tipografía fluida: el tamaño crece de forma lineal entre dos anchos de pantalla y se detiene en los extremos.
 *
 *   fluid(14, 16) -> "clamp(0.875rem, 0.8333rem + 0.1852vw, 1rem)"
 *
 * - `min` px en pantallas de 360px o menos, `max` px en pantallas de 1440px o más.
 * - Usa rem en los límites para respetar el zoom / tamaño de letra del navegador.
 * - Si min > max, la fuente se hace más pequeña al crecer la pantalla (útil para controles táctiles).
 */
const VW_MIN = 360;
const VW_MAX = 1440;
const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`;

export function fluid(min: number, max: number, vwMin = VW_MIN, vwMax = VW_MAX): string {
  const slope = (max - min) / (vwMax - vwMin);
  const intercept = min - slope * vwMin;
  const preferred = `${rem(intercept)} + ${+(slope * 100).toFixed(4)}vw`;
  return `clamp(${rem(Math.min(min, max))}, ${preferred}, ${rem(Math.max(min, max))})`;
}

/** Escala tipográfica del sitio (móvil → escritorio, en px). Cambia aquí y se ajusta todo. */
export const fs = {
  h1: fluid(22, 28),
  h2: fluid(18, 21),
  h3: fluid(12, 14), // títulos de sección en versalitas
  body: fluid(14.5, 16),
  small: fluid(13, 14),
  tiny: fluid(12, 13.5), // "artista visual", ©
  logo: fluid(16, 19),
  nav: fluid(14.5, 16), // proyectos, semblanza, contacto
  navDrawer: fluid(19, 24), // menú móvil a pantalla completa
  control: fluid(21, 18), // flechas: más grandes en móvil, para el dedo
  hint: fluid(16, 18),
};
