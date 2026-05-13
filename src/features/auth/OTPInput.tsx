import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ConfirmationResult } from 'firebase/auth';
import styles from './Auth.module.css';
import { ArrowLeft } from 'lucide-react';

interface OTPInputProps {
  phone: string;
  confirmationResult: ConfirmationResult;
  onBack: () => void;
}

const OTPInput = ({ phone, confirmationResult, onBack }: OTPInputProps) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (otp.length !== 6) return;

    setLoading(true);
    setError('');
    
    try {
      await confirmationResult.confirm(otp);
    } catch (err: any) {
      setError('Invalid code. Please try again.');
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
        <h1>{t('verify_otp')}</h1>
        <p>{t('enter_otp')}</p>
        <p><strong>{phone}</strong></p>
      </div>

      <input 
        type="number" 
        className={styles.inputField} 
        value={otp} 
        onChange={(e) => setOtp(e.target.value)}
        placeholder="123456"
        maxLength={6}
      />

      {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

      <button 
        className={styles.btnPrimary} 
        onClick={handleVerify} 
        disabled={loading || otp.length !== 6}
      >
        {loading ? '...' : t('verify_otp')}
      </button>
    </div>
  );
};

export default OTPInput;
