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
} from '@src/components/Modal';
import firebaseConfig from '@src/config/firebase';
import { reducer } from '@src/hooks/reducer';
import useAdmin from '@src/hooks/useAdmin';
import type {
  admin,
  DATA,
  Dispatch,
  DocAdminData,
  ResourceToolInterface,
} from '@src/types/admin';
import type {
  DocDataDiscriminated,
  DocErrors,
  DocMeta,
} from '@src/types/jsonApi';
import projectSchema from '@src/types/mongoose/schemas/project';
import {
  clientHandlerError,
  clientHandlerSuccess,
} from '@src/utils/clientHandler';
import { fetcherGeneric } from '@src/utils/fetcher';
import parseDate from '@src/utils/getStringDate';
import getStringOfTools from '@src/utils/getStringOfTools';
import HttpErrror from '@src/utils/httpError';
import getRandom from '@src/utils/randomNumber';
import { isTool } from '@src/utils/typescript/narrowing';
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
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useFieldArray,
  useFormState,
} from 'react-hook-form';
import { IoAddOutline } from 'react-icons/io5';
import styled from 'styled-components';
import useSWR, { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;
type ModalDataValidation = {
  title: string;
  startDate: string;
  endDate: string;
  tools: { value: string }[];
  typeProject: string;
  images: FileList;
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
  data: DocAdminData;
  dispatch: Dispatch;
}) {
  const projects = data.data;

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
          return (
            <TableBodyRow
              key={project.id || getRandom(index)}
              dispatch={dispatch}
              project={project}
            />
          );
        })}
      </tbody>
    </React.Fragment>
  );
}

function TableBodyRow({
  project,
  dispatch,
}: {
  project: DATA;
  dispatch: Dispatch;
}) {
  const [detail, setDetail] = useState(false);
  const ref = useRef<HTMLTableRowElement>(null);

  if (project.type == 'Tools' || project.attributes === undefined)
    return (
      <React.Fragment>
        <tr />
        <tr />
      </React.Fragment>
    );

  const {
    startDate,
    endDate,
    typeProject,
    tools,
    images,
    url,
    title,
    description,
  } = project.attributes;

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
            <p>{getStringOfTools(tools)}</p>
          </RowDetailsContentContentContent>
          <RowDetailsContentContentContent>
            <p>Website type</p>
            <p>
              {typeof typeProject == 'string' ? typeProject : typeProject.name}
            </p>
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
  const { data, error } = useSWR<
    DocDataDiscriminated<ResourceToolInterface[]>,
    DocErrors
  >('/api/tools', fetcherGeneric);
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseRootStroage = getStorage(firebaseApp);
  const reactForm = useForm<ModalDataValidation>();

  useEffect(() => {
    if (state.modal == 'add') {
      reactForm.reset(
        {
          title: '',
          startDate: '',
          endDate: '',
          url: '',
          description: '',
          typeProject: '',
          tools: [{ value: data && data.data[0] ? data.data[0].id : '' }],
        },
        { keepErrors: false, keepDirty: false, keepValues: false },
      );
    } else if (
      state.modal === 'update' &&
      state.row &&
      state.row.attributes &&
      state.row.type === 'Projects'
    ) {
      const {
        title,
        startDate,
        endDate,
        url,
        description,
        typeProject,
        tools,
      } = state.row.attributes;

      const fixTools = Array.isArray(tools)
        ? tools.map(
            (tool) =>
              ({ value: isTool(tool) ? tool._id : tool.toString() } as {
                value: string;
              }),
          )
        : isTool(tools)
        ? [{ value: tools._id }]
        : ([{ value: tools.toString() }] as { value: string }[]);
      reactForm.reset(
        {
          title,
          startDate: parseDate(startDate),
          endDate: parseDate(endDate),
          url,
          description,
          typeProject:
            typeof typeProject == 'string' ? typeProject : typeProject._id,
          tools: fixTools as { value: string }[],
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
          state.row.attributes &&
          state.row.type == 'Projects' &&
          state.row.id
        ) {
          dispatch({ type: 'modal/request/start' });

          const request = await fetcherGeneric<DocMeta>(
            `/api/projects/${state.row.id}`,
            {
              method: 'delete',
            },
          );

          await deleteImages(state.row.attributes.images, firebaseRootStroage);

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
          'tools'
        >]: Property extends 'images'
          ? typeof data['images'] | { src: string; ref: string }[]
          : typeof data[Property];
      } & { tools: string[] };
    } = {
      type: 'project',
      attributes: { ...data, tools: data.tools.map((tool) => tool.value) },
    };

    try {
      // Logic
      dispatch({ type: 'modal/request/start' });
      Doc.attributes.images = await uploadImages(
        data.images,
        firebaseRootStroage,
      );

      const request = await fetcherGeneric<DocMeta>('/api/projects', {
        method: 'post',
        body: JSON.stringify(Doc),
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
      /* 
        Jika fetchGeneric melemparkan error (yang dikembalikan oleh /api kita)
        maka berarti gambar yang dipilih telah diupload kedalam database maka kita harus 
        menghapus gambar yang sudah terupload tersebut
      */
      if (err instanceof HttpErrror)
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
          'tools'
        >]: Property extends 'images'
          ? typeof data['images'] | { src: string; ref: string }[]
          : typeof data[Property];
      } & { tools: string[] };
    } = {
      type: 'project',
      id: state.row?.id || '',
      attributes: { ...data, tools: data.tools.map((tool) => tool.value) },
    };
    if (
      state.row &&
      state.row.attributes &&
      state.row.type == 'Projects' &&
      state.row.id
    ) {
      try {
        const imagesOld = state.row.attributes.images.map((image) => ({
          src: image.src,
          ref: image.ref,
        }));

        // Logic
        dispatch({ type: 'modal/request/start' });

        if (data.images.length > 0) {
          Doc.attributes.images = await uploadImages(
            data.images,
            firebaseRootStroage,
          );
        } else Doc.attributes.images = imagesOld;

        const request = await fetcherGeneric<DocMeta>(
          `/api/projects/${state.row.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify(Doc),
            headers: {
              'content-type': 'application/vnd.api+json',
            },
          },
        );

        if (data.images.length > 0)
          await deleteImages(state.row.attributes.images, firebaseRootStroage);

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

        if (data.images.length > 0 && err instanceof HttpErrror)
          imageErrorHandling(Doc.attributes.images, firebaseRootStroage);

        clientHandlerError(err, dispatch, mutate, '/api/projects').catch(
          (err) => console.error(err),
        );
      }
    }
  });

  if (error) {
    return (
      <ModalMain2>
        <ModalContent2>
          <Heading size={1} minSize={1}>
            <span>Error </span>
            when try
            <span> fetching data</span>
          </Heading>
        </ModalContent2>
      </ModalMain2>
    );
  }

  if (!data) {
    return (
      <ModalMain2>
        <ModalContent2>
          <div className="loader" />
        </ModalContent2>
      </ModalMain2>
    );
  }

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
      if (!state.row.attributes) throw new Error('row.attribues is not found');
      if (state.row.type === 'Tools') throw new Error('type of row is wrong');

      return (
        <FormProvider {...reactForm}>
          <ModalAddUpdate
            handler={onSubmitModalUpdate}
            data={data}
            defaultValues={state.row.attributes.tools}
            modal="UPDATE"
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
  defaultValues,
  modal,
  handler,
}: {
  handler: (e: React.BaseSyntheticEvent) => Promise<void>;
  data: DocDataDiscriminated<ResourceToolInterface[]>;
  defaultValues?: projectSchema['tools'];
  modal: 'ADD' | 'UPDATE';
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
          <Label size={1} minSize={1} htmlFor="file">
            Images:
          </Label>
          <Input
            borderColor={errors.images && 'var(--red2)'}
            borderColor2={errors.images && 'var(--red)'}
            {...register('images', {
              required: {
                value: modal === 'ADD' ? true : false,
                message: 'Please insert image',
              },
              validate: (files) => {
                if (files instanceof FileList === false) return 'INVALID VALUE';

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
                  if (file.size > 2000000) return 'MAX IMAGE SIZE IS 2MB';
                }

                return true;
              },
            })}
            type="file"
            id="file"
            multiple
            accept=".jpg, .png, .jpeg, .webp"
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
          {defaultValues ? (
            <InputCollections data={data} defaultValues={defaultValues} />
          ) : (
            <InputCollections data={data} />
          )}
        </ModalFormContentRow>
      </ModalFormContent>
      <ModalFormFooter>
        <Button type="submit">SUBMIT</Button>
      </ModalFormFooter>
    </ModalForm>
  );
}

function InputCollections({
  data,
  defaultValues,
}: {
  data: DocDataDiscriminated<ResourceToolInterface[]>;
  defaultValues?: projectSchema['tools'];
}) {
  const { control, unregister } = useFormContext<ModalDataValidation>();
  const { fields, append, replace } = useFieldArray({ control, name: 'tools' });
  const [inputState, setInputState] = useState<string[]>(() => {
    if (defaultValues) {
      if (Array.isArray(defaultValues)) {
        return defaultValues.map((value) => {
          const realValue = isTool(value) ? value._id : value.toString();
          return realValue as string;
        });
      }

      const realValue = isTool(defaultValues)
        ? defaultValues._id
        : defaultValues.toString();
      return [realValue as string];
    }

    // Jika tidak ada nilai dafault
    const realValue = data.data[0].id;
    return [realValue];
  });

  // callback
  function onChangeItem(
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) {
    const arrayBaru = [...inputState];
    arrayBaru[index] = event.currentTarget.value;
    setInputState(arrayBaru);
  }

  function onRemoveItem(
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) {
    const newInputState = [...inputState].filter((value, idx) => index !== idx);
    if (newInputState.length > 0) {
      setInputState(newInputState);
      unregister(`tools.${index}.value`);
      replace(newInputState.map((value) => ({ value })));
    }
  }

  function onAddItem() {
    const newInputState = [...inputState];
    const value = data.data[0].id;
    newInputState.push(value);
    setInputState(newInputState);
    append({ value });
  }

  return (
    <ContainerInputs>
      <Button className="add" type="button" onClick={() => onAddItem()}>
        <IoAddOutline />
      </Button>
      {fields.map((field, index) => {
        return (
          <Controller
            name={`tools.${index}.value`}
            control={control}
            key={getRandom(index)}
            defaultValue={field.value}
            render={({ field: { onBlur, onChange, ref, name, value } }) => {
              return (
                <ContainerInput>
                  <select
                    name={name}
                    onChange={(event) => {
                      onChangeItem(event, index);
                      onChange(event.currentTarget.value);
                    }}
                    onBlur={onBlur}
                    value={value}
                    key={getRandom(index)}
                    ref={ref}
                  >
                    {data.data.map((value) => {
                      const textOption = value.attributes
                        ? value.attributes.name
                        : 'undefined';
                      return (
                        <option key={value.id} value={value.id}>
                          {textOption}
                        </option>
                      );
                    })}
                  </select>
                  <Button
                    type="button"
                    onClick={(event) => onRemoveItem(event, index)}
                  >
                    X
                  </Button>
                </ContainerInput>
              );
            }}
          />
        );
      })}
    </ContainerInputs>
  );
}

async function deleteImages(
  images: projectSchema['images'],
  stroage: FirebaseStorage,
) {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imgRef = ref(stroage, image.ref);
    await deleteObject(imgRef);
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

const ContainerInputs = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  gap: 0.5rem;

  & button.add {
    transition: var(--transition);
    opacity: 0;
    position: absolute;
    left: -40px;
    width: 30px;
    height: 30px;
    top: 50%;
    margin-top: -15px;
  }


  &:hover button {
    opacity: 1;
  }
  }
`;

const ContainerInput = styled.div`
  position: relative;

  & > button {
    position: absolute;
    right: -35px;
    width: 30px;
    height: 30px;
    top: 50%;
    margin-top: -15px;
  }

  & > select {
    width: 100%;
  }
`;
// // // Styled Component
