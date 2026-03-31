import React from "react";

const CustomTextArea = ({
	inputClass,
	value,
	label,
	placeholder,
	nameId,
	isDisabled,
	handleInputChange,
}) => {
	return (
		<div className="relative w-full mb-5 flex  flex-col ">
			<label
				className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
				htmlFor={nameId}>
				{label}
			</label>
			<textarea
				className={`${inputClass}`}
				name={nameId}
				value={value}
				placeholder={placeholder}
				onChange={handleInputChange}
				rows={4}
				disabled={isDisabled}
			/>
		</div>
	);
};

export default CustomTextArea;
