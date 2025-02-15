const express = require("express");
const { auth } = require("../middlewares/authMw");
const { NoteModel } = require("../models/note.models");

const featuresRouter = express.Router();

// Search Notes
featuresRouter.get("/search", auth, async (req, res) => {
  try {
    // http:localhost:8080/api/search?q=searchKeyword project
    const searchQuery = req.query.q;
    const { userId} = req.user;
    if (!searchQuery) {
      return res.status(400).json({ msg: "Search query is required" });
    }
    const notes = await NoteModel.find({ userId,
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
featuresRouter.get("/filter", auth,  async (req, res) => {
  try {
    // http://localhost:8080/api/filter?priority=${priority}
    const { priority } = req.query;
    const { userId} = req.user;
    if(!priority) {
      return res.status(400).json({msg: "priority is required to filtering!"})
    }
    const filteredNotes = await NoteModel.find({userId, priority : priority })
    res.status(200).json(filteredNotes);

  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// filter notes by Category
featuresRouter.get("/filter-category", auth, async (req, res) => {
  try {
    // http://localhost:8080/filter-category?category="category"
    const { category } = req.query; 
    const {userId} = req.user
    if (!category) {
      return res.status(400).json({ msg: "Category is required for filtering" });
    }
    const filteredNotes = await NoteModel.find({ userId,category: category });
    res.status(200).json(filteredNotes);

  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

featuresRouter.get("/sorted",auth, async (req, res) => {
  try {
    // GET http://localhost:8080/notes/sorted?sortBy=title&order=asc
    let { sortBy, order } = req.query;
    const { userId} = req.user;
    // Default sorting if not provided
    console.log("SortBy and order = ",sortBy, order)
    sortBy = sortBy || "createdAt"; // Default: Sort by creation date
    order = order === "desc" ? -1 : 1; // Default: Ascending (1)

    const sortedNotes = await NoteModel.find({userId}).sort({ [sortBy]: order });
    res.status(200).json(sortedNotes);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});
module.exports = { featuresRouter };
