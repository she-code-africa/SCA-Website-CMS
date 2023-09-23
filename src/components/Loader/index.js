import React from "react";
import BarLoader from "react-spinners/BarLoader";
import ClipLoader from "react-spinners/ClipLoader";

const override = {
	display: "block",
	margin: "0 auto",
	borderColor: "red",
};

const Loader = () => {
	return (
		<div className="flex w-full justify-center min-h-[50vh] items-center">
			<ClipLoader
				color="#EC4899"
				cssOverride={override}
				size={50}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		</div>
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
