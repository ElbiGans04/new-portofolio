import Table from "../../Components/Table";
import Head from "next/head";
import Admin from "../../Components/Admin";
import { Context } from "../../lib/hooks/toolsContext";
import { useReducer } from "react";
import {reducer} from '../../lib/hooks/reducer'

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
  // return (
  //     <>
  //       <Head>
  //           <title>Tools</title>
  //       </Head>
  //       <Table
  //         url="/api/tools"
  //         columns={['name']}
  //         visible={{
  //             visibleValue: 0,
  //             visibleColumns: ['_id', '__v']
  //         }}
  //       />
  //     </>
  // );
}
{
  /* <Table
result="/api/tools"
columns={{
    _id: 1,
    __v: 1
}}
/> */
}

