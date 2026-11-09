import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import { fs } from './fluid';

/**
 * Tema minimalista tipo portafolio de artista:
 * fondo blanco, texto negro, una sola tipografía, sin sombras ni esquinas redondeadas.
 * Cambia aquí colores y fuentes y todo el sitio se actualiza.
 */
export const theme = createTheme({
  // md = 768px: por debajo, el sidebar se convierte en header con menú
  breakpoints: { values: { xs: 0, sm: 600, md: 768, lg: 1200, xl: 1536 } },
  palette: {
    mode: 'light',
    primary: { main: '#111111' },
    secondary: { main: '#888888' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#111111', secondary: '#7a7a7a' },
    divider: '#e6e6e6',
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h1: { fontSize: fs.h1, fontWeight: 700, letterSpacing: '-0.01em' },
    h2: { fontSize: fs.h2, fontWeight: 700 },
    h3: { fontSize: fs.h3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' },
    body1: { fontSize: fs.body, lineHeight: 1.6 },
    body2: { fontSize: fs.small, lineHeight: 1.5 },
    button: { fontSize: fs.nav, textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      // Sin ripple, el foco por teclado se marca con un contorno visible
      styleOverrides: { root: { '&.Mui-focusVisible': { outline: '2px solid #111', outlineOffset: 2 } } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        'a:focus-visible': { outline: '2px solid #111', outlineOffset: 2 },

        // Scrollbar delgada y sin flechas
        // Chrome / Edge / Safari
        '*::-webkit-scrollbar': { width: 6, height: 6 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': { backgroundColor: '#d0d0d0', borderRadius: 3 },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: '#999' },
        '*::-webkit-scrollbar-button': { display: 'none', width: 0, height: 0 },
        '*::-webkit-scrollbar-corner': { background: 'transparent' },
        // Firefox (solo donde no existe ::-webkit-scrollbar, para no anular lo anterior en Chrome)
        '@supports not selector(::-webkit-scrollbar)': {
          '*': { scrollbarWidth: 'thin', scrollbarColor: '#d0d0d0 transparent' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '2px 6px',
          minWidth: 0,
          '&:hover': { backgroundColor: 'transparent', opacity: 0.55 },
        },
      },
    },
    MuiLink: {
      defaultProps: { underline: 'none', color: 'inherit' },
      styleOverrides: { root: { transition: 'opacity .2s', '&:hover': { opacity: 0.55 } } },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontSize: fs.tiny,
          minWidth: 22,
          height: 22,
          margin: 0,
          color: '#7a7a7a',
          '&.Mui-selected': { backgroundColor: 'transparent', color: '#111', fontWeight: 700 },
          '&.Mui-selected:hover, &:hover': { backgroundColor: 'transparent', color: '#111' },
        },
      },
    },
    MuiTextField: { defaultProps: { variant: 'standard', fullWidth: true } },
  },
}, esES); // textos internos de MUI (paginador, etc.) en español
