import React from "react";
import SyncLoader from "react-spinners/SyncLoader";

const Loader = () => {
	const override = {
		display: "block",
		margin: "0 auto",
		borderColor: "red",
	};
	return (
		<div className="flex w-full justify-center">
			<SyncLoader
				color="#EC4899"
				cssOverride={override}
				size={25}
				aria-label="Loading Spinner"
				data-testid="loader"
			/>
		</div>
	);
};

export default Loader;
