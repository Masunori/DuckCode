import BodyWithLocale from "../../../kernels/rules/body.js";

const authValidation = {
    login: [
        new BodyWithLocale("email").notEmpty().isEmail().get(),
        new BodyWithLocale("password").notEmpty().get()
    ],
    register: [
        new BodyWithLocale("username").notEmpty().isString().get(),
        new BodyWithLocale("email").notEmpty().isEmail().get(),
        new BodyWithLocale("password").notEmpty().isLength({min: 5}).get(),
        new BodyWithLocale("confirmPassword").notEmpty().confirmed("password").get()
    ],
    verifyOTP: [
        new BodyWithLocale("inputOTP").notEmpty().isLength({ min: 6, max: 6 }).get(),
        new BodyWithLocale("email").notEmpty().isEmail().get()
    ]
};
export default authValidation;