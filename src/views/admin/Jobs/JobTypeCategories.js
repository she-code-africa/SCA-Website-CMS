import React, { useCallback, useState } from "react";
import { BsPlus } from "react-icons/bs";

const JobTypeCategory = () => {
  const [showInput, setShowInput] = useState(false);
  const [newJobType, setNewJobType] = useState("");
  const [showJobCategoryInput, setShowJobCategoryInput] = useState(false);
  const [newJobCategory, setNewJobCategory] = useState("");
  const [jobTypes, setJobTypes] = useState([
    "Full Time",
    "Part Time",
    "Contract",
    "Full Time",
    "Part Time",
    "Contract",
    "Full Time",
    "Part Time",
    "Contract",
  ]);

  const [jobCategories, setJobCategories] = useState([
    "Software Development",
    "Product Management",
    "Product Design",
    "UX Research",
  ]);

  const handleAddJobType = useCallback(() => {
    if (newJobType.trim()) {
      setJobTypes((prevJobTypes) => [...prevJobTypes, newJobType.trim()]);
      setNewJobType("");
    }
    setShowInput(false);
  }, [newJobType]);

  const handleAddJobCategory = useCallback(() => {
    if (newJobCategory.trim()) {
      setJobCategories((prevJobCategories) => [
        ...prevJobCategories,
        newJobCategory.trim(),
      ]);
      setNewJobCategory("");
    }
    setShowJobCategoryInput(false);
  }, [newJobCategory]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        <div className="px-3 lg:px-6">
          <div className="mt-8 mb-5">
            <div>
              <div className="flex justify-between my-2">
                <h6 className="uppercase font-bold">Job Types</h6>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => setShowInput(true)}
                >
                  <BsPlus size="1.5rem" />
                </div>
              </div>
              <ul
                className="bg-slate-50 p-4 overflow-y-scroll block"
                style={{ maxHeight: "180px", overflowY: "scroll" }}
              >
                {showInput && (
                  <li className="flex flex-col">
                    <input
                      type="text"
                      value={newJobType}
                      onChange={(event) => setNewJobType(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleAddJobType();
                        }
                      }}
                    />
                    <button
                      className="bg-pink-500 px-4 py-1 text-white mt-3"
                      onClick={handleAddJobType}
                      style={{ alignSelf: "end" }}
                    >
                      Add
                    </button>
                  </li>
                )}
                {jobTypes.map((jobType, index) => (
                  <li key={index}>{jobType}</li>
                ))}
              </ul>
            </div>
            <div className="my-3">
              <div className="flex justify-between my-4">
                <h6 className="uppercase font-bold">Job Category</h6>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => setShowJobCategoryInput(true)}
                >
                  <BsPlus size="1.5rem" />
                </div>
              </div>
              <ul
                className="bg-slate-50 p-4 overflow-y-scroll block"
                style={{ maxHeight: "180px" }}
              >
                {showJobCategoryInput && (
                  <li className="flex flex-col">
                    <input
                      type="text"
                      value={newJobCategory}
                      onChange={(event) =>
                        setNewJobCategory(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleAddJobCategory();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddJobCategory}
                      className="bg-pink-500 px-4 py-1 text-white mt-3"
                      style={{ alignSelf: "end" }}
                    >
                      Add
                    </button>
                  </li>
                )}
                {jobCategories.map((jobCategory, index) => (
                  <li key={index}>{jobCategory}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobTypeCategory;
