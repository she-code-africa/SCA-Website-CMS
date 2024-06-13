import { Label } from "..";

const Select = ({
	options,
	className,
	value,
	onChange,
	name,
	disabled,
	label,
}) => {
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		!disabled ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	return (
		<>
			{label && <Label htmlFor={name} name={label} />}

			<select
				className={`${inputClass} ${className}`}
				value={value}
				onChange={onChange}
				name={name}
				disabled={disabled}>
				{options.map((option) => (
					<option value={option._id} key={option._id}>
						{option.name ?? option.title}
					</option>
				))}
			</select>
		</>
	);
};

export default Select;
