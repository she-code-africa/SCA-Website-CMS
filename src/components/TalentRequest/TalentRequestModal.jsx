import React from "react";
import Modal from "components/Modal";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";

const TalentRequestModal = ({ isOpen, handleModal, talentRequest }) => {
	const {
		fullname,
		company,
		companyLink,
		email,
		experienceLevel,
		jobRole,
		jobDescription,
	} = talentRequest;
	const inputClass = `px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm focus:ring !py-3 w-full basis-9/12`;

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleModal}
				title="Talent Request Details"
				className="!max-w-3xl">
				{!talentRequest ? (
					<Loader />
				) : (
					<form className="w-full px-4 md:px-8">
						<div className="flex flex-col w-full">
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="fullname">
									Full Name
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="fullname"
									value={fullname}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="email">
									Email
								</label>
								<input
									type="email"
									className={`${inputClass}`}
									name="email"
									value={email}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="experienceLevel">
									ExperienceLevel
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="experienceLevel"
									value={experienceLevel}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="jobRole">
									Job Role
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="jobRole"
									value={jobRole}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="company">
									Company
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="company"
									value={company}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="companyLink">
									Company Link
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="companyLink"
									value={companyLink}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="jobDescription">
									Job Description
								</label>
								<textarea
									type="text"
									className={`${inputClass}`}
									name="jobDescription"
									value={jobDescription}
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

export default TalentRequestModal;
