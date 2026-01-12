'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const router = useRouter();
  const {
    state,
    removeFromCart,
    updateQuantity,
    saveForLater,
    moveToCart,
    removeFromSaved,
    moveToWishlist,
    applyPromoCode,
    removePromoCode,
    subtotal,
    shipping,
    tax,
    total,
    itemCount,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    setPromoError('');
    // Simple promo code validation - can be enhanced
    const validCodes: Record<string, number> = {
      'SAVE10': 10,
      'SAVE20': 20,
      'FREESHIP': 0, // Special handling for free shipping
      'WELCOME15': 15,
    };

    const code = promoCode.toUpperCase().trim();
    if (validCodes[code]) {
      if (code === 'FREESHIP') {
        // Free shipping is already handled in shipping calculation
        applyPromoCode(code, 0);
      } else {
        applyPromoCode(code, validCodes[code]);
      }
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout'); // Can be implemented later
  };

  if (state.items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.cartEmptyState}>
          <div className={styles.cartEmptyIcon}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#d4c4b8" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h1 className={styles.cartEmptyTitle}>Your cart is empty</h1>
          <p className={styles.cartEmptyText}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/collections" className={styles.cartEmptyButton}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <header className={styles.cartHeader}>
        <div className={styles.cartHeaderTop}>
          <Link href="/collections" className={styles.continueShopping}>
            ← Continue Shopping
          </Link>
          <h1 className={styles.cartPageTitle}>
            Shopping Cart
            <span className={styles.cartPageCount}>({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>
      </header>

      <div className={styles.cartContainer}>
        {/* Left Column - Cart Items */}
        <div className={styles.cartItemsSection}>
          {state.items.map((item) => (
            <div key={item.id} className={styles.cartItemCard}>
              <div className={styles.cartItemImageWrapper}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  className={styles.cartItemImage}
                />
              </div>
              <div className={styles.cartItemInfo}>
                <div className={styles.cartItemHeader}>
                  <div>
                    <h3 className={styles.cartItemName}>{item.name}</h3>
                    <p className={styles.cartItemDesigner}>{item.designer}</p>
                    {item.ref && (
                      <p className={styles.cartItemRef}>REF: {item.ref}</p>
                    )}
                  </div>
                  <button
                    className={styles.cartItemRemove}
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {(item.selectedColor || item.selectedSize) && (
                  <div className={styles.cartItemVariants}>
                    {item.selectedColor && (
                      <div className={styles.cartItemVariant}>
                        <span className={styles.variantLabel}>Color:</span>
                        <div
                          className={styles.colorSwatch}
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <span className={styles.variantValue}>{item.selectedColor}</span>
                      </div>
                    )}
                    {item.selectedSize && (
                      <div className={styles.cartItemVariant}>
                        <span className={styles.variantLabel}>Size:</span>
                        <span className={styles.variantValue}>{item.selectedSize}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.cartItemFooter}>
                  <div className={styles.cartItemQuantity}>
                    <label className={styles.quantityLabel}>Quantity:</label>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className={styles.cartItemPrice}>
                    <span className={styles.priceLabel}>Price:</span>
                    <span className={styles.priceValue}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                    {item.quantity > 1 && (
                      <span className={styles.priceUnit}>
                        ${item.price.toLocaleString()} each
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.cartItemActions}>
                  <button
                    className={styles.cartActionLink}
                    onClick={() => saveForLater(item.id)}
                  >
                    Save for later
                  </button>
                  <span className={styles.cartActionSeparator}>•</span>
                  <button
                    className={styles.cartActionLink}
                    onClick={() => moveToWishlist(item.id)}
                  >
                    Move to wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Saved for Later Section */}
          {state.savedForLater.length > 0 && (
            <div className={styles.savedForLaterSection}>
              <h2 className={styles.savedForLaterTitle}>Saved for Later</h2>
              {state.savedForLater.map((item) => (
                <div key={item.id} className={styles.savedItemCard}>
                  <div className={styles.savedItemImageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className={styles.savedItemImage}
                    />
                  </div>
                  <div className={styles.savedItemInfo}>
                    <h4 className={styles.savedItemName}>{item.name}</h4>
                    <p className={styles.savedItemPrice}>${item.price.toLocaleString()}</p>
                  </div>
                  <button
                    className={styles.addBackButton}
                    onClick={() => {
                      // Move back to cart using the context method
                      moveToCart(item.id);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className={styles.orderSummary}>
          <h2 className={styles.orderSummaryTitle}>Order Summary</h2>

          <div className={styles.orderSummaryRow}>
            <span className={styles.orderSummaryLabel}>Subtotal</span>
            <span className={styles.orderSummaryValue}>${subtotal.toLocaleString()}</span>
          </div>

          <div className={styles.orderSummaryRow}>
            <span className={styles.orderSummaryLabel}>
              Shipping
              {subtotal >= 500 && (
                <span className={styles.freeShippingBadge}>Free</span>
              )}
            </span>
            <span className={styles.orderSummaryValue}>
              {shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}
            </span>
          </div>

          <div className={styles.orderSummaryRow}>
            <span className={styles.orderSummaryLabel}>Estimated Tax</span>
            <span className={styles.orderSummaryValue}>${tax.toFixed(2)}</span>
          </div>

          {state.discount > 0 && (
            <div className={styles.orderSummaryRow}>
              <span className={styles.orderSummaryLabel}>
                Discount
                {state.promoCode && (
                  <span className={styles.promoCodeBadge}>{state.promoCode}</span>
                )}
              </span>
              <span className={styles.orderSummaryValueDiscount}>
                -${state.discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className={styles.orderSummaryDivider}></div>

          <div className={styles.orderSummaryTotal}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>${total.toFixed(2)}</span>
          </div>

          {/* Promo Code */}
          <div className={styles.promoCodeSection}>
            {state.promoCode ? (
              <div className={styles.promoCodeApplied}>
                <span>Promo code: {state.promoCode}</span>
                <button
                  className={styles.removePromoButton}
                  onClick={removePromoCode}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className={styles.promoCodeInput}>
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value);
                    setPromoError('');
                  }}
                  className={styles.promoInput}
                />
                <button
                  className={styles.applyPromoButton}
                  onClick={handleApplyPromo}
                >
                  Apply
                </button>
              </div>
            )}
            {promoError && (
              <p className={styles.promoError}>{promoError}</p>
            )}
          </div>

          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          {/* Trust Signals */}
          <div className={styles.trustSignals}>
            <div className={styles.trustSignal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4a2 2 0 012 2v9a2 2 0 01-2 2H6"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span>Free shipping over $500</span>
            </div>
            <div className={styles.trustSignal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span>30-day returns</span>
            </div>
            <div className={styles.trustSignal}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>White glove delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
