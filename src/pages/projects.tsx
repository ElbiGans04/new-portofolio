import Heading from '@src/components/Heading';
import Modal from '@src/components/Modal';
import Paragraph from '@src/components/Paragraph';
import { projectsSchema } from '@src/database';
import dbConnection from '@src/database/connection';
import ProjectInterface from '@src/types/mongoose/schemas/project';
import parseDate from '@src/utils/getStringDate';
import getRandom from '@src/utils/randomNumber';
import upperFirstWord from '@src/utils/upperFirstWord';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { MouseEvent, useRef, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled, { createGlobalStyle } from 'styled-components';
import projectsStyled from '../styles/projects.module.css';
import { useRouter } from 'next/router';
import { isTool } from '@src/utils/typescript/narrowing';

export const getStaticProps: GetStaticProps = async function () {
  await dbConnection();
  const result = await projectsSchema
    .find()
    .populate('typeProject')
    .populate('tools');
  return {
    props: {
      projects: JSON.stringify(result),
    },
  };
};

function Projects({ projects }: { projects: string }) {
  const projectsResult = JSON.parse(projects) as ProjectInterface[];
  // React hooks
  const router = useRouter();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [modal, setModal] = useState<boolean | null>(null);
  const matchProject = projectsResult.find((project) => {
    if (
      typeof project._id === 'string' &&
      typeof router.query.projectID === 'string'
    )
      return project._id === router.query.projectID;
    else return false;
  });

  useEffect(() => {
    if (router.asPath !== '/projects' && modal === false) {
      router
        .replace('/projects', undefined, { shallow: true })
        .catch((err) => console.error(err));
    }
  }, [router, modal]);

  useEffect(() => {
    if (nodeRef.current && router.asPath !== '/projects' && modal === null) {
      setModal(true);
    }
  }, [nodeRef, router, setModal, modal]);

  return (
    <>
      {/* Saat modal terlihat matikan overflow untuk body */}
      {modal === true && <GlobalStyle />}

      <Container>
        <Head>
          <title>Projects I&apos;ve made</title>
        </Head>

        <Paragraph size={1.5} minSize={1}>
          Projects that I&apos;ve <span>made myself</span>
        </Paragraph>

        {/* Inti Content */}
        <ContainerProjects>
          {projectsResult.map((value, index) => (
            <Project
              onClick={() => {
                setModal(true);
                router
                  .replace(
                    `/projects?projectID=${
                      typeof value._id == 'string'
                        ? value._id
                        : value._id.toString()
                    }`,
                    undefined,
                    { shallow: true },
                  )
                  .catch((err) => console.error(err));
              }}
              key={index}
            >
              <ProjectImageContainer>
                {value.images[0] && (
                  <Image
                    alt="project"
                    className={projectsStyled.project}
                    src={`${value.images[0].src}`}
                    layout="fill"
                    priority
                  />
                )}
              </ProjectImageContainer>

              <ProjectTextContainer>
                <Heading minSize={1} size={1.3}>
                  <span>{upperFirstWord(value.title)}</span>
                </Heading>
                <Heading minSize={1} size={1}>
                  {upperFirstWord(
                    typeof value.typeProject !== 'string'
                      ? value.typeProject.name
                      : 'Unkown',
                  )}
                </Heading>
              </ProjectTextContainer>
            </Project>
          ))}
        </ContainerProjects>
        {/* Akhir dari inti Content */}

        {/* Modal */}
        <CSSTransition
          nodeRef={nodeRef}
          classNames="modal"
          in={modal === true}
          timeout={500}
        >
          <Modal
            width={matchProject ? '100%' : '50%'}
            height=""
            ref={nodeRef}
            updateState={setModal}
            defaultState={false}
          >
            {matchProject ? (
              <React.Fragment>
                <ImageSlider images={matchProject.images} />
                <ModalContentContent>
                  <Heading minSize={1.5} size={2}>
                    <span>{upperFirstWord(matchProject.title)}</span>
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
                        {parseDate(matchProject.startDate)}
                        {' - '}
                        {parseDate(matchProject.endDate)}
                      </Heading>
                      <Heading minSize={1} size={1}>
                        :&nbsp;{' '}
                        {matchProject.tools
                          .map((tool) => {
                            return isTool(tool)
                              ? `${tool.name} as ${tool.as}`
                              : tool.toString();
                          })
                          .join(', ')}
                      </Heading>
                      <Heading minSize={1} size={1}>
                        :&nbsp;
                        {upperFirstWord(
                          typeof matchProject.typeProject !== 'string'
                            ? matchProject.typeProject.name
                            : 'Unkown',
                        )}
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
                    {matchProject.description}.{' '}
                    {matchProject.url && (
                      <GoTo href={matchProject.url}>{matchProject.url}</GoTo>
                    )}
                  </Paragraph>
                </ModalContentContent>
              </React.Fragment>
            ) : (
              <ModalContentText>
                <Paragraph size={1.5} minSize={1.3}>
                  Project <span>with such id</span> not found
                </Paragraph>
              </ModalContentText>
            )}
          </Modal>
        </CSSTransition>
        {/* end of Modal */}
      </Container>
    </>
  );
}

export default Projects;

function ImageSlider({ images }: { images: ProjectInterface['images'] }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [imageState, setImageState] = useState({ slide: 0, translateX: 0 });

  function changeImageAction(event: MouseEvent, action: number): void {
    if (
      images.length > 1 &&
      event.currentTarget.parentElement !== null &&
      event.currentTarget.parentElement.parentElement !== null
    ) {
      const modalElement = event.currentTarget.parentElement.parentElement;
      const { width: modalWidth } = modalElement.getBoundingClientRect();

      // Jika nilai berikutnya ditambah lalu melebihi panjang gambar maka nilai akan menjadi ke 0
      // Jika nilai berikutnya dikurang lalu kurang dari 0 maka nilai akan menjadi jumlah gambar
      let result = 0;
      if (action === 0) {
        // // Jika hasil Operasi berikutnya kurang dari 0 maka setel ke jumlah gambar dikurangi 1
        if (imageState.slide - 1 < 0) result = images.length - 1;
        else result = imageState.slide - 1;
      } else {
        // Jika hasil Operasi berikutnya melebihi panjang gambar
        if (imageState.slide + 1 > images.length - 1) result = 0;
        else result = imageState.slide + 1;
      }

      setImageState({ slide: result, translateX: result * -modalWidth });
    }
  }

  return (
    <ModalImage ref={nodeRef}>
      {images.length > 1 && (
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
      <ModalImageContent translateX={imageState.translateX}>
        {images.map((value, index) => (
          <ModalImageContentContent key={getRandom(index)}>
            <Image
              alt="project"
              className={projectsStyled.project}
              src={`${value.src}`}
              layout="fill"
              priority
            />
          </ModalImageContentContent>
        ))}
      </ModalImageContent>

      {/* Content Count */}
      <ModalImageCount>
        {images.map((value, index) => (
          <ModalImageCountCount
            key={getRandom(index)}
            opacity={imageState.slide === index ? '1' : '0.5'}
          />
        ))}
      </ModalImageCount>
    </ModalImage>
  );
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

  h1:last-child {
    margin: 0.3rem 0 0 0;
  }
`;

const ModalImage = styled.div`
  height: 375px;
  overflow: hidden;
  position: relative;

  &:hover span:first-child {
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

const ModalContentText = styled.div`
  display: flex;
  min-height: 150px;
  justify-content: center;
  align-items: center;
`;
