export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  interests: string[];
  bio?: string;
  avatar?: string;
  impactScore: number;
  totalExchanges: number;
  totalObjectsShared: number;
  notifications: {
    email: boolean;
    weeklyTheme: boolean;
    newMessages: boolean;
    exchangeUpdates: boolean;
  };
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address: {
    street?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  interests: string[];
  bio?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

export const INTEREST_CATEGORIES = [
  { value: 'vêtements', label: '👕 Vêtements', icon: '👕' },
  { value: 'électronique', label: '📱 Électronique', icon: '📱' },
  { value: 'livres', label: '📚 Livres', icon: '📚' },
  { value: 'meubles', label: '🪑 Meubles', icon: '🪑' },
  { value: 'décoration', label: '🎨 Décoration', icon: '🎨' },
  { value: 'jouets', label: '🧸 Jouets', icon: '🧸' },
  { value: 'sport', label: '⚽ Sport', icon: '⚽' },
  { value: 'outils', label: '🔧 Outils', icon: '🔧' },
  { value: 'cuisine', label: '🍳 Cuisine', icon: '🍳' },
  { value: 'jardin', label: '🌱 Jardin', icon: '🌱' },
  { value: 'multimédia', label: '🎮 Multimédia', icon: '🎮' },
  { value: 'autre', label: '📦 Autre', icon: '📦' }
];

export interface ApiItem {
  _id: string;
  title: string;
  images?: string[];
  category: string;
  status: 'available' | 'pending' | 'exchanged';
}
