import { Box, Card, Typography, TextField } from '@mui/material';

interface LocationInputProps {
  city: string;
  postalCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LocationInput = ({ city, postalCode, onChange }: LocationInputProps) => (
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
        required
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        placeholder="Paris"
      />
      <TextField
        label="Code postal"
        name="postalCode"
        value={postalCode}
        onChange={onChange}
        required
        sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        placeholder="75011"
      />
    </Box>
  </Card>
);

export default LocationInput;
