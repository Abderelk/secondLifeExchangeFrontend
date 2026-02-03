import { Link } from 'react-router-dom';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
}

export const AuthTabs = ({ activeTab }: AuthTabsProps) => (
  <div
    style={{
      display: 'flex',
      backgroundColor: '#E5E7EB',
      borderRadius: '9999px',
      padding: '4px',
      marginBottom: '16px',
    }}
  >
    <Link
      to="/login"
      style={{
        flex: 1,
        padding: '10px 24px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: activeTab === 'login' ? '#FFFFFF' : 'transparent',
        color: activeTab === 'login' ? '#1F2937' : '#6B7280',
        textDecoration: 'none',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: activeTab === 'login' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      Connexion
    </Link>
    <Link
      to="/register"
      style={{
        flex: 1,
        padding: '10px 24px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: activeTab === 'register' ? '#FFFFFF' : 'transparent',
        color: activeTab === 'register' ? '#1F2937' : '#6B7280',
        textDecoration: 'none',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: activeTab === 'register' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      Inscription
    </Link>
  </div>
);

export default AuthTabs;
