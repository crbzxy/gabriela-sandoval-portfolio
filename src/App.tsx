import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import GalleryPage from '@/pages/GalleryPage';
import SemblanzaPage from '@/pages/SemblanzaPage';
import { categories } from '@/data/works';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {categories.map((c) => (
          <Route key={c.slug} path={c.path} element={<GalleryPage key={c.slug} category={c} />} />
        ))}
        <Route path="/semblanza" element={<SemblanzaPage />} />
        <Route path="/info" element={<Navigate to="/semblanza" replace />} />
        <Route path="/contacto" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
