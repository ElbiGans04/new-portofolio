import Head from 'next/head';
import Heading from '@components/Heading';
import styled, { createGlobalStyle } from 'styled-components';
import React, {
  useEffect,
  useReducer,
  useState,
  useRef,
  MouseEvent,
} from 'react';
import Image from 'next/image';
import { CSSTransition } from 'react-transition-group';
import upperFirstWord from '@utils/upperFirstWord';
import Paragraph from '@components/Paragraph';
import Modal from '@components/Modal';
import getRandom from '@utils/randomNumber';
import projectsStyled from '../styles/projects.module.css';
import { fetcherGeneric } from '@utils/fetcher';

type requestProject = {
  data: StateProjects;
  code: string;
};

type StateProjects = Array<{
  id: string;
  type: string;
  attributes: {
    tools: Array<{
      _id: string;
      name: string;
      as: string;
      _v: number;
    }>;
    title: string;
    startDate: string;
    endDate: string;
    images: Array<{
      _id: string;
      src: string;
    }>;
    url: string;
    description: string;
    typeProject: {
      _id: string;
      projects?: any[];
      name: string;
      _v: number;
    };
    _v: number;
  };
}>;

type State = {
  status: 'iddle' | 'loading' | 'error';
  projects: StateProjects;
  refetch: boolean;
};

type Action =
  | { type: 'request/start' }
  | {
      type: 'request/finish';
      payload: {
        projects: StateProjects;
      };
    }
  | { type: 'request/error' }
  | { type: 'request/refetch' };

function Projects() {
  // React hooks
  const [state, dispatch] = useReducer(reducer, {
    status: 'iddle',
    projects: [],
    refetch: false,
  });
  const [modal, setModal] = useState({ open: false, index: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // Variabel Biasa
  const project = state.projects[modal.index];
  const disabled = state.status !== 'iddle';
  const className = state.status !== 'iddle' ? 'cursor-notAllowed' : '';

  useEffect(() => {
    // Mencegah react menyetel state ketika sudah pindah halaman
    let didCancel = false;
    async function getData() {
      try {
        if (!didCancel) {
          // ubah state
          dispatch({ type: 'request/start' });
        }

        const fetchProjects = await fetcherGeneric<requestProject>(
          `/api/projects`,
        );

        // ubah state setelah finish tetapi cek dulu apakah halamannya berganti
        if (!didCancel) {
          dispatch({
            type: 'request/finish',
            payload: { projects: fetchProjects.data },
          });
        }
      } catch (err) {
        console.log(err);
        if (!didCancel) dispatch({ type: 'request/error' });
      }
    }

    getData().catch((err) => {
      console.log(`\n\n\n ERROR WHEN REQUEST DATA`);
      console.log(err);
    });

    // Setel true variabel did cancel
    return () => {
      didCancel = true;
    };
  }, [state.refetch]);

  if (state.status === 'error') {
    return (
      <>
        <Heading minSize={1} size={1.5}>
          <span>Failed to retrieve data:(</span>
        </Heading>
        <Action onClick={() => dispatch({ type: 'request/refetch' })}>
          <Heading minSize={1} size={1.2}>
            <span>Click here to try to retrieve data again</span>
          </Heading>
        </Action>
      </>
    );
  }

  if (state.status === 'loading') {
    return <div className="loader" />;
  }

  return (
    <>
      {/* Saat modal terlihat matikan overflow untuk body */}
      {modal.open && <GlobalStyle />}

      <Container>
        <Head>
          <title>Projects I&apos;ve made</title>
        </Head>

        <Paragraph size={1.5} minSize={1}>
          Projects that I&apos;ve <span>made myself</span>
        </Paragraph>

        {/* Inti Content */}
        <ContainerProjects>
          {project &&
            state.projects.map((value, index) => (
              <Project
                onClick={() => {
                  setModal({ open: true, index });
                }}
                key={index}
                className={className}
                disabled={disabled}
              >
                <ProjectImageContainer>
                  {value.attributes.images[0] && (
                    <Image
                      alt="project"
                      className={projectsStyled.project}
                      src={`/images/${value.attributes.images[0].src}`}
                      layout="fill"
                    />
                  )}
                </ProjectImageContainer>

                <ProjectTextContainer>
                  <Heading minSize={1} size={1.3}>
                    <span>{upperFirstWord(value.attributes.title)}</span>
                  </Heading>
                  <Heading minSize={1} size={1}>
                    {upperFirstWord(value.attributes.typeProject.name)}
                  </Heading>
                </ProjectTextContainer>
              </Project>
            ))}
        </ContainerProjects>
        {/* Akhir dari inti Content */}

        {/* Modal */}
        {project && (
          <CSSTransition
            nodeRef={nodeRef}
            classNames="modal"
            in={modal.open}
            timeout={500}
          >
            <Modal
              width="100%"
              height=""
              ref={nodeRef}
              updateState={setModal}
              defaultState={{ open: false, index: 0 }}
            >
              <ImageSlider showModal={modal.open} project={project} />
              <ModalContentContent>
                <Heading minSize={1.5} size={2}>
                  <span>{upperFirstWord(project.attributes.title)}</span>
                </Heading>
                <ModalContentContentList>
                  <ModalContentContentListTitle>
                    <Heading minSize={1} size={1}>
                      Development Date Process
                    </Heading>
                    <Heading minSize={1} size={1}>
                      Tools
                    </Heading>
                    <Heading minSize={1} size={1}>
                      Project Type
                    </Heading>
                  </ModalContentContentListTitle>
                  <ModalContentContentListValue>
                    <Heading minSize={1} size={1}>
                      :&nbsp;
                      {getFullDate(project.attributes.startDate)}
                      {' - '}
                      {getFullDate(project.attributes.endDate)}
                    </Heading>
                    <Heading minSize={1} size={1}>
                      :&nbsp; {getStringOfTools(project.attributes.tools)}
                    </Heading>
                    <Heading minSize={1} size={1}>
                      :&nbsp;
                      {upperFirstWord(project.attributes.typeProject.name)}
                    </Heading>
                  </ModalContentContentListValue>
                </ModalContentContentList>
                <Paragraph
                  minSize={1}
                  size={1}
                  align="start"
                  textIndent="2rem"
                  fontWeight="normal"
                  lineHeight="1.5rem"
                >
                  {project.attributes.description}.{' '}
                  {project.attributes.url && (
                    <GoTo href={project.attributes.url}>
                      {project.attributes.url}
                    </GoTo>
                  )}
                </Paragraph>
              </ModalContentContent>
            </Modal>
          </CSSTransition>
        )}
        {/* end of Modal */}
      </Container>
    </>
  );
}

export default Projects;

function ImageSlider({
  showModal,
  project,
}: {
  showModal: boolean;
  project: StateProjects[number];
}) {
  const [slide, setSlide] = useState({ slide: 0, translateX: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);

  // Reset state saat modal diclose
  useEffect(() => {
    if (!showModal) setSlide({ slide: 0, translateX: 0 });
  }, [showModal, setSlide]);

  function changeImageAction(event: MouseEvent, action: number): void {
    if (
      project.attributes.images.length > 1 &&
      event.currentTarget.parentElement !== null &&
      event.currentTarget.parentElement.parentElement !== null
    ) {
      const modal = event.currentTarget.parentElement.parentElement;
      const { width: modalWidth } = modal.getBoundingClientRect();

      // Jika nilai berikutnya ditambah lalu melebihi panjang gambar maka nilai akan menjadi ke 0
      // Jika nilai berikutnya dikurang lalu kurang dari 0 maka nilai akan menjadi jumlah gambar
      let result = 0;
      if (action === 0) {
        // // Jika hasil Operasi berikutnya kurang dari 0 maka setel ke jumlah gambar dikurangi 1
        if (slide.slide - 1 < 0) result = project.attributes.images.length - 1;
        else result = slide.slide - 1;
      } else {
        // Jika hasil Operasi berikutnya melebihi panjang gambar
        if (slide.slide + 1 > project.attributes.images.length - 1) result = 0;
        else result = slide.slide + 1;
      }

      setSlide({ slide: result, translateX: result * -modalWidth });
    }
  }
  return (
    <ModalImage ref={nodeRef}>
      {project.attributes.images.length > 1 && (
        <ModalImageActions>
          <ModalImageAction
            onClick={(event) => changeImageAction(event, 0)}
            title="prev image"
          >
            <ModalImageActionSpanLeft rotate={-45} />
            <ModalImageActionSpanLeft rotate={45} />
          </ModalImageAction>
          <ModalImageAction
            onClick={(event) => changeImageAction(event, 1)}
            title="next image"
          >
            <ModalImageActionSpanRight rotate={45} />
            <ModalImageActionSpanRight rotate={-45} />
          </ModalImageAction>
        </ModalImageActions>
      )}

      {/* Content Images */}
      <ModalImageContent translateX={slide.translateX}>
        {project.attributes.images.map((value, index) => (
          <ModalImageContentContent key={getRandom(index)}>
            <Image
              alt="project"
              className={projectsStyled.project}
              src={`/images/${value.src}`}
              layout="fill"
            />
          </ModalImageContentContent>
        ))}
      </ModalImageContent>

      {/* Content Count */}
      <ModalImageCount>
        {project.attributes.images.map((value, index) => (
          <ModalImageCountCount
            key={getRandom(index)}
            opacity={slide.slide === index ? '1' : '0.5'}
          />
        ))}
      </ModalImageCount>
    </ModalImage>
  );
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'request/start':
      return { ...state, status: 'loading' };
    case 'request/finish':
      return {
        ...state,
        projects: action.payload.projects,
        status: 'iddle',
        refetch: false,
      };
    case 'request/error':
      return { ...state, status: 'error', refetch: false };
    case 'request/refetch':
      return { ...state, refetch: true };
    default:
      return state;
  }
}

function getFullDate(data: string) {
  const date = new Date(data);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getStringOfTools(
  data: Array<{
    _id: string;
    name: string;
    as: string;
    _v: number;
  }>,
) {
  let result = '';
  data.forEach((value, index) => {
    result += `${upperFirstWord(value.name)}`;
    if (value.as) result += ` as ${value.as}`;
    if (index !== data.length - 1) result += ', ';
  });

  return result;
}

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden!important;
  }
`;

const GoTo = styled.a`
  text-decoration: underline;
  color: var(--pink);
`;

const Container = styled.div`
  display: grid;
  width: 100%;
  justify-items: center;
  gap: 4rem;

  @media (max-width: 768px) {
    & {
      gap: 3rem;
    }
  }
`;

const Action = styled.button`
  background-color: var(--dark);
  border-radius: 0.8rem;
  // font-weight: bold;
  color: white;
  border: 0.1rem solid var(--pink);
  padding: 0.8rem;
  margin: 0.8rem;
  cursor: pointer;

  @media (max-width: 768px) {
    & {
      background-color: var(--dark);
      border-radius: 2rem;
      font-weight: bold;
      color: white;
      border: 0.2rem solid var(--pink);
      padding: 0.8rem;
      margin: 0 0.8rem;
      cursor: pointer;
    }
  }
`;

const ContainerProjects = styled.div`
  display: grid;
  width: 100%;
  align-items: center;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 3rem 1rem;
  padding-bottom: 3rem;

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;

const Project = styled.div<{ disabled: boolean }>`
  width: 100%;
  display: grid;
  position: relative;
  height: 250px;
  grid-template-rows: 2fr 1fr;
  // box-shadow: 2px 2px 9px rgb(0 0 0 / 30%);
  box-shadow: 2px 7px 12px rgb(0 0 0 / 30%);
  justify-items: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;

  // img {
  //   object-fit: contain!important;
  // }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--dark2);
`;
const ProjectTextContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  justify-items: flex-start;
  align-items: center;
  padding: 0.8rem;

  h1:last-child {
    margin: 0.3rem 0 0 0;
  }
`;

const ModalImage = styled.div`
  height: 375px;
  overflow: hidden;
  position: relative;

  &:hover div:first-child {
    opacity: 1;
  }

  @media (max-width: 768px) {
    & {
      height: 275px;
    }
  }
`;

const ModalImageActions = styled.div`
  transition: var(--transition);
  opacity: 0;
  width: 100%;
  height: 350px;
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;

  @media (max-width: 768px) {
    & {
      height: 250px;
    }
  }
`;

const ModalImageAction = styled.div`
  width: 10%;
  height: 100%;
  background-color: rgba(31, 33, 39, 0.8); // rgba(0, 0, 0, 0.32)
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const ModalImageActionSpan = styled.span`
  width: 32px;
  height: 4px;
  background-color: var(--pink);
  cursor: pointer;

  @media (max-width: 576px) {
    & {
      width: 25px;
      height: 4px;
    }
  }
`;

const ModalImageActionSpanLeft = styled(ModalImageActionSpan)<{
  rotate: number;
}>`
  transform: translate(0px, ${({ rotate }) => (rotate >= 0 ? `0px` : `-17px`)})
    rotate(${({ rotate }) => `${rotate}deg`});

  @media (max-width: 576px) {
    & {
      transform: translate(
          0px,
          ${({ rotate }) => (rotate >= 0 ? `0px` : `-12px`)}
        )
        rotate(${({ rotate }) => `${rotate}deg`});
    }
  }
`;

const ModalImageActionSpanRight = styled(ModalImageActionSpan)<{
  rotate: number;
}>`
  transform: translate(0px, ${({ rotate }) => (rotate >= 0 ? `-17px` : `0px`)})
    rotate(${({ rotate }) => `${rotate}deg`});

  @media (max-width: 576px) {
    & {
      transform: translate(
          0px,
          ${({ rotate }) => (rotate >= 0 ? `-12px` : `0px`)}
        )
        rotate(${({ rotate }) => `${rotate}deg`});
    }
  }
`;

const ModalImageContent = styled.div<{ translateX: number }>`
  position: relative;
  height: 350px;
  white-space: nowrap;
  transition: var(--transition);
  transform: translateX(${({ translateX }) => translateX}px);

  @media (max-width: 768px) {
    & {
      height: 250px;
    }
  }
`;
const ModalImageContentContent = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-block;
  background-color: var(--dark2);
`;
const ModalImageCount = styled.div`
  position: relative;
  width: 100%;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalImageCountCount = styled.span<{ opacity: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--pink);
  margin: 0 0.3rem;
  opacity: ${({ opacity }) => opacity};
  & h1 {
    text-align: center;
  }

  @media (max-width: 768px) {
    & {
      width: 8px;
      height: 8px;
    }
  }

  @media (max-width: 576px) {
    & {
      width: 7px;
      height: 7px;
    }
  }
`;
const ModalContentContent = styled.div`
  min-height: 300px;
  padding: 2rem;
  overflow: hidden;
  text-align: center;

  & h1 {
    text-align: start;
  }

  @media (max-width: 768px) {
    & {
      padding: 1rem;
    }
  }
`;
const ModalContentContentList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 1rem 0 2rem 0;
  gap: 0.5rem;
  height: 100px;

  @media (max-width: 576px) {
    & {
      height: 150px;
    }
  }
`;

const ModalContentContentListTitle = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-items: start;
  text-weight: bold;
`;
const ModalContentContentListValue = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  justify-items: start;
  align-items: center;
`;
