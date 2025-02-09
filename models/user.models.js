const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    pass: {type: String, required:true}
}, {
    versionKey: false,
    toJSON: {virtuals:true}
})

userSchema.virtual("notes", {
    ref: "notes",
    localField: "_id",
    foreignField: "userId"
})

const UserModel = mongoose.model("users", userSchema)

module.exports = {UserModel}