import React, { useState } from "react";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { useQuery } from "react-query";
import { getSuccessStories } from "services";
import { successStory as header } from "utils/headers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import SuccessStoriesModal from "components/SuccessStories/SuccessStoriesModal";

const SuccessStories = () => {
	const [partners, setSuccessStories] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isSuccessStoriesModalOpen, setIsSuccessStoriesModalOpen] =
		useState(false);
	const [newItem, setNewItem] = useState();

	const { isLoading } = useQuery("program-successes", getSuccessStories, {
		onSuccess: (data) => {
			setSuccessStories(data);
		},
		onError: () => {
			toast.error("Error fetching Success Stories");
		},
	});

	const handleSuccessStoriesModal = () => {
		setIsSuccessStoriesModalOpen(!isSuccessStoriesModalOpen);
	};

	return (
		<div className="w-full z-40 bg-white rounded-md">
			<div className="flex items-center justify-between px-4 mt-3">
				<h5 className="font-medium text-xl">Program Success Stories</h5>
				<button
					className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
					onClick={() => {
						setNewItem(true);
						setSelectedId("");
						handleSuccessStoriesModal();
					}}>
					Add
				</button>
			</div>

			<Table width="full">
				<TableHeaderRow className="grid grid-cols-9">
					{header.map(({ label }, index) => {
						return <TableHeader key={index}>{label}</TableHeader>;
					})}
					<TableHeader></TableHeader>
				</TableHeaderRow>
				<TableBody loading={isLoading}>
					{partners?.map(
						(
							{
								_id,
								image,
								name,
								position,
								story,
								programCategory,
								author,
								state,
								publishDate,
								createdAt,
								updatedAt,
							},
							index
						) => {
							return (
								<TableDataRow
									onClick={() => {
										setSelectedId(_id);
										handleSuccessStoriesModal();
										setNewItem(false);
									}}
									key={index}
									className="grid grid-cols-9 px-4 py-3 bg-white">
									<TableData>
										<span className="flex items-center gap-2">
											<img className="w-4 h-4" src={image} alt={name} />
											{name}
										</span>
									</TableData>
									<TableData>{position}</TableData>
									<TableData>{story}</TableData>
									<TableData>{programCategory.name}</TableData>
									<TableData>
										{author?.firstName} {""} {author?.lastName}
									</TableData>
									<TableData>{state}</TableData>
									<TableData>
										{moment(publishDate).format("DD MMM, YYYY")}
									</TableData>
									<TableData>
										{moment(updatedAt).format("DD MMM, YYYY")}
									</TableData>
									<TableData>
										{moment(createdAt).format("DD MMM, YYYY")}
									</TableData>
								</TableDataRow>
							);
						}
					)}
				</TableBody>
			</Table>

			{isSuccessStoriesModalOpen && (
				<SuccessStoriesModal
					isOpen={isSuccessStoriesModalOpen}
					handleModal={handleSuccessStoriesModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</div>
	);
};

export default SuccessStories;
