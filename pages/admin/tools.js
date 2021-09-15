import Head from "next/head";
import Admin from "../../Components/Admin";
import { Context } from "../../lib/hooks/toolsContext";
import React, { useReducer, useRef } from "react";
import { reducer } from "../../lib/hooks/reducer";
import { CSSTransition } from "react-transition-group";
import ModalComponent from "../../Components/Modal";
import styled from "styled-components";
import Input from "../../Components/Input";
import Label from "../../Components/Label";
import Button from "../../Components/Button";
import Heading from "../../Components/Heading";
export default function Tools() {
  const [state, dispatch] = useReducer(reducer, {
    modal: false,
    row: {
      id: false,
      columns: false,
      columnsValue: false,
    },
    url: "/api/tools",
    columns: ["name"],
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
  });
  const ref = useRef(null);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <Head>
        <title>Tools</title>
      </Head>
      <Admin />

      {/* Modal */}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={state.modal !== false ? true : false}
        timeout={500}
      >
        <ModalComponent ref={ref}>
          <SwitchModal row={state.row} modal={state.modal} />
        </ModalComponent>
      </CSSTransition>
    </Context.Provider>
  );
}

function SwitchModal({ modal, row: { id, columns, columnsValue } } = {}) {
  switch (modal) {
    case "add":
      return (
        <Form onSubmit={(event) => onSubmit(event)}>
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
        <ModalMain>
          <ModalContent>
            <Heading>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent>
          <ModalFooter>
            <Button onClick={() => onSubmit2(id)}>DELETE</Button>
          </ModalFooter>
        </ModalMain>
      );
    case "update":
      const nameValue = columnsValue[columns.indexOf("name")];
      const asValue = columnsValue[columns.indexOf("as")];
      return (
        <Form onSubmit={(event) => onSubmit3(event, id)}>
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
const onSubmit = async (event) => {
  try {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    const form = new FormData(event.target);
    for (let [index, value] of form.entries()) {
      searchParams.append(index, value);
    }

    const request = await (
      await fetch("/api/tools", {
        method: "post",
        body: searchParams.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    ).json();

    alert(request.meta.message);
  } catch (err) {
    alert("Error");
    console.log(err);
  }
};

const onSubmit2 = async (id) => {
  try {
    const request = await (
      await fetch(`/api/tools/${id}`, {
        method: "delete",
      })
    ).json();

    alert("SUCCESS");
  } catch (err) {
    alert("Error");
    console.log(err);
  }
};

const onSubmit3 = async (event, id) => {
  try {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    const form = new FormData(event.target);
    for (let [index, value] of form.entries()) {
      searchParams.append(index, value);
    }
    const request = await(
      await fetch(`/api/tools/${id}`, {
        method: "put",
        body: searchParams.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    ).json();
  
    alert(request.meta.message);
  } catch (err) {
    alert("Error");
    console.log(err)
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
