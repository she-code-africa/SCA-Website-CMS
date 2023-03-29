import React from "react"; 
import Table from "components/Table";

// components
const tableData = [
  {
    id: 1,
    name: "Micorosft",
    logo:"",
    type:"",
    featured:true
  },
  {
    id: 2,
    name: "Google",
    logo:"",
    type:"",
    featured:false
  },
  {
    id: 3,
    name: "ABC",
    logo:"",
    type:"",
    featured:true
  },
   
  // Add more objects for more rows
];


// utils


const PartnersList = () => {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
        <Table
            tableData={tableData}
            tableHead="Partners"
            addNew="addPartner"
            showActions="true"
            edit="editPartner"
          />
        </div>

      </div>
    </>
  );
} 

export default PartnersList