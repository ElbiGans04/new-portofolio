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
  ModalLoading,
  ModalError,
} from '@src/components/Modal';
import { reducer } from '@src/hooks/reducer';
import useAdmin from '@src/hooks/useAdmin';
import type { admin, DocTags } from '@src/types/admin';
import {
  Dispatch,
  DocAdminDataPlural,
  RelationshipToolInterface,
} from '@src/types/admin';
import type { DocMeta, DocErrors } from '@src/types/jsonApi/index';
import { fetcherGeneric } from '@src/utils/fetcher';
import Head from 'next/head';
import React, { useEffect, useReducer } from 'react';
import {
  useForm,
  FormProvider,
  useFormContext,
  useFormState,
  useController,
  Control,
  FieldError,
} from 'react-hook-form';
import useSWR, { useSWRConfig } from 'swr';
import {
  clientHandlerSuccess,
  clientHandlerError,
} from '@src/utils/clientHandler';
import getRandom from '@src/utils/randomNumber';
import Select from 'react-select';

type mutateSWRCustom = <T>(key: string) => Promise<T>;
type ModalDataValidation = {
  name: string;
  as: { label: string; value: string };
};

export default function Tools() {
  const { data, error, ref } = useAdmin('/api/tools');
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
  data: DocAdminDataPlural;
  dispatch: Dispatch;
}) {
  const tools = data.data;
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
        {tools.map((tool) => {
          if (
            tool.type === 'Tool' &&
            tool.attributes !== undefined &&
            Array.isArray(data.included)
          ) {
            const included =
              data.included as any as Array<RelationshipToolInterface>;

            const matchIncluded = included.find((data) => {
              const asRelationship = tool.relationships?.as?.data;

              if (Array.isArray(asRelationship) || !asRelationship)
                return false;
              return data.id === asRelationship.id;
            });

            return (
              <tr key={tool.id}>
                <td>{tool.attributes.name}</td>
                <td>
                  {matchIncluded?.attributes?.name || (
                    <span
                      style={{
                        textDecoration: 'underline',
                        color: 'var(--pink)',
                      }}
                    >
                      Unknown
                    </span>
                  )}
                </td>
                <TdButton
                  dispatch={dispatch}
                  payload={{
                    data: tool,
                    included: matchIncluded ? [matchIncluded] : undefined,
                  }}
                />
              </tr>
            );
          }

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
}): JSX.Element {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };
  const reactForm = useForm<ModalDataValidation>();
  const { data, error } = useSWR<DocTags, DocErrors>(
    '/api/typeTool',
    fetcherGeneric,
  );

  useEffect(() => {
    if (state.modal === 'add' && data) {
      reactForm.reset(
        {
          name: '',
          as: (data.data[0]?.id && data.data[0]?.attributes?.name
            ? {
                label: data.data[0]?.attributes?.name || '',
                value: data.data[0]?.id || '',
              }
            : '') as any as { label: string; value: string },
        },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    } else if (
      state.modal === 'update' &&
      state.row &&
      state.row.data.type === 'Tool' &&
      state.row.data.attributes
    ) {
      if (
        !state.row.included ||
        (Array.isArray(state.row.included) &&
          state.row.included[0]?.type !== 'typeTool') ||
        Array.isArray(state.row.data.relationships?.as?.data) ||
        !state.row.data.relationships?.as?.data
      )
        return reactForm.reset({
          name: state.row.data.attributes.name,
          as: null,
        } as any as { name: string; as: { label: string; value: string } });
      const included = state.row.included as RelationshipToolInterface[];

      reactForm.reset(
        {
          name: state.row.data.attributes.name,
          as:
            included[0].attributes?.name &&
            state.row.data.relationships?.as?.data.id
              ? {
                  label: included[0].attributes?.name,
                  value: state.row.data.relationships?.as?.data.id,
                }
              : null,
        } as any as { name: string; as: { label: string; value: string } },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    }
  }, [data, reactForm, state.modal, state.row]);

  /* 

      Event Handling

  */

  const onSubmitModalAdd = reactForm.handleSubmit(async (data) => {
    try {
      dispatch({ type: 'modal/request/start' });

      const request = await fetcherGeneric<DocMeta>('/api/tools', {
        method: 'post',
        body: JSON.stringify({
          data: {
            type: 'Tool',
            attributes: {
              name: data.name,
            },
            relationships: {
              as: {
                data: {
                  type: 'typeTool',
                  id: data.as.value,
                },
              },
            },
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
        '/api/tools',
      );
    } catch (err) {
      clientHandlerError(err, dispatch, mutate, '/api/tools').catch((err) =>
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
            `/api/tools/${state.row.data.id}`,
            {
              method: 'DELETE',
            },
          );

          await clientHandlerSuccess(
            result.meta.title as string,
            dispatch,
            mutate,
            '/api/tools',
          );
        } catch (err) {
          clientHandlerError(err, dispatch, mutate, '/api/tools').catch((err) =>
            console.error(err),
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
          `/api/tools/${state.row.data.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              data: {
                type: 'Tool',
                id: state.row.data.id,
                attributes: {
                  name: data.name,
                },
                relationships: {
                  as: {
                    data: {
                      type: 'typeTool',
                      id: data.as.value,
                    },
                  },
                },
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
          '/api/tools',
        );
      } catch (err) {
        clientHandlerError(err, dispatch, mutate, '/api/tools').catch((err) =>
          console.error(err),
        );
      }
    }
  });

  if (error) return <ModalError />;

  if (!data) return <ModalLoading />;

  switch (state.modal) {
    case 'add': {
      return (
        <FormProvider {...reactForm}>
          <ModalAddUpdate
            data={data.data.map((type) => ({
              label: type.attributes?.name || 'unknown',
              value: type.id,
            }))}
            handler={onSubmitModalAdd}
          />
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
          <ModalAddUpdate
            data={data.data.map((type) => ({
              label: type.attributes?.name || 'unknown',
              value: type.id,
            }))}
            handler={onSubmitModalUpdate}
          />
        </FormProvider>
      );
    }
    default:
      return <> </>;
  }
}

function ModalAddUpdate({
  handler,
  data,
}: {
  handler: (e: React.BaseSyntheticEvent) => Promise<void>;
  data: { label: string; value: string }[];
}) {
  const { register, control } = useFormContext<ModalDataValidation>();
  const { errors } = useFormState({ control });
  const Handler = (e: React.BaseSyntheticEvent) => {
    handler(e).catch((err) => console.error(err));
  };
  const errorsType = errors.as as FieldError;
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
        <ModalFormContentRow>
          <Label minSize={1} size={1} htmlFor="as">
            As:
          </Label>
          <ReactSelect options={data} control={control} />
          {errorsType?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errorsType?.message}
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

function ReactSelect({
  options,
  control,
}: {
  options: { label: string; value: string }[];
  control: Control<ModalDataValidation>;
}) {
  const {
    field: { ref, value, onBlur, onChange, name },
  } = useController({
    name: 'as',
    control,
    rules: {
      required: {
        value: true,
        message: 'PLEASE SELECT TYPE PROJECT AT LEAST ONE',
      },
    },
    defaultValue: undefined,
  });
  return (
    <Select
      name={name}
      onBlur={onBlur}
      ref={ref}
      onChange={onChange}
      value={value}
      options={options}
      captureMenuScroll={true}
      placeholder="Select the type used in the tool"
      styles={{
        option: (provided, { isFocused }) => ({
          ...provided,
          backgroundColor: isFocused ? 'var(--pink2)' : 'var(--dark2)',
          color: isFocused ? 'black' : 'var(--pink)',
          ':active': {
            ...provided[':active'],
            backgroundColor: '#e07d9e',
          },
          ':hover': {
            backgroundColor: 'var(--pink2)',
            cursor: 'pointer',
            color: 'black',
          },
        }),

        control: (provided) => ({
          ...provided,
          boxShadow: '1px solid var(--pink)',
          borderColor: 'var(--pink2)',
          backgroundColor: 'var(--dark)',
          '&:hover': {
            boxShadow: '1px solid var(--pink)',
            borderColor: 'var(--pink)',
          },
          color: 'var(--pink)',
        }),

        placeholder: (styled) => ({ ...styled, color: 'var(--pink)' }),
        dropdownIndicator: (styled, { isFocused }) => ({
          ...styled,
          color: 'var(--pink)',
          transition: '.3s',
          transform: isFocused ? 'rotate(0deg)' : 'rotate(180deg)',
          cursor: 'pointer',
          '&:hover': {
            color: 'var(--pink2)',
          },
        }),
        groupHeading: (styled) => ({
          ...styled,
          backgroundColor: 'var(--pink)',
          color: 'black',
          padding: '.5rem',
          fontWeight: 'bold',
        }),
        clearIndicator: (styled) => ({
          ...styled,
          color: 'var(--pink)',
          cursor: 'pointer',
          '&:hover': {
            color: 'var(--pink2)',
          },
        }),
        indicatorSeparator: (styled) => ({
          ...styled,
          backgroundColor: 'var(--pink)',
        }),

        menuList: (styled) => ({
          ...styled,
          backgroundColor: 'var(--dark2)',
          '&::-webkit-scrollbar': {
            width: '7px',
          },

          '&::-webkit-scrollbar-track': {
            background: 'var(--dark)',
          },

          /* Handle */
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--pink)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'var(--pink2)',
          },
        }),

        singleValue: (styled) => ({
          ...styled,
          color: 'var(--pink)',
        }),

        multiValueRemove: (styled) => ({
          ...styled,
          color: 'var(--dark2)',
          cursor: 'pointer',
          '&:hover': {
            color: 'red',
          },
        }),

        input: (styled) => ({
          ...styled,
          color: 'white',
        }),

        noOptionsMessage: (styled) => ({
          ...styled,
          backgroundColor: 'var(--dark2)',
          color: 'var(--pink)',
        }),
      }}
    />
  );
}
