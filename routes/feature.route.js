const express = require("express");
const { auth } = require("../middlewares/authMw");
const { NoteModel } = require("../models/note.models");

const featuresRouter = express.Router();

// Search Notes
featuresRouter.get("/search", auth, async (req, res) => {
  try {
    // http:localhost:8080/api/search?q=searchKeyword
    const searchQuery = req.query.q;
    if (!searchQuery) {
      return res.status(400).json({ msg: "Search query is required" });
    }
    const notes = await NoteModel.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ],
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// Filter Notes as per priority
featuresRouter.get("/filter", async (req, res) => {
  try {
    // http://localhost:8080/api/filter?priority=${priority}
    const { priority } = req.query;
    if(!priority) {
      return res.status(400).json({msg: "priority is required to filtering!"})
    }
    const filteredNotes = await NoteModel.find({ priority : priority })
    res.status(200).json(filteredNotes);
    
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = { featuresRouter };
