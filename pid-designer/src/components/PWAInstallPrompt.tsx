import { useState, useEffect } from 'react';
import styled from 'styled-components';

const InstallContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3498db;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const InstallButton = styled.button`
  background-color: white;
  color: #3498db;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f8f8;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
`;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // The deferredPrompt can only be used once
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    // Store in localStorage to prevent showing again in this session
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // If no prompt or user already dismissed, don't show anything
  if (!showPrompt || localStorage.getItem('pwa-install-dismissed') === 'true') {
    return null;
  }

  return (
    <InstallContainer>
      <span>Install P&ID Designer for offline use</span>
      <InstallButton onClick={handleInstall}>Install</InstallButton>
      <CloseButton onClick={dismissPrompt}>✕</CloseButton>
    </InstallContainer>
  );
}
