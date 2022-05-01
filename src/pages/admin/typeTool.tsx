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
import { Dispatch, DocAdminDataPlural } from '@src/types/admin';
import type { DocMeta } from '@src/types/jsonApi/index';
import {
  clientHandlerError,
  clientHandlerSuccess,
} from '@src/utils/clientHandler';
import { fetcherGeneric } from '@src/utils/fetcher';
import getRandom from '@src/utils/randomNumber';
import Head from 'next/head';
import React, { useReducer, useEffect } from 'react';
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;
type ModalDataValidation = {
  name: string;
};

export default function Tags() {
  const { data, error, ref } = useAdmin('/api/typeTool');
  const [state, dispatch] = useReducer(reducer, {
    status: 'iddle',
    modal: null,
    message: null,
    row: null,
  });

  if (error) return <AdminError />;
  if (!data) return <AdminLoading />;

  return (
    <React.Fragment>
      <Head>
        <title>TypeTool</title>
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
  data: DocAdminDataPlural;
  dispatch: Dispatch;
}) {
  const tools = data.data;
  return (
    <React.Fragment>
      <thead>
        <tr>
          <th>Name</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {tools.map((tool) => {
          if (tool?.type == 'TypeTool' && tool.attributes !== undefined)
            return (
              <tr key={tool.id}>
                <td>{tool.attributes.name}</td>
                <TdButton dispatch={dispatch} payload={{ data: tool }} />
              </tr>
            );

          return (
            <React.Fragment key={getRandom(1)}>
              <tr />
              <tr />
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
}) {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };
  const reactForm = useForm<ModalDataValidation>();

  useEffect(() => {
    if (state.modal === 'add') {
      reactForm.reset(
        { name: '' },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    } else if (
      state.modal === 'update' &&
      state.row &&
      state.row.data.attributes &&
      state.row.data.type === 'TypeTool'
    ) {
      reactForm.reset(
        {
          name: state.row.data.attributes.name,
        },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    }
  }, [reactForm, state.modal, state.row]);

  /* 

      Event Handling

  */

  const onSubmitModalAdd = reactForm.handleSubmit(async (data) => {
    try {
      dispatch({ type: 'modal/request/start' });

      const request = await fetcherGeneric<DocMeta>('/api/typeTool', {
        method: 'post',
        body: JSON.stringify({
          data: {
            type: 'TypeTool',
            attributes: data,
          },
        }),
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      });

      await clientHandlerSuccess(
        request.meta.title as string,
        dispatch,
        mutate,
        '/api/typeTool',
      );
    } catch (err) {
      clientHandlerError(err, dispatch, mutate, '/api/typeTool').catch((err) =>
        console.error(err),
      );
    }
  });

  function onSubmitModalDelete() {
    const callback = async () => {
      if (state.row && state.row.data.id) {
        try {
          dispatch({ type: 'modal/request/start' });

          const result = await fetcherGeneric<DocMeta>(
            `/api/typeTool/${state.row.data.id}`,
            {
              method: 'DELETE',
            },
          );

          await clientHandlerSuccess(
            result.meta.title as string,
            dispatch,
            mutate,
            '/api/typeTool',
          );
        } catch (err) {
          clientHandlerError(err, dispatch, mutate, '/api/typeTool').catch(
            (err) => console.error(err),
          );
        }
      }
    };

    callback().catch((err) => console.error(err));
  }

  const onSubmitModalUpdate = reactForm.handleSubmit(async (data) => {
    if (state.row && state.row.data.id) {
      try {
        dispatch({ type: 'modal/request/start' });

        const result = await fetcherGeneric<DocMeta>(
          `/api/typeTool/${state.row.data.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              data: {
                type: 'TypeTool',
                id: state.row.data.id,
                attributes: data,
              },
            }),
            headers: {
              'Content-Type': 'application/vnd.api+json',
            },
          },
        );

        await clientHandlerSuccess(
          result.meta.title as string,
          dispatch,
          mutate,
          '/api/typeTool',
        );
      } catch (err) {
        clientHandlerError(err, dispatch, mutate, '/api/typeTool').catch(
          (err) => console.error(err),
        );
      }
    }
  });

  switch (state.modal) {
    case 'add': {
      return (
        <FormProvider {...reactForm}>
          <ModalAddUpdate handler={onSubmitModalAdd} />
        </FormProvider>
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
            <Button onClick={onSubmitModalDelete}>DELETE</Button>
          </ModalFooter>
        </ModalMain2>
      );
    }

    case 'update': {
      return (
        <FormProvider {...reactForm}>
          <ModalAddUpdate handler={onSubmitModalUpdate} />
        </FormProvider>
      );
    }
    default:
      return <> </>;
  }
}

function ModalAddUpdate({
  handler,
}: {
  handler: (e: React.BaseSyntheticEvent) => Promise<void>;
}) {
  const { register, control } = useFormContext<ModalDataValidation>();
  const { errors } = useFormState({ control });
  const Handler = (e: React.BaseSyntheticEvent) => {
    handler(e).catch((err) => console.error(err));
  };
  return (
    <ModalForm onSubmit={Handler}>
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
      </ModalFormContent>
      <ModalFormFooter>
        <Button type="submit">SUBMIT</Button>
      </ModalFormFooter>
    </ModalForm>
  );
}
