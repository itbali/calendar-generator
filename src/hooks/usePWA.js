import { useEffect } from 'react';

export const usePWA = () => {
  useEffect(() => {
    // Регистрируем Service Worker только в production
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/calendar-generator/sw.js')
          .then(registration => {
            // eslint-disable-next-line no-console
            console.log('SW registered:', registration);

            // Проверяем обновления каждый час
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
          })
          .catch(error => {
            console.error('SW registration failed:', error);
          });
      });
    }
  }, []);
};
