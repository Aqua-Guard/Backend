import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

export default multer({
    storage: diskStorage({
        destination: (req, file, callback) => {
            const __dirname = dirname(fileURLToPath(
                import.meta.url));
            callback(null, join(__dirname, "../public/images/produit"));
        },
        filename: (req, file, callback) => {
            const extension = MIME_TYPES[file.mimetype];
            callback(null, Date.now() + "." + extension);
        },
    }),
   // limits: 512 * 1024,
}).single("image");
