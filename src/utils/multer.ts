import multer from "multer";

// Configure multer to use memory storage
const storage = multer.memoryStorage();

export const uploadMedia = multer({ storage }).array("media[]", 10);
