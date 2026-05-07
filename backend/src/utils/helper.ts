export const getAssetUrl = (path = "thumbnails") => {
    const appUrl = process.env.APP_URL ?? ""

    return `${appUrl}/uploads/${path}/`;
}