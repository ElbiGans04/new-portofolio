import Admin, {
  AdminError,
  AdminLoading,
  AdminModal,
  TdButton,
} from '@src/components/Admin';
import Button from '@src/components/Button';
import Heading from '@src/components/Heading';
import Input from '@src/components/Input';
import Label from '@src/components/Label';
import {
  ModalContent2,
  ModalFooter,
  ModalForm,
  ModalFormContent,
  ModalFormContentRow,
  ModalFormFooter,
  ModalMain2,
} from '@src/components/Modal';
import { reducer } from '@src/hooks/reducer';
import useAdmin from '@src/hooks/useAdmin';
import type { admin } from '@src/types/admin';
import { Dispatch, DocAdminData } from '@src/types/admin';
import type { DocMeta, ResourceObject } from '@src/types/jsonApi/index';
import { OObjectWithFiles } from '@src/types/jsonApi/object';
import { fetcherGeneric } from '@src/utils/fetcher';
import getRandom from '@src/utils/randomNumber';
import Head from 'next/head';
import React, { FormEvent, useReducer } from 'react';
import { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;

export default function Tools() {
  const { data, user, error, ref } = useAdmin('/api/tools');
  const [state, dispatch] = useReducer(reducer, {
    status: 'iddle',
    modal: null,
    message: null,
    row: null,
  });

  if (error) return <AdminError />;
  if (!data || !user) return <AdminLoading />;

  return (
    <React.Fragment>
      <Head>
        <title>Tools</title>
      </Head>

      <AdminModal
        ref={ref}
        status={state.status}
        message={state.message}
        modal={state.modal}
        dispatch={dispatch}
      >
        <SwitchModal state={state} dispatch={dispatch} />
      </AdminModal>
      {/* Halaman Admin */}
      <Admin dispatch={dispatch}>
        <TableHeadBody dispatch={dispatch} data={data} />
      </Admin>
    </React.Fragment>
  );
}

function TableHeadBody({
  data,
  dispatch,
}: {
  data: DocAdminData;
  dispatch: Dispatch;
}) {
  const projects = data.data;

  return (
    <React.Fragment>
      <thead>
        <tr>
          <th>Name</th>
          <th>As</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => {
          if (project.type == 'Projects' || project.attributes === undefined)
            return (
              <React.Fragment>
                <tr />
                <tr />
              </React.Fragment>
            );
          return (
            <React.Fragment key={getRandom(index)}>
              <tr>
                <td>{project.attributes.name}</td>
                <td>{project.attributes.as}</td>
                <TdButton dispatch={dispatch} payload={project} />
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </React.Fragment>
  );
}

function SwitchModal({
  state,
  dispatch,
}: {
  state: admin;
  dispatch: Dispatch;
}): JSX.Element {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };

  // Check apakah jenis data sesuai
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
      if (!row) throw new Error('row not found');
      if (row.type === 'Projects') throw new Error('Type of row is wrong');
      if (row.id == undefined) throw new Error('row id not found');

      return (
        <ModalMain2>
          <ModalContent2>
            <Heading minSize={1} size={1}>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent2>
          <ModalFooter>
            <Button onClick={() => onSubmitModalDelete(row.id ? row.id : '')}>
              DELETE
            </Button>
          </ModalFooter>
        </ModalMain2>
      );
    }

    case 'update': {
      if (!row) throw new Error('row not found');
      if (row.id === undefined) throw new Error('row id not found');
      if (row.type === 'Projects') throw new Error('Type of row is wrong');
      if (row.attributes === undefined)
        throw new Error('row.attributes is undefined');
      return (
        <ModalForm
          onSubmit={(event) => onSubmitModalUpdate(event, row.id ? row.id : '')}
        >
          <ModalFormContent>
            <ModalFormContentRow>
              <Label minSize={1} size={1} htmlFor="name">
                Name:
              </Label>
              <Input
                name="name"
                defaultValue={row.attributes.name}
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
                defaultValue={row.attributes.as}
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
    default:
      return <> </>;
  }
}
