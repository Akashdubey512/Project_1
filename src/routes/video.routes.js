import { Router } from "express";
import {
    getAllVideos,
    getVideoById,
    publishAVideo
} from  "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {upload} from "../middlewares/multer.middlewares.js"
const router=Router()

router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);
router.route("/").post(
    verifyJWT,
    upload.fields([
        {name:"videoFile",maxCount:1},
        {name:"thumbnailImage",maxCount:1}
    ]),
    publishAVideo
);

export default router;

