import { Box, Container, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  onNavigate: () => void;
}

export const EmptyState = ({ onNavigate }: EmptyStateProps) => (
  <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
    <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ mb: 2, color: '#1F2937' }}>
        Aucune conversation
      </Typography>
      <Typography sx={{ color: '#6B7280', mb: 4 }}>
        Proposez un échange sur un objet pour démarrer une conversation !
      </Typography>
      <Button
        variant="contained"
        onClick={onNavigate}
        sx={{
          backgroundColor: '#22C55E',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': { backgroundColor: '#16A34A' },
        }}
      >
        Découvrir les objets
      </Button>
    </Container>
  </Box>
);

export default EmptyState;
