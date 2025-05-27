import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Panel
} from 'reactflow';
import type { Edge, Connection, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
// Define interfaces directly here to avoid import issues
interface DragItem {
  type: string;
  label: string;
  svgPath?: string;
}
import { PIDElementNode, PipeNode, ValveNode, PumpNode, InstrumentNode } from './PIDNodes';

// Define node types
const nodeTypes = {
  pidElement: PIDElementNode,
  pipe: PipeNode,
  valve: ValveNode,
  pump: PumpNode,
  instrument: InstrumentNode
};

const CanvasContainer = styled.div`
  flex: 1;
  height: 100%;
  background-color: #fafbfc;
`;

// Removed unused CanvasControls component

export function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);  // Handle connecting nodes
  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      // Determine if this is a vertical connection (top/bottom) or horizontal (left/right)
      const sourceHandle = connection.sourceHandle || '';
      const targetHandle = connection.targetHandle || '';
      
      const isVertical = 
        sourceHandle.includes('top') || 
        sourceHandle.includes('bottom') || 
        targetHandle.includes('top') || 
        targetHandle.includes('bottom');
      
      // Set edge type based on connection orientation
      let edgeType = 'smoothstep';
      let color = '#333';
      
      // Vertical connections in green, horizontal in red
      if (isVertical) {
        color = '#2ecc71';  // Green for vertical connections
      } else {
        color = '#e74c3c';  // Red for horizontal connections
      }
        setEdges((eds) => addEdge({
        ...connection,
        type: edgeType,
        animated: false,
        className: isVertical ? 'vertical' : 'horizontal',
        style: { 
          stroke: color, 
          strokeWidth: 2 
        },
        data: { 
          isVertical,
          sourceHandle,
          targetHandle
        },
        selected: false
      }, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle dropping nodes onto canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const draggedData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Determine node type based on element category
      let nodeType = 'pidElement';
      if (draggedData.type.includes('pipe')) {
        nodeType = 'pipe';
      } else if (draggedData.type.includes('valve')) {
        nodeType = 'valve';
      } else if (draggedData.type.includes('pump')) {
        nodeType = 'pump';
      } else if (draggedData.type.includes('indicator')) {
        nodeType = 'instrument';
      }      const newNode: Node = {
        id: `${draggedData.type}-${Date.now()}`,
        type: nodeType,
        position,
        data: { 
          label: draggedData.label,
          type: draggedData.type,
          svgPath: draggedData.svgPath
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
  // DnD support
  const dropTargetRef = useRef(null);
  const [, drop] = useDrop({
    accept: 'PID_ELEMENT',
    drop: (item: DragItem, monitor) => {
      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      
      if (clientOffset) {
        const position = reactFlowInstance.project({
          x: clientOffset.x - reactFlowBounds.left,
          y: clientOffset.y - reactFlowBounds.top,
        });

        // Determine node type based on element category
        let nodeType = 'pidElement';
        if (item.type.includes('pipe')) {
          nodeType = 'pipe';
        } else if (item.type.includes('valve')) {
          nodeType = 'valve';
        } else if (item.type.includes('pump')) {
          nodeType = 'pump';
        } else if (item.type.includes('indicator')) {
          nodeType = 'instrument';
        }        const newNode: Node = {
          id: `${item.type}-${Date.now()}`,
          type: nodeType,
          position,
          data: { 
            label: item.label,
            type: item.type,
            svgPath: item.svgPath
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
  });
  
  // Save diagram
  const saveDiagram = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem('pid-diagram', JSON.stringify(flow));
      alert('Diagram saved successfully!');
    }
  };

  // Load saved diagram
  const loadSavedDiagram = () => {
    const savedFlow = localStorage.getItem('pid-diagram');
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      alert('Diagram loaded successfully!');
    } else {
      alert('No saved diagram found!');
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setEdges([]);
    }
  };
  // Apply the drop ref to the container
  useEffect(() => {
    if (dropTargetRef.current) {
      drop(dropTargetRef.current);
    }
  }, [drop]);

  return (
    <CanvasContainer ref={dropTargetRef}>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }} data-testid="canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapToGrid={true}
          snapGrid={[10, 10]}
          fitView
        >          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
          
          <Panel position="top-left">
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              padding: '12px', 
              borderRadius: '4px',
              marginBottom: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>How to Use:</p>
              <p style={{ margin: '0 0 6px 0' }}>• <b>Add elements</b>: Drag items from the toolbar to the canvas</p>
              <p style={{ margin: '0 0 6px 0' }}>• <b>Connect elements</b>: Drag from one connection point to another</p>
              <p style={{ margin: '0 0 6px 0' }}>• <b>Connection points</b>: Red dots (horizontal) and green dots (vertical)</p>
              <p style={{ margin: '0 0 6px 0' }}>• <b>Save/Load</b>: Use the buttons to save or load your diagram</p>
              <p style={{ margin: '0 0 6px 0' }}>• <b>Delete elements</b>: Select and press Delete key</p>
            </div>
          </Panel>
          
          <Panel position="top-right">
            <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
              <button onClick={saveDiagram} style={{ padding: '8px 12px' }}>Save Diagram</button>
              <button onClick={loadSavedDiagram} style={{ padding: '8px 12px' }}>Load Diagram</button>
              <button 
                onClick={clearCanvas} 
                style={{ padding: '8px 12px', backgroundColor: '#ffcccc' }}
              >
                Clear Canvas
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </CanvasContainer>
  );
}

// Wrap with provider
export function PidCanvas() {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
}
