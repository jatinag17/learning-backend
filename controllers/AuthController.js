import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { registerSchema,loginSchema } from "../validations/authvalidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema); // passing schema
      const payload = await validator.validate(body); // validating payload

      // check if email exists
      const findUser = await prisma.users.findUnique({ where: { email: payload.email } });
      if (findUser) {
        return res.status(400).json({ errors:{message: "Email already exists.Please use another one." }});
      }
      //Encypt the password
      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      //Create user in database
      const user = await prisma.users.create({ data: payload });
      return res.json({
        status: 200,
        message: "User created successfully",
        user,
      });

      // return res.json({ payload });
    } catch (error) {
      console.log("the error,error");
      if (error instanceof errors.E_VALIDATION_ERROR) {
        //console.log(error.messages);
        return res.status(400).json({ errors: error.messages });
      }
      else{
         return res.status(500).json({ status:500, message:"Something Went Wrong.Please try again." });
      }
    }
  }
  static async login(req, res) {
    try {
    const body=req.body;
    const validator = vine.compile(loginSchema); 
    const payload = await validator.validate(body);


    //* find user with email
    const findUser=await prisma.users.findUnique({
      where: { 
        email: payload.email,
       },
    })

    if (findUser){
      if(!bcrypt.compareSync(payload.password,findUser.password)){
        return res.status(400).json({errors:{
          email:"Invalid Credentials.",
        },
      });
      } 

      // Issue token to user
      const payloadData={
        id:findUser.id,
        name:findUser.name,
        email:findUser.email,
        profile:findUser.profile,
      }
      const token=jwt.sign(payloadData,process.env.JWT_SECRET,{
        expiresIn:"365d"
      });
      
      return res.json({message:"Logged in",access_token:`Bearer ${token}`});
    }
    return res.status(400).json({errors:{
      email:"No user found with this email address."
    },
  });
  }
  catch (error) {
    console.log("the error",error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        //console.log(error.messages);
        return res.status(400).json({ errors: error.messages });
      }
      else{
         return res.status(500).json({ status:500, message:"Something Went Wrong.Please try again." });
      }
  };
};
}

export default AuthController;
