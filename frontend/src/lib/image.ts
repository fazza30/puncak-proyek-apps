export const getImageUrl = (
	path?: string,
) => {
	if (!path) return "";

	const cleanPath =
		path.startsWith("/")
			? path
			: `/${path}`;

	return `${import.meta.env.VITE_API_URL}${cleanPath}`;
};