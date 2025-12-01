// src/pages/HomePage.tsx

import { useNavigate } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import { ArrowForward, Celebration } from '@mui/icons-material';

export const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🌱',
      title: 'Écologique',
      description: 'Réduisez votre empreinte carbone en donnant une seconde vie aux objets',
      gradient: 'from-emerald-400/20 to-green-400/20',
      iconBg: 'bg-emerald-100'
    },
    {
      icon: '💰',
      title: 'Économique',
      description: 'Économisez en échangeant au lieu d\'acheter neuf',
      gradient: 'from-blue-400/20 to-cyan-400/20',
      iconBg: 'bg-blue-100'
    },
    {
      icon: '👥',
      title: 'Communautaire',
      description: 'Rejoignez des milliers de passionnés d\'économie circulaire',
      gradient: 'from-purple-400/20 to-pink-400/20',
      iconBg: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      {/* Hero Section */}
      <Container maxWidth="lg" className="pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-emerald-200">
            <Celebration fontSize="small" />
            <span>Rejoignez 5000+ membres engagés</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Donnez une
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600"> seconde vie </span>
            à vos objets
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Échangez, partagez et contribuez à un avenir plus durable avec notre plateforme d'économie circulaire
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              style={{ 
                backgroundColor: '#059669',
                borderRadius: '12px',
                textTransform: 'none'
              }}
              endIcon={<ArrowForward />}
            >
              Créer mon compte gratuit
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-base font-semibold"
              style={{ 
                borderColor: '#059669',
                color: '#059669',
                borderRadius: '12px',
                borderWidth: '2px',
                textTransform: 'none'
              }}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" className="py-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" className="py-24">
        <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-12 md:p-16 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-12 text-center text-white">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-3">5000+</div>
              <div className="text-emerald-100 text-lg">Membres actifs</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-3">12K+</div>
              <div className="text-emerald-100 text-lg">Objets échangés</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-3">8t</div>
              <div className="text-emerald-100 text-lg">Déchets évités</div>
            </div>
          </div>
        </div>
      </Container>

      {/* How it works */}
      <Container maxWidth="lg" className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trois étapes simples pour commencer à échanger
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Créez votre compte', desc: 'Inscrivez-vous gratuitement en quelques minutes', icon: '📝' },
            { step: '2', title: 'Proposez vos objets', desc: 'Ajoutez des photos et descriptions de vos objets', icon: '📸' },
            { step: '3', title: 'Échangez', desc: 'Trouvez des objets qui vous intéressent et échangez', icon: '🤝' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                {item.icon}
              </div>
              <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" className="py-24 pb-32">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 md:p-16 text-center border border-purple-100">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Rejoignez notre communauté et participez à la construction d'un avenir plus durable
          </p>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: '#059669',
              borderRadius: '12px',
              textTransform: 'none'
            }}
            endIcon={<ArrowForward />}
          >
            Commencer maintenant
          </Button>
        </div>
      </Container>
    </div>
  );
};