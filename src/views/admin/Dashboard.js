import React from "react";

// components


import CardPageActivity from "components/Cards/CardPageActivity.js";

export default function Dashboard () {
  return (
    <>

      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-12 mb-12 xl:mb-0 px-4">
          <CardPageActivity />
        </div>
        {/* <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div> */}
      </div>
    </>
  );
}
