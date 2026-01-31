'use client';

import React from 'react';
import Image from 'next/image';
import styles from './FeaturedPost.module.css';
import { Post } from './PostCard';

interface FeaturedPostProps {
  post: Post;
  onClick?: () => void;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post, onClick }) => {
  return (
    <article className={styles.featuredPost} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={post.image}
          alt={post.title}
          width={600}
          height={400}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 600px"
        />
        <div className={styles.imageOverlay} />
        <div className={styles.featuredBadge}>Featured</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.authorSection}>
          <div className={styles.avatarWrapper}>
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className={styles.avatar}
              sizes="48px"
            />
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.author.name}</span>
            <span className={styles.postMeta}>{post.category} • {post.style}</span>
          </div>
        </div>
        
        <h2 className={styles.title}>{post.title}</h2>
        
        {post.description && (
          <p className={styles.description}>{post.description}</p>
        )}
        
        <div className={styles.tags}>
          {post.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
