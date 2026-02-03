import { Box, Card, Typography, TextField } from '@mui/material';

interface LocationFormProps {
  city: string;
  postalCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LocationForm = ({ city, postalCode, onChange }: LocationFormProps) => (
  <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
    <Typography fontWeight={600} color="#1F2937" gutterBottom>
      Localisation
    </Typography>

    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="Ville"
        name="city"
        value={city}
        onChange={onChange}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
      <TextField
        label="Code postal"
        name="postalCode"
        value={postalCode}
        onChange={onChange}
        sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
    </Box>
  </Card>
);

export default LocationForm;
