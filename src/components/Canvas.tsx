import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
import type { Edge, Connection, Node, ReactFlowInstance } from 'reactflow';
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
import { 
  HeatExchangerNode, 
  TankNode, 
  CompressorNode, 
  ControlValveNode, 
  ReactorNode, 
  ColumnNode,
  LabelNode
} from './AdvancedPIDNodes';
import { DiagramManager } from './DiagramManager';
import { ExportPanel } from './ExportPanel';
import { GridSettings } from './GridSettings';
import { OpacityControl } from './OpacityControl';
import { UndoRedoPanel } from './UndoRedoPanel';

// Define node types outside of component (to avoid recreation on each render)
const defaultNodeTypes = {
  pidElement: PIDElementNode,
  pipe: PipeNode,
  valve: ValveNode,
  pump: PumpNode,
  instrument: InstrumentNode,
  heatExchanger: HeatExchangerNode,
  tank: TankNode,
  compressor: CompressorNode,
  controlValve: ControlValveNode,
  reactor: ReactorNode,
  column: ColumnNode,  label: LabelNode
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
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  // Add state to control instructions panel visibility
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  // Add state for selected edges
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  // Add state for grid settings
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [snapGrid, setSnapGrid] = useState<[number, number]>([15, 15]);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  // Add state for element opacity
  const [elementOpacity, setElementOpacity] = useState<number>(1.0);
  // Add undo/redo functionality
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [undoRedoStack, setUndoRedoStack] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [currentStackIndex, setCurrentStackIndex] = useState<number>(-1);

  // Memoize nodeTypes to prevent recreation on each render
  const nodeTypes = useMemo(() => defaultNodeTypes, []);

  // Add state change to the undo stack
  const addToUndoStack = useCallback(() => {
    // Only add to undo stack if there are changes
    if (nodes.length > 0 || edges.length > 0) {
      const newState = { nodes: [...nodes], edges: [...edges] };
      
      // If we're not at the end of the stack, truncate it
      if (currentStackIndex < undoRedoStack.length - 1) {
        setUndoRedoStack(prev => prev.slice(0, currentStackIndex + 1).concat(newState));
      } else {
        setUndoRedoStack(prev => [...prev, newState]);
      }
      
      setCurrentStackIndex(prev => prev + 1);
      setCanUndo(true);
      setCanRedo(false);
    }
  }, [nodes, edges, currentStackIndex, undoRedoStack]);

  // Handle undo action
  const handleUndo = useCallback(() => {
    if (currentStackIndex > 0) {
      const prevState = undoRedoStack[currentStackIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setCurrentStackIndex(prev => prev - 1);
      setCanRedo(true);
      
      if (currentStackIndex - 1 === 0) {
        setCanUndo(false);
      }
    }
  }, [currentStackIndex, undoRedoStack, setNodes, setEdges]);

  // Handle redo action
  const handleRedo = useCallback(() => {
    if (currentStackIndex < undoRedoStack.length - 1) {
      const nextState = undoRedoStack[currentStackIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentStackIndex(prev => prev + 1);
      setCanUndo(true);
      
      if (currentStackIndex + 1 === undoRedoStack.length - 1) {
        setCanRedo(false);
      }
    }
  }, [currentStackIndex, undoRedoStack, setNodes, setEdges]);

  // Initialize undo stack with empty state
  useEffect(() => {
    if (undoRedoStack.length === 0) {
      setUndoRedoStack([{ nodes: [], edges: [] }]);
      setCurrentStackIndex(0);
    }
  }, [undoRedoStack]);
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if target is an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Undo: Ctrl+Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((event.ctrlKey || event.metaKey) && 
          (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
        event.preventDefault();
        handleRedo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);
  
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
      event.preventDefault();      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      
      // Safely parse the data with error handling
      let draggedData;
      try {
        const dataString = event.dataTransfer.getData('application/reactflow');
        draggedData = dataString ? JSON.parse(dataString) : null;
      } catch (error) {
        console.error('Error parsing drag data:', error);
        return;
      }
      
      // If we couldn't get the data, exit
      if (!draggedData) return;
      
      // Use screenToFlowPosition instead of project
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Determine node type based on element category or explicit nodeType
      let nodeType = draggedData.nodeType || 'pidElement';
      
      // If no explicit nodeType was provided, infer from the element type
      if (!draggedData.nodeType) {
        if (draggedData.type.includes('pipe')) {
          nodeType = 'pipe';
        } else if (draggedData.type.includes('valve')) {
          nodeType = 'valve';
        } else if (draggedData.type.includes('pump')) {
          nodeType = 'pump';
        } else if (draggedData.type.includes('indicator')) {
          nodeType = 'instrument';
        }
      }
      
      const newNode: Node = {
        id: `${draggedData.type}-${Date.now()}`,
        type: nodeType,
        position,
        data: { 
          label: draggedData.label,
          type: draggedData.type,
          svgPath: draggedData.svgPath,
          ...(draggedData.data || {}) // Spread any additional data
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addToUndoStack();
    },
    [reactFlowInstance, setNodes, addToUndoStack]
  );
  // DnD support
  const dropTargetRef = useRef(null);
  const [, drop] = useDrop({
    accept: 'PID_ELEMENT',
    drop: (item: DragItem, monitor) => {
      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      
      // Get bounds not needed when using screenToFlowPosition
      const clientOffset = monitor.getClientOffset();
        if (clientOffset) {
        // Use screenToFlowPosition instead of project
        const position = reactFlowInstance.screenToFlowPosition({
          x: clientOffset.x,
          y: clientOffset.y,
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
        addToUndoStack();
      }
    },
  });
    // Auto-save functionality will be handled by the DiagramManager component

  // Clear canvas
  const clearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setEdges([]);
      setUndoRedoStack([{ nodes: [], edges: [] }]);
      setCurrentStackIndex(0);
    }
  };  // Apply the drop ref to the container
  useEffect(() => {
    if (dropTargetRef.current) {
      drop(dropTargetRef.current);
    }
  }, [drop]);
  
  // Apply opacity to all nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        style: { ...node.style, opacity: elementOpacity },
      }))
    );
  }, [elementOpacity, setNodes]);
  
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
      addToUndoStack();
    }
  }, [selectedEdges, setEdges, setSelectedEdges, addToUndoStack]);
  
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
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
          fitView
          edgesFocusable={true}
          selectNodesOnDrag={false}
        >          {showGrid && <Background color="#aaa" gap={snapGrid[0]} size={1} />}
          <Controls />
          <MiniMap />          <Panel position="top-left">
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
                </button>                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>How to Use:</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Add elements</b>: Drag items from the toolbar to the canvas</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Connect elements</b>: Drag from one connection point to another</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Connection points</b>: Red dots (horizontal) and green dots (vertical)</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Connection removal</b>: Click on connection and press Delete key</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Save/Load</b>: Use the buttons to save or load your diagram</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Delete elements</b>: Select and press Delete key</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Grid Settings</b>: Use the panel to adjust grid and snapping</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Undo/Redo</b>: Use Ctrl+Z (undo) and Ctrl+Y or Ctrl+Shift+Z (redo)</p>
                <p style={{ margin: '0 0 6px 0' }}>• <b>Works offline</b>: This app works even when you're not connected to the internet</p>
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
            <Panel position="bottom-left">
            <GridSettings
              snapToGrid={snapToGrid}
              setSnapToGrid={setSnapToGrid}
              snapGrid={snapGrid}
              setSnapGrid={setSnapGrid}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
            />
            <OpacityControl
              elementOpacity={elementOpacity}
              setElementOpacity={setElementOpacity}
            />
          </Panel><Panel position="top-right">            
            <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>              <DiagramManager 
                nodes={nodes} 
                edges={edges} 
                onLoadDiagram={(loadedNodes, loadedEdges) => {
                  // Apply current opacity to loaded nodes
                  const nodesWithOpacity = loadedNodes.map(node => ({
                    ...node,
                    style: { ...node.style, opacity: elementOpacity },
                  }));
                  setNodes(nodesWithOpacity);
                  setEdges(loadedEdges);
                }} 
              />
              <ExportPanel 
                reactFlowInstance={reactFlowInstance} 
                flowRef={reactFlowWrapper} 
              />
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
              </button>              <button 
                onClick={clearCanvas} 
                style={{ padding: '8px 12px', backgroundColor: '#ffcccc' }}
              >
                Clear Canvas
              </button>
              <UndoRedoPanel 
                canUndo={canUndo} 
                canRedo={canRedo} 
                onUndo={handleUndo} 
                onRedo={handleRedo} 
              />
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
