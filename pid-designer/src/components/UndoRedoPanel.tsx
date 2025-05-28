import styled from 'styled-components';

const UndoRedoPanelContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? '#e0e0e0' : '#3498db'};
  color: ${props => props.disabled ? '#999' : 'white'};
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#e0e0e0' : '#2980b9'};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

interface UndoRedoPanelProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function UndoRedoPanel({ canUndo, canRedo, onUndo, onRedo }: UndoRedoPanelProps) {
  return (
    <UndoRedoPanelContainer>
      <ActionButton 
        disabled={!canUndo} 
        onClick={canUndo ? onUndo : undefined}
        title="Undo (Ctrl+Z)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />
        </svg>
      </ActionButton>
      <ActionButton 
        disabled={!canRedo} 
        onClick={canRedo ? onRedo : undefined}
        title="Redo (Ctrl+Y)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z" />
        </svg>
      </ActionButton>
    </UndoRedoPanelContainer>
  );
}
