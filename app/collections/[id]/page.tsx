'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { sampleProducts, getProductDetails, type Product } from '@/data/products-data';
import { useCart } from '@/contexts/CartContext';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>('#3D3D3D');
  const [selectedSize, setSelectedSize] = useState<string>('3-Seat');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [addToCartSuccess, setAddToCartSuccess] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    description: false,
    dimensions: false,
    materials: true,
    delivery: true,
    care: true,
    warranty: true,
  });

  // Find product by ID and get full details
  const baseProduct = sampleProducts.find(p => p.id === productId);
  const product = baseProduct ? getProductDetails(baseProduct) : null;

  if (!product) {
    return (
      <div className={styles.detailPage}>
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <Link href="/collections" className={styles.backLink}>
            ← Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + change)));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const colorName = product.colors?.find(c => c.value === selectedColor)?.name || selectedColor;
    
    addToCart({
      productId: product.id,
      name: product.name,
      designer: product.designer,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: quantity,
      selectedColor: colorName,
      selectedSize: selectedSize,
      ref: product.ref,
    });

    setAddToCartSuccess(true);
    setTimeout(() => {
      setAddToCartSuccess(false);
    }, 3000);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            );
          } else if (i === fullStars && hasHalfStar) {
            return (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            );
          } else {
            return (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className={styles.detailPage}>
      <header className={styles.detailHeader}>
        <div className={styles.detailTitleRow}>
          <h1 className={styles.detailTitle}>{product.name}</h1>
        </div>
        <p className={styles.detailSubtitle}>by {product.designer}</p>
        <div className={styles.detailRating}>
          {renderStars(product.rating)}
          <span>({product.reviewCount} reviews)</span>
        </div>
      </header>

      <div className={styles.detailContainer}>
        {/* Left Column - Accordion Sections */}
        <div className={styles.detailLeft}>
          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => toggleSection('description')}>
              <h3>Description</h3>
              <span className={`${styles.accordionToggle} ${collapsedSections.description ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedSections.description && (
              <div className={styles.accordionContent}>
                <p>{product.fullDescription}</p>
              </div>
            )}
          </div>

          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => toggleSection('dimensions')}>
              <h3>Dimensions</h3>
              <span className={`${styles.accordionToggle} ${collapsedSections.dimensions ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedSections.dimensions && (
              <div className={styles.accordionContent}>
                <table className={styles.dimensionsTable}>
                  <tbody>
                    <tr>
                      <td>Height (A)</td>
                      <td>{product.dimensions.height}</td>
                    </tr>
                    <tr>
                      <td>Width (B)</td>
                      <td>{product.dimensions.width}</td>
                    </tr>
                    <tr>
                      <td>Depth (C)</td>
                      <td>{product.dimensions.depth}</td>
                    </tr>
                    <tr>
                      <td>Seat Height</td>
                      <td>{product.dimensions.seatHeight}</td>
                    </tr>
                    <tr>
                      <td>Seat Depth</td>
                      <td>{product.dimensions.seatDepth}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>{product.dimensions.weight}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => toggleSection('materials')}>
              <h3>Materials</h3>
              <span className={`${styles.accordionToggle} ${collapsedSections.materials ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedSections.materials && (
              <div className={styles.accordionContent}>
                <div className={styles.materialList}>
                  {product.materials.map((material, index) => (
                    <div key={index} className={styles.materialItem}>
                      <span>{material.name}</span>
                      <span>{material.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => toggleSection('delivery')}>
              <h3>Delivery</h3>
              <span className={`${styles.accordionToggle} ${collapsedSections.delivery ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedSections.delivery && (
              <div className={styles.accordionContent}>
                <p>{product.delivery}</p>
              </div>
            )}
          </div>

          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => toggleSection('care')}>
              <h3>Care</h3>
              <span className={`${styles.accordionToggle} ${collapsedSections.care ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedSections.care && (
              <div className={styles.accordionContent}>
                <p>{product.care}</p>
              </div>
            )}
          </div>

          <div className={styles.accordionSection}>
            <div className={styles.accordionHeader} onClick={() => toggleSection('warranty')}>
              <h3>Warranty</h3>
              <span className={`${styles.accordionToggle} ${collapsedSections.warranty ? '' : styles.rotated}`}>+</span>
            </div>
            {!collapsedSections.warranty && (
              <div className={styles.accordionContent}>
                <p>{product.warranty}</p>
              </div>
            )}
          </div>
        </div>

        {/* Center Column - Images */}
        <div className={styles.detailCenter}>
          <div className={styles.mainImage}>
            <Image
              src={product.images[mainImage]}
              alt={product.name}
              fill
              className={styles.mainImageImg}
              sizes="(max-width: 1200px) 100vw, 600px"
            />
          </div>
          <Link href="/collections" className={styles.backIcon} aria-label="Back to Collections">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className={styles.thumbnailRow}>
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${mainImage === index ? styles.active : ''}`}
                onClick={() => setMainImage(index)}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className={styles.thumbnailImg}
                  sizes="72px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className={styles.detailRight}>
          <p className={styles.detailRef}>REF: {product.ref}</p>
          
          <p className={styles.detailDescription}>{product.description}</p>
          <p className={styles.detailDescription}>{product.additionalInfo}</p>

          <div className={styles.variantSection}>
            <div className={styles.variantLabel}>
              Color
              <span className={styles.variantValue}>
                {product.colors.find(c => c.value === selectedColor)?.name || 'Charcoal'}
              </span>
            </div>
            <div className={styles.detailSwatches}>
              {product.colors.map((color) => (
                <div
                  key={color.value}
                  className={`${styles.detailSwatch} ${selectedColor === color.value ? styles.selected : ''}`}
                  style={{ background: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                />
              ))}
            </div>
          </div>

          <div className={styles.variantSection}>
            <div className={styles.variantLabel}>Size</div>
            <div className={styles.sizeOptions}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeOption} ${selectedSize === size ? styles.selected : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.detailDivider}></div>

          <p className={styles.detailPrice}>${product.price.toLocaleString()}</p>
          <p className={styles.detailFinancing}>or ${Math.round(product.price / 24)}/mo with Affirm</p>

          <div className={styles.quantitySelector}>
            <button className={styles.qtyBtn} onClick={() => updateQuantity(-1)}>-</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => updateQuantity(1)}>+</button>
          </div>

          <button 
            className={`${styles.addToCart} ${addToCartSuccess ? styles.addToCartSuccess : ''}`}
            onClick={handleAddToCart}
          >
            {addToCartSuccess ? 'Added to Cart' : 'Add to Cart'}
          </button>

          <div className={styles.trustSignals}>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              Free shipping over $500
            </div>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              White glove delivery
            </div>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 14l-4-4 4-4"/>
                <path d="M5 10h11a4 4 0 110 8h-1"/>
              </svg>
              30-day returns
            </div>
            <div className={styles.trustItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              5-year warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
