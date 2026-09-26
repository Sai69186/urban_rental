import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Camera, Upload, Image as ImageIcon, Check, RefreshCw, X, Sparkles } from 'lucide-react';
import { getRealisticAvatar } from '../../utils/avatarHelper';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
];

const UploaderWrapper = styled.div`
  background: rgba(14, 19, 28, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  .uploader-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .avatar-preview-container {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    background: #090d14;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    .hover-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      opacity: 0;
      transition: opacity 0.2s ease;
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    &:hover .hover-overlay {
      opacity: 1;
    }
  }

  .dropzone {
    flex: 1;
    min-width: 220px;
    border: 2px dashed rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: rgba(255, 255, 255, 0.02);

    &:hover,
    &.dragover {
      border-color: #ff5a3c;
      background: rgba(224, 35, 28, 0.06);
    }
  }

  .presets-section {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .presets-grid {
    display: flex;
    gap: 0.65rem;
    overflow-x: auto;
    padding: 0.5rem 0;

    &::-webkit-scrollbar {
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
    }
  }

  .preset-thumb {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 2px solid transparent;
    overflow: hidden;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      transform: scale(1.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &.selected {
      border-color: #ff5a3c;
      box-shadow: 0 0 10px rgba(224, 35, 28, 0.4);
    }
  }
`;

const ProfilePhotoUploader = ({
  currentImage,
  userName = 'User',
  onImageChange,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const displayImage = currentImage || getRealisticAvatar({ name: userName });

  // Compress & resize image to optimal profile dimensions
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        if (onImageChange) {
          onImageChange(compressedBase64);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <UploaderWrapper>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            Profile Photo
          </h4>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0' }}>
            Upload your personal photo from your computer or pick a realistic avatar
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="btn btn-outline btn-sm"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
        >
          {showUrlInput ? 'Hide URL' : 'Use Image URL'}
        </button>
      </div>

      <div className="uploader-header">
        {/* Live Avatar Preview */}
        <div
          className="avatar-preview-container"
          onClick={() => fileInputRef.current?.click()}
          title="Click to choose a photo from your computer"
        >
          <img src={displayImage} alt={userName} />
          <div className="hover-overlay">
            <Camera size={18} />
            <span>Change</span>
          </div>
        </div>

        {/* Dropzone & Browse Button */}
        <div
          className={`dropzone ${isDragging ? 'dragover' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload size={22} color="#ff5a3c" style={{ margin: '0 auto 0.4rem' }} />
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', margin: '0 0 2px' }}>
            Click to upload photo from computer
          </p>
          <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
            Drag & drop PNG, JPG, or WEBP (Max 5MB)
          </p>
        </div>
      </div>

      {/* Optional URL Input */}
      {showUrlInput && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Paste custom image URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (urlInput.trim()) {
                onImageChange(urlInput.trim());
                setUrlInput('');
              }
            }}
          >
            Apply URL
          </button>
        </div>
      )}

      {/* Realistic Presets Selection Carousel */}
      <div className="presets-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Sparkles size={13} color="#c9a24a" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Or Pick From Curated Realistic Avatars
          </span>
        </div>

        <div className="presets-grid">
          {PRESET_AVATARS.map((preset, idx) => (
            <div
              key={idx}
              className={`preset-thumb ${currentImage === preset ? 'selected' : ''}`}
              onClick={() => onImageChange(preset)}
              title={`Select realistic preset ${idx + 1}`}
            >
              <img src={preset} alt={`Preset ${idx + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </UploaderWrapper>
  );
};

export default ProfilePhotoUploader;
