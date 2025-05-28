import React, { useState } from 'react';
import styled from 'styled-components';
import { toPng, toSvg } from 'html-to-image';
import type { ReactFlowInstance } from 'reactflow';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  min-width: 400px;
  max-width: 80%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const ModalTitle = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const Form = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-right: 8px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ToolbarButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

interface ExportPanelProps {
  reactFlowInstance: ReactFlowInstance | null;
  flowRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportPanel({ reactFlowInstance, flowRef }: ExportPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportName, setExportName] = useState('pid-diagram');
  const [exportWidth, setExportWidth] = useState(1920);
  const [exportHeight, setExportHeight] = useState(1080);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportPNG = async () => {
    if (!flowRef.current || !reactFlowInstance) return;
    
    try {
      setIsExporting(true);
      
      // Wait for the next frame to ensure the UI updates
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the ReactFlow viewport
      const nodesBounds = reactFlowInstance.getNodes().reduce(
        (bounds, node) => {
          const nodeWidth = node.width || 0;
          const nodeHeight = node.height || 0;
          
          bounds.minX = Math.min(bounds.minX, node.position.x);
          bounds.minY = Math.min(bounds.minY, node.position.y);
          bounds.maxX = Math.max(bounds.maxX, node.position.x + nodeWidth);
          bounds.maxY = Math.max(bounds.maxY, node.position.y + nodeHeight);
          return bounds;
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );
      
      // Add some padding
      const padding = 50;
      nodesBounds.minX -= padding;
      nodesBounds.minY -= padding;
      nodesBounds.maxX += padding;
      nodesBounds.maxY += padding;
        // Calculate dimensions (used for reference only)
      // Actual dimensions will be determined by exportWidth/exportHeight
      
      // Get the current transform
      const currentTransform = reactFlowInstance.getViewport();
      
      // Store the current transform to restore later
      const originalTransform = { ...currentTransform };
      
      // Set the transform to fit the nodes
      reactFlowInstance.setViewport(
        {
          x: -nodesBounds.minX,
          y: -nodesBounds.minY,
          zoom: 1,
        },
        { duration: 0 }
      );
      
      // Generate the image
      const dataUrl = await toPng(flowRef.current, {
        backgroundColor: '#ffffff',
        width: exportWidth,
        height: exportHeight,
        pixelRatio: 2,
      });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${exportName}.png`;
      link.href = dataUrl;
      link.click();
      
      // Restore the original transform
      reactFlowInstance.setViewport(
        {
          x: originalTransform.x,
          y: originalTransform.y,
          zoom: originalTransform.zoom,
        },
        { duration: 0 }
      );
    } catch (error) {
      console.error('Error exporting to PNG:', error);
      alert('Failed to export diagram as PNG');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportSVG = async () => {
    if (!flowRef.current || !reactFlowInstance) return;
    
    try {
      setIsExporting(true);
      
      // Wait for the next frame to ensure the UI updates
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the ReactFlow viewport
      const nodesBounds = reactFlowInstance.getNodes().reduce(
        (bounds, node) => {
          const nodeWidth = node.width || 0;
          const nodeHeight = node.height || 0;
          
          bounds.minX = Math.min(bounds.minX, node.position.x);
          bounds.minY = Math.min(bounds.minY, node.position.y);
          bounds.maxX = Math.max(bounds.maxX, node.position.x + nodeWidth);
          bounds.maxY = Math.max(bounds.maxY, node.position.y + nodeHeight);
          return bounds;
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );
      
      // Add some padding
      const padding = 50;
      nodesBounds.minX -= padding;
      nodesBounds.minY -= padding;
      nodesBounds.maxX += padding;
      nodesBounds.maxY += padding;
        // Calculate dimensions (used for reference only)
      // Actual dimensions will be determined by exportWidth/exportHeight
      
      // Store the current transform
      const currentTransform = reactFlowInstance.getViewport();
      const originalTransform = { ...currentTransform };
      
      // Set the transform to fit the nodes
      reactFlowInstance.setViewport(
        {
          x: -nodesBounds.minX,
          y: -nodesBounds.minY,
          zoom: 1,
        },
        { duration: 0 }
      );
      
      // Generate the SVG
      const dataUrl = await toSvg(flowRef.current, {
        backgroundColor: '#ffffff',
        width: exportWidth,
        height: exportHeight,
      });
      
      // Create a download link
      const link = document.createElement('a');
      link.download = `${exportName}.svg`;
      link.href = dataUrl;
      link.click();
      
      // Restore the original transform
      reactFlowInstance.setViewport(
        {
          x: originalTransform.x,
          y: originalTransform.y,
          zoom: originalTransform.zoom,
        },
        { duration: 0 }
      );
    } catch (error) {
      console.error('Error exporting to SVG:', error);
      alert('Failed to export diagram as SVG');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <>
      <ToolbarButton onClick={() => setIsModalOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
        </svg>
        Export
      </ToolbarButton>
      
      {isModalOpen && (
        <Modal onClick={() => !isExporting && setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Export Diagram</ModalTitle>
              <CloseButton onClick={() => !isExporting && setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            
            <Form>
              <div>
                <Label htmlFor="export-name">Filename</Label>
                <Input 
                  id="export-name"
                  type="text" 
                  value={exportName} 
                  onChange={(e) => setExportName(e.target.value)} 
                  disabled={isExporting}
                />
              </div>
              
              <div>
                <Label htmlFor="export-width">Width (px)</Label>
                <Input 
                  id="export-width"
                  type="number" 
                  value={exportWidth} 
                  onChange={(e) => setExportWidth(Number(e.target.value))} 
                  disabled={isExporting}
                />
              </div>
              
              <div>
                <Label htmlFor="export-height">Height (px)</Label>
                <Input 
                  id="export-height"
                  type="number" 
                  value={exportHeight} 
                  onChange={(e) => setExportHeight(Number(e.target.value))} 
                  disabled={isExporting}
                />
              </div>
            </Form>
            
            <ButtonRow>
              <Button 
                onClick={handleExportPNG} 
                disabled={isExporting}
                style={{ opacity: isExporting ? 0.5 : 1 }}
              >
                {isExporting ? 'Exporting...' : 'Export as PNG'}
              </Button>
              
              <Button 
                onClick={handleExportSVG} 
                disabled={isExporting}
                style={{ opacity: isExporting ? 0.5 : 1 }}
              >
                {isExporting ? 'Exporting...' : 'Export as SVG'}
              </Button>
            </ButtonRow>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
