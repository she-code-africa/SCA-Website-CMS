import React from "react";
import Modal from ".";

const DeleteModal = ({
	title = "Delete",
	handleModal,
	handleDelete,
	isOpen,
}) => {
	return (
		<div>
			<Modal title={title} isOpen={isOpen} onClose={handleModal}>
				<div>
					<div>
						<p>Are you sure you want to delete this Item?</p>
					</div>
					<div className="flex justify-center mt-3">
						<button
							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
							onClick={() => {
								handleDelete();
							}}>
							Yes
						</button>
						<button
							className="bg-slate-600 px-4 py-1 text-white rounded"
							onClick={handleModal}>
							No
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default DeleteModal;
