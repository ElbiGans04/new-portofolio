import Head from "next/head";
import React, { useReducer, useRef, useState, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import useSWR, { useSWRConfig } from "swr";
import { IoAddOutline } from "react-icons/io5";
import styled from "styled-components";
import { reducer } from "../../lib/hooks/reducer";
import ModalComponent, {
  ModalAdmin,
  ModalMain2,
  ModalContent2,
  ModalFooter,
  GlobalStyle,
  ModalForm,
  ModalFormContent,
  ModalFormContentRow,
  ModalFormFooter,
} from "../../components/Modal";
import changeFirstWord from "../../lib/module/upperFirstWord";
import Context from "../../lib/hooks/context";
import fetcher from "../../lib/module/fetcher";
import getRandom from "../../lib/module/randomNumber";
import fetcherClient from "../../lib/module/fetchClient";
import Admin from "../../components/Admin";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Button from "../../components/Button";
import Heading from "../../components/Heading";

export default function Projects() {
  const ref = useRef(null);
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
  const [state2] = useState({
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
      tools: function tools (value) {
        let textResult = ``;
        value.forEach((text, index) => {
          textResult += changeFirstWord(text.name);
          if (index !== value.length - 1) textResult += `, `;
        });

        return <div>{textResult}</div>;
      },
      typeProject: function typeProject (value) {
        return <div>{changeFirstWord(value.name)}</div>;
      },
      images: function images (value) {
        let textResult = ``;
        value.forEach((text, index) => {
          textResult += text.src;
          if (index !== value.length - 1) textResult += `, `;
        });

        return <div>{textResult}</div>;
      },
      startDate: function startDate (value){changeFormatDate(value)},
      endDate: function endDate (value){changeFormatDate(value)},
    },
  });

  return (
    <Context.Provider value={state2}>
      <Head>
        <title>Projects</title>
      </Head>

      {/* Halaman Admin */}
      <Admin />

      {/* Modal */}
      {/* Saat modal diopen overflow pada body harus dihidden */}
      {state.modal && <GlobalStyle />}
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
          <ModalAdmin
            status={state.status}
            message={state.message}
            dispatch={dispatch}
            Children={() => <SwitchModal dispatch={dispatch} state={state} />}
          ></ModalAdmin>
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
  const { data, error  } = useSWR("/api/tools", fetcher);

  if (error) {
    return (
      <ModalMain2>
        <ModalContent2>
          <Heading>
            <span>Error </span>when try <span> fetching data</span>
          </Heading>
        </ModalContent2>
      </ModalMain2>
    );
  }

  if (!data && !error) {
    return (
      <ModalMain2>
        <ModalContent2>
          <div className="loader"></div>
        </ModalContent2>
      </ModalMain2>
    );
  }

  switch (modal) {
    case "add":
      return (
        <ModalForm onSubmit={(event) => onSubmit(event, dispatch, mutate)}>
          <ModalFormContent>
            <ModalFormContentRow>
              <Label htmlFor="title">Title: </Label>
              <Input
                type="text"
                id="title"
                placeholder="enter the project title"
                name="title"
                required
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="startDate">Date start of development: </Label>
              <Input
                type="date"
                id="startDate"
                placeholder="enter the start date of development"
                name="startDate"
                required
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="endDate">Date end of development:</Label>
              <Input
                id="endDate"
                type="date"
                placeholder="enter the end date of development"
                name="endDate"
                required
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="file">Images:</Label>
              <Input
                name="images"
                type="file"
                id="file"
                multiple
                accept=".jpg, .png, .jpeg"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="url">Url of website:</Label>
              <Input
                type="text"
                id="url"
                placeholder="enter url"
                name="url"
                required
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="description">Description :</Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="enter description of project"
                required
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label>Type of project :</Label>
              <ContainerCheckbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="work"
                    value="A2"
                    required
                  ></Input>
                  <Label htmlFor="work">Work project</Label>
                </Checkbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="personal"
                    value="A1"
                    required
                  ></Input>
                  <Label htmlFor="work">Personal Project</Label>
                </Checkbox>
              </ContainerCheckbox>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="tools">tool :</Label>
              <InputCollections
                type="select"
                name="tools"
                data={data}
              ></InputCollections>
            </ModalFormContentRow>
          </ModalFormContent>
          <ModalFormFooter>
            <Button type="submit">ADD Project</Button>
          </ModalFormFooter>
        </ModalForm>
      );
    case "delete":
      return (
        <ModalMain2>
          <ModalContent2>
            <Heading>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent2>
          <ModalFooter>
            <Button onClick={() => onSubmit2(id, dispatch, mutate)}>
              DELETE
            </Button>
          </ModalFooter>
        </ModalMain2>
      );
    case "update":
      const titleValue = columnsValue[columns.indexOf("title")];
      const startDateValue = changeFormatDate(
        columnsValue[columns.indexOf("startDate")]
      );
      const endDateValue = changeFormatDate(
        columnsValue[columns.indexOf("endDate")]
      );
      console.log(startDateValue)
      const urlValue = columnsValue[columns.indexOf("url")];
      const descriptionValue = columnsValue[columns.indexOf("description")];
      const { _id } = columnsValue[columns.indexOf("typeProject")];
      const toolsValue = columnsValue[columns.indexOf("tools")];

      return (
        <ModalForm onSubmit={(event) => onSubmit3(event, id, dispatch, mutate)}>
          <ModalFormContent>
            <ModalFormContentRow>
              <Label htmlFor="title">Title: </Label>
              <Input
                type="text"
                id="title"
                placeholder="enter the project title"
                name="title"
                required
                defaultValue={titleValue}
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="startDate">Date start of development: </Label>
              <Input
                type="date"
                id="startDate"
                placeholder="enter the start date of development"
                name="startDate"
                required
                defaultValue={startDateValue}
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="endDate">Date end of development:</Label>
              <Input
                id="endDate"
                type="date"
                placeholder="enter the end date of development"
                name="endDate"
                required
                defaultValue={endDateValue}
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label>Images:</Label>
              <Input
                name="images"
                type="file"
                id="file"
                multiple
                accept=".jpg, .png, .jpeg"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="url">Url of website:</Label>
              <Input
                type="text"
                id="url"
                placeholder="enter url"
                name="url"
                required
                defaultValue={urlValue}
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="description">Description :</Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="enter description of project"
                required
                defaultValue={descriptionValue}
              ></Input>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label>Type of project :</Label>
              <ContainerCheckbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="work"
                    value="A2"
                    required
                    defaultChecked={_id === "A2" ? true : false}
                  ></Input>
                  <Label htmlFor="work">Work project</Label>
                </Checkbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="personal"
                    value="A1"
                    required
                    defaultChecked={_id === "A1" ? true : false}
                  ></Input>
                  <Label htmlFor="work">Personal Project</Label>
                </Checkbox>
              </ContainerCheckbox>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label htmlFor="tools">Tools :</Label>
              <InputCollections
                type="select"
                name="tools"
                defaultValues={toolsValue}
                data={data}
              ></InputCollections>
            </ModalFormContentRow>
          </ModalFormContent>
          <ModalFormFooter>
            <Button type="submit">Update Project</Button>
          </ModalFormFooter>
        </ModalForm>
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
  return `${date.getFullYear()}-${month}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
}

// Styled Component

//
// Modal add content
//

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

const Checkbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & input[type=radio] {
    margin: 0 .3rem;
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

// // // Styled Component
