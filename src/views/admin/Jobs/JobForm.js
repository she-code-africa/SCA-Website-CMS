import React, { useState, useCallback } from "react";

const JobForm = ({ newJob }) => {
  const intialJobValue = {
    title: "",
    description: "",
    deadline: "",
    minimumExperience: "",
    applicationLink: "",
    salaryCurrency: "",
    salaryRange: "",
    location: "",
    guestPostMetaData: {
      companyName: "",
      companyEmail: "",
      companyUrl: "",
    },
    jobType: "",
    jobCategory: "",
  };
  const [job, setJob] = useState(intialJobValue);
  const {
    title,
    description,
    deadline,
    minimumExperience,
    applicationLink,
    salaryCurrency,
    salaryRange,
    location,
    guestPostMetaData: { companyName, companyEmail, companyUrl },
    jobType,
    jobCategory,
  } = job;

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setJob((prevJob) => ({
        ...prevJob,
        [name]: value,
      }));
    },
    [setJob]
  );

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-slate-700 text-xl font-bold">Job Posting</h6>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>
          <h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
            Job Details
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="title"
                  value={title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="applicationLink"
                >
                  Application Link
                </label>
                <input
                  type="email"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="applicationLink"
                  value={applicationLink}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="minimumExperience"
                >
                  Minimum Experience
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="minimumExperience"
                  value={minimumExperience}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="salaryRange"
                >
                  Salary Range
                </label>
                <input
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="salaryRange"
                  value={salaryRange}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="salaryCurrency"
                >
                  Salary Currency
                </label>
                <input
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="salaryCurrency"
                  value={salaryCurrency}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <input
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="location"
                  value={location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="jobType"
                >
                  Job Type
                </label>

                <select
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="jobType"
                  value={jobType}
                  onChange={handleInputChange}
                >
                  <option value="">Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="jobCategory"
                >
                  Job Category
                </label>

                <select
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="jobCategory"
                  value={jobCategory}
                  onChange={handleInputChange}
                >
                  <option value="">Job Category</option>
                  <option value="product-management">Product Management</option>
                  <option value="software-development">
                    Software Development
                  </option>
                </select>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="deadline"
                >
                  Deadline
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="deadline"
                  value={deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="description"
                  value={description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-slate-300" />

          <h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
            Company Information
          </h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="companyName"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="companyName"
                  value={companyName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="companyEmail"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="companyEmail"
                  value={companyEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="w-full lg:w-4/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-slate-600 text-xs font-bold mb-2"
                  htmlFor="companyUrl"
                >
                  Company Url
                </label>
                <input
                  type="text"
                  className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  name="companyUrl"
                  value={companyUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="my-4">
            <button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
