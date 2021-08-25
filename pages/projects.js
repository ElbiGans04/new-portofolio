import Head from "next/head";
import Text from "../Components/Text";
import styled from "styled-components";
import { useEffect, useReducer} from "react";

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
    status: "iddle",
    projects: [],
    activeActions: ["A1", "ASC"],
  });

//   const fetchData = useCallback(() => {
//     async function getData () {
//         try {
//           // ubah state
//           dispatch({ type: "fetchData" });
    
//           const fetchProjects = await (await fetch("/api/projects?type=A1&order=ASC")).json();
//           console.log(fetchProjects);
    
//           // ubah state setelah finish
//           dispatch({
//             type: "projects",
//             payload: { projects: fetchProjects.data },
//           });
//         } catch (err) {
//           alert(err);
//         }
//     }
//     console.log("recreate")
//     getData()
//   }, []);
  
  
  useEffect(() => {      
      // Mencegah kondisi balapan
      if (state.status === 'iddle') {
        async function getData () {
            try {
              // ubah state
              dispatch({ type: "fetchData" });
        
              const fetchProjects = await (await fetch(`/api/projects?type=${state.activeActions[0]}&order=${state.activeActions[1]}`)).json();
              console.log(fetchProjects);
        
              // ubah state setelah finish
              dispatch({
                type: "projects",
                payload: { projects: fetchProjects.data },
              });
            } catch (err) {
              alert(err);
            }
        }

        getData()
    }
  }, [state.activeActions]);

  const handleAction = (e, typeButton, buttonValue) => {
    let validValue = false;
    let validType = false;

    // Check jika nilai valid
    for (let index = 0; index < listActions.length; index++) {
      if (listActions[index]["value"] === buttonValue) validValue = true;
      if (listActions[index]["type"] === typeButton) validType = true;
    }

    // Untuk sementara kita abaikan dulu jika tidak valid
    if (!validValue || !validType) alert("Error");

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
                  state.status === "loading" ? "cursor-notAllowed" : ""
                }
                disabled={state.status === "loading" ? true : false}
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
                  state.status === "loading" ? "cursor-notAllowed" : ""
                }
                disabled={state.status === "loading" ? true : false}
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
      {state.status === "loading" ? (
        <div className="loader"></div>
      ) : (
        <ContainerProjects>
          {state.projects.map((value, index) => {
            return <Test key={index} />;
          })}
        </ContainerProjects>
      )}
    </Container>
  );
}

export default Projects;

function reducer(state, action) {
  switch (action.type) {
    case "fetchData":
      return { ...state, status: "loading" };
    case "projects":
      return { ...state, projects: action.payload.projects, status: "iddle" };
    case "action":
      return { ...state, activeActions: action.payload.actions };
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
  padding: 0.5rem;
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