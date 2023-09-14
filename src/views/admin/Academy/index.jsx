import React from "react";
import SchoolPrograms from "./school-programs";
import School from "./school";
import Course from "./course";

const Academy = () => {
	return (
		<div className="w-full grid self-start py-5 gap-y-20 z-40">
			<div className="w-full bg-white rounded-md">
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
	);
};

export default Academy;
