import { ToolboxItem } from './DragItem';
import styled from 'styled-components';
import { useState } from 'react';

const ToolbarContainer = styled.div`
  width: 250px;
  border-right: 1px solid #ddd;
  padding: 16px;
  background-color: #fafafa;
  height: 100%;
  overflow-y: auto;
`;

const ToolbarSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3<{ $isExpanded?: boolean }>`
  font-size: 16px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:after {
    content: "${props => props.$isExpanded ? '▼' : '►'}";
    font-size: 12px;
    color: #666;
  }
`;

const CollapsibleContent = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
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
  { type: 'check-valve', label: 'Check Valve', svgPath: 'M2 12 H8 M16 12 H22 M12 6 L12 18' },
  { type: 'control-valve', label: 'Control Valve', nodeType: 'controlValve' }
];

const pumpElements = [
  { type: 'centrifugal-pump', label: 'Centrifugal Pump', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M4 12 H0 M20 12 H24' },
  { type: 'positive-displacement', label: 'PD Pump', svgPath: 'M4,8 h16 v8 h-16 z M4 12 H0 M20 12 H24' },
  { type: 'compressor', label: 'Compressor', nodeType: 'compressor' }
];

const instrumentElements = [
  { type: 'pressure-indicator', label: 'Pressure Indicator', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M6 12 H18 M6 8 L18 16' },
  { type: 'temperature-indicator', label: 'Temperature Indicator', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M12 4 V14 M8 14 H16' },
  { type: 'flow-indicator', label: 'Flow Indicator', svgPath: 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M6 12 H18 M15 9 L18 12 L15 15' }
];

const equipmentElements = [
  { type: 'heat-exchanger', label: 'Heat Exchanger', nodeType: 'heatExchanger' },
  { type: 'tank', label: 'Tank', nodeType: 'tank' },
  { type: 'reactor', label: 'Reactor', nodeType: 'reactor' },
  { type: 'column', label: 'Column', nodeType: 'column' }
];

const annotationElements = [
  { 
    type: 'label', 
    label: 'Text Label', 
    nodeType: 'label',
    data: { text: 'Label Text', fontSize: '12px', bold: false, color: '#333' }
  }
];

export function Toolbar() {
  const [expandedSections, setExpandedSections] = useState({
    pipes: true,
    valves: true,
    pumps: true,
    instruments: true,
    equipment: true,
    annotations: true
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <ToolbarContainer>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>P&ID Elements</h2>
      
      <ToolbarSection>        <SectionTitle 
          onClick={() => toggleSection('pipes')} 
          $isExpanded={expandedSections.pipes}
        >
          Pipes
        </SectionTitle>
        <CollapsibleContent $isExpanded={expandedSections.pipes}>
          {pipeElements.map(item => (
            <ToolboxItem key={item.type} {...item} />
          ))}
        </CollapsibleContent>
      </ToolbarSection>
      
      <ToolbarSection>        <SectionTitle 
          onClick={() => toggleSection('valves')} 
          $isExpanded={expandedSections.valves}
        >
          Valves
        </SectionTitle>
        <CollapsibleContent $isExpanded={expandedSections.valves}>
          {valveElements.map(item => (
            <ToolboxItem key={item.type} {...item} />
          ))}
        </CollapsibleContent>
      </ToolbarSection>
      
      <ToolbarSection>        <SectionTitle 
          onClick={() => toggleSection('pumps')} 
          $isExpanded={expandedSections.pumps}
        >
          Pumps
        </SectionTitle>
        <CollapsibleContent $isExpanded={expandedSections.pumps}>
          {pumpElements.map(item => (
            <ToolboxItem key={item.type} {...item} />
          ))}
        </CollapsibleContent>
      </ToolbarSection>
      
      <ToolbarSection>        <SectionTitle 
          onClick={() => toggleSection('instruments')} 
          $isExpanded={expandedSections.instruments}
        >
          Instruments
        </SectionTitle>
        <CollapsibleContent $isExpanded={expandedSections.instruments}>
          {instrumentElements.map(item => (
            <ToolboxItem key={item.type} {...item} />
          ))}
        </CollapsibleContent>
      </ToolbarSection>
      
      <ToolbarSection>        <SectionTitle 
          onClick={() => toggleSection('equipment')} 
          $isExpanded={expandedSections.equipment}
        >
          Equipment
        </SectionTitle>        <CollapsibleContent $isExpanded={expandedSections.equipment}>
          {equipmentElements.map(item => (
            <ToolboxItem key={item.type} {...item} />
          ))}
        </CollapsibleContent>
      </ToolbarSection>
      
      <ToolbarSection>        <SectionTitle 
          onClick={() => toggleSection('annotations')} 
          $isExpanded={expandedSections.annotations}
        >
          Annotations
        </SectionTitle>
        <CollapsibleContent $isExpanded={expandedSections.annotations}>
          {annotationElements.map(item => (
            <ToolboxItem key={item.type} {...item} />
          ))}
        </CollapsibleContent>
      </ToolbarSection>
    </ToolbarContainer>
  );
}
