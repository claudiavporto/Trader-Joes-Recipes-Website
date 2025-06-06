function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll(".category-buttons button");
  categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");

      const category = this.textContent.trim().toLowerCase().split(" ")[1] || "all";
      filterRecipes(category);
    });
  });
}

function filterRecipes(category) {
  const cards = document.querySelectorAll('.recipe-card');
  cards.forEach(card => {
    const match = category === 'all' || card.classList.contains(`category-${category}`);
    card.style.display = match ? '' : 'none';
  });
}

function searchRecipes() {
  const input = document.getElementById("search-bar").value.toLowerCase();
  const cards = document.querySelectorAll(".recipe-card");

  cards.forEach(card => {
    const title = card.querySelector("h2").textContent.toLowerCase();
    const categories = card.className.toLowerCase();
    const ingredientsList = card.querySelectorAll(".recipe-details ul li");
    let ingredients = "";
    ingredientsList.forEach(item => {
      ingredients += item.textContent.toLowerCase() + " ";
    });

    const match = title.includes(input) || categories.includes(input) || ingredients.includes(input);
    card.style.display = match ? "" : "none";
  });
}

function setupSearchKeydown() {
  const searchInput = document.getElementById("search-bar");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        searchRecipes();
      }
    });
  }
}

function showRandomRecipe() {
  const recipes = document.querySelectorAll(".recipe-card");
  if (recipes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * recipes.length);
  recipes.forEach(card => card.style.display = "none");

  const randomRecipe = recipes[randomIndex];
  randomRecipe.style.display = "block";
  randomRecipe.scrollIntoView({ behavior: "smooth", block: "center" });
}

function toggleDetails(card) {
  const details = card.querySelector('.recipe-details');
  if (details) {
    const isVisible = details.style.display === 'block';
    details.style.display = isVisible ? 'none' : 'block';
  }
}

function addToMyRecipes(event) {
  event.stopPropagation();
  const recipeCard = event.target.closest('.recipe-card');
  const recipeTitle = recipeCard.querySelector('h2').textContent;
  const recipeImage = recipeCard.querySelector('img').src;
  const recipeDescription = recipeCard.querySelector('p').textContent;
  const categoryClasses = Array.from(recipeCard.classList).filter(cls => cls.startsWith("category-"));
  const ingredientItems = recipeCard.querySelectorAll('.recipe-details ul li');
  const ingredients = Array.from(ingredientItems).map(li => li.textContent.trim());

  const recipeData = {
    title: recipeTitle,
    image: recipeImage,
    description: recipeDescription,
    categories: categoryClasses,
    ingredients: ingredients
  };

  if (!userId) {
    alert("Please log in to save recipes.");
    return;
  }

  addToFavorites(userId, recipeData);
}

function loadMyRecipes(recipes) {
  const container = document.getElementById('my-recipes-container');
  if (!container) return;

  container.innerHTML = '';

  recipes.forEach((recipe, index) => {
    const recipeCard = document.createElement('section');
    recipeCard.classList.add('recipe-card');
    recipe.categories?.forEach(category => recipeCard.classList.add(category));

    const ingredientsHTML = (recipe.ingredients || [])
    .map(ingredient => `
        <li>
        ${ingredient.replace(/[^\w\s]/g, '')} 
        <button class="add-to-cart" data-ingredient="${ingredient}">🛒</button>
        </li>`)
    .join('');


    recipeCard.id = `recipe-${index}`;
    recipeCard.innerHTML = `
      <button class="heart-button">❤️</button>
      <h2>${recipe.title}</h2>
      <img src="${recipe.image}" alt="${recipe.title}" />
      <p>${recipe.description}</p>
      <div class="recipe-details" style="display: none;">
            <h4>Ingredients:</h4>
            <ul>${ingredientsHTML}</ul>
      </div>
      <button class="remove-button">Remove</button>
    `;

    const heartBtn = recipeCard.querySelector('.heart-button');
    if (heartBtn) {
        heartBtn.style.pointerEvents = 'none';
        heartBtn.style.opacity = '0.5'; 
    }

    recipeCard.querySelector('.heart-button').addEventListener('click', addToMyRecipes);
    recipeCard.querySelector('.remove-button').addEventListener('click', (event) => removeRecipe(event, recipe.title));
    recipeCard.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', e => {
            e.stopPropagation();
            const ingredient = button.getAttribute('data-ingredient');
            if (ingredient) {
            addCartItem(ingredient.trim());
            button.style.display = 'none';
            }
        });
    });

    recipeCard.addEventListener('click', function (e) {
      if (
        e.target.closest('.heart-button') ||
        e.target.closest('.remove-button') ||
        e.target.closest('.cart-button') ||
        e.target.tagName === "BUTTON"
      ) return;
      toggleDetails(recipeCard);
    });

    container.appendChild(recipeCard);
  });
}

function removeRecipe(event, title) {
  event.stopPropagation();

  if (!userId) {
    alert("Please log in.");
    return;
  }
  removeFavorite(userId, title);
}

function loadMyFavorites(userId) {
  fetch(`${API_BASE_URL}/api/users/${userId}/favorites`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(loadMyRecipes)
  .catch(err => console.error("Failed to load favorites:", err));
}

function addToFavorites(userId, recipe) {
  fetch(`${API_BASE_URL}/api/users/${userId}/favorites`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(recipe)
  })
  .then(res => {
    if (res.status === 409) {
      throw new Error("This recipe is already in your favorites.");
    }
    if (!res.ok) {
      throw new Error("Failed to save favorite.");
    }
    return res.json();
  })
  .then(() => {
    alert(`"${recipe.title}" added to your favorites!`);
    loadMyFavorites(userId);
  })
  .catch(err => {
    alert(err.message);
    console.error(err);
  });
}

function removeFavorite(userId, title) {
  fetch(`${API_BASE_URL}/api/users/${userId}/favorites`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  })
  .then(res => res.json())
  .then(() => {
    alert(`"${title}" removed from favorites.`);
    loadMyFavorites(userId);
  })
  .catch(err => console.error("Failed to remove favorite:", err));
}

function addToCart(recipe) {
  if (!token || !userId) {
    alert("Please log in to add items to cart.");
    return;
  }

  const ingredients = recipe.ingredients || [];
  if (ingredients.length === 0) {
    alert("No ingredients found for this recipe.");
    return;
  }

  Promise.all(
    ingredients.map(rawItem => {
      const cleanItem = rawItem.trim();
      return fetch(`${API_BASE_URL}/api/shopping/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ item: cleanItem })
      })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to add "${cleanItem}"`);
        return res.json();
      });
    })
  )
  .then(() => {
    alert(`All ingredients added to your cart!`);
  })
  .catch(err => {
    console.error("Cart add error:", err);
    alert(err.message || "Failed to add some ingredients to cart.");
  });
}

document.addEventListener('DOMContentLoaded', function () {
  console.log("recipes.js DOMContentLoaded running");

  setupCategoryButtons();
  setupSearchKeydown();

  const searchInput = document.getElementById("search-bar");
  if (searchInput) {
    searchInput.addEventListener("input", searchRecipes);
  }

  const surpriseBtn = document.getElementById("surprise-me");
  if (surpriseBtn) {
    surpriseBtn.addEventListener("click", showRandomRecipe);
  }

  document.querySelectorAll('.recipe-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (
        e.target.closest('.heart-button') ||
        e.target.closest('.remove-button') ||
        e.target.closest('.add-to-cart') ||
        e.target.tagName === "BUTTON"
      ) return;
      toggleDetails(card);
    });
  });

  const heartButtons = document.querySelectorAll('.heart-button');
  heartButtons.forEach(button => {
      button.addEventListener('click', addToMyRecipes);
  });

  if (userId && userId !== "YOUR_USER_ID_HERE") {
      loadMyFavorites(userId);
  } else {
      alert("Please log in to view your saved recipes.");
  }
});
