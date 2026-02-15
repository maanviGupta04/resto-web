
const option = document.querySelector('.option');

if (option) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        option.classList.add('animate');
      }
    });
  }, { threshold: 0.3 });

  observer.observe(option);
}


const menuData = [

  // VEG 
  {
    name: "Paneer Butter Masala",
    category: "veg",
    price: "₹220",
    image: "assets/paneer-butter.jpg"
  },
  {
    name: "Veg Thali",
    category: "veg",
    price: "₹180",
    image: "assets/veg-thal.jpg"
  },
  {
    name: "Dal Tadka",
    category: "veg",
    price: "₹140",
    image: "assets/dal.jpg"
  },
  {
    name: "Aloo Paratha",
    category: "veg",
    price: "₹90",
    image: "assets/paratha.jpg"
  },
  {
    name: "Veg Biryani",
    category: "veg",
    price: "₹200",
    image: "assets/pulao.jpg"
  },
  {
    name: "Rajma Chawal",
    category: "veg",
    price: "₹160",
    image: "assets/rajma.jpg"
  },


  //NONVEG
  {
    name: "Chicken Curry",
    category: "nonveg",
    price: "₹250",
    image: "assets/chicken-curry.jpg"
  },
  {
    name: "Egg Biryani",
    category: "nonveg",
    price: "₹200",
    image: "assets/egg.jpg"
  },
  {
    name: "Butter Chicken",
    category: "nonveg",
    price: "₹280",
    image: "assets/butterchicken.jpg"
  },
  {
    name: "Chicken Biryani",
    category: "nonveg",
    price: "₹260",
    image: "assets/biryani.jpg"
  },
  {
    name: "Fish Fry",
    category: "nonveg",
    price: "₹300",
    image: "assets/fish.jpg"
  },
  {
    name: "Chicken Thali",
    category: "nonveg",
    price: "₹240",
    image: "assets/chickenthali.jpg"
  }

];


const menuContainer = document.querySelector(".menu-container");

function renderIt(items) {
  if (!menuContainer) return;

  menuContainer.innerHTML = "";

  items.forEach(item => {
    const menuItem = document.createElement("div");
    menuItem.classList.add("menu-item");

    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price}</p>
    `;

    menuContainer.appendChild(menuItem);
  });
}


renderIt(menuData);


const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    if (category === "all") {
      renderIt(menuData);
    } else {
      const filtered = menuData.filter(item => item.category === category);
      renderIt(filtered);
    }
  });
});


const form = document.getElementById("contact-form");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const status = document.getElementById("form-status");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
    .then(response => {
      if (response.ok) {
        status.textContent = "Message sent successfully!";
        form.reset();
      } else {
        status.textContent = "Something went wrong.";
      }
    });
  });
}
