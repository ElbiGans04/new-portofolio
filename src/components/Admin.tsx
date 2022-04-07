import Button from '@src/components/Button';
import ModalComponent, { GlobalStyle, ModalAdmin } from '@src/components/Modal';
import { action, DocAdminDataSingular } from '@src/types/admin';
import React, { Dispatch } from 'react';
import {
  IoAddOutline,
  IoPencilSharp,
  IoTrashBinOutline,
} from 'react-icons/io5';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import Heading from './Heading';

export function AdminError() {
  return (
    <ContainerError>
      <Heading size={1.5} minSize={1.3}>
        An error occurred when <span>trying to request data</span>
      </Heading>
      ;
      <Heading minSize={1} size={1.3}>
        Please <span>restart this page</span>
      </Heading>
      ;
    </ContainerError>
  );
}

export function AdminLoading() {
  return (
    <Container>
      <div className="loader" />
    </Container>
  );
}

export const AdminModal = React.forwardRef<
  HTMLDivElement,
  {
    modal: 'add' | 'update' | 'delete' | null;
    dispatch: Dispatch<action>;
    message: string | null;
    status: string;
    children: JSX.Element;
  }
>(({ modal, dispatch, message, status, children }, ref) => {
  return (
    <>
      {modal && <GlobalStyle />}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={modal !== null}
        timeout={500}
      >
        <ModalComponent
          width="700px"
          height=""
          updateState={dispatch}
          defaultState={{ type: 'modal/close' }}
          ref={ref}
        >
          <ModalAdmin status={status} message={message} dispatch={dispatch}>
            {children}
          </ModalAdmin>
        </ModalComponent>
      </CSSTransition>
    </>
  );
});

AdminModal.displayName = 'AdminModal';

export default function Admin({
  dispatch,

  children,
}: {
  dispatch: Dispatch<action>;
  // Children: () => JSX.Element;
  children: JSX.Element;
}) {
  return (
    <Container>
      <ContainerButtons>
        <Button onClick={() => dispatch({ type: 'modal/open/add' })}>
          <IoAddOutline />
          Add Entity
        </Button>
      </ContainerButtons>
      <ContainerTable>
        <Table>
          {children}
          {/* <Children /> */}
        </Table>
      </ContainerTable>
    </Container>
  );
}

export function TdButton({
  dispatch,
  payload,
}: {
  dispatch: React.Dispatch<action>;
  payload: DocAdminDataSingular;
}) {
  return (
    <td>
      <TdActions>
        <Button
          onClick={() =>
            dispatch({
              type: 'modal/open/delete',
              payload,
            })
          }
          title="delete the row"
        >
          <IoTrashBinOutline />
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: 'modal/open/update',
              payload,
            })
          }
          title="update the row"
        >
          <IoPencilSharp />
        </Button>
      </TdActions>
    </td>
  );
}

export const RowDetail = React.forwardRef<
  HTMLDivElement,
  { open: boolean; colSpan: number; children: JSX.Element; height: number }
>(({ open, colSpan, children, height }, ref) => {
  return (
    <>
      <CSSTransition
        nodeRef={ref}
        classNames="row-details"
        in={open == true}
        timeout={500}
      >
        <RowDetails borderBottom={open}>
          <RowDetailsContent colSpan={colSpan}>
            <RowDetailsContentContent height={height} ref={ref}>
              {children}
            </RowDetailsContentContent>
          </RowDetailsContent>
        </RowDetails>
      </CSSTransition>
    </>
  );
});
RowDetail.displayName = 'Row-Detail';

//
// // Styled Component
//
const Container = styled.div`
  width: 80%;
  min-height: 50vh;
  overflow: hidden;

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;

const ContainerError = styled.div`
  display: grid;
  gap" 0.3rem;
`;

const ContainerButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
`;

// Styled component
const ContainerTable = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  /* width */
  &::-webkit-scrollbar {
    height: 7px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: var(--dark2);
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--pink);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--pink2);
  }
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  background-color: var(--dark2);
  padding: 1rem;
  border-radius: 0.8rem;
  line-height: 1.5rem;
  & thead {
    border-bottom: 2px solid var(--pink);
  }

  & tbody tr {
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  }

  & tbody tr:last-child {
    border-bottom: none;
  }

  & th,
  & td {
    padding: 1rem;
    color: white;
    text-align: center;
    vertical-align: middle;
  }

  & th {
    padding: 1.5rem;
    font-weight: bold;
    color: var(--pink);
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    & {
      width: 200%;
    }

    & th {
      font-size: 1rem;
    }
  }
`;

const RowDetails = styled.tr<{ borderBottom: boolean }>`
  border-bottom: ${({ borderBottom }) =>
    borderBottom ? '2px solid rgba(0,0,0,0.2)' : '0'} !important;
`;

const RowDetailsContent = styled.td`
  padding: 0 !important;
`;

const RowDetailsContentContent = styled.div<{ height: number }>`
  overflow: hidden;
  max-height: ${({ height }) => `${height}px`};
  padding: 0;
  overflow: hidden;
  text-align: center;
  transition: var(--transition);
  display: grid;
  justify-items: center;
  align-items: center;
`;

export const RowDetailsContentContentContent = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  transition: var(--transition);
  padding: 0;
  overflow: hidden;
  text-align: center;
  margin: 1rem 0;
`;

export const TdActions = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  & > button {
    margin: 0.2rem;
  }
`;
