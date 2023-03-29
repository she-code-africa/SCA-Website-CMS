import React from "react";

const JobDetails = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-64">
          <div className="px-6">
            <div className="text-center mt-12">
              <h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
                Software Developer
              </h3>
              <div className="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold uppercase">
                <i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
                Remote
              </div>
              <div className="mb-2 text-slate-600 mt-10">
                <i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
                Solution Manager - Creative Tim Officer
              </div>
              <div className="mb-2 text-slate-600">
                <i className="fas fa-university mr-2 text-lg text-slate-400"></i>
                University of Computer Science
              </div>
            </div>
            <div className="mt-10 py-10 border-t border-slate-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <p className="mb-4 text-lg leading-relaxed text-slate-700">
                    An artist of considerable range, Jenna the name taken by
                    Melbourne-raised, Brooklyn-based Nick Murphy writes,
                    performs and records all of his own music, giving it a warm,
                    intimate feel with a solid groove structure. An artist of
                    considerable range.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetails;
