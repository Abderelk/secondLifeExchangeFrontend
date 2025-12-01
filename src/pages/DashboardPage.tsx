// src/pages/DashboardPage.tsx

import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Box,
  Chip,
  Avatar,
  LinearProgress
} from '@mui/material';
import { 
  Recycling, 
  SwapHoriz, 
  Inventory, 
  EmojiEvents,
  LocationOn,
  Email,
  Phone
} from '@mui/icons-material';
import { INTEREST_CATEGORIES } from '../types';

export const DashboardPage = () => {
  const { user } = useAuth();

  const impactLevel = user?.impactScore || 0;
  const impactPercentage = Math.min((impactLevel / 1000) * 100, 100);

  const stats = [
    { 
      title: 'Score Impact', 
      value: user?.impactScore || 0, 
      icon: Recycling, 
      color: 'bg-green-500',
      unit: 'pts'
    },
    { 
      title: 'Échanges réalisés', 
      value: user?.totalExchanges || 0, 
      icon: SwapHoriz, 
      color: 'bg-blue-500',
      unit: ''
    },
    { 
      title: 'Objets partagés', 
      value: user?.totalObjectsShared || 0, 
      icon: Inventory, 
      color: 'bg-purple-500',
      unit: ''
    },
  ];

  const getImpactLabel = (score: number): { 
    label: string; 
    color: 'default' | 'primary' | 'success' | 'warning' | 'error' 
  } => {
    if (score === 0) return { label: 'Débutant', color: 'default' };
    if (score < 100) return { label: 'Initié', color: 'primary' };
    if (score < 500) return { label: 'Engagé', color: 'success' };
    if (score < 1000) return { label: 'Expert', color: 'warning' };
    return { label: 'Champion', color: 'error' };
  };

  const impactBadge = getImpactLabel(impactLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Container maxWidth="lg" className="py-8">
        {/* En-tête du profil */}
        <Paper elevation={3} className="p-6 mb-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <Box className="flex items-start gap-6">
            <Avatar 
              sx={{ width: 100, height: 100, bgcolor: 'white', color: 'green' }}
              className="border-4 border-white"
            >
              <Typography variant="h3" className="font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Typography>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Typography variant="h4" className="font-bold">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Chip 
                  label={impactBadge.label}
                  color="primary"
                  icon={<EmojiEvents />}
                  size="small"
                />
              </div>
              
              {user?.bio && (
                <Typography variant="body1" className="opacity-90 mb-3">
                  {user.bio}
                </Typography>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Email fontSize="small" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone fontSize="small" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center gap-1">
                    <LocationOn fontSize="small" />
                    <span>{user.address.city}, {user.address.postalCode}</span>
                  </div>
                )}
              </div>
            </div>
          </Box>
        </Paper>

        {/* Score d'impact */}
        <Card className="mb-6 shadow-lg">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h6" className="font-bold text-gray-800">
                  🌱 Votre Impact Écologique
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Score: {impactLevel} points
                </Typography>
              </div>
              <Chip 
                label={impactBadge.label}
                color={impactBadge.color}
                icon={<Recycling />}
              />
            </div>
            <LinearProgress 
              variant="determinate" 
              value={impactPercentage} 
              className="h-3 rounded-full"
              sx={{
                backgroundColor: '#d1fae5',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#059669'
                }
              }}
            />
            <Typography variant="caption" className="text-gray-500 mt-2 block">
              {1000 - impactLevel} points pour atteindre le niveau Champion
            </Typography>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent>
                  <Box className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" className="font-bold">
                        {stat.value}{stat.unit}
                      </Typography>
                    </div>
                    <Box className={`${stat.color} p-4 rounded-full`}>
                      <IconComponent className="text-white" style={{ fontSize: 40 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Centres d'intérêt */}
        {user?.interests && user.interests.length > 0 && (
          <Card className="mb-6 shadow-lg">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-4 text-gray-800">
                📦 Vos centres d'intérêt
              </Typography>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => {
                  const category = INTEREST_CATEGORIES.find(c => c.value === interest);
                  return (
                    <Chip
                      key={interest}
                      label={category?.label || interest}
                      color="primary"
                      variant="outlined"
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activité récente */}
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h6" className="font-bold mb-4 text-gray-800">
              📅 Activité récente
            </Typography>
            <Box className="text-center py-12 text-gray-500">
              <Inventory style={{ fontSize: 64, opacity: 0.3 }} className="mb-4" />
              <Typography variant="body1">
                Aucune activité pour le moment
              </Typography>
              <Typography variant="body2" className="mt-2">
                Commencez par proposer votre premier objet à échanger !
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};