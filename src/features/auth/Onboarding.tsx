import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Store } from 'lucide-react';
import styles from './Auth.module.css';
import type { Role } from '../../store/authStore';

interface OnboardingProps {
  onContinue: (role: Role) => void;
}

const Onboarding = ({ onContinue }: OnboardingProps) => {
  const { t, i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.onboarding}>
      <div className={styles.hero}>
        <div className={styles.logo}>BH</div>
        <h1>{t('welcome')}</h1>
        <p>{t('onboarding_subtitle')}</p>
      </div>

      <div className={styles.languageSection}>
        <label>{t('select_language')}</label>
        <div className={styles.buttonGroup}>
          <button
            className={i18n.language === 'en' ? styles.btnActive : styles.btnSecondary}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className={i18n.language === 'ny' ? styles.btnActive : styles.btnSecondary}
            onClick={() => changeLanguage('ny')}
          >
            Chichewa
          </button>
        </div>
      </div>

      <div className={styles.roleSection}>
        <label>{t('select_role')}</label>
        <div className={styles.roleCards}>
          <button
            className={`${styles.roleCard} ${selectedRole === 'buyer' ? styles.roleCardActive : ''}`}
            onClick={() => setSelectedRole('buyer')}
          >
            <div className={styles.roleIcon} style={{ background: selectedRole === 'buyer' ? 'var(--primary-gradient)' : 'rgba(204,85,0,0.08)' }}>
              <ShoppingCart size={26} color={selectedRole === 'buyer' ? 'white' : 'var(--primary)'} />
            </div>
            <span className={styles.roleTitle}>{t('role_buyer')}</span>
            <span className={styles.roleDesc}>{t('role_buyer_desc')}</span>
          </button>
          <button
            className={`${styles.roleCard} ${selectedRole === 'seller' ? styles.roleCardActive : ''}`}
            onClick={() => setSelectedRole('seller')}
          >
            <div className={styles.roleIcon} style={{ background: selectedRole === 'seller' ? 'var(--primary-gradient)' : 'rgba(204,85,0,0.08)' }}>
              <Store size={26} color={selectedRole === 'seller' ? 'white' : 'var(--primary)'} />
            </div>
            <span className={styles.roleTitle}>{t('role_seller')}</span>
            <span className={styles.roleDesc}>{t('role_seller_desc')}</span>
          </button>
        </div>
      </div>

      <button
        className={styles.btnPrimary}
        onClick={() => selectedRole && onContinue(selectedRole)}
        disabled={!selectedRole}
        style={{ opacity: selectedRole ? 1 : 0.45 }}
      >
        {t('continue')}
      </button>
    </div>
  );
};

export default Onboarding;
