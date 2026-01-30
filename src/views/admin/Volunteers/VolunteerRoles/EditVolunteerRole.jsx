// views/admin/Volunteers/VolunteerRoles/EditVolunteerRole.jsx
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { paths } from "utils";
import { getVolunteerRole, updateVolunteerRole } from "services/index";

const EditVolunteerRole = () => {
	const { id } = useParams();
	const history = useHistory();

	const [form, setForm] = useState({
		name: "",
		description: "",
		skillsText: "",
		image: null,
		currentImage: "",
	});

	const { isLoading } = useQuery(["volunteerRole", id], () => getVolunteerRole(id), {
		onSuccess: (data) => {
			setForm((p) => ({
				...p,
				name: data?.name || "",
				description: data?.description || "",
				skillsText: Array.isArray(data?.skills) ? data.skills.join(", ") : "",
				currentImage: data?.image || "",
			}));
		},
		onError: () => toast.error("Failed to load volunteer role"),
	});

	const mutation = useMutation({
		mutationFn: () =>
			updateVolunteerRole({
				volunteerRoleId: id,
				payload: {
					name: form.name,
					description: form.description,
					skills: form.skillsText
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean),
					image: form.image,
				},
			}),
		onSuccess: () => {
			toast.success("Volunteer role updated");
			history.push(paths.volunteerRoles);
		},
		onError: () => toast.error("Failed to update volunteer role"),
	});

	return (
		<div className="flex flex-wrap mt-4 w-full">
			<div className="w-full mb-12 px-4">
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
					<div className="rounded-t mb-0 px-4 py-3 flex justify-between">
						<p>Edit Volunteer Role</p>
						<Link to={paths.volunteerRoles}>Back</Link>
					</div>

					<form
						className="px-4 py-3"
						onSubmit={(e) => {
							e.preventDefault();
							mutation.mutate();
						}}
					>
						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Name
							</label>
							<input
								required
								type="text"
								className="border-1 border-slate-200 p-3 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full"
								value={form.name}
								disabled={isLoading}
								onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
							/>
						</div>

						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Description
							</label>
							<textarea
								className="border-1 border-slate-200 p-3 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full"
								value={form.description}
								disabled={isLoading}
								onChange={(e) =>
									setForm((p) => ({ ...p, description: e.target.value }))
								}
								rows={4}
							/>
						</div>

						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Skills (comma-separated)
							</label>
							<input
								type="text"
								className="border-1 border-slate-200 p-3 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full"
								value={form.skillsText}
								disabled={isLoading}
								onChange={(e) =>
									setForm((p) => ({ ...p, skillsText: e.target.value }))
								}
							/>
						</div>

						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Image
							</label>

							{form.currentImage && !form.image && (
								<div className="mb-2">
									<img
										src={form.currentImage}
										alt="current"
										className="h-24 w-24 rounded-md object-cover border border-slate-200"
									/>
									<p className="text-xs text-slate-500 mt-1">Current image</p>
								</div>
							)}

							<input
								type="file"
								accept="image/*"
								className="block w-full text-sm text-slate-600"
								disabled={isLoading}
								onChange={(e) =>
									setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))
								}
							/>

							{form.image && (
								<p className="text-xs text-slate-500 mt-1">
									Selected: {form.image.name}
								</p>
							)}
						</div>

						<div className="text-center my-4 w-6/12 mx-auto">
							<button
								type="submit"
								disabled={mutation.isLoading || isLoading}
								className="text-center bg-pink-500 hover:bg-pink-600 py-2 px-4 rounded text-white text-sm font-semibold block w-full uppercase disabled:opacity-60"
							>
								{mutation.isLoading ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditVolunteerRole;
