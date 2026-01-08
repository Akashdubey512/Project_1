import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from  "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/")
    .get(getAllVideos)
    .post(
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnailImage", maxCount: 1 }
        ]),
        publishAVideo
    );

router.route("/:videoId")
    .get(getVideoById)
    .put(
        verifyJWT,
        upload.single("thumbnailImage"),
        updateVideo
    )
    .delete(
        verifyJWT,
        deleteVideo
    );

router.route("/toggle-publish/:videoId")
    .patch(
        verifyJWT,
        togglePublishStatus
    );
export default router;
