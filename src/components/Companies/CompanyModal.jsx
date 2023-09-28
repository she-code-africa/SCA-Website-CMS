import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { editCompany, getCompany } from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { archiveCompany } from "services";
import { unarchiveCompany } from "services";

const CompanyModal = ({ isOpen, handleModal, id }) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		value: 0,
		companyName: "",
		email: "",
		companyUrl: "",
		companyPhone: "",
		companyDescription: "",
		companyLocation: "",
		contactName: "",
	};
	const [company, setCompany] = useState(intial);
	const {
		companyName,
		companyUrl,
		companyDescription,
		companyPhone,
		companyLocation,
		contactName,
		email,
		state,
	} = company;
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { isLoading, data } = useQuery(["company", id], () => getCompany(id), {
		onSuccess: (data) => {
			setCompany(data[0]);
		},
	});

	const { mutateAsync: updateCompany, isLoading: updating } = useMutation(
		editCompany,
		{
			onSuccess: () => {
				toast.success("Company updated Successfully");
				queryClient.invalidateQueries(["company"]);
				queryClient.invalidateQueries(["companies"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Company");
			},
		}
	);

	const updateCompanyDetails = async () => {
		// Compare the current company state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const [key] of Object.entries(company)) {
			if (company[key] !== data[key]) {
				updatedFields[key] = company[key];
			}
		}
		await updateCompany({ id, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setCompany((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setCompany]
	);

	const handleSubmit = async (e) => {
		e.prcompanyDefault();
		await updateCompanyDetails();
	};

	const { mutateAsync: publish } = useMutation(unarchiveCompany, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Company Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["companies"] });
			queryClient.invalidateQueries({ queryKey: ["company"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing Company");
		},
	});

	const { mutateAsync: archive } = useMutation(archiveCompany, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Company Archived Successfully");

			queryClient.invalidateQueries({ queryKey: ["companies"] });
			queryClient.invalidateQueries({ queryKey: ["company"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Archiving Company");
		},
	});

	const handleState = async () => {
		setLoading(true);
		state === "active" ? await archive(id) : await publish(id);
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Company Details</h2>

				<div className="flex items-center gap-3 hover:cursor-pointer">
					<div onClick={handleState}>
						{loading ? (
							<AiOutlineLoading3Quarters className="animate-spin" />
						) : state === "active" ? (
							<Tooltip content="Archive">
								<BiArchiveIn size="1.25rem" />
							</Tooltip>
						) : (
							<Tooltip content="Publish">
								<BiArchiveOut size="1.25rem" />
							</Tooltip>
						)}
					</div>
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
			<Modal
				isOpen={isOpen}
				onClose={handleModal}
				header={header}
				className="!max-w-3xl">
				{isLoading ? (
					<Loader />
				) : (
					<form className="w-full px-4 md:px-8">
						<div className="flex flex-col w-full gap-y-5">
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="companyName">
									Company Name
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="companyName"
									value={companyName}
									onChange={handleInputChange}
									disabled={!edit}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="email">
									Email
								</label>
								<input
									required
									type="email"
									className={`${inputClass}`}
									name="email"
									value={email}
									onChange={handleInputChange}
									disabled={!edit}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="companyUrl">
									Company Url
								</label>
								<input
									required
									type="url"
									className={`${inputClass}`}
									name="companyUrl"
									value={companyUrl}
									onChange={handleInputChange}
									disabled={!edit}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="companyLocation">
									Company Location
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="companyLocation"
									value={companyLocation}
									onChange={handleInputChange}
									disabled={!edit}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="contactName">
									Contact Name
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="contactName"
									value={contactName}
									onChange={handleInputChange}
									disabled={!edit}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="companyPhone">
									Company Phone
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="companyPhone"
									value={companyPhone}
									onChange={handleInputChange}
									disabled={!edit}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="companyDescription">
									Company Description
								</label>
								<textarea
									required
									type="text"
									className={`${inputClass}`}
									name="companyDescription"
									value={companyDescription}
									onChange={handleInputChange}
									disabled={!edit}
									rows={4}
								/>
							</div>
						</div>

						<div className="my-4 w-full flex">
							{edit && (
								<button
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
									onClick={handleSubmit}>
									{updating ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : (
										"SUBMIT"
									)}
								</button>
							)}
						</div>
					</form>
				)}
				<ToastContainer />
			</Modal>
		</>
	);
};

export default CompanyModal;
