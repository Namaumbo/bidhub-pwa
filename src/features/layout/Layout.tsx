import { Outlet, NavLink } from 'react-router-dom';
import { Home, Plus, MessageCircle, User, Grid, Gavel } from 'lucide-react';
import styles from './Layout.module.css';
import { useTranslation } from 'react-i18next';
import type { Role } from '../../store/authStore';

interface LayoutProps {
  role: Role;
}

const Layout = ({ role }: LayoutProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <main className={`${styles.main} animate-fade-in`}>
        <Outlet />
      </main>
      <nav className={styles.bottomNav}>
        {role === 'buyer' ? (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <Home size={22} />
              <span>{t('home')}</span>
            </NavLink>
            <NavLink to="/bids-overview" className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <Gavel size={22} />
              <span>{t('bids')}</span>
            </NavLink>
            <NavLink to="/post-request" className={({ isActive }) =>
              `${styles.sellNavItem}${isActive ? ` ${styles.activeSell}` : ''}`
            }>
              <div className={styles.sellBtn}>
                <Plus size={26} color="white" strokeWidth={2.5} />
              </div>
              <span>{t('post')}</span>
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <MessageCircle size={22} />
              <span>{t('messages')}</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <User size={22} />
              <span>{t('profile')}</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <Grid size={22} />
              <span>{t('browse')}</span>
            </NavLink>
            <NavLink to="/my-bids" className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <Gavel size={22} />
              <span>{t('my_bids')}</span>
            </NavLink>
            <div className={styles.sellNavItem}>
              <div className={styles.sellBtnInert} />
            </div>
            <NavLink to="/messages" className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <MessageCircle size={22} />
              <span>{t('messages')}</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? styles.active : styles.navItem}>
              <User size={22} />
              <span>{t('profile')}</span>
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Layout;
