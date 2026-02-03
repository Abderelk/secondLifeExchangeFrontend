import { Box, Card, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
}

interface ProfileEditTabProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  success: string | null;
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#F9FAFB',
  },
};

export const ProfileEditTab = ({
  formData,
  onChange,
  onSave,
  saving,
  error,
  success,
}: ProfileEditTabProps) => (
  <Card sx={{ p: { xs: 2.5, md: 3 }, borderRadius: '16px' }}>
    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1F2937', mb: 0.5 }}>
      Informations personnelles
    </Typography>
    <Typography sx={{ fontSize: '14px', color: '#6B7280', mb: 3 }}>
      Modifiez vos informations de profil
    </Typography>

    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
          Nom complet
        </Typography>
        <TextField
          fullWidth
          value={`${formData.firstName} ${formData.lastName}`}
          disabled
          size="small"
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
          Email
        </Typography>
        <TextField
          fullWidth
          value={formData.email}
          disabled
          size="small"
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
          Téléphone
        </Typography>
        <TextField
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="+33 6 12 34 56 78"
          size="small"
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
          Localisation
        </Typography>
        <TextField
          fullWidth
          name="city"
          value={formData.city}
          onChange={onChange}
          placeholder="Paris, France"
          size="small"
          sx={inputSx}
        />
      </Box>

      <Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#374151', mb: 0.5 }}>
          Bio
        </Typography>
        <TextField
          fullWidth
          name="bio"
          value={formData.bio}
          onChange={onChange}
          placeholder="Parlez-nous de vous..."
          multiline
          rows={3}
          size="small"
          sx={inputSx}
        />
      </Box>

      <Button
        variant="contained"
        onClick={onSave}
        disabled={saving}
        sx={{
          mt: 1,
          py: 1.25,
          backgroundColor: '#22C55E',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
          alignSelf: 'flex-start',
          px: 4,
          '&:hover': { backgroundColor: '#16A34A' },
        }}
      >
        {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Enregistrer les modifications'}
      </Button>
    </Box>
  </Card>
);

export default ProfileEditTab;
