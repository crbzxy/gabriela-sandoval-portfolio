export interface Work {
  id: string;
  title: string;
  image: string;
  thumb: string;
  width?: number;
  height?: number;
  year?: number;
  /** Línea descriptiva: técnica, tipo de vista (instalación, detalle…) */
  medium?: string;
  /** Lugar o sede */
  location?: string;
  /** Dimensiones en cm */
  size?: { w: number; h: number };
}

export interface Category {
  slug: string;
  label: string;
  path: string;
  works: Work[];
}
