import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toolbar } from './components/Toolbar';
import { PidCanvas } from './components/Canvas';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineNotification } from './components/OfflineNotification';
import styled from 'styled-components';
import './App.css'

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 50px; /* Space for header */
`;

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContainer>
        <Header>
          <h1>P&ID Designer</h1>
          <div>
            <span>Drag elements from the toolbar to the canvas to create your P&ID diagram</span>
          </div>
        </Header>
        
        <Content>
          <Toolbar />
          <PidCanvas />
        </Content>
        
        {/* PWA Components */}
        <PWAInstallPrompt />
        <OfflineNotification />
      </AppContainer>
    </DndProvider>
  );
}

export default App
