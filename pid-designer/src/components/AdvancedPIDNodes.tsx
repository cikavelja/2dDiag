import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import styled from 'styled-components';

const NodeContainer = styled.div`
  padding: 4px;
  border-radius: 4px;
  width: 50px;
  height: 50px;
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

const LabelText = styled.div`
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  white-space: nowrap;
  color: #555;
  font-weight: 500;
  user-select: none;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 1px 4px;
  border-radius: 2px;
`;

// Heat Exchanger Node
export const HeatExchangerNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="50" height="50" viewBox="0 0 50 50">
        <rect x="5" y="15" width="40" height="20" />
        <line x1="5" y1="15" x2="45" y2="35" />
        <line x1="5" y1="35" x2="45" y2="15" />
      </ElementSvg>
      
      {data.label && <LabelText>{data.label}</LabelText>}
    </NodeContainer>
  );
});

// Tank Node
export const TankNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="50" height="50" viewBox="0 0 50 50">
        <path d="M15,10 L35,10 L35,40 L15,40 L15,10 Z" />
        <path d="M15,10 A10,5 0 0,1 35,10" />
        <path d="M15,40 A10,5 0 0,0 35,40" />
      </ElementSvg>
      
      {data.label && <LabelText>{data.label}</LabelText>}
    </NodeContainer>
  );
});

// Compressor Node
export const CompressorNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="15" />
        <path d="M10,25 L40,25" />
        <path d="M25,10 L25,40" />
      </ElementSvg>
      
      {data.label && <LabelText>{data.label}</LabelText>}
    </NodeContainer>
  );
});

// Control Valve Node
export const ControlValveNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="50" height="50" viewBox="0 0 50 50">
        <path d="M5,25 L15,25" />
        <path d="M35,25 L45,25" />
        <path d="M15,10 L35,40" />
        <path d="M25,5 L25,20" />
      </ElementSvg>
      
      {data.label && <LabelText>{data.label}</LabelText>}
    </NodeContainer>
  );
});

// Reactor Node
export const ReactorNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="50" height="50" viewBox="0 0 50 50">
        <rect x="10" y="10" width="30" height="30" rx="5" />
        <circle cx="25" cy="25" r="5" />
        <path d="M10,25 L40,25" stroke-dasharray="2,2" />
        <path d="M25,10 L25,40" stroke-dasharray="2,2" />
      </ElementSvg>
      
      {data.label && <LabelText>{data.label}</LabelText>}
    </NodeContainer>
  );
});

// Column Node
export const ColumnNode = memo(({ data }: NodeProps) => {
  return (
    <NodeContainer>
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#e74c3c' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#e74c3c' }} />
      <Handle id="top" type="target" position={Position.Top} style={{ background: '#2ecc71' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#2ecc71' }} />
      
      <ElementSvg width="50" height="50" viewBox="0 0 50 50">
        <path d="M20,5 L30,5 L30,45 L20,45 L20,5 Z" />
        <path d="M20,15 L30,15" />
        <path d="M20,25 L30,25" />
        <path d="M20,35 L30,35" />
      </ElementSvg>
      
      {data.label && <LabelText>{data.label}</LabelText>}
    </NodeContainer>
  );
});

// Label Node for annotations
export const LabelNode = memo(({ data }: NodeProps) => {
  return (
    <div style={{ 
      padding: '8px 10px',
      borderRadius: '4px',
      border: '1px dashed #999',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      maxWidth: '150px',
      position: 'relative'
    }}>
      <div style={{
        fontSize: data.fontSize || '12px',
        fontWeight: data.bold ? 'bold' : 'normal',
        color: data.color || '#333',
        textAlign: 'center',
        wordBreak: 'break-word'
      }}>
        {data.text || 'Label'}
      </div>
      
      <Handle
        id="label-handle"
        type="source"
        position={Position.Right}
        style={{ right: '-8px', background: '#999', visibility: 'hidden' }}
      />
    </div>
  );
});
