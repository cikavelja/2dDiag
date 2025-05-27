import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

// Define interface directly here to avoid import issues
interface DragItem {
  type: string;      // must match NodeData.type
  label: string;
  svgPath?: string;  // SVG path for the element
}

const ItemContainer = styled.div`
  padding: 10px;
  margin: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: move;
  background-color: #f5f5f5;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ItemIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function ToolboxItem({ type, label, svgPath }: DragItem) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: 'PID_ELEMENT',
    item: { type, label, svgPath },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });
  
  // Apply the drag ref to the containerRef's current value
  useEffect(() => {
    if (containerRef.current) {
      dragRef(containerRef.current);
    }
  }, [dragRef]);

  return (
    <ItemContainer 
      ref={containerRef} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <ItemIcon>
        {svgPath ? (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d={svgPath} fill="currentColor" />
          </svg>
        ) : (
          <div style={{ width: 24, height: 24, backgroundColor: '#888', borderRadius: '50%' }} />
        )}
      </ItemIcon>
      {label}
    </ItemContainer>
  );
}
