import styled from 'styled-components'
import resize from '../lib/module/resize'
const Heading = styled.h1`
  font-size: ${({size}) => size ? `${size}rem` : '1rem'};
  text-align: center;
  color: white;

  & span {
    font-weight: bold;
    color: var(--pink); 
  }

  // Media screen
  @media (max-width: 768px) {
    & {
      font-size :  ${({size, minSize}) => resize(size, 0.5, minSize)};
    }
  }

  @media (max-width: 576px) {
    & {
      font-size :  ${({size, minSize}) => resize(size, 1.5, minSize)};
    }
  }
`;

export default Heading;