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
import type { DocMeta } from '@src/types/jsonApi/index';
import { fetcherGeneric } from '@src/utils/fetcher';
import getRandom from '@src/utils/randomNumber';
import Head from 'next/head';
import React, { useEffect, useReducer } from 'react';
import { useForm, UseFormRegister, FieldError } from 'react-hook-form';
import { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;
type ModalDataValidation = {
  name: string;
  as: string;
};

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
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ModalDataValidation>({
    shouldUnregister: false,
  });
  // Check apakah jenis data sesuai
  const row = state.row;

  useEffect(() => {
    if (state.modal === 'add') {
      reset(
        { name: '', as: '' },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    } else if (
      state.modal === 'update' &&
      state.row &&
      state.row.attributes &&
      state.row.type === 'Tools'
    ) {
      reset(
        { name: state.row.attributes.name, as: state.row.attributes.as },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    }
  }, [reset, state.modal, state.row]);

  /* 

      Event Handling

  */

  const onSubmitModalAdd = handleSubmit((data) => {
    dispatch({ type: 'modal/request/start' });

    fetcherGeneric<DocMeta>('/api/tools', {
      method: 'post',
      body: JSON.stringify({
        type: 'Tool',
        attributes: data,
      }),
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .then((result) => {
        dispatch({
          type: 'modal/request/finish',
          payload: { message: result.meta.title as string },
        });
        mutate('/api/tools').catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'modal/request/finish',
          payload: { message: 'Failed When Send Data' },
        });
        mutate('/api/tools').catch((err) => {
          console.log(err);
        });
      });
  });

  function onSubmitModalDelete() {
    if (row && row.id) {
      dispatch({ type: 'modal/request/start' });

      fetcherGeneric<DocMeta>(`/api/tools/${row.id}`, {
        method: 'DELETE',
      })
        .then((result) => {
          dispatch({
            type: 'modal/request/finish',
            payload: { message: result.meta.title as string },
          });
          mutate('/api/tools').catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: 'modal/request/finish',
            payload: { message: 'Failed When Send Data' },
          });
          mutate('/api/tools').catch((err) => {
            console.log(err);
          });
        });
    }
  }

  const onSubmitModalUpdate = handleSubmit((data) => {
    if (row && row.id) {
      dispatch({ type: 'modal/request/start' });

      fetcherGeneric<DocMeta>(`/api/tools/${row.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          type: 'Tool',
          id: row.id,
          attributes: data,
        }),
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      })
        .then((result) => {
          dispatch({
            type: 'modal/request/finish',
            payload: { message: result.meta.title as string },
          });
          mutate('/api/tools').catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch({
            type: 'modal/request/finish',
            payload: { message: 'Failed When Send Data' },
          });
          mutate('/api/tools').catch((err) => {
            console.log(err);
          });
        });
    }
  });

  switch (state.modal) {
    case 'add': {
      return (
        <ModalAddUpdate
          handler={onSubmitModalAdd}
          errors={errors}
          register={register}
        />
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
            <Button onClick={() => onSubmitModalDelete()}>DELETE</Button>
          </ModalFooter>
        </ModalMain2>
      );
    }

    case 'update': {
      return (
        <ModalAddUpdate
          handler={onSubmitModalUpdate}
          errors={errors}
          register={register}
        />
      );
    }
    default:
      return <> </>;
  }
}

function ModalAddUpdate({
  handler,
  register,
  errors,
}: {
  handler: (e: React.SyntheticEvent) => Promise<void>;
  register: UseFormRegister<ModalDataValidation>;
  errors: { [Property in keyof ModalDataValidation]?: FieldError };
}) {
  return (
    <ModalForm onSubmit={handler}>
      <ModalFormContent>
        <ModalFormContentRow>
          <Label minSize={1} size={1} htmlFor="name">
            Name:
          </Label>
          <Input
            borderColor={errors.name && 'var(--red2)'}
            borderColor2={errors.name && 'var(--red)'}
            {...register('name', {
              maxLength: { value: 100, message: 'Maximum Length is 100' },
              required: {
                value: true,
                message: 'Please insert name field',
              },
            })}
            id="name"
            placeholder="Insert name"
          />
          {errors.name?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.name.message}
            </p>
          )}
        </ModalFormContentRow>
        <ModalFormContentRow>
          <Label minSize={1} size={1} htmlFor="as">
            As:
          </Label>
          <Input
            borderColor={errors.as && 'var(--red2)'}
            borderColor2={errors.as && 'var(--red)'}
            {...register('as', {
              maxLength: { value: 100, message: 'Maximum Length is 100' },
              required: { value: true, message: 'Please insert as field' },
            })}
            id="as"
            placeholder="Insert as"
          />
          {errors.as?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.as.message}
            </p>
          )}
        </ModalFormContentRow>
      </ModalFormContent>
      <ModalFormFooter>
        <Button type="submit">SUBMIT</Button>
      </ModalFormFooter>
    </ModalForm>
  );
}
