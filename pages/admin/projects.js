import useUser from "../../lib/hooks/useUser";
import Head from "next/head";
import styled from "styled-components";
import {
  IoAddOutline,
} from "react-icons/io5";
import Modal from "../../Components/Modal";
import React, { useState, useRef, useReducer } from "react";
import { CSSTransition, Transition } from "react-transition-group";
import Heading from "../../Components/Heading";
import Input from "../../Components/Input";
import Label from "../../Components/Label";
import Admin from '../../Components/Admin'
import Button from '../../Components/Button'
import {reducer} from '../../lib/hooks/reducer'
import {Context} from '../../lib/hooks/toolsContext'

export default function Projects() {
  const { user } = useUser({ redirectTo: "/login" });
  const [modal, setModal] = useState({ open: false, content: null });
  const ref = useRef(null);
  const [state, dispatch] = useReducer(reducer, {
    modal: false,
    url: "/api/projects",
    columns: ["name"],
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
  });

  if (!user || user.isLoggedIn === false) {
    return <div className="loader"></div>;
  }

  return (
    <Context.Provider value={{state, dispatch}}>
      <Head>
        <title>Admin Page</title>
      </Head>
      <Admin />

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
    </Context.Provider>
  );
}


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
          <Input type="text" id="title" placeholder="enter the project title" name="title" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="startDate">Date start of development: </Label>
          <Input type="date" id="startDate" placeholder="enter the start date of development" name="startDate" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="endDate">Date end of development:</Label>
          <Input id="endDate" type="date" placeholder="enter the end date of development" name='endDate'  required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="files">Images:</Label>
          <InputCollections type="file" name="image"></InputCollections>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="url">Url of website:</Label>
          <Input type="text" id="url" placeholder="enter url" name="url" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="description">Description :</Label>
          <Input type="text" id="description" name="description" placeholder="enter description of project" required></Input>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label>type of project :</Label>
          <ContainerCheckbox>
            <div>
              <Input
                name="type"
                type="radio"
                id="work"
                value="work"
                required
              ></Input>
              <Label htmlFor="work">Work project</Label>
            </div>
            <div>
              <Input
                name="type"
                type="radio"
                id="personal"
                value="personal"
                required
              ></Input>
              <Label htmlFor="work">Personal Project</Label>
            </div>
          </ContainerCheckbox>
        </ModalContentAddContentRow>

        <ModalContentAddContentRow>
          <Label htmlFor="tool">tool :</Label>
          <InputCollections type="select" name="tool"></InputCollections>
        </ModalContentAddContentRow>
      </ModalContentAddContent>
      <ModalContentAddFooter>
        <Button>
          ADD Project
        </Button>
      </ModalContentAddFooter>
    </ModalContentAdd>
  );
}

function InputCollections(props) {
  const [inputCount, setInputCount ] = useState(1);
  const collectionInput = [];
  for (let i = 0; i < inputCount; i++) { 
    const element = props.type === 'select' ? <select {...props}></select> : <Input {...props}/>;
    collectionInput.push(element);
  }
  return (
    <ContainerInputs>
      <Button onClick={() => setInputCount(state => state + 1)}>
        <IoAddOutline />
      </Button>
      {
        collectionInput
      }
    </ContainerInputs>
  );
}

function Delete() {
  return <h1>Delete</h1>;
}

// Styled Component

//
// Modal add content
//

const ModalContentAdd = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  justify-items: center;
  gap: 2rem;
  align-items: center;
  @media (min-width: 768px) {
    & {
      padding: 2rem;
    }
  }
`;

const ModalContentAddContent = styled.div`
  width: 60%;
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

const ModalContentAddFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const ModalContentAddContentRow = styled.div`
  display: grid;
  justify-items: space-between;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  padding: 0.8rem;
  gap: 0.8rem;
`;

const ContainerCheckbox = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 0.8rem;

  & label {
    font-size: 1rem;
    font-weight: normal;
  }
`;

const ContainerInputs = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  gap: .5rem;

  & button {
    transition: var(--transition);
    opacity: 0;
    position: absolute;
    left: -40px;
    width: 30px;
    height: 30px;
    top: 50%;
    margin-top: -15px;
  }

  &:hover button {
    opacity: 1;
  }
`;
