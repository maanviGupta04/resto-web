require('dotenv').config({ path: __dirname + '/.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");


// Import Model - FIXED PATH
const Recipe = require("./models/recipe");

const app = express();
// app.use(express.static("public"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

const multer = require("multer");
// const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ADD RECIPE - FIXED
app.post("/add-recipe", upload.single("image"), async (req, res) => {

  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {

    const newRecipe = new Recipe({
      yourname: req.body.yourname,
      name: req.body.name,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      category: req.body.category,
      image: req.file ? "/uploads/" + req.file.filename : ""
    });

    await newRecipe.save();

    res.json({
      message: "Recipe added successfully!",
      recipe: newRecipe
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }

});

// GET RECIPES - FIXED
app.get("/recipes", async (req, res) => {
  try {
    console.log("📋 Fetching recipes...");
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${recipes.length} recipes`);
    res.json(recipes);
  } catch (err) {
    console.error(" Fetch error:", err);
    res.json({ error: "Fetch failed" });
  }
});






// Add rating to a recipe
app.post("/recipes/:id/rate", async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body; // rating should be a number 1-5

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Invalid rating" });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    await recipe.addRating(rating);
    res.json({ message: "Rating added", averageRating: recipe.averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.delete("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json({ message: `Recipe "${recipe.name}" deleted ✅` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/recipes/:id/menu", async (req,res)=>{

  try{

    const recipe = await Recipe.findById(req.params.id);

    if(!recipe){
      return res.status(404).json({message:"Recipe not found"});
    }

    const price = req.body.price;

    if(!price){
      return res.status(400).json({message:"Owner must enter price"});
    }

    recipe.price = price;
    recipe.menu = true;

    await recipe.save();

    res.json({
      message:`${recipe.name} added to menu with price ₹${price}`
    });

  }catch(err){

    console.error(err);
    res.status(500).json({message:"Server error"});

  }

});

app.post("/chatbot", async (req, res) => {
  try {
    const { query, staticMenu } = req.body;

    const dbRecipes = await Recipe.find({ menu: true });

    const dbNames = dbRecipes.map(r => r.name);
    const staticNames = staticMenu.map(item => item.name);

    const fullMenu = [...staticNames, ...dbNames].join(", ");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      `You are a restaurant AI waiter. ONLY recommend dishes from this menu: ${fullMenu}. User query: ${query}`
    );

    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "AI unavailable" });
  }
});


module.exports = app;
