import Head from "next/head";
import Admin from "../../Components/Admin";
import React, { useReducer, useRef, useState, useCallback } from "react";
import { reducer } from "../../lib/hooks/reducer";
import { CSSTransition } from "react-transition-group";
import ModalComponent from "../../Components/Modal";
import styled from "styled-components";
import Input from "../../Components/Input";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import Heading from "../../Components/Heading";
import useSWR, { useSWRConfig } from "swr";
import { IoAddOutline, IoPencilSharp } from "react-icons/io5";
import changeFirstWord from "../../lib/module/upperFirstWord";
import Context from "../../lib/hooks/context";
import fetcher from "../../lib/module/fetcher";
import getRandom from "../../lib/module/randomNumber";
import fetcherClient from "../../lib/module/fetchClient";

export default function Projects() {
  const [state, dispatch] = useReducer(reducer, {
    // iddle, loading, finish
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
          width="700px"
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
  const { data, error } = useSWR("/api/tools", fetcher);

  if (error) {
    console.log(error);
    return (
      <Heading>
        <span>Error</span>
      </Heading>
    );
  }

  if (!data) {
    return <div className="loader"></div>;
  }

  switch (modal) {
    case "add":
      return (
        <ModalContentAdd
          onSubmit={(event) => onSubmit(event, dispatch, mutate)}
        >
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
              <Label htmlFor="file">Images:</Label>
              <Input name="images" type="file" id="file" multiple accept=".jpg, .png, .jpeg"/>
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
                    name="typeProject"
                    type="radio"
                    id="work"
                    value="A2"
                    required
                  ></Input>
                  <Label htmlFor="work">Work project</Label>
                </div>
                <div>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="personal"
                    value="A1"
                    required
                  ></Input>
                  <Label htmlFor="work">Personal Project</Label>
                </div>
              </ContainerCheckbox>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="tools">tool :</Label>
              <InputCollections
                type="select"
                name="tools"
                data={data}
              ></InputCollections>
            </ModalContentAddContentRow>
          </ModalContentAddContent>
          <ModalContentAddFooter>
            <Button type="submit">ADD Project</Button>
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
            <Button onClick={() => onSubmit2(id, dispatch, mutate)}>
              DELETE
            </Button>
          </ModalFooter>
        </ModalMain>
      );
    case "update":
      const titleValue = columnsValue[columns.indexOf("title")];
      const startDateValue = changeFormatDate(
        columnsValue[columns.indexOf("startDate")]
      );
      const endDateValue = changeFormatDate(
        columnsValue[columns.indexOf("endDate")]
      );
      const urlValue = columnsValue[columns.indexOf("url")];
      const descriptionValue = columnsValue[columns.indexOf("description")];
      const { _id } = columnsValue[columns.indexOf("typeProject")];
      const toolsValue = columnsValue[columns.indexOf("tools")];

      return (
        <ModalContentAdd
          onSubmit={(event) => onSubmit3(event, id, dispatch, mutate)}
        >
          <ModalContentAddContent>
            <ModalContentAddContentRow>
              <Label htmlFor="title">Title: </Label>
              <Input
                type="text"
                id="title"
                placeholder="enter the project title"
                name="title"
                required
                defaultValue={titleValue}
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
                defaultValue={startDateValue}
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
                defaultValue={endDateValue}
              ></Input>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label>Images:</Label>
              <Input name="images" type="file" id="file" multiple accept=".jpg, .png, .jpeg"/>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="url">Url of website:</Label>
              <Input
                type="text"
                id="url"
                placeholder="enter url"
                name="url"
                required
                defaultValue={urlValue}
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
                defaultValue={descriptionValue}
              ></Input>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label>Type of project :</Label>
              <ContainerCheckbox>
                <div>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="work"
                    value="A2"
                    required
                    defaultChecked={_id === "A2" ? true : false}
                  ></Input>
                  <Label htmlFor="work">Work project</Label>
                </div>
                <div>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="personal"
                    value="A1"
                    required
                    defaultChecked={_id === "A1" ? true : false}
                  ></Input>
                  <Label htmlFor="work">Personal Project</Label>
                </div>
              </ContainerCheckbox>
            </ModalContentAddContentRow>

            <ModalContentAddContentRow>
              <Label htmlFor="tools">Tools :</Label>
              <InputCollections
                type="select"
                name="tools"
                defaultValues={toolsValue}
                data={data}
              ></InputCollections>
            </ModalContentAddContentRow>
          </ModalContentAddContent>
          <ModalContentAddFooter>
            <Button type="submit">Update Project</Button>
          </ModalContentAddFooter>
        </ModalContentAdd>
      );
    default:
      return <> </>;
  }
}

async function onSubmit(event, dispatch, mutate) {
  try {
    event.preventDefault();
    const form = new FormData(event.target);
    dispatch({ type: "modal/request/start" });
    const request = await fetcherClient("/api/projects", {
      method: "post",
      body: form,
    });

    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.message },
    });
    mutate("/api/projects");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: err.error.message },
    });
    mutate("/api/projects");
  }
}

async function onSubmit2(id, dispatch, mutate) {
  try {
    dispatch({ type: "modal/request/start" });
    const request = await fetcherClient(`/api/projects/${id}`, {
      method: "delete",
    });

    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.message },
    });
    mutate("/api/projects");
  } catch (err) {
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: err.error.message },
    });
    mutate("/api/projects");
  }
}

async function onSubmit3(event, id, dispatch, mutate) {
  try {
    event.preventDefault();
    const form = new FormData(event.target);

    dispatch({ type: "modal/request/start" });
    const request = await fetcherClient(`/api/projects/${id}`, {
      method: "put",
      body: form,
    });
    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.message },
    });
    mutate('/api/projects')
  } catch (err) {
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: err.error.message },
    });
    mutate("/api/projects");
  }
}

function InputCollections({
  data: { data: result = [] } = {},
  defaultValues = [],
  ...props
} = {}) {
  const [inputState, setInputState] = useState(() =>
    defaultValues.map((defaultValue) => defaultValue._id)
  );
  const [inputCount, setInputCount] = useState(defaultValues.length || 1);
  const collectionInput = [];

  // callback
  function onChange(event, index) {
    const arrayBaru = [...inputState];
    arrayBaru[index] = event.target.value;
    setInputState(arrayBaru);
  }

  // Looping untuk select element yang diperlukan
  for (let i = 0; i < inputCount; i++) {
    const element = (
      <select
        onChange={(event) => onChange(event, i)}
        value={inputState[i]}
        key={getRandom()}
        {...props}
      >
        {result.map((value) => {
          return (
            <option key={getRandom()} value={value._id}>
              {value.name}
            </option>
          );
        })}
      </select>
    );
    collectionInput.push(element);
  }
  return (
    <ContainerInputs>
      <Button type="button" onClick={() => setInputCount((state) => state + 1)}>
        <IoAddOutline />
      </Button>
      {collectionInput}
    </ContainerInputs>
  );
}

function changeFormatDate(data) {
  const date = new Date(data);
  const month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;
  return `${date.getFullYear()}-${month}-${date.getDate()}`;
}

// Styled Component

//
// Modal add content
//

const ModalContentAdd = styled.form`
  width: 100%;
  height: 100%;
`;

const ModalContentAddContent = styled.div`
  width: 100%;
  @media (min-width: 768px) {
    & {
      padding: 2rem;
    }
  }
`;

const ModalContentAddFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.5);
`;

const ModalContentAddContentRow = styled.div`
  display: grid;
  justify-items: space-between;
  align-items: center;
  padding: 0.8rem;
  gap: 0.8rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`;

const ContainerCheckbox = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr 1fr;
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
  }
`;

const ContainerIcons = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover svg {
    opacity: 1;
  }

  & svg {
    margin-left: 0.3rem;
    transition: var(--transition);
    padding: 0.1rem;
    background-color: var(--pink);
    opacity: 0;
  }
`;

// // // Styled Component

const ModalMain = styled.div`
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
