import React, { useEffect, useState } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstallMessage, setShowInstallMessage] = useState(false);

  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);
  const isDesktop = () => /Windows|Macintosh|Linux/i.test(navigator.userAgent);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect if address bar install option is available for desktop users
    

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ User accepted the install prompt');
          setShowInstallMessage(false); // Hide the message after install prompt acceptance
        } else {
          console.log('❌ User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  // Hide the install button and message once installation is done or dismissed
  if (!showInstallButton && !showInstallMessage) return null;

  return (
    <div>
      {showInstallButton && (
        <button onClick={handleInstallClick} style={styles.button}>
          📲 Install App
        </button>
      )}
y
    </div>
  );
};

const styles = {
  button: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    padding: '10px 20px',
    backgroundColor: '#6200ee',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    zIndex: 1000,
  },
  message: {
    position: 'fixed',
    bottom: 80,
    right: 20,
    backgroundColor: '#ffcc00',
    padding: '10px 20px',
    color: '#000',
    borderRadius: 8,
    zIndex: 1000,
    fontSize: '14px',
  },
};

export default InstallPrompt;
