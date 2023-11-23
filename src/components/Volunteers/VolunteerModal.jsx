import React, { useState } from "react";
import { useQuery } from "react-query";
import { getVolunteerRequest } from "services";
import Modal from "components/Modal";
import Loader from "components/Loader";
import "react-datepicker/dist/react-datepicker.css";

const VolunteerModal = ({ isOpen, handleModal, id }) => {
	const initialValues = {
		fullName: "",
		purpose: "",
		email: "",
		volunteerRole: "",
		currentRole: "",
	};
	const [volunteer, setVolunteer] = useState(initialValues);
	const { fullName, purpose, email, volunteerRole, currentRole } = volunteer;
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
									value={fullName}
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
						</div>
					</form>
				)}
			</Modal>
		</>
	);
};

export default VolunteerModal;
