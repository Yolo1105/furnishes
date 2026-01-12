import type { FurnitureTemplate } from '@/types/furniture';

export const furnitureTemplates: FurnitureTemplate[] = [
  {
    type: "table",
    name: "Table",
    description: "Dining tables, coffee tables, and work surfaces",
    icon: "table",
    defaultColor: "#A0522D",
    components: [
      { id: "legs-1", name: "Classic Wooden Legs", type: "LEGS", price: 120, selected: true },
      { id: "legs-2", name: "Metal Industrial Legs", type: "LEGS", price: 150, selected: false },
      { id: "top-1", name: "Live Edge Slab", type: "TOP", price: 400, selected: true },
      { id: "top-2", name: "Marble Surface", type: "TOP", price: 650, selected: false },
    ],
  },
  {
    type: "chair",
    name: "Chair",
    description: "Dining chairs, office chairs, and seating",
    icon: "chair",
    defaultColor: "#696969",
    components: [
      { id: "seat-1", name: "Fabric Cushion", type: "SEAT", price: 80, selected: true },
      { id: "seat-2", name: "Leather Cushion", type: "SEAT", price: 150, selected: false },
      { id: "frame-1", name: "Wooden Frame", type: "FRAME", price: 200, selected: true },
      { id: "frame-2", name: "Metal Frame", type: "FRAME", price: 180, selected: false },
    ],
  },
  {
    type: "desk",
    name: "Desk",
    description: "Work desks and study tables",
    icon: "desk",
    defaultColor: "#4682B4",
    components: [
      { id: "surface-1", name: "Oak Desktop", type: "SURFACE", price: 250, selected: true },
      { id: "legs-3", name: "Adjustable Legs", type: "LEGS", price: 120, selected: true },
      { id: "drawer-1", name: "Storage Drawer", type: "STORAGE", price: 80, selected: true },
    ],
  },
  {
    type: "shelf",
    name: "Shelf",
    description: "Bookcases and storage shelves",
    icon: "shelf",
    defaultColor: "#8FBC8F",
    components: [
      { id: "shelves-1", name: "Pine Shelves", type: "SHELVES", price: 180, selected: true },
      { id: "back-1", name: "Backing Panel", type: "BACKING", price: 60, selected: true },
      { id: "sides-1", name: "Side Panels", type: "SIDES", price: 80, selected: true },
    ],
  },
  {
    type: "cabinet",
    name: "Cabinet",
    description: "Storage cabinets and wardrobes",
    icon: "cabinet",
    defaultColor: "#D2B48C",
    components: [
      { id: "doors-1", name: "Glass Doors", type: "DOORS", price: 200, selected: true },
      { id: "shelves-2", name: "Adjustable Shelves", type: "SHELVES", price: 150, selected: true },
      { id: "hardware-1", name: "Premium Hardware", type: "HARDWARE", price: 80, selected: true },
      { id: "frame-2", name: "Solid Frame", type: "FRAME", price: 250, selected: true },
    ],
  },
  {
    type: "sofa",
    name: "Sofa",
    description: "Living room sofas and couches",
    icon: "sofa",
    defaultColor: "#8B4513",
    components: [
      { id: "cushion-1", name: "Fabric Cushions", type: "CUSHION", price: 300, selected: true },
      { id: "cushion-2", name: "Leather Cushions", type: "CUSHION", price: 500, selected: false },
      { id: "frame-3", name: "Wooden Frame", type: "FRAME", price: 400, selected: true },
      { id: "legs-4", name: "Metal Legs", type: "LEGS", price: 120, selected: true },
    ],
  },
  {
    type: "bed",
    name: "Bed",
    description: "Bed frames and mattresses",
    icon: "bed",
    defaultColor: "#696969",
    components: [
      { id: "frame-4", name: "Wooden Frame", type: "FRAME", price: 350, selected: true },
      { id: "mattress-1", name: "Memory Foam Mattress", type: "MATTRESS", price: 600, selected: true },
      { id: "headboard-1", name: "Upholstered Headboard", type: "HEADBOARD", price: 200, selected: true },
    ],
  },
  {
    type: "lamp",
    name: "Lamp",
    description: "Table lamps and floor lamps",
    icon: "lamp",
    defaultColor: "#D2B48C",
    components: [
      { id: "shade-1", name: "Fabric Shade", type: "SHADE", price: 80, selected: true },
      { id: "base-1", name: "Metal Base", type: "BASE", price: 120, selected: true },
      { id: "bulb-1", name: "LED Bulb", type: "BULB", price: 25, selected: true },
    ],
  },
];

export const materials = [
  { value: "wood", name: "Wood" },
  { value: "metal", name: "Metal" },
  { value: "plastic", name: "Plastic" },
  { value: "glass", name: "Glass" },
  { value: "fabric", name: "Fabric" },
];

export const colors = [
  "#ffffff", // White
  "#000000", // Black
  "#808080", // Gray
  "#A0522D", // Sienna
  "#696969", // DimGray
  "#4682B4", // SteelBlue
  "#8FBC8F", // DarkSeaGreen
  "#D2B48C", // Tan
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FFA500", // Orange
  "#800080", // Purple
  "#40E0D0", // Turquoise
];
