'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { sampleProducts, type Product } from '@/data/products-data';
import styles from './CollectionsPage.module.css';
import Image from 'next/image';
import AboutUsSection from '@/components/pages/collections/AboutUsSection';
import { useCart } from '@/contexts/CartContext';
import { smoothScrollTo } from '@/utils/scrollAnimation';

// Category type options mapping
const categoryTypes: Record<string, string[]> = {
  seating: ['Sofas', 'Armchairs', 'Lounge Chairs', 'Dining Chairs', 'Stools', 'Benches', 'Ottomans'],
  tables: ['Dining Tables', 'Coffee Tables', 'Side Tables', 'Console Tables', 'Desks', 'Nightstands'],
  storage: ['Cabinets', 'Sideboards', 'Bookcases', 'Shelving', 'Dressers', 'Media Consoles'],
  lighting: ['Floor Lamps', 'Table Lamps', 'Pendants', 'Chandeliers', 'Wall Sconces', 'Desk Lamps'],
  beds: ['Bed Frames', 'Headboards', 'Daybeds', 'Bunk Beds', 'Platform Beds'],
  accessories: ['Mirrors', 'Rugs', 'Throws', 'Cushions', 'Vases', 'Clocks', 'Decorative Objects'],
};

const stylesList = ['Modern', 'Mid-Century', 'Scandinavian', 'Minimalist', 'Industrial', 'Traditional'];
const materialsList = ['Wood', 'Metal', 'Fabric', 'Leather', 'Velvet', 'Rattan'];
const designersList = ['Studio PLUS', 'GLOVE Design', 'AUKI', 'Nordic Studio', 'Edit Collection', 'AP Design'];
const colorsList = [
  { name: 'White', value: '#FFFFFF', border: '#E0E0E0' },
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Gray', value: '#9E9E9E' },
  { name: 'Beige', value: '#D4C4B0' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Navy', value: '#1B365D' },
  { name: 'Green', value: '#4A6741' },
  { name: 'Mustard', value: '#C9A227' },
  { name: 'Terracotta', value: '#B85C38' },
  { name: 'Blush', value: '#D4A5A5' },
];

// Helper function to choose a character for highlighting that doesn't affect readability
const chooseHighlightChar = (word: string): number => {
  if (word.length === 0) return 0;
  if (word.length === 1) return 0;
  
  const vowels = 'aeiouAEIOU';
  
  // For short words (2-3 chars), use the last character
  if (word.length <= 3) {
    return word.length - 1;
  }
  
  // For longer words, prefer a vowel in the middle or end (but not first)
  const startCheck = Math.floor(word.length / 2);
  for (let i = startCheck; i < word.length; i++) {
    if (vowels.includes(word[i])) {
      return i;
    }
  }
  
  // If no vowel found in middle/end, check from start+1 to middle
  for (let i = 1; i < startCheck; i++) {
    if (vowels.includes(word[i])) {
      return i;
    }
  }
  
  // Fallback: use a character in the middle (not first or last)
  return Math.max(1, Math.floor(word.length / 2));
};

// Helper function to render text with orange accent
const renderTextWithAccent = (text: string): React.ReactNode => {
  const highlightIndex = chooseHighlightChar(text);
  const before = text.slice(0, highlightIndex);
  const highlightChar = text[highlightIndex];
  const after = text.slice(highlightIndex + 1);
  
  return (
    <>
      {before}
      <span style={{ color: '#E55E00' }}>{highlightChar}</span>
      {after}
    </>
  );
};

export default function CollectionsPage() {
  const scrollToCollections = () => {
    smoothScrollTo('collections-section');
  };

  const [activeCategory, setActiveCategory] = useState('seating');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedDesigners, setSelectedDesigners] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [collapsedFilters, setCollapsedFilters] = useState<Record<string, boolean>>({
    type: true,
    price: true,
    style: true,
    color: true,
    material: true,
    designer: true,
    availability: true,
  });

  // Cart functionality
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product.id,
      name: product.name,
      designer: product.designer,
      price: product.price,
      image: product.image,
      quantity: 1,
      ref: product.ref,
    });
  };

  // Update type options when category changes
  const currentTypeOptions = useMemo(() => {
    return categoryTypes[activeCategory] || [];
  }, [activeCategory]);

  // Function to organize products into blocks for the alternating pattern
  // Pattern: 
  // - Even blocks: Large left (cols 1-2), 4 small right (cols 3-4, 2x2)
  // - Odd blocks: 4 small left (cols 1-2, 2x2), large right (cols 3-4)
  const organizeProductsIntoBlocks = (products: Product[]) => {
    if (products.length === 0) return [];
    
    const largeProducts = products.filter(p => p.isLarge);
    const smallProducts = products.filter(p => !p.isLarge);
    
    const blocks: Array<{ large?: Product; small: Product[] }> = [];
    let largeIdx = 0;
    let smallIdx = 0;
    let blockNum = 0;

    while (largeIdx < largeProducts.length || smallIdx < smallProducts.length) {
      const isEven = blockNum % 2 === 0;
      const block: { large?: Product; small: Product[] } = { small: [] };

      if (isEven) {
        // Even: Large first, then 4 small
        if (largeIdx < largeProducts.length) {
          block.large = largeProducts[largeIdx++];
        }
        for (let i = 0; i < 4 && smallIdx < smallProducts.length; i++) {
          block.small.push(smallProducts[smallIdx++]);
        }
      } else {
        // Odd: 4 small first, then large
        for (let i = 0; i < 4 && smallIdx < smallProducts.length; i++) {
          block.small.push(smallProducts[smallIdx++]);
        }
        if (largeIdx < largeProducts.length) {
          block.large = largeProducts[largeIdx++];
        }
      }

      if (block.large || block.small.length > 0) {
        blocks.push(block);
      }
      blockNum++;

      if (largeIdx >= largeProducts.length && smallIdx >= smallProducts.length) break;
    }

    return blocks;
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    const filtered = sampleProducts.filter((product) => {
      // Category filter
      if (product.category !== activeCategory) return false;

      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.designer.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) return false;

      // Style filter
      if (selectedStyles.length > 0 && !product.style.some(s => selectedStyles.includes(s))) return false;

      // Color filter
      if (selectedColors.length > 0 && !product.color.some(c => selectedColors.includes(c))) return false;

      // Material filter
      if (selectedMaterials.length > 0 && !product.material.some(m => selectedMaterials.includes(m))) return false;

      // Designer filter
      if (selectedDesigners.length > 0 && !selectedDesigners.includes(product.designer)) return false;

      // Price filter
      if (priceRange.min && product.price < parseInt(priceRange.min)) return false;
      if (priceRange.max && product.price > parseInt(priceRange.max)) return false;

      return true;
    });
    
    return filtered;
  }, [activeCategory, searchQuery, selectedTypes, selectedStyles, selectedColors, selectedMaterials, selectedDesigners, priceRange]);

  const toggleFilter = (filterKey: string) => {
    setCollapsedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev => 
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const toggleDesigner = (designer: string) => {
    setSelectedDesigners(prev => 
      prev.includes(designer) ? prev.filter(d => d !== designer) : [...prev, designer]
    );
  };

  return (
    <div className={styles.collectionsPage}>
      {/* Hero Banner Cover */}
      <div className={styles.collectionsHero}>
        <div className={styles.heroBackground}>
          <Image
            src="/images/hero-modern-room.jpg"
            alt="Collections hero image"
            fill
            className={styles.heroImage}
            priority
            sizes="100vw"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroTextContainer}>
            {/* Left: Big text */}
            <div className={styles.heroLeftText}>
              <h1 className={styles.heroBigLine1}>
                {renderTextWithAccent('Curated')}
              </h1>
              <h1 className={styles.heroBigLine2}>
                {renderTextWithAccent('Furniture')}
              </h1>
              <h1 className={styles.heroBigLine3}>
                {renderTextWithAccent('Collections')}
              </h1>
            </div>
            {/* Right: Small descriptive text */}
            <div className={styles.heroRightText}>
              <p className={styles.heroSmallText}>
                Explore thoughtfully designed pieces that transform your space. Each collection combines timeless elegance with modern functionality, crafted for urban living.
              </p>
            </div>
          </div>
        </div>
        {/* Scroll to Collections Button */}
        <button 
          className={styles.scrollToCollectionsButton}
          onClick={scrollToCollections}
          aria-label="Scroll to collections section"
          title="Scroll to collections"
        >
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </div>

      {/* Top Bar - Full Width Peach Section */}
      <div id="collections-section" className={styles.topBarWrapper}>
        <div className={styles.topBar}>
          <nav className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'seating' ? styles.active : ''}`}
              onClick={() => setActiveCategory('seating')}
            >
              Seating
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'tables' ? styles.active : ''}`}
              onClick={() => setActiveCategory('tables')}
            >
              Tables
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'storage' ? styles.active : ''}`}
              onClick={() => setActiveCategory('storage')}
            >
              Storage
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'lighting' ? styles.active : ''}`}
              onClick={() => setActiveCategory('lighting')}
            >
              Lighting
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'beds' ? styles.active : ''}`}
              onClick={() => setActiveCategory('beds')}
            >
              Beds
            </button>
            <button
              className={`${styles.categoryTab} ${activeCategory === 'accessories' ? styles.active : ''}`}
              onClick={() => setActiveCategory('accessories')}
            >
              Accessories
            </button>
          </nav>
          <div className={styles.topBarRight}>
            <span className={styles.resultCount}>{filteredProducts.length} products</span>
            <div className={styles.searchBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.listingContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Refine By</div>

          {/* Type Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader} onClick={() => toggleFilter('type')}>
              <h3>Type</h3>
              <span className={`${styles.filterToggle} ${collapsedFilters.type ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedFilters.type && (
              <div className={styles.filterContent}>
                {currentTypeOptions.map((type) => (
                  <label key={type} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleType(type)}
                    />
                    <span className={styles.filterCheckbox}></span>
                    {type}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader} onClick={() => toggleFilter('price')}>
              <h3>Price</h3>
              <span className={`${styles.filterToggle} ${collapsedFilters.price ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedFilters.price && (
              <div className={styles.filterContent}>
                <div className={styles.priceRange}>
                  <div className={styles.priceInputs}>
                    <div className={styles.priceInput}>
                      <label>Min</label>
                      <input
                        type="text"
                        placeholder="$0"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                    </div>
                    <div className={styles.priceInput}>
                      <label>Max</label>
                      <input
                        type="text"
                        placeholder="$10,000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Style Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader} onClick={() => toggleFilter('style')}>
              <h3>Style</h3>
              <span className={`${styles.filterToggle} ${collapsedFilters.style ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedFilters.style && (
              <div className={styles.filterContent}>
                {stylesList.map((style) => (
                  <label key={style} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(style)}
                      onChange={() => toggleStyle(style)}
                    />
                    <span className={styles.filterCheckbox}></span>
                    {style}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader} onClick={() => toggleFilter('color')}>
              <h3>Color</h3>
              <span className={`${styles.filterToggle} ${collapsedFilters.color ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedFilters.color && (
              <div className={styles.filterContent}>
                <div className={styles.colorSwatches}>
                  {colorsList.map((color) => (
                    <div
                      key={color.value}
                      className={`${styles.colorSwatch} ${selectedColors.includes(color.value) ? styles.selected : ''}`}
                      style={{
                        background: color.value,
                        border: color.border ? `1px solid ${color.border}` : undefined,
                      }}
                      onClick={() => toggleColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Material Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader} onClick={() => toggleFilter('material')}>
              <h3>Material</h3>
              <span className={`${styles.filterToggle} ${collapsedFilters.material ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedFilters.material && (
              <div className={styles.filterContent}>
                {materialsList.map((material) => (
                  <label key={material} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedMaterials.includes(material)}
                      onChange={() => toggleMaterial(material)}
                    />
                    <span className={styles.filterCheckbox}></span>
                    {material}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Designer Filter */}
          <div className={styles.filterSection}>
            <div className={styles.filterHeader} onClick={() => toggleFilter('designer')}>
              <h3>Designer</h3>
              <span className={`${styles.filterToggle} ${collapsedFilters.designer ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedFilters.designer && (
              <div className={styles.filterContent}>
                {designersList.map((designer) => (
                  <label key={designer} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedDesigners.includes(designer)}
                      onChange={() => toggleDesigner(designer)}
                    />
                    <span className={styles.filterCheckbox}></span>
                    {designer}
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.productGrid}>
            {organizeProductsIntoBlocks(filteredProducts).map((block, blockIndex) => {
              // Skip empty blocks
              if (!block.large && block.small.length === 0) {
                return null;
              }

              const isEven = blockIndex % 2 === 0;
              const startRow = blockIndex * 2 + 1;
              
              // Helper function to render a product card
              const renderProductCard = (product: Product, gridRow: string, gridCol: string, isLarge: boolean = false) => (
                <Link
                  key={product.id}
                  href={`/collections/${product.id}`}
                  className={`${styles.productCard} ${isLarge ? styles.large : ''}`}
                  style={{
                    gridRow,
                    gridColumn: gridCol,
                  }}
                >
                  <div className={styles.productImage}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className={styles.productImageImg}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {product.badge && (
                      <div className={styles.productBadge}>{product.badge}</div>
                    )}
                    <button
                      className={styles.productAdd}
                      onClick={(e) => handleAddToCart(e, product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productNameRow}>
                      <div className={styles.productNameGroup}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <span className={styles.productDesigner}>{product.designer}</span>
                      </div>
                    </div>
                    <p className={styles.productPrice}>${product.price.toLocaleString()}</p>
                  </div>
                </Link>
              );

              return (
                <React.Fragment key={blockIndex}>
                  {isEven ? (
                    <>
                      {/* Even blocks: Large left, 4 small right */}
                      {block.large && renderProductCard(
                        block.large,
                        `${startRow} / ${startRow + 2}`,
                        '1 / 3',
                        true
                      )}
                      {block.small.map((product, idx) => {
                        const row = startRow + Math.floor(idx / 2);
                        const col = idx % 2 === 0 ? '3' : '4';
                        return renderProductCard(product, `${row}`, col);
                      })}
                    </>
                  ) : (
                    <>
                      {/* Odd blocks: 4 small left, large right */}
                      {block.small.map((product, idx) => {
                        const row = startRow + Math.floor(idx / 2);
                        const col = idx % 2 === 0 ? '1' : '2';
                        return renderProductCard(product, `${row}`, col);
                      })}
                      {block.large && renderProductCard(
                        block.large,
                        `${startRow} / ${startRow + 2}`,
                        '3 / 5',
                        true
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </main>
      </div>
      <AboutUsSection />
    </div>
  );
}
