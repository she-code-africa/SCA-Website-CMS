import React, { useState } from "react";
import { getTeamCategories, addTeamCategory } from "services";
import { useQuery, useMutation } from "react-query";
import { editTeamCategories } from "services";
import { deleteTeamCategory } from "services";
import { useQueryClient } from "react-query";
import Category from "components/Categories";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeamCategory = () => {
	const queryClient = useQueryClient();
	const [categories, setCategories] = useState([]);
	const { isLoading } = useQuery("team-categories", getTeamCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
		onError: () => {
			console.log("error");
			toast.error("Could not fetch team categories");
		},
	});
	const { mutate: addCategory } = useMutation(addTeamCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-categories"] });
		},
	});
	const { mutateAsync: updateCategory } = useMutation(editTeamCategories, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-categories"] });
		},
	});

	const { mutateAsync: deleteCategory } = useMutation(deleteTeamCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-categories"] });
		},
	});

	return (
		<>
			<Category
				isLoading={isLoading}
				categories={categories}
				title="Team Categories"
				remove={deleteCategory}
				update={updateCategory}
				addCategory={addCategory}
			/>
			<ToastContainer />
		</>
	);
};

export default TeamCategory;
