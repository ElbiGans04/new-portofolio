import Button from '@components/Button';
import Context from '@hooks/context';
import useUser from '@hooks/useUser';
import getRandom from '@module/randomNumber';
import upperFirstWord from '@module/upperFirstWord';
import { Doc, DocErrors, ResourceObject } from '@typess/jsonApi/index';
import { OObject } from '@typess/jsonApi/object';
import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  IoAddOutline,
  IoPencilSharp,
  IoTrashBinOutline,
} from 'react-icons/io5';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import useSWR from 'swr';
import { fetcherGeneric } from '../module/fetcher';
import Heading from './Heading';

export default function Admin() {
  const {
    url = '',
    columns = [],
    visible: { visibleColumns = [], visibleValue = 0 } = {},
    renameColumns = {},
    dispatch,
  } = useContext(Context);
  const { data, error } = useSWR<Doc, DocErrors>(url, fetcherGeneric);
  const user = useUser({ redirectTo: '/login', redirectIfFound: false });

  // Membuat fungsi hanya akan dipanggil jika ada depedency yang berubah
  const { mainColumns, detailColumns, mainRows, detailRows, rowsId } = useMemo(
    () => filter(data, columns, visibleColumns, visibleValue),
    [data, columns, visibleColumns, visibleValue],
  );

  // Jika dispatch tidak ada
  if (dispatch === undefined) throw new Error('dispatch not found');

  // Jika ada error
  if (error) {
    return (
      <ContainerError>
        <Heading size={1.5} minSize={1.3}>
          An error occurred when <span>trying to request data</span>
        </Heading>
        ;
        <Heading minSize={1} size={1.3}>
          Please <span>restart this page</span>
        </Heading>
        ;
      </ContainerError>
    );
  }

  // Jika sedang memverifikasi data atau saat sedang mengambil data
  if (!user) {
    return (
      <Container>
        <div className="loader" />
      </Container>
    );
  }

  return (
    <Container>
      <ContainerButtons>
        <Button onClick={() => dispatch({ type: 'modal/open/add' })}>
          <IoAddOutline />
          Add Entity
        </Button>
      </ContainerButtons>
      <ContainerTable>
        <Table>
          <thead>
            <tr>
              {/* Jika Column kurang dari 4 maka jangan tampilkna detail */}
              {detailColumns.length > 0 && <th />}
              {/* Looping element yang diijinkan */}
              {mainColumns.map((value, index) => {
                // Check apakah field tertentu harus direname
                const keyRenameColumns = Object.entries(renameColumns);
                const shouldRename = keyRenameColumns.find(
                  (column) => column[0] === value,
                );

                if (shouldRename)
                  return <th key={getRandom(index)}>{shouldRename[1]}</th>;
                return <th key={getRandom(index)}>{upperFirstWord(value)}</th>;
              })}
              {/* Beri th kosong untuk action */}
              <th />
            </tr>
          </thead>
          <tbody>
            {mainRows.map((mainRow, index) => (
              <Row
                key={getRandom(index)}
                id={rowsId[index]}
                detailColumns={detailColumns}
                detailRow={detailRows[index]}
                mainRow={mainRow}
                mainColumns={mainColumns}
              />
            ))}
          </tbody>
        </Table>
      </ContainerTable>
    </Container>
  );
}

function Row({
  detailColumns,
  detailRow,
  mainColumns,
  mainRow,
  id,
}: {
  detailColumns: string[];
  detailRow: OObject;
  mainColumns: string[];
  mainRow: OObject;
  id: string;
}) {
  const {
    dispatch,
    specialTreatment = {},
    renameColumns = {},
  } = useContext(Context);
  const [details, setDetails] = useState(false);
  const ref = useRef(null);
  const keySpecialTreatment = Object.entries(specialTreatment);

  if (dispatch === undefined) throw new Error('dispatch function not found');

  if (mainRow instanceof Array && detailRow instanceof Array) {
    return (
      <>
        <tr>
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
            // Check jika column harus diperlakukan secara khusus
            const special = keySpecialTreatment.find(
              (keySpecial) => keySpecial[0] === mainColumns[index],
            );

            if (special) {
              return special[1](value);
            }

            // Perlakuan Default
            return (
              <td key={getRandom(index)}>{upperFirstWord(value as string)}</td>
            );
          })}

          <td>
            <TdActions>
              <Button
                onClick={() =>
                  dispatch({ type: 'modal/open/delete', payload: { id } })
                }
                title="delete the row"
              >
                <IoTrashBinOutline />
              </Button>
              <Button
                onClick={() =>
                  dispatch({
                    type: 'modal/open/update',
                    payload: {
                      id,
                      columns: [...mainColumns, ...detailColumns],
                      columnsValue: [...mainRow, ...detailRow],
                    },
                  })
                }
                title="update the row"
              >
                <IoPencilSharp />
              </Button>
            </TdActions>
          </td>
        </tr>

        {/* Detail Row */}
        {detailColumns.length > 0 && (
          <CSSTransition
            nodeRef={ref}
            classNames="row-details"
            in={details}
            timeout={500}
          >
            <RowDetails ref={ref}>
              <RowDetailsContent colSpan={mainRow.length + 1}>
                <RowDetailsContentContent>
                  {detailColumns.map((detailColumn, index) => {
                    const keyRenameColumns = Object.entries(renameColumns);
                    // check jika ada column yang harus direname
                    const specialField = keyRenameColumns.find(
                      (keySpecial) => keySpecial[0] === detailColumn,
                    );

                    const fieldName = specialField
                      ? specialField[1]
                      : upperFirstWord(detailColumn);

                    // Check jika nilai column harus diperlakukan secara khusus
                    const special = keySpecialTreatment.find(
                      (keySpecial) => keySpecial[0] === detailColumn,
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
                        <div>{upperFirstWord(detailRow[index] as string)}</div>
                      </RowDetailsContentContentContent>
                    );
                  })}
                </RowDetailsContentContent>
              </RowDetailsContent>
            </RowDetails>
          </CSSTransition>
        )}
      </>
    );
  }

  return <tr />;
}

//
// // Module
//
type filterResults = {
  mainColumns: string[];
  detailColumns: string[];
  mainRows: OObject[];
  detailRows: OObject[];
  rowsId: string[];
};
function filter(
  data: Doc | undefined,
  columns: string[],
  visibleColumns: string[],
  visibleValue = 0,
) {
  const results: filterResults = {
    mainColumns: [],
    detailColumns: [],
    mainRows: [],
    detailRows: [],
    rowsId: [],
  };

  if (typeof data === 'undefined' || data.data === null) return results;

  // Dapatkan columns
  // Filter mana column yang boleh ditampilkan mana yang tidak
  const result = Array.isArray(data.data)
    ? getAndFilterColumns(data.data[0], visibleColumns, visibleValue)
    : getAndFilterColumns(data.data, visibleColumns, visibleValue);

  // Check Terlebih dahulu apakah sesuai dengan kriteria yang diinginkan
  // // Dari hasil operasi diatas kita pilih mana yang akan ditampilkan sebagai
  // // Main column dan mana yang bukan
  // // Jika nilai column sama dengan 0 berarti menandakan bahwa semua column harus ditandakan sebagai
  // // Main column
  if (columns.length === 0) results.mainColumns = [...result];
  else {
    result.forEach((value) => {
      const mustBeMainColumn = columns.includes(value);
      if (mustBeMainColumn) results.mainColumns.push(value);
      else results.detailColumns.push(value);
    });
  }

  // Isi dengan nilai
  if (Array.isArray(data.data))
    data.data.forEach((row) => decideRow(results, row));
  else decideRow(results, data.data);

  return results;
}

function getAndFilterColumns(
  data: ResourceObject,
  visibleColumns: string[],
  visibleValue: number,
): string[] {
  if (data === undefined) return [];
  if (data.attributes === undefined) return [];

  return Object.keys(data.attributes).filter((column) => {
    // Temukan column yang diberi batasan
    const foundColumn = visibleColumns.find((value) => value === column);
    // Jika column yang dibatasi memiliki nilai 0 berarti column tsb tidak boleh ditampilkan
    if (foundColumn !== undefined) return visibleValue !== 0;

    return visibleValue === 0;
  });
}

function decideRow(results: filterResults, row: ResourceObject) {
  // Push setiap id
  results.rowsId.push(row.id);

  if (row.attributes === undefined) return;

  // Ubah Object menjadi array
  const columns = Object.entries(row.attributes);

  const passColumns: OObject[] = [];
  const passDetails: OObject[] = [];

  // Untuk setiap column kita lakukan Filtering
  columns.forEach((column) => {
    // Berikan Kondisi
    // Ambil Nilai untuk main columns
    const ifMatch = results.mainColumns.find(
      (matchColumn) => matchColumn === column[0],
    );
    if (ifMatch !== undefined) passColumns.push(column[1]);

    // Ambil Nilai Untuk details column
    const ifMatch2 = results.detailColumns.find(
      (matchColumn) => matchColumn === column[0],
    );
    if (ifMatch2 !== undefined) passDetails.push(column[1]);
  });

  results.mainRows.push(passColumns);
  results.detailRows.push(passDetails);
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
    margin: 0.2rem;
  }
`;
