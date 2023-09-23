import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";

const Modal = ({ isOpen, onClose, title, children }) => {
	useEffect(() => {
		// Function to set the body overflow to "hidden" when the modal is open
		const handleBodyOverflow = () => {
			if (isOpen) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "auto";
			}
		};

		// Call the function initially when the component mounts
		handleBodyOverflow();

		// Cleanup function to reset body overflow when the component unmounts
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isOpen]);
	return (
		<div
			className={`${
				isOpen ? "fixed" : "hidden"
			} inset-0 flex items-center justify-center z-50 h-screen top-0 w-full bg-black-with-opacity left-0`}>
			<div className="bg-white rounded-lg z-60 w-1/2 max-w-md">
				<div className="flex w-full items-center justify-between py-2 px-4 my-2">
					<h2 className="text-lg">{title}</h2>
					<button onClick={onClose}>
						<RxCross1 />
					</button>
				</div>
				<hr />
				<div className="px-4 flex justify-center my-4">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
