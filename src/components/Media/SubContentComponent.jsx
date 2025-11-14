import React, { useState } from "react";

const SubContentComponent = ({
	inputClass,
	edit,
	newItem,
	addNewSubcontent,
}) => {
	// Local subcontent state
	const [subData, setSubData] = useState({
		title: "",
		images: [],
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setSubData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubImages = (e) => {
		const files = [...e.target.files];
		setSubData((prev) => ({ ...prev, images: files }));
	};

	const handleAddSubcontent = () => {
		if (!subData.title.trim()) return;

		addNewSubcontent(subData);

		// Reset form
		setSubData({
			title: "",
			images: [],
		});
	};

	return (
		<>
			<div className="w-full mt-3">
				<label className="text-base font-medium text-slate-600">Title</label>
				<input
					required
					type="text"
					className={`${inputClass} mt-3`}
					name="title"
					placeholder="Enter a sub-title"
					value={subData.title}
					onChange={handleChange}
					disabled={!edit && !newItem}
				/>
			</div>

			<div className="w-full mt-5 flex items-center gap-3">
				<label className="text-base font-medium text-slate-600">
					Upload images
				</label>
				<input type="file" multiple onChange={handleSubImages} />
			</div>

			<div className="w-full justify-end mt-4 flex">
				<button
					onClick={handleAddSubcontent}
					className="rounded-md bg-pink-500 text-white text-xs px-4 py-2"
					type="button">
					Add Sub-content
				</button>
			</div>

			<div className="w-full mt-4 border p-4 rounded-md"></div>
		</>
	);
};

export default SubContentComponent;
