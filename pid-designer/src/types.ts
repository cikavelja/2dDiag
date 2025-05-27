export interface NodeData {
  label: string;
  type: string;      // "valve", "pump", etc.
  width?: number;
  height?: number;
}

export interface DragItem {
  type: string;      // must match NodeData.type
  label: string;
  svgPath?: string;  // SVG path for the element
}

export interface PIDElement {
  id: string;
  type: string;
  data: NodeData;
  position: {
    x: number;
    y: number;
  };
}
