import { Box, Typography } from '@mui/material';
import type { Work } from '@/data/types';

/** Texto alternativo descriptivo: "Nopal chino, escultura, 2025" */
export const workAlt = (w: Work) => [w.title, w.medium, w.location, w.year].filter(Boolean).join(', ');

/** Pie de obra en dos líneas: título en negrita, técnica (y lugar/año) debajo. */
export default function WorkCaption({ work }: { work: Work }) {
  const detail = [
    work.medium,
    work.size && `${work.size.w} x ${work.size.h} cm`,
    [work.location, work.year].filter(Boolean).join(', '),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Box sx={{ minWidth: 0, flex: 1 }} title={workAlt(work)}>
      <Typography noWrap sx={{ fontWeight: 700, lineHeight: 1.3 }}>
        {work.title}
      </Typography>
      {detail && (
        <Typography noWrap variant="body2" color="text.secondary">
          {detail}
        </Typography>
      )}
    </Box>
  );
}
