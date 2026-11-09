import { useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Box, Button, Container, Drawer, IconButton, Link, Stack, Typography } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import CloseIcon from '@mui/icons-material/Close';
import { categories, pages, site } from '@/data/works';
import { fs } from '@/theme/fluid';

const navLinkSx = {
  fontSize: fs.nav,
  whiteSpace: 'nowrap', // cada título en una sola línea
  color: 'text.secondary',
  transition: 'color .2s',
  '&:hover': { color: 'text.primary', opacity: 1 },
  '&.active': { color: 'text.primary', fontWeight: 700 },
} as const;

function NavGroup({ items, onNavigate }: { items: { label: string; path: string }[]; onNavigate?: () => void }) {
  return (
    <Stack component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }} spacing={0.25}>
      {items.map((it) => (
        <li key={it.path}>
          <Link component={NavLink} to={it.path} end sx={navLinkSx} onClick={onNavigate}>
            {it.label}
          </Link>
        </li>
      ))}
    </Stack>
  );
}

function Logo() {
  return (
    <Link component={RouterLink} to="/" aria-label={site.name} sx={{ display: 'block' }}>
      <Typography component="span" sx={{ display: 'block', fontWeight: 700, fontSize: fs.logo, lineHeight: 1.2, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {site.name}
      </Typography>
      <Typography component="span" sx={{ display: 'block', fontSize: fs.tiny, color: 'text.secondary' }}>
        {site.role.toLowerCase()}
      </Typography>
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const close = () => setOpen(false);

  // Navegación principal: solo proyectos. Instagram y semblanza van en el pie del sidebar.
  const nav = (onNavigate?: () => void) => <NavGroup items={categories} onNavigate={onNavigate} />;

  const footer = (onNavigate?: () => void) => (
    <Stack spacing={0.5} sx={{ color: 'text.secondary', fontSize: fs.tiny }}>
      <Stack component="nav" aria-label="Páginas" spacing={0.25} alignItems="flex-start" sx={{ pb: 0.5 }}>
        {pages.map((p) => (
          <Link key={p.path} component={NavLink} to={p.path} onClick={onNavigate} sx={navLinkSx}>
            {p.label}
          </Link>
        ))}
        {/* Contacto: ícono + usuario, todo es el enlace */}
        <Link
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram de ${site.name}: ${site.instagramHandle}`}
          sx={{ ...navLinkSx, display: 'inline-flex', alignItems: 'center', gap: 0.75 }}
        >
          <InstagramIcon sx={{ fontSize: '1.1em' }} />
          {site.instagramHandle}
        </Link>
      </Stack>
      <span>© {new Date().getFullYear()} {site.name}</span>
    </Stack>
  );

  return (
    // Todo el sitio cabe en una sola vista: altura fija = ventana, sin scroll de página
    <Container
      maxWidth={false}
      sx={{
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 1.5, md: 5 },
        py: { xs: 1.5, md: 4 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Sidebar (desktop) / barra superior (móvil) */}
      <Box
        component="header"
        sx={{ width: { md: 'max-content' }, minWidth: { md: 180 }, flexShrink: 0, display: 'flex', flexDirection: 'column' }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />
          <Button onClick={() => setOpen(true)} sx={{ display: { md: 'none' } }} color="inherit">
            Menú
          </Button>
        </Stack>
        <Box component="nav" sx={{ display: { xs: 'none', md: 'block' }, mt: 5 }}>
          {nav()}
        </Box>
        <Box component="footer" sx={{ display: { xs: 'none', md: 'block' }, mt: 'auto' }}>
          {footer()}
        </Box>
      </Box>

      {/* El contenido ocupa el resto; si una página de texto es larga, hace scroll solo dentro */}
      <Box
        component="main"
        key={pathname}
        sx={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          overflowY: 'auto',
          // En móvil el margen lateral va como padding de main: overflow recorta en el borde del padding,
          // así la galería puede ir de borde a borde (márgenes negativos) sin cortarse.
          mx: { xs: -2, md: 0 },
          px: { xs: 2, md: 0 },
          animation: 'pageIn .5s ease',
          '@keyframes pageIn': { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      >
        <Outlet />
      </Box>

      {/* Menú móvil a pantalla completa */}
      <Drawer anchor="top" open={open} onClose={close} PaperProps={{ sx: { height: '100%', p: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
          <Logo />
          <IconButton onClick={close} aria-label="Cerrar menú">
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* En el menú móvil los títulos sí pueden partirse para no salirse de la pantalla */}
        <Box sx={{ '& li + li': { mt: 1 }, '& a': { fontSize: fs.navDrawer, lineHeight: 1.25, whiteSpace: 'normal', display: 'inline-block' } }}>
          {nav(close)}
        </Box>
        <Box sx={{ mt: 'auto' }}>{footer(close)}</Box>
      </Drawer>
    </Container>
  );
}
