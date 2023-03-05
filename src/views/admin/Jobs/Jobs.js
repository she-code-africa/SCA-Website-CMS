import Table from "components/Table";
import React from "react";
import JobTypeCategory from "./JobTypeCategories";

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
    <>
      <div
        className="flex flex-w
    "
      >
        <div className="w-full lg:w-9/12 px-4">
          <div>
            <h1>Jobs</h1>
            <button>Add New Job</button>
          </div>
          <Table tableData={tableData} tableHead="Jobs" addNew="addNewJob" />
        </div>
        <div className="w-full lg:w-3/12 px-4">
          <JobTypeCategory />
        </div>
      </div>
    </>
  );
};

export default Jobs;
