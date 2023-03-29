import React, { useCallback, useState } from "react";
import { BsPlus } from "react-icons/bs";

const TeamCategory = () => {  
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [Categories, setCategories] = useState([
    "FTE",
    "Support Team", 
    "Advisors",
  ]);
 

  const handleAddCategory = useCallback(() => {
    if (newCategory.trim()) {
      setCategories((prevCategories) => [
        ...prevCategories,
        newCategory.trim(),
      ]);
      setNewCategory("");
    }
    setShowCategoryInput(false);
  }, [newCategory]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        <div className="px-3 lg:px-6">
          <div className="mt-8 mb-5">
            
            <div className="my-3">
              <div className="flex justify-between my-4">
                <h6 className="uppercase font-bold">Team Category</h6>
                <div
                  className="hover:cursor-pointer"
                  onClick={() => setShowCategoryInput(true)}
                >
                  <BsPlus size="1.5rem" />
                </div>
              </div>
              <ul
                className="bg-slate-50 p-4 overflow-y-scroll block"
                style={{ maxHeight: "180px" }}
              >
                {showCategoryInput && (
                  <li className="flex flex-col">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(event) =>
                        setNewCategory(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleAddCategory();
                        }
                      }}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="bg-pink-500 px-4 py-1 text-white mt-3"
                      style={{ alignSelf: "end" }}
                    >
                      Add
                    </button>
                  </li>
                )}
                {Categories.map((Category, index) => (
                  <li key={index}>{Category}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamCategory;
