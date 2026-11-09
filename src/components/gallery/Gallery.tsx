import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import type { Work } from '@/data/types';
import { fs } from '@/theme/fluid';
import WorkCaption, { workAlt } from './WorkCaption';
import ThumbnailGrid from './ThumbnailGrid';

/**
 * Vista de obra. La imagen es la protagonista y los controles van pegados a ella.
 *
 * - El tamaño de la imagen se calcula con container queries (cqw/cqh) y su proporción conocida
 *   (media.json), así el espacio queda reservado antes de cargar: sin saltos de layout.
 * - Barra bajo la imagen, del ancho real de la imagen: título + técnica | ← 1 / 4 → · miniaturas.
 * - Clic en la mitad izquierda/derecha de la imagen = anterior/siguiente. Teclado ← →, Esc cierra miniaturas.
 * - Swipe en móvil. La galería es infinita: después de la última viene la primera (y al revés).
 * - Presentación automática: avanza cada AUTOPLAY_MS desde que la imagen terminó de cargar.
 *   Cualquier interacción la pausa y continúa RESUME_MS después de la última. Botón de pausa (WCAG 2.2.2).
 * - La posición queda en la URL (?p=3, ?vista=miniaturas).
 */

/** Tiempo que se muestra cada imagen en la presentación automática */
const AUTOPLAY_MS = 3000;
/** Tras una interacción, la presentación continúa pasado este tiempo sin interactuar */
const RESUME_MS = 5000;
/** Duración del fundido cruzado entre obras */
const FADE_MS = 700;

/** Alto reservado bajo la imagen para el pie y los controles */
const BAR_DESKTOP = 64;
const BAR_MOBILE = 140;
/** En móvil la imagen va de borde a borde: recupera el margen lateral del layout (16px por lado) */
const BLEED = 16;

/** Proporción fija del escenario: 3:2, la de las fotos de Nopal chino (2000×1333).
    Las obras se encajan dentro; pie y controles nunca cambian de ancho ni de lugar. */
const STAGE_RATIO = 3 / 2;

/** Ancho del escenario: lo más grande posible dejando `bar` px debajo para pie y controles */
const stageWidth = (bar: number, bleed = 0) =>
  `min(100cqw + ${bleed * 2}px, (100cqh - ${bar}px) * ${STAGE_RATIO})`;

const ctrlSx = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  color: 'text.secondary',
  fontSize: fs.control,
  fontFamily: 'inherit',
  transition: 'color .15s',
  '&:hover': { color: 'text.primary', backgroundColor: 'transparent' },
} as const;

/** Botones en un extremo: conservan el área táctil de 44px pero el ícono toca el borde,
    así queda alineado con el texto (título) y con los demás controles del mismo lado. */
const edgeStart = { justifyContent: 'flex-start', p: 0, borderRadius: 0 } as const;
const edgeEnd = { justifyContent: 'flex-end', p: 0, borderRadius: 0 } as const;

export default function Gallery({ works }: { works: Work[] }) {
  const [params, setParams] = useSearchParams();
  const total = works.length;
  const page = clamp(Number(params.get('p')) || 1, 1, total);
  const index = page - 1;
  const thumbs = params.get('vista') === 'miniaturas';
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loaded = !!works[index] && loadedId === works[index].id;

  // Fundido cruzado: `shownId` es la obra que está completamente visible.
  // Mientras la nueva carga y se funde, la anterior (prevWork) se mantiene debajo.
  const [shownId, setShownId] = useState<string | null>(null);
  const prevWork = shownId && shownId !== works[index]?.id ? works.find((w) => w.id === shownId) : undefined;
  const markLoaded = useCallback((id: string) => {
    // Dos frames: garantiza que la opacidad 0 se pinte antes de pasar a 1 (si no, no hay transición)
    requestAnimationFrame(() => requestAnimationFrame(() => setLoadedId(id)));
  }, []);
  useEffect(() => {
    if (!loaded) return;
    const id = works[index].id;
    const t = setTimeout(() => setShownId(id), FADE_MS); // al terminar el fundido, retira la anterior
    return () => clearTimeout(t);
  }, [loaded, index, works]);

  // Presentación automática
  const lastInteraction = useRef(0);
  const markInteraction = useCallback(() => {
    lastInteraction.current = Date.now();
  }, []);
  const [paused, setPaused] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  // El contador solo se anuncia al lector de pantalla cuando el cambio lo hizo una persona
  const [autoAdvanced, setAutoAdvanced] = useState(false);

  const navigate = useCallback(
    (i: number, auto: boolean) => {
      const next = ((i % total) + total) % total; // infinita: da la vuelta en ambos sentidos
      setAutoAdvanced(auto);
      setParams(
        (p) => {
          p.set('p', String(next + 1));
          p.delete('vista');
          return p;
        },
        { replace: auto }, // el avance automático no llena el historial del botón "atrás"
      );
    },
    [total, setParams],
  );

  /** Navegación hecha por una persona: cuenta como interacción */
  const go = useCallback(
    (i: number) => {
      markInteraction();
      navigate(i, false);
    },
    [markInteraction, navigate],
  );

  useEffect(() => {
    if (thumbs || paused || !loaded || total < 2) return;
    let id: ReturnType<typeof setTimeout>;
    const schedule = (ms: number) => {
      id = setTimeout(() => {
        const idle = Date.now() - lastInteraction.current;
        if (idle < RESUME_MS) return schedule(RESUME_MS - idle); // alguien interactuó: esperar
        if (document.hidden) return schedule(AUTOPLAY_MS); // pestaña oculta: no avanzar
        navigate(index + 1, true);
      }, ms);
    };
    schedule(Math.max(AUTOPLAY_MS, RESUME_MS - (Date.now() - lastInteraction.current)));
    return () => clearTimeout(id);
  }, [index, loaded, thumbs, paused, total, navigate]);

  const setThumbs = useCallback(
    (open: boolean) =>
      setParams(
        (p) => {
          if (open) p.set('vista', 'miniaturas');
          else p.delete('vista');
          return p;
        },
        { replace: true },
      ),
    [setParams],
  );

  // Teclado: ← → navegan, Esc cierra miniaturas
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      markInteraction();
      if (thumbs) {
        if (e.key === 'Escape') setThumbs(false);
        return;
      }
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, index, thumbs, setThumbs, markInteraction]);

  // Precarga la anterior y la siguiente
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const w = works[((i % total) + total) % total];
      if (w) new Image().src = w.image;
    });
  }, [index, total, works]);

  // Swipe táctil
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? index + 1 : index - 1);
    touchX.current = null;
  };

  const work = works[index];
  if (!work) return null;

  /* ---------- Vista de miniaturas ---------- */
  if (thumbs) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', p: 0.5 }}>
          <ThumbnailGrid works={works} current={index} onSelect={go} />
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 1.5, flexShrink: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {total} imágenes
          </Typography>
          <IconButton aria-label="Cerrar miniaturas" aria-pressed onClick={() => setThumbs(false)} sx={{ ...ctrlSx, color: 'text.primary' }}>
            <GridViewOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    );
  }

  /* ---------- Vista de una obra ---------- */

  const pauseButton = (
    <IconButton
      aria-label={paused ? 'Reanudar presentación' : 'Pausar presentación'}
      aria-pressed={paused}
      onClick={() => {
        markInteraction();
        setPaused((v) => !v);
      }}
      sx={ctrlSx}
    >
      {paused ? <PlayArrowRoundedIcon sx={{ fontSize: 20 }} /> : <PauseRoundedIcon sx={{ fontSize: 20 }} />}
    </IconButton>
  );

  const controls = (mobile: boolean) => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent={mobile ? 'space-between' : 'flex-end'}
      sx={{ flexShrink: 0 }}
    >
      <IconButton aria-label="Imagen anterior" onClick={() => go(index - 1)} sx={mobile ? { ...ctrlSx, ...edgeStart } : ctrlSx}>
        ←
      </IconButton>
      <Typography
        aria-live={autoAdvanced ? 'off' : 'polite'}
        aria-atomic
        variant="body2"
        sx={{ minWidth: 52, textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: 'text.secondary' }}
      >
        <Box component="span" sx={{ color: 'text.primary' }}>
          {page}
        </Box>{' '}
        / {total}
      </Typography>
      <IconButton aria-label="Imagen siguiente" onClick={() => go(index + 1)} sx={mobile ? { ...ctrlSx, ...edgeEnd } : ctrlSx}>
        →
      </IconButton>
      {!mobile && (
        <>
          <Box aria-hidden sx={{ color: 'text.secondary', mx: 0.5 }}>
            ·
          </Box>
          {pauseButton}
          {thumbsButton}
        </>
      )}
    </Stack>
  );

  const thumbsButton = (
    <IconButton aria-label="Ver miniaturas" aria-pressed={false} onClick={() => setThumbs(true)} sx={{ ...ctrlSx, ...edgeEnd }}>
      <GridViewOutlinedIcon sx={{ fontSize: 18 }} />
    </IconButton>
  );

  return (
    <Box
      // Cualquier gesto sobre la galería pausa la presentación (continúa RESUME_MS después)
      onPointerMove={markInteraction}
      onPointerDown={markInteraction}
      onWheel={markInteraction}
      onTouchStart={markInteraction}
      sx={{
        height: '100%',
        containerType: 'size', // habilita cqw/cqh para dimensionar la imagen
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Columna de ancho FIJO (no depende de la imagen): el escenario 3:2 y, debajo, pie y controles.
          Así nada cambia de tamaño ni de lugar al pasar de una obra a otra.
          - móvil  (< md):   escenario de borde a borde, controles al fondo
          - tablet (md–lg):  con sidebar, controles al fondo
          - escritorio (lg+): controles en la misma línea que el pie de obra
          En móvil y tablet: escenario + pie centrados en el alto libre y la barra de controles al fondo,
          dentro de la misma columna para que título, flechas y miniaturas compartan los mismos bordes. */}
      <Box
        sx={{
          width: {
            xs: `calc(100% + ${BLEED * 2}px)`, // móvil: todo el ancho, de borde a borde
            md: stageWidth(BAR_MOBILE),
            lg: stageWidth(BAR_DESKTOP),
          },
          mx: { xs: `-${BLEED}px`, md: 0 },
          flex: { xs: 1, lg: 'none' },
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
      <Box sx={{ flex: { xs: 1, lg: 'none' }, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Escenario de tamaño fijo. Tablet/escritorio: 3:2, la obra completa encajada dentro.
            Móvil: todo el espacio libre, la obra lo cubre (puede recortarse un poco). */}
        <Box
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          sx={{
            position: 'relative',
            width: '100%',
            // móvil: el escenario llena todo el alto libre; tablet/escritorio: 3:2 fijo
            aspectRatio: { xs: 'auto', md: String(STAGE_RATIO) },
            flex: { xs: 1, md: 'none' },
            minHeight: 0,
            containerType: 'size', // cqw/cqh del escenario, para encajar la obra
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }}
        >
          {/* Fundido cruzado: la obra anterior sigue visible hasta que la nueva cargó;
              entonces una se desvanece mientras la otra aparece. Sin parpadeos en blanco. */}
          {prevWork && <WorkLayer key={prevWork.id} work={prevWork} visible={!loaded} />}
          <WorkLayer
            key={work.id}
            work={work}
            visible={loaded}
            showSkeleton={!loaded && !prevWork} // skeleton solo en la primera carga
            onLoaded={() => markLoaded(work.id)}
          />

          {/* Zonas de clic sobre todo el escenario: mitad izquierda = anterior, derecha = siguiente.
              Son un atajo de ratón; los botones accesibles están en la barra. */}
          <HalfZone side="left" onClick={() => go(index - 1)} />
          <HalfZone side="right" onClick={() => go(index + 1)} />
        </Box>

        {/* Barra: pie de obra | controles */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ height: { lg: BAR_DESKTOP }, pt: { xs: 1.5, lg: 0 }, px: { xs: `${BLEED}px`, md: 0 }, minWidth: 0 }}
        >
          <WorkCaption work={work} />
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>{controls(false)}</Box>
          {/* Móvil y tablet: pausa y miniaturas junto al pie, para que el contador quede centrado abajo */}
          <Stack direction="row" sx={{ display: { xs: 'flex', lg: 'none' } }}>
            {pauseButton}
            {thumbsButton}
          </Stack>
        </Stack>
      </Box>

      {/* Móvil y tablet: controles al fondo, flechas en los extremos y contador al centro.
          Mismo padding lateral que el pie: título ↔ flecha izquierda y miniaturas ↔ flecha derecha alineados. */}
      <Box
        sx={{
          display: { xs: 'block', lg: 'none' },
          px: { xs: `${BLEED}px`, md: 0 },
          flexShrink: 0,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {controls(true)}
      </Box>
      </Box>
    </Box>
  );
}

/**
 * Una obra encajada en el escenario (proporción real, centrada) que aparece/desaparece con opacidad.
 * Va en posición absoluta para que la anterior y la nueva se superpongan durante el fundido.
 */
function WorkLayer({
  work,
  visible,
  showSkeleton = false,
  onLoaded,
}: {
  work: Work;
  visible: boolean;
  showSkeleton?: boolean;
  onLoaded?: () => void;
}) {
  const ratio = work.width && work.height ? work.width / work.height : 4 / 3;
  const notified = useRef(false);
  const notify = () => {
    if (notified.current) return;
    notified.current = true;
    onLoaded?.();
  };

  return (
    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      {/* móvil: la obra cubre todo el escenario (recorta lo que sobra); tablet/escritorio: completa, encajada */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', md: `min(100cqw, 100cqh * ${ratio})` },
          height: { xs: '100%', md: 'auto' },
          aspectRatio: { xs: 'auto', md: String(ratio) },
        }}
      >
        {showSkeleton && (
          <Skeleton variant="rectangular" animation="wave" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        )}
        <Box
          component="img"
          src={work.image}
          alt={visible ? workAlt(work) : ''}
          aria-hidden={!visible}
          draggable={false}
          ref={(el: HTMLImageElement | null) => {
            // Si ya estaba en caché, onLoad puede no dispararse
            if (el?.complete && el.naturalWidth > 0) notify();
          }}
          onLoad={notify}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: { xs: 'cover', md: 'contain' },
            display: 'block',
            opacity: visible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        />
      </Box>
    </Box>
  );
}

function HalfZone({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <Box
      aria-hidden
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side]: 0,
        width: '50%',
        cursor: side === 'left' ? 'w-resize' : 'e-resize',
        '&:hover .hint': { opacity: 0.6 },
      }}
    >
      {/* Flecha de refuerzo: aparece sutilmente con hover, sin tapar la obra */}
      <Box
        className="hint"
        sx={{
          position: 'absolute',
          top: '50%',
          [side]: 12,
          transform: 'translateY(-50%)',
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.85)',
          color: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: fs.hint,
          opacity: 0,
          transition: 'opacity .2s',
          pointerEvents: 'none',
          '@media (hover: none)': { display: 'none' },
        }}
      >
        {side === 'left' ? '←' : '→'}
      </Box>
    </Box>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
