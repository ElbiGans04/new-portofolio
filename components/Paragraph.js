import styled from 'styled-components';
import resize from '../lib/module/resize'

const Paragraph = styled.p`
  color: white;
  font-size: ${({size = 1}) => `${size}rem`};
  text-align: ${({align}) => align || 'center'};
  text-indent: ${({textIndent}) => textIndent || ''};
  line-height: ${({lineHeight}) => lineHeight || ''};


  & span {
    color: var(--pink);
    font-weight: ${({fontWeight}) => fontWeight || 'bold'};
  }


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


export default Paragraph