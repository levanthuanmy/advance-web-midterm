import React, { useMemo, useEffect, useState } from "react";
import { get, post } from "../../api";
import AssignmentGradeList from "../../components/AssignmentGradeList";
import Cookies from "universal-cookie";

const GradePage = ({ classroomId }) => {
  const [data, setData] = useState([]);
  const [columnsTemplate, setColumnsTemplate] = useState([]);

  const cookies = new Cookies();
  // Using useEffect to call the API once mounted and set the data
  const getAssignmentsName = async () => {
    const allAssignmentResult = await get(
      `/assignments/${classroomId}`,
      cookies.get("token"),
      {}
    );
    const assignmentNames = [];
    allAssignmentResult.params.forEach((assignment) => {
      assignmentNames.push(assignment.name);
    });
    return assignmentNames;
  }

  useEffect(() => {
    (async () => {
      const assignmentNames = await getAssignmentsName();
      

      const result = await get(
        `/get-grade-board/${classroomId}`,
        cookies.get("token"),
        {}
      );      


      //template
      var columns = [
        {
          Header: "ID",
          accessor: "studentId",
        },
        {
          Header: "Tên",
          accessor: "name",
        },
      ];
      for (var i = 0; i < assignmentNames.length; i++) {
        columns.push({
          Header: assignmentNames[i],
          accessor: `assignmentGrade[${i}]`,
        });
      }

      columns.push({
        Header: "Total",
        accessor: "total",
      });
      //template
      
      setColumnsTemplate([...columns]);
      setData(result);
    })();
  }, []);

  return (
    <AssignmentGradeList
      columns={columnsTemplate}
      data={data}
    ></AssignmentGradeList>
  );
};

export default GradePage;
