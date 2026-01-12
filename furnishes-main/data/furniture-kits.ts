import type { FurnitureKit } from '@/types/project';

export const furnitureKits: FurnitureKit[] = [
  {
    id: 'modern-calm-starter',
    name: 'Modern Calm Starter',
    description: 'Clean lines, warm texture',
    image: '/images/h-modern-living-room.jpg',
    items: [
      {
        productId: 'sofa-01',
        name: 'Modern 3-Seat Sofa',
        price: 1200,
        position: [0, 0, 1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'table-01',
        name: 'Oak Coffee Table',
        price: 380,
        position: [0, 0, -1.5],
        rotation: [0, 0, 0]
      },
      {
        productId: 'table-02',
        name: 'Round Side Table',
        price: 220,
        position: [2, 0, 0.5],
        rotation: [0, 0, 0]
      },
      {
        productId: 'lamp-01',
        name: 'Arc Floor Lamp',
        price: 280,
        position: [1.5, 0, -1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'console-01',
        name: 'Media Console',
        price: 650,
        position: [0, 0, -3],
        rotation: [0, 0, 0]
      },
      {
        productId: 'rug-01',
        name: 'Textured Area Rug 8×10',
        price: 520,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
      },
      {
        productId: 'pillows-01',
        name: 'Linen Throw Pillows (2)',
        price: 150,
        position: [0, 0.5, 1],
        rotation: [0, 0, 0]
      }
    ],
    estimatedTotal: 3400
  },
  {
    id: 'small-space-essential',
    name: 'Small Space Essential',
    description: 'Maximize function in compact spaces',
    image: '/images/h-boxes.jpg',
    items: [
      {
        productId: 'sofa-02',
        name: 'Compact Sofa',
        price: 950,
        position: [0, 0, 1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'table-03',
        name: 'Nesting Tables',
        price: 320,
        position: [0, 0, -1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'storage-01',
        name: 'Wall Storage Unit',
        price: 480,
        position: [0, 0, -2.5],
        rotation: [0, 0, 0]
      },
      {
        productId: 'lamp-02',
        name: 'Table Lamp',
        price: 180,
        position: [1, 0, 0],
        rotation: [0, 0, 0]
      },
      {
        productId: 'rug-02',
        name: 'Area Rug 6×9',
        price: 380,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
      }
    ],
    estimatedTotal: 2310
  },
  {
    id: 'cozy-reset',
    name: 'Cozy Reset',
    description: 'Warm, inviting comfort',
    image: '/images/h-grey-sofa.jpg',
    items: [
      {
        productId: 'sofa-03',
        name: 'Sectional Sofa',
        price: 1800,
        position: [0, 0, 1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'table-04',
        name: 'Wooden Coffee Table',
        price: 450,
        position: [0, 0, -1.5],
        rotation: [0, 0, 0]
      },
      {
        productId: 'lamp-03',
        name: 'Floor Lamp',
        price: 320,
        position: [-1.5, 0, -1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'rug-03',
        name: 'Plush Area Rug 9×12',
        price: 680,
        position: [0, 0, 0],
        rotation: [0, 0, 0]
      },
      {
        productId: 'pillows-02',
        name: 'Throw Pillows & Blanket',
        price: 220,
        position: [0, 0.5, 1],
        rotation: [0, 0, 0]
      }
    ],
    estimatedTotal: 3470
  },
  {
    id: 'focus-work-zone',
    name: 'Focus Work Zone',
    description: 'Productive, organized workspace',
    image: '/images/design1.jpg',
    items: [
      {
        productId: 'desk-01',
        name: 'Standing Desk',
        price: 650,
        position: [0, 0, -2],
        rotation: [0, 0, 0]
      },
      {
        productId: 'chair-01',
        name: 'Ergonomic Chair',
        price: 420,
        position: [0, 0, -1],
        rotation: [0, 0, 0]
      },
      {
        productId: 'storage-02',
        name: 'Desk Storage',
        price: 280,
        position: [1.5, 0, -2],
        rotation: [0, 0, 0]
      },
      {
        productId: 'lamp-04',
        name: 'Task Lamp',
        price: 150,
        position: [0.5, 0, -2],
        rotation: [0, 0, 0]
      },
      {
        productId: 'rug-04',
        name: 'Office Rug 5×7',
        price: 320,
        position: [0, 0, -1.5],
        rotation: [0, 0, 0]
      }
    ],
    estimatedTotal: 1820
  }
];
