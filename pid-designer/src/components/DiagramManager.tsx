import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { Node, Edge } from 'reactflow';
import { saveDiagram, getAllDiagrams, getDiagram, deleteDiagram, updateDiagram, exportDiagramAsJSON, importDiagramFromJSON } from '../utils/storage';
import type { DiagramData } from '../utils/storage';

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
  max-height: 80vh;
  overflow-y: auto;
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

const Form = styled.form`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  width: 100%;
  margin-bottom: 10px;
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

const DiagramList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 20px;
`;

const DiagramItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const DiagramName = styled.div`
  flex: 1;
  margin-right: 10px;
`;

const DiagramDate = styled.div`
  color: #777;
  margin-right: 10px;
  font-size: 12px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
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

interface DiagramManagerProps {
  nodes: Node[];
  edges: Edge[];
  onLoadDiagram: (nodes: Node[], edges: Edge[]) => void;
}

export function DiagramManager({ nodes, edges, onLoadDiagram }: DiagramManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diagrams, setDiagrams] = useState<DiagramData[]>([]);
  const [diagramName, setDiagramName] = useState('');
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'save' | 'load'>('save');
  
  // Load diagrams when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setDiagrams(getAllDiagrams());
    }
  }, [isModalOpen]);
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diagramName.trim()) return;
    
    if (currentDiagramId) {
      updateDiagram(currentDiagramId, diagramName, nodes, edges);
    } else {
      const id = saveDiagram(diagramName, nodes, edges);
      setCurrentDiagramId(id);
    }
    
    // Refresh the diagram list
    setDiagrams(getAllDiagrams());
    setDiagramName('');
  };
  
  const handleLoad = (id: string) => {
    const diagram = getDiagram(id);
    if (!diagram) return;
    
    onLoadDiagram(diagram.nodes, diagram.edges);
    setCurrentDiagramId(id);
    setDiagramName(diagram.name);
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this diagram?')) {
      deleteDiagram(id);
      if (id === currentDiagramId) {
        setCurrentDiagramId(null);
        setDiagramName('');
      }
      setDiagrams(getAllDiagrams());
    }
  };
  
  const handleExport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const jsonData = exportDiagramAsJSON(id);
    if (!jsonData) return;
    
    // Create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${getDiagram(id)?.name || 'diagram'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      if (!json) return;
      
      const id = importDiagramFromJSON(json);
      if (id) {
        setDiagrams(getAllDiagrams());
        alert('Diagram imported successfully!');
      } else {
        alert('Failed to import diagram. Invalid format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <>
      <ButtonContainer>
        <ToolbarButton onClick={() => {
          setModalMode('save');
          setIsModalOpen(true);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v4.5h2a.5.5 0 0 1 .354.854l-2.5 2.5a.5.5 0 0 1-.708 0l-2.5-2.5A.5.5 0 0 1 5.5 6.5h2V2a1 1 0 0 0-1-1H2z"/>
          </svg>
          Save
        </ToolbarButton>
        <ToolbarButton onClick={() => {
          setModalMode('load');
          setIsModalOpen(true);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          Load
        </ToolbarButton>
      </ButtonContainer>
      
      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{modalMode === 'save' ? 'Save Diagram' : 'Load Diagram'}</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
            </ModalHeader>
            
            {modalMode === 'save' && (
              <Form onSubmit={handleSave}>
                <Input 
                  type="text" 
                  placeholder="Diagram name" 
                  value={diagramName} 
                  onChange={(e) => setDiagramName(e.target.value)} 
                />
                <Button type="submit">Save</Button>
              </Form>
            )}
            
            {modalMode === 'load' && (
              <div>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImport}
                  style={{ marginBottom: '16px' }}
                />
                <p>Select from saved diagrams:</p>
              </div>
            )}
            
            <DiagramList>
              {diagrams.length === 0 && <p>No saved diagrams</p>}
              {diagrams.map((diagram) => (
                <DiagramItem 
                  key={diagram.id} 
                  onClick={() => modalMode === 'load' && handleLoad(diagram.id)}
                  style={modalMode === 'load' ? { cursor: 'pointer' } : {}}
                >
                  <DiagramName>{diagram.name}</DiagramName>
                  <DiagramDate>{formatDate(diagram.lastUpdated)}</DiagramDate>
                  <ButtonContainer>
                    <Button onClick={(e) => handleExport(diagram.id, e)}>
                      Export
                    </Button>
                    <Button 
                      style={{ backgroundColor: '#e74c3c' }} 
                      onClick={(e) => handleDelete(diagram.id, e)}
                    >
                      Delete
                    </Button>
                  </ButtonContainer>
                </DiagramItem>
              ))}
            </DiagramList>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
