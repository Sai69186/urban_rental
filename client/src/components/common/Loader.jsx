import React from 'react';
import styled from 'styled-components';

const Loader = ({ size = '3rem', color = '#fff', inline = false, style, className }) => {
  return (
    <StyledWrapper $size={size} $color={color} $inline={inline} style={style} className={className}>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: ${props => props.$inline ? 'inline-flex' : 'flex'};
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  flex-shrink: 0;

  .loader {
    width: ${props => props.$size || '3rem'};
    height: ${props => props.$size || '3rem'};
    clear: both;
    margin: ${props => props.$inline ? '0' : '1rem auto'};
    border: max(1.5px, calc(${props => props.$size || '3rem'} * 0.04)) ${props => props.$color || '#fff'} solid;
    border-radius: 100%;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .loader:after,
  .loader:before {
    content: "";
    border-radius: 50%;
    position: absolute;
    width: inherit;
    height: inherit;
    animation: spVortex 2s infinite linear;
  }

  .loader:before {
    border-top: calc(${props => props.$size || '3rem'} * 0.17) ${props => props.$color || '#fff'} solid;
    top: calc(${props => props.$size || '3rem'} * -0.06);
    left: calc(-50% - (${props => props.$size || '3rem'} * 0.06));
    transform-origin: right center;
  }

  .loader:after {
    border-bottom: calc(${props => props.$size || '3rem'} * 0.17) ${props => props.$color || '#fff'} solid;
    top: calc(${props => props.$size || '3rem'} * 0.06);
    right: calc(-50% - (${props => props.$size || '3rem'} * 0.06));
    transform-origin: left center;
  }

  @keyframes spVortex {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(359deg);
    }
  }
`;

export default Loader;
