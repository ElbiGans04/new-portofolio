import Head from "next/head";
import Heading from "../components/Heading";
import styled, { createGlobalStyle } from "styled-components";
import React, { useEffect, useReducer, useState, useRef } from "react";
import Image from "next/image";
import projectsStyled from "../styles/projects.module.css";
import { CSSTransition } from "react-transition-group";
import upperFirstWord from "../module/upperFirstWord";
import Paragraph from "../components/Paragraph";
import Modal from "../components/Modal";
import getRandom from '../module/randomNumber'

const listActions = [
  // {
  //   text: "All",
  //   value: "ALL",
  //   type: "project-type",
  // },
  // {
  //   text: "Personal Projects",
  //   value: "A1",
  //   type: "project-type",
  // },
  // {
  //   text: "Work Projects",
  //   value: "A2",
  //   type: "project-type",
  // },
  {
    text: "A-Z",
    value: "ASC",
    type: "sort",
  },
  {
    text: "Z-A",
    value: "DESC",
    type: "sort",
  },
];

function Projects() {
  // React hooks
  const [state, dispatch] = useReducer(reducer, {
    // status : iddle, loding, error
    status: "iddle",
    projects: [],
    activeActions: ["ALL", "ASC"],
    refetch: false,
  });
  const [modal, setModal] = useState({ open: false, index: 0 });
  const nodeRef = useRef(null);

  // Variabel Biasa
  const project = state.projects[modal?.index];
  const disabled = state.status !== "iddle" ? true : false;
  const className = state.status !== "iddle" ? "cursor-notAllowed" : "";

  useEffect(() => {
    // Mencegah kondisi balapan
    // Mencegah react menyetel state ketika sudah pindah halaman
    let didCancel = false;
    async function getData() {
      try {
        if (!didCancel) {
          // ubah state
          dispatch({ type: "initial" });
        }

        const fetchProjects = await (
          await fetch(
            `/api/projects?type=${state.activeActions[0]}&order=${state.activeActions[1]}`
          )
        ).json();

        // ubah state setelah finish tetapi cek dulu apakah halamannya berganti
        if (!didCancel) {
          dispatch({
            type: "projects",
            payload: { projects: fetchProjects.data },
          });
        }
      } catch (err) {
        if (!didCancel) dispatch({ type: "error" });
      }
    }

    getData();

    // Setel true variabel did cancel
    return () => {
      didCancel = true;
    };
  }, [state.activeActions, state.refetch]);

  
  // Event Handler untuk tombol aksi
  const handleAction = (e, typeButton, buttonValue) => {
    let validValue = false;
    let validType = false;

    // Check jika nilai valid
    for (let index = 0; index < listActions.length; index++) {
      if (listActions[index]["value"] === buttonValue) validValue = true;
      if (listActions[index]["type"] === typeButton) validType = true;
    }

    // Untuk sementara kita abaikan dulu jika tidak valid
    if (!validValue || !validType) return alert("Error invalid value");

    // Setel state terbaru
    const newActiveActions = [...state.activeActions];
    typeButton === "sort"
      ? (newActiveActions[1] = buttonValue)
      : (newActiveActions[0] = buttonValue);

    dispatch({ type: "action", payload: { actions: newActiveActions } });
  };

  return (
    <React.Fragment>
      {modal.open && <GlobalStyle />}
      <Container>
        <Head>
          <title>Projects I&apos;ve made</title>
        </Head>

        {/* Action Components */}
        {/* Check Kondisi Jika merupakan button yang aktif maka kita bedakan */}
        <ContainerActions>
          {listActions.map((value, index) => {
            if (
              value.value === state.activeActions[0] ||
              value.value === state.activeActions[1]
            ) {
              return (
                <ActionActive
                  className={className}
                  disabled={disabled}
                  key={index}
                  onClick={(event) =>
                    handleAction(event, value.type, value.value)
                  }
                >
                  <Heading size={1.2}>{value.text}</Heading>
                </ActionActive>
              );
            } else {
              return (
                <Action
                  className={className}
                  disabled={disabled}
                  key={index}
                  onClick={(event) =>
                    handleAction(event, value.type, value.value)
                  }
                >
                  <Heading size={1.2}>{value.text}</Heading>
                </Action>
              );
            }
          })}
        </ContainerActions>
        {/* End of Action Components */}

        {/* Modal */}
        <CSSTransition
          nodeRef={nodeRef}
          classNames="modal"
          in={modal.open}
          timeout={500}
        >
          <Modal ref={nodeRef} updateState={setModal} defaultState={{open: false, index: 0}}>
            <ImageSlider showModal={modal.open} project={project}></ImageSlider>
            <ModalContentContent>
              <Heading align="start" minSize={1.5} size={2}>
                <span>{upperFirstWord(project?.attributes?.title)}</span>
              </Heading>
              <ModalContentContentList>
                <ModalContentContentListTitle>
                  <Heading align="start" fontWeight="bold">
                    Development Date Process
                  </Heading>
                  <Heading align="start" fontWeight="bold">
                    Tools
                  </Heading>
                  <Heading align="start" fontWeight="bold">
                    Project Type
                  </Heading>
                </ModalContentContentListTitle>
                <ModalContentContentListValue>
                  <Heading align="start" fontWeight="normal">
                    {":"}&nbsp;{getFullDate(project?.attributes?.startDate)}
                    {" - "}
                    {getFullDate(project?.attributes?.endDate)}
                  </Heading>
                  <Heading align="start" fontWeight="normal">
                    {":"}&nbsp; {getTool(project?.attributes?.tools)}
                  </Heading>
                  <Heading align="start" fontWeight="normal">
                    {":"}&nbsp;{upperFirstWord(project?.attributes?.typeProject.name)}
                  </Heading>
                </ModalContentContentListValue>
              </ModalContentContentList>
              <Paragraph
                align="start"
                textIndent="2rem"
                fontWeight="normal"
                lineHeight="1.5rem"
              >
                {project?.attributes?.description}.{" "}
                {project?.attributes?.url && (
                  <GoTo href={project?.attributes?.url}>
                   {project?.attributes?.url}
                  </GoTo>
                )}
              </Paragraph>
            </ModalContentContent>
          </Modal>
        </CSSTransition>
        {/* end of Modal */}

        {/* Error handling */}
        {state.status === "error" ? (
          <>
            <Heading size={1.5}>
              <span>Failed to retrieve data:(</span>
            </Heading>
            <Action onClick={() => dispatch({ type: "refetch" })}>
              <Heading size={1.2}>
                <span>Click here to try to retrieve data again</span>
              </Heading>
            </Action>
          </>
        ) : (
          <React.Fragment>
            {state.status === "loading" ? (
              <div className="loader"></div>
            ) : (
              <ContainerProjects>
                {state.projects.map((value, index) => {
                  return (
                    <Project
                      onClick={() => {
                        setModal({ open: true, index });
                      }}
                      key={index}
                      className={className}
                      disabled={disabled}
                    >
                      <ProjectImageContainer>
                        <Image
                          alt="project"
                          className={projectsStyled.project}
                          src={`/images/${value?.attributes?.images[0]?.src}`}
                          layout="fill"
                        ></Image>
                      </ProjectImageContainer>
                      <ProjectTextContainer>
                        <Heading size={1.3} margin="0 ">
                          <span>{upperFirstWord(value?.attributes?.title)}</span>
                        </Heading>
                        <Heading margin=".3rem 0 0 0 ">
                          {upperFirstWord(value?.attributes?.typeProject.name)}
                        </Heading>
                      </ProjectTextContainer>
                    </Project>
                  );
                })}
              </ContainerProjects>
            )}
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  );
}

export default Projects;

function ImageSlider({ showModal, project }) {
  const [slide, setSlide] = useState({ slide: 0, translateX: 0 });
  const nodeRef = useRef(null);

  // Reset state saat modal diclose
  useEffect(() => {
    if (!showModal) setSlide({slide: 0, translateX: 0});
  }, [showModal, setSlide])

  function changeImageAction(event, action) {
    if (project?.attributes.images.length > 1 ) {
      const modal = event.target.parentElement.parentElement;
      const { width: modalWidth } = modal.getBoundingClientRect();

      // Jika nilai berikutnya ditambah lalu melebihi panjang gambar maka nilai akan menjadi ke 0
      // Jika nilai berikutnya dikurang lalu kurang dari 0 maka nilai akan menjadi jumlah gambar
      const result =
        action === 0
          ? slide.slide - 1 < 0
            ? (project?.attributes.images.length - 1)
            : slide.slide - 1
          : slide.slide + 1 > (project?.attributes.images.length - 1)
            ? 0
            : slide.slide + 1;
      setSlide({ slide: result, translateX: result * -modalWidth });
    }
  }

  return (
    <ModalImage ref={nodeRef}>
      {project?.attributes?.images?.length > 1 && (
        <ModalImageActions>
          <ModalImageAction
            onClick={(event) => changeImageAction(event, 0)}
            title="prev image"
          >
            <ModalImageActionSpan transform="translate(0px, -17px) rotate(-45deg)"></ModalImageActionSpan>
            <ModalImageActionSpan transform="translate(0px, 0px) rotate(45deg)"></ModalImageActionSpan>
          </ModalImageAction>
          <ModalImageAction
            onClick={(event) => changeImageAction(event, 1)}
            title="next image"
          >
            <ModalImageActionSpan transform="translate(0px,-17px) rotate(45deg)"></ModalImageActionSpan>
            <ModalImageActionSpan transform="translate(0px, 0px) rotate(-45deg)"></ModalImageActionSpan>
          </ModalImageAction>
        </ModalImageActions>
      )}
      {/* Content Images */}
      <ModalImageContent translateX={slide.translateX}>
        {project?.attributes?.images?.map((value, index) => {
          return (
            <ModalImageContentContent key={index}>
              <Image
                alt="project"
                className={projectsStyled.project}
                src={`/images/${value.src}`}
                layout="fill"
              ></Image>
            </ModalImageContentContent>
          );
        })}
      </ModalImageContent>
      {/* Content Count */}
      <ModalImageCount>
        {project?.attributes?.images?.map((value, index) => {
          return (
            <ModalImageCountCount 
              key={getRandom()}
              opacity={slide.slide === index ? "1" : "0.5"}
            ></ModalImageCountCount>
          );
        })}
      </ModalImageCount>
    </ModalImage>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "initial":
      return { ...state, status: "loading" };
    case "projects":
      return {
        ...state,
        projects: action.payload.projects,
        status: "iddle",
        refetch: false,
      };
    case "action":
      return {
        ...state,
        activeActions: action.payload.actions,
        refetch: false,
      };
    case "error":
      return { ...state, status: "error", refetch: false };
    case "refetch":
      return { ...state, refetch: true };
    default:
      return { ...state };
  }
}

function getFullDate(data) {
  const date = new Date(data);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function getTool(data) {
  if (data) {
    let result = ``;
    console.log(data)
    data.forEach((value, index) => {
      result += `${upperFirstWord(value.name)}`;
      if (value.as) result += ` as ${value.as}`;
      if (index !== data.length - 1) result += `, `;
    });

    return result;
  }
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
  gap: 3rem;
`;
const ContainerActions = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    & {
      display: grid;
      align-items: center;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.5rem;
    }
  }
  // // grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  // // gap: .8rem;
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

const ActionActive = styled(Action)`
  // border: 0;
  color: var(--dark);
  background-color: var(--pink);
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

const Project = styled.div`
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
`;

const ModalImageAction = styled.div`
  width: 10%;
  height: 100%;
  background-color: ${({ backgroundColor }) =>
    backgroundColor || "rgba(31,33,39,0.8)"};
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
  transform: ${({ transform }) => transform || ""};
`;
const ModalImageContent = styled.div`
  position: relative;
  height: 350px;
  white-space: nowrap;
  transition: var(--transition);
  transform: translateX(
    ${({ translateX }) => (translateX ? `${translateX}px` : "0px")}
  );

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
const ModalImageCountCount = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--pink);
  margin: 0 0.3rem;
  opacity: ${({ opacity }) => opacity || "1"};
  & h1 {
    text-align: center;
  }
`;
const ModalContentContent = styled.div`
  min-height: 300px;
  padding: 2rem;
  overflow: hidden;

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
  margin-top: 1rem;
  gap: 0.5rem;
  height: 100px;

  @media (max-width: 576px) {
    & {
      height: 200px;
    }
  }
`;

const ModalContentContentListTitle = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-items: start;
`;
const ModalContentContentListValue = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  justify-items: start;
  align-items: center;
`;
