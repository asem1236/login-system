import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import user_Model from "../models/UserModel.js";
import transporter from "../Config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../Config/emailTemplates.js";

export const  register = async (req,res)=>{
    const {name , email,password} = req.body;
    if(!name || !email || !password){
        return res.json({success:false,message:`Missing Details`})
    }
    try{
        const existing_user = await user_Model.findOne({email})
        // step -1 check if user is found or not 
        if(existing_user){
            return res.json({success:false,message:`User Already Exist`});
        }
        // step -2  prepare data and create the user 
        const hashedPassword =  await bcrypt.hash(password,10);
        const user = new user_Model({name,email,password:hashedPassword});
        await user.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        // Send welcome email (no OTP here - OTP sent separately via /send-verify-otp)
         const welcomeEmail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome To Auth System!',
            html: `
                <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:30px;background:#f9f9f9;border-radius:10px;">
                    <h2 style="color:#667eea;">Welcome to our Auth System! 🎉</h2>
                    <p>Hi <strong>${name}</strong>, your account has been created successfully.</p>
                    <p>Your registered email: <span style="color:#667eea;">${email}</span></p>
                    <p style="color:#888;font-size:13px;">Click "Verify email" from your profile menu to verify your account.</p>
                </div>
            `
         };

         await transporter.sendMail(welcomeEmail);
        // return to Login and 
        return res.json({success:true})

    }catch(error){
        return res.json({success:false,message:error.message})
    }
}

// Login Step 
/*
1- take date form user 1
2- check data not empty 1
3- check the data is correct or no 
4- if true sing in  
*/
export const login = async (req,res)=>{
    const {email,password} = req.body;
        if(!email || !password){
        return res.json({success:false,message:`Password and Email are required `})
    }
    // 2- check the correct of dat 
    try {
        const user = await user_Model.findOne({email});
        if(!user){
            return res.json({success:false,message:`Invalid Email please enter a correct email`})
        }
        const isMatchPassword = await bcrypt.compare(password,user.password);
        if(!isMatchPassword){
            return res.json({success:false,message:`Invalid Password please enter a correct Password`})
        }
        
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production'
                    ? 'none'
                    : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        return res.json({success:true,message:`Login Successfully `})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
// log out
// 1- remove cookies 

export const logout = async (req,res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success:true,message:`Logout Successfully `})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}
// send verify opt to user 
export const sendVerifyOtp = async (req, res) => {
    try {
        // Step 1: Get user ID from middleware
        const userId = req.userId;

        // Step 2: Find user in database
        const user = await user_Model.findById(userId);

        // Step 3: Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        // Step 4: Check account verification
        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "The Account is Already Verified"
            });
        }

        // Step 5: Generate OTP
        const otp = String(
            Math.floor(100000 + Math.random() * 900000)
        );

        user.verifyOtp = otp;
        user.verifyOtpExpireAt =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        // Step 6: Send OTP by email (HTML template)
        const otpMessage = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            html: EMAIL_VERIFY_TEMPLATE
                .replace('{{email}}', user.email)
                .replace('{{otp}}', otp)
        };

        await transporter.sendMail(otpMessage);

        return res.json({
            success: true,
            message: "Verification OTP Sent to Email"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Verify email 
export const verifyEmail = async(req,res)=>{
    // userId comes from UserAuth middleware (req.userId), not from req.body
    const userId = req.userId;
    const { otp } = req.body;
    if(!userId || !otp){
        return res.json({success:false,message:`Missing Details`})
    }
    try {
        const user = await user_Model.findById(userId);
        if(!user){
              return res.json({success:false,message:`User Not Found in System `})
        }
        // Check if OTP was never sent (empty) or already used/cleared
        if(!user.verifyOtp || user.verifyOtp === ''){
              return res.json({success:false,message:`No OTP found. Please request a new OTP first.`})
        }
        // Check expiry BEFORE comparing OTP
        if(user.verifyOtpExpireAt < Date.now()){
              return res.json({success:false,message:`Otp Expired. Please request a new OTP.`})
        }
        // Check OTP match
        if(user.verifyOtp !== otp){
              return res.json({success:false,message:`Invalid Otp. Enter the correct Otp.`})
        }
        // Use findByIdAndUpdate to guarantee the write is persisted in MongoDB
        await user_Model.findByIdAndUpdate(userId, {
            $set: {
                isAccountVerified: true,
                verifyOtp: '',
                verifyOtpExpireAt: 0
            }
        });
        return res.json({success:true,message:'Email Verified Successfully'})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const isAuth = async (req,res)=>{
    try {
         return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await user_Model.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetMessage = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            html: PASSWORD_RESET_TEMPLATE
                .replace('{{email}}', user.email)
                .replace('{{otp}}', otp)
        };

        await transporter.sendMail(resetMessage);

        return res.json({ success: true, message: 'Reset OTP sent to your email' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {
        const user = await user_Model.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        
        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
