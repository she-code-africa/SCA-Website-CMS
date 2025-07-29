import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PrimaryInput = ({
	edit,
	newItem,
	name,
	label,
	handleInputChange,
	isDate = false,
	eventDate,
	value,
	onChangeDate,
}) => {
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	return (
		<>
			{isDate ? (
				<div className="relative w-full mb-3 flex items-center ">
					<label
						className="block uppercase text-slate-600 text-xs font-bold  basis-3/12"
						htmlFor="eventDate">
						Event Date
					</label>
					<DatePicker
						selected={eventDate ? new Date(eventDate) : new Date()}
						dateFormat="yyyy-MM-dd"
						onChange={onChangeDate}
						className={`${inputClass} ml-6 !w-[95%]`}
						disabled={!edit && !newItem}
					/>
				</div>
			) : (
				<div className="relative w-full mb-3 flex items-center">
					<label
						className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
						htmlFor="name">
						{label}
					</label>
					<input
						required
						type="text"
						className={`${inputClass}`}
						name={name}
						value={value}
						onChange={handleInputChange}
						disabled={!edit && !newItem}
						placeholder={`Enter ${label} here`}
					/>
				</div>
			)}
		</>
	);
};

export default PrimaryInput;
