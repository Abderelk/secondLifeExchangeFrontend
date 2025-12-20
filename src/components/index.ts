// src/components/index.ts

// Layout
export { Header } from './layout/Header';
export { Footer } from './layout/Footer';
export { BottomNavigation } from './layout/BottomNavigation';

// Common
export { FloatingAddButton } from './common/FloatingAddButton';

// Home
export { WeeklyThemeBanner } from './home/WeeklyThemeBanner';
export type { WeeklyTheme } from './home/WeeklyThemeBanner';
export { StatsSection } from './home/StatsSection';
export type { StatItem } from './home/StatsSection';
export { AISuggestionsButton } from './home/AISuggestionsButton';

// Items
export { ItemCard } from './items/ItemCard';
export { ItemsGrid } from './items/ItemsGrid';
export type { Item } from './items/ItemCard';

// Exchange
export { ItemSelector } from './exchange/ItemSelector';
export { ExchangeRequestCard } from './exchange/ExchangeRequestCard';
export { ProposeExchangeModal } from './exchange/ProposeExchangeModal';

// Profile
export { ProfileHeader } from './profile/ProfileHeader';
export { ProfileStats } from './profile/ProfileStats';
export { UserItemsSection } from './profile/UserItemsSection';
export { ProfileMenu } from './profile/ProfileMenu';
export type { UserProfile } from './profile/ProfileHeader';
export type { UserStats } from './profile/ProfileStats';
export type { UserItem } from './profile/UserItemsSection';