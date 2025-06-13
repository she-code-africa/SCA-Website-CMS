import React from "react";
import { RxCross1 } from "react-icons/rx";

const ChapterSocialMedia = ({
	handleInputChange,
	edit,
	newItem,

	linkKey,
	linkUrl,
	socialLinks,

	setSocialLinks,
}) => {
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150`;

	const handleAddSocialLinks = () => {
		if (!linkKey || !linkUrl) {
			alert("Please enter both link key and link URL.");
			return;
		}

		const updatedLinks = { ...socialLinks, [linkKey]: linkUrl };
		setSocialLinks(updatedLinks);

		// Clear input fields after adding the link
		handleInputChange({ target: { name: "linkKey", value: "" } });
		handleInputChange({ target: { name: "linkUrl", value: "" } });
	};

	const handleRemoveSocialLink = (key) => {
		const updatedLinks = { ...socialLinks };
		delete updatedLinks[key];
		setSocialLinks(updatedLinks);
	};
	return (
		<section className="relative w-full mb-3 flex">
			<label
				className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
				htmlFor="link">
				Social Media Links
			</label>

			<div
				className={` py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm w-full ease-linear transition-all duration-150 basis-9/12`}>
				<div className="w-full flex gap-3 items-center">
					<input
						required
						type="text"
						className={`${inputClass}`}
						name="linkKey"
						value={linkKey}
						placeholder="Enter link key"
						onChange={handleInputChange}
						disabled={!edit && !newItem}
						style={{ height: "40px", outline: "none" }}
					/>
					<input
						required
						type="text"
						className={`${inputClass}`}
						name="linkUrl"
						value={linkUrl}
						placeholder="Enter link url"
						onChange={handleInputChange}
						disabled={!edit && !newItem}
					/>
				</div>

				<div className="w-full flex justify-end mt-2">
					<button
						className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto cursor-pointer"
						type="button"
						onClick={handleAddSocialLinks}>
						Add Link
					</button>
				</div>

				{/* text-area to show added links */}
				<ul
					className={`${inputClass} mt-3 overflow-y-auto`}
					style={{ height: "100px" }}>
					{Object.keys(socialLinks).length !== 0 ? (
						Object.entries(socialLinks).map(([key, value]) => (
							<li
								className="my-2 text-sm p-2 rounded-full flex items-center gap-2"
								style={{ backgroundColor: "#f3f4f6", maxWidth: "230px" }}>
								<span className="text-slate-600">{key}:</span>
								<span className="text-slate-600">{value}</span>
								{(edit || newItem) && (
									<button
										type="button"
										className=" cursor-pointer"
										onClick={() => handleRemoveSocialLink(key)}
										style={{ color: "#dc2626" }}>
										<RxCross1 />
									</button>
								)}
							</li>
						))
					) : (
						<li className="my-3 w-full px-3 text-slate-300">
							No social links added yet.
						</li>
					)}
				</ul>
			</div>
		</section>
	);
};

export default ChapterSocialMedia;
