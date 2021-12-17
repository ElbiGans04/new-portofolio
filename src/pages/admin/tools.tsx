import Head from "next/head";
import React, {
  Dispatch,
  FormEvent, useReducer,
  useRef,
  useState
} from "react";
import { CSSTransition } from "react-transition-group";
import { useSWRConfig } from "swr";
import Admin from "@components/Admin";
import Button from "@components/Button";
import Heading from "@components/Heading";
import Input from "@components/Input";
import Label from "@components/Label";
import ModalComponent, {
  GlobalStyle, ModalAdmin, ModalContent2,
  ModalFooter, ModalForm,
  ModalFormContent,
  ModalFormContentRow,
  ModalFormFooter, ModalMain2
} from "@components/Modal";
import Context from "@hooks/context";
import { reducer } from "@hooks/reducer";
import fetcher from "@module/fetcherGeneric";
import type { action, admin } from "@typess/admin";
import type { DocMeta, ResourceObjectForSendWithFiles } from "@typess/jsonApi/index";

export default function Tools() {
  const [state, dispatch] = useReducer(reducer, {
    status: "iddle",
    modal: null,
    message: null,
    row: null,
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

      {/* Halaman Admin */}
      <Admin />

      {/* Modal */}
      {state.modal !== null && <GlobalStyle />}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={state.modal !== null ? true : false}
        timeout={500}
      >
        <ModalComponent
          width="500px"
          height=""
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
  state,
  dispatch,
}: {
  state: admin;
  dispatch: Dispatch<action>;
}) {
  const { mutate } = useSWRConfig();
  const row = state.row!;
  switch (state.modal) {
    case "add": {
      return (
        <ModalForm onSubmit={(event) => onSubmit(event, dispatch, mutate)}>
          <ModalFormContent>
            <ModalFormContentRow>
              <Label minSize={1} size={1} htmlFor="name">
                Name:
              </Label>
              <Input name="name" id="name" placeholder="insert name" />
            </ModalFormContentRow>
            <ModalFormContentRow>
              <Label minSize={1} size={1} htmlFor="as">
                As:
              </Label>
              <Input name="as" id="as" placeholder="insert as" />
            </ModalFormContentRow>
          </ModalFormContent>
          <ModalFormFooter>
            <Button type="submit">SUBMIT</Button>
          </ModalFormFooter>
        </ModalForm>
      );
    }
    case "delete": {
      return (
        <ModalMain2>
          <ModalContent2>
            <Heading minSize={1} size={1}>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent2>
          <ModalFooter>
            <Button onClick={() => onSubmit2(row.id!, dispatch, mutate)}>
              DELETE
            </Button>
          </ModalFooter>
        </ModalMain2>
      );
    }
    case "update": {
      if (row.columns !== null && row.columnsValue !== null) {
        const nameValue = row.columnsValue[row.columns.indexOf("name")] as string;
        const asValue = row.columnsValue[row.columns.indexOf("as")] as string;
        return (
          <ModalForm
            onSubmit={(event) => onSubmit3(event, row.id!, dispatch, mutate)}
          >
            <ModalFormContent>
              <ModalFormContentRow>
                <Label minSize={1} size={1} htmlFor="name">
                  Name:
                </Label>
                <Input
                  name="name"
                  defaultValue={nameValue}
                  id="name"
                  placeholder="insert name"
                />
              </ModalFormContentRow>
              <ModalFormContentRow>
                <Label minSize={1} size={1} htmlFor="as">
                  As:
                </Label>
                <Input
                  name="as"
                  defaultValue={asValue}
                  id="as"
                  placeholder="insert as"
                />
              </ModalFormContentRow>
            </ModalFormContent>
            <ModalFormFooter>
              <Button type="submit">SUBMIT</Button>
            </ModalFormFooter>
          </ModalForm>
        );
      } else {
        <> </>;
      }
    }
    default:
      return <> </>;
  }
}

// Submit
const onSubmit = async (
  event: FormEvent<HTMLFormElement>,
  dispatch: Dispatch<any>,
  mutate: any
) => {
  try {
    event.preventDefault();
    const document: ResourceObjectForSendWithFiles = {
      type: "tool",
      attributes: {},
    };
    const form = new FormData(event.currentTarget);

    if (document.attributes !== undefined) {
      for (let [index, value] of form.entries()) {
        document.attributes[index] = value;
      }

      dispatch({ type: "modal/request/start" });

      const request = await fetcher<DocMeta>("/api/tools", {
        method: "post",
        body: JSON.stringify(document),
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
      });

      dispatch({
        type: "modal/request/finish",
        payload: { message: request.meta.title },
      });
      mutate("/api/tools");
    }
  } catch (err) {
    alert("Error");
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: "Error happend when request" },
    });
  }
};

const onSubmit2 = async (id: string, dispatch: Dispatch<any>, mutate: any) => {
  try {
    dispatch({ type: "modal/request/start" });

    const request = await fetcher<DocMeta>(`/api/tools/${id}`, {
      method: "delete",
    });

    dispatch({
      type: "modal/request/finish",
      payload: { message: request.meta.title },
    });
    mutate("/api/tools");
  } catch (err) {
    alert("Error");
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: "Error happend when request" },
    });
  }
};

const onSubmit3 = async (
  event: FormEvent<HTMLFormElement>,
  id: string,
  dispatch: Dispatch<any>,
  mutate: any
) => {
  try {
    event.preventDefault();
    const document: ResourceObjectForSendWithFiles = {
      type: "tool",
      id,
      attributes: {},
    };
    const form = new FormData(event.currentTarget);
    if (document.attributes !== undefined) {
      for (let [index, value] of form.entries()) {
        document.attributes[index] = value;
      }

      dispatch({ type: "modal/request/start" });
      const request = await fetcher<DocMeta>(`/api/tools/${id}`, {
        method: "PATCH",
        body: JSON.stringify(document),
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
      });

      dispatch({
        type: "modal/request/finish",
        payload: { message: request.meta.title },
      });
      mutate("/api/tools");
    }
  } catch (err) {
    alert("Error");
    console.log(err);
    dispatch({
      type: "modal/request/finish",
      payload: { message: "Error happend when request" },
    });
  }
};
