import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

export const PageHeader = ({ title, onBack }: PageHeaderProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
    <IconButton onClick={onBack}>
      <ArrowBack />
    </IconButton>
    <Typography variant="h5" fontWeight={700} color="#1F2937">
      {title}
    </Typography>
  </Box>
);

export default PageHeader;
