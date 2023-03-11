import React from "react";

import { Link } from "react-router-dom"


// components


// utils
import { paths } from "utils"

const AddVolunteer = () => {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"}>
            
            <div className="rounded-t mb-0 px-4 py-3 flex justify-between">
              <p>Add Volunteer</p>

              <Link to={paths.allVolunteers}>
                Back
              </Link>
             
            </div>
            <form className="px-4 py-3">
              <div className="w-full my-3">
                <label className="block uppercase text-slate-600 text-xs font-bold my-2" htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                  placeholder="First Name"
                  id="first_name"
                />
              </div>
              <div className="w-full my-3">
                <label className="block uppercase text-slate-600 text-xs font-bold my-2" htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                  placeholder="Last Name"
                  id="last_name"
                />
              </div>
              <div className="w-full my-3">
                <label className="block uppercase text-slate-600 text-xs font-bold my-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                  placeholder="Email"
                  id="email"
                />
              </div>

              <div className="text-center my-4 w-6/12 mx-auto">
                <input type="submit" className="text-center bg-pink-500 py-2 px-4 rounded cursor-pointer text-white text-sm font-semibold block w-full uppercase" value="Add Volunteer" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddVolunteer