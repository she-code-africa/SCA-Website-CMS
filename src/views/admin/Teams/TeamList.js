import Table from "components/Table";
import React from "react";
import TeamCategory from "./TeamCategories";

const tableData = [
  {
    id: 1,
    firstname: "Mary",
    lastname: "Jane",
    role: "Program Manager",
    category: "FTE",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHCOoT2eKWeJgxP_zOgJLwhFAO-eKD-7D70g&usqp=CAU",
  
  },
  {
    id: 2,
    firstname: "Kelp",
    lastname: "Hopp",
    role: "Community Manager",
    category: "Support",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHCOoT2eKWeJgxP_zOgJLwhFAO-eKD-7D70g&usqp=CAU",
  
  },
   
  // Add more objects for more rows
];

const Team = () => {
  return (
    <>
      <div
        className="flex flex-w
    "
      >
        <div className="w-full lg:w-9/12 px-4">
          <div>
            <h1>Team</h1>
            <button>Add New Member</button>
          </div>
          <Table
            tableData={tableData}
            tableHead="SCA Team"
            addNew="addMember"
            showActions="true"
            edit="editMember"
          />
        </div>
        <div className="w-full lg:w-3/12 px-4">
          <TeamCategory />
        </div>
      </div>
    </>
  );
};

export default Team;
