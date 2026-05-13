import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import styles from './Messages.module.css';

const Messages = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('messages')}</h1>
      <div className={styles.emptyState}>
        <div className={styles.iconCircle}>
          <MessageSquare size={48} />
        </div>
        <h2>{t('no_messages')}</h2>
        <p>{t('start_chatting')}</p>
      </div>
    </div>
  );
};

export default Messages;
