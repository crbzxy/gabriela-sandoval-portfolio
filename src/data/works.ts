import type { Category, Work } from './types';
import media from './media.json';

/**
 * Contenido de Gabriela Sandoval.
 * Imágenes generadas con `node scripts/import-media.mjs "<carpeta proyectos>"`
 * a partir de C:\Users\carlo\Dev\gabriela-sandoval-portfolio\página web\proyectos.
 *
 * Los campos `year`, `medium` y `size` solo están donde hay un dato confirmado
 * (semblanza o fecha en el nombre del archivo). Completa el resto aquí.
 */

type MediaKey = keyof typeof media;

const w = (key: MediaKey, data: Omit<Work, 'id' | 'image' | 'thumb' | 'width' | 'height'>): Work => ({
  id: key,
  image: `/images/${key}.webp`,
  thumb: `/images/${key}.thumb.webp`,
  width: media[key].w,
  height: media[key].h,
  ...data,
});

const ESP = 'Especulaciones interplanetarias';
const NOPAL = 'Nopal chino';
const PCC = 'Productos culturales chinos';

export const categories: Category[] = [
  {
    slug: 'especulaciones',
    label: 'especulaciones interplanetarias',
    path: '/',
    works: [
      w('especulaciones-interplanetarias/img-3309', { title: ESP, medium: 'vista de instalación' }),
      w('especulaciones-interplanetarias/img-3322', { title: ESP, medium: 'vista de instalación' }),
      w('especulaciones-interplanetarias/img-3332-3', { title: ESP, medium: 'vista de instalación' }),
      w('especulaciones-interplanetarias/img-3321-1', { title: ESP, medium: 'detalle' }),
    ],
  },
  {
    slug: 'nopal-chino',
    label: 'nopal chino',
    path: '/nopal-chino',
    works: [
      w('nopal-chino/proyectos-puente/dsc-0445-1', { title: NOPAL, medium: 'vista de exposición', location: 'Proyectos Puente', year: 2025 }),
      w('nopal-chino/proyectos-puente/dsc-0429-1-recuperado', { title: NOPAL, medium: 'vista de exposición', location: 'Proyectos Puente', year: 2025 }),
      w('nopal-chino/escultura/20251006-161709', { title: NOPAL, medium: 'escultura', year: 2025 }),
      w('nopal-chino/escultura/20251006-161810', { title: NOPAL, medium: 'escultura', year: 2025 }),
      w('nopal-chino/escultura/nopal', { title: NOPAL, medium: 'escultura, pencas' }),
      w('nopal-chino/escultura/nopal-ref-jpg-rf-b83e46a8979e841dbcc9e2376ba77c38', { title: NOPAL, medium: 'pencas de colores, imagen de referencia' }),
      w('nopal-chino/papel-recortado/2', { title: NOPAL, medium: 'papel recortado' }),
      w('nopal-chino/papel-recortado/1', { title: NOPAL, medium: 'papel recortado' }),
      w('nopal-chino/papel-recortado/3', { title: NOPAL, medium: 'papel recortado' }),
      w('nopal-chino/papel-recortado/4', { title: NOPAL, medium: 'papel recortado' }),
      w('nopal-chino/papel-recortado/01-inaugu-gs', { title: NOPAL, medium: 'papel recortado, vista de inauguración' }),
      w('nopal-chino/img-8106-1', { title: NOPAL, medium: 'proceso: bocetos y referencias' }),
      w('nopal-chino/val-batch0-labels', { title: NOPAL, medium: 'proceso: imágenes etiquetadas "nopal" para reconocimiento visual' }),
    ],
  },
  {
    slug: 'productos-culturales-chinos',
    label: 'productos culturales chinos',
    path: '/productos-culturales-chinos',
    works: [
      w('productos-culturales-chinos/02-inaug-gs', { title: PCC, medium: 'vista de inauguración' }),
      w('productos-culturales-chinos/09-inau-gs', { title: PCC, medium: 'vista de inauguración' }),
      w('productos-culturales-chinos/dsc-0421-1-recuperado', { title: PCC, medium: 'galletas de la fortuna' }),
      w('productos-culturales-chinos/img20250315201717', { title: PCC, medium: 'detalle', year: 2025 }),
    ],
  },
  {
    slug: 'editorial',
    label: 'editorial',
    path: '/editorial',
    works: [
      w('proyectos-editoriales/nopal-chino/zines-03', { title: 'Nopal chino', medium: 'zine' }),
      w('proyectos-editoriales/para-ti/zines-02', { title: 'Para ti', medium: 'zine' }),
      w('proyectos-editoriales/echale-ganas-1/zines-mesa-de-trabajo-1', { title: '¡Échale ganas! 1', medium: 'zine' }),
      w('proyectos-editoriales/echale-ganas-2/zine4-04', { title: '¡Échale ganas! 2', medium: 'zine' }),
    ],
  },
  {
    slug: 'textil',
    label: 'textil',
    path: '/textil',
    works: [
      w('textil/guantes/guantes1', { title: 'Guantes', medium: 'textil' }),
      w('textil/guantes/guantes-3', { title: 'Guantes', medium: 'textil, detalle' }),
      w('textil/guantes/guantes2', { title: 'Guantes', medium: 'textil, detalle' }),
      w('textil/traje-de-bano/vivocon', { title: 'Traje de baño', medium: 'textil' }),
    ],
  },
];

export const pages = [
  { label: 'semblanza', path: '/semblanza' },
];

export const site = {
  name: 'Gabriela Sandoval',
  role: 'Artista visual',
  instagram: 'https://www.instagram.com/gabosanrex/',
  instagramHandle: '@gabosanrex',
};
