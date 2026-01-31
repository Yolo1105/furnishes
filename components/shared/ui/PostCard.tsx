'use client';

import React from 'react';
import Image from 'next/image';
import styles from './PostCard.module.css';

export interface Post {
  id: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  description?: string;
  tags: string[];
  category: string;
  style: string;
  featured?: boolean;
  views?: number;
}

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  return (
    <article className={styles.postCard} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={300}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className={styles.imageOverlay} />
        {post.featured && (
          <div className={styles.featuredBadge}>Featured</div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.authorSection}>
          <div className={styles.avatarWrapper}>
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className={styles.avatar}
              sizes="40px"
            />
          </div>
          <span className={styles.authorName}>{post.author.name}</span>
        </div>
        
        <h3 className={styles.title}>{post.title}</h3>
        
        {post.description && (
          <p className={styles.description}>{post.description}</p>
        )}
        
        <div className={styles.tags}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className={styles.tagMore}>+{post.tags.length - 3}</span>
          )}
        </div>
        
        {post.views !== undefined && (
          <div className={styles.metadata}>
            <span className={styles.views}>{post.views} views</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
