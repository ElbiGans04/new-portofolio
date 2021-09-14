import Head from "next/head";
import Admin from "../../Components/Admin";
import { Context } from "../../lib/hooks/toolsContext";
import { useReducer, useRef } from "react";
import {reducer} from '../../lib/hooks/reducer'
import { CSSTransition } from "react-transition-group";
import ModalComponent from "../../Components/Modal";
import styled from 'styled-components'
import Input from '../../Components/Input'
import Label from '../../Components/Label'
import Button from "../../Components/Button";
export default function Tools() {
  const [state, dispatch] = useReducer(reducer, {
    modal: false,
    url: "/api/tools",
    columns: ["name"],
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
  });
  const ref = useRef(null);

  // Submit
  const onSubmit = event => {
    event.preventDefault();
    console.log(event)
  }

  return (
    <Context.Provider value={{state, dispatch}}>
      <Head>
        <title>Tools</title>
      </Head>
      <Admin />
      

      {/* Modal */}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={state.modal === 'add' ? true : false}
        timeout={500}
      >
        <ModalComponent onSubmit={onSubmit} ref={ref}>
          <Form onSubmit={event => onSubmit(event)}>
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
            <FormFooter>
                <Button type="submit">SUBMIT</Button>
            </FormFooter>
          </Form>
        </ModalComponent>
      </CSSTransition>
    </Context.Provider>
  );
}


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
  gap: .8rem;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  padding: 1rem;
`;

const FormContentRow = styled.div`
  width: 100%;
  padding: .3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  box-shadow: -1px -1px 3px rgba(0,0,0, .5);
`;