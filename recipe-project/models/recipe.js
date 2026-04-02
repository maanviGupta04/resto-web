const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  yourname: String,
  name: String,
  ingredients: String,
  steps: String,

  category: {
    type: String,
    enum: ["veg", "nonveg", "snacks", "drinks", "dessert"],
  },

  image: {
    type: String,
    default: ""
  },

  price:{
    type:Number,
    default:0
  },

  ratings:{
    type:[Number],
    default:[]
  },

  averageRating:{
    type:Number,
    default:0
  },

  menu:{
    type:Boolean,
    default:false
  },

  

});

recipeSchema.methods.addRating = function(rating){

  this.ratings.push(rating);

  const sum = this.ratings.reduce((a,b)=>a+b,0);

  this.averageRating = sum / this.ratings.length;

  return this.save();

};

module.exports = mongoose.model("Recipe", recipeSchema);
