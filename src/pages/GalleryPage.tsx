import { useEffect } from 'react';
import Gallery from '@/components/gallery/Gallery';
import type { Category } from '@/data/types';
import { site } from '@/data/works';

export default function GalleryPage({ category }: { category: Category }) {
  useEffect(() => {
    document.title = `${category.label} — ${site.name.toLowerCase()}`;
  }, [category]);

  return <Gallery works={category.works} />;
}
