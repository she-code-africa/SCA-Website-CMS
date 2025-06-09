import { faOsi } from "@fortawesome/free-brands-svg-icons";
import {
	faTableColumns,
	faPeopleGroup,
	faHandHoldingHeart,
	faUsersViewfinder,
	faPersonCircleQuestion,
	faComment,
	faPeopleRoof,
	faCalendar,
	faBuilding,
	faHandsPraying,
	faBriefcase,
	faHandshake,
	faSchoolFlag,
	faClipboard,
} from "@fortawesome/free-solid-svg-icons";
export const routes = [
	{
		name: "dashboard",
		label: "Dashboard",
		icon: faTableColumns,
		path: "/admin/dashboard",
	},
	{
		name: "team",
		label: "Team",
		icon: faPeopleGroup,
		path: "/admin/team",
	},
	{
		name: "volunteers",
		label: "Volunteers",
		icon: faHandHoldingHeart,
		path: "/admin/volunteer",
	},
	{
		name: "talent",
		label: "Talent Request",
		icon: faUsersViewfinder,
		path: "/admin/talent-request",
	},
	{
		name: "enquiries",
		label: "Enquiries",
		icon: faPersonCircleQuestion,
		path: "/admin/enquiries",
	},
	{
		name: "testimonials",
		label: "Testimonials",
		icon: faComment,
		path: "/admin/testimonials",
	},
	{
		name: "chapters",
		label: "Chapters",
		icon: faPeopleRoof,
		path: "/admin/chapters",
	},
	{
		name: "reports",
		label: "Reports",
		icon: faClipboard,
		path: "/admin/reports",
	},
	// {
	// 	name: "stories",
	// 	label: "Success Stories",
	// 	icon: faMedal,
	// 	path: "/admin/success-stories",
	// },
	{
		name: "events",
		label: "Events",
		icon: faCalendar,
		path: "/admin/events",
	},
	{
		name: "stem-a-girl",
		label: "Stem a Girl",
		icon: faCalendar,
		path: "/admin/stem-a-girl/schools",
		items: [
			{
				name: "schools",
				label: "Schools",
				path: "/admin/stem-a-girl/schools",
			},
			{
				name: "courses",
				label: "Courses",
				path: "/admin/stem-a-girl/courses",
			},
			{
				name: "activities",
				label: "Activities",
				path: "/admin/stem-a-girl/activities",
			},
			// {
			// 	name: "enquiries",
			// 	label: "Enquiries",
			// 	path: "/admin/stem-a-girl/enquiries",
			// },
			{
				name: "events",
				label: "Events",
				path: "/admin/stem-a-girl/events",
			},
			{
				name: "impact-stories",
				label: "Impact Stories",
				path: "/admin/stem-a-girl/impact-stories",
			},
			{
				name: "testimonials",
				label: "Testimonials",
				path: "/admin/stem-a-girl/testimonials",
			},
		],
	},
	{
		name: "academy",
		label: "Academy",
		icon: faSchoolFlag,
		path: "/admin/academy/schools",
		items: [
			{
				name: "schools",
				label: "Schools",
				path: "/admin/academy/schools",
			},
			{
				name: "school-programs",
				label: "School Programs",
				path: "/admin/academy/school-programs",
			},
			{
				name: "courses",
				label: "Courses",
				path: "/admin/academy/courses",
			},
		],
	},
	{
		name: "initiatives",
		label: "Initiatives",
		icon: faOsi,
		path: "/admin/initiatives",
	},

	{
		name: "partners",
		label: "Partners/Sponsors",
		icon: faHandshake,
		path: "/admin/partners",
	},
	{
		name: "jobs",
		label: "Jobs",
		icon: faBriefcase,
		path: "/admin/jobs",
	},
	{
		name: "reach",
		label: "Our Reach",
		icon: faHandsPraying,
		path: "/admin/reach",
	},
	{
		name: "companies",
		label: "Companies",
		icon: faBuilding,
		path: "/admin/companies",
	},
];
