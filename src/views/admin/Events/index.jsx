import Table from "components/Table";
import React from "react";

const tableData = [
	{
		id: "6322e1dd7337240761f274cc",
		title: "Meet and Code",
		description:
			"A collaboration of coders and painters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		state: "draft",
		image:
			"https://ik.imagekit.io/gcrrtxwk5/SCA_WEBSITE_V3/STAGING/EVENTS/meet_and_code.png",
		eventDate: "2022-05-15T00:00:00.000Z",
		link: "http://new.com",
		createdAt: "2022-09-15T08:27:09.877Z",
		updatedAt: "2022-09-15T08:27:09.877Z",
	},
	{
		id: "6322e2f67337240761f274d0",
		title: "SCA Chapter Fest",
		description:
			"Meet and greet of all SCA chapters. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		state: "draft",
		image:
			"https://ik.imagekit.io/gcrrtxwk5/SCA_WEBSITE_V3/STAGING/EVENTS/sca_chapter_fest.jpeg",
		eventDate: "2022-12-15T00:00:00.000Z",
		link: "http://new.com",
		createdAt: "2022-09-15T08:31:50.213Z",
		updatedAt: "2022-09-15T08:31:50.213Z",
		__v: 0,
	},
	// Add more objects for more rows
];

const Events = () => {
	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full px-4">
					<div>
						<h1>Events</h1>
						<button>Add New Event</button>
					</div>
					<Table
						tableData={tableData}
						tableHead="Events"
						addNew="addNewEvent"
						showActions="true"
						edit="editEvent"
						view="viewEvent"
					/>
				</div>
			</div>
		</>
	);
};

export default Events;
