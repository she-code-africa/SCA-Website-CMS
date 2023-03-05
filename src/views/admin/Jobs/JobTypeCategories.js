import React from "react";

const JobTypeCategory = () => {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        <div className="px-6">
          <div className="text-center mt-12">
            <div>
              <h6>Job Type</h6>
              <label>Name</label>
              <input />
              <button>Add</button>
            </div>
            <div>
              <h6>Job Category</h6>
              <label>Name</label>
              <input />
              <button>Add</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobTypeCategory;
