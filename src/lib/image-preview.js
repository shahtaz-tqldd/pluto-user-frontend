export const canRevokePreview = (image) =>
  typeof image?.preview === "string" && image.preview.startsWith("blob:");

export const createPreviewImage = (file) => ({
  file,
  preview: URL.createObjectURL(file),
});
