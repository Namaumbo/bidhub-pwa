import { useState } from 'react';
import Onboarding from './Onboarding';
import PhoneInput from './PhoneInput';
import OTPInput from './OTPInput';
import type { ConfirmationResult } from 'firebase/auth';
import type { Role } from '../../store/authStore';
import { useAuthStore } from '../../store/authStore';

type Step = 'onboarding' | 'phone' | 'otp';

const AuthFlow = () => {
  const [step, setStep] = useState<Step>('onboarding');
  const [phone, setPhone] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const { setRole } = useAuthStore();

  const handleRoleSelected = (role: Role) => {
    setRole(role);
    setStep('phone');
  };

  const handleCodeSent = (result: ConfirmationResult, phoneNumber: string) => {
    setConfirmationResult(result);
    setPhone(phoneNumber);
    setStep('otp');
  };

  const handleBack = () => {
    if (step === 'otp') setStep('phone');
    else if (step === 'phone') setStep('onboarding');
  };

  return (
    <div style={{ padding: 'var(--spacing-lg)', maxWidth: '500px', margin: '0 auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {step === 'onboarding' && <Onboarding onContinue={handleRoleSelected} />}
      {step === 'phone' && <PhoneInput onCodeSent={handleCodeSent} onBack={handleBack} />}
      {step === 'otp' && confirmationResult && (
        <OTPInput
          phone={phone}
          confirmationResult={confirmationResult}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default AuthFlow;
