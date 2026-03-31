import React from "react";

const CustomInput = ({
	inputClass,
	value,
	label,
	placeholder,
	nameId,
	isDisabled,
	handleInputChange,
	type = "text",
	isRequired = false,
}) => {
	return (
		<div className="relative w-full mb-5 flex flex-col ">
			<label
				className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
				htmlFor="link">
				{label}
			</label>
			<input
				required={isRequired}
				type={type}
				className={`${inputClass} mt-3`}
				value={value}
				placeholder={placeholder}
				name={nameId}
				onChange={handleInputChange}
				disabled={isDisabled}
			/>
		</div>
	);
};

export default CustomInput;
