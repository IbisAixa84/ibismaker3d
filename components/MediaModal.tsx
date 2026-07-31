"use client";

import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/data/products';

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function MediaModal({ product, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!product?.variant || product.variant !== 'video') return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    setIsMuted(true);
    video.play().catch(() => undefined);
  }, [product]);

  if (!product) return null;

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="zoom-modal" onClick={onClose} style={{ display: 'flex' }}>
      <span className="zoom-close" onClick={onClose}>&times;</span>
      {product.variant === 'video' ? (
        <div className="video-box" onClick={(event) => event.stopPropagation()}>
          <div className="video-shell">
            <video
              ref={videoRef}
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              className="video-player"
              poster={product.image}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={product.videoSrc} type="video/mp4" />
            </video>
            <div className="video-controls">
              <button type="button" className="video-control-btn" onClick={togglePlayback}>
                {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
              </button>
              <button type="button" className="video-control-btn" onClick={toggleMute}>
                {isMuted ? '🔈 Silenciar' : '🔊 Sonido'}
              </button>
            </div>
          </div>
          <div className="modal-meta">
            <h3>{product.title}</h3>
            <p>{product.important}</p>
          </div>
        </div>
      ) : (
        <div className="zoom-content" onClick={(event) => event.stopPropagation()}>
          <img src={product.image} alt={product.imageAlt || product.title} className="zoom-image" />
          <div className="zoom-caption">{product.imageAlt || product.title}</div>
        </div>
      )}
    </div>
  );
}
