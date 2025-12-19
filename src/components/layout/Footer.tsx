// src/components/layout/Footer.tsx

import { Box, Container, Typography } from '@mui/material';
import { Description, Article } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface FooterLinkProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const FooterLink = ({ label, icon, onClick }: FooterLinkProps) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: '#9CA3AF',
      fontSize: '14px',
      cursor: 'pointer',
      '&:hover': { color: '#FFFFFF' },
    }}
  >
    {icon}
    {label}
  </Box>
);

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#1F2937', color: '#FFFFFF', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, mb: 4 }}>
          {/* Logo & Description */}
          <Box>
            <img
              src="/logo.jpeg"
              alt="SecondLife Exchange"
              style={{ height: '50px', borderRadius: '8px', marginBottom: '16px' }}
            />
            <Typography sx={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>
              Plateforme d'échange d'objets de seconde main pour une consommation responsable et une économie circulaire.
            </Typography>
          </Box>

          {/* Navigation */}
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink label="Accueil" onClick={() => navigate('/home')} />
              <FooterLink label="Calendrier" onClick={() => navigate('/calendar')} />
              <FooterLink label="Messages" onClick={() => navigate('/messages')} />
            </Box>
          </Box>

          {/* Légal */}
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>
              Légal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FooterLink
                label="Politique de confidentialité"
                icon={<Description sx={{ fontSize: 16 }} />}
                onClick={() => navigate('/privacy')}
              />
              <FooterLink
                label="CGU"
                icon={<Article sx={{ fontSize: 16 }} />}
                onClick={() => navigate('/terms')}
              />
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 2 }}>
              Contact
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#9CA3AF', mb: 1 }}>
              contact@secondlifeexchange.com
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#9CA3AF', mb: 2 }}>
              Paris, France
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography sx={{ fontSize: '14px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#FFFFFF' } }}>
                Facebook
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#FFFFFF' } }}>
                Twitter
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#9CA3AF', cursor: 'pointer', '&:hover': { color: '#FFFFFF' } }}>
                Instagram
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box sx={{ borderTop: '1px solid #374151', pt: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: '#9CA3AF' }}>
            © {new Date().getFullYear()} SecondLifeExchange. Tous droits réservés. Plateforme dédiée à l'économie circulaire.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;