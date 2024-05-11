const Label = ({ htmlFor, name, className }) => {
	return (
		<label
			className={`block uppercase text-slate-600 text-xs font-bold basis-3/12 ${className}`}
			htmlFor={htmlFor}>
			{name}
		</label>
	);
};

export default Label;
