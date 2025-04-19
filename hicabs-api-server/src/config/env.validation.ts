import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Hicabs Portal Database Configuration
  HICABS_PORTAL_DB_HOST: Joi.string().required(),
  HICABS_PORTAL_DB_PORT: Joi.number().default(3306),
  HICABS_PORTAL_DB_USER: Joi.string().required(),
  HICABS_PORTAL_DB_PASSWORD: Joi.string().required(),
  HICABS_PORTAL_DB_NAME: Joi.string().required(),

  // Hicabs Database Configuration
  HICABS_DB_HOST: Joi.string().required(),
  HICABS_DB_PORT: Joi.number().default(3306),
  HICABS_DB_USER: Joi.string().required(),
  HICABS_DB_PASSWORD: Joi.string().required(),
  HICABS_DB_NAME: Joi.string().required(),

  // Other Configurations
  JWT_SECRET: Joi.string().required(),
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASS: Joi.string().required(),
});
