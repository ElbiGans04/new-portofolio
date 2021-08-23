import styled from 'styled-components';
import Text from './Text'

const Paragraph = styled(Text)`
  line-height: 2rem;

  @media (max-width: 768px) {
    & {
      line-height: 1.5rem;
    }
  }
`;


export default Paragraph