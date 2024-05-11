import React, { useState } from "react";
import Modal from "components/Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input, InputGroup, Select, Textarea } from "components/Base";
import useEnquiriesModal from "./useEnquiriesModal";

const EnquiriesModal = ({ isOpen, handleModal, id, canDelete }) => {
	const {
		enquiry,
		edit,
		setEdit,
		isLoading,
		handleSubmit,
		updating,
		handleInputChange,
		handleStatusSelect,
	} = useEnquiriesModal({ id, handleModal });
	const { fullName, email, description, link, isAvailable, status } = enquiry;

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Enquiry Details</h2>
				<div className="flex items-center gap-3 hover:cursor-pointer">
					<div onClick={() => setEdit(!edit)}>
						{edit ? (
							<Tooltip content="View">
								<GrView size="1.25rem" />
							</Tooltip>
						) : (
							<Tooltip content="Edit">
								<MdOutlineModeEditOutline size="1.125rem" />
							</Tooltip>
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			{isOpen && (
				<Modal
					isOpen={isOpen}
					onClose={handleModal}
					header={header}
					className="!max-w-3xl">
					{isLoading ? (
						<Loader />
					) : (
						<form className="w-full px-4 md:px-8">
							<div className="flex flex-col w-full gap-y-5 min-h-[300px]  justify-center">
								<InputGroup>
									<Input
										label="Full Name"
										name="fullName"
										onChange={handleInputChange}
										value={fullName}
										disabled
									/>
								</InputGroup>
								<InputGroup>
									<Input
										label="Email"
										name="email"
										type="email"
										value={email}
										onChange={handleInputChange}
										disabled
									/>
								</InputGroup>

								<InputGroup>
									<Select
										label="Status"
										value={status}
										name="status"
										onChange={handleStatusSelect}
										options={[
											{
												_id: "open",
												name: "Open",
											},

											{
												_id: "close",
												name: "Close",
											},
										]}
										disabled={!edit}
									/>
								</InputGroup>

								<InputGroup>
									<Textarea
										name="description"
										value={description}
										onChange={handleInputChange}
										disabled
										label="Description"
									/>
								</InputGroup>
							</div>

							{edit && (
								<div className="my-4 w-full flex">
									<button
										className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
										onClick={handleSubmit}>
										{updating ? (
											<AiOutlineLoading3Quarters className="animate-spin" />
										) : (
											"SUBMIT"
										)}
									</button>
								</div>
							)}
						</form>
					)}
					<ToastContainer />
				</Modal>
			)}
		</>
	);
};

export default EnquiriesModal;
