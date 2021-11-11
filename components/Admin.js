import { CSSTransition } from "react-transition-group";
import React, { useState, useRef, useMemo, useContext } from "react";
import styled from "styled-components";
import {
  IoTrashBinOutline,
  IoAddOutline,
  IoPencilSharp,
} from "react-icons/io5";
import Button from "./Button";
import useSWR from "swr";
import fetcher from "../module/fetcher";
import upperFirstWord from "../module/upperFirstWord";
import getRandom from "../module/randomNumber";
import Context from "../hooks/context";
import Heading from "./Heading";
import useUser from "../hooks/useUser";

export default function Admin () {
  const {
    url = "",
    columns = [],
    visible: { visibleColumns = [], visibleValue = 0 } = {},
    renameColumns = {},
    dispatch
  } = useContext(Context);
  const { data: { data: tools} = {}, err } = useSWR(url, fetcher);
  const user = useUser({redirectTo: '/login'});

  // Membuat fungsi hanya akan dipanggil jika ada depedency yang berubah
  const { mainColumns, detailColumns, mainRows, detailRows, rowsId } = useMemo(
    () => filter(tools, columns, visibleColumns, visibleValue),
    [tools, columns, visibleColumns, visibleValue]
  );

  // Jika ada error
  if (err) {
    return  (
      <ContainerError>
        <Heading size={1.5} minSize={1.3}>An error occurred when <span>trying to request data</span></Heading>;
        <Heading size={1.3}>Please <span>restart this page</span></Heading>;
      </ContainerError>
    )
  }

  return (
    <Container>
      {
        ((!tools && !err) || (!user || user.isLoggedIn === false)) ? (
          <div className="loader"></div>) : (
            <React.Fragment>
              <ContainerButtons>
                  <Button onClick={() => dispatch({ type: "modalAdd/open" })}>
                    <IoAddOutline />
                    Add Entity
                  </Button>
                </ContainerButtons>
              <ContainerTable>
                <Table>
                  <thead>
                    <tr>
                      {/* Jika Column kurang dari 4 maka jangan tampilkna detail */}
                      {detailColumns.length > 0 && <th></th>}
                      {/* Looping element yang diijinkan */}
                      {mainColumns.map((value, index) => {
                        const keyRenameColumns = Object.entries(renameColumns);
                        const shouldRename = keyRenameColumns.find(
                          (column) => column[0] === value
                        );

                        if (shouldRename)
                          return <th key={getRandom(index)}>{shouldRename[1]}</th>;
                        return <th key={getRandom(index)}>{upperFirstWord(value)}</th>;
                      })}
                      {/* Beli th kosong untuk action */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainRows.map((mainRow, index) => {
                      return (
                        <Row
                          key={getRandom(index)}
                          id={rowsId[index]}
                          detailColumns={detailColumns}
                          detailRow={detailRows[index]}
                          mainRow={mainRow}
                          mainColumns={mainColumns}
                        />
                      );
                    })}
                  </tbody>
                </Table>
              </ContainerTable>
            </React.Fragment>
          )
      }
    </Container>
  );
}

function Row({ detailColumns, detailRow, mainColumns, mainRow, id }) {
  const { dispatch, specialTreatment = {}, renameColumns = {} } = useContext(Context);
  const [details, setDetails] = useState(false);
  const ref = useRef(null);

  return (
    <React.Fragment>
      <tr>
        {/* Jika Column kurang dari 4 maka jangan tampilkna detail */}
        {detailColumns.length > 0 && (
          <td>
            <Button
              title="see details of row"
              onClick={() => setDetails((state) => !state)}
            >
              <IoAddOutline />
            </Button>
          </td>
        )}
        {/*  Lakukan looping */}
        {mainRow.map((value, index) => {
          const keySpecialTreatment = Object.entries(specialTreatment);
          
          // Check jika column harus diperlakukan secara khusus
          const special = keySpecialTreatment.find(
            (keySpecial) => keySpecial[0] === mainColumns[index]
          );

          if (special) {
            return special[1](value);
          }

          // Perlakuan Default
          return <td key={getRandom(index)}>{upperFirstWord(value)}</td>;
        })}

        <td>
          <TdActions>
            <Button
              onClick={() =>
                dispatch({ type: "modalDelete/open", payload: { id } })
              }
              title="delete the row"
            >
              <IoTrashBinOutline></IoTrashBinOutline>
            </Button>
            <Button
              onClick={() =>
                dispatch({
                  type: "modalUpdate/open",
                  payload: {
                    id,
                    columns: [...mainColumns, ...detailColumns],
                    columnsValue: [...mainRow, ...detailRow],
                  },
                })
              }
              title="update the row"
            >
              <IoPencilSharp></IoPencilSharp>
            </Button>
          </TdActions>
        </td>
      </tr>

      {detailColumns.length > 0 && (
        <CSSTransition
          nodeRef={ref}
          classNames="row-details"
          in={details}
          timeout={500}
        >
          <RowDetails ref={ref}>
            <RowDetailsContent colSpan="4">
              <RowDetailsContentContent>
                {detailColumns.map((detailColumn, index) => {
                  const keySpecialTreatment = Object.entries(specialTreatment);
                  const keyRenameColumns = Object.entries(renameColumns);
                  // check jika harus direname
                  const specialField = keyRenameColumns.find(
                    (keySpecial) => keySpecial[0] === detailColumn
                  );

                  let fieldName = specialField
                    ? specialField[1]
                    : upperFirstWord(detailColumn);

                  // Check jika nilai  column harus diperlakukan secara khusus
                  const special = keySpecialTreatment.find(
                    (keySpecial) => keySpecial[0] === detailColumn
                  );

                  if (special) {
                    return (
                      <RowDetailsContentContentContent key={getRandom(index)}>
                        <div>{fieldName}</div>
                        {special[1](detailRow[index])}
                      </RowDetailsContentContentContent>
                    );
                  }

                  // Default
                  return (
                    <RowDetailsContentContentContent key={getRandom(index)}>
                      <div>{fieldName}</div>
                      <div>{upperFirstWord(detailRow[index])}</div>
                    </RowDetailsContentContentContent>
                  );
                })}
              </RowDetailsContentContent>
            </RowDetailsContent>
          </RowDetails>
        </CSSTransition>
      )}
    </React.Fragment>
  );
}

//
// // Module
//
function filter(data = [], columns = [], visibleColumns = [], visibleValue = 0) {
  const results = {
    mainColumns: [],
    detailColumns: [],
    mainRows: [],
    detailRows: [],
    rowsId: [],
  };

  if (data.length > 0) {
    // Filter mana column yang boleh ditampilkan mana yang tidak
    const result = Object.keys(data[0]?.attributes).filter((column) => {
      // Temukan column yang diberi batasan
      const foundColumn = visibleColumns.find((value) => value === column);
      // Jika column yang dibatasi memiliki nilai 0 berarti column tsb tidak boleh ditampilkan
      if (foundColumn !== undefined) return visibleValue === 0 ? false : true;

      return visibleValue === 0 ? true : false;
    });

    // // Dari hasil operasi diatas kita pilih mana yang akan ditampilkan sebagai
    // // Main COlumn dan mana yang bukan
    // if (columns.length === 0 || (result.length < 4 ))
    if (columns.length === 0) results.mainColumns = [...result];
    else {
      result.forEach((value) => {
        const mustBeMainColumn = columns.includes(value);
        if (mustBeMainColumn) results.mainColumns.push(value);
        else results.detailColumns.push(value);
      });
    }

    // Isi dengan nilai
    data.forEach((row) => {
      // Ubah Object menjadi array
      const columns = Object.entries(row?.attributes);

      let passColumns = [];
      let passDetails = [];

      // Lakukan Filtering
      columns.forEach((column) => {
        // Perlakuan Khusus Column _id
        if (column[0] === "_id") results.rowsId.push(column[1]);

        // Berikan Kondisi
        // Ambil Nilai untuk main columns
        const ifMatch = results.mainColumns.find(
          (matchColumn) => matchColumn === column[0]
        );
        if (ifMatch !== undefined) passColumns.push(column[1]);

        // Ambil Nilai Untuk details column
        const ifMatch2 = results.detailColumns.find(
          (matchColumn) => matchColumn === column[0]
        );
        if (ifMatch2 !== undefined) passDetails.push(column[1]);
      });

      results.mainRows.push(passColumns);
      results.detailRows.push(passDetails);
    });
  }

  return results;
}

// End of Module

//
// // Styled Component
//
const Container = styled.div`
  width: 80%;
  min-height: 50vh;
  overflow: hidden;

  @media (max-width: 768px) {
    & {
      width: 90%;
    }
  }
`;

const ContainerError = styled.div`
  display: grid;
  gap" 0.3rem;
`;

const ContainerButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
`;

// Styled component
const ContainerTable = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  background-color: var(--dark2);
  padding: 1rem;
  border-radius: 0.8rem;

  & thead {
    border-bottom: 2px solid var(--pink);
  }

  & tbody tr {
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  }

  & tbody tr:last-child {
    border-bottom: none;
  }

  & th,
  & td {
    padding: 1rem;
    color: white;
    text-align: center;
  }

  & th {
    padding: 1.5rem;
    font-weight: bold;
    color: var(--pink);
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    & {
      width: 200%;
    }

    & th {
      font-size: 1rem;
    }
  }
`;

const RowDetails = styled.tr`
  border: none !important;
  transition: var(--transition);
  line-height: 0;
  height: 0%;
  font-size: 0;

  &.row-details-enter-done {
    border-bottom: 2px solid rgba(0, 0, 0, 0.2) !important;
  }
`;

const RowDetailsContent = styled.td`
  padding: 0 !important;
  overflow: hidden;
  transition: var(--transition);
  height: 0%;
`;

const RowDetailsContentContent = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  width: 100%;
  height: 100%;
  transition: var(--transition);
  padding: 0;
  overflow: hidden;
  text-align: center;
`;

const RowDetailsContentContentContent = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
  transition: var(--transition);
  padding: 0;
  overflow: hidden;
  text-align: center;
`;

const TdActions = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  & > button {
    margin: .2rem;
  }
`;
