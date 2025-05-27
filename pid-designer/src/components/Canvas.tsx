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
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  // Add state to control instructions panel visibility
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  // Add state for selected edges
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);

  // Handle connecting nodes
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
  
  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    
    // Toggle selection of the edge
    setSelectedEdges(prevSelectedEdges => {
      const isSelected = prevSelectedEdges.some(e => e.id === edge.id);
      
      // Update edge styling based on selection state
      setEdges(eds => eds.map(e => {
        if (e.id === edge.id) {
          return {
            ...e,
            selected: !isSelected,
            style: {
              ...e.style,
              strokeWidth: !isSelected ? 3 : 2,
              stroke: !isSelected ? '#ff0000' : e.data?.isVertical ? '#2ecc71' : '#e74c3c'
            }
          };
        }
        return e;
      }));
      
      if (isSelected) {
        // Deselect the edge
        return prevSelectedEdges.filter(e => e.id !== edge.id);
      } else {
        // Select the edge
        return [...prevSelectedEdges, edge];
      }
    });
  }, [setSelectedEdges, setEdges]);
  
  // Handle edge deletion with Delete/Backspace key
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selectedEdges.length > 0) {
      // Remove all selected edges
      setEdges(edges => edges.filter(edge => !selectedEdges.some(selectedEdge => selectedEdge.id === edge.id)));
      setSelectedEdges([]);
    }
  }, [selectedEdges, setEdges, setSelectedEdges]);
  
  // Handle click on the canvas/pane to deselect edges
  const onPaneClick = useCallback(() => {
    // Reset all edge styles and clear selection
    setEdges(eds => eds.map(e => ({
      ...e,
      selected: false,
      style: {
        ...e.style,
        strokeWidth: 2,
        stroke: e.data?.isVertical ? '#2ecc71' : '#e74c3c'
      }
    })));
    setSelectedEdges([]);
  }, [setEdges, setSelectedEdges]);

  return (
    <CanvasContainer ref={dropTargetRef}>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }} data-testid="canvas">        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          onEdgeClick={onEdgeClick}
          onKeyDown={onKeyDown}
          onPaneClick={onPaneClick}
          connectionLineType={ConnectionLineType.SmoothStep}
          snapToGrid={true}
          snapGrid={[10, 10]}
          fitView
          edgesFocusable={true}
          selectNodesOnDrag={false}
        >          <Background color="#aaa" gap={16} />
          <Controls />
          <MiniMap />
            <Panel position="top-left">
            {showInstructions && (
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                padding: '12px', 
                borderRadius: '4px',
                marginBottom: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                position: 'relative'
              }}>
                <button 
                  onClick={() => setShowInstructions(false)} 
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                  }}
                >
                  ✕
                </button>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>How to Use:</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Add elements</b>: Drag items from the toolbar to the canvas</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Connect elements</b>: Drag from one connection point to another</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Connection points</b>: Red dots (horizontal) and green dots (vertical)</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Connection removal</b>: Click on connection and press Delete key</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Save/Load</b>: Use the buttons to save or load your diagram</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Delete elements</b>: Select and press Delete key</p>
              </div>
            )}
            {!showInstructions && (
              <button 
                onClick={() => setShowInstructions(true)} 
                style={{
                  padding: '8px 12px',
                  margin: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
              >
                Show Instructions
              </button>
            )}
          </Panel>
          
          <Panel position="top-right">            <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
              <button onClick={saveDiagram} style={{ padding: '8px 12px' }}>Save Diagram</button>
              <button onClick={loadSavedDiagram} style={{ padding: '8px 12px' }}>Load Diagram</button>
              <button 
                onClick={() => {
                  if (selectedEdges.length > 0) {
                    setEdges(edges => edges.filter(edge => !selectedEdges.some(selectedEdge => selectedEdge.id === edge.id)));
                    setSelectedEdges([]);
                  }
                }} 
                style={{ 
                  padding: '8px 12px',
                  backgroundColor: selectedEdges.length > 0 ? '#ff9999' : '#dddddd',
                  cursor: selectedEdges.length > 0 ? 'pointer' : 'not-allowed'
                }}
                disabled={selectedEdges.length === 0}
              >
                Delete Selected
              </button>
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
