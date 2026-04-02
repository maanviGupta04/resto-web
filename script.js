// ===== SCROLL ANIMATION =====
const sections = document.querySelectorAll('.cards, .option');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));


// ===== STATIC MENU DATA =====
const menuData = [

  // VEG
  { name: "Paneer Butter Masala", category: "veg", price: "₹220", image: "assets/paneer-butter.jpg" },
  { name: "Veg Thali", category: "veg", price: "₹180", image: "assets/veg-thal.jpg" },
  { name: "Dal Tadka", category: "veg", price: "₹140", image: "assets/dal.jpg" },
  { name: "Aloo Paratha", category: "veg", price: "₹90", image: "assets/paratha.jpg" },
  { name: "Veg Biryani", category: "veg", price: "₹200", image: "assets/pulao.jpg" },
  { name: "Rajma Chawal", category: "veg", price: "₹160", image: "assets/rajma.jpg" },

  // NONVEG
  { name: "Chicken Curry", category: "nonveg", price: "₹250", image: "assets/chicken-curry.jpg" },
  { name: "Egg Biryani", category: "nonveg", price: "₹200", image: "assets/egg.jpg" },
  { name: "Butter Chicken", category: "nonveg", price: "₹280", image: "assets/butterchicken.jpg" },
  { name: "Chicken Biryani", category: "nonveg", price: "₹260", image: "assets/biryani.jpg" },
  { name: "Fish Fry", category: "nonveg", price: "₹300", image: "assets/fish.jpg" },
  { name: "Chicken Thali", category: "nonveg", price: "₹240", image: "assets/chickenthali.jpg" },

    // SNACKS
  { name: "Samosa", category: "snacks", price: "₹40", image: "assets/samosa.jpg" },
  { name: "Paneer Pakora", category: "snacks", price: "₹80", image: "assets/pakora.jpg" },
  // DRINKS
  { name: "Mango Lassi", category: "drinks", price: "₹90", image: "assets/lassi.jpg" },
  { name: "Cold Coffee", category: "drinks", price: "₹120", image: "assets/coffee.jpg" },

  // ===== DESSERTS =====
{ name: "Chocolate Brownie", category: "dessert", price: "₹150", image: "assets/brownie.jpg" },
{ name: "Gulab Jamun", category: "dessert", price: "₹100", image: "assets/gulab-jamun.jpg" },
{ name: "Vanilla Ice Cream", category: "dessert", price: "₹120", image: "assets/icecream.jpg" },
{ name: "Rasmalai", category: "dessert", price: "₹130", image: "assets/rasmalai.jpg" }
];

// const menuNames = menuItems.map(item => item.name).join(", ");


// ===== LOAD MENU =====
async function loadMenu() {

  const container = document.querySelector(".menu-container");
  if (!container) return;

  container.innerHTML = "";

  // 1️⃣ Load STATIC MENU
  menuData.forEach(item => {

    const card = document.createElement("div");
    card.className = "menu-item";
    card.dataset.category = item.category;

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price}</p>
      <button class="add-btn">ADD</button>
    `;

    container.appendChild(card);
  });


  //  Load DATABASE RECIPES
  try {

    const res = await fetch("http://localhost:3000/recipes");
    const recipes = await res.json();

    const menuRecipes = recipes.filter(r => r.menu === true);

    menuRecipes.forEach(recipe => {
  const card = document.createElement("div");
  card.className = "menu-item";
  card.dataset.category = recipe.category;

let cat = recipe.category.toLowerCase(); // lowercase
  card.dataset.category = cat;

let icon = "";
if(cat === "veg") icon = "🟢";
else if(cat === "nonveg") icon = "🔴";
else if(cat === "snacks") icon = "🍟";
else if(cat === "drinks") icon = "🥤";
else if(cat === "dessert") icon = "🧁"; 

  card.innerHTML = `
    <img src="${recipe.image ? 'http://localhost:3000' + recipe.image : 'assets/setdefault.png'}" alt="${recipe.name}">
    <h3>${icon} ${recipe.name}</h3>
    <p>₹${recipe.price || 150}</p>
    <p>⭐ ${recipe.averageRating?.toFixed(1) || "New"}</p>
    <button class="add-btn">ADD</button>
  `;

  container.appendChild(card);
});

  } catch (err) {
    console.error("DB menu load error:", err);
  }

}


// ===== FILTER BUTTONS =====
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      const items = document.querySelectorAll(".menu-item");

      items.forEach(item => {
        if (category === "all" || item.dataset.category === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}


// ===== CART SYSTEM =====
const cartDrawer = document.getElementById("cart-drawer");
const viewCartBtn = document.getElementById("view-cart-btn");
const closeCartBtn = document.getElementById("close-cart");

let cart = {};

if(viewCartBtn){
  viewCartBtn.addEventListener("click", () => {
    cartDrawer.classList.add("active");
  });
}

if(closeCartBtn){
  closeCartBtn.addEventListener("click", () => {
    cartDrawer.classList.remove("active");
  });
}


// ===== ADD / REMOVE CART =====
document.addEventListener("click", function(e){

  if(e.target.classList.contains("add-btn")){

    const parent = e.target.parentElement;
    const itemName = parent.querySelector("h3").textContent;
    const itemPrice = parseInt(parent.querySelector("p").textContent.replace("₹","")) || 0;

    cart[itemName] = { price: itemPrice, quantity: 1 };

    localStorage.setItem("cart", JSON.stringify(cart));

    parent.querySelector(".add-btn").remove();

    const controls = document.createElement("div");
    controls.classList.add("cart-controls");

    controls.innerHTML = `
      <button class="minus">−</button>
      <span class="qty">1</span>
      <button class="plus">+</button>
    `;

    parent.appendChild(controls);

    updateCartUI();
  }


  if(e.target.classList.contains("plus")){

    const parent = e.target.closest(".menu-item");
    const itemName = parent.querySelector("h3").textContent;

    cart[itemName].quantity++;
    localStorage.setItem("cart", JSON.stringify(cart));

    const qty = e.target.parentElement.querySelector(".qty");
    qty.textContent = cart[itemName].quantity;

    updateCartUI();
  }


  if(e.target.classList.contains("minus")){

    const parent = e.target.closest(".menu-item");
    const itemName = parent.querySelector("h3").textContent;

    cart[itemName].quantity--;

    localStorage.setItem("cart", JSON.stringify(cart));

    const qty = e.target.parentElement.querySelector(".qty");

    if(cart[itemName].quantity <= 0){

      delete cart[itemName];
localStorage.setItem("cart", JSON.stringify(cart));

      e.target.parentElement.remove();
      parent.innerHTML += `<button class="add-btn">ADD</button>`;

    } else {

      qty.textContent = cart[itemName].quantity;

    }

    updateCartUI();
  }

});


// ===== UPDATE CART UI =====
function updateCartUI(){

  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if(!cartItems) return;

  let count = 0;
  let total = 0;

  cartItems.innerHTML = "";

  for(let item in cart){

    let price = cart[item].price;
    let quantity = cart[item].quantity;

    count += quantity;
    total += price * quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item} x ${quantity}</span>
        <span>₹${price * quantity}</span>
      </div>
    `;
  }

  if(cartCount) cartCount.textContent = count;
  if(cartTotal) cartTotal.textContent = total;

  if(count > 0){
    viewCartBtn.classList.add("show");
  } else {
    viewCartBtn.classList.remove("show");
    cartDrawer.classList.remove("active");
  }

}


// ===== LOAD PAGE =====
document.addEventListener("DOMContentLoaded", () => {

  loadMenu();
  setupFilters();

});

// ===== SUBMIT RECIPE WITH IMAGE =====
async function submitRecipe() {

  const form = document.getElementById("recipeForm");
  if(!form) return;

  const formData = new FormData(form);

  try{

    const response = await fetch("/add-recipe",{
      method:"POST",
      body:formData
    });

    const data = await response.json();

    alert(data.message);

    form.reset();

  }catch(err){

    console.error(err);
    alert("Error submitting recipe");

  }

}


// attach form submit
document.getElementById("recipeForm")?.addEventListener("submit",(e)=>{
  e.preventDefault();
  submitRecipe();
});

// ===== IMAGE PREVIEW =====

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

if(imageInput){

  imageInput.addEventListener("change", function(){

    const file = this.files[0];

    if(file){

      const reader = new FileReader();

      reader.onload = function(e){
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };

      reader.readAsDataURL(file);

    }

  });

}


// ===== SUBMIT RECIPE WITH IMAGE =====

async function submitRecipe(){

  const form = document.getElementById("recipeForm");

  if(!form) return;

  const formData = new FormData(form);

  try{

    const res = await fetch("http://localhost:3000/add-recipe",{
      method:"POST",
      body:formData
    });

    const data = await res.json();

    alert(data.message);

    form.reset();

  }catch(err){

    console.error(err);
    alert("Error submitting recipe");

  }

}

document.getElementById("recipeForm")?.addEventListener("submit",(e)=>{

  e.preventDefault();
  submitRecipe();

});


const placeOrderBtn = document.getElementById("place-order-btn");

if(placeOrderBtn){
  placeOrderBtn.addEventListener("click", () => {

    if(Object.keys(cart).length === 0){
      alert("Your cart is empty!");
      return;
    }

    alert("🎉 Order placed successfully!");

    generateReceipt();

    // Clear cart
    cart = {};

    // Reset UI
    document.querySelectorAll(".cart-controls").forEach(el => el.remove());

    document.querySelectorAll(".menu-item").forEach(item=>{
      if(!item.querySelector(".add-btn")){
        item.innerHTML += `<button class="add-btn">ADD</button>`;
      }
    });

    updateCartUI();
  });
}

const loginBtn = document.getElementById("login");
const modal = document.getElementById("login-modal");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
}

function loginUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // mandatory validation
  if (!username || !password) {
    alert("⚠️ Username and password are mandatory");
    return;
  }

  localStorage.setItem("loggedInUser", username);
  alert("✅ Login successful!");
  window.location.href = "menu.html";
}


const closeLogin = document.getElementById("close-login");

// close when X clicked
closeLogin?.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// close when clicking outside box
modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});

function generateReceipt() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || {};
  const receiptBox = document.getElementById("receipt-box");

  let total = 0;
  let receiptHTML = "<h3>🧾 Receipt</h3>";

  for (let item in cartItems) {
    const price = cartItems[item].price;
    const quantity = cartItems[item].quantity;

    receiptHTML += `<p>${item} x ${quantity} = ₹${price * quantity}</p>`;
    total += price * quantity;
  }

  receiptHTML += `<h4>Total: ₹${total}</h4>`;
  receiptHTML += `<p>✅ Order placed successfully</p>`;

  receiptBox.innerHTML = receiptHTML;
}


const chatFab = document.getElementById("chat-fab");
const chatbotBox = document.getElementById("chatbot-box");
const closeChat = document.getElementById("close-chat");
const chatBtn = document.getElementById("chat-btn");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

chatFab?.addEventListener("click", () => {
  chatbotBox.classList.remove("hidden");
});

closeChat?.addEventListener("click", () => {
  chatbotBox.classList.add("hidden");
});

chatInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") chatbotReply();
});

chatBtn?.addEventListener("click", chatbotReply);

function formatBotReply(text) {
  return text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\* /g, "• ");
}

function offlineSuggestion(input) {
  input = input.toLowerCase();

  if (input.includes("dessert") || input.includes("ice cream") || input.includes("sweet")) {
    return "🍰 How about trying our Chocolate Brownie from desserts?";
  } 
  else if (input.includes("drink") || input.includes("juice") || input.includes("coffee") || input.includes("cold")) {
    return "🥤 You can try our Mango Lassi or Cold Coffee!";
  } 
  else if (input.includes("veg")) {
    return "🟢 Our Paneer Butter Masala is Chef's special!";
  } 
  else if (input.includes("nonveg") || input.includes("chicken") || input.includes("fish")) {
    return "🔴 You might enjoy our Butter Chicken or Fish Fry!";
  } 
  else {
    return "🤖 AI is unavailable, but I recommend our Paneer Butter Masala 🍛";
  }
}

async function chatbotReply() {
  const input = chatInput.value.trim();
  if (!input) return;

  chatMessages.innerHTML += `<div class="user-msg">${input}</div>`;
  chatInput.value = "";

  const typing = document.createElement("div");
  typing.className = "bot-msg";
  typing.innerText = "🤖 Thinking...";
  chatMessages.appendChild(typing);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const res = await fetch("http://localhost:3000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: input,
        staticMenu: menuData
      })
    });

    const data = await res.json();
    typing.innerHTML = formatBotReply(data.reply || offlineSuggestion(input));

  }catch (err) {
    typing.innerHTML = formatBotReply(offlineSuggestion(input));
}
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;



function downloadReceiptPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const cartItems = JSON.parse(localStorage.getItem("cart")) || {};
  const username = localStorage.getItem("loggedInUser") || "Guest";

  // 🧾 Order ID
  const orderId = "ORD" + Math.floor(Math.random() * 1000000);

  // 📅 Date
  const date = new Date().toLocaleString();

  let y = 20;
  let total = 0;

  // ===== HEADER =====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("ServeSmart Invoice", 20, y);

  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Order ID: ${orderId}`, 20, y);

  y += 8;
  doc.text(`Date: ${date}`, 20, y);

  y += 8;
  doc.text(`Customer: ${username}`, 20, y);

  // ===== LINE =====
  y += 6;
  doc.line(20, y, 190, y);

  // ===== TABLE HEADER =====
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Item", 20, y);
  doc.text("Qty", 120, y);
  doc.text("Price", 160, y);

  y += 5;
  doc.line(20, y, 190, y);

  // ===== ITEMS =====
  doc.setFont("helvetica", "normal");

  for (let item in cartItems) {
    const price = Number(cartItems[item].price) || 0;
    const quantity = Number(cartItems[item].quantity) || 0;

    const itemTotal = price * quantity;
    total += itemTotal;

    y += 10;

    // Handle long item names
    const splitItem = doc.splitTextToSize(item, 90);
    doc.text(splitItem, 20, y);

    doc.text(quantity.toString(), 125, y);
    doc.text(`Rs. ${itemTotal}`, 155, y);

    y += (splitItem.length - 1) * 8; // adjust if name wraps
  }

  // ===== TOTAL =====
  y += 10;
  doc.line(20, y, 190, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Total: Rs. ${total}`, 140, y);

  // ===== FOOTER =====
  y += 15;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for ordering with ServeSmart ❤️", 20, y);

  // ===== SAVE =====
  doc.save(`ServeSmart_${orderId}.pdf`);
}
