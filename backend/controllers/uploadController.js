export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
    }

    // After multer-storage-cloudinary finishes, it adds 'path' to req.file
    // which contains the secure_url from Cloudinary.
    res.status(200).json({
        message: "Image uploaded successfully",
        url: req.file.path,
    });
};
