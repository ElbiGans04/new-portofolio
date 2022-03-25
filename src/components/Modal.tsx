import React, { Dispatch } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Heading from '@src/components/Heading';
import Button from '@src/components/Button';

const ModalComponent = React.forwardRef<
  HTMLDivElement,
  {
    width: string;
    height: string;
    updateState: Dispatch<any>;
    defaultState: any;
    children: React.ReactNode;
  }
>(({ defaultState, children, updateState, width, height }, ref) => (
  <Modal ref={ref}>
    <ModalMain width={width} height={height}>
      <ModalAction>
        <ModalClose onClick={() => updateState(defaultState)}>
          <span />
          <span />
        </ModalClose>
      </ModalAction>
      <ModalContent>{children}</ModalContent>
    </ModalMain>
  </Modal>
));

ModalComponent.displayName = 'Modal';

export default ModalComponent;

export function ModalAdmin({
  status,
  message,
  dispatch,
  children,
}: {
  status: string;
  message: string | null;
  children: JSX.Element;
  dispatch: Dispatch<any>;
}): JSX.Element {
  switch (status) {
    case 'loading': {
      return (
        <ModalMain2>
          <ModalContent2>
            <div className="loader" />
          </ModalContent2>
        </ModalMain2>
      );
    }

    case 'iddle': {
      if (message) {
        return (
          <ModalMain2>
            <ModalContent2>
              <Heading size={1} minSize={1}>
                {message}
              </Heading>
            </ModalContent2>
            <ModalFooter>
              <Button onClick={() => dispatch({ type: 'modal/close' })}>
                CLOSE
              </Button>
            </ModalFooter>
          </ModalMain2>
        );
      }

      return children;
    }
    default:
      return <></>;
  }
}

const Modal = styled.div`
  position: fixed;
  background-color: rgba(31, 33, 39, 0.8);
  transition: var(--transition);
  box-sizing: border-box;
  opacity: 0;
  width: 1px;
  height: 1px;
  top: 50%;
  left: 50%;
  margin-top: -0.5px;
  margin-left: -0.5px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: var(--dark);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--pink);
    border-radius: 10px;
  }
`;
const ModalMain = styled.div<{ width: string; height: string }>`
  margin: 0px auto;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  box-sizing: border-box;
  background-color: var(--dark);
  box-shadow: 5px 12px 17px rgb(0 0 0 / 30%);

  @media (max-width: 768px) {
    & {
      width: 100%;
    }
  }
`;

const ModalAction = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 2rem;
  box-sizing: border-box;
  padding: 0.5rem;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const ModalClose = styled.div`
  width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;

  & span {
    width: 100%;
    height: 4px;
    background-color: var(--pink);
  }

  & span:first-child {
    transform: translate(-3px, 1px) rotate(45deg);
  }
  & span:last-child {
    transform: translate(-4px, -4px) rotate(-45deg);
  }
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
`;

export const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;

//
// // Untuk ModalAdmin
//
export const ModalMain2 = styled.div`
  color: white;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.5);
`;

export const ModalContent2 = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//
// // Modal Form
//

export const ModalForm = styled.form`
  width: 100%;
  height: 100%;
`;

export const ModalFormContent = styled.div`
  width: 100%;
  @media (min-width: 768px) {
    & {
      padding: 2rem;
    }
  }
`;

export const ModalFormContentRow = styled.div`
  display: grid;
  justify-items: space-between;
  align-items: center;
  padding: 0.8rem;
  gap: 0.8rem;
`;

export const ModalFormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.5);
`;
