import React from "react";
import { RxCross1 } from "react-icons/rx";

const Modal = ({ isOpen, onClose, title, children }) => {
	return (
		<div
			className={`${
				isOpen ? "absolute" : "hidden"
			} inset-0 flex items-center justify-center z-50 h-screen top-0 w-full bg-black left-0`}>
			<div className="fixed inset-0 bg-gray-900 opacity-50"></div>
			<div className="bg-white rounded-lg z-60 w-1/2">
				<div className="flex w-full items-center justify-between py-2 px-4 mb-2">
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
