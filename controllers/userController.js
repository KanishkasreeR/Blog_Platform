const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        const exists = await User.findOne({email});
    if(exists){
        res.status(400).json({msg:"User already exists"});
    }
    else{
        const newUser = new User({
            name,email,password
        });
        await newUser.save();
        res.status(200).json({msg:"User registered successfully"});
    }
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server error"});
    }
}

const login = async(req,res)=>{
    try{
       const {email,password} = req.body;
       const exists = await User.findOne({email});
       if(!exists){
         res.status(404).json({mag:"User not found"});
       }
       else{
         const valid = bcrypt.compare(exists.password,password);
         if(!valid){
            res.status(400).json({msg:"Invalid Password"});
         }else{
            const token = jwt.sign({userid : exists._id},"secretJWTkey",{expiresIn:"24h"});
            res.status(200).json({token});
         }
       }
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server error"});
    }
}

module.exports = {register,login};