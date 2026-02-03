import { Box, Card, Typography, TextField } from '@mui/material';

interface PersonalInfoFormProps {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PersonalInfoForm = ({
  firstName,
  lastName,
  email,
  bio,
  onChange,
}: PersonalInfoFormProps) => (
  <Card sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
    <Typography fontWeight={600} color="#1F2937" gutterBottom>
      Informations personnelles
    </Typography>

    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        fullWidth
        label="Prénom"
        name="firstName"
        value={firstName}
        onChange={onChange}
        required
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
      <TextField
        fullWidth
        label="Nom"
        name="lastName"
        value={lastName}
        onChange={onChange}
        required
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
    </Box>

    <TextField
      fullWidth
      label="Email"
      name="email"
      value={email}
      disabled
      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      helperText="L'email ne peut pas être modifié"
    />

    <TextField
      fullWidth
      label="Bio"
      name="bio"
      value={bio}
      onChange={onChange}
      multiline
      rows={3}
      placeholder="Parlez-nous de vous..."
      inputProps={{ maxLength: 200 }}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
    />
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
      {bio.length}/200
    </Typography>
  </Card>
);

export default PersonalInfoForm;
