import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { paths } from "utils";

const JobCard = ({ id, title, createdAt, location }) => {
	return (
		<Link to={`${paths.viewJob}/${id}`}>
			<div className="border rounded-xl px-4 shadow py-4 flex flex-col hover:cursor-pointer">
				<p className="font-medium">{title}</p>
				<div className="flex items-center justify-between text-[10px] my-[6px]">
					<p>{moment(createdAt).fromNow()}</p>
					<p>{location}</p>
				</div>
			</div>
		</Link>
	);
};

export default JobCard;
