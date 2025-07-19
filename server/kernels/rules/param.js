import param from "express-validator";
import WithLocale from "./base.js";

class ParamWithLocale extends WithLocale 
{
    constructor(field) {
        super(field)
        this.withLocale = param(field)
    }

    matches(regex) {
        this.withLocale = this.withLocale.matches(regex)
        return this;
    }
}

export default ParamWithLocale;