const express = require("express");
const { auth } = require("../middlewares/authMw");
const { NoteModel } = require("../models/note.models");

const featuresRouter = express.Router();
/**
* @swagger
* /features/search:
*   get:
*     summary: Search notes by title or content
*     tags:
*       - Notes Features
*     security:
*       - BearerAuth: []
*     parameters:
*       - name: q
*         in: query
*         required: true
*         schema:
*           type: string
*         description: The search keyword for filtering notes.
*     responses:
*        200:
*          description: List of notes matching the search criteria.
*        400:
*          description: Search query is required.
*        404:
*          description: Notes not available!
*        401:
*          description: "Please login first!"
*        440:
*          description: Search query is required.
*        500:
*          description: Server error.
*/

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
    notes.length===0? res.status(404).json({message: "Notes Not found"}) :  res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});
/** 
*  @swagger
*  /features/filter:
*    get:
*      summary: Filter notes based on priority
*      tags:
*        - Notes Features
*      security:
*        - BearerAuth: []
*      parameters:
*        - name: priority
*          in: query
*          required: true
*          schema:
*            type: string
*          description: The priority level to filter notes.
*      responses:
*        200:
*          description: List of notes filtered by priority.
*        400:
*          description: Priority is required for filtering.
*        500:
*          description: Server error.
*/
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
/** 
* @swagger
* /features/filter-category:
*    get:
*      summary: Filter notes by category
*      tags:
*        - Notes Features
*      security:
*        - BearerAuth: []
*      parameters:
*        - name: category
*          in: query
*          required: true
*          schema:
*            type: string
*          description: The category name to filter notes.
*      responses:
*        200:
*          description: List of notes filtered by category.
*        400:
*          description: Category is required for filtering.
*        500:
*          description: Server error.
*/
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

/**
* @swagger 
*   /features/sorted:
*     get:
*       summary: Get sorted notes
*       tags:
*         - Notes Features
*       security:
*         - BearerAuth: []
*       parameters:
*         - name: sortBy
*           in: query
*           schema:
*             type: string
*           description: The field to sort by (e.g., title, createdAt).
*         - name: order
*           in: query
*           schema:
*             type: string
*             enum: [asc, desc]
*           description: Sort order (asc for ascending, desc for descending).
*       responses:
*         200:
*           description: List of sorted notes.
*         500:
*           description: Server error.
*/
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
