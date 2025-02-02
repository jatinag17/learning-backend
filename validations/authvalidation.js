import vine from "@vinejs/vine";
import {CustomErrorReporter} from "./CustomErrorReporter.js";

vine.errorReporter=()=>new CustomErrorReporter(); //define custom error reporter function for error messages that occur during development process

export const registerSchema = vine.object({
  name: vine.string().minLength(2).maxLength(150),
  email: vine.string().email(),
  password: vine.string().minLength(6).maxLength(100).confirmed(),
});
export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string(),
});