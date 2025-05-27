import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import styled from 'styled-components';

const NodeContainer = styled.div`
  padding: 4px;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: transparent;
`;

const ElementSvg = styled.svg`
  stroke: #222;
  stroke-width: 2;
  fill: none;
`;

// Basic P&ID element node
export const PIDElementNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="40" height="40" viewBox="0 0 24 24">
        <path d={data.svgPath || 'M12 12 m-8 0 a8 8 0 1,0 16 0 a8 8 0 1,0 -16 0'} />
      </ElementSvg>
    </NodeContainer>
  );
});

// Pipe node that can connect in 4 directions
export const PipeNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
        <ElementSvg width="40" height="40" viewBox="0 0 24 24">
        {data.svgPath ? (
          <path d={data.svgPath} />
        ) : (
          <>
            {/* Cross shape to indicate 4-way connection */}
            <path d="M2 12 H22" />
            <path d="M12 2 V22" />
          </>
        )}
      </ElementSvg>
    </NodeContainer>
  );
});

// Valve node
export const ValveNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer style={{ width: '60px' }}>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="60" height="40" viewBox="0 0 32 24">
        <path d={data.svgPath || 'M2 12 H8 L12 6 L16 18 L20 6 L24 18 H30'} />
      </ElementSvg>
    </NodeContainer>
  );
});

// Pump node
export const PumpNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer style={{ width: '60px' }}>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="60" height="40" viewBox="0 0 24 24">
        <path d={data.svgPath || 'M12,12 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M4 12 H0 M20 12 H24'} />
      </ElementSvg>
    </NodeContainer>
  );
});

// Instrument node
export const InstrumentNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="40" height="40" viewBox="0 0 24 24">
        <path d={data.svgPath} />
        <text 
          x="12" 
          y="12" 
          textAnchor="middle" 
          dominantBaseline="middle"
          fill="#222"
          fontSize="6px"
        >
          {data.label.substr(0, 2).toUpperCase()}
        </text>
      </ElementSvg>
    </NodeContainer>
  );
});
