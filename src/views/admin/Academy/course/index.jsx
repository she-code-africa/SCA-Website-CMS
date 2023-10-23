import { useMutation, useQuery, useQueryClient } from "react-query";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import { courses as headers } from "utils/headers";
import { getCourses } from "services";
import moment from "moment";
import CourseModal from "components/Courses/CourseModal";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import { deleteCourse } from "services";

const Courses = () => {
	const [courses, setCourses] = useState([]);
	const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedId, setSelectedId] = useState();

	const { isLoading } = useQuery("courses", getCourses, {
		onSuccess: (data) => {
			setCourses(data);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});

	const queryClient = useQueryClient();

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleCourseModal = () => {
		setIsCourseModalOpen(!isCourseModalOpen);
	};

	const { mutate, isLoading: deleting } = useMutation(deleteCourse, {
		onSuccess: () => {
			toast.success("Course Deleted Successfully");
			queryClient.invalidateQueries(["courses"]);
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
				<div className="flex items-center justify-between px-2 ">
					<h5 className="font-medium text-xl mt-3">Courses</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleCourseModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-5">
						{headers.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLoading || deleting}>
						{courses.map(
							(
								{ _id, name, shortDescription, updatedAt, school, createdAt },
								index
							) => {
								return (
									<TableDataRow
										onClick={() => {
											setSelectedId(_id);
											handleCourseModal();
											setNewItem(false);
										}}
										key={index}
										className="grid grid-cols-5 px-4 py-3 bg-white">
										<TableData>{name}</TableData>
										<TableData>{shortDescription}</TableData>
										<TableData>{school.name}</TableData>
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
					handleModal={handleCourseModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Courses;
