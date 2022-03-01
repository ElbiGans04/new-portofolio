import Admin from '@src/components/Admin';
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
import Context from '@src/hooks/context';
import { reducer } from '@src/hooks/reducer';
import type { admin } from '@src/types/admin';
import type {
  DocData,
  DocErrors,
  DocMeta,
  ResourceObject,
} from '@src/types/jsonApi';
import { OObject, OObjectWithFiles } from '@src/types/jsonApi/object';
import { fetcherGeneric } from '@src/utils/fetcher';
import getRandom from '@src/utils/randomNumber';
import { isObject } from '@src/utils/typescript/narrowing';
import changeFirstWord from '@src/utils/upperFirstWord';
import Head from 'next/head';
import React, { useReducer, useState, Dispatch } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import styled from 'styled-components';
import useSWR, { useSWRConfig } from 'swr';
import firebaseConfig from '@src/config/firebase';
import { initializeApp } from 'firebase/app';
import {
  ref,
  uploadBytes,
  getStorage,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

type mutateSWRCustom = <T>(key: string) => Promise<T>;

export default function Projects() {
  const [state, dispatch] = useReducer(reducer, {
    // iddle, loading, finish
    status: 'iddle',
    message: null,
    modal: null,
    row: null,
  });
  const [state2] = useState({
    url: '/api/projects',
    dispatch,
    columns: ['title', 'description'],
    visible: {
      visibleValue: 0,
      visibleColumns: ['_id', '__v'],
    },
    renameColumns: {
      startDate: 'Date',
    },
    specialTreatment: {
      tools: function tools(value: OObject) {
        let textResult = '';
        if (Array.isArray(value)) {
          value.forEach((text, index) => {
            if (isObject(text)) {
              textResult += changeFirstWord(text.name as string);
              if (index !== value.length - 1) textResult += ', ';
            }
          });
        }

        return <div>{textResult}</div>;
      },
      typeProject: function typeProject(value: OObject) {
        if (isObject(value))
          return <div>{changeFirstWord(value.name as string)}</div>;
        return <div />;
      },
      images: function images(value: OObject) {
        let textResult = '';
        if (Array.isArray(value)) {
          value.forEach((text, index) => {
            if (typeof text === 'object' && text !== null) {
              if (Array.isArray(text)) return;
              textResult += text.src as string;
              if (index !== value.length - 1) textResult += ', ';
            }
          });
        }

        return <div>{textResult}</div>;
      },
      startDate: function startDate(value: OObject) {
        if (typeof value === 'string') return changeFormatDate(value);
        return '';
      },
      endDate: function endDate(value: OObject) {
        if (typeof value === 'string') return changeFormatDate(value);
        return '';
      },
    },
  });

  return (
    <Context.Provider value={state2}>
      <Head>
        <title>Projects</title>
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

// {
//   modal,
//   row: { id, columns, columnsValue },
// }
function SwitchModal({
  state,
  dispatch,
}: {
  state: admin;
  dispatch: Dispatch<any>;
}): JSX.Element {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };
  const { data, error } = useSWR<DocData, DocErrors>(
    '/api/tools',
    fetcherGeneric,
  );
  const row = state.row;
  const firebaseApp = initializeApp(firebaseConfig);
  const firebaseRootStroage = getStorage(firebaseApp);

  /* 
    Event Handler function
  */
  async function onSubmitModalDelete(id: string) {
    try {
      let images: OObject | OObject[] =
        row !== null
          ? row.columnsValue
            ? row.columnsValue[row.columns ? row.columns.indexOf('images') : 0]
            : null
          : null;

      if (Array.isArray(images)) {
        images = images.map((image) => {
          if (isObject(image)) {
            return { src: image.src as string, ref: image.ref as string };
          }

          return { src: '', ref: '' };
        });
      }

      dispatch({ type: 'modal/request/start' });

      if (Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          if (isObject(images[i])) {
            if (images[i]) {
              const image = images[i] as { [index: string]: OObject };
              if (image) {
                const R = (image.ref as string) || '';
                const imgRef = ref(firebaseRootStroage, R);
                if (R.length > 0) await deleteObject(imgRef);
              }
            }
          }
        }
      }

      const request = await fetcherGeneric<DocMeta>(`/api/projects/${id}`, {
        method: 'delete',
      });

      dispatch({
        type: 'modal/request/finish',
        payload: { message: request.meta.title as string },
      });
      await mutate('/api/projects');
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'modal/request/finish',
        payload: { message: 'error happend' },
      });
      await mutate('/api/projects');
    }
  }
  async function onSubmitModalAdd(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      const form2 = new FormData(event.currentTarget);
      const inputFiles = event.currentTarget[3] as HTMLInputElement;
      const fileImage = inputFiles.files;

      const document: ResourceObject<{ [index: string]: OObjectWithFiles }> = {
        type: 'project',
        attributes: {},
      };

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

      // Logic
      dispatch({ type: 'modal/request/start' });
      if (fileImage) {
        if (document.attributes) {
          document.attributes.images = [];

          for (let i = 0; i < fileImage.length; i++) {
            const file = fileImage.item(i);

            if (file) {
              const name = `elbi-images-${Date.now()}-${file.name}`;
              const imageRef = ref(firebaseRootStroage, `/images/${name}`);
              await uploadBytes(imageRef, file);
              document.attributes.images.push({
                src: await getDownloadURL(imageRef),
                ref: imageRef.fullPath,
              });
            }
          }
        }
      }

      const request = await fetcherGeneric<DocMeta>('/api/projects', {
        method: 'post',
        body: JSON.stringify(document),
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      });

      dispatch({
        type: 'modal/request/finish',
        payload: { message: request.meta.title },
      });
      await mutate('/api/projects');
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'modal/request/finish',
        payload: { message: 'error happend' },
      });
      await mutate('/api/projects');
    }
  }

  async function onSubmitModalUpdate(
    event: React.FormEvent<HTMLFormElement>,
    id: string,
  ) {
    try {
      event.preventDefault();
      const form2 = new FormData(event.currentTarget);
      const inputFiles = event.currentTarget[3] as HTMLInputElement;
      const fileImage = inputFiles.files;
      let images: OObject | OObject[] =
        row !== null
          ? row.columnsValue
            ? row.columnsValue[row.columns ? row.columns.indexOf('images') : 0]
            : null
          : null;

      if (Array.isArray(images)) {
        images = images.map((image) => {
          if (isObject(image)) {
            return { src: image.src as string, ref: image.ref as string };
          }

          return { src: '', ref: '' };
        });
      }

      const document: ResourceObject<{
        [index: string]: OObjectWithFiles | OObject;
      }> = {
        id,
        type: 'project',
        attributes: {},
      };

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
      if (fileImage) {
        if (fileImage.length > 0) {
          if (document.attributes) {
            document.attributes.images = [];

            if (Array.isArray(images)) {
              for (let i = 0; i < images.length; i++) {
                if (isObject(images[i])) {
                  if (images[i]) {
                    const image = images[i] as { [index: string]: OObject };
                    if (image) {
                      const R = (image.ref as string) || '';
                      const imgRef = ref(firebaseRootStroage, R);
                      if (R.length > 0) await deleteObject(imgRef);
                    }
                  }
                }
              }
            }

            for (let i = 0; i < fileImage.length; i++) {
              const file = fileImage.item(i);

              if (file) {
                const name = `elbi-images-${Date.now()}-${file.name}`;
                const imageRef = ref(firebaseRootStroage, `/images/${name}`);
                await uploadBytes(imageRef, file);
                document.attributes.images.push({
                  src: await getDownloadURL(imageRef),
                  ref: imageRef.fullPath,
                });
              }
            }
          }
        } else document.attributes.images = images;
      }

      const request = await fetcherGeneric<DocMeta>(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(document),
        headers: {
          'content-type': 'application/vnd.api+json',
        },
      });

      dispatch({
        type: 'modal/request/finish',
        payload: { message: request.meta.title },
      });

      await mutate('/api/projects');
    } catch (err) {
      console.log(err);
      dispatch({
        type: 'modal/request/finish',
        payload: { message: 'error happend' },
      });

      await mutate('/api/projects');
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
              <InputCollections
                name="tools"
                data={data.data as ResourceObject[]}
              />
            </ModalFormContentRow>
          </ModalFormContent>
          <ModalFormFooter>
            <Button type="submit">ADD Project</Button>
          </ModalFormFooter>
        </ModalForm>
      );
    case 'delete':
      return (
        <ModalMain2>
          <ModalContent2>
            <Heading size={1} minSize={1}>
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
    case 'update':
      if (row) {
        const titleValue = row.columnsValue[
          row.columns.indexOf('title')
        ] as string;
        const startDateValue = changeFormatDate(
          row.columnsValue[row.columns.indexOf('startDate')] as string,
        );
        const endDateValue = changeFormatDate(
          row.columnsValue[row.columns.indexOf('endDate')] as string,
        );
        const urlValue = row.columnsValue[row.columns.indexOf('url')] as string;
        const descriptionValue = row.columnsValue[
          row.columns.indexOf('description')
        ] as string;
        const typeProject =
          row.columnsValue[row.columns.indexOf('typeProject')];
        const toolsValue = row.columnsValue[row.columns.indexOf('tools')];

        if (isObject(typeProject) && toolsValue) {
          return (
            <ModalForm onSubmit={(event) => onSubmitModalUpdate(event, row.id)}>
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
                    defaultValue={titleValue}
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
                    defaultValue={startDateValue}
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
                    defaultValue={endDateValue}
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
                    defaultValue={urlValue}
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
                    defaultValue={descriptionValue}
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
                        defaultChecked={typeProject._id === 'A2'}
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
                        defaultChecked={typeProject._id === 'A1'}
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
                    defaultValues={toolsValue}
                    data={data.data as ResourceObject[]}
                  />
                </ModalFormContentRow>
              </ModalFormContent>
              <ModalFormFooter>
                <Button type="submit">Update Project</Button>
              </ModalFormFooter>
            </ModalForm>
          );
        }
      }

      return <></>;
      break;
    default:
      return <> </>;
  }
}

function InputCollections({
  data,
  defaultValues,
  name,
}: {
  data: ResourceObject[];
  name: string;
  defaultValues?: OObject;
}) {
  const [inputState, setInputState] = useState(() => {
    if (defaultValues) {
      if (Array.isArray(defaultValues)) {
        return defaultValues.map((value) => {
          if (isObject(value)) {
            return value._id as string;
          }
        });
      }
    }

    // Jika tidak ada nilai dafault
    return [data[0]?.id];
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
    newInputState.push(data[0]?.id);
    setInputState(newInputState);
  }

  // Looping untuk select element yang diperlukan
  for (let i = 0; i < inputState.length; i++) {
    const element = (
      <ContainerInput key={i}>
        <select
          onChange={(event) => onChange(event, i)}
          value={inputState[i]}
          key={getRandom(i)}
          name={name}
        >
          {data.map((value) => {
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

function changeFormatDate(data: string) {
  const date = new Date(data);
  const month =
    date.getMonth() + 1 < 10
      ? `0${date.getMonth() + 1}`
      : `${date.getMonth() + 1}`;
  return `${date.getFullYear()}-${month}-${
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  }`;
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
