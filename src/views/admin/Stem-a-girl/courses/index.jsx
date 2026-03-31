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
import { Link, useHistory } from "react-router-dom";

const Courses = () => {
	const [courses, setCourses] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();

	const history = useHistory();

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
			value: "estimatedHours",
			label: "Estimated Hours",
		},
		{
			value: "difficulty",
			label: "Difficulty",
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

	const handleSchoolModal = (id) => {
		history.push(`/admin/courses/${id}`);
	};

	const { isLoading } = useQuery("stem-a-girl-courses", getSAGCourses, {
		onSuccess: ({ data }) => {
			!!data && setCourses(data.data);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	console.log(courses);

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Courses</h5>
					<Link
						to="/admin/courses/create"
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2">
						Add
					</Link>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-7">
						{tableHeader.map(({ label, name }, i) => (
							<TableHeader key={i}>{label}</TableHeader>
						))}
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{courses?.map((course) => (
							<TableDataRow
								onClick={() => {
									handleSchoolModal(course._id);
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
								<TableData>{course.estimatedHours || "N/A"}</TableData>
								<TableData>{course.difficulty || "N/A"}</TableData>
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
			{/* {isDeleteModalOpen && (
				<DeleteModal
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)} */}
			{/* {isCourseModalOpen && (
				<CourseModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isCourseModalOpen}
					handleModal={handleSchoolModal}
					id={selectedId}
					newItem={newItem}
				/>
			)} */}
			<ToastContainer />
		</>
	);
};

export default Courses;
