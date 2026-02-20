import asyncHandler from "../utils/asyncHandler.js";

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error("Please upload a file");
    }

    res.status(200).send({
        message: "Image uploaded successfully",
        url: `/uploads/${req.file.filename}`,
    });
});
