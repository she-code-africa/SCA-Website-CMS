import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getSchoolProgram } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import Loader from "components/Loader";
import { publishSchoolProgram } from "services";
import { unpublishSchoolProgram } from "services";
import Modal from "components/Modal";
import { Link } from "react-router-dom";
import { paths } from "utils";

const SchoolProgramDetails = () => {
	const [schoolProgram, setSchoolProgram] = useState({});
	const [isOpen, setIsOpen] = useState(false);

	const queryClient = useQueryClient();
	const { id } = useParams();
	const { isLoading } = useQuery(
		["school-program", id],
		() => getSchoolProgram(id),
		{
			onSuccess: (data) => {
				setSchoolProgram(data);
			},
		}
	);

	const { mutateAsync: publish } = useMutation(publishSchoolProgram, {
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["school-program"] });
			setIsOpen(false);
		},
	});

	const { mutateAsync: unpublish } = useMutation(unpublishSchoolProgram, {
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["school-program"] });
			setIsOpen(false);
		},
	});

	const handlePublish = async () => {
		schoolProgram.state === "published"
			? await unpublish(schoolProgram._id)
			: await publish(schoolProgram._id);
	};

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className="self-start z-10 bg-white shadow-sm rounded-xl py-4 w-full">
				<div className="px-4">
					<Link to={paths.academy}>
						<i className="fas fa-arrow-left"></i> Back
					</Link>
				</div>
				<div className="w-full flex justify-center border-b px-4 pb-2">
					<img
						src={schoolProgram?.image}
						alt={schoolProgram?.title}
						className="h-fit max-w-[8rem]"
					/>
				</div>
				<div className="flex items-center justify-between px-4 my-4">
					<h6 className="text-lg font-medium">{schoolProgram?.title}</h6>
					<div>
						<button
							className="bg-slate-500 px-4 py-2 rounded text-sm text-white"
							onClick={handleModal}>
							{schoolProgram?.state === "published" ? `Unpublish` : `Publish`}
						</button>
					</div>
				</div>
				{isLoading ? (
					<Loader />
				) : (
					<div className="px-4">
						<div className="text-sm mb-5">
							<div>
								<p>Cohort : {schoolProgram?.cohort}</p>
								<p>
									Created :{" "}
									{moment(schoolProgram?.createdAt).format("DD/MM/YYYY")}
								</p>
								<p>
									Published :{" "}
									{schoolProgram?.publishDate
										? moment(schoolProgram?.createdAt).format("DD/MM/YYYY")
										: "---"}
								</p>
							</div>
						</div>
						<div>
							<p className="text-sm font-medium my-2">Description</p>
							<p>{schoolProgram?.extendedContent}</p>
						</div>
					</div>
				)}
			</div>
			<Modal
				isOpen={isOpen}
				title={`${
					schoolProgram.state === "published" ? "Unpublish" : "Publish"
				} School Program`}
				onClose={handleModal}>
				<div>
					<div>
						<p>
							Are you sure you want to {""}
							{`${
								schoolProgram.state === "published" ? "unpublish" : "publish"
							}`}
							{""} this school program?
						</p>
					</div>
					<div className="flex justify-center mt-3">
						<button
							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
							onClick={handlePublish}>
							Yes
						</button>
						<button
							className="bg-slate-600 px-4 py-1 text-white rounded"
							onClick={handleModal}>
							No
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default SchoolProgramDetails;
