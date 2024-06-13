import {
	TableHeaderRow,
	TableHeader,
	TableBody,
	TableData,
	TableDataRow,
	Table,
} from "components/Table/DisplayTable";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import CourseModal from "components/Stem-a-girl/courses/CourseModal";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "components/Modal/DeleteModal";
import { getSAGCourses, deleteSAGCourse } from "services";

const Courses = () => {
	const [courses, setCourses] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();

	const tableHeader = [
		{
			value: "title",
			label: "Title",
		},
		{
			value: "description",
			label: "Description",
		},
		{
			value: "link",
			label: "Link",
		},
		{
			value: "activity",
			label: "Activity",
		},
		{
			value: "state",
			label: "State",
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

	const handleSchoolModal = () => {
		setIsCourseModalOpen(!isCourseModalOpen);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const { isLoading } = useQuery("stem-a-girl-courses", getSAGCourses, {
		onSuccess: ({ data }) => {
			!!data && setCourses(data.data);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const { mutate, isLoading: deleting } = useMutation(deleteSAGCourse, {
		onSuccess: () => {
			toast.success("Course Deleted Successfully");
			queryClient.invalidateQueries(["stem-a-girl-courses"]);
		},
		onError: () => {
			toast.error("Could not delete Course");
		},
	});
	const handleDelete = () => {
		mutate(selectedId);
		handleDeleteModal();
	};

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Courses</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleSchoolModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-7">
						{tableHeader.map(({ label, name }) => (
							<TableHeader key={name}>{label}</TableHeader>
						))}
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{courses?.map((course) => (
							<TableDataRow
								onClick={() => {
									setSelectedId(course._id);
									handleSchoolModal();
									setNewItem(false);
								}}
								key={course._id}
								className="grid grid-cols-7 px-4 py-3 bg-white">
								<TableData>
									<div className="flex gap-2 items-start">
										<img
											src={course.image}
											alt={course.title}
											className="w-6 h-6"
										/>
										{course.title}
									</div>
								</TableData>
								<TableData>{course.description.substring(0, 100)}...</TableData>
								<TableData>{course.link}</TableData>
								<TableData>{course.activity.title}</TableData>
								<TableData>{course.state}</TableData>
								<TableData>
									{" "}
									{moment(course.updatedAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{moment(course.createdAt).format("DD MMM, YYYY")}
								</TableData>
							</TableDataRow>
						))}
					</TableBody>
				</Table>
			</div>
			{isDeleteModalOpen && (
				<DeleteModal
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isCourseModalOpen && (
				<CourseModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isCourseModalOpen}
					handleModal={handleSchoolModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Courses;
