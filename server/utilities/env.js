require('dotenv').config()

const envConfig = {
    PORT: process.env.PORT,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    RZP_KEY: process.env.RZP_KEY,
    RZP_SECRET: process.env.RZP_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    AUTH_EMAIL: process.env.AUTH_EMAIL,
    AUTH_PASS: process.env.AUTH_PASS,
    BROWSER_CLOUD_TOKEN: process.env.BROWSER_CLOUD_TOKEN,
    BASE_URL: process.env.BASE_URL || '/'
};

module.exports = envConfig;