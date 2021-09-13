import useSWR from "swr";
import fetcher from "../lib/module/fetcher";
import upperFirstWord from "../lib/module/upperFirstWord";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";
import React, { useState, useRef } from "react";
import Button from "./Button";
import {
  IoTrashBinOutline,
  IoAddOutline,
  IoPencilSharp,
} from "react-icons/io5";

export default function TableComponent({
  url,
  columns = [],
  visible: { visibleValue = 0, visibleColumns = [] } = {},
} = {}) {
  const { data: { data: tools = [] } = {}, err } = useSWR(url, fetcher);
  const { mainColumns, detailColumns, mainRows, detailRows } = filter(
    tools,
    columns,
    visibleColumns,
    visibleValue,
  );

  // Jika ada error
  if (err) {
    return <h1>Found a error</h1>;
  }

  return (
    <ContainerTable>
      <Table>
        <thead>
          <tr>
            {/* Jika Column kurang dari 4 maka jangan tampilkna detail */}
            {detailColumns.length > 0 && <th></th>}
            {mainColumns.map((value, index) => {
              return <th key={getRandom(index)}>{upperFirstWord(value)}</th>;
            })}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            mainRows.map((mainRow, index) => {
              return <Row key={getRandom(index)} detailColumns={detailColumns} detailRow={detailRows[index]} mainRow={mainRow} />
            })
          }
        </tbody>
      </Table>
    </ContainerTable>
  );
}

function Row({ detailRow, mainRow, detailColumns }) {
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
        {
          mainRow.map((value, index) => {
            return (
              <td key={getRandom(index)}>{upperFirstWord(value)}</td>
            )
          })
        }

        <td>
          <TdActions>
            <Button title="delete the row">
              <IoTrashBinOutline></IoTrashBinOutline>
            </Button>
            <Button title="update the row">
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
                {
                  detailColumns.map((detailColumn, index) => {
                    return (
                      <RowDetailsContentContentContent key={getRandom(index)}>
                        <div>{upperFirstWord(detailColumn)}</div>
                        <div>{upperFirstWord(detailRow[index])}</div>
                      </RowDetailsContentContentContent>
                    )
                  })
                }
              </RowDetailsContentContent>
            </RowDetailsContent>
          </RowDetails>
        </CSSTransition>
      )}
    </React.Fragment>
  );
}

// Module
function filter(data, columns, visibleColumns, visibleValue) {
  const results = {
    mainColumns: [],
    detailColumns: [],
    mainRows: [],
    detailRows: []
  };

  if (data.length > 0) {
    const result = Object.keys(data[0]).filter((column) => {
      // Temukan column yang diberi batasan
      const foundColumn = visibleColumns.find((value) => value === column);
  
      if (foundColumn !== undefined) return visibleValue === 0 ? false : true;
  
      return visibleValue === 0 ? true : false;
    });
  
    // if (columns.length === 0 || (result.length < 4 ))
    if (columns.length === 0)
      results.mainColumns = [...result];
    else {
      result.forEach((value) => {
        for (let column of columns) {
          if (value === column) results.mainColumns.push(value);
          else results.detailColumns.push(value);
        }
      });
    }
  
    // Isi dengan nilai
    data.forEach(row => {
      // Ubah Object menjadi array
      const columns = Object.entries(row);
  
  
      // Opsi one
      let passColumns = [];
      let passDetails = [];
  
      // Lakukan Filtering
      columns.forEach(column => {
        const ifMatch = results.mainColumns.find(matchColumn => matchColumn === column[0]);
        if (ifMatch !== undefined) passColumns.push(column[1]);
  
        const ifMatch2 = results.detailColumns.find(matchColumn => matchColumn === column[0]);
        if (ifMatch2 !== undefined) passDetails.push(column[1])
      });
  
      results.mainRows.push(passColumns);
      results.detailRows.push(passDetails);
    });
  }


  return results;
}

function getRandom (index) {
  return `${Date.now()}${Math.floor( Math.random() * (1 - 100) + 100)}${index || 1}`
}

// End of Module

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
    border-bottom: 2px solid rgba(0, 0, 0, 0.2)!important;
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
`;
