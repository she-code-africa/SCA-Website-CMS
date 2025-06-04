import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { getVolunteerRequest, updateVolunteerStatus, getVolunteerRequests } from "services";
import Modal from "components/Modal";
import Loader from "components/Loader";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

const VolunteerModal = ({ isOpen, handleModal, id }) => {
	const initialValues = {
		fullName: "",
		purpose: "",
		email: "",
		volunteerRole: "",
		currentRole: "",
	};
	const [volunteer, setVolunteer] = useState(initialValues);
	const { fullname, purpose, email, volunteerRole, currentRole, status, _id } = volunteer;
	const [statusValue, setStatusValue] = useState(status);
	const [showBtn, setShowBtn] = useState(false)

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm w-full ease-linear transition-all duration-150 basis-9/12`;

	const { isLoading } = useQuery(
		["volunteer", id],
		() => getVolunteerRequest(id),
		{
			onSuccess: (data) => {
				setVolunteer(data);
			},
		}
	);

	const mutation = useMutation({
		mutationFn: () => {
			return updateVolunteerStatus({ id: _id, status: statusValue });
		},
		onSuccess: () => {
			toast.success("Volunteer status updated successfully");
			handleModal();
			getVolunteerRequests();
		},
		onError: (error) => {
			toast.error("Error updating volunteer status");
		},
	})




	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Volunteer Request Details</h2>
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
				{isLoading ? (
					<Loader />
				) : (
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
									className={`${inputClass} `}
									name="currentRole"
									value={currentRole}
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
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="status">
									Status
								</label>
								<select
									type="text"
									className={`w-5/12 px-3 py-0 block text-slate-600 text-sm basis-7/12`}
									name="status"
									value={statusValue}
									autoFocus
									disabled={status === "Pending" ? false : true}
									onChange={(e) => {
										setStatusValue(e.target.value);
										setShowBtn(status === e.target.value ? false : true);
									}}
								>
									<option value="Pending">Pending</option>
									<option value="Approved">Approve</option>
									<option value="Rejected">Reject</option>
								</select>
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<p
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="purpose">
									Purpose
								</p>
								<div
									className={`${inputClass} resize-none`}>{purpose}</div>
							</div>
						</div>

						<div className="flex justify-end mt-4">
							<button
								type="button"
								className="bg-gray-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								onClick={() => {
									handleModal();
								}}>
								Close
							</button>
							{showBtn ?
								<button
									type="submit"
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
									onClick={(e) => {
										e.preventDefault();
										mutation.mutate();
									}}>
									Update Status
								</button>
								: null}

						</div>
					</form>
				)}
			</Modal>
		</>
	);
};

export default VolunteerModal;
