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
  ResourceProjectInterface,
} from '@src/types/admin';
import type {
  DocDataDiscriminated,
  DocErrors,
  DocMeta,
  ResourceObject,
} from '@src/types/jsonApi';
import { OObject, OObjectWithFiles } from '@src/types/jsonApi/object';
import { fetcherGeneric } from '@src/utils/fetcher';
import getRandom from '@src/utils/randomNumber';
import { initializeApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  FirebaseStorage,
} from 'firebase/storage';
import Head from 'next/head';
import React, { useReducer, useRef, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import styled from 'styled-components';
import useSWR, { useSWRConfig } from 'swr';
import toolSchema from '@src/types/mongoose/schemas/tool';
import projectSchema from '@src/types/mongoose/schemas/project';
import { isTool, isObject } from '@src/utils/typescript/narrowing';
import parseDate from '@src/utils/getStringDate';
import getStringOfTools from '@src/utils/getStringOfTools';

type mutateSWRCustom = <T>(key: string) => Promise<T>;

export default function Projects() {
  const { data, user, error, ref } = useAdmin('/api/projects');
  const [state, dispatch] = useReducer(reducer, {
    // iddle, loading, finish
    status: 'iddle',
    message: null,
    modal: null,
    row: null,
  });

  if (error) return <AdminError />;
  if (!data || !user) return <AdminLoading />;

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
              key={getRandom(index)}
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
    DocDataDiscriminated<ResourceObject<toolSchema>[]>,
    DocErrors
  >('/api/tools', fetcherGeneric);
  const row = state.row;
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseRootStroage = getStorage(firebaseApp);

  /* 
    Event Handler function
  */
  async function onSubmitModalDelete(id: string) {
    try {
      if (!modalNarrowing(row)) throw new Error('Invalid row format');
      if (!row.attributes) throw new Error('row.attributes not found');

      dispatch({ type: 'modal/request/start' });

      await deleteImages(row.attributes.images, firebaseRootStroage);

      const request = await fetcherGeneric<DocMeta>(`/api/projects/${id}`, {
        method: 'delete',
      });

      await modalFinish(request.meta.title as string, dispatch, mutate);
    } catch (err) {
      await EventErrorHandler(err, dispatch, mutate).catch((err) =>
        console.error(err),
      );
    }
  }
  async function onSubmitModalAdd(event: React.FormEvent<HTMLFormElement>) {
    const document: ResourceObject<{ [index: string]: OObjectWithFiles }> = {
      type: 'project',
      attributes: {},
    };
    try {
      event.preventDefault();
      const form2 = new FormData(event.currentTarget);
      const inputFiles = event.currentTarget[3] as HTMLInputElement;
      const fileImage = inputFiles.files;

      for (const [fieldName, fieldValue] of form2.entries()) {
        if (document.attributes) {
          // Check Jika tools properti sudah diisi
          if (document.attributes.tools) {
            // Jika sudah diganti sebelumnya
            if (Array.isArray(document.attributes.tools)) {
              document.attributes.tools.push(fieldValue as OObject);
            } else {
              document.attributes.tools = [
                document.attributes.tools as OObject,
                fieldValue as OObject,
              ];
            }

            continue;
          }

          document.attributes[fieldName] = fieldValue;
        }
      }

      if (!document.attributes) throw new Error('Document.attribute not found');

      // Logic
      dispatch({ type: 'modal/request/start' });
      if (fileImage) {
        document.attributes.images = await uploadImages(
          fileImage,
          firebaseRootStroage,
        );
      }

      const request = await fetcherGeneric<DocMeta>('/api/projects', {
        method: 'post',
        body: JSON.stringify(document),
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      });

      await modalFinish(request.meta.title as string, dispatch, mutate);
    } catch (err) {
      const images = document?.attributes?.images;
      const imagesToDelete: Promise<void>[] = [];

      if (images && Array.isArray(images)) {
        images.forEach((image) => {
          if (isObject(image)) {
            imagesToDelete.push(
              deleteObject(ref(firebaseRootStroage, image.ref as string)),
            );
          }
        });
      }

      Promise.all(imagesToDelete).catch((err) => console.log(err));
      await EventErrorHandler(err, dispatch, mutate).catch((err) =>
        console.error(err),
      );
    }
  }

  async function onSubmitModalUpdate(
    event: React.FormEvent<HTMLFormElement>,
    id: string,
  ) {
    event.preventDefault();
    const form2 = new FormData(event.currentTarget);
    const inputFiles = event.currentTarget[3] as HTMLInputElement;
    const fileImage = inputFiles.files;

    const document: ResourceObject<{
      [index: string]: OObjectWithFiles | OObject;
    }> = {
      id,
      type: 'project',
      attributes: {},
    };
    try {
      if (!modalNarrowing(row)) throw new Error('Invalid row format');
      if (!row.attributes) throw new Error('row.attributes not found');

      const images = row.attributes.images.map((image) => ({
        src: image.src,
        ref: image.ref,
      }));

      if (document.attributes == undefined)
        throw new Error('document.attributes is missing');

      for (const [fieldName, fieldValue] of form2.entries()) {
        if (document.attributes) {
          // Check Jika tools properti sudah diisi
          if (document.attributes.tools) {
            // Jika sudah diganti sebelumnya
            if (Array.isArray(document.attributes.tools)) {
              document.attributes.tools.push(fieldValue as OObject);
            } else {
              document.attributes.tools = [
                document.attributes.tools as OObject,
                fieldValue as OObject,
              ];
            }

            continue;
          }

          if (fieldName !== 'images')
            document.attributes[fieldName] = fieldValue;
        }
      }
      // Logic
      dispatch({ type: 'modal/request/start' });
      if (fileImage && fileImage.length > 0) {
        document.attributes.images = await uploadImages(
          fileImage,
          firebaseRootStroage,
        );
      } else document.attributes.images = images as any as OObject;

      const request = await fetcherGeneric<DocMeta>(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(document),
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      });

      if (fileImage && fileImage.length > 0)
        await deleteImages(row.attributes.images, firebaseRootStroage);

      await modalFinish(request.meta.title as string, dispatch, mutate);
    } catch (err) {
      if (fileImage && fileImage.length > 0) {
        const images = document?.attributes?.images;
        const imagesToDelete: Promise<void>[] = [];

        if (images && Array.isArray(images)) {
          images.forEach((image) => {
            if (isObject(image)) {
              imagesToDelete.push(
                deleteObject(ref(firebaseRootStroage, image.ref as string)),
              );
            }
          });
        }

        Promise.all(imagesToDelete).catch((err) => console.log(err));
      }
      await EventErrorHandler(err, dispatch, mutate).catch((err) =>
        console.error(err),
      );
    }
  }

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
        <ModalForm onSubmit={(event) => onSubmitModalAdd(event)}>
          <ModalFormContent>
            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="title">
                Title:{' '}
              </Label>
              <Input
                required
                type="text"
                id="title"
                placeholder="enter the project title"
                name="title"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="startDate">
                Date start of development:{' '}
              </Label>
              <Input
                required
                type="date"
                id="startDate"
                placeholder="enter the start date of development"
                name="startDate"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="endDate">
                Date end of development:
              </Label>
              <Input
                required
                id="endDate"
                type="date"
                placeholder="enter the end date of development"
                name="endDate"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="file">
                Images:
              </Label>
              <Input
                required
                name="images"
                type="file"
                id="file"
                multiple
                accept=".jpg, .png, .jpeg"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="url">
                Url of website:
              </Label>
              <Input
                required
                type="text"
                id="url"
                placeholder="enter url"
                name="url"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="description">
                Description :
              </Label>
              <Input
                required
                type="text"
                id="description"
                name="description"
                placeholder="enter description of project"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1}>
                Type of project :
              </Label>
              <ContainerCheckbox>
                <Checkbox>
                  <Input name="typeProject" type="radio" id="work" value="A2" />
                  <Label size={1} minSize={1} htmlFor="work">
                    Work project
                  </Label>
                </Checkbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="personal"
                    value="A1"
                  />
                  <Label size={1} minSize={1} htmlFor="work">
                    Personal Project
                  </Label>
                </Checkbox>
              </ContainerCheckbox>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="tools">
                tool :
              </Label>
              <InputCollections name="tools" data={data} />
            </ModalFormContentRow>
          </ModalFormContent>
          <ModalFormFooter>
            <Button type="submit">ADD Project</Button>
          </ModalFormFooter>
        </ModalForm>
      );
    case 'delete': {
      if (!row) throw new Error('row is not found');
      if (row.id === undefined) throw new Error('row.id not found');
      const id = row.id;

      return (
        <ModalMain2>
          <ModalContent2>
            <Heading size={1} minSize={1}>
              Are you sure want <span>delete the row?</span>
            </Heading>
          </ModalContent2>
          <ModalFooter>
            <Button onClick={() => onSubmitModalDelete(id)}>DELETE</Button>
          </ModalFooter>
        </ModalMain2>
      );
    }

    case 'update': {
      if (!row) throw new Error('row is not found');
      if (!row.attributes) throw new Error('row.attribues is not found');
      if (row.type === 'Tools') throw new Error('type of row is wrong');
      if (row.id === undefined) throw new Error('row.id not found');
      const id = row.id;

      return (
        <ModalForm onSubmit={(event) => onSubmitModalUpdate(event, id)}>
          <ModalFormContent>
            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="title">
                Title:{' '}
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="enter the project title"
                name="title"
                required
                defaultValue={row.attributes.title}
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="startDate">
                Date start of development:{' '}
              </Label>
              <Input
                type="date"
                id="startDate"
                placeholder="enter the start date of development"
                name="startDate"
                required
                defaultValue={parseDate(row.attributes.startDate)}
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="endDate">
                Date end of development:
              </Label>
              <Input
                id="endDate"
                type="date"
                placeholder="enter the end date of development"
                name="endDate"
                required
                defaultValue={parseDate(row.attributes.endDate)}
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1}>
                Images:
              </Label>
              <Input
                name="images"
                type="file"
                id="file"
                multiple
                accept=".jpg, .png, .jpeg"
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="url">
                Url of website:
              </Label>
              <Input
                type="text"
                id="url"
                placeholder="enter url"
                name="url"
                required
                defaultValue={row.attributes.url}
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="description">
                Description :
              </Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="enter description of project"
                required
                defaultValue={row.attributes.description}
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1}>
                Type of project :
              </Label>
              <ContainerCheckbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="work"
                    value="A2"
                    required
                    defaultChecked={
                      typeof row.attributes.typeProject === 'string'
                        ? undefined
                        : row.attributes.typeProject._id.toString() === 'A2'
                    }
                  />
                  <Label size={1} minSize={1} htmlFor="work">
                    Work project
                  </Label>
                </Checkbox>
                <Checkbox>
                  <Input
                    name="typeProject"
                    type="radio"
                    id="personal"
                    value="A1"
                    required
                    defaultChecked={
                      typeof row.attributes.typeProject === 'string'
                        ? undefined
                        : row.attributes.typeProject._id.toString() === 'A1'
                    }
                  />
                  <Label size={1} minSize={1} htmlFor="work">
                    Personal Project
                  </Label>
                </Checkbox>
              </ContainerCheckbox>
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="tools">
                Tools :
              </Label>
              <InputCollections
                name="tools"
                defaultValues={row.attributes.tools}
                data={data}
              />
            </ModalFormContentRow>
          </ModalFormContent>
          <ModalFormFooter>
            <Button type="submit">Update Project</Button>
          </ModalFormFooter>
        </ModalForm>
      );
    }
    default:
      return <> </>;
  }
}

function InputCollections({
  data,
  defaultValues,
  name,
}: {
  data: DocDataDiscriminated<ResourceObject<toolSchema>[]>;
  name: string;
  defaultValues?: projectSchema['tools'];
}) {
  const [inputState, setInputState] = useState(() => {
    if (defaultValues) {
      if (Array.isArray(defaultValues)) {
        return defaultValues.map((value) =>
          isTool(value) ? value._id : value.toString(),
        );
      }
    }

    // Jika tidak ada nilai dafault
    return data.data[0].id ? [data.data[0].id] : [];
  });

  const collectionInput = [];

  // callback
  function onChange(
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
    if (newInputState.length > 0) setInputState(newInputState);
  }

  function onAddItem() {
    const newInputState = [...inputState];
    newInputState.push(data.data[0].id || '');
    setInputState(newInputState);
  }

  // Looping untuk select element yang diperlukan
  for (let i = 0; i < inputState.length; i++) {
    const stateInput = inputState[i];
    const element = (
      <ContainerInput key={getRandom(i)}>
        <select
          onChange={(event) => onChange(event, i)}
          value={
            typeof stateInput == 'string' ? stateInput : stateInput.toString()
          }
          key={getRandom(i)}
          name={name}
        >
          {data.data.map((value) => {
            const textOption = value.attributes
              ? value.attributes.name
              : 'undefined';
            return (
              <option key={getRandom(i)} value={value.id}>
                {textOption}
              </option>
            );
          })}
        </select>
        <Button type="button" onClick={(event) => onRemoveItem(event, i)}>
          X
        </Button>
      </ContainerInput>
    );
    collectionInput.push(element);
  }
  return (
    <ContainerInputs>
      <Button className="add" type="button" onClick={() => onAddItem()}>
        <IoAddOutline />
      </Button>
      {collectionInput}
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
  const images: OObjectWithFiles = [];
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

async function EventErrorHandler(
  err: unknown,
  dispatch: Dispatch,
  mutate: mutateSWRCustom,
) {
  console.log(err);
  dispatch({
    type: 'modal/request/finish',
    payload: { message: 'error happend' },
  });
  await mutate('/api/projects');
}

async function modalFinish(
  message: string,
  dispatch: Dispatch,
  mutate: mutateSWRCustom,
) {
  dispatch({
    type: 'modal/request/finish',
    payload: { message },
  });
  await mutate('/api/projects');
}

function modalNarrowing(
  row: DATA | null | ResourceProjectInterface,
): row is ResourceProjectInterface {
  if (row && row.type === 'Projects') return true;
  else return false;
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
