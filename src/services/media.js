import api from "../utils/api";
const baseUrl = process.env.REACT_APP_BASE_URL;

export const createMedia = async (data) => {
	const media = await api.post(`${baseUrl}/media`, data);
	return media;
};

export const getAllMedia = async () => {
	return await api.get(`${baseUrl}/media`);
};

export const getAMedia = async (id) => {
	return await api.get(`${baseUrl}/media/${id}`);
};

export const deleteMedia = async (id) => {
	return await api.delete(`${baseUrl}/media/${id}`);
};

export const editMedia = async ({ id, data }) => {
	return await api.put(`${baseUrl}/media/${id}`, data);
};
