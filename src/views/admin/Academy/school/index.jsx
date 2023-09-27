import Category from "components/Categories";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getSchools, createSchool, editSchool, deleteSchool } from "services";

const School = () => {
	const [schools, setSchools] = useState([]);
	const queryClient = useQueryClient();
	useQuery("schools", getSchools, {
		onSuccess: (data) => {
			setSchools(data);
		},
	});
	const { mutate: addSchool } = useMutation(createSchool, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});
	const { mutate: updateSchool } = useMutation(editSchool, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});

	const { mutateAsync: removeSchool } = useMutation(deleteSchool, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schools"] });
		},
	});

	return (
		<>
			<Category
				title="Schools"
				categories={schools}
				addCategory={addSchool}
				remove={removeSchool}
				update={updateSchool}
			/>
		</>
	);
};

export default School;
