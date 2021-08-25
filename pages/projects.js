import Head from "next/head";
import Text from "../Components/Text";
import styled from "styled-components";
import React, { useEffect, useReducer } from "react";

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

          console.log(fetchProjects, didCancel)

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

      {/* Error handling */}
      {state.status === 'error' ? (
        <Action onClick={() => dispatch({type: 'refetch'})}><Text size={1.2}><span>Click here to refresh</span></Text></Action>
      ) : (
        <React.Fragment>
          {state.status === "loading" ? (
            <div className="loader"></div>
          ) : (
            <ContainerProjects>
              {state.projects.map((value, index) => {
                return <Test key={index} />;
              })}
            </ContainerProjects>
          )}
        </React.Fragment>
      )}
    </Container>
  );
}

export default Projects;

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
}

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
  grid-auto-rows: 1fr;
  gap: 0.5rem;
`;

const Test = styled.div`
  background-color: red;
  height: 100px;
`;