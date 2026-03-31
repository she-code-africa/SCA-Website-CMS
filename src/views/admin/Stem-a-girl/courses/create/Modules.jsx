import React from "react";
import Lessons from "./Lessons";

const Modules = ({
	modules,
	openModules,
	toggleModule,
	removeModule,
	handleModuleChange,
	addModule,
	addLesson,
	addResource,
	labelClass,
	inputClass,
	toggleLesson,
	removeLesson,
	openLessons,
	handleLessonChange,
	handleResourceChange,
  removeResource,
  isDisabled
}) => {
	return (
		<section className="w-full mt-6">
			<div className="flex items-center justify-between mb-4">
				<h5 className="block uppercase text-slate-600 text-xs font-bold">
					Course Modules
				</h5>
				<button
					disabled={isDisabled}
					type="button"
					onClick={addModule}
					className="flex items-center gap-1 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-800 px-3 py-2 rounded shadow transition-all duration-150">
					+ Add Module
				</button>
			</div>

			{modules.map((mod, mi) => (
				<div
					key={mi}
					className="mb-4 border border-slate-200 rounded-md shadow-sm overflow-hidden">
					{/* Module header */}
					<div
						className="flex items-center justify-between px-4 py-3 bg-slate-50 cursor-pointer select-none"
						onClick={() => toggleModule(mi)}>
						<span className="text-sm font-semibold text-slate-700">
							{mod.title || `Module ${mi + 1}`}
						</span>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeModule(mi);
								}}
								className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors duration-150">
								Remove
							</button>
							<span className="text-slate-400 text-xs">
								{openModules.includes(mi) ? "▲" : "▼"}
							</span>
						</div>
					</div>

					{/* Module body */}
					{openModules.includes(mi) && (
						<div className="p-4 bg-white">
							{/* Module fields */}
							<div className="w-full grid gap-4 grid-cols-2 mb-4">
								<div className="relative w-full mb-3">
									<label className={labelClass}>Module Title *</label>
									<input
										type="text"
										placeholder="Enter module title"
										value={mod.title}
										onChange={(e) =>
											handleModuleChange(mi, "title", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
								<div className="relative w-full mb-3">
									<label className={labelClass}>Week Label</label>
									<input
										type="text"
										placeholder="Eg. Week 1"
										value={mod.weekLabel}
										onChange={(e) =>
											handleModuleChange(mi, "weekLabel", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
							</div>

							<div className="relative w-full mb-4">
								<label className={labelClass}>Module Description</label>
								<textarea
									placeholder="Enter module description"
									value={mod.description}
									onChange={(e) =>
										handleModuleChange(mi, "description", e.target.value)
									}
									rows={3}
									className={inputClass}
									disabled={isDisabled}
								/>
							</div>

							<div className="w-full grid gap-4 grid-cols-2 mb-4">
								<div className="relative w-full mb-3">
									<label className={labelClass}>Order</label>
									<input
										type="number"
										placeholder="Eg. 1"
										value={mod.order}
										onChange={(e) =>
											handleModuleChange(mi, "order", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
								<div className="relative w-full mb-3">
									<label className={labelClass}>Estimated Minutes</label>
									<input
										type="number"
										placeholder="Eg. 60"
										value={mod.estimatedMinutes}
										onChange={(e) =>
											handleModuleChange(mi, "estimatedMinutes", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
							</div>

							{/* ── LESSONS ── */}
							<Lessons
								addLesson={addLesson}
								addResource={addResource}
								handleLessonChange={handleLessonChange}
								handleResourceChange={handleResourceChange}
								inputClass={inputClass}
								labelClass={labelClass}
								mi={mi}
								mod={mod}
								openLessons={openLessons}
								removeLesson={removeLesson}
								toggleLesson={toggleLesson}
								removeResource={removeResource}
								isDisabled={isDisabled}
							/>
						</div>
					)}
				</div>
			))}
		</section>
	);
};

export default Modules;
