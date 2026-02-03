// FRONTEND/src/components/calendar/HowItWorks.tsx

import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const steps = [
  {
    icon: '1️⃣',
    title: 'Consultez le thème',
    description: "Chaque semaine, un nouveau thème est proposé pour orienter vos échanges.",
  },
  {
    icon: '2️⃣',
    title: 'Proposez vos objets',
    description: "Publiez les objets que vous souhaitez échanger en lien avec le thème.",
  },
  {
    icon: '3️⃣',
    title: 'Échangez !',
    description: "Trouvez ce qui vous intéresse et contactez les autres membres pour échanger.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        p: 4,
        bgcolor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        💡 Comment ça marche ?
      </Typography>
      
      <Grid container spacing={3}>
        {steps.map((step, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {step.icon}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HowItWorks;