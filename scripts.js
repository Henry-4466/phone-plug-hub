let products = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // Fetch products from JSON
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts();      // ← Fixed: was displayProducts → renderProducts
            displayCategories();    // ← Fixed: was displayCategories → renderCategories
        })
        .catch(err => console.error("Failed to load products:", err));

    // Search event listener
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    // Modal close functionality (moved inside DOMContentLoaded)
    const modal = document.getElementById("productModal");
    const closeBtn = document.querySelector(".close");
    
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
});

// Display products
function displayProducts(filteredProducts = products) {
    const container = document.getElementById("products");
    if (!container) return; // Safety check
    
    container.innerHTML = "";

    filteredProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <button onclick="addToCart(${index})">Add to Cart</button>
            </div>
        `;

        // Click on image to open modal
        card.querySelector(".product-image").addEventListener("click", () => {
            openModal(product);
        });

        container.appendChild(card);
    });
}

// Display categories
function displayCategories() {
    const categoriesContainer = document.getElementById("categories");
    if (!categoriesContainer || products.length === 0) return;
    
    const categories = [...new Set(products.map(p => p.category))];

    categoriesContainer.innerHTML = "";
    
    // Add "All" button
    const allBtn = document.createElement("button");
    allBtn.className = "category-btn active";
    allBtn.innerText = "All";
    allBtn.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        allBtn.classList.add("active");
        displayProducts(products);
    });
    categoriesContainer.appendChild(allBtn);

    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "category-btn";
        btn.innerText = category;
        btn.addEventListener("click", () => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filtered = products.filter(p => p.category === category);
            displayProducts(filtered);
        });
        categoriesContainer.appendChild(btn);
    });
}

// Search function
function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
}

// Modal functionality
function openModal(product) {
    const modal = document.getElementById("productModal");
    const modalBody = document.getElementById("modalBody");
    
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p class="price">${product.price}</p>
        <p>${product.description}</p>
        <button onclick="addToCartByProduct('${product.name}')">Add to Cart</button>
    `;
    modal.style.display = "block";
}

// Add to cart
function addToCart(index) {
    const product = products[index];
    cart.push(product);
    updateCartBadge();
    alert(`${product.name} added to cart!`);
}

function addToCartByProduct(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        cart.push(product);
        updateCartBadge();
        alert(`${product.name} added to cart!`);
    }
}

function updateCartBadge() {
    const badge = document.querySelector(".cart-badge");
    if (badge) {
        badge.innerText = cart.length;
    }
}

// Show cart
function showCart() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
    } else {
        const items = cart.map(p => `${p.name} - ${p.price}`).join("\n");
        alert(`Your cart:\n\n${items}`);
    }
}
