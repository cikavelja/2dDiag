import type { Node, Edge } from 'reactflow';

export interface DiagramData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  lastUpdated: number;
}

const STORAGE_KEY = 'pid_designer_diagrams';

/**
 * Save a diagram to local storage
 */
export const saveDiagram = (name: string, nodes: Node[], edges: Edge[]): string => {
  const diagrams = getAllDiagrams();
  
  // Create a unique ID for the diagram
  const id = `diagram_${Date.now()}`;
  
  const newDiagram: DiagramData = {
    id,
    name,
    nodes,
    edges,
    lastUpdated: Date.now(),
  };
  
  // Add the new diagram to the list
  diagrams.push(newDiagram);
  
  // Save the updated list
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  
  return id;
};

/**
 * Update an existing diagram in local storage
 */
export const updateDiagram = (id: string, name: string, nodes: Node[], edges: Edge[]): boolean => {
  const diagrams = getAllDiagrams();
  const index = diagrams.findIndex(d => d.id === id);
  
  if (index === -1) return false;
  
  // Update the diagram
  diagrams[index] = {
    ...diagrams[index],
    name,
    nodes,
    edges,
    lastUpdated: Date.now(),
  };
  
  // Save the updated list
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  
  return true;
};

/**
 * Get a diagram by ID from local storage
 */
export const getDiagram = (id: string): DiagramData | null => {
  const diagrams = getAllDiagrams();
  const diagram = diagrams.find(d => d.id === id);
  return diagram || null;
};

/**
 * Get all diagrams from local storage
 */
export const getAllDiagrams = (): DiagramData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as DiagramData[];
  } catch (e) {
    console.error('Failed to parse diagrams from localStorage:', e);
    return [];
  }
};

/**
 * Delete a diagram from local storage
 */
export const deleteDiagram = (id: string): boolean => {
  const diagrams = getAllDiagrams();
  const index = diagrams.findIndex(d => d.id === id);
  
  if (index === -1) return false;
  
  // Remove the diagram
  diagrams.splice(index, 1);
  
  // Save the updated list
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
  
  return true;
};

/**
 * Export a diagram as JSON
 */
export const exportDiagramAsJSON = (id: string): string => {
  const diagram = getDiagram(id);
  if (!diagram) return '';
  
  return JSON.stringify(diagram);
};

/**
 * Import a diagram from JSON
 */
export const importDiagramFromJSON = (json: string): string | null => {
  try {
    const data = JSON.parse(json) as DiagramData;
    const diagrams = getAllDiagrams();
    
    // Generate a new ID to avoid conflicts
    const newDiagram: DiagramData = {
      ...data,
      id: `diagram_${Date.now()}`,
      lastUpdated: Date.now(),
    };
    
    diagrams.push(newDiagram);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    
    return newDiagram.id;
  } catch (e) {
    console.error('Failed to import diagram:', e);
    return null;
  }
};
