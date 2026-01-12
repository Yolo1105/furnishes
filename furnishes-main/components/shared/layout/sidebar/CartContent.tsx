'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import styles from '../RightSidebar.module.css';

const CartContent: React.FC = () => {
  const router = useRouter();
  const { state, subtotal, itemCount } = useCart();

  const handleViewFullCart = () => {
    router.push('/cart');
  };

  const handleCheckout = () => {
    router.push('/cart');
  };

  if (state.items.length === 0) {
    return (
      <div className={styles.cartContent}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Shopping Cart</h2>
        </div>
        <div className={styles.cartEmpty}>
          <div className={styles.cartEmptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d4c4b8" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h3 className={styles.cartEmptyTitle}>Your cart is empty</h3>
          <p className={styles.cartEmptyText}>Start adding items to your cart</p>
          <button
            className={styles.cartBrowseButton}
            onClick={() => router.push('/collections')}
          >
            Browse Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContent}>
      <div className={styles.cartHeader}>
        <div className={styles.cartHeaderTop}>
          <h2 className={styles.cartTitle}>Shopping Cart</h2>
        </div>
        <button
          className={styles.cartViewFullButton}
          onClick={handleViewFullCart}
        >
          View Full Cart →
        </button>
      </div>

      <div className={styles.cartItemsList}>
        {state.items.slice(0, 4).map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.cartItemImageWrapper}>
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className={styles.cartItemImage}
              />
            </div>
            <div className={styles.cartItemDetails}>
              <h4 className={styles.cartItemName}>{item.name}</h4>
              <p className={styles.cartItemDesigner}>{item.designer}</p>
              {(item.selectedColor || item.selectedSize) && (
                <div className={styles.cartItemVariants}>
                  {item.selectedColor && (
                    <span className={styles.cartItemVariant}>
                      Color: {item.selectedColor}
                    </span>
                  )}
                  {item.selectedSize && (
                    <span className={styles.cartItemVariant}>
                      Size: {item.selectedSize}
                    </span>
                  )}
                </div>
              )}
              <p className={styles.cartItemPrice}>
                ${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {state.items.length > 4 && (
          <div className={styles.cartMoreItems}>
            <p className={styles.cartMoreItemsText}>
              +{state.items.length - 4} more item{state.items.length - 4 !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      <div className={styles.cartFooter}>
        <div className={styles.cartSubtotal}>
          <span className={styles.cartSubtotalLabel}>Subtotal</span>
          <span className={styles.cartSubtotalValue}>${subtotal.toLocaleString()}</span>
        </div>
        <button
          className={styles.cartCheckoutButton}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartContent;
