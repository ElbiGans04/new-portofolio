import Head from "next/head";
import Admin from "../../Components/Admin";
import React, { useReducer, useRef, useState } from "react";
import { reducer } from "../../lib/hooks/reducer";
import { CSSTransition } from "react-transition-group";
import ModalComponent from "../../Components/Modal";
import styled from "styled-components";
import Input from "../../Components/Input";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import Heading from "../../Components/Heading";
import { useSWRConfig } from "swr";
import { IoAddOutline } from "react-icons/io5";
import changeFirstWord from "../../lib/module/upperFirstWord";
import Context from "../../lib/hooks/context";

export default function Projects() {
  const [state, dispatch] = useReducer(reducer, {
    // iddle, loading, success , failed,
    status: "iddle",
    message: null,
    modal: false,
    row: {
      id: false,
      columns: false,
      columnsValue: false,
    },
  });
  const [state2, setState2] = useState({
    dispatch,
    url: "/api/projects",
    columns: ["title", "description"],
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
    renameColumns: {
      startDate: "date",
    },
    specialTreatment: {
      tools: (value) => {
        let textResult = ``;
        value.forEach((text, index) => {
          textResult += changeFirstWord(text.name);
          if (index !== value.length - 1) textResult += `, `;
        });

        return <div>{textResult}</div>;
      },
      typeProject: (value) => {
        return <div>{changeFirstWord(value.name)}</div>;
      },
      images: (value) => {
        let textResult = ``;
        value.forEach((text, index) => {
          textResult += text.src;
          if (index !== value.length - 1) textResult += `, `;
        });

        return <div>{textResult}</div>;
      },
    },
  });
  const ref = useRef(null);

  return (
    <Context.Provider value={state2}>
      <Head>
        <title>Projects</title>
      </Head>
      <Admin dispatch={dispatch} />

      {/* Modal */}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={state.modal !== false ? true : false}
        timeout={500}
      >
        <ModalComponent
          width="500px"
          updateState={dispatch}
          defaultState={{ type: "modal/close" }}
          ref={ref}
        >
          {state.status === "loading" && <div className="loader"></div>}
          {state.status === "finish" && (
            <ModalMain>
              <ModalContent>
                <Heading>{state.message}</Heading>
              </ModalContent>
              <ModalFooter>
                <Button onClick={() => dispatch({ type: "modal/close" })}>
                  CLOSE
                </Button>
              </ModalFooter>
            </ModalMain>
          )}
          {state.status === "failed" && <h1>Error Bro, Try Request</h1>}
          {state.status === "iddle" && (
            <SwitchModal dispatch={dispatch} state={state} />
          )}
        </ModalComponent>
      </CSSTransition>
    </Context.Provider>
  );
}

function SwitchModal({
  state: {
    modal,
    row: { id, columns, columnsValue },
  },
  dispatch,
} = {}) {
  const { mutate } = useSWRConfig();
  switch (modal) {
    case "add":
      return (
        <ModalContentAdd>
          <ModalContentAddContent>
            <ModalContentAddContentRow>
              <Label htmlFor="title">Title: </Label>
              <Input
                type="text"
                id="title"
                placeholder="enter the project title"
                name="title"
                required
              ></Input>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="startDate">Date start of development: </Label>
              <Input
                type="date"
                id="startDate"
                placeholder="enter the start date of development"
                name="startDate"
                required
              ></Input>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="endDate">Date end of development:</Label>
              <Input
                id="endDate"
                type="date"
                placeholder="enter the end date of development"
                name="endDate"
                required
              ></Input>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="files">Images:</Label>
              <InputCollections type="file" name="image"></InputCollections>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="url">Url of website:</Label>
              <Input
                type="text"
                id="url"
                placeholder="enter url"
                name="url"
                required
              ></Input>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="description">Description :</Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="enter description of project"
                required
              ></Input>
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
            <Button>ADD Project</Button>
          </ModalContentAddFooter>
        </ModalContentAdd>
      );
    case "delete":
      return (
        <ModalMain>
          <ModalContent>
            <Heading>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent>
          <ModalFooter>
            <Button>DELETE</Button>
          </ModalFooter>
        </ModalMain>
      );
    case "update":
      const nameValue = columnsValue[columns.indexOf("name")];
      const asValue = columnsValue[columns.indexOf("as")];
      return (
        <Form>
          <FormContent>
            <FormContentRow>
              <Label htmlFor="name">Name:</Label>
              <Input
                name="name"
                defaultValue={nameValue}
                id="name"
                placeholder="insert name"
              />
            </FormContentRow>
            <FormContentRow>
              <Label htmlFor="as">As:</Label>
              <Input
                name="as"
                defaultValue={asValue}
                id="as"
                placeholder="insert as"
              />
            </FormContentRow>
          </FormContent>
          <ModalFooter>
            <Button type="submit">SUBMIT</Button>
          </ModalFooter>
        </Form>
      );
    default:
      return <> </>;
  }
}

function Update() {
  return <h1>Update</h1>;
}

function InputCollections(props) {
  const [inputCount, setInputCount] = useState(1);
  const collectionInput = [];
  for (let i = 0; i < inputCount; i++) {
    const element =
      props.type === "select" ? (
        <select {...props}></select>
      ) : (
        <Input {...props} />
      );
    collectionInput.push(element);
  }
  return (
    <ContainerInputs>
      <Button onClick={() => setInputCount((state) => state + 1)}>
        <IoAddOutline />
      </Button>
      {collectionInput}
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
  gap: 0.5rem;

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

// // // Styled Component
const Form = styled.form`
  width: 100%;
  height: 100%;
`;

const FormContent = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
  gap: 0.8rem;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  padding: 1rem;
`;

const FormContentRow = styled.div`
  width: 100%;
  padding: 0.3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
`;

const ModalMain = styled.div`
  width: 500px;
  color: white;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
