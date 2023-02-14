import Table from "components/Table";
import React from "react";

const tableData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-555-5555",
  },
  // Add more objects for more rows
];

const Jobs = () => {
  return (
    <div>
      <div>
        <h1>Jobs</h1>
        <button>Add New Job</button>
      </div>
      <Table tableData={tableData} tableHead="Jobs" addNew="addNewJob" />
    </div>
  );
};

export default Jobs;
