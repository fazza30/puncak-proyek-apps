export const getImageUrl = (
	path?: string,
) => {
	if (!path) return "";

	return `${import.meta.env.VITE_API_URL}${path}`;
};