import React from "react";
import { Link } from "react-router-dom";

// utils
import { paths } from "utils";

const Table = ({ tableData, tableHead, addNew }) => {
  const getTableHeaders = () => {
    if (tableData.length === 0) return null;

    const headers = Object.keys(tableData[0]).map((key) => {
      return (
        <th
          className={
            "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
          }
          key={key}
        >
          {key}
        </th>
      );
    });

    return <tr>{headers}</tr>;
  };

  const getTableRows = () => {
    if (tableData.length === 0) return null;

    return tableData.map((data) => {
      return (
        <tr key={data.id}>
          {Object.values(data).map((value) => {
            return (
              <td
                className={
                  "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                }
                key={value}
              >
                {value}
              </td>
            );
          })}
        </tr>
      );
    });
  };
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div
            className={
              "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
            }
          >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex justify-between flex-grow flex-1">
                  <h3 className={"font-semibold text-lg  text-slate-700"}>
                    {tableHead}
                  </h3>
                  {addNew && (
                    <Link
                      to={paths[addNew]}
                      className="bg-pink-500 py-2 px-4 rounded text-white text-sm"
                    >
                      Add
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>{getTableHeaders()}</thead>
                <tbody>{getTableRows()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
