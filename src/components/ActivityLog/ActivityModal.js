import React from "react";
import Modal from "components/Modal";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";
import moment from "moment";

const ActivityLogModal = ({ isOpen, handleModal, activityLogDetails }) => {
	const {
		user,
		action,
		page,
		createdAt,
		updatedAt,
        oldDoc,
        newDoc,
	} = activityLogDetails;
	const inputClass = `px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm focus:ring !py-3 w-full basis-9/12`;

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleModal}
				title="Activity Log Details"
				className="!max-w-3xl">
				{!activityLogDetails ? (
					<Loader />
				) : (
					<form className="w-full px-4 md:px-8">
						<div className="flex flex-col w-full">
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="firstName">
									User First Name
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="firstName"
									value={user.firstName}
									disabled
								/>
							</div>
                            <div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="lastname">
									User Last Name
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="lastName"
									value={user.lastName}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="page">
									Page
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="page"
									value={page}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="action">
									Action
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="action"
									value={action}
									disabled
								/>
							</div>
                            {oldDoc != null ? (
                                <div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="oldDoc">
									Old Doc
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="oldDoc"
									value={oldDoc.name}
									disabled
								/>
							</div>
                            ) : (
                                <div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="oldDoc">
									Old Doc
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="oldDoc"
									value="N/A"
									disabled
								/>
							</div>
                            )}
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="newDoc">
									New Doc
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="newDoc"
									value={newDoc.name}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="updatedat">
									Created At
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="createdAt"
									value={moment(createdAt).format("DD MMM, YYYY")}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="updatedat">
									Updated At
								</label>
								<input
									type="text"
									className={`${inputClass}`}
									name="updatedAt"
									value={moment(updatedAt).format("DD MMM, YYYY")}
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

export default ActivityLogModal;