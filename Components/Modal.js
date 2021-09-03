import React from "react";
import styled from "styled-components"
const ModalComponent = React.forwardRef(({defaultState, children, updateState}, ref) => {
  return (
    <Modal ref={ref}>
      <ModalMain>
        <ModalAction>
          <ModalClose onClick={() => updateState(defaultState)}>
            <span></span>
            <span></span>
          </ModalClose>
        </ModalAction>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalMain>
    </Modal>
  );
});
export default ModalComponent;


const Modal = styled.div`
  position: fixed;
  background-color: var(--dark2);
  display: flex;
  justify-content: center;
  align-items: center;
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
`;
const ModalMain = styled.div`
  position: relative;
  width: 90%;
  height: 90%;
  box-sizing: border-box;
  background-color: var(--dark);
  box-shadow: 5px 12px 17px rgb(0 0 0 / 30%);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 7px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--pink);
    border-radius: 10px;
  }
`;

const ModalAction = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 10%;
  box-sizing: border-box;
  padding: 0.5rem;
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
    transform: translate(-3px,1px) rotate(45deg)
  }
  & span:last-child {
    transform: translate(-4px,-4px) rotate(-45deg)
  }
`;

const ModalContent = styled.div`
  width: 100%;
  height: 90%;
  @media (max-width: 768px) {
    & {
      padding: 1rem;
    }
  }
  // display: grid;
  // grid-template-rows: 2fr 1fr;
  // overflow: auto;
`;