import React from "react";

const CustomSelect = ({
	inputClass,
	value,
	label,
	placeholder,
	nameId,
	isDisabled,
	handleInputChange,
	options,
	isRequired = false,
}) => {
	return (
		<div className="relative w-full mb-5 flex flex-col ">
			<label
				className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
				htmlFor={nameId}>
				{label}
			</label>

			<select
				required={isRequired}
				className={`${inputClass} mt-3`}
				value={value}
				placeholder={placeholder}
				name={nameId}
				onChange={handleInputChange}
				disabled={isDisabled}>
				<option value="">{placeholder}</option>

				{options}
			</select>
		</div>
	);
};

export default CustomSelect;
