import { ToolboxItem } from './DragItem';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  width: 220px;
  border-right: 1px solid #ddd;
  padding: 16px;
  background-color: #fafafa;
  height: 100%;
  overflow-y: auto;
`;

const ToolbarSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  color: #333;
`;

// Define P&ID elements with SVG paths
const pipeElements = [
  { type: 'straight-pipe', label: 'Straight Pipe', svgPath: 'M2 12 H22' },
  { type: 'elbow-pipe', label: 'Elbow Pipe', svgPath: 'M2 22 V12 H22' },
  { type: 'tee-pipe', label: 'Tee Pipe', svgPath: 'M2 12 H22 M12 12 V22' }
];

const valveElements = [
  { type: 'gate-valve', label: 'Gate Valve', svgPath: 'M2 12 H8 L12 6 L16 18 L20 6 L24 18 H30' },
  { type: 'globe-valve', label: 'Globe Valve', svgPath: 'M2 12 H8 M16 12 H22 M8 12 L12 7 L16 12' },
  { type: 'check-valve', label: 'Check Valve', svgPath: 'M2 12 H8 M16 12 H22 M12 6 L12 18' }
];

const pumpElements = [
  { type: 'centrifugal-pump', label: 'Centrifugal Pump', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M4 12 H0 M20 12 H24' },
  { type: 'positive-displacement', label: 'PD Pump', svgPath: 'M4,8 h16 v8 h-16 z M4 12 H0 M20 12 H24' }
];

const instrumentElements = [
  { type: 'pressure-indicator', label: 'Pressure Indicator', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M6 12 H18 M6 8 L18 16' },
  { type: 'temperature-indicator', label: 'Temperature Indicator', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M12 4 V14 M8 14 H16' },
  { type: 'flow-indicator', label: 'Flow Indicator', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M6 12 H18 M15 9 L18 12 L15 15' }
];

export function Toolbar() {
  return (
    <ToolbarContainer>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>P&ID Elements</h2>
      
      <ToolbarSection>
        <SectionTitle>Pipes</SectionTitle>
        {pipeElements.map(item => (
          <ToolboxItem key={item.type} {...item} />
        ))}
      </ToolbarSection>
      
      <ToolbarSection>
        <SectionTitle>Valves</SectionTitle>
        {valveElements.map(item => (
          <ToolboxItem key={item.type} {...item} />
        ))}
      </ToolbarSection>
      
      <ToolbarSection>
        <SectionTitle>Pumps</SectionTitle>
        {pumpElements.map(item => (
          <ToolboxItem key={item.type} {...item} />
        ))}
      </ToolbarSection>
      
      <ToolbarSection>
        <SectionTitle>Instruments</SectionTitle>
        {instrumentElements.map(item => (
          <ToolboxItem key={item.type} {...item} />
        ))}
      </ToolbarSection>
    </ToolbarContainer>
  );
}
