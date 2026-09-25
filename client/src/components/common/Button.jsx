import React from 'react';
import Loader from './Loader';

/**
 * Universal Button Component
 * Supports loading state powered by the custom spVortex Loader
 */
const Button = ({
  children,
  loading = false,
  loadingText,
  loaderSize = '1.15rem',
  loaderColor = '#ffffff',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'kage'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  onClick,
  ...props
}) => {
  // Construct class names
  let variantClass = '';
  if (variant === 'primary') variantClass = 'btn-primary';
  else if (variant === 'secondary') variantClass = 'btn-secondary';
  else if (variant === 'danger') variantClass = 'btn-danger';
  else if (variant === 'success') variantClass = 'btn-success';
  else if (variant === 'outline') variantClass = 'btn-outline';
  else if (variant === 'ghost') variantClass = 'btn-ghost';
  else if (variant === 'kage') variantClass = 'kage-btn-vermilion';

  let sizeClass = '';
  if (size === 'sm') sizeClass = 'btn-sm';
  else if (size === 'lg') sizeClass = 'btn-lg';

  const baseClass = variant === 'kage' ? '' : 'btn';
  const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClassName}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <>
          <Loader size={loaderSize} color={loaderColor} inline={true} />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        </>
      )}
    </button>
  );
};

export default Button;
