import multer from 'multer'
const storage = multer.memoryStorage();
const storages = multer.diskStorage({
 filename: (req, file, cb) => {
  cb(null, Date.now() + "-" + file.originalname);
 }
});
//single upload
export const singleUpload = multer({storage}).single("image")
//multiple upload upto 5 images
export const multipleUpload = multer({storage}).array("images",5);
export const multipleUploadChatfiles = multer({ storage }).array("files", 10);

export const upload = multer({ storages });
