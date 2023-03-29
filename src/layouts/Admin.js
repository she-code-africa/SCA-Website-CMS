import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";

import { TeamList, AddMember, EditMember } from "views/admin/Teams";
import {
	VolunteerList,
	AddVolunteer,
	EditVolunteer,
} from "views/admin/Volunteers/VolunteerMembers";
import {
	VolunteerCategoryList,
	AddVolunteerCategory,
	EditVolunteerCategory,
} from "views/admin/Volunteers/VolunteerCategory";
import Jobs from "views/admin/Jobs/Jobs";
import AddJob from "views/admin/Jobs/AddJob";
import EditJob from "views/admin/Jobs/EditJob";
import { PartnersList, AddPartner, EditPartner } from "views/admin/Partners";
import { paths } from "utils";
import JobDetails from "views/admin/Jobs/JobDetails";
import Companies from "views/admin/Companies";
import EditCompany from "views/admin/Companies/EditCompany";
import CompanyDetails from "views/admin/Companies/CompanyDetails";
import Events from "views/admin/Events";
import EditEvent from "views/admin/Events/EditEvent";
import EventDetails from "views/admin/Events/EventDetails";
import AddEvent from "views/admin/Events/AddEvent";

export default function Admin() {
	return (
		<>
			<Sidebar />
			<div className="relative md:ml-64 bg-slate-100 min-h-screen flex flex-col">
				<AdminNavbar /> {/* Header */}
				<HeaderStats />
				<div className="px-4 md:px-10 mx-auto w-full -m-24">
					<Switch>
						<Route path={paths.dashboard} exact component={Dashboard} />
						<Route path={paths.settings} exact component={Settings} />
						<Route path={paths.team} exact component={TeamList} />
						<Route path={paths.addMember} exact component={AddMember} />
						<Route
							path={`${paths.editMember}/:id`}
							exact
							component={EditMember}
						/>

						<Route path={paths.allVolunteers} exact component={VolunteerList} />
						<Route path={paths.addVolunteer} exact component={AddVolunteer} />
						<Route path={paths.editVolunteer} exact component={EditVolunteer} />

						<Route
							path={paths.listVolunteerCategory}
							exact
							component={VolunteerCategoryList}
						/>
						<Route
							path={paths.addVolunteerCategory}
							exact
							component={AddVolunteerCategory}
						/>
						<Route
							path={paths.editVolunteerCategory}
							exact
							component={EditVolunteerCategory}
						/>

						<Route path={paths.jobs} exact component={Jobs} />
						<Route path={paths.addNewJob} exact component={AddJob} />
						<Route path={`${paths.editJob}/:id`} exact component={EditJob} />
						<Route path={`${paths.viewJob}/:id`} exact component={JobDetails} />

						<Route path={paths.companies} exact component={Companies} />
						<Route
							path={`${paths.editCompany}/:id`}
							exact
							component={EditCompany}
						/>
						<Route
							path={`${paths.viewCompany}/:id`}
							exact
							component={CompanyDetails}
						/>

						<Route path={paths.events} exact component={Events} />
						<Route path={paths.addNewEvent} exact component={AddEvent} />
						<Route
							path={`${paths.editEvent}/:id`}
							exact
							component={EditEvent}
						/>
						<Route
							path={`${paths.viewEvent}/:id`}
							exact
							component={EventDetails}
						/>

						<Route path={paths.partners} exact component={PartnersList} />
						<Route path={paths.addPartner} exact component={AddPartner} />
						<Route
							path={`${paths.editPartner}/:id`}
							exact
							component={EditPartner}
						/>

						{/* <Redirect from = "/admin"
        to = "/admin/dashboard" /> */}
					</Switch>
					<FooterAdmin />
				</div>
			</div>
		</>
	);
}
