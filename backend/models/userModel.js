const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name : {type: String, required: true },
    email: {type: String, required : true, unique:true},
    password: { type: String, required: true },
    pic:{
        type: String,
        
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }

},{timestamps: true});
//

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

// Pre-save middleware to hash the password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User= mongoose.model("User", userSchema);

module.exports= User;