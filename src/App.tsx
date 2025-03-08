import React from 'react';
import { Box, Container, Typography, Link, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Importa la imagen correctamente
import exposicionImg from './assets/exposicion.jpg';

// Crear un tema personalizado para el sitio
const theme = createTheme({
  palette: {
    primary: {
      main: '#556B2F', // Un verde oliva que complementa los cactus
    },
    secondary: {
      main: '#ECEFF1', // Un gris muy claro para el fondo
    },
    background: {
      default: '#faf3eb', // Un fondo beige claro (corregido el punto y coma)
      paper: '#faf3eb',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1.1rem',
      color: '#666666',
    },
  },
});

const GabrielaSandovalPortfolio: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={0} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              bgcolor: 'transparent'
            }}
          >
            {/* Imagen como enlace a Instagram */}
            <Link 
              href="https://www.instagram.com/gabosanrex/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'block',
                maxWidth: '100%',
                '&:hover': {
                  opacity: 0.9,
                },
                transition: 'opacity 0.3s',
              }}
            >
              <Box
                component="img"
                src={exposicionImg}
                alt="Territorios de especulación - Gabriela Sandoval"
                sx={{
                  width: '100%',
                  height: 'auto',
                  margin: '0 auto',
                  maxWidth: '700px'
                }}
              />
            </Link>
            
            {/* Footer con copyright */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: '0.8rem' }}
              >
                © 2025 Gabriela Sandoval
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default GabrielaSandovalPortfolio;