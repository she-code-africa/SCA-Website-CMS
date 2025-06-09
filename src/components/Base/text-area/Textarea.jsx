import { Label } from "..";

const Textarea = ({
	label,
	required,
	className,
	value,
	name,
	onChange,
	disabled,
}) => {
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		!disabled ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	return (
		<>
			{label && <Label htmlFor={name} name={label} />}

			<textarea
				required={required}
				className={`${inputClass} ${className}`}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
		</>
	);
};

export default Textarea;
