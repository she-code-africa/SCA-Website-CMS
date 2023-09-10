import api from "../utils/api";
const baseUrl = process.env.REACT_APP_BASE_URL;

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
	const event = await api.patch(`${baseUrl}/events/${id}`);
	return event;
}

export async function archiveEvent(id) {
	const event = await api.patch(`${baseUrl}/events/${id}`);
	return event;
}

export async function getChapters() {
	const chapters = await api.get(`${baseUrl}/chapters/member-chapters`);
	return chapters;
}

export async function getReach() {
	const reach = await api.get(`${baseUrl}/reach`);
	return reach;
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

export async function getSuccessStories() {
	const partners = await api.get(`${baseUrl}/program-success`);
	return partners;
}

export async function getTeams() {
	const teams = await api.get(`${baseUrl}/teams/members`);
	return teams;
}

export async function getTeamCategories() {
	const teamCategories = await api.get(`${baseUrl}/teams/categories`);
	return teamCategories;
}

export async function getPrograms() {
	const programs = await api.get(`${baseUrl}/programs/member-programs`);
	return programs;
}

export async function getProgramsCategories() {
	const programsCategories = await api.get(`${baseUrl}/programs/categories`);
	return programsCategories;
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
	return await api.delete(`${baseUrl}/job/category/${id}`, data);
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
	return await api.delete(`${baseUrl}/job/types/${id}`, data);
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
	return await api.patch(`${baseUrl}/company/${id}/archive`);
}

export async function addTeamMember(data) {
	const member = await api.post(`${baseUrl}/teams/members`, data);
	return member;
}
export async function editTeamMember(data) {
	const member = await api.put(`${baseUrl}/teams/member`, data);
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

export async function deleteTeamCategory({ catId }) {
	const categories = await api.delete(`${baseUrl}/teams/categories/${catId}`);
	return categories;
}

export async function getTestimonials() {
	return await api.get(`${baseUrl}/testimonials`);
}

export async function getTestimonial(id) {
	return await api.get(`${baseUrl}/testimonials/${id}`);
}

export async function createTestimonial(data) {
	return await api.get(`${baseUrl}/testimonials/`, data);
}

export async function editTestimonial({ id, data }) {
	return await api.get(`${baseUrl}/testimonials/${id}`, data);
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

export async function getSchools() {
	return await api.get(`${baseUrl}/schools`);
}

export async function createSchool(data) {
	return await api.post(`${baseUrl}/schools`, data);
}

export async function editSchool({ id, name: data }) {
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
