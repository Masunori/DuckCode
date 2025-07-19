import { body } from "express-validator";
import WithLocale from "./base.js";
class BodyWithLocale extends WithLocale 
{
    constructor(field) {
        super(field);
    }
}

export default BodyWithLocale;