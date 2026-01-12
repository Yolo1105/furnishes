// Three.js Configuration for Furniture DIY

export const THREE_CONFIG = {
  // Asset loading configuration
  assets: {
    // Base paths for different asset types
    models: '/static/3d/models/',
    textures: '/static/textures/',
    materials: '/static/materials/',
    
    // Supported file formats
    supportedFormats: {
      models: ['.gltf', '.glb', '.obj', '.fbx'],
      textures: ['.png', '.jpg', '.jpeg', '.webp', '.ktx2', '.basis'],
      materials: ['.json', '.mtl'],
    },
    
    // Loading options
    loading: {
      timeout: 30000, // 30 seconds
      retries: 3,
      cache: true,
      progress: true,
    },
  },
  
  // Performance configuration
  performance: {
    // Rendering quality settings
    quality: {
      shadows: true,
      antialiasing: true,
      postProcessing: true,
      maxLights: 4,
      maxShadows: 2,
    },
    
    // Memory management
    memory: {
      maxTextureSize: 2048,
      maxGeometryVertices: 100000,
      maxMaterials: 50,
      cacheSize: 100, // MB
    },
    
    // LOD (Level of Detail) settings
    lod: {
      enabled: true,
      distances: [5, 10, 20, 50], // meters
      qualityLevels: ['high', 'medium', 'low', 'minimal'],
    },
  },
  
  // Camera configuration
  camera: {
    default: {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: [0, 2, 5],
    },
    furniture: {
      fov: 60,
      near: 0.1,
      far: 100,
      position: [0, 1, 3],
    },
    detail: {
      fov: 45,
      near: 0.1,
      far: 50,
      position: [0, 0.5, 2],
    },
  },
  
  // Lighting configuration
  lighting: {
    ambient: {
      intensity: 0.4,
      color: '#ffffff',
    },
    directional: {
      intensity: 1.0,
      color: '#ffffff',
      position: [10, 10, 5],
      castShadow: true,
    },
    point: {
      intensity: 0.5,
      color: '#ffffff',
      distance: 100,
      decay: 2,
    },
  },
  
  // Controls configuration
  controls: {
    orbit: {
      enablePan: true,
      enableZoom: true,
      enableRotate: true,
      maxDistance: 20,
      minDistance: 1,
      dampingFactor: 0.05,
    },
    transform: {
      mode: 'translate', // 'translate' | 'rotate' | 'scale'
      size: 1,
      showX: true,
      showY: true,
      showZ: true,
    },
  },
  
  // Material configuration
  materials: {
    default: {
      roughness: 0.5,
      metalness: 0.0,
      envMapIntensity: 1.0,
    },
    furniture: {
      roughness: 0.3,
      metalness: 0.1,
      envMapIntensity: 0.8,
    },
    fabric: {
      roughness: 0.8,
      metalness: 0.0,
      envMapIntensity: 0.5,
    },
    metal: {
      roughness: 0.1,
      metalness: 0.9,
      envMapIntensity: 1.2,
    },
  },
  
  // Environment configuration
  environment: {
    // Environment map settings
    envMap: {
      path: '/static/environment/',
      format: 'hdr', // 'hdr' | 'jpg' | 'png'
      intensity: 1.0,
    },
    
    // Background settings
    background: {
      type: 'color', // 'color' | 'gradient' | 'image' | 'environment'
      color: '#f0f0f0',
      gradient: {
        top: '#87CEEB',
        bottom: '#E0F6FF',
      },
    },
  },
  
  // Debug configuration
  debug: {
    enabled: false,
    stats: false,
    wireframe: false,
    boundingBoxes: false,
    axes: false,
    grid: false,
  },
};

// Performance presets
export const PERFORMANCE_PRESETS = {
  low: {
    shadows: false,
    antialiasing: false,
    postProcessing: false,
    maxLights: 2,
    maxShadows: 0,
    maxTextureSize: 1024,
    maxGeometryVertices: 50000,
  },
  medium: {
    shadows: true,
    antialiasing: true,
    postProcessing: false,
    maxLights: 3,
    maxShadows: 1,
    maxTextureSize: 2048,
    maxGeometryVertices: 75000,
  },
  high: {
    shadows: true,
    antialiasing: true,
    postProcessing: true,
    maxLights: 4,
    maxShadows: 2,
    maxTextureSize: 4096,
    maxGeometryVertices: 100000,
  },
};

// Asset preloading configuration
export const PRELOAD_CONFIG = {
  // Critical assets to preload
  critical: [
    // Add critical 3D models here
    // '/static/3d/models/sofa-base.glb',
    // '/static/3d/models/chair-base.glb',
  ],
  
  // Background preloading
  background: [
    // Add non-critical assets here
    // '/static/textures/fabric-01.jpg',
    // '/static/textures/wood-01.jpg',
  ],
  
  // Preload strategies
  strategies: {
    eager: 'critical', // Load immediately
    lazy: 'background', // Load when needed
    progressive: 'all', // Load progressively
  },
};
