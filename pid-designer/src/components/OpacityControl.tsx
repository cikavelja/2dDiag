import styled from 'styled-components';

const OpacityControlContainer = styled.div`
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
`;

const ControlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ControlTitle = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Slider = styled.input`
  flex: 1;
`;

const ValueDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-size: 12px;
`;

interface OpacityControlProps {
  elementOpacity: number;
  setElementOpacity: (opacity: number) => void;
}

export function OpacityControl({ elementOpacity, setElementOpacity }: OpacityControlProps) {
  return (
    <OpacityControlContainer>
      <ControlHeader>
        <ControlTitle>Element Opacity</ControlTitle>
      </ControlHeader>
      <SliderContainer>        <Slider
          type="range"
          min={10}
          max={100}
          value={elementOpacity * 100}
          onChange={(e) => setElementOpacity(parseFloat(e.target.value) / 100)}
        />
        <ValueDisplay>{Math.round(elementOpacity * 100)}%</ValueDisplay>
      </SliderContainer>
    </OpacityControlContainer>
  );
}
