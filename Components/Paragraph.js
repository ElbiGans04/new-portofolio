import styled from 'styled-components';
import resize from '../lib/module/resize'

const Paragraph = styled.p`
  color: white;
  margin: ${({margin}) => margin || ''};
  text-align: ${({align}) => align || 'center'};
  font-weight: ${({fontWeight}) => fontWeight || ''};
  text-indent: ${({textIndent}) => textIndent || ''};
  line-height: ${({lineHeight}) => lineHeight || ''};


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

  & span {
    color: var(--pink);
    font-weight: ${({fontWeight}) => fontWeight || 'bold'};
  }
`;


export default Paragraph