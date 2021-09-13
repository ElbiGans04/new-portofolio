import Head from "next/head";
import Admin from "../../Components/Admin";
import { Context } from "../../lib/hooks/toolsContext";
import { useReducer } from "react";
import {reducer} from '../../lib/hooks/reducer'
import { CSSTransition } from "react-transition-group";

export default function Tools() {
  const [state, dispatch] = useReducer(reducer, {
    modal: false,
    url: "/api/tools",
    columns: ["name"],
    visible: {
      visibleValue: 0,
      visibleColumns: ["_id", "__v"],
    },
  });

  return (
    <Context.Provider value={{state, dispatch}}>
      <Head>
        <title>Tools</title>
      </Head>
      <Admin />
    </Context.Provider>
  );
}
