import Category from "components/Categories";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteJobType } from "services";
import { editJobType } from "services";
import { editJobCategory } from "services";
import { createJobType } from "services";
import { deleteJobCategory } from "services";
import { createJobCategories } from "services";
import { getJobCategories, getJobTypes } from "services";

const JobTypeCategory = () => {
	const [jobTypes, setJobTypes] = useState([]);
	const [jobCategories, setJobCategories] = useState([]);
	const queryClient = useQueryClient();

	useQuery("categories", getJobCategories, {
		onSuccess: (data) => {
			setJobCategories(data);
		},
		onError: (err) => {
			console.log(err);
		},
	});
	useQuery("types", getJobTypes, {
		onSuccess: (data) => {
			setJobTypes(data);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const { mutate: addJobCategory } = useMutation(createJobCategories, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const { mutate: updateJobCategory } = useMutation(editJobCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const { mutateAsync: removeJobCategory } = useMutation(deleteJobCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const { mutate: addJobType } = useMutation(createJobType, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["types"] });
		},
	});
	const { mutate: updateJobType } = useMutation(editJobType, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["types"] });
		},
	});

	const { mutateAsync: removeJobType } = useMutation(deleteJobType, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["types"] });
		},
	});

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words w-full mb-6">
				<Category
					title="Job Types"
					categories={jobTypes}
					addCategory={addJobType}
					remove={removeJobType}
					update={updateJobType}
				/>
				<Category
					title="Job Categories"
					categories={jobCategories}
					addCategory={addJobCategory}
					remove={removeJobCategory}
					update={updateJobCategory}
				/>
			</div>
		</>
	);
};

export default JobTypeCategory;
