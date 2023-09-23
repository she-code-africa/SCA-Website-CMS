import Loader from "components/Loader";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { paths } from "utils";
import { getTestimonial } from "services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateTestimonialStatus } from "services";

const TestimonialDetails = () => {
	const [testimonial, setTestimonial] = useState();
	const queryClient = useQueryClient();
	const { id } = useParams();
	const { isLoading } = useQuery(
		["testimonial", id],
		() => getTestimonial(id),
		{
			onSuccess: (data) => {
				setTestimonial(data);
			},
			onError: () => {
				toast.error("Error fetching testimonial");
			},
		}
	);

	const { mutateAsync: updateState } = useMutation(updateTestimonialStatus, {
		onSuccess: () => {
			toast.success("Testimonial state updated successfully");
			queryClient.invalidateQueries(["testimonial"]);
		},
		onError: () => {
			toast.error("Error updating testimonial state");
		},
	});

	const handleUpdate = async () => {
		let state = testimonial.state === "published" ? "draft" : "published";
		await updateState({ id, data: { state: state } });
	};

	return (
		<>
			<div className="px-4 w-full">
				{isLoading ? (
					<div className="min-h-[200px]">
						<Loader />
					</div>
				) : (
					<>
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
							<div className="px-6 w-full">
								<div className="flex w-full mt-3 items-center justify-between">
									<Link to={paths.testimonials}>
										<BsArrowLeft size="1rem" />
									</Link>

									<div>
										<button
											onClick={handleUpdate}
											className="px-4 py-2 bg-pink-700 text-white rounded-lg">
											{testimonial.state !== "published"
												? "Publish"
												: "UnPublish"}
										</button>
									</div>
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
