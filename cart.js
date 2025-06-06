document.addEventListener('DOMContentLoaded', () => {
  // Load cart only on shoppingcart.html
  const cartList = document.getElementById("cart-items");
  if (userId && token && cartList) {
    loadCart();
  }

  // Only attach add-to-cart buttons on recipes.html
  const addButtons = document.querySelectorAll(".add-to-cart");
  if (addButtons.length > 0) {
    addButtons.forEach(button => {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        const ingredient = this.getAttribute("data-ingredient");
        if (!ingredient) return;
        addCartItem(ingredient);
      });
    });
  }

  // Clear cart button
  const clearCartButton = document.getElementById("clear-cart-button");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
      if (confirm("Clear all items from your cart?")) {
        clearCart();
      }
    });
  }
});

// Load current user's cart from MongoDB
function loadCart() {
  fetch(`${API_BASE_URL}/api/shopping/${userId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => displayCart(data))
    .catch(err => console.error("Error loading cart:", err));
}

// Add a single item to MongoDB cart
function addCartItem(item) {
  const cleanItem = item.trim();
  fetch(`${API_BASE_URL}/api/shopping/${userId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ item: cleanItem })
  })
    .then(res => {
      if (!res.ok) throw new Error("Add failed");
      alert(`"${cleanItem}" added to your cart!`);
    })
    .catch(err => console.error("Add error:", err));
}

// Remove a single item
function removeCartItem(item) {
  fetch(`${API_BASE_URL}/api/shopping/${userId}/item`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ item })
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to remove item");
      return res.json();
    })
    .then(() => loadCart())
    .catch(err => console.error("Remove error:", err));
}


// Clear the whole cart
function clearCart() {
  fetch(`${API_BASE_URL}/api/shopping/${userId}/all`, {
    method: "DELETE",
    headers: { 
        "Authorization": `Bearer ${token}` 
    }
  })
    .then(() => loadCart())
    .catch(err => console.error("Clear cart error:", err));
}

function displayCart(items) {
  const list = document.getElementById("cart-items");
  if (!list) return;
  list.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("cart-checkbox");
    checkbox.dataset.index = index;

    // Check saved state in localStorage
    const savedChecked = localStorage.getItem(`checked-${item}`);
    if (savedChecked === "true") {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
      localStorage.setItem(`checked-${item}`, checkbox.checked);
    });

    const label = document.createElement("label");
    label.textContent = item.replace(/🛒/g, '').trim();

    const removeButton = document.createElement("button");
    removeButton.textContent = "❌";
    removeButton.addEventListener("click", () => removeCartItem(item));

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(removeButton);
    list.appendChild(li);
  });
}

