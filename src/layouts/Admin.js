import React from "react";
import { Routes as Switch, Route, Navigate } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";
import { TeamList, AddTeamMember, EditTeamMember } from "views/admin/Teams/TeamMembers";
import { CategoryList, AddTeamCategory, EditTeamCategory } from "views/admin/Teams/TeamsCategory"

import { paths } from 'utils'


export default function Admin () {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path={paths.dashboard} element={Dashboard} />
            <Route path={paths.settings} element={Settings} />
            <Route path={paths.allTeam} element={TeamList} />
            <Route path={paths.addMember} element={AddTeamMember} />
            <Route path={paths.editMember} element={EditTeamMember} />

            <Route path={paths.listTeamCategory} element={CategoryList} />
            <Route path={paths.addTeamCategory} element={AddTeamCategory} />
            <Route path={paths.editTeamCategory} element={EditTeamCategory} />
            <Route path="/admin" element={<Navigate replace to="/admin/dashboard" />} />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
