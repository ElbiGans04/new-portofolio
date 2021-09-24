import Head from "next/head";
import Admin from "../../Components/Admin";
import React, { useReducer, useRef, useState } from "react";
import { reducer } from "../../lib/hooks/reducer";
import { CSSTransition } from "react-transition-group";
import ModalComponent, {
  ModalAdmin,
  ModalMain2,
  ModalContent2,
  ModalFooter,
  GlobalStyle
} from "../../Components/Modal";
import styled from "styled-components";
import Input from "../../Components/Input";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import Heading from "../../Components/Heading";
import fetcher from "../../lib/module/fetchClient";
import { mutate, useSWRConfig } from "swr";
import Context from "../../lib/hooks/context";

export default function Tools() {
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
    url: "/api/tools",
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
  });
  const ref = useRef(null);

  return (
    <Context.Provider value={state2}>
      <Head>
        <title>Tools</title>
      </Head>
      <Admin state={state} dispatch={dispatch} />

      {/* Modal */}
      {state.modal && <GlobalStyle />}
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
  switch (modal) {
    case "add":
      return (
        <Form onSubmit={(event) => onSubmit(event, dispatch, mutate)}>
          <FormContent>
            <FormContentRow>
              <Label htmlFor="name">Name:</Label>
              <Input name="name" id="name" placeholder="insert name" />
            </FormContentRow>
            <FormContentRow>
              <Label htmlFor="as">As:</Label>
              <Input name="as" id="as" placeholder="insert as" />
            </FormContentRow>
          </FormContent>
          <ModalFooter>
            <Button type="submit">SUBMIT</Button>
          </ModalFooter>
        </Form>
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
      const nameValue = columnsValue[columns.indexOf("name")];
      const asValue = columnsValue[columns.indexOf("as")];
      return (
        <Form onSubmit={(event) => onSubmit3(event, id, dispatch, mutate)}>
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

// Submit
const onSubmit = async (event, dispatch, mutate) => {
  try {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    const form = new FormData(event.target);
    for (let [index, value] of form.entries()) {
      searchParams.append(index, value);
    }

    dispatch({ type: "modal/request/start" });

    const request = await fetcher("/api/tools", {
      method: "post",
      body: searchParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.message },
    });
    mutate("/api/tools");
  } catch (err) {
    alert("Error");
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: err.error.message },
    });
  }
};

const onSubmit2 = async (id, dispatch, mutate) => {
  try {
    dispatch({ type: "modal/request/start" });

    const request = await fetcher(`/api/tools/${id}`, {
      method: "delete",
    });

    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.message },
    });
    mutate("/api/tools");
  } catch (err) {
    alert("Error");
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: err.error.message },
    });
  }
};

const onSubmit3 = async (event, id, dispatch) => {
  try {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    const form = new FormData(event.target);
    for (let [index, value] of form.entries()) {
      searchParams.append(index, value);
    }

    dispatch({ type: "modal/request/start" });
    const request = await fetcher(`/api/tools/${id}`, {
      method: "put",
      body: searchParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.message },
    });
    mutate("/api/tools");
  } catch (err) {
    alert("Error");
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: err.error.message },
    });
  }
};

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