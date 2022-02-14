import styled from 'styled-components';
import resize from '@utils/resize';

const Paragraph = styled.p<{
  size: number;
  align?: string;
  textIndent?: string;
  fontWeight?: string;
  lineHeight?: string;
  minSize: number;
}>`
  color: white;
  font-size: ${({ size = 1 }) => `${size}rem`};
  text-align: ${({ align }) => align || 'center'};
  text-indent: ${({ textIndent }) => textIndent || ''};
  line-height: ${({ lineHeight }) => lineHeight || ''};

  & span {
    color: var(--pink);
    font-weight: ${({ fontWeight }) => fontWeight || 'bold'};
  }

  @media (max-width: 768px) {
    & {
      font-size: ${({ size, minSize }) => resize(size, 0.5, minSize)};
    }
  }

  @media (max-width: 576px) {
    & {
      font-size: ${({ size, minSize }) => resize(size, 1.5, minSize)};
    }
  }
`;

export default Paragraph;
