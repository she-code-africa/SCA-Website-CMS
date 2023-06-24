import Table from "components/Table";
import React from "react";
// import Category from "components/Categories";
import { initiatives as header } from "utils/headers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getInitiatives } from "services";
import Loader from "components/Loader";
import { deleteInitiative } from "services";

const Initiatives = () => {
	const queryClient = useQueryClient();
	const { data, isSuccess, isLoading } = useQuery(
		"initiatives",
		getInitiatives
	);
	const { mutate, deleting } = useMutation(deleteInitiative, {
		onSuccess: () => {
			queryClient.invalidateQueries("initiatives");
		},
		onError: () => {
			console.log("error");
		},
	});
	// const [categories] = useState(ScholarshipCategories);
	// const addCategory = useCallback(() => {
	// 	console.log("add Category");
	// }, []);
	const handleDelete = (id) => {
		mutate(id);
	};

	return (
		<>
			{isLoading || deleting ? (
				<Loader />
			) : (
				<div className="flex flex-w w-full flex-col lg:flex-row -mt-20">
					<div className="w-full px-4">
						{header && isSuccess && (
							<Table
								headers={header}
								tableData={data}
								tableHead="Initiatives"
								actions={["view", "edit", "delete"]}
								handleDelete={handleDelete}
								addNew
							/>
						)}
					</div>
					{/* <div className="w-full lg:w-3/12 px-4">
						<Category
							title="Scholarship Categories"
							categories={categories}
							addCategory={addCategory}
						/>
					</div> */}
				</div>
			)}
		</>
	);
};

export default Initiatives;
