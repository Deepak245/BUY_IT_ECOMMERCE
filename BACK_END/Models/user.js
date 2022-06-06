
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');  // this is for sending mail in case if user forget the password.


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your name'],
        maxLength:[30,'Your name cannot exceed 30 characters']
    },
    email:{
        type:String,
        required:[true,'please enter your Email'],
        unique:true,
        validate:[validator.isEmail,'please enter valide email address']
    },
    password:{
        type:String,
        required:[true,'please enter your password'],
        minlength:[6,'your password should not be more than 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:{
         type:String,
         default: ""
        },
    resetPasswordExpire:{
        type:Date,
        default: ""
    }
});

// encripting password before saving. here we cannot use arrow function
// pre mean before saving we have to do somthing
// If we did modified the user & password is not modified to thrwo error we kept if condition.
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

// return jwt token by creating it
userSchema.methods.getJwtToken = function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.comparePassword=async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password); // it will return true or false.
}

// forget password code.
userSchema.methods.getResetPasswordToken = function(){
    // generatetoken
    const resetToken = crypto.randomBytes(20).toString('hex');
    // console.log('from userschema'+resetToken);
    // hashing reset password token 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // set token expire time
    this.resetPasswordExpire = Date.now()+ 30 * 60 *1000;
   
    
    // TotalString = resetToken+'_'+this.resetPasswordToken+'_'+this.resetPasswordExpire
    return resetToken;
    // return TotalString;
    // remember we are sending reset token as it is. the hashed version will be in db. when ever we send in URL.
    //in url token will be there again we encrypt the url and we will match with db token .
}







module.exports = mongoose.model('User',userSchema);