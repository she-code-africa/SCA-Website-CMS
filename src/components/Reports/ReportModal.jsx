import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createReport, editReport, getReport } from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ReportModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	console.log(id);
	const queryClient = useQueryClient();
	const intial = {
		link: "",
		year: 0,
	};
	const [report, setReport] = useState(intial);
	const { link, year } = report;
	const [edit, setEdit] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { isLoading, data } = useQuery(["report", id], () => getReport(id), {
		onSuccess: (data) => {
			!newItem && setReport(data);
		},
	});

	const { mutate: addReport, isLoading: creating } = useMutation(createReport, {
		onSuccess: () => {
			setReport(intial);
			toast.success("Report Created Successfully");
			queryClient.invalidateQueries(["reports"]);
			handleModal();
		},
		onError: () => {
			toast.error("Could not create Report");
		},
	});

	const { mutateAsync: updateReport, isLoading: updating } = useMutation(
		editReport,
		{
			onSuccess: () => {
				toast.success("Report updated Successfully");
				queryClient.invalidateQueries(["report"]);
				queryClient.invalidateQueries(["reports"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Report");
			},
		}
	);

	const updateReportDetails = async () => {
		await updateReport({ id, data: { year: report.year, link: report.link } });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setReport((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setReport]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		newItem ? addReport(report) : await updateReportDetails();
	};
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Report Details</h2>
				{!newItem && (
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
				)}
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
				{isLoading && !newItem ? (
					<Loader />
				) : (
					<form className="w-full px-4 md:px-8">
						<div className="flex flex-col w-full gap-y-5">
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="link">
									Link
								</label>
								<input
									required
									type="url"
									className={`${inputClass}`}
									name="link"
									value={link}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="year">
									Year
								</label>
								<input
									required
									type="number"
									className={`${inputClass}`}
									name="year"
									value={year}
									onChange={(e) =>
										setReport((prev) => ({
											...prev,
											year: e.target.value,
										}))
									}
									disabled={!edit && !newItem}
								/>
							</div>
						</div>

						<div className="my-4 w-full flex">
							{edit || newItem ? (
								<button
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
									onClick={handleSubmit}>
									{creating || updating ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : (
										"SUBMIT"
									)}
								</button>
							) : (
								id && (
									<button
										className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
										onClick={() => {
											handleModal();
											handleDeleteModal();
										}}>
										Delete
									</button>
								)
							)}
						</div>
					</form>
				)}
				<ToastContainer />
			</Modal>
		</>
	);
};

export default ReportModal;
