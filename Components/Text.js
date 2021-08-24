import styled from 'styled-components'
function calcute(value, number) {

  // parse 
  let result = value - number;
  
  return `${result < 1 ? 1 : result}rem`

}

const Text = styled.h1`
  font-size: ${({size}) => `${size}rem` || '1rem'};
  margin: ${ ({margin}) => margin || '0 0 0 0'};
  color: ${({color}) => color || 'white'};
  text-align: center;

  @media (max-width: 768px) {
    & {
      font-size :  ${({size}) => calcute(size, 0.5)};
    }
  }

  @media (max-width: 576px) {
    & {
      font-size :  ${({size}) => calcute(size, 1.5)};
    }
  }
  
  & span {
    color: var(--pink);
    font-weight: bold;
  }
`;

export default Text;