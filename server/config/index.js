import database from "./database.js";
import oauthConfig from "./oauth-config.js";

const config = {
    database,
    ...oauthConfig
};
export { config };
export default config;