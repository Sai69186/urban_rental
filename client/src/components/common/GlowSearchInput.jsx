import React from 'react';
import styled from 'styled-components';

const GlowSearchInput = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  onFilterClick,
  showFilter = true,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <StyledWrapper className={`glow-search-wrapper ${className}`} style={style}>
      <div id="poda">
        <div className="glow" />
        <div className="darkBorderBg" />
        <div className="white" />
        <div className="border" />
        <div id="main">
          <input
            placeholder={placeholder}
            type="text"
            name="text"
            className="input"
            value={value}
            onChange={onChange}
            {...rest}
          />
          <div id="input-mask" />
          <div id="pink-mask" />
          {showFilter && (
            <>
              <div className="filterBorder" />
              <div
                id="filter-icon"
                onClick={onFilterClick}
                style={{ cursor: onFilterClick ? 'pointer' : 'default' }}
                title="Filter"
              >
                <svg preserveAspectRatio="none" height={20} width={20} viewBox="4.8 4.56 14.832 15.408" fill="none">
                  <path
                    d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"
                    stroke="#d6d6e6"
                    strokeWidth={1.5}
                    strokeMiterlimit={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </>
          )}
          <div id="search-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              height={20}
              fill="none"
              className="feather feather-search"
            >
              <circle stroke="url(#search-glow)" r={8} cy={11} cx={11} />
              <line stroke="url(#searchl-glow)" y2="16.65" y1={22} x2="16.65" x1={22} />
              <defs>
                <linearGradient gradientTransform="rotate(50)" id="search-glow">
                  <stop stopColor="#ff5a3c" offset="0%" />
                  <stop stopColor="#e0231c" offset="50%" />
                  <stop stopColor="#c084fc" offset="100%" />
                </linearGradient>
                <linearGradient id="searchl-glow">
                  <stop stopColor="#e0231c" offset="0%" />
                  <stop stopColor="#ff5a3c" offset="100%" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-flex;
  width: 100%;
  max-width: 420px;

  #poda {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
  }

  .white,
  .border,
  .darkBorderBg,
  .glow {
    height: 100%;
    width: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 1;
    border-radius: 14px;
    filter: blur(3px);
  }

  .input {
    background-color: rgba(6, 9, 15, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    width: 100%;
    height: 48px;
    border-radius: 14px;
    color: #ffffff;
    padding-left: 48px;
    padding-right: 48px;
    font-size: 0.92rem;
    font-family: var(--font-main, sans-serif);
    transition: all 0.3s ease;
    box-sizing: border-box;
  }

  .input::placeholder {
    color: #94a3b8;
    font-size: 0.88rem;
  }

  .input:focus {
    outline: none;
    background-color: rgba(8, 12, 20, 0.95);
    border-color: rgba(224, 35, 28, 0.5);
  }

  #main {
    position: relative;
    width: 100%;
    z-index: 2;
  }

  #main:focus-within > #input-mask {
    display: none;
  }

  #input-mask {
    pointer-events: none;
    width: 80px;
    height: 20px;
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(6, 9, 15, 0.8));
    top: 14px;
    left: 50px;
  }

  #pink-mask {
    pointer-events: none;
    width: 30px;
    height: 20px;
    position: absolute;
    background: #e0231c;
    top: 10px;
    left: 10px;
    filter: blur(18px);
    opacity: 0.6;
    transition: all 1.5s ease;
  }

  #main:hover > #pink-mask {
    opacity: 0.2;
  }

  .white {
    border-radius: 14px;
    filter: blur(2px);
  }

  .white::before {
    content: "";
    z-index: -2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(83deg);
    position: absolute;
    width: 500px;
    height: 500px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.3);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0) 0%,
      #ff5a3c,
      rgba(0, 0, 0, 0) 8%,
      rgba(0, 0, 0, 0) 50%,
      #e0231c,
      rgba(0, 0, 0, 0) 58%
    );
    transition: all 1.5s ease;
  }

  .border {
    border-radius: 14px;
    filter: blur(0.5px);
  }

  .border::before {
    content: "";
    z-index: -2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(70deg);
    position: absolute;
    width: 500px;
    height: 500px;
    filter: brightness(1.2);
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #05070a,
      #e0231c 6%,
      #05070a 15%,
      #05070a 50%,
      #ff5a3c 60%,
      #05070a 65%
    );
    transition: all 1.5s ease;
  }

  .darkBorderBg::before {
    content: "";
    z-index: -2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(82deg);
    position: absolute;
    width: 500px;
    height: 500px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #e0231c,
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0) 50%,
      #c084fc,
      rgba(0, 0, 0, 0) 60%
    );
    transition: all 1.5s ease;
  }

  #poda:hover > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(-98deg);
  }
  #poda:hover > .glow::before {
    transform: translate(-50%, -50%) rotate(-120deg);
  }
  #poda:hover > .white::before {
    transform: translate(-50%, -50%) rotate(-97deg);
  }
  #poda:hover > .border::before {
    transform: translate(-50%, -50%) rotate(-110deg);
  }

  #poda:focus-within > .darkBorderBg::before {
    transform: translate(-50%, -50%) rotate(442deg);
    transition: all 3s ease;
  }
  #poda:focus-within > .glow::before {
    transform: translate(-50%, -50%) rotate(420deg);
    transition: all 3s ease;
  }
  #poda:focus-within > .white::before {
    transform: translate(-50%, -50%) rotate(443deg);
    transition: all 3s ease;
  }
  #poda:focus-within > .border::before {
    transform: translate(-50%, -50%) rotate(430deg);
    transition: all 3s ease;
  }

  .glow {
    overflow: hidden;
    filter: blur(24px);
    opacity: 0.35;
  }

  .glow:before {
    content: "";
    z-index: -2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(60deg);
    position: absolute;
    width: 600px;
    height: 600px;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-image: conic-gradient(
      #000,
      #e0231c 8%,
      #000 38%,
      #000 50%,
      #ff5a3c 60%,
      #000 87%
    );
    transition: all 1.5s ease;
  }

  #filter-icon {
    position: absolute;
    top: 6px;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    height: 36px;
    width: 36px;
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(26, 32, 48, 0.9), rgba(10, 14, 24, 0.95));
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease;
  }

  #filter-icon:hover {
    border-color: rgba(224, 35, 28, 0.5);
    background: rgba(224, 35, 28, 0.15);
  }

  .filterBorder {
    height: 38px;
    width: 38px;
    position: absolute;
    overflow: hidden;
    top: 5px;
    right: 5px;
    border-radius: 11px;
    z-index: 2;
  }

  .filterBorder::before {
    content: "";
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
    position: absolute;
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    background-position: 0 0;
    filter: brightness(1.35);
    background-image: conic-gradient(
      rgba(0, 0, 0, 0),
      #e0231c,
      rgba(0, 0, 0, 0) 50%,
      rgba(0, 0, 0, 0) 50%,
      #ff5a3c,
      rgba(0, 0, 0, 0) 100%
    );
    animation: rotateFilter 4s linear infinite;
  }

  @keyframes rotateFilter {
    100% {
      transform: translate(-50%, -50%) rotate(450deg);
    }
  }

  #search-icon {
    position: absolute;
    left: 14px;
    top: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 3;
  }
`;

export default GlowSearchInput;
