import React from "react";
import { Switch, Route } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";
// views
import Dashboard from "views/admin/Dashboard.js";
import Settings from "views/admin/Settings.js";
import TeamList from "views/admin/Teams";
import PartnersList from "views/admin/Partners";
import TalentRequestList from "views/admin/TalentRequest";
import Reach from "views/admin/Reach";
import SuccessStories from "views/admin/SuccessStories";
import Events from "views/admin/Events";
import Enquiries from "views/admin/Enquiries";
import Testimonials from "views/admin/Testimonials";
import School from "views/admin/Academy/school";
import SchoolPrograms from "views/admin/Academy/school-programs";
import Courses from "views/admin/Academy/course";
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
import { paths } from "utils";
import JobDetails from "views/admin/Jobs/JobDetails";
import Companies from "views/admin/Companies";
import EditCompany from "views/admin/Companies/EditCompany";
import CompanyDetails from "views/admin/Companies/CompanyDetails";
import Initiatives from "views/admin/Initiatives";
import Protected from "components/Protected";
import Chapters from "views/admin/Chapters";
import Programs from "views/admin/Program";

export default function Admin() {
	return (
		<Protected>
			<Sidebar />
			<div className="relative md:ml-64 bg-slate-100 min-h-screen flex flex-col">
				<AdminNavbar /> {/* Header */}
				<HeaderStats />
				<div className="px-4 flex md:px-10 mx-auto w-full -mt-20 mb-12">
					<Switch>
						<Route path={paths.dashboard} exact component={Dashboard} />
						<Route path={paths.settings} exact component={Settings} />
						<Route path={paths.team} exact component={TeamList} />
						<Route path={paths.partners} exact component={PartnersList} />
						<Route path={paths.reach} exact component={Reach} />
						<Route
							path={paths.talentRequest}
							exact
							component={TalentRequestList}
						/>
						<Route
							path={paths.successStories}
							exact
							component={SuccessStories}
						/>
						<Route path={paths.events} exact component={Events} />
						<Route path={paths.initiatives} exact component={Initiatives} />
						<Route path={paths.chapter} exact component={Chapters} />
						<Route path={paths.programs} exact component={Programs} />
						<Route path={paths.enquiries} exact component={Enquiries} />
						<Route path={paths.testimonials} exact component={Testimonials} />
						<Route path={paths.courses} exact component={Courses} />
						<Route path={paths.schools} exact component={School} />
						<Route
							path={paths.schoolPrograms}
							exact
							component={SchoolPrograms}
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
						{/* <Redirect from = "/admin"
        to = "/admin/dashboard" /> */}
					</Switch>
				</div>
				<FooterAdmin />
			</div>
		</Protected>
	);
}
