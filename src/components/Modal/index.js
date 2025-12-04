import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	className,
	header,
	customHeight = false
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
			} inset-0 z-50 left-0 w-full bg-black-with-opacity`}>
			<section className="flex items-center justify-center w-full h-screen px-4">
				{/* Constrain modal height and prevent the modal itself from growing past viewport */}
				<div
					className={`${
						className || ""
					} bg-white rounded-lg w-full max-w-3xl mx-auto overflow-hidden max-h-[90vh]`}>
					{/* Header */}
					<div className="flex w-full items-center justify-between py-2 px-4 border-b">
						{title && <h2 className="text-lg font-semibold">{title}</h2>}
						{header && <>{header()}</>}
						<button onClick={onClose} className="cursor-pointer ml-3">
							<RxCross1 />
						</button>
					</div>

					{/* Scrollable content area: limits height relative to viewport minus header */}
					<div
						className="px-4 py-4"
						style={{
							// leave room for header/footer; adjust 72px if you change header/footer height
							maxHeight: customHeight
								? "calc(95vh - 72px)"
								: "calc(90vh - 72px)",
							overflowY: "auto"
						}}>
						{children}
					</div>
				</div>
			</section>
		</div>
	);
};

export default Modal;
