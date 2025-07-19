import query from "express-validator";
import WithLocale from "./base.js";
class QueryWithLocale extends WithLocale 
{
    constructor(field) {
        super(field)
        this.withLocale = query(field)
    }

    matches(regex) {
        this.withLocale = this.withLocale.matches(regex)
        return this;
    }
}

export default QueryWithLocale;