import { useState } from 'react';
import { Box, ButtonBase, Skeleton } from '@mui/material';
import type { Work } from '@/data/types';

interface Props {
  works: Work[];
  current: number;
  onSelect: (index: number) => void;
}

/** Rejilla de miniaturas cuadradas; al hacer clic vuelve a la vista de una sola imagen. */
export default function ThumbnailGrid({ works, current, onSelect }: Props) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' },
        gap: 1,
      }}
    >
      {works.map((w, i) => (
        <Thumb key={w.id} work={w} active={i === current} onClick={() => onSelect(i)} />
      ))}
    </Box>
  );
}

function Thumb({ work, active, onClick }: { work: Work; active: boolean; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <ButtonBase
      onClick={onClick}
      aria-label={[work.title, work.medium, work.year].filter(Boolean).join(', ')}
      sx={{
        position: 'relative',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        outline: active ? '2px solid' : 'none',
        outlineOffset: 2,
        '& img': {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'transform .4s ease, opacity .4s ease',
        },
        '&:hover img': { transform: 'scale(1.05)', opacity: loaded ? 0.85 : 0 },
      }}
    >
      {!loaded && (
        <Skeleton variant="rectangular" animation="wave" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      )}
      <img
        src={work.thumb}
        alt=""
        loading="lazy"
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
      />
    </ButtonBase>
  );
}
