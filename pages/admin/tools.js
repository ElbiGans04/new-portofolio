import Table from "../../Components/Table";
import Head from 'next/head'

export default function Tools() {
  return (
      <>
        <Head>
            <title>Tools</title>
        </Head>
        <Table
          url="/api/tools"
          columns={['name']}
          visible={{
              visibleValue: 0,
              visibleColumns: ['_id', '__v']
          }}
        />
      </>
  );
}
{/* <Table
result="/api/tools"
columns={{
    _id: 1,
    __v: 1
}}
/> */}