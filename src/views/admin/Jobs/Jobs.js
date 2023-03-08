import Table from "components/Table";
import React from "react";
import JobTypeCategory from "./JobTypeCategories";

const tableData = [
  {
    id: 1,
    title: "Product Owner",
    deadline: "",
    minimumExperience: "2 years",
    applicationLink: "http://go.com",
    salaryCurrency: "USD",
    salaryRange: "2000",
    location: "Remote",
    guestPost: true,
    // guestPostMetaData: {
    //   companyName: "Heirs & Co",
    //   companyEmail: "heirs@gmail.com",
    //   companyUrl: "www.hiers.com",
    // },
    jobType: "638263051e02b1c8b72a18bf",
    jobCategory: "63820789f65ee6407b1a6793",
  },
  {
    id: 2,
    title: "Product Owner",
    deadline: "",
    minimumExperience: "2 years",
    applicationLink: "http://go.com",
    salaryCurrency: "USD",
    salaryRange: "2000",
    location: "Remote",
    guestPost: true,
    // guestPostMetaData: {
    //   companyName: "Heirs & Co",
    //   companyEmail: "heirs@gmail.com",
    //   companyUrl: "www.hiers.com",
    // },
    jobType: "638263051e02b1c8b72a18bf",
    jobCategory: "63820789f65ee6407b1a6793",
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
          <Table
            tableData={tableData}
            tableHead="Jobs"
            addNew="addNewJob"
            showActions="true"
            edit="editJob"
          />
        </div>
        <div className="w-full lg:w-3/12 px-4">
          <JobTypeCategory />
        </div>
      </div>
    </>
  );
};

export default Jobs;
