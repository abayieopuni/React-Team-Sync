
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { config } from "../config/appConfig.js";
import passport from 'passport';
import { registerSchema } from "../validation/auth.validation.js";
import { registerServices } from "../services/authservices.js";
import { HTTPSTATUS } from "../config/http.config.js";

export const googleLogInCallback = asyncHandler(
  async (req, res) => {

    const currentWorkspace = req.user?.currentWorkspace;
    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      )
    }
    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    )
  }
)

export const registerUserControl = asyncHandler(
  async (req, res) => {
    const body = registerSchema.parse({
      ...req.body,
    })
    await registerServices(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    })
  }
);