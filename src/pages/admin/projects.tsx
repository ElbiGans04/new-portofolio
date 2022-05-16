import Admin, {
  AdminError,
  AdminLoading,
  AdminModal,
  RowDetail,
  RowDetailsContentContentContent,
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
import firebaseConfig from '@src/config/firebase';
import { reducer } from '@src/hooks/reducer';
import useAdmin from '@src/hooks/useAdmin';
import type {
  admin,
  Dispatch,
  DocAdminDataPlural,
  DocProject,
  DocTools,
  RelationshipProjectInterface,
} from '@src/types/admin';
import type { DocErrors, DocMeta } from '@src/types/jsonApi';
import projectSchema from '@src/types/mongoose/schemas/project';
import {
  clientHandlerError,
  clientHandlerSuccess,
} from '@src/utils/clientHandler';
import { fetcherGeneric } from '@src/utils/fetcher';
import parseDate from '@src/utils/getStringDate';
import HttpErrror from '@src/utils/httpError';
import getRandom from '@src/utils/randomNumber';
import upperFirstWord from '@src/utils/upperFirstWord';
import { initializeApp } from 'firebase/app';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import Head from 'next/head';
import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  Control,
  FieldError,
  FormProvider,
  useController,
  useForm,
  useFormContext,
  useFormState,
} from 'react-hook-form';
import { IoAddOutline } from 'react-icons/io5';
import Select from 'react-select';
import styled from 'styled-components';
import useSWR, { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;
type ModalDataValidation = {
  title: string;
  startDate: string;
  endDate: string;
  tools: { value: string; label: string }[];
  typeProject: string;
  images: FileList | null;
  description: string;
  url: string;
};

export default function Projects() {
  const { data, error, ref } = useAdmin('/api/projects');
  const [state, dispatch] = useReducer(reducer, {
    // iddle, loading, finish
    status: 'iddle',
    message: null,
    modal: null,
    row: null,
  });

  if (error) return <AdminError />;
  if (!data) return <AdminLoading />;

  return (
    <React.Fragment>
      <Head>
        <title>Projects</title>
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
        <TableHeadBody data={data} dispatch={dispatch} />
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
  const projects = data.data;
  const included = data.included as Array<RelationshipProjectInterface>;

  return (
    <React.Fragment>
      <thead>
        <tr>
          <th />
          <th>Title</th>
          <th>Description</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => {
          if (
            project.type === 'Project' &&
            data.included &&
            project.relationships
          ) {
            const includedFinal = included.reduce((prev, val) => {
              if (project.relationships) {
                const relationshipTools = project.relationships.tools;
                const relationshipType = project.relationships.typeProject;
                const results: typeof included = [...prev];
                if (
                  relationshipTools?.data &&
                  Array.isArray(relationshipTools?.data)
                ) {
                  const match =
                    relationshipTools?.data.findIndex(
                      (tool) => tool.id === val.id,
                    ) > -1
                      ? true
                      : false;
                  if (match) {
                    const asData =
                      val.type === 'Tool'
                        ? val.relationships?.as?.data
                        : undefined;
                    if (asData && asData && !Array.isArray(asData)) {
                      const matchAs = included.find(
                        (candidate) => candidate.id === asData.id,
                      );
                      if (matchAs) results.push(matchAs);
                    }
                    results.push(val);
                  }
                }

                if (
                  !Array.isArray(relationshipType?.data) &&
                  typeof relationshipType?.data === 'object' &&
                  typeof relationshipType?.data !== 'undefined' &&
                  relationshipType.data !== null
                ) {
                  const match = relationshipType?.data.id === val.id;
                  if (match) results.push(val);
                }

                return results;
              }
              return prev;
            }, [] as Array<RelationshipProjectInterface>);

            return (
              <TableBodyRow
                key={project.id || getRandom(index)}
                dispatch={dispatch}
                project={{ data: project, included: includedFinal }}
              />
            );
          }

          return <></>;
        })}
      </tbody>
    </React.Fragment>
  );
}

function TableBodyRow({
  project,
  dispatch,
}: {
  project: DocProject & { included: Array<RelationshipProjectInterface> };
  dispatch: Dispatch;
}) {
  const [detail, setDetail] = useState(false);
  const ref = useRef<HTMLTableRowElement>(null);

  if (
    project.data.type === 'Project' &&
    project.data.attributes &&
    project.included
  ) {
    const { startDate, endDate, images, url, title, description } =
      project.data.attributes;

    const typeProject = project.included
      .filter((projectCandidate) => {
        return projectCandidate.type === 'TypeProject' ? true : false;
      })
      .map((candidate) => {
        return candidate.attributes && candidate.type === 'TypeProject'
          ? candidate.attributes.name
          : 'unknown';
      })
      .join(', ');

    const tools = project.included
      .filter((projectCandidate) => {
        return projectCandidate.type === 'Tool' ? true : false;
      })
      .map((candidate) => {
        const matchAs = project.included.find((candidateAs) => {
          if (candidate.type !== 'Tool') return false;
          if (
            !candidate.relationships?.as?.data ||
            Array.isArray(candidate.relationships?.as.data)
          )
            return false;
          return candidateAs.id === candidate.relationships?.as?.data.id;
        });

        return candidate.attributes && candidate.type === 'Tool'
          ? `${candidate.attributes.name} as ${
              matchAs && matchAs.attributes
                ? matchAs.attributes.name
                : 'unknown'
            }`
          : 'unknown';
      })
      .join(', ');

    return (
      <React.Fragment>
        {/* Row Main */}
        <tr>
          <td>
            <Button
              title="see details of row"
              onClick={() => setDetail((state) => !state)}
            >
              <IoAddOutline />
            </Button>
          </td>
          <td>{title}</td>
          <td>{description}</td>
          <TdButton dispatch={dispatch} payload={project} />
        </tr>
        {/* Row Details */}
        <RowDetail
          ref={ref}
          open={detail}
          colSpan={4}
          height={detail && ref.current ? ref.current.scrollHeight : 0}
        >
          <React.Fragment>
            <RowDetailsContentContentContent>
              <p>Development start date</p>
              <p>{parseDate(startDate)}</p>
            </RowDetailsContentContentContent>
            <RowDetailsContentContentContent>
              <p>Development completion date</p>
              <p>{parseDate(endDate)}</p>
            </RowDetailsContentContentContent>
            <RowDetailsContentContentContent>
              <p>Images</p>
              <p>{images.map((image) => image.ref).join(', ')}</p>
            </RowDetailsContentContentContent>
            <RowDetailsContentContentContent>
              <p>Tools</p>
              <p>{tools}</p>
            </RowDetailsContentContentContent>
            <RowDetailsContentContentContent>
              <p>Website type</p>
              <p>{typeProject}</p>
            </RowDetailsContentContentContent>
            <RowDetailsContentContentContent>
              <p>Website url</p>
              <p>{url}</p>
            </RowDetailsContentContentContent>
          </React.Fragment>
        </RowDetail>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <tr />
      <tr />
    </React.Fragment>
  );
}

// {
//   modal,
//   row: { id, columns, columnsValue },
// }
function SwitchModal({
  state,
  dispatch,
}: {
  state: admin;
  dispatch: Dispatch;
}): JSX.Element {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };
  const { data, error } = useSWR<DocTools, DocErrors>(
    '/api/tools',
    fetcherGeneric,
  );
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseRootStroage = getStorage(firebaseApp);
  const reactForm = useForm<ModalDataValidation>();

  useEffect(() => {
    if (state.modal == 'add') {
      const firstRow = data?.data[0];
      reactForm.reset(
        {
          title: '',
          startDate: '',
          endDate: '',
          url: '',
          description: '',
          typeProject: '',
          tools: [
            data && firstRow
              ? {
                  value: firstRow.id,
                  label:
                    firstRow.attributes && firstRow.attributes.name
                      ? firstRow.attributes.name
                      : 'unkown',
                }
              : { value: '', label: 'unkown' },
          ],
          images: null,
        },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    } else if (
      state.modal === 'update' &&
      state.row &&
      state.row.data.attributes &&
      state.row.included &&
      state.row.data.type === 'Project'
    ) {
      const row = state.row as DocProject;

      if (!row.included) throw new Error('row.included is undefined');
      if (!row.data.attributes) throw new Error('row.attributes is undefined');

      const { title, startDate, endDate, url, description } =
        row.data.attributes;

      const tools = row.included
        .filter((candidate) => {
          return candidate.type === 'Tool' ? true : false;
        })
        .map((candidate) => {
          return {
            value: candidate.id,
            label:
              candidate.type === 'Tool' && candidate.attributes
                ? candidate.attributes.name
                : 'unknown',
          };
        });

      const typeProject = row.included
        .filter((projectCandidate) => {
          return projectCandidate.type === 'TypeProject' ? true : false;
        })
        .map((candidate) => candidate.id)
        .join(', ');
      reactForm.reset(
        {
          title,
          startDate: parseDate(startDate),
          endDate: parseDate(endDate),
          url,
          description,
          typeProject,
          tools,
          images: null,
        },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    }
  }, [reactForm, state.modal, state.row, data]);

  /* 
    Event Handler function
  */
  function onSubmitModalDelete() {
    const callback = async () => {
      try {
        if (
          state.row &&
          state.row.data.attributes &&
          state.row.data.type == 'Project' &&
          state.row.data.id
        ) {
          dispatch({ type: 'modal/request/start' });

          const request = await fetcherGeneric<DocMeta>(
            `/api/projects/${state.row.data.id}`,
            {
              method: 'delete',
            },
          );

          await deleteImages(
            state.row.data.attributes.images,
            firebaseRootStroage,
          );

          await clientHandlerSuccess(
            request.meta.title as string,
            dispatch,
            mutate,
            '/api/projects',
          );
        }
      } catch (err) {
        clientHandlerError(err, dispatch, mutate, '/api/projects').catch(
          (err) => console.error(err),
        );
      }
    };

    callback().catch((err) => console.error(err));
  }

  const onSubmitModalAdd = reactForm.handleSubmit(async function (data) {
    const Doc: {
      type: string;
      attributes: {
        [Property in keyof typeof data as Exclude<
          Property,
          'tools' | 'typeProject'
        >]: Property extends 'images'
          ? typeof data['images'] | { src: string; ref: string }[]
          : typeof data[Property];
      };
      relationships: {
        tools: {
          data: { type: string; id: string }[];
        };
        typeProject: {
          data: { type: string; id: string };
        };
      };
    } = {
      type: 'project',
      attributes: {
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        images: data.images,
        description: data.description,
        url: data.url,
      },
      relationships: {
        typeProject: {
          data: {
            type: 'typeProject',
            id: data.typeProject,
          },
        },
        tools: {
          data: data.tools.map((tool) => ({ id: tool.value, type: 'tool' })),
        },
      },
    };

    try {
      // Logic
      dispatch({ type: 'modal/request/start' });
      Doc.attributes.images = await uploadImages(
        data.images as FileList,
        firebaseRootStroage,
      );

      const request = await fetcherGeneric<DocMeta>('/api/projects', {
        method: 'post',
        body: JSON.stringify({ data: Doc }),
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      });

      await clientHandlerSuccess(
        request.meta.title as string,
        dispatch,
        mutate,
        '/api/projects',
      );
    } catch (err) {
      console.log(err);
      /*
        Jika fetchGeneric melemparkan error (yang dikembalikan oleh /api kita)
        maka berarti gambar yang dipilih telah diupload kedalam database maka kita harus
        menghapus gambar yang sudah terupload tersebut
      */
      if (err instanceof HttpErrror && Doc.attributes.images !== null)
        imageErrorHandling(Doc.attributes.images, firebaseRootStroage);

      clientHandlerError(err, dispatch, mutate, '/api/projects').catch((err) =>
        console.error(err),
      );
    }
  });
  const onSubmitModalUpdate = reactForm.handleSubmit(async (data) => {
    const Doc: {
      type: string;
      id: string;
      attributes: {
        [Property in keyof typeof data as Exclude<
          Property,
          'tools' | 'typeProject'
        >]: Property extends 'images'
          ? typeof data['images'] | { src: string; ref: string }[]
          : typeof data[Property];
      };
      relationships: {
        tools: {
          data: { type: string; id: string }[];
        };
        typeProject: {
          data: { type: string; id: string };
        };
      };
    } = {
      type: 'project',
      id: state.row?.data?.id || '',
      attributes: {
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        images: data.images,
        description: data.description,
        url: data.url,
      },
      relationships: {
        typeProject: {
          data: {
            type: 'typeProject',
            id: data.typeProject,
          },
        },
        tools: {
          data: data.tools.map((tool) => ({ id: tool.value, type: 'tool' })),
        },
      },
    };
    if (
      state.row &&
      state.row.data.attributes &&
      state.row.data.type == 'Project' &&
      state.row.data.id
    ) {
      try {
        const imagesOld = state.row.data.attributes.images.map((image) => ({
          src: image.src,
          ref: image.ref,
        }));

        // Logic
        dispatch({ type: 'modal/request/start' });

        if (data.images && data.images.length > 0) {
          Doc.attributes.images = await uploadImages(
            data.images,
            firebaseRootStroage,
          );
        } else Doc.attributes.images = imagesOld;

        const request = await fetcherGeneric<DocMeta>(
          `/api/projects/${state.row.data.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({ data: Doc }),
            headers: {
              'content-type': 'application/vnd.api+json',
            },
          },
        );

        if (data.images && data.images.length > 0)
          await deleteImages(
            state.row.data.attributes.images,
            firebaseRootStroage,
          );

        await clientHandlerSuccess(
          request.meta.title as string,
          dispatch,
          mutate,
          '/api/projects',
        );
      } catch (err) {
        /* 
            Jika fetchGeneric melemparkan error (yang dikembalikan oleh /api kita)
            maka berarti gambar yang dipilih telah diupload kedalam database maka kita harus 
            menghapus gambar yang sudah terupload tersebut
        */

        if (
          data.images &&
          Doc.attributes.images &&
          data.images.length > 0 &&
          err instanceof HttpErrror
        )
          imageErrorHandling(Doc.attributes.images, firebaseRootStroage);

        clientHandlerError(err, dispatch, mutate, '/api/projects').catch(
          (err) => console.error(err),
        );
      }
    }
  });

  if (error) return <ModalError />;

  if (!data) return <ModalLoading />;

  switch (state.modal) {
    case 'add':
      return (
        <FormProvider {...reactForm}>
          <ModalAddUpdate handler={onSubmitModalAdd} data={data} modal="ADD" />
        </FormProvider>
      );
    case 'delete': {
      return (
        <ModalMain2>
          <ModalContent2>
            <Heading size={1} minSize={1}>
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
      if (!state.row.data.attributes)
        throw new Error('row.attribues is not found');
      if (state.row.data.type !== 'Project')
        throw new Error('type of row is wrong');

      return (
        <FormProvider {...reactForm}>
          <ModalAddUpdate
            handler={onSubmitModalUpdate}
            data={data}
            modal="UPDATE"
            defaultValueImages={state.row.data.attributes.images
              .map(
                (image) =>
                  image.ref.split('/')[image.ref.split('/').length - 1],
              )
              .join(', ')}
          />
        </FormProvider>
      );
    }
    default:
      return <> </>;
  }
}

function ModalAddUpdate({
  data,
  modal,
  handler,
  defaultValueImages,
}: {
  handler: (e: React.BaseSyntheticEvent) => Promise<void>;
  data: DocTools;
  defaultValueImages?: string;
  modal: 'ADD' | 'UPDATE';
}) {
  const { register, control } = useFormContext<ModalDataValidation>();
  const { errors } = useFormState({ control });
  const Handler = (e: React.BaseSyntheticEvent) => {
    handler(e).catch((err) => console.error(err));
  };
  const result: {
    label: string;
    options: { label: string; value: string }[];
  }[] = [];
  data.data.filter((data2) => {
    const attribute = data2.attributes;
    const relationships = data2.relationships?.as?.data;
    const included = data.included;

    if (
      attribute &&
      relationships &&
      !Array.isArray(relationships) &&
      included
    ) {
      const matchIncluded = included.find(
        (candidateVal) => candidateVal.id === relationships.id,
      )?.attributes?.name;
      const hasGroup = result.findIndex(
        (data3) =>
          data3.label.toLowerCase() === (matchIncluded?.toLowerCase() || ''),
      );
      const value = { label: upperFirstWord(attribute.name), value: data2.id };
      if (hasGroup >= 0) {
        result[hasGroup].options.push(value);
      } else {
        result.push({ label: matchIncluded || 'unknown', options: [value] });
      }
    } else return false;
  });

  const errorTools = errors.tools as FieldError | undefined;

  return (
    <ModalForm onSubmit={Handler}>
      <ModalFormContent>
        <ModalFormContentRow>
          <Label size={1} minSize={1} htmlFor="title">
            Title:{' '}
          </Label>
          <Input
            type="text"
            id="title"
            placeholder="enter the name of project"
            borderColor={errors.title && 'var(--red2)'}
            borderColor2={errors.title && 'var(--red)'}
            {...register('title', {
              required: {
                value: true,
                message: 'Please insert title',
              },
              maxLength: {
                value: 50,
                message: 'Maximum string length is 50',
              },
              minLength: {
                value: 3,
                message: 'Minimum string length is 3',
              },
            })}
          />
          {errors.title?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.title.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1} htmlFor="startDate">
            Date start of development:{' '}
          </Label>
          <Input
            type="date"
            id="startDate"
            placeholder="Enter the start date of development"
            borderColor={errors.startDate && 'var(--red2)'}
            borderColor2={errors.startDate && 'var(--red)'}
            {...register('startDate', {
              validate: (value) => {
                if (typeof value !== 'string') return 'INVALID DATE TYPE';
                const date = new Date(value);
                if (date.getFullYear() < 2018)
                  return "that year you haven't learned coding";
                return true;
              },
              required: {
                value: true,
                message: 'Please insert date',
              },
            })}
          />
          {errors.startDate?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.startDate.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1} htmlFor="endDate">
            Date end of development:
          </Label>
          <Input
            id="endDate"
            type="date"
            placeholder="enter the end date of development"
            borderColor={errors.endDate && 'var(--red2)'}
            borderColor2={errors.endDate && 'var(--red)'}
            {...register('endDate', {
              required: {
                value: true,
                message: 'Please insert date',
              },
              validate: (value) => {
                if (typeof value !== 'string') return 'INVALID DATE TYPE';
                const date = new Date(value);
                if (date.getFullYear() < 2018)
                  return "that year you haven't learned coding";
                return true;
              },
            })}
          />
          {errors.endDate?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.endDate.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1}>
            Images:
          </Label>
          <InputImage
            defaultValue={modal && defaultValueImages && defaultValueImages}
            control={control}
            modal={modal}
          />
          {errors.images?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.images.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1} htmlFor="url">
            Url of website:
          </Label>
          <Input
            type="text"
            id="url"
            placeholder="enter url"
            borderColor={errors.url && 'var(--red2)'}
            borderColor2={errors.url && 'var(--red)'}
            {...register('url', {
              required: {
                value: true,
                message: 'Please insert url',
              },
              pattern: {
                value:
                  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi,
                message: 'Please insert valid url, Prefix with http/https',
              },
            })}
          />
          {errors.url?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.url.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1} htmlFor="description">
            Description :
          </Label>
          <Input
            type="text"
            id="description"
            placeholder="enter description of project"
            borderColor={errors.description && 'var(--red2)'}
            borderColor2={errors.description && 'var(--red)'}
            {...register('description', {
              required: {
                value: true,
                message: 'Please insert description',
              },
              maxLength: {
                value: 500,
                message: 'Maximum string length is 500',
              },
              minLength: {
                value: 20,
                message: 'Minimum string length is 20',
              },
            })}
          />
          {errors.description?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.description.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1}>
            Type of project :
          </Label>
          <ContainerCheckbox>
            <Checkbox>
              <Input
                type="radio"
                id="work"
                value="A2"
                {...register('typeProject', {
                  required: {
                    value: true,
                    message: 'Please choose one',
                  },
                  validate: (value) => {
                    if (value !== 'A1' && value !== 'A2')
                      return 'invalid value';
                    else return true;
                  },
                })}
              />
              <Label size={1} minSize={1} htmlFor="work">
                Work project
              </Label>
            </Checkbox>
            <Checkbox>
              <Input
                borderColor={errors.typeProject && 'var(--red2)'}
                borderColor2={errors.typeProject && 'var(--red)'}
                {...register('typeProject', {
                  required: {
                    value: true,
                    message: 'Please choose one',
                  },
                  validate: (value) => {
                    if (value !== 'A1' && value !== 'A2')
                      return 'invalid value';
                    else return true;
                  },
                })}
                type="radio"
                id="personal"
                value="A1"
              />
              <Label size={1} minSize={1} htmlFor="work">
                Personal Project
              </Label>
            </Checkbox>
          </ContainerCheckbox>
          {errors.typeProject?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errors.typeProject.message}
            </p>
          )}
        </ModalFormContentRow>

        <ModalFormContentRow>
          <Label size={1} minSize={1} htmlFor="tools">
            Tool :
          </Label>
          <ReactSelect options={result} control={control} />
          {errorTools?.message && (
            <p
              style={{
                fontSize: '.9rem',
                color: 'var(--red)',
                margin: '0.5rem 0',
              }}
            >
              {errorTools.message}
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
  options: {
    label: string;
    options: { label: string; value: string }[];
  }[];
  control: Control<ModalDataValidation>;
}) {
  const {
    field: { ref, value, onBlur, onChange, name },
  } = useController({
    name: 'tools',
    control,
    rules: {
      required: {
        value: true,
        message: 'PLEASE SELECT TOOL AT LEAST ONE',
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
      isMulti
      captureMenuScroll={true}
      placeholder="Select the tools used in the project"
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

        multiValue: (styled) => ({
          ...styled,
          backgroundColor: 'var(--pink)',
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

function InputImage({
  modal,
  control,
  defaultValue,
}: {
  modal: 'ADD' | 'UPDATE';
  control: Control<ModalDataValidation>;
  defaultValue?: string;
}) {
  const {
    field: { onBlur, onChange, value, name, ref },
  } = useController({
    name: 'images',
    defaultValue: undefined,
    control,
    rules: {
      required: {
        value: modal === 'ADD' ? true : false,
        message: 'Please insert image',
      },
      validate: (files) => {
        if (files === null && modal === 'UPDATE') return true;

        if (files) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileFormat = file.name
              .split('.')
              [file.name.split('.').length - 1].toLowerCase();
            if (
              fileFormat !== 'png' &&
              fileFormat !== 'jpg' &&
              fileFormat !== 'jpeg' &&
              fileFormat !== 'webp'
            )
              return 'ONLY SUPPORT IMAGE WITH FORMAT png, jpeg, jpg, webp';
            if (file.size > 1000000) return 'MAX IMAGE SIZE IS 1MB';
          }

          return true;
        } else return 'Invalid value';
      },
    },
  });

  const val = useMemo(() => {
    if (value) {
      let str = '';
      for (let i = 0; i < value.length; i++) {
        str += `${value[i].name}`;
        if (i !== value.length - 1) str += ', ';
      }

      return str;
    }
  }, [value]);

  const valShow = val ? val : defaultValue ? defaultValue : null;

  return (
    <InputImageContainer>
      <Input
        type="file"
        id="file"
        multiple
        accept=".jpg, .png, .jpeg, .webp"
        ref={ref}
        name={name}
        onBlur={onBlur}
        onChange={(e) =>
          e.currentTarget.files ? onChange(e.currentTarget.files) : ''
        }
      />
      <label title="Select images" htmlFor="file">
        Select images
      </label>
      {valShow && (
        <div>
          <p>{valShow}</p>
        </div>
      )}
    </InputImageContainer>
  );
}

async function deleteImages(
  images: projectSchema['images'],
  stroage: FirebaseStorage,
) {
  try {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imgRef = ref(stroage, image.ref);
      await deleteObject(imgRef);
    }
  } catch (err) {
    const error = err as { code?: string };
    if (error && typeof error === 'object' && error?.code) {
      if (error.code === 'storage/object-not-found') return false;
    }

    throw err;
  }
}

async function uploadImages(fileImage: FileList, storage: FirebaseStorage) {
  const images: { src: string; ref: string }[] = [];
  for (let i = 0; i < fileImage.length; i++) {
    const file = fileImage.item(i);

    if (file) {
      const name = `elbi-images-${Date.now()}-${file.name}`;
      const imageRef = ref(storage, `/images/${name}`);
      await uploadBytes(imageRef, file);
      images.push({
        src: await getDownloadURL(imageRef),
        ref: imageRef.fullPath,
      });
    }
  }

  return images;
}

function imageErrorHandling(
  images: { src: string; ref: string }[] | FileList,
  firebaseRootStroage: FirebaseStorage,
) {
  const imagesToDelete: Promise<void>[] = [];

  if (Array.isArray(images)) {
    images.forEach((image) => {
      imagesToDelete.push(deleteObject(ref(firebaseRootStroage, image.ref)));
    });
  }

  Promise.all(imagesToDelete).catch((err) => console.log(err));
}

// Styled Component

//
// Modal add content
//

const ContainerCheckbox = styled.div`
  width: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;

  & label {
    font-size: 1rem;
    font-weight: normal;
  }
`;

const Checkbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & input[type='radio'] {
    margin: 0 0.3rem;
  }
`;

const InputImageContainer = styled.div`
  margin: 0.5rem 0;
  & > label {
    margin-top: 1rem;
  }
  & > input[type='file'] {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    overflow: hidden;
    padding: 0;
    position: absolute !important;
    white-space: nowrap;
    width: 1px;
  }

  & > input[type='file']:before {
    content: 'Hello';
  }

  & > input[type='file'] + label {
    background-color: var(--pink);
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.2rem;
    padding: 0.5rem;
    font-size: 0.9rem;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
    transition: var(--transition);
  }

  & > input[type='file']:focus + label,
  & > input[type='file'] + label:hover {
    opacity: 0.8;
  }
  & > input[type='file']:focus + label {
    opacity: 0.7;
  }

  // Div
  & > div {
    margin: 1.5rem 0 0.5rem 0;
    color: var(--pink);
    display: grid;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    & > input[type='file'] + label {
      padding: 0.3rem;
    }
  }
`;
// // // Styled Component
