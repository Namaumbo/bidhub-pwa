import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, Moon, Sun, ShoppingBag, Settings, User as UserIcon, ChevronRight, Star } from 'lucide-react';
import { auth } from '../../services/firebase';
import { useAuthStore } from '../../store/authStore';
import styles from './Profile.module.css';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {user?.photoURL ? <img src={user.photoURL} alt="avatar" /> : <UserIcon size={36} />}
        </div>
        <div className={styles.userInfo}>
          <h2>{user?.displayName || user?.phoneNumber || 'User'}</h2>
          <p>{t('joined')} {new Date(user?.metadata.creationTime || Date.now()).toLocaleDateString()}</p>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>12</span>
          <span className={styles.statLabel}>{t('active_listings')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>34</span>
          <span className={styles.statLabel}>Sold</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}><Star size={14} style={{display:'inline', verticalAlign:'middle'}} fill="currentColor" /> 4.8</span>
          <span className={styles.statLabel}>Rating</span>
        </div>
      </div>

      <div className={styles.menu}>
        <button className={styles.menuItem}>
          <ShoppingBag size={20} />
          <span>{t('my_listings')}</span>
          <ChevronRight size={16} color="var(--text-secondary)" />
        </button>
        <button className={styles.menuItem}>
          <Settings size={20} />
          <span>{t('settings')}</span>
          <ChevronRight size={16} color="var(--text-secondary)" />
        </button>
        <div className={styles.menuItem}>
          <div className={styles.menuItemLeft}>
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            <span style={{ marginLeft: 'var(--spacing-md)' }}>{t('dark_mode')}</span>
          </div>
          <label className={styles.switch}>
            <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
          <LogOut size={20} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
