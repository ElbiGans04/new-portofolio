import styled from 'styled-components'
function calcute(value, number, minSize) {

  // parse 
  let result = (value || 1) - number;

  // Jika lebih kecil
  result = result < minSize ? minSize : result;
  
  return `${result < 1 ? 1 : result}rem`

}

const Text = styled.h1`
  font-size: ${({size}) => size ? `${size}rem` : '1rem'};
  margin: ${ ({margin}) => margin || '0 0 0 0'};
  // Kalau bisa color dihilangkan agar konsisten
  color: ${({color}) => color || 'white'};
  text-align: ${({align}) => align || 'center'};
  font-weight: ${({fontWeight}) => fontWeight || ''};
  text-indent: ${({textIndent}) => textIndent || ''};
  line-height: ${({lineHeight}) => lineHeight || ''};

  @media (max-width: 768px) {
    & {
      font-size :  ${({size, minSize}) => calcute(size, 0.5, minSize)};
    }
  }

  @media (max-width: 576px) {
    & {
      font-size :  ${({size, minSize}) => calcute(size, 1.5, minSize)};
    }
  }
  
  & span {
    color: var(--pink);
    font-weight: ${({fontWeight}) => fontWeight || 'bold'};
  }
`;

export default Text;