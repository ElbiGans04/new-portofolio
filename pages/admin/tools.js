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
        <ModalComponent ref={ref}>
          <Form>
            <FormRow>
              <Label htmlFor="name">Name:</Label>
              <Input name="name" id="name" placeholder="insert name" />
            </FormRow>
            <FormRow>
              <Label htmlFor="as">As:</Label>
              <Input name="as" id="as" placeholder="insert as" />
            </FormRow>
          </Form>
        </ModalComponent>
      </CSSTransition>
    </Context.Provider>
  );
}


// // // Styled Component
const Form = styled.form`
  display: grid;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-items: center;
  gap: .8rem;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  padding: 1rem;
`;

const FormRow = styled.div`
  width: 100%;
  padding: .3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
`;