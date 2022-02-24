import Admin from '@components/Admin';
import Button from '@components/Button';
import Heading from '@components/Heading';
import Input from '@components/Input';
import Label from '@components/Label';
import {
  ModalContent2,
  ModalFooter,
  ModalForm,
  ModalFormContent,
  ModalFormContentRow,
  ModalFormFooter,
  ModalMain2,
} from '@components/Modal';
import Context from '@hooks/context';
import { reducer } from '@hooks/reducer';
import type { action, admin } from '@typess/admin';
import type { DocMeta, ResourceObject } from '@typess/jsonApi/index';
import { OObjectWithFiles } from '@typess/jsonApi/object';
import { fetcherGeneric } from '@utils/fetcher';
import Head from 'next/head';
import React, { Dispatch, FormEvent, useReducer, useState } from 'react';
import { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;

export default function Tools() {
  const [state, dispatch] = useReducer(reducer, {
    status: 'iddle',
    modal: null,
    message: null,
    row: null,
  });
  const [state2] = useState({
    url: '/api/tools',
    dispatch,
    columns: [],
    visible: {
      visibleValue: 0,
      visibleColumns: ['_id', '__v'],
    },
    renameColumns: {},
    specialTreatment: {},
  });

  return (
    <Context.Provider value={state2}>
      <Head>
        <title>Tools</title>
      </Head>

      {/* Halaman Admin */}
      <Admin
        status={state.status}
        message={state.message}
        modal={state.modal}
        Children={() => <SwitchModal state={state} dispatch={dispatch} />}
      />
    </Context.Provider>
  );
}

function SwitchModal({
  state,
  dispatch,
}: {
  state: admin;
  dispatch: Dispatch<action>;
}): JSX.Element {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };
  const row = state.row;

  /* 

      Event Handling

  */

  async function onSubmitModalAdd(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const document: ResourceObject<{ [index: string]: OObjectWithFiles }> = {
        type: 'tool',
        attributes: {},
      };
      const form = new FormData(event.currentTarget);

      if (document.attributes !== undefined) {
        for (const [index, value] of form.entries()) {
          document.attributes[index] = value;
        }

        dispatch({ type: 'modal/request/start' });

        const request = await fetcherGeneric<DocMeta>('/api/tools', {
          method: 'post',
          body: JSON.stringify(document),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        });

        dispatch({
          type: 'modal/request/finish',
          payload: { message: request.meta.title as string },
        });

        await mutate('/api/tools');
      }
    } catch (err) {
      alert('Error');
      console.log(err);
      dispatch({
        type: 'modal/request/finish',
        payload: { message: 'Error happend when request' },
      });
    }
  }

  async function onSubmitModalDelete(id: string) {
    try {
      dispatch({ type: 'modal/request/start' });

      const request = await fetcherGeneric<DocMeta>(`/api/tools/${id}`, {
        method: 'delete',
      });

      dispatch({
        type: 'modal/request/finish',
        payload: { message: request.meta.title as string },
      });

      await mutate('/api/tools');
    } catch (err) {
      alert('Error');
      console.log(err);
      dispatch({
        type: 'modal/request/finish',
        payload: { message: 'Error happend when request' },
      });
    }
  }

  async function onSubmitModalUpdate(
    event: FormEvent<HTMLFormElement>,
    id: string,
  ) {
    try {
      event.preventDefault();
      const document: ResourceObject<{ [index: string]: OObjectWithFiles }> = {
        type: 'tool',
        id,
        attributes: {},
      };
      const form = new FormData(event.currentTarget);
      if (document.attributes !== undefined) {
        for (const [index, value] of form.entries()) {
          document.attributes[index] = value;
        }

        dispatch({ type: 'modal/request/start' });
        const request = await fetcherGeneric<DocMeta>(`/api/tools/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(document),
          headers: {
            'Content-Type': 'application/vnd.api+json',
          },
        });

        dispatch({
          type: 'modal/request/finish',
          payload: { message: request.meta.title as string },
        });

        await mutate('/api/tools');
      }
    } catch (err) {
      alert('Error');
      console.log(err);
      dispatch({
        type: 'modal/request/finish',
        payload: { message: 'Error happend when request' },
      });
    }
  }

  switch (state.modal) {
    case 'add': {
      return (
        <ModalForm onSubmit={(event) => onSubmitModalAdd(event)}>
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
    case 'delete': {
      return (
        <ModalMain2>
          <ModalContent2>
            <Heading minSize={1} size={1}>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent2>
          <ModalFooter>
            <Button onClick={() => onSubmitModalDelete(row ? row.id : '')}>
              DELETE
            </Button>
          </ModalFooter>
        </ModalMain2>
      );
    }
    case 'update': {
      if (row && row.columns !== null && row.columnsValue !== null) {
        const nameValue = row.columnsValue[
          row.columns.indexOf('name')
        ] as string;
        const asValue = row.columnsValue[row.columns.indexOf('as')] as string;
        return (
          <ModalForm onSubmit={(event) => onSubmitModalUpdate(event, row.id)}>
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
      }

      return <></>;

      break;
    }
    default:
      return <> </>;
  }
}
