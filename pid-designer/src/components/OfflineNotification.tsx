import { useState, useEffect } from 'react';
import styled from 'styled-components';

const OfflineBannerContainer = styled.div<{ isOffline: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: ${props => props.isOffline ? '#e74c3c' : '#27ae60'};
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: 500;
  z-index: 1000;
  transform: translateY(${props => props.isOffline ? '0' : '-100%'});
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

export function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;
  
  return (
    <OfflineBannerContainer isOffline={isOffline}>
      {isOffline
        ? 'You are offline. Changes will be saved locally.'
        : 'You are back online!'
      }
    </OfflineBannerContainer>
  );
}
