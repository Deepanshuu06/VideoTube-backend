import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyjwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-avatar").post(updateUserAvatar);
router.route("/update-cover-image").post(updateUserCoverImage);
router.route("/change-password").post(changeCurrentPassword);
router.route("/update-account-details").post(updateAccountDetails);
router.route("/get-current-user").post( getCurrentUser);

export default router;
