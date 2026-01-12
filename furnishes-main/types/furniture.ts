export interface FurnitureComponent {
  id: string;
  name: string;
  type: string;
  price: number;
  selected: boolean;
}

export interface FurnitureItem {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  material: string;
  customization: Record<string, string>;
  components: FurnitureComponent[];
}

export interface FurnitureTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
  defaultColor: string;
  components: FurnitureComponent[];
}

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}
