import { Box, Button, CircularProgress } from '@mui/material';

interface FormActionsProps {
  loading: boolean;
  onCancel: () => void;
}

export const FormActions = ({ loading, onCancel }: FormActionsProps) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button
      variant="outlined"
      fullWidth
      onClick={onCancel}
      sx={{
        py: 1.5,
        borderRadius: '12px',
        borderColor: '#E5E7EB',
        color: '#6B7280',
        textTransform: 'none',
        fontWeight: 600,
        '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
      }}
    >
      Annuler
    </Button>
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={loading}
      sx={{
        py: 1.5,
        borderRadius: '12px',
        backgroundColor: '#22C55E',
        fontWeight: 600,
        textTransform: 'none',
        '&:hover': { backgroundColor: '#16A34A' },
        '&:disabled': { backgroundColor: '#86EFAC' },
      }}
    >
      {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Enregistrer'}
    </Button>
  </Box>
);

export default FormActions;
