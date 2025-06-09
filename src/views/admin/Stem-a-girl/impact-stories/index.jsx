import {
	TableHeaderRow,
	TableHeader,
	TableBody,
	TableData,
	TableDataRow,
	Table,
} from "components/Table/DisplayTable";
import { useState } from "react";
import { useQuery } from "react-query";
import { getSAGImpactStories } from "services";
import moment from "moment";
import StoryModal from "components/Stem-a-girl/impact-stories/StoryModal";
import { ToastContainer } from "react-toastify";

const ImpactStories = () => {
	const [impactStories, setImpactStories] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();

	const tableHeader = [
		{
			value: "name",
			label: "Name",
		},
		{
			value: "story",
			label: "Story",
		},
		{
			value: "school",
			label: "School",
		},
		{
			value: "updatedAt",
			label: "Updated At",
		},
		{
			value: "createdAt",
			label: "Created At",
		},
	];

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const { isLoading } = useQuery(
		"stem-a-girl-impact-stories",
		getSAGImpactStories,
		{
			onSuccess: ({ data }) => {
				!!data && setImpactStories(data.data);
			},
			onError: (err) => {
				console.log(err);
			},
		}
	);

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Impact Stories</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							handleModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-5">
						{tableHeader.map(({ label, name }) => (
							<TableHeader key={name}>{label}</TableHeader>
						))}
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{impactStories?.map((impactStory) => (
							<TableDataRow
								key={impactStory._id}
								className="grid grid-cols-5 px-4 py-3 bg-white">
								<TableData>
									<div className="flex gap-2 items-center">
										<img
											src={impactStory.image}
											alt={impactStory.name}
											className="w-6 h-6 rounded-full"
										/>
										{impactStory.name}
									</div>
								</TableData>
								<TableData>{impactStory.story}...</TableData>
								<TableData>{impactStory.school.name}</TableData>

								<TableData>
									{" "}
									{moment(impactStory.updatedAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{moment(impactStory.createdAt).format("DD MMM, YYYY")}
								</TableData>
							</TableDataRow>
						))}
					</TableBody>
				</Table>
			</div>
			{isModalOpen && (
				<StoryModal
					isOpen={isModalOpen}
					handleModal={handleModal}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default ImpactStories;
