import Loader from "components/Loader";
import Table from "components/Table";
import React from "react";
import { useQuery } from "react-query";
import { getTestimonials } from "services";
import { testimonials as header } from "utils/headers";

const Testimonials = () => {
	const { isLoading, isSuccess, data } = useQuery(
		"testimonials",
		getTestimonials
	);
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				isSuccess &&
				data && (
					<div className="flex flex-w w-full">
						<div className="w-full px-4">
							<Table
								tableData={data}
								tableHead="Testimonials"
								headers={header}
								actions={["view", "edit"]}
								addNew
							/>
						</div>
					</div>
				)
			)}
		</>
	);
};

export default Testimonials;
