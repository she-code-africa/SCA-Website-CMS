import React from "react";

// components

export default function CardPageVisits() {
    return ( < >
        <div className = "relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded" >
        <div className = "rounded-t mb-0 px-4 py-3 border-0" >
        <div className = "flex flex-wrap items-center" >
        <div className = "relative w-full px-4 max-w-full flex-grow flex-1" >
        <h3 className = "font-semibold text-base text-slate-700" >
        Recent Activity Log </h3> </ div > </div> </ div > <div className = "block w-full overflow-x-auto" > {/* Projects table */ }
         <table className = "items-center w-full bg-transparent text-sm border-collapse" >
        <thead >
        <tr >
        <th className = "px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3   uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" >
        Page name </th> <th className = "px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3   uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" >
        User </th> <th className = "px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3   uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left" >
        Activity </th> </ tr > </thead> <tbody >
        <tr >
        <th className = "border-t-0 px-6 align-middle border-l-0 border-r-0   whitespace-nowrap p-4 text-left" >
        dashboard </th> <td className = "border-t-0 px-6 align-middle border-l-0 border-r-0   whitespace-nowrap p-4" >
        Mary Jane </td> <td className = "border-t-0 px-6 align-middle border-l-0 border-r-0   whitespace-nowrap p-4" >
        Login </td> </ tr > </tbody> </ table > </div> </ div > </>
    );
}