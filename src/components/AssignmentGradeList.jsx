import React, { useCallback, useEffect, useMemo, useState } from "react";
import update from "immutability-helper";
import AssignmentItem from "./AssignmentItem";
import { post } from "../api";
import Cookies from "universal-cookie";
import CustomSpinner from "./CustomSpinner";
import { Form, Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTable } from "react-table";

const AssignmentGradeList = ({ columns, data }) => {
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = useTable({
    columns,
    data,
  });

  return (
    <table class="table table-striped table-bordered table-hover" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="p-2" {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);           
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AssignmentGradeList;
