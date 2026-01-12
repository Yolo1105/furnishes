export interface Product {
  id: string;
  name: string;
  designer: string;
  price: number;
  image: string;
  category: string;
  type: string;
  style: string[];
  color: string[];
  material: string[];
  badge?: string;
  isLarge?: boolean;
  // Detail page fields
  ref?: string;
  description?: string;
  additionalInfo?: string;
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  colors?: Array<{ name: string; value: string }>;
  images?: string[];
  dimensions?: {
    height: string;
    width: string;
    depth: string;
    seatHeight?: string;
    seatDepth?: string;
    weight: string;
  };
  materials?: Array<{ name: string; value: string }>;
  fullDescription?: string;
  delivery?: string;
  care?: string;
  warranty?: string;
}
