import api from "../utils/api";
const baseUrl = process.env.REACT_APP_BASE_URL;

export async function getEvents() {
	const events = await api.get(`${baseUrl}/events`);
	return events;
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

export async function getJobCategories() {
	const jobCategories = await api.get(`${baseUrl}/job/category`);
	return jobCategories;
}

export async function getJobTypes() {
	const jobTypes = await api.get(`${baseUrl}/job/types`);
	return jobTypes;
}

export async function getCompanies() {
	const companies = await api.get(`${baseUrl}/company`);
	return companies;
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

export async function createEvent() {
	const event = await api.post(`${baseUrl}/events`);
	return event;
}

export async function publishTeamMember(catId, id) {
	const member = await api.post(
		`${baseUrl}/teams/categories/${catId}/members/${id}/publish`
	);
	return member;
}

export async function archiveTeamMember(catId, id) {
	const member = await api.post(
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
