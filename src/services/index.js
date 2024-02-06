import api from "../utils/api";
const baseUrl = process.env.REACT_APP_BASE_URL;
console.log(baseUrl, "base url");

export async function getEvents() {
	const events = await api.get(`${baseUrl}/events`);
	return events;
}

export async function getEvent(id) {
	const event = await api.get(`${baseUrl}/events/${id}`);
	return event;
}

export async function deleteEvent(id) {
	await api.delete(`${baseUrl}/events/${id}`);
}

export async function editEvent({ id, data }) {
	const event = await api.put(`${baseUrl}/events/${id}`, data);
	return event;
}

export async function publishEvent(id) {
	const event = await api.patch(`${baseUrl}/events/${id}/publish`);
	return event;
}

export async function archiveEvent(id) {
	const event = await api.patch(`${baseUrl}/events/${id}/archive`);
	return event;
}

export async function getPartners() {
	const partners = await api.get(`${baseUrl}/partners`);
	return partners;
}

export async function getPartner(id) {
	return await api.get(`${baseUrl}/partners/${id}`);
}

export async function createPartner(data) {
	await api.post(`${baseUrl}/partners`, data);
}

export async function editPartner({ id, data }) {
	await api.put(`${baseUrl}/partners/${id}`, data);
}

export async function deletePartner(id) {
	await api.delete(`${baseUrl}/partners/${id}`);
}

export async function getTeams() {
	const teams = await api.get(`${baseUrl}/teams/members`);
	return teams;
}

export async function getTeamCategories() {
	const teamCategories = await api.get(`${baseUrl}/teams/categories`);
	return teamCategories;
}

export async function mutateEnquires(enquiryData) {
	const enquiresResponse = await api.post(`${baseUrl}/enquiry`, enquiryData);
	return enquiresResponse;
}

export async function login(data) {
	const auth = await api.post(`${baseUrl}/auth/login`, data);
	return auth;
}

export async function getEnquiries() {
	const enquiresResponse = await api.get(`${baseUrl}/enquiry`);
	return enquiresResponse;
}

export async function getJobs() {
	const jobsResponse = await api.get(`${baseUrl}/job/postings`);
	return jobsResponse;
}

export async function getJob(id) {
	const job = await api.get(`${baseUrl}/job/postings/${id}`);
	return job;
}

export async function deleteJob(id) {
	return await api.delete(`${baseUrl}/job/postings/${id}`);
}

export async function createJob(data) {
	return await api.post(`${baseUrl}/job/postings`, data);
}

export async function editJob({ id, data }) {
	return await api.put(`${baseUrl}/job/postings/${id}`, data);
}

export async function publishJob({ id }) {
	const job = await api.patch(`${baseUrl}/job/postings/${id}/publish`);
	return job;
}

export async function archiveJob({ id }) {
	const job = await api.patch(`${baseUrl}/job/postings/${id}/archive`);
	return job;
}

export async function getJobCategories() {
	const jobCategories = await api.get(`${baseUrl}/job/category`);
	return jobCategories;
}

export async function createJobCategories(data) {
	return await api.post(`${baseUrl}/job/category`, data);
}

export async function deleteJobCategory(id) {
	return await api.delete(`${baseUrl}/job/category/${id}`);
}

export async function editJobCategory({ id, data }) {
	return await api.put(`${baseUrl}/job/category/${id}`, data);
}

export async function getJobTypes() {
	const jobTypes = await api.get(`${baseUrl}/job/types`);
	return jobTypes;
}

export async function createJobType(data) {
	return await api.post(`${baseUrl}/job/types`, data);
}

export async function deleteJobType(id) {
	return await api.delete(`${baseUrl}/job/types/${id}`);
}

export async function editJobType({ id, data }) {
	return await api.put(`${baseUrl}/job/types/${id}`, data);
}

export async function getCompanies() {
	const companies = await api.get(`${baseUrl}/company`);
	return companies;
}

export async function getCompany(id) {
	return await api.get(`${baseUrl}/company/${id}`);
}

export async function editCompany({ id, data }) {
	return await api.put(`${baseUrl}/company/${id}`, data);
}

export async function archiveCompany(id) {
	return await api.patch(`${baseUrl}/company/${id}/archive`);
}

export async function unarchiveCompany(id) {
	return await api.patch(`${baseUrl}/company/${id}/unarchive`);
}

export async function addTeamMember(data) {
	const member = await api.post(`${baseUrl}/teams/members`, data);
	return member;
}
export async function editTeamMember({ id, catId, data }) {
	const member = await api.put(
		`${baseUrl}/teams/categories/${catId}/members/${id}`,
		data
	);
	return member;
}

export async function addTeamCategory(data) {
	const category = await api.post(`${baseUrl}/teams/categories`, data);
	return category;
}

export async function getTeamMember(catId, id) {
	const member = await api.get(
		`${baseUrl}/teams/categories/${catId}/members/${id}`
	);
	return member;
}

export async function createEvent(data) {
	const event = await api.post(`${baseUrl}/events`, data);
	return event;
}

export async function publishTeamMember({ catId, id }) {
	const member = await api.patch(
		`${baseUrl}/teams/categories/${catId}/members/${id}/publish`
	);
	return member;
}

export async function archiveTeamMember({ catId, id }) {
	const member = await api.patch(
		`${baseUrl}/teams/categories/${catId}/members/${id}/archive`
	);
	return member;
}

export async function deleteTeamMember({ catId, id }) {
	const member = await api.delete(
		`${baseUrl}/teams/categories/${catId}/members/${id}`
	);
	return member;
}

export async function editTeamCategories({ catId, name: data }) {
	const categories = await api.put(
		`${baseUrl}/teams/categories/${catId}`,
		data
	);
	return categories;
}

export async function deleteTeamCategory(id) {
	const categories = await api.delete(`${baseUrl}/teams/categories/${id}`);
	return categories;
}

export async function getTestimonials() {
	return await api.get(`${baseUrl}/testimonials`);
}

export async function getTestimonial(id) {
	return await api.get(`${baseUrl}/testimonials/${id}`);
}

export async function deleteTestimonial(id) {
	return await api.delete(`${baseUrl}/testimonials/${id}`);
}

export async function createTestimonial(data) {
	return await api.post(`${baseUrl}/testimonials`, data);
}

export async function editTestimonial({ id, data }) {
	return await api.put(`${baseUrl}/testimonials/${id}`, data);
}

export async function updateTestimonialStatus({ id, data }) {
	return await api.post(`${baseUrl}/testimonials/change-state/${id}`, data);
}

export async function getUsers() {
	return await api.get(`${baseUrl}/users`);
}

export async function getInitiatives() {
	return await api.get(`${baseUrl}/initiatives`);
}

export async function getInitiative(id) {
	return await api.get(`${baseUrl}/initiatives/${id}`);
}

export async function createInitiative(data) {
	return await api.post(`${baseUrl}/initiatives`, data);
}

export async function editInitiative({ id, data }) {
	return await api.put(`${baseUrl}/initiatives/${id}`, data);
}

export async function deleteInitiative(id) {
	return await api.delete(`${baseUrl}/initiatives/${id}`);
}

export async function getSchoolPrograms() {
	return await api.get(`${baseUrl}/school-programs`);
}

export async function createSchoolProgram(data) {
	return await api.post(`${baseUrl}/school-programs`, data);
}

export async function editSchoolProgram({ id, data }) {
	return await api.put(`${baseUrl}/school-programs/${id}`, data);
}

export async function getSchoolProgram(id) {
	return await api.get(`${baseUrl}/school-programs/${id}`);
}

export async function publishSchoolProgram(id) {
	return await api.put(`${baseUrl}/school-programs/${id}/publish`);
}

export async function unpublishSchoolProgram(id) {
	return await api.put(`${baseUrl}/school-programs/${id}/unpublish`);
}

export async function getSchool(id) {
	return await api.get(`${baseUrl}/schools/${id}`);
}

export async function getSchools() {
	return await api.get(`${baseUrl}/schools`);
}

export async function createSchool(data) {
	return await api.post(`${baseUrl}/schools`, data);
}

export async function editSchool({ id, data }) {
	return await api.put(`${baseUrl}/schools/${id}`, data);
}

export async function deleteSchool(id) {
	return await api.delete(`${baseUrl}/schools/${id}`);
}

export async function getCourse(id) {
	return await api.get(`${baseUrl}/courses/${id}`);
}

export async function getCourses() {
	return await api.get(`${baseUrl}/courses`);
}

export async function createCourse(data) {
	return await api.post(`${baseUrl}/courses`, data);
}

export async function editCourse({ id, data }) {
	return await api.put(`${baseUrl}/courses/${id}`, data);
}

export async function deleteCourse(id) {
	return await api.delete(`${baseUrl}/courses/${id}`);
}

export async function getVolunteerRequests() {
	return await api.get(`${baseUrl}/volunteer-request/`);
}

export async function getVolunteerRequest(id) {
	return await api.get(`${baseUrl}/volunteer-request/${id}`);
}

export async function getOurReach() {
	return await api.get(`${baseUrl}/reach`);
}

export async function getReach(id) {
	return await api.get(`${baseUrl}/reach/${id}`);
}

export async function createOurReach(data) {
	return await api.post(`${baseUrl}/reach`, data);
}

export async function editOurReach({ id, data }) {
	return await api.put(`${baseUrl}/reach/${id}`, data);
}

export async function deleteOurReach(id) {
	return await api.delete(`${baseUrl}/reach/${id}`);
}

export async function getTalentRequests() {
	return await api.get(`${baseUrl}/talent-request`);
}

export async function getTalentRequest(id) {
	return await api.get(`${baseUrl}/talent-request/${id}`);
}

export async function createTalentRequest(data) {
	return await api.post(`${baseUrl}/talent-request`, data);
}

export async function editTalentRequest({ id, data }) {
	return await api.put(`${baseUrl}/talent-request/${id}`, data);
}

export async function getSuccessStories() {
	return await api.get(`${baseUrl}/program-success`);
}

export async function getSuccessStory(id) {
	return await api.get(`${baseUrl}/program-success/${id}`);
}

export async function createSuccessStory(data) {
	return await api.post(`${baseUrl}/program-success`, data);
}

export async function editSuccessStory({ id, data }) {
	return await api.put(`${baseUrl}/program-success/${id}`, data);
}

export async function publishSuccessStory(id) {
	return await api.patch(`${baseUrl}/program-success/${id}/publish`);
}

export async function archiveSuccessStory(id) {
	return await api.patch(`${baseUrl}/program-success/${id}/publish`);
}

export async function getPrograms() {
	return await api.get(`${baseUrl}/programs/member-programs`);
}

export async function createProgram(data) {
	return await api.post(`${baseUrl}/programs/member-programs`, data);
}

export async function getProgram(catId, id) {
	return await api.get(
		`${baseUrl}/programs/categories/${catId}/member-programs/${id}`
	);
}

export async function deleteProgram({ id, categoryId }) {
	return await api.delete(
		`${baseUrl}/programs/categories/${categoryId}/member-programs/${id}`
	);
}

export async function editProgram({ id, categoryId, data }) {
	return await api.put(
		`${baseUrl}/programs/categories/${categoryId}/member-programs/${id}`,
		data
	);
}

export async function publishProgram({ id, categoryId }) {
	return await api.patch(
		`${baseUrl}/programs/categories/${categoryId}/member-programs/${id}/publish`
	);
}

export async function archiveProgram({ id, categoryId }) {
	return await api.patch(
		`${baseUrl}/programs/categories/${categoryId}/member-programs/${id}/archive`
	);
}

export async function getProgramCategories() {
	return await api.get(`${baseUrl}/programs/categories`);
}

export async function createProgramCategory(data) {
	return await api.post(`${baseUrl}/programs/category`, data);
}

export async function deleteProgramCategory(id) {
	return await api.delete(`${baseUrl}/programs/category/${id}`);
}

export async function editProgramCategory({ id, data }) {
	return await api.delete(`${baseUrl}/programs/category/${id}`, data);
}

export async function getChapterCategories() {
	return await api.get(`${baseUrl}/chapters/categories`);
}

export async function createChapterCategory(data) {
	return await api.post(`${baseUrl}/chapters/categories`, data);
}

export async function deleteChapterCategory(id) {
	return await api.delete(`${baseUrl}/chapters/categories/${id}`);
}

export async function editChapterCategory({ id, data }) {
	return await api.put(`${baseUrl}/chapters/categories/${id}`, data);
}

export async function getChapters() {
	return await api.get(`${baseUrl}/chapters/member-chapters`);
}

export async function createChapter(data) {
	return await api.post(`${baseUrl}/chapters/member-chapters`, data);
}

export async function deleteChapter({ id, categoryId }) {
	return await api.delete(
		`${baseUrl}/chapters/categories/${categoryId}/member-chapters/${id}`
	);
}

export async function getChapter(categoryId, id) {
	return await api.get(
		`${baseUrl}/chapters/categories/${categoryId}/member-chapters/${id}`
	);
}

export async function editChapter({ id, categoryId, data }) {
	return await api.put(
		`${baseUrl}/chapters/categories/${categoryId}/member-chapters/${id}`,
		data
	);
}

export async function getReports() {
	return await api.get(`${baseUrl}/reports`);
}

export async function getReport(id) {
	return await api.get(`${baseUrl}/reports/${id}`);
}

export async function createReport(data) {
	return await api.post(`${baseUrl}/reports`, data);
}

export async function editReport({ id, data }) {
	return await api.put(`${baseUrl}/reports/${id}`, data);
}

export async function deleteReport({ id }) {
	return await api.delete(`${baseUrl}/reports`, id);
}
