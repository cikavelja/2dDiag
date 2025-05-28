import styled from 'styled-components';

const GridControlsContainer = styled.div`
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleButton = styled.button<{ $isActive: boolean }>`
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: ${props => props.$isActive ? '#3498db' : 'white'};
  color: ${props => props.$isActive ? 'white' : '#333'};
  cursor: pointer;
  font-size: 12px;
    &:hover {
    background-color: ${props => props.$isActive ? '#2980b9' : '#f5f5f5'};
  }
`;

const RangeInput = styled.input`
  width: 100%;
`;

const ValueDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-size: 12px;
`;

interface GridSettingsProps {
  snapToGrid: boolean;
  setSnapToGrid: (value: boolean) => void;
  snapGrid: [number, number];
  setSnapGrid: (value: [number, number]) => void;
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
}

export function GridSettings({
  snapToGrid,
  setSnapToGrid,
  snapGrid,
  setSnapGrid,
  showGrid,
  setShowGrid
}: GridSettingsProps) {
  const handleGridSizeChange = (value: number) => {
    setSnapGrid([value, value]);
  };

  return (
    <GridControlsContainer>
      <ControlLabel>Grid Settings</ControlLabel>
      
      <ControlRow>        <ToggleButton 
          $isActive={showGrid} 
          onClick={() => setShowGrid(!showGrid)}
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </ToggleButton>
        
        <ToggleButton 
          $isActive={snapToGrid} 
          onClick={() => setSnapToGrid(!snapToGrid)}
        >
          {snapToGrid ? 'Disable Snap' : 'Enable Snap'}
        </ToggleButton>
      </ControlRow>
      
      <ControlRow>
        <span style={{ fontSize: '12px' }}>Grid Size:</span>
        <RangeInput
          type="range"
          min={5}
          max={50}
          step={5}
          value={snapGrid[0]}
          onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}
          disabled={!snapToGrid}
        />
        <ValueDisplay>{snapGrid[0]}px</ValueDisplay>
      </ControlRow>
    </GridControlsContainer>
  );
}
