import React from "react";

// components

import CardPageActivity from "components/Cards/CardPageActivity.js";
import CardTable from "components/Cards/CardTable";

export default function Dashboard() {
    return ( <>
        <div className = "flex flex-wrap mt-4">
        <div className = "w-full mb-12 xl:mb-0 px-4">
        <CardPageActivity /> 
        { /* <CardTable /> */ } 
        </div> {
        /* <div className="w-full xl:w-4/12 px-4">
                  <CardSocialTraffic />
                </div> */
    } </div> </>
);
}