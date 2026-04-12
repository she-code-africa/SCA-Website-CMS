import CustomInput from "components/Inputs/CustomInput";
import React, { useState } from "react";
import "../../../../../style/index.css";
import CustomTextArea from "components/Inputs/CustomTextArea";
import CustomSelect from "components/Inputs/CustomSelect";

import { getSAGCourse, editSAGCourse } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useHistory, useParams } from "react-router-dom";
import Modules from "../create/Modules";
import DeleteModal from "components/Modal/DeleteModal";
import { deleteSAGCourse } from "services";

const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring !py-3 w-full ease-linear transition-all duration-150 basis-9/12`;

const defaultLesson = () => ({
	title: "",
	description: "",
	videoUrl: "",
	thumbnail: "",
	durationMinutes: "",
	order: "",
	// isPreview: false,
	practiceTask: "",
	resources: [{ title: "", url: "" }],
});

const defaultModule = () => ({
	title: "",
	description: "",
	weekLabel: "",
	order: "",
	estimatedMinutes: "",
	lessons: [defaultLesson()],
});

const initialValues = {
	title: "",
	slug: "",
	description: "",
	difficulty: "",
	estimatedHours: "",
	state: "",
	image: "",
};

const EditCoursePage = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();

	const [editMode, setEditMode] = useState(false);
	const handleSetEditMode = () => setEditMode((prev) => !prev);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const [formValues, setFormValues] = useState(initialValues);
	const [modules, setModules] = useState([defaultModule()]);
	const [openModules, setOpenModules] = useState([0]);
	const [openLessons, setOpenLessons] = useState({ 0: [0] });

	//  Fetch existing course data
	const { isLoading } = useQuery(
		["stem-a-girl-course", id],
		() => getSAGCourse(id),
		{
			onSuccess: ({ data }) => {
				const newData = data.data;
				setFormValues({
					title: newData.title || "",
					slug: newData.slug || "",
					description: newData.description || "",
					difficulty: newData.difficulty || "",
					estimatedHours: newData.estimatedHours || "",
					state: newData.state || "",
					image: newData.image || "",
				});
				if (newData.modules && newData.modules.length > 0) {
					setModules(newData.modules);
					setOpenModules([0]);
					const lessonsState = {};
					newData.modules.forEach((_, mi) => {
						lessonsState[mi] = [0];
					});
					setOpenLessons(lessonsState);
				}
			},
		},
	);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: files ? files[0] : value }));
	};

	// Module helpers
	const toggleModule = (mi) => {
		setOpenModules((prev) =>
			prev.includes(mi) ? prev.filter((i) => i !== mi) : [...prev, mi],
		);
	};

	const addModule = () => {
		setModules((prev) => [...prev, defaultModule()]);
		const newIndex = modules.length;
		setOpenModules((prev) => [...prev, newIndex]);
		setOpenLessons((prev) => ({ ...prev, [newIndex]: [0] }));
	};

	const removeModule = (mi) => {
		setModules((prev) => prev.filter((_, i) => i !== mi));
		setOpenModules((prev) =>
			prev.filter((i) => i !== mi).map((i) => (i > mi ? i - 1 : i)),
		);
	};

	const handleModuleChange = (mi, field, value) => {
		setModules((prev) =>
			prev.map((mod, i) => (i === mi ? { ...mod, [field]: value } : mod)),
		);
	};

	//  Lesson helpers
	const toggleLesson = (mi, li) => {
		setOpenLessons((prev) => {
			const current = prev[mi] || [];
			return {
				...prev,
				[mi]: current.includes(li)
					? current.filter((i) => i !== li)
					: [...current, li],
			};
		});
	};

	const addLesson = (mi) => {
		setModules((prev) =>
			prev.map((mod, i) =>
				i === mi ? { ...mod, lessons: [...mod.lessons, defaultLesson()] } : mod,
			),
		);
		const newLessonIndex = modules[mi].lessons.length;
		setOpenLessons((prev) => ({
			...prev,
			[mi]: [...(prev[mi] || []), newLessonIndex],
		}));
	};

	const removeLesson = (mi, li) => {
		setModules((prev) =>
			prev.map((mod, i) =>
				i === mi
					? { ...mod, lessons: mod.lessons.filter((_, j) => j !== li) }
					: mod,
			),
		);
	};

	const handleLessonChange = (mi, li, field, value) => {
		setModules((prev) =>
			prev.map((mod, i) =>
				i === mi
					? {
							...mod,
							lessons: mod.lessons.map((lesson, j) =>
								j === li ? { ...lesson, [field]: value } : lesson,
							),
						}
					: mod,
			),
		);
	};

	// Resource helpers
	const addResource = (mi, li) => {
		setModules((prev) =>
			prev.map((mod, i) =>
				i === mi
					? {
							...mod,
							lessons: mod.lessons.map((lesson, j) =>
								j === li
									? {
											...lesson,
											resources: [...lesson.resources, { title: "", url: "" }],
										}
									: lesson,
							),
						}
					: mod,
			),
		);
	};

	const removeResource = (mi, li, ri) => {
		setModules((prev) =>
			prev.map((mod, i) =>
				i === mi
					? {
							...mod,
							lessons: mod.lessons.map((lesson, j) =>
								j === li
									? {
											...lesson,
											resources: lesson.resources.filter((_, k) => k !== ri),
										}
									: lesson,
							),
						}
					: mod,
			),
		);
	};

	const handleResourceChange = (mi, li, ri, field, value) => {
		setModules((prev) =>
			prev.map((mod, i) =>
				i === mi
					? {
							...mod,
							lessons: mod.lessons.map((lesson, j) =>
								j === li
									? {
											...lesson,
											resources: lesson.resources.map((res, k) =>
												k === ri ? { ...res, [field]: value } : res,
											),
										}
									: lesson,
							),
						}
					: mod,
			),
		);
	};

	//  Submit
	const history = useHistory();

	const { mutate: editCourse, isLoading: updating } = useMutation(
		editSAGCourse,
		{
			onSuccess: () => {
				toast.success("Course Updated Successfully");
				queryClient.invalidateQueries(["stem-a-girl-courses"]);
				queryClient.invalidateQueries(["stem-a-girl-course", id]);
				history.push("/admin/stem-a-girl/courses");
			},
			onError: () => {
				toast.error("Could not update Course");
			},
		},
	);

	const sanitizeModules = (modules) =>
		modules.map(({ _id, __v, createdAt, updatedAt, ...mod }) => ({
			...mod,
			lessons: mod.lessons.map(
				({ _id, __v, createdAt, updatedAt, isPreview, ...lesson }) => ({
					...lesson,
					resources: lesson.resources.map(
						({ _id, __v, ...resource }) => resource,
					),
				}),
			),
		}));

	const handleSubmit = () => {
		const {
			title,
			description,
			image,

			estimatedHours,
			difficulty,
			slug,
			state,
		} = formValues;
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("image", image);
		formData.append("estimatedHours", estimatedHours);
		formData.append("difficulty", difficulty);
		formData.append("slug", slug);
		formData.append("state", state);
		formData.append("modules", JSON.stringify(sanitizeModules(modules)));

		editCourse({ courseId: id, data: formData });
	};

	//  Shared label style
	const labelClass =
		"block uppercase text-slate-600 text-xs font-bold basis-3/12 mb-1";
	// delete
	const { mutate: removeCourse } = useMutation(deleteSAGCourse, {
		onSuccess: () => {
			toast.success("Course deleted successfully");
			setIsDeleteModalOpen(false);
			queryClient.invalidateQueries(["stem-a-girl-courses"]);

			history.push("/admin/stem-a-girl/courses");
		},
		onError: () => {
			setIsDeleteModalOpen(false);
			toast.error("Could not delete Course");
		},
	});

	const handleDelete = () => {
		removeCourse(id);
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-md z-10 w-full p-8 flex items-center justify-center">
				<p className="text-slate-500 text-sm">Loading course...</p>
			</div>
		);
	}

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Edit Course</h5>

					<div className="flex items-center justify-end gap-4">
						{editMode ? (
							<button
								className="flex items-center gap-2 text-base text-pink-500"
								onClick={handleSetEditMode}>
								<FaEye />
								<span>Preview</span>
							</button>
						) : (
							<button
								className="flex items-center gap-2 text-base text-pink-500"
								onClick={handleSetEditMode}>
								<FaPencilAlt />
								<span>Edit</span>
							</button>
						)}
						{/* should open delete confirmation modal */}
						<button
							className="flex items-center gap-2 text-base text-red-500"
							onClick={() => setIsDeleteModalOpen(true)}>
							<FaTrashAlt />
							<span>Delete</span>
						</button>
					</div>
				</div>

				<section className="w-full my-5 p-5">
					{/* ── Course basics ── */}
					<div className="w-full grid gap-4 col-2 grid-cols-2 mb-5">
						<CustomInput
							inputClass={inputClass}
							label="Course Title"
							placeholder="Enter course title"
							nameId="title"
							isDisabled={!editMode}
							handleInputChange={handleChange}
							value={formValues.title}
							isRequired={true}
						/>
						<CustomInput
							inputClass={inputClass}
							label="Slug"
							placeholder="Eg. intro-to-python"
							nameId="slug"
							isDisabled={!editMode}
							handleInputChange={handleChange}
							value={formValues.slug}
							isRequired={true}
						/>
					</div>

					<CustomTextArea
						inputClass={inputClass}
						label="Description"
						placeholder="Enter course description"
						nameId="description"
						isDisabled={!editMode}
						handleInputChange={handleChange}
						value={formValues.description}
					/>

					<div className="w-full grid gap-4 col-2 grid-cols-2 mb-5">
						<CustomInput
							inputClass={inputClass}
							label="Course Difficulty"
							placeholder="Eg. Beginner to Advanced"
							nameId="difficulty"
							isDisabled={!editMode}
							handleInputChange={handleChange}
							value={formValues.difficulty}
							isRequired={true}
						/>
						<CustomInput
							inputClass={inputClass}
							label="Estimated Hours"
							placeholder="9 - 12 hours"
							nameId="estimatedHours"
							isDisabled={!editMode}
							handleInputChange={handleChange}
							value={formValues.estimatedHours}
							isRequired={true}
						/>
					</div>

					<div className="w-full grid gap-4 col-2 grid-cols-2 mb-5">
						<CustomSelect
							label="State"
							inputClass={inputClass}
							nameId="state"
							value={formValues.state}
							handleInputChange={handleChange}
							placeholder="Select course state"
							isDisabled={!editMode}
							options={["published", "draft", "archived"].map((option) => (
								<option value={option} key={option} className="capitalize">
									{option}
								</option>
							))}
						/>

						<div className="relative w-full mb-5 flex flex-col">
							<label htmlFor="image" className={labelClass}>
								Course Image
							</label>
							{/* Show existing image if present and not in edit mode */}
							{formValues.image && !editMode ? (
								<img
									src={formValues.image}
									alt="course"
									className="mt-3 h-20 w-32 object-cover rounded shadow"
								/>
							) : (
								<input
									type="file"
									id="image"
									name="image"
									className="mt-5"
									disabled={!editMode}
									onChange={handleChange}
								/>
							)}
						</div>
					</div>

					{/* ── Modules ── */}
					<Modules
						addLesson={addLesson}
						addModule={addModule}
						addResource={addResource}
						handleLessonChange={handleLessonChange}
						handleModuleChange={handleModuleChange}
						handleResourceChange={handleResourceChange}
						inputClass={inputClass}
						labelClass={labelClass}
						modules={modules}
						openLessons={openLessons}
						openModules={openModules}
						removeLesson={removeLesson}
						removeModule={removeModule}
						removeResource={removeResource}
						toggleLesson={toggleLesson}
						toggleModule={toggleModule}
						isDisabled={!editMode}
					/>

					{/* ── Submit — only visible in edit mode ── */}
					{editMode && (
						<div className="flex justify-end mt-8">
							<button
								type="button"
								onClick={handleSubmit}
								disabled={updating}
								className="px-6 py-3 bg-pink-500 hover:bg-pink-800 text-white text-sm font-semibold rounded shadow transition-all duration-150 ease-linear disabled:opacity-60 disabled:cursor-not-allowed">
								{updating ? "Saving..." : "Save Changes"}
							</button>
						</div>
					)}
				</section>
			</div>

			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Course"
					isOpen={isDeleteModalOpen}
					handleModal={() => setIsDeleteModalOpen(false)}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default EditCoursePage;
