import { Box, Container, Typography } from '@mui/material';

export const SuccessScreen = () => (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: '#DCFCE7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: 48 }}>🎉</Typography>
      </Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Objet ajouté avec succès !
      </Typography>
      <Typography color="text.secondary">
        Votre objet est maintenant visible par la communauté.
      </Typography>
    </Container>
  </Box>
);

export default SuccessScreen;
