import React, { useState } from "react";
import { useQuery } from "react-query";
import { getVolunteerRequest } from "services";
import Modal from "components/Modal";
import Loader from "components/Loader";
import "react-datepicker/dist/react-datepicker.css";
import Tooltip from "components/Tooltip";
import { BiArchiveIn } from "react-icons/bi";

const VolunteerModal = ({ isOpen, handleModal, id, selectedVolunteer }) => {
	const volunteer = selectedVolunteer;
	const { fullname, purpose, email, volunteerRole, currentRole } = volunteer;
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm w-full ease-linear transition-all duration-150 basis-9/12`;

	// const { isLoading } = useQuery(
	// 	["volunteer", id],
	// 	() => getVolunteerRequest(id),
	// 	{
	// 		onSuccess: (data) => {
	// 			console.log({ success: data });
	// 			setVolunteer(data);
	// 		},
	// 		onError: (data) => {
	// 			console.log({ error: data });
	// 		}
	// 	}
	// );

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Volunteer Request Details</h2>

				<div>
					<Tooltip content="Archive">
						<BiArchiveIn size="1.25rem" />
					</Tooltip>
				</div>
			</div>
		);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleModal}
				header={header}
				className="!max-w-3xl">
				<form className="w-full px-4 md:px-8">
					<div className="flex flex-col w-full gap-y-3">
						<div className="relative w-full mb-3 flex items-center ">
							<label
								className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
								htmlFor="fullName">
								Full Name
							</label>
							<input
								required
								type="text"
								className={`${inputClass}`}
								name="fullName"
								value={fullname}
								disabled
							/>
						</div>

						<div className="relative w-full mb-3 flex items-center ">
							<label
								className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
								htmlFor="email">
								Email
							</label>
							<input
								required
								type="text"
								className={`${inputClass}`}
								name="email"
								value={email}
								disabled
							/>
						</div>

						<div className="relative w-full mb-3 flex items-center ">
							<label
								className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
								htmlFor="currentRole">
								Current Role
							</label>
							<input
								className={`${inputClass}`}
								name="currentRole"
								value={currentRole}
								rows={8}
								disabled
							/>
						</div>

						<div className="relative w-full mb-3 flex items-center ">
							<label
								className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
								htmlFor="volunteerRole">
								Volunteer Role
							</label>
							<input
								className={`${inputClass}`}
								name="volunteerRole"
								value={volunteerRole}
								rows={8}
								disabled
							/>
						</div>

						<div className="relative w-full mb-3 flex items-center ">
							<label
								className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
								htmlFor="purpose">
								Purpose
							</label>
							<textarea
								className={`${inputClass}`}
								name="purpose"
								value={purpose}
								rows={8}
								disabled
							/>
						</div>
						<div className="flex gap-10">
							<button
								className="bg-green-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
								onClick={() => {
									handleModal();
								}}>
								Approve
							</button>
							<button
								className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
								onClick={() => {
									handleModal();
								}}>
								Reject
							</button>
						</div>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default VolunteerModal;
