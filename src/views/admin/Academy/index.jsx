import React from "react";
import SchoolPrograms from "./school-programs";
import School from "./school";
import { useHistory } from "react-router-dom";
import Course from "./course";

const Academy = () => {
	const history = useHistory();
	const { pathname } = history.location;
	console.log(pathname);
	return (
		<div className="w-full self-start mt-20 py-5">
			<div
				className="grid w-full gap-5
			">
				<div className="w-full">
					<SchoolPrograms />
				</div>
				<div className="grid grid-cols-12 gap-5 w-full">
					<div className="col-span-9">
						<Course />
					</div>
					<div className="col-span-3">
						<School />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Academy;
