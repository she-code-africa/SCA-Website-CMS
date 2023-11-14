import React from "react";
import BarLoader from "react-spinners/BarLoader";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
	display: "block",
	margin: "0 auto",
	borderColor: "#EC4899",
};

const Loader = () => {
	return (
		<span className="min-h-[30vh] flex justify-center items-center w-full">
			<ClipLoader
				color="#"
				cssOverride={override}
				size={50}
				aria-label="Loading Spinner"
				data-testid="loader"
				className=""
			/>
		</span>
	);
};

export default Loader;

export const BarrLoader = () => {
	return (
		<BarLoader
			color="#EC4899"
			cssOverride={override}
			size={25}
			aria-label="Loading Spinner"
			data-testid="loader"
		/>
	);
};
