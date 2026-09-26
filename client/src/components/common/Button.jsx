import React from 'react';
import styled from 'styled-components';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'dark' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  style = {},
  icon: Icon = null,
  ...props
}) => {
  return (
    <StyledWrapper $variant={variant} $size={size}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`btn-31 ${variant} ${size} ${className}`}
        style={style}
        {...props}
      >
        <span className="text-container">
          <span className="text">
            {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="btn-icon" />}
            {children}
          </span>
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-flex;

  .btn-31,
  .btn-31 *,
  .btn-31 :after,
  .btn-31 :before,
  .btn-31:after,
  .btn-31:before {
    border: 0 solid;
    box-sizing: border-box;
  }

  .btn-31 {
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: button;
    background-color: ${props =>
      props.$variant === 'primary'
        ? '#e0231c'
        : props.$variant === 'gold'
        ? '#c9a24a'
        : props.$variant === 'emerald'
        ? '#10b981'
        : '#0a0e14'};
    background-image: none;
    color: #fff;
    cursor: pointer;
    font-family: var(--font-main, 'Onest', sans-serif);
    font-size: ${props => (props.$size === 'sm' ? '0.78rem' : props.$size === 'lg' ? '1.05rem' : '0.88rem')};
    font-weight: 800;
    line-height: 1.5;
    margin: 0;
    padding: ${props =>
      props.$size === 'sm' ? '0.45rem 1rem' : props.$size === 'lg' ? '0.9rem 2.2rem' : '0.7rem 1.6rem'};
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    position: relative;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: ${props =>
      props.$variant === 'primary'
        ? '0 4px 18px rgba(224, 35, 28, 0.35)'
        : '0 4px 15px rgba(0, 0, 0, 0.4)'};
  }

  .btn-31:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props =>
      props.$variant === 'primary'
        ? '0 8px 25px rgba(224, 35, 28, 0.5)'
        : '0 8px 25px rgba(0, 0, 0, 0.6)'};
  }

  .btn-31:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .btn-31:-moz-focusring {
    outline: auto;
  }

  .btn-31 svg {
    display: inline-block;
    vertical-align: middle;
  }

  .btn-31 [hidden] {
    display: none;
  }

  .btn-31:before {
    --progress: 100%;
    background: #fff;
    -webkit-clip-path: polygon(
      100% 0,
      var(--progress) var(--progress),
      0 100%,
      100% 100%
    );
    clip-path: polygon(
      100% 0,
      var(--progress) var(--progress),
      0 100%,
      100% 100%
    );
    content: "";
    inset: 0;
    position: absolute;
    transition: -webkit-clip-path 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    transition: clip-path 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
    pointer-events: none;
  }

  .btn-31:hover:before {
    --progress: 0%;
  }

  .btn-31 .text-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }

  .btn-31 .text {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: 800;
    position: relative;
    color: #ffffff;
    transition: color 0.2s ease;
  }

  .btn-31:hover .text {
    color: #05070a !important;
    -webkit-animation: move-up-alternate 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    animation: move-up-alternate 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @-webkit-keyframes move-up-alternate {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    49% {
      transform: translateY(-100%);
      opacity: 0;
    }
    50% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes move-up-alternate {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    49% {
      transform: translateY(-100%);
      opacity: 0;
    }
    50% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export default Button;
