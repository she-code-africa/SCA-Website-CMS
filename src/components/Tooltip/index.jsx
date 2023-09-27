import React from "react";

const Tooltip = ({ children, content }) => {
	return (
		<span className="relative group">
			{children}
			<span className="hidden rounded-lg group-hover:flex text-[8px] absolute bg-gray-100 px-4 break-keep py-2">
				{content}
			</span>
		</span>
	);
};

export default Tooltip;
