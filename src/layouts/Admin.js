import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";
import {
  TeamList,
  AddTeamMember,
  EditTeamMember,
} from "views/admin/Teams/TeamMembers";
import {
  CategoryList,
  AddTeamCategory,
  EditTeamCategory,
} from "views/admin/Teams/TeamsCategory";
import Jobs from "views/admin/Jobs/Jobs";
import AddJob from "views/admin/Jobs/AddJob";
import JobTypeCategories from "views/admin/Jobs/JobTypeCategories";

import { paths } from "utils";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-slate-100 min-h-screen flex flex-col">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path={paths.dashboard} exact component={Dashboard} />
            <Route path={paths.settings} exact component={Settings} />
            <Route path={paths.allTeam} exact component={TeamList} />
            <Route path={paths.addMember} exact component={AddTeamMember} />
            <Route path={paths.editMember} exact component={EditTeamMember} />

            <Route
              path={paths.listTeamCategory}
              exact
              component={CategoryList}
            />
            <Route
              path={paths.addTeamCategory}
              exact
              component={AddTeamCategory}
            />
            <Route
              path={paths.editTeamCategory}
              exact
              component={EditTeamCategory}
            />

            <Route path={paths.jobs} exact component={Jobs} />
            <Route path={paths.addNewJob} exact component={AddJob} />
            <Route
              path={paths.jobTypeCategories}
              exact
              component={JobTypeCategories}
            />

            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          {/* <FooterAdmin /> */}
        </div>
      </div>
    </>
  );
}
