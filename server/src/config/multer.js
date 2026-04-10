import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",                                      // PDF
  "application/msword",                                   // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-powerpoint",                        // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  }
});

export default upload;