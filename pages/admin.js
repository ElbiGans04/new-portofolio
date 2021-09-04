import useUser from "../lib/hooks/useUser";
import Head from "next/head";
import styled from "styled-components";
import {
  IoTrashBinOutline,
  IoAddOutline,
  IoPencilSharp,
} from "react-icons/io5";
import Modal from "../Components/Modal";
import React, { useState, useRef } from "react";
import { CSSTransition, Transition } from "react-transition-group";
import Heading from "../Components/Heading";
import Input from "../Components/Input";
import Label from "../Components/Label";

function Admin() {
  const { user } = useUser({ redirectTo: "/login" });
  const [modal, setModal] = useState({ open: false, content: null });
  const ref = useRef(null);

  if (!user || user.isLoggedIn === false) {
    return <div>loading...</div>;
  }

  return (
    <Container>
      <Head>
        <title>Admin Page</title>
      </Head>
      <ContainerButtons>
        <Button onClick={() => setModal({ open: true, content: Add })}>
          <IoAddOutline />
          Add Project
        </Button>
      </ContainerButtons>
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
            <Row setModal={setModal} />
            <Row setModal={setModal} />
          </tbody>
        </Table>
      </ContainerTable>

      {/* Modal Page */}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={modal.open}
        timeout={500}
      >
        <Modal
          ref={ref}
          updateState={setModal}
          defaultState={{ open: false, content: null }}
        >
          {modal.content !== null && modal.content()}
        </Modal>
      </CSSTransition>
      {/* End of modal page */}
    </Container>
  );
}

function Row({ project, setModal }) {
  const [details, setDetails] = useState(false);
  const ref = useRef(null);
  console.log(ref)
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
              onClick={() => setModal({ open: true, content: Delete })}
              title="delete the project"
            >
              <IoTrashBinOutline></IoTrashBinOutline>
            </Button>
            <Button
              onClick={() => setModal({ open: true, content: Update })}
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
              <div>Start of date project</div>
              <div>{": "}13/02/2021</div>
              <div>End of date project</div>
              <div>{": "}09/12/2012</div>
              <div>Tools</div>
              <div>{": "}Express React</div>
              <div>Url</div>
              <div>{": "}https://facebook.com</div>
              <div>Description</div>
              <div>{": "}this is a project that i make for people can know about corona</div>
            </RowDetailsContentContent>
          </RowDetailsContent>
        </RowDetails>  
      </CSSTransition>
    </React.Fragment>
  );
}

export default Admin;

function Update() {
  return <h1>Update</h1>;
}

function Add() {
  return (
    <ModalContentAdd>
      <Heading size={3}>
        <span>Add Project</span>
      </Heading>
      <ModalContentAddContent>
        <ModalContentAddContentRow>
          <Label htmlFor="title">Title: </Label>
          <Input type="text" id="title" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="startDate">Date start of development: </Label>
          <Input type="date" id="startDate" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="endDate">Date end of development:</Label>
          <Input id="endDate" type="date" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="files">Images:</Label>
          <Input id="files" type="file" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="url">Url of website:</Label>
          <Input type="text" id="url" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="description">Description :</Label>
          <Input type="text" id="description" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label>type of project :</Label>
          <ContainerInput>
            <Input
              name="type"
              type="radio"
              id="work"
              value="work"
              required
            ></Input>
            <Label htmlFor="work">Work project</Label>
            <Input
              name="type"
              type="radio"
              id="personal"
              value="personal"
              required
            ></Input>
            <Label htmlFor="work">Personal Project</Label>
          </ContainerInput>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="tool">tool :</Label>
          <Input type="text" id="tool" required></Input>
        </ModalContentAddContentRow>
      </ModalContentAddContent>
    </ModalContentAdd>
  );
}

function Delete() {
  return <h1>Delete</h1>;
}

// Styled Component

const Container = styled.div`
  width: 80%;
  min-height: 50vh;

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;

const ContainerButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
`;

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
  border: none!important;
  transition: var(--transition);
  font-size: 0;
  height: 0;
`;

const RowDetailsContent = styled.td`
  padding: 0!important;
  transition: var(--transition);
`;

const RowDetailsContentContent = styled.div`
  width: 100%;
  height: 0px;
  overflow: hidden;
  transition: var(--transition);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  justify-items: start;
  align-items: center;
`;

const TdActions = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  appearance: none;
  padding: 0.3rem;
  margin: 0.3rem;
  border-radius: 0.3rem;
  // background: var(--dark);
  // border: 3px solid var(--pink);
  // color: white;
  border: none;
  background-color: var(--pink);
  color: var(--dark);
  font-weight: bold;
  cursor: pointer;
`;

//
// Modal add content
//

const ModalContentAdd = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  padding: 2rem;
  justify-items: center;
  align-items: center;
  gap: 2rem;
`;

const ModalContentAddContent = styled.div`
  width: 50%;
  height: 100%;

  @media (max-width: 992px) {
    & {
      width: 70%;
    }
  }

  @media (max-width: 992px) {
    & {
      width: 100%;
    }
  }
`;

const ModalContentAddContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
`;

const ContainerInput = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
`;
