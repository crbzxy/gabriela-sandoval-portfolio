import { useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { bio, cv } from '@/data/cv';
import { site } from '@/data/works';

export default function SemblanzaPage() {
  useEffect(() => {
    document.title = `Semblanza — ${site.name}`;
  }, []);

  return (
    <Box sx={{ maxWidth: 640, pb: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
        Semblanza
      </Typography>
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        {bio.map((p) => (
          <Typography key={p}>{p}</Typography>
        ))}
      </Stack>

      <Typography variant="h2" gutterBottom>
        CV
      </Typography>

      <Stack spacing={4} sx={{ mt: 3 }}>
        {cv.map((section) => (
          <Box key={section.title}>
            <Typography variant="h3" sx={{ mb: 1.5 }}>
              {section.title}
            </Typography>
            <Stack spacing={1}>
              {section.entries.map((e) => (
                <Box key={e.year + e.items[0]} sx={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {e.year}
                  </Typography>
                  <Box>
                    {e.items.map((it) => (
                      <Typography key={it} variant="body2">
                        {it}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
