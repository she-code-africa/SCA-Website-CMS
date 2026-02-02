// views/admin/Volunteers/VolunteerRoles/AddVolunteerRole.jsx
import React, { useState } from "react";
import { useMutation } from "react-query";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { paths } from "utils";
import { createVolunteerRole } from "services/index";

const AddVolunteerRole = () => {
	const history = useHistory();

	const [form, setForm] = useState({
		name: "",
		description: "",
		skillsText: "",
		image: null
	});

	const mutation = useMutation({
		mutationFn: () =>
			createVolunteerRole({
				name: form.name,
				description: form.description,
				skills: form.skillsText
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean),
				image: form.image
			}),
		onSuccess: () => {
			toast.success("Volunteer role created");
			history.push(paths.volunteerRoles);
		},
		onError: () => toast.error("Failed to create volunteer role")
	});

	return (
		<div className="flex flex-wrap mt-4 w-full">
			<div className="w-full mb-12 px-4">
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
					<div className="rounded-t mb-0 px-4 py-3 flex justify-between">
						<p>Add Volunteer Role</p>
						<Link to={paths.volunteerRoles}>Back</Link>
					</div>

					<form
						className="px-4 py-3"
						onSubmit={(e) => {
							e.preventDefault();
							mutation.mutate();
						}}>
						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Name
							</label>
							<input
								required
								type="text"
								className="border-1 border-slate-200 p-3 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full"
								value={form.name}
								onChange={(e) =>
									setForm((p) => ({ ...p, name: e.target.value }))
								}
								placeholder="Support team"
							/>
						</div>

						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Description
							</label>
							<textarea
								className="border-1 border-slate-200 p-3 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full"
								value={form.description}
								onChange={(e) =>
									setForm((p) => ({ ...p, description: e.target.value }))
								}
								placeholder="Resolve bugs"
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
								onChange={(e) =>
									setForm((p) => ({ ...p, skillsText: e.target.value }))
								}
								placeholder="curious, communication, problem solving"
							/>
						</div>

						<div className="w-full my-3">
							<label className="block uppercase text-slate-600 text-xs font-bold my-2">
								Image
							</label>
							<input
								type="file"
								accept="image/*"
								className="block w-full text-sm text-slate-600"
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
								disabled={mutation.isLoading}
								className="text-center bg-pink-500 hover:bg-pink-600 py-2 px-4 rounded text-white text-sm font-semibold block w-full uppercase disabled:opacity-60">
								{mutation.isLoading ? "Creating..." : "Create Role"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddVolunteerRole;
