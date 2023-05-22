import Loader from "components/Loader";
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useParams, Link } from "react-router-dom";
import { getTeamMember } from "services";
import { AiOutlineTeam } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { paths } from "utils";
import Modal from "components/Modal";
import { publishTeamMember } from "services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewMember = () => {
	const [member, setMember] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [action, setAction] = useState("");
	const { id, cat: catId } = useParams();
	const response = useQuery(["member", id], () => getTeamMember(catId, id));
	const publish = useMutation(publishTeamMember, {
		onSuccess: () => {
			console.log("success");
		},
		onError: () => {
			toast("Error");
		},
	});
	useEffect(() => {
		if (response.isSuccess) {
			setMember(response.data);
		}
	}, [response]);

	const publishMember = async () => {
		console.log(catId, id);
		const data = await publish.mutateAsync({ catId: catId, id: id });
		console.log(data);
	};
	const archiveMember = () => {
		console.log("archive");
	};

	const handleSubmit = () => {
		if (action === "publish") {
			publishMember();
		} else if (action === "archive") {
			archiveMember();
		}
	};

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className="container mx-auto px-4">
				{response.isLoading ? (
					<Loader />
				) : (
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
						<div className="px-6">
							<div className="flex w-full mt-3 items-center justify-between">
								<Link to={paths.team}>
									<BsArrowLeft size="1rem" />
								</Link>
								<div className="flex">
									<button
										className="text-white bg-pink-500 px-4 py-1 mr-2 rounded"
										onClick={() => {
											setAction("publish");
											handleModal();
										}}>
										Publish
									</button>
									<button
										className="bg-slate-600 text-white px-4 py-1 rounded"
										onClick={() => {
											setAction("archive");
											handleModal();
										}}>
										Archive
									</button>
								</div>
							</div>
							<div className="text-center mt-6">
								<div className="flex w-full justify-center">
									<img
										src={member?.image}
										alt={member?.name}
										className="w-20 h-20 rounded-full"
									/>
								</div>
								<h3 className="text-2xl font-semibold leading-normal text-slate-700 mb-2">
									{member?.name}
								</h3>
								<div className="mb-2 text-slate-600">
									<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
									{member?.role || "N/A"}
								</div>
								<div className="mb-2 text-slate-600 flex items-center justify-center">
									<AiOutlineTeam size="1.25rem" />
									<p className="ml-2">{member?.team.name}</p>
								</div>
							</div>
							<div className="mt-5 py-10 border-t border-slate-200 text-center">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-9/12 px-4">
										<p className="mb-4 text-lg leading-relaxed text-slate-700">
											{member?.bio}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<Modal isOpen={isOpen} title="Team Member" onClose={handleModal}>
				<div>
					<div>
						<p>Are you sure you want to?</p>
					</div>
					<div className="flex justify-center mt-3">
						<button
							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
							onClick={handleSubmit}>
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
			<ToastContainer />
		</>
	);
};

export default ViewMember;
