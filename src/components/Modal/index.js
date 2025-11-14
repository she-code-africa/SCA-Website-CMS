import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	className,
	header,
	customHeight = false,
}) => {
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
			} inset-0  z-50 bottom-0  top-0 w-full bg-black-with-opacity left-0`}>
			<section className="flex items-center justify-center w-full h-screen">
				<div
					className={`${className} bg-white rounded-lg w-1/2 max-w-md mx-auto overflow-y-auto`}
					style={{ height: customHeight ? "95vh" : "auto" }}>
					{/* z-60 */}
					<div className="flex w-full items-center justify-between py-2 px-4 my-2">
						{title && <h2 className="text-lg font-semibold">{title}</h2>}
						{header && <>{header()}</>}
						<button onClick={onClose} className="cursor-pointer">
							<RxCross1 />
						</button>
					</div>
					<div className="px-4 flex justify-center my-4 ">{children}</div>
				</div>
			</section>
		</div>
	);
};

export default Modal;
