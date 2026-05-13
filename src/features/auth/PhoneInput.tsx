import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { auth } from '../../services/firebase';
import styles from './Auth.module.css';
import { ArrowLeft } from 'lucide-react';

interface PhoneInputProps {
  onCodeSent: (result: ConfirmationResult, phone: string) => void;
  onBack: () => void;
}

const PhoneInput = ({ onCodeSent, onBack }: PhoneInputProps) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('+265'); // Malawi country code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  }, []);

  const handleSendCode = async () => {
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      onCodeSent(result, phone);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.onboarding}>
      <button onClick={onBack} className={styles.backBtn}>
        <ArrowLeft size={24} />
      </button>

      <div className={styles.hero}>
        <h1>{t('login_title')}</h1>
        <p>{t('phone_number')}</p>
      </div>

      <input 
        type="tel" 
        className={styles.inputField} 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+265..."
      />

      {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

      <div id="recaptcha-container"></div>

      <button 
        className={styles.btnPrimary} 
        onClick={handleSendCode} 
        disabled={loading}
      >
        {loading ? '...' : t('send_otp')}
      </button>
    </div>
  );
};

export default PhoneInput;
