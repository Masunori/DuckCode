import { validationResult } from "express-validator";
import response from "../../utils/responseUtils.js";

const validate = (validationArray) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validationArray) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return response.invalidated(res, {
      errors: errors.array(),
    });
  };
};

export default validate;
