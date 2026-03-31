import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

const useSagEnquiries = ({ id, handleModal }) => {
	const queryClient = useQueryClient();
	const initial = {
		fullName: "",
		email: "",
		description: "",
		status: "open",
	};
	const [enquiry, setEnquiry] = useState(initial);
	const [edit, setEdit] = useState(false);

	// const { isLoading } = useQuery(["enquiry", id], () => getEnquiry(id), {
	//   onSuccess: (data) => {
	//     setEnquiry(data);
	//   },
	//   enabled: !!id,
	// });

	// const { mutateAsync: updateEnquiry, isLoading: updating } = useMutation(
	//   editEnquiry,
	//   {
	//     onSuccess: () => {
	//       toast.success("Enquiry updated Successfully");
	//       queryClient.invalidateQueries(["enquiry"]);
	//       queryClient.invalidateQueries(["enquiries"]);
	//       handleModal();
	//     },
	//     onError: () => {
	//       toast.error("Could not update Enquiry");
	//     },
	//   },
	// );

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setEnquiry((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setEnquiry],
	);

	const handleStatusSelect = (e) => {
		setEnquiry((prev) => ({
			...prev,
			status: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// updateEnquiry({ id, status: enquiry.status });
	};

	const isLoading = false;
	const updating = false;
	return {
		enquiry,
		isLoading,
		handleSubmit,
		updating,
		handleInputChange,
		edit,
		setEdit,
		handleStatusSelect,
	};
};

export default useSagEnquiries;
