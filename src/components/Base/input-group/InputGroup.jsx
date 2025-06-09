const InputGroup = ({ children, className }) => {
	return (
		<div className={`relative w-full mb-3 flex items-center ${className}`}>
			{children}
		</div>
	);
};

export default InputGroup;
