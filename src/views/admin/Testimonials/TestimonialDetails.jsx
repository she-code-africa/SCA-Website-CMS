import Loader from "components/Loader";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import { AiOutlineTeam } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { paths } from "utils";
import { getTestimonial } from "services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TestimonialDetails = () => {
	const [testimonial, setTestimonial] = useState();
	const [loading, setLoading] = useState(false);
	const { id, cat: catId } = useParams();
	const response = useQuery(["testimonial", id], () => getTestimonial(id));

	useEffect(() => {
		if (response.isSuccess) {
			setTestimonial(response.data);
		}
	}, [response]);

	return (
		<>
			<div className="container mx-auto px-4">
				{response.isLoading || loading ? (
					<Loader />
				) : (
					<>
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
							<div className="px-6">
								<div className="flex w-full mt-3 items-center justify-between">
									<Link to={paths.testimonials}>
										<BsArrowLeft size="1rem" />
									</Link>
								</div>
								<div className="text-center mt-6">
									<div className="flex w-full justify-center">
										<img
											src={testimonial?.image}
											alt={`${testimonial?.firstName} ${testimonial?.lastName}`}
											className="w-20 h-20 rounded-full"
										/>
									</div>
									<h3 className="text-2xl font-semibold leading-normal text-slate-700 mb-2">
										{`${testimonial?.firstName} ${testimonial?.lastName}`}
									</h3>
									<div className="mb-2 text-slate-600">
										{testimonial?.state}
									</div>
								</div>
								<div className="mt-5 py-10 border-t border-slate-200 text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full lg:w-9/12 px-4">
											<p className="mb-4 text-lg leading-relaxed text-slate-700">
												{testimonial?.testimony}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
			<ToastContainer />
		</>
	);
};

export default TestimonialDetails;
