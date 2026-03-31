import React from 'react'

const Lessons = ({
	addLesson,
	mi,
	mod,
	toggleLesson,
	removeLesson,
	handleLessonChange,
	openLessons,
	labelClass,
	inputClass,
	handleResourceChange,
  addResource,
  removeResource,
  isDisabled
}) => {
	return (
		<div className="mt-2">
			<div className="flex items-center justify-between mb-3">
				<h6 className="uppercase text-slate-500 text-xs font-bold">Lessons</h6>
				<button
					type="button"
					onClick={() => addLesson(mi)}
					className="text-xs font-semibold text-white bg-slate-500 hover:bg-slate-600 px-3 py-1.5 rounded shadow transition-all duration-150">
					+ Add Lesson
				</button>
			</div>

			{mod.lessons.map((lesson, li) => (
				<div
					key={li}
					className="mb-3 border border-slate-100 rounded-md overflow-hidden">
					{/* Lesson header */}
					<div
						className="flex items-center justify-between px-3 py-2 bg-slate-100 cursor-pointer select-none"
						onClick={() => toggleLesson(mi, li)}>
						<span className="text-xs font-semibold text-slate-600">
							{lesson.title || `Lesson ${li + 1}`}
						</span>
						<div className="flex items-center gap-3">
							<button
								disabled={isDisabled}
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									removeLesson(mi, li);
								}}
								className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors duration-150">
								Remove
							</button>
							<span className="text-slate-400 text-xs">
								{(openLessons[mi] || []).includes(li) ? "▲" : "▼"}
							</span>
						</div>
					</div>

					{/* Lesson body */}
					{(openLessons[mi] || []).includes(li) && (
						<div className="p-3 bg-white">
							<div className="w-full grid gap-4 grid-cols-2 mb-3">
								<div className="relative w-full">
									<label className={labelClass}>Lesson Title *</label>
									<input
										type="text"
										placeholder="Enter lesson title"
										value={lesson.title}
										onChange={(e) =>
											handleLessonChange(mi, li, "title", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
								<div className="relative w-full">
									<label className={labelClass}>Duration (minutes)</label>
									<input
										disabled={isDisabled}
										type="number"
										placeholder="Eg. 15"
										value={lesson.durationMinutes}
										onChange={(e) =>
											handleLessonChange(
												mi,
												li,
												"durationMinutes",
												e.target.value,
											)
										}
										className={inputClass}
									/>
								</div>
							</div>

							<div className="relative w-full mb-3">
								<label className={labelClass}>Lesson Description</label>
								<textarea
									disabled={isDisabled}
									placeholder="Enter lesson description"
									value={lesson.description}
									onChange={(e) =>
										handleLessonChange(mi, li, "description", e.target.value)
									}
									rows={2}
									className={inputClass}
								/>
							</div>

							<div className="w-full grid gap-4 grid-cols-2 mb-3">
								<div className="relative w-full">
									<label className={labelClass}>Video URL</label>
									<input
										type="text"
										placeholder="https://..."
										value={lesson.videoUrl}
										onChange={(e) =>
											handleLessonChange(mi, li, "videoUrl", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
								<div className="relative w-full">
									<label className={labelClass}>Thumbnail</label>
									<input
										disabled={isDisabled}
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files[0];
											if (!file) return;
											const reader = new FileReader();
											reader.onloadend = () =>
												handleLessonChange(mi, li, "thumbnail", reader.result);
											reader.readAsDataURL(file);
										}}
										className="mt-1 w-full text-sm text-slate-600"
									/>
									{lesson.thumbnail && (
										<img
											src={lesson.thumbnail}
											alt="thumbnail preview"
											className="mt-2 h-16 w-28 object-cover rounded shadow"
										/>
									)}
								</div>
							</div>

							<div className="w-full grid gap-4 grid-cols-2 mb-3">
								<div className="relative w-full">
									<label className={labelClass}>Order</label>
									<input
										type="number"
										placeholder="Eg. 1"
										value={lesson.order}
										onChange={(e) =>
											handleLessonChange(mi, li, "order", e.target.value)
										}
										className={inputClass}
										disabled={isDisabled}
									/>
								</div>
								<div className="relative w-full flex items-center gap-2 mt-4">
									<input
										type="checkbox"
										id={`preview-${mi}-${li}`}
										checked={lesson.isPreview}
										onChange={(e) =>
											handleLessonChange(mi, li, "isPreview", e.target.checked)
										}
										className="h-4 w-4 rounded border-slate-300 text-slate-600 cursor-pointer"
										disabled={isDisabled}
									/>
									<label
										htmlFor={`preview-${mi}-${li}`}
										className="text-xs font-bold uppercase text-slate-600 cursor-pointer">
										Is Preview?
									</label>
								</div>
							</div>

							<div className="relative w-full mb-3">
								<label className={labelClass}>Practice Task</label>
								<textarea
									placeholder="Describe the practice task..."
									value={lesson.practiceTask}
									onChange={(e) =>
										handleLessonChange(mi, li, "practiceTask", e.target.value)
									}
									rows={2}
									className={inputClass}
									disabled={isDisabled}
								/>
							</div>

							{/* Resources */}
							<div className="mt-3">
								<div className="flex items-center justify-between mb-2">
									<h6 className="uppercase text-slate-400 text-xs font-bold">
										Resources
									</h6>
									<button
										disabled={isDisabled}
										type="button"
										onClick={() => addResource(mi, li)}
										className="text-xs font-semibold text-slate-500 hover:text-slate-700 border border-slate-300 hover:border-slate-500 px-2 py-1 rounded transition-all duration-150">
										+ Add Resource
									</button>
								</div>

								{lesson.resources.map((res, ri) => (
									<div key={ri} className="flex items-center gap-2 mb-2">
										<input
											disabled={isDisabled}
											type="text"
											placeholder="Resource title"
											value={res.title}
											onChange={(e) =>
												handleResourceChange(
													mi,
													li,
													ri,
													"title",
													e.target.value,
												)
											}
											className={`${inputClass} flex-1`}
										/>
										<input
											disabled={isDisabled}
											type="text"
											placeholder="URL"
											value={res.url}
											onChange={(e) =>
												handleResourceChange(mi, li, ri, "url", e.target.value)
											}
											className={`${inputClass} flex-1`}
										/>
										{lesson.resources.length > 1 && (
											<button
												disabled={isDisabled}
												type="button"
												onClick={() => removeResource(mi, li, ri)}
												className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0 transition-colors duration-150">
												✕
											</button>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default Lessons