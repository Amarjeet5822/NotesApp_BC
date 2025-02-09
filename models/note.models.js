const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: {type: String, required:true, trim: true },
    content: {type: String, required:true},
    category: { type: String, required: true, enum:["work","personal","ideas","shopping list","others"], default:"others"},
    priority:{ type: String, enum:["high", "medium","low"], default:"medium"},
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    user: {type: String, required:true}
}, {
    versionKey: false,
    timestamps: true
})

const NoteModel = mongoose.model("notes", noteSchema)

module.exports = {NoteModel}