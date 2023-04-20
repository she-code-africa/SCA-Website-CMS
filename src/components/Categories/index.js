import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";

const Category = ({ title, categories, addCategory }) => {
	const [showInput, setShowInput] = useState(false);
	const [newCategory, setNewCategory] = useState("");

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
				<div className="px-3 lg:px-6">
					<div className="mt-8 mb-5">
						<div>
							<div className="flex justify-between my-2">
								<h6 className="uppercase text-sm font-bold">{title}</h6>
								<div
									className="hover:cursor-pointer"
									onClick={() => setShowInput(true)}>
									<BsPlus size="1.5rem" />
								</div>
							</div>
							<ul
								className="bg-slate-50 p-4 overflow-y-scroll block"
								style={{ maxHeight: "180px", overflowY: "scroll" }}>
								{showInput && (
									<li className="flex flex-col">
										<input
											type="text"
											value={newCategory}
											onChange={(event) => setNewCategory(event.target.value)}
											onKeyDown={(event) => {
												if (event.key === "Enter") {
													addCategory();
												}
											}}
										/>
										<button
											className="bg-pink-500 px-4 py-1 text-white mt-3"
											onClick={addCategory}
											style={{ alignSelf: "end" }}>
											Add
										</button>
									</li>
								)}
								{categories.map((cat, index) => (
									<li key={index}>{cat}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Category;
