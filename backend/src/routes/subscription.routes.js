import { Router } from "express";
import {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels} from "../controllers/subscription.controller.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";

const router =Router();

router.use(verifyJWT);

router.route("/toggle/:channelId").post(toggleSubscription);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);
router.route("/subscribed/:subscriberId").get(getSubscribedChannels);

export default router;