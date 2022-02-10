import Admin from '@components/Admin';
import Button from '@components/Button';
import Heading from '@components/Heading';
import Input from '@components/Input';
import Label from '@components/Label';
import ModalComponent, {
  GlobalStyle,
  ModalAdmin,
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
import { fetcherGeneric } from '@module/fetcher';
import getRandom from '@module/randomNumber';
import changeFirstWord from '@module/upperFirstWord';
import type { admin } from '@typess/admin';
import type {
  Doc,
  DocErrors,
  DocMeta,
  ResourceObject,
  ResourceObjectForSendWithFiles,
} from '@typess/jsonApi';
import { OObject } from '@typess/jsonApi/object';
import { Dispatch } from 'hoist-non-react-statics/node_modules/@types/react';
import Head from 'next/head';
import React, { useReducer, useRef, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import useSWR, { useSWRConfig } from 'swr';

type mutateSWRCustom = <T>(key: string) => Promise<T>;

export default function Projects() {
  const ref = useRef(null);
  const [state, dispatch] = useReducer(reducer, {
    // iddle, loading, finish
    status: 'iddle',
    message: null,
    modal: null,
    row: null,
  });
  const [state2] = useState({
    dispatch,
    url: '/api/projects',
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
            if (
              typeof text === 'object' &&
              text !== null &&
              !Array.isArray(text)
            ) {
              textResult += changeFirstWord(text.name as string);
              if (index !== value.length - 1) textResult += ', ';
            }
          });
        }

        return <div>{textResult}</div>;
      },
      typeProject: function typeProject(value: OObject) {
        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        )
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
      <Admin />

      {/* Modal */}
      {/* Saat modal diopen overflow pada body harus dihidden */}
      {state.modal && <GlobalStyle />}
      <CSSTransition
        nodeRef={ref}
        classNames="modal"
        in={state.modal !== null}
        timeout={500}
      >
        <ModalComponent
          width="700px"
          height=""
          updateState={dispatch}
          defaultState={{ type: 'modal/close' }}
          ref={ref}
        >
          <ModalAdmin
            status={state.status}
            message={state.message}
            dispatch={dispatch}
            Children={() => <SwitchModal dispatch={dispatch} state={state} />}
          />
        </ModalComponent>
      </CSSTransition>
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
}) {
  const { mutate } = useSWRConfig() as { mutate: mutateSWRCustom };
  const { data, error } = useSWR<Doc, DocErrors>('/api/tools', fetcherGeneric);
  const row = state.row;

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
        <ModalForm onSubmit={(event) => onSubmit(event, dispatch, mutate)}>
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
              />
            </ModalFormContentRow>

            <ModalFormContentRow>
              <Label size={1} minSize={1} htmlFor="file">
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
              <Input type="text" id="url" placeholder="enter url" name="url" />
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
            <Button onClick={() => onSubmit2(row.id, dispatch, mutate)}>
              DELETE
            </Button>
          </ModalFooter>
        </ModalMain2>
      );
    case 'update':
      if (row && row.columns && row.columnsValue) {
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

        if (
          typeof typeProject === 'object' &&
          typeProject !== null &&
          !Array.isArray(typeProject) &&
          toolsValue
        ) {
          return (
            <ModalForm
              onSubmit={(event) => onSubmit3(event, row.id, dispatch, mutate)}
            >
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
      break;
    default:
      return <> </>;
  }
}

async function onSubmit(
  event: React.FormEvent<HTMLFormElement>,
  dispatch: Dispatch<any>,
  mutate: mutateSWRCustom,
) {
  try {
    event.preventDefault();
    const form = new FormData();
    const form2 = new FormData(event.currentTarget);
    const inputFiles = event.currentTarget[3] as HTMLInputElement;
    const fileImage = inputFiles.files;

    const document: ResourceObjectForSendWithFiles = {
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
    for (let i = 0; i < fileImage.length; i++) {
      const file = fileImage.item(i);
      if (file) form.append('images', file);
    }

    const { meta } = await fetcherGeneric<DocMeta>('/api/images', {
      method: 'post',
      body: form,
    });

    if (document.attributes) document.attributes.images = meta.images;

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

async function onSubmit2(
  id: string,
  dispatch: Dispatch<any>,
  mutate: mutateSWRCustom,
) {
  try {
    dispatch({ type: 'modal/request/start' });

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

async function onSubmit3(
  event: React.FormEvent<HTMLFormElement>,
  id: string,
  dispatch: Dispatch<any>,
  mutate: mutateSWRCustom,
) {
  try {
    event.preventDefault();
    const form = new FormData();
    const form2 = new FormData(event.currentTarget);
    const inputFiles = event.currentTarget[3] as HTMLInputElement;
    const fileImage = inputFiles.files;
    const document: ResourceObjectForSendWithFiles = {
      id,
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

        if (fieldName !== 'images') document.attributes[fieldName] = fieldValue;
      }
    }

    // Logic
    dispatch({ type: 'modal/request/start' });
    if (fileImage.length > 0) {
      for (let i = 0; i < fileImage.length; i++) {
        const file = fileImage.item(i);
        if (file) form.append('images', file);
      }

      const { meta } = await fetcherGeneric<DocMeta>('/api/images', {
        method: 'post',
        body: form,
      });

      if (document.attributes) document.attributes.images = meta.images;
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

// function InputCollections({
//   data: { data: result = [] } = {},
//   defaultValues = [],
//   ...props
// } = {}) {
//   const [inputState, setInputState] = useState(() =>
//     defaultValues.map((defaultValue) => defaultValue._id)
//   );
//   const [inputCount, setInputCount] = useState(defaultValues.length || 1);
//   const collectionInput = [];

//   // callback
//   function onChange(event, index) {
//     const arrayBaru = [...inputState];
//     arrayBaru[index] = event.target.value;
//     setInputState(arrayBaru);
//   }

//   // Looping untuk select element yang diperlukan
//   for (let i = 0; i < inputCount; i++) {
//     const element = (
//       <ContainerInput>
//         <select
//           onChange={(event) => onChange(event, i)}
//           value={inputState[i]}
//           key={getRandom()}
//           {...props}
//         >
//           {result.map((value) => {
//             return (
//               <option key={getRandom()} value={value._id}>
//                 {value.name}
//               </option>
//             );
//           })}
//         </select>
//         <Button type="button" onClick={() => console.log(i)}>X</Button>
//       </ContainerInput>
//     );
//     collectionInput.push(element);
//   }
//   return (
//     <ContainerInputs>
//       <Button className="add" type="button" onClick={() => setInputCount((state) => state + 1)}>
//         <IoAddOutline />
//       </Button>
//       {collectionInput}
//     </ContainerInputs>
//   );
// }

// data: { data: result = [] } = {},
// defaultValues = [],

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
          if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
          ) {
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
