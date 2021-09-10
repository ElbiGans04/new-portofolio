import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import React, { useState, useRef } from 'react'
import Button from './Button'
import {
    IoTrashBinOutline,
    IoAddOutline,
    IoPencilSharp,
  } from "react-icons/io5";
  
export default function TableComponent() {
  return (
    <ContainerTable>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Type Project</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <Row />
          <Row />
        </tbody>
      </Table>
    </ContainerTable>
  );
}

function Row({ project}) {
  const [details, setDetails] = useState(false);
  const ref = useRef(null);

  return (
    <React.Fragment>
      <tr>
        <td>
          <Button
            title="see details of project"
            onClick={() => setDetails((state) => !state)}
          >
            <IoAddOutline />
          </Button>
        </td>
        <td>Elbi library</td>
        <td>Personal project</td>
        <td>
          <TdActions>
            <Button
             
              title="delete the project"
            >
              <IoTrashBinOutline></IoTrashBinOutline>
            </Button>
            <Button

              title="update the project"
            >
              <IoPencilSharp></IoPencilSharp>
            </Button>
          </TdActions>
        </td>
      </tr>
      <CSSTransition
        nodeRef={ref}
        classNames="row-details"
        in={details}
        timeout={500}
      >
        <RowDetails ref={ref}>
          <RowDetailsContent colSpan="4">
            <RowDetailsContentContent>
              {/* <h1>Hello World</h1> */}
              <div>Start of date project</div>
              <div>{": "}13/02/2021</div>
              <div>End of date project</div>
              <div>{": "}09/12/2012</div>
              <div>Tools</div>
              <div>{": "}Express React</div>
              <div>Url</div>
              <div>{": "}https://facebook.com</div>
              <div>Description</div>
              <div>
                {": "}this is a project that i make for people can know about
                corona
              </div>
            </RowDetailsContentContent>
          </RowDetailsContent>
        </RowDetails>
      </CSSTransition>
    </React.Fragment>
  );
}


// Styled component
const ContainerTable = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  background-color: var(--dark2);
  padding: 1rem;
  border-radius: 0.8rem;

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

const RowDetails = styled.tr`
  border: none !important;
  transition: var(--transition);
  line-height: 0;
  height: 0%;
  font-size: 0;
`;

const RowDetailsContent = styled.td`
  padding: 0 !important;
  overflow: hidden;
  transition: var(--transition);
  height: 0%;
`;

const RowDetailsContentContent = styled.div`
  display: grid;
  justify-items: start;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  transition: var(--transition);
  padding: 0;
  overflow: hidden;
  text-align: start;
`;

const TdActions = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;