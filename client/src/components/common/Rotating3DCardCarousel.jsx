import React from 'react';
import styled from 'styled-components';

const HOUSE_CARDS = [
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    title: 'Modern Luxury Villa',
    price: '₹1,25,000/mo',
    color: '142, 249, 252'
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    title: 'Penthouse Suite',
    price: '₹95,000/mo',
    color: '142, 252, 204'
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    title: 'Zen Sanctuary Villa',
    price: '₹1,80,000/mo',
    color: '142, 252, 157'
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    title: 'Minimalist Loft',
    price: '₹65,000/mo',
    color: '215, 252, 142'
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    title: 'Garden Residence',
    price: '₹85,000/mo',
    color: '252, 252, 142'
  },
  {
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    title: 'Skyline Apartment',
    price: '₹72,000/mo',
    color: '252, 208, 142'
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    title: 'Architectural Studio',
    price: '₹55,000/mo',
    color: '252, 142, 142'
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    title: 'Glassfront Haven',
    price: '₹1,10,000/mo',
    color: '252, 142, 239'
  },
  {
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    title: 'Contemporary Estate',
    price: '₹1,50,000/mo',
    color: '204, 142, 252'
  },
  {
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    title: 'Waterfront Living',
    price: '₹1,35,000/mo',
    color: '142, 202, 252'
  }
];

const Card = ({ className, style, isBackdrop = true }) => {
  return (
    <StyledWrapper className={className} style={style} $isBackdrop={isBackdrop}>
      <div className="wrapper">
        <div className="inner" style={{ '--quantity': HOUSE_CARDS.length }}>
          {HOUSE_CARDS.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                '--index': idx,
                '--color-card': item.color
              }}
            >
              <div
                className="img"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(5,7,10,0.1) 0%, rgba(5,7,10,0.7) 100%), url(${item.image})`
                }}
              >
                <div className="card-info">
                  <span className="card-title">{item.title}</span>
                  <span className="card-price">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 480px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  pointer-events: none;
  z-index: 2;

  .wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    perspective: 1400px;
  }

  .inner {
    --w: 145px;
    --h: 205px;
    --translateZ: 340px;
    --rotateX: -10deg;
    --perspective: 1400px;
    position: absolute;
    width: var(--w);
    height: var(--h);
    top: calc(50% - (var(--h) / 2));
    left: calc(50% - (var(--w) / 2));
    z-index: 2;
    transform-style: preserve-3d;
    transform: perspective(var(--perspective));
    animation: rotating 36s linear infinite;
  }

  @keyframes rotating {
    from {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(0);
    }
    to {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX))
        rotateY(1turn);
    }
  }

  .card {
    position: absolute;
    border: 1.5px solid rgba(var(--color-card), 0.85);
    border-radius: 16px;
    overflow: hidden;
    inset: 0;
    box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.85), 0 0 20px rgba(var(--color-card), 0.3);
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(var(--translateZ));
    background: rgba(8, 12, 18, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0.65rem;
    position: relative;
    opacity: 0.95;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    text-align: left;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    background: rgba(5, 7, 10, 0.82);
    padding: 0.4rem 0.55rem;
    border-radius: 9px;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }

  .card-title {
    font-size: 0.74rem;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-price {
    font-size: 0.72rem;
    font-weight: 800;
    color: rgb(var(--color-card));
  }

  @media (max-width: 1200px) {
    .inner {
      --w: 130px;
      --h: 185px;
      --translateZ: 290px;
      --rotateX: -8deg;
    }
  }

  @media (max-width: 768px) {
    min-height: 380px;
    .inner {
      --w: 105px;
      --h: 150px;
      --translateZ: 220px;
      --rotateX: -6deg;
    }
  }
`;

export default Card;


