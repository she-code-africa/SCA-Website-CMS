import React from "react";

import { Link } from "react-router-dom"


// components


// utils
import { paths } from "utils"

const AddTeamMember = () => {
  return (
    <>
     <div className="  relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-slate-700 text-xl font-bold">Add New Member</h6>
            
            <Link to={paths.allTeam}>
            <i class="fas fa-arrow-left"></i> Back
            </Link>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
                  <div className="flex flex-wrap py-10">
                    <div className="w-full px-4 flex justify-center">
                      <div className="relative">
                        <img
                          alt="..." title="Image"
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Blank_woman_placeholder.svg/800px-Blank_woman_placeholder.svg.png"
                          className="shadow-xl rounded-full h-auto align-middle border-none  -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                        />
                        <input type="file" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap py-10">
                 
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      <label className="block uppercase text-slate-600  font-bold my-2" htmlFor="first_name">First Name</label>
                      <input
                    type="text"
                    className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                    placeholder="First Name"
                    id="first_name"
                  />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      <label className="block uppercase text-slate-600  font-bold my-2" htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                    placeholder="Last Name"
                    id="last_name"
                  />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      <label className="block uppercase text-slate-600  font-bold my-2" htmlFor="type">Type</label>
                  <input
                    type="text"
                    className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                    placeholder="Type"
                    id="type"
                  />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      <label className="block uppercase text-slate-600  font-bold my-2" htmlFor="role">Role</label>
                  <input
                    type="text"
                    className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                    placeholder="Role"
                    id="role"
                  />
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      <label className="block uppercase text-slate-600  font-bold my-2" htmlFor="twitter">Twitter Handle</label>
                      <input
                    type="text"
                    className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                    placeholder="Enter Twitter profile url"
                    id="twitter"
                  />
                      </div>
                    </div> <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      <label className="block uppercase text-slate-600  font-bold my-2" htmlFor="instagram">Instagram Handle</label>
                      <input
                    type="text"
                    className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
                    placeholder="Enter Instagram profile url"
                    id="instagram"
                  />
                      </div>
                    </div>
                  </div>
    
                  
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-slate-600  font-bold mb-2"
                          htmlFor="bio"
                        >
                        BIO
                        </label>
                      
                        <textarea className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" cols="30" rows="10"   
                    id="bio"></textarea>
                      </div>
                    </div>
                      
                  </div>
                  <div className="text-center my-4 w-6/12 mx-auto">
                  <input type="submit" className="text-center bg-pink-500 py-2 px-4 rounded cursor-pointer text-white   font-semibold block w-full uppercase" value="Submit" />
                </div>
                  
          </form>
        </div>
      </div>
     
    </>
  );
}

export default AddTeamMember