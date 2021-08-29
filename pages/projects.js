import Head from "next/head";
import Text from "../Components/Text";
import styled, {createGlobalStyle} from "styled-components";
import React, { useEffect, useReducer, useState, useRef } from "react";
import Image from 'next/image'
import projectsStyled from '../styles/projects.module.css'
import {CSSTransition} from 'react-transition-group'

const listActions = [
  {
    text: "All",
    value: "A1",
    type: "project-type",
  },
  {
    text: "Personal Projects",
    value: "A2",
    type: "project-type",
  },
  {
    text: "Work Projects",
    value: "A3",
    type: "project-type",
  },
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
  const [state, dispatch] = useReducer(reducer, {
    // status : iddle, loding, error
    status: "iddle",
    projects: [],
    activeActions: ["A1", "ASC"],
    refetch: false,
  });
  const [modal, setModal] = useState(false);
  const nodeRef = useRef(null);

  
  useEffect(() => {
    // Mencegah kondisi balapan
    if (state.status !== "loading") {
      // Mencegah react menyetel state ketika sudah pindah halaman
      let didCancel = false;
      async function getData() {
        try {
          // ubah state
          dispatch({ type: "initial" });

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
    }
  }, [state.activeActions, state.refetch]);

  const handleAction = (e, typeButton, buttonValue) => {
    let validValue = false;
    let validType = false;

    // Check jika nilai valid
    for (let index = 0; index < listActions.length; index++) {
      if (listActions[index]["value"] === buttonValue) validValue = true;
      if (listActions[index]["type"] === typeButton) validType = true;
    }

    // Untuk sementara kita abaikan dulu jika tidak valid
    if (!validValue || !validType) alert("Error invalid value");

    // Setel state terbaru
    const newActiveActions = [...state.activeActions];
    typeButton === "sort"
      ? (newActiveActions[1] = buttonValue)
      : (newActiveActions[0] = buttonValue);

    dispatch({ type: "action", payload: { actions: newActiveActions } });
  };
  
  return (
    <React.Fragment>
      { modal && <GlobalStyle /> }
      <Container>
        <Head>
          <title>Projects I've made</title>
        </Head>
        <Text size={3}>
            <span>Projects</span>
          </Text>
          <ContainerActions>
            {listActions.map((value, index) => {
                if (
                  value.value === state.activeActions[0] ||
                  value.value === state.activeActions[1]
                ) {
                  return (
                    <ActionActive
                      className={
                        state.status !== 'iddle' ? "cursor-notAllowed" : ""
                      }
                      disabled={state.status !== 'iddle' ? true : false}
                      key={index}
                      onClick={(event) =>
                        handleAction(event, value.type, value.value)
                      }
                    >
                      <Text size={1.2}>{value.text}</Text>
                    </ActionActive>
                  );
                } else {
                  return (
                    <Action
                      className={
                        state.status !== 'iddle' ? "cursor-notAllowed" : ""
                      }
                      disabled={state.status !== 'iddle' ? true : false}
                      key={index}
                      key={index}
                      onClick={(event) =>
                        handleAction(event, value.type, value.value)
                      }
                    >
                      <Text size={1.2}>{value.text}</Text>
                    </Action>
                  );
                }
            })}
          </ContainerActions>

          <CSSTransition nodeRef={nodeRef} classNames="modal" in={modal} timeout={500}>
            <Modal ref={nodeRef}>
              <ModalMain>
                <ModalAction>
                  <ModalClose onClick={() => setModal(false)}>
                    <span></span>
                    <span></span>
                  </ModalClose>
                </ModalAction>
                <ModalContent>
                  <ImageSlider showModal={modal}></ImageSlider>
                  <ModalContentContent>
                      <Text align="start" minSize={1.5} size={2}><span>Elbi Library</span></Text>
                      <ModalContentContentList>
                        <ModalContentContentListTitle>
                          <Text align="start" fontWeight="bold">Development Date Process</Text>
                          <Text align="start" fontWeight="bold">Tools</Text>
                          <Text align="start" fontWeight="bold">Project Type</Text>
                        </ModalContentContentListTitle>
                        <ModalContentContentListValue>
                          <Text align="start" fontWeight="normal">{":"}&nbsp;18-08-2020 - 18-01-2021</Text>
                          <Text align="start" fontWeight="normal">{":"}&nbsp;Express Javascript React</Text>
                          <Text align="start" fontWeight="normal">{":"}&nbsp;Work Project</Text>
                        </ModalContentContentListValue>
                      </ModalContentContentList>
                        <Text margin="2rem 0 0 0" align="start" textIndent="2rem" fontWeight="normal" lineHeight="1.5rem" >
                          This application is called elbi library, the purpose of making this application is because it is 
                          for school exams. This application uses javascript as fullstack language, express as backend framework 
                        and next js as
                          This application is called elbi library, the purpose of making this application is because it is 
                          for school exams. This application uses javascript as fullstack language, express as backend framework 
                        and next js as
                          This application is called elbi library, the purpose of making this application is because it is 
                          for school exams. This application uses javascript as fullstack language, express as backend framework 
                        and next js as
                          This application is called elbi library, the purpose of making this application is because it is 
                          for school exams. This application uses javascript as fullstack language, express as backend framework 
                        and next js as
                          This application is called elbi library, the purpose of making this application is because it is 
                          for school exams. This application uses javascript as fullstack language, express as backend framework 
                        and next js as. <span>click here to go to this website</span>
                        </Text>
                  </ModalContentContent>
                </ModalContent>
              </ModalMain>
            </Modal>
            {/* <h1 ref={nodeRef} style={{transition: '.3s'}}>WWW</h1> */}
          </CSSTransition>

          <button onClick={() => setModal((state) => !state)}>Jajal modal</button>

        {/* Error handling */}
        {state.status === 'error' ? (
          <>
            <Text size={1.5}><span>There is an error in the page :(</span></Text>
            <Action onClick={() => dispatch({type: 'refetch'})}><Text size={1.2}><span>Click here to refresh</span></Text></Action>
          </>
        ) : (
          <React.Fragment>
            {state.status === "loading" ? (
              <div className="loader"></div>
            ) : (
              <ContainerProjects>
                {state.projects.map((value, index) => {
                  return (
                  <Project key={index} 
                    className={state.status !== 'iddle' ? "cursor-notAllowed" : ""} 
                    disabled={state.status === 'iddle' ? false : true} onClick={(event) => console.log(state.projects[index])}>
                    <ProjectImageContainer>
                      <Image className={projectsStyled.project} src={value.images[0].src} layout="fill" ></Image>
                    </ProjectImageContainer>
                    <ProjectTextContainer>
                      <Text size={1.3} margin="0 "><span>{changeFirstWord(value.title)}</span></Text>
                      <Text margin=".3rem 0 0 0 ">{changeFirstWord(value.typeProject)}</Text>
                    </ProjectTextContainer>
                  </Project>)
                })}
              </ContainerProjects>
            )}
          </React.Fragment>
        )}
      </Container>
    </ React.Fragment>
  );
};

export default Projects;

function ImageSlider ({showModal}) {
  const [slide, setSlide] = useState({slide: 0, translateX: 0});
  const nodeRef = useRef(null)

  function changeImage(event, index) {
    const modal = event.target.parentElement.parentElement;
    const {width: modalWidth} = modal.getBoundingClientRect();
    
    setSlide({ slide: index, translateX: (index * -modalWidth)})
  }
  
  function changeImageAction(event, action) {
    const modal = event.target.parentElement.parentElement;
    const {width: modalWidth} = modal.getBoundingClientRect();
    
    const result = action === 0 ? ((slide.slide - 1) < 0 ? 2 : (slide.slide - 1) ) : ((slide.slide + 1) > 2 ? 0 : (slide.slide + 1));
    setSlide({ slide: result, translateX: (result * -modalWidth)})
  }

  useEffect(() => {
    if (showModal) {
      let interval = setInterval(() => {
        console.log(showModal)
        const modal = nodeRef.current;
        const {width: modalWidth} = modal?.getBoundingClientRect();
        setSlide((state) => {
          const result = ((state.slide + 1) > 2 ? 0 : (state.slide + 1));
          return { slide: result, translateX: (result * -modalWidth)}
        })
      }, 3000);
  
      
      return () => {
        clearInterval(interval)
        console.log("unmount")
      }
    }
  }, [showModal])

  return (
    <ModalImage ref={nodeRef}>
        <ModalImageActions>
          <ModalImageAction onClick={event => changeImageAction(event, 0)}>
            <ModalImageActionSpan transform="translate(0px, -17px) rotate(-45deg)"></ModalImageActionSpan>
            <ModalImageActionSpan transform="translate(0px, 0px) rotate(45deg)"></ModalImageActionSpan>
          </ModalImageAction>
          <ModalImageAction onClick={event => changeImageAction(event, 1)}>
            <ModalImageActionSpan transform="translate(0px,-17px) rotate(45deg)"></ModalImageActionSpan>
            <ModalImageActionSpan transform="translate(0px, 0px) rotate(-45deg)"></ModalImageActionSpan>
          </ModalImageAction>
        </ModalImageActions>
      <ModalImageContent translateX={slide.translateX} >
        <ModalImageContentContent>
          <Image className={projectsStyled.project} src="/images/Screenshot (1).png" layout="fill"></Image>
        </ModalImageContentContent>
        <ModalImageContentContent>
          <Image className={projectsStyled.project} src="/images/profile.jpg" layout="fill"></Image>
        </ModalImageContentContent>
        <ModalImageContentContent>
          <Image className={projectsStyled.project} src="/images/Screenshot (2).png" layout="fill"></Image>
        </ModalImageContentContent>
      </ModalImageContent>
      <ModalImageCount>
        <ModalImageCountCount opacity={slide.slide === 0 ? '1' : '0.5'} onClick={event => changeImage(event, 0)}></ModalImageCountCount>
        <ModalImageCountCount opacity={slide.slide === 1 ? '1' : '0.5'} onClick={event => changeImage(event, 1)}></ModalImageCountCount>
        <ModalImageCountCount opacity={slide.slide === 2 ? '1' : '0.5'}onClick={event => changeImage(event, 2)}></ModalImageCountCount>
      </ModalImageCount>
    </ModalImage>
  )
}




function reducer(state, action) {
  switch (action.type) {
    case "initial":
      return { ...state, status: "loading" };
    case "projects":
      return { ...state, projects: action.payload.projects, status: "iddle", refetch: false };
    case "action":
      return { ...state, activeActions: action.payload.actions, refetch: false };
    case "error":
      return { ...state, status: 'error', refetch: false };
    case "refetch":
      return { ...state, refetch: true };
    default:
      return { ...state };
  }
};

function changeFirstWord(word) {
  if (typeof word !== "string") return;
  return `${word.slice(0,1).toUpperCase()}${word.slice(1)}`
}

const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden!important;
  }
`

const Container = styled.div`
  display: grid;
  width: 100%;
  justify-items: center;
  gap: 3rem;
`;
const ContainerActions = styled.div`
  display: grid;
  width: 80%;
  align-items: center;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;

  // display: flex;
  // width: 80%;
  // justify-content: center;
  // align-items: center;
  // // grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  // // gap: .8rem;
`;

const Action = styled.button`
  background-color: var(--dark);
  border-radius: 2rem;
  font-weight: bold;
  color: white;
  border: 0.2rem solid var(--pink);
  padding: 0.8rem;
  margin: 0 0.8rem;
  cursor: pointer;

  &[data-loading="true"] {
    & {
      cursor: not-allowed;
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: start;
  padding: .8rem;
`;

const Modal = styled.div`
  position: fixed;
  background-color: var(--dark2);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(31,33,39, 0.8);
  transition: var(--transition);
  box-sizing: border-box;
  opacity: 0;
  width: 1px;
  height: 1px;
  top: 50%;
  left: 50%;
  margin-top: -.5px;
  margin-left: -.5px;
`;
const ModalMain = styled.div`
  position: relative;
  width: 90%;
  height: 90%;
  box-sizing: border-box;
  background-color: var(--dark);
  box-shadow: 5px 12px 17px rgb(0 0 0 / 30%);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 7px;
  }
  
  /* Track */
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--pink);
    border-radius: 10px;
  }
`;

const ModalAction = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 10%;
  box-sizing: border-box;
  padding: .5rem;
`;

const ModalClose = styled.div`
  width: 40px;
  height: 100%; 
  display: grid;
  grid-template-rows: 1fr 1fr;
  cursor: pointer;

  & span {
    width: 100%;
    height: 25%;
    background-color: var(--pink);
  };

  & span:first-child {
    transform: translate(0px, 17px) rotate(45deg);
  }
  & span:last-child {
    transform: translate(0px, -6px) rotate(-45deg);
  }
`;

const ModalContent = styled.div`
  width: 100%;
  height: 90%;
  @media (max-width: 768px) {
    & {
      padding: 1rem;
    }
  }
  // display: grid;
  // grid-template-rows: 2fr 1fr;
  // overflow: auto;
`;
const ModalImage = styled.div`
  height: 375px;
  overflow: hidden;
  position: relative;

  &:hover div:first-child {
    opacity: 1;
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
  background-color: rgba(31,33,39,0.8);
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
  transform: ${ ({transform}) => transform || '' };
`;
const ModalImageContent = styled.div`
  position: relative;
  height: 350px;
  white-space: nowrap;
  transition: var(--transition);
  transform: translateX(${({translateX}) => translateX ? `${translateX}px`: '0px'});
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
  margin: 0 .3rem;
  opacity: ${({opacity}) => opacity || '1'}
`;
const ModalContentContent = styled.div`
  margin: 2rem 0 0 0;
  padding: 2rem;
  overflow: hidden;

  @media (max-width: 768px) {
    & {
      padding: 1rem;
    }
  }
`;
const ModalContentContentList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100px;
  margin-top: 1rem;
  gap: .5rem;
`;
const ModalContentContentListTitle = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  justify-content: start;
`;
const ModalContentContentListValue = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  justify-content: start;
  align-items: center;
`;