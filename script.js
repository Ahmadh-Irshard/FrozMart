let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
}


var swiper = new Swiper(".product-slider", {
    loop:true,
    spaceBetween: 20,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 4,
      },
      1020: {
        slidesPerView: 3,
      },
    },
  });

  document.addEventListener('DOMContentLoaded', () => {
    const cartTableBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartTableBody) {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const product = button.getAttribute('data-product');
                const price = parseFloat(button.getAttribute('data-price'));
                const weight = parseFloat(button.getAttribute('data-weight'));
                const quantityInput = document.getElementById(`${product}-quantity`);
                const quantity = parseFloat(quantityInput.value);
                
                if (isNaN(quantity) || quantity <= 0) {
                    alert('Please enter a valid quantity.');
                    return;
                }

                const totalPrice = (price * quantity).toFixed(2);
                let productRow = document.querySelector(`#cart-body tr[data-product="${product}"]`);
                
                if (productRow) {
                    const existingQuantity = parseFloat(productRow.querySelector('.cart-quantity').textContent);
                    const newQuantity = (existingQuantity + quantity).toFixed(2);
                    productRow.querySelector('.cart-quantity').textContent = newQuantity;
                    productRow.querySelector('.cart-total').textContent = (price * newQuantity).toFixed(2);
                } else {
                    productRow = document.createElement('tr');
                    productRow.setAttribute('data-product', product);
                    productRow.innerHTML = `<td>${product}</td>
                                            <td class="cart-quantity">${quantity}</td>
                                            <td>${price.toFixed(2)}</td>
                                            <td class="cart-total">${totalPrice}</td>
                                            <td><button class="remove-from-cart">Remove</button></td>`;
                    cartTableBody.appendChild(productRow);
                }

                updateCartTotal();
                quantityInput.value = '';
            });
        });

        cartTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-cart')) {
                event.target.closest('tr').remove();
                updateCartTotal();
            }
        });

        function updateCartTotal() {
            let total = 0;
            cartTableBody.querySelectorAll('tr[data-product]').forEach(row => {
                const rowTotal = parseFloat(row.querySelector('.cart-total').textContent || '0');
                total += rowTotal;
            });
            cartTotal.textContent = `$${total.toFixed(2)}`;
            if (cartTableBody.children.length === 0) {
                document.getElementById('cart-placeholder').style.display = 'table-row';
            } else {
                document.getElementById('cart-placeholder').style.display = 'none';
            }
        }

        const buyNowButton = document.querySelector('.buy-now');
        if (buyNowButton) {
            buyNowButton.addEventListener('click', () => {
                const cartItems = [];
                cartTableBody.querySelectorAll('tr[data-product]').forEach(row => {
                    const product = row.getAttribute('data-product');
                    const quantity = parseFloat(row.querySelector('.cart-quantity').textContent);
                    const price = parseFloat(row.querySelector('.cart-total').textContent);
                    cartItems.push({ product, quantity, price });
                });
                sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
                sessionStorage.setItem('cartTotal', cartTotal.textContent);
                window.location.href = 'orders.html';
            });
        }
    }

    const orderSummary = document.getElementById('order-summary');
    if (orderSummary) {
        const cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
        const total = sessionStorage.getItem('cartTotal') || '$0.00';
        const orderTable = document.createElement('table');
        orderTable.innerHTML = `<thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody id="order-body">
                                    ${cartItems.map(item => `
                                        <tr>
                                            <td>${item.product}</td>
                                            <td>${item.quantity}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                        </tr>`).join('')}
                                </tbody>`;
        orderSummary.appendChild(orderTable);
        const orderTotal = document.createElement('div');
        orderTotal.className = 'order-total';
        orderTotal.innerHTML = `<h3>Total: ${total}</h3>`;
        orderSummary.appendChild(orderTotal);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initializeFavourites();
});

function initializeFavourites() {
    const addToFavouritesButton = document.getElementById('add-to-favourites');
    const applyFavouritesButton = document.getElementById('apply-favourites');

    // Add event listeners only if the buttons exist
    if (addToFavouritesButton) {
        addToFavouritesButton.removeEventListener('click', handleAddToFavourites);
        addToFavouritesButton.addEventListener('click', handleAddToFavourites);
    }

    if (applyFavouritesButton) {
        applyFavouritesButton.removeEventListener('click', handleApplyFavourites);
        applyFavouritesButton.addEventListener('click', handleApplyFavourites);
    }
}

function handleAddToFavourites() {
    const orderTableBody = document.getElementById('order-body');
    const orderItems = [];

    if (orderTableBody) {
        orderTableBody.querySelectorAll('tr').forEach(row => {
            const product = row.querySelector('td:nth-child(1)').textContent;
            const quantity = row.querySelector('td:nth-child(2)').textContent;
            const totalPrice = row.querySelector('td:nth-child(3)').textContent;

            orderItems.push({ product, quantity, totalPrice });
        });

        localStorage.setItem('favouriteOrder', JSON.stringify(orderItems));
        console.log('Order saved as a favourite:', orderItems);
        alert('Order saved as a favourite!');
    }
}

function handleApplyFavourites() {
    const orderItems = JSON.parse(localStorage.getItem('favouriteOrder')) || [];
    const orderTableBody = document.getElementById('order-body');
    const cartTotal = document.getElementById('cart-total'); // Assuming you want to update this as well

    if (orderItems.length > 0) {
        orderTableBody.innerHTML = ''; // Clear existing items

        let total = 0;

        orderItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.product}</td>
                              <td>${item.quantity}</td>
                              <td>${item.totalPrice}</td>`;
            orderTableBody.appendChild(row);

            // Accumulate total price
            total += parseFloat(item.totalPrice);
        });

        // Update the total display
        const orderTotal = document.querySelector('.order-total');
        if (orderTotal) {
            orderTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        }

        // Update cart total if it exists
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }

        alert('Favourites applied to the order summary!');
    } else {
        alert('No favourites found.');
    }
}

// Other event listeners
document.getElementById('combined-form').addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Hide the form
    this.style.display = 'none';
    
    // Show the thank you message
    const thankYouMessage = document.getElementById('thank-you-message');
    thankYouMessage.style.display = 'block';

    // Generate a random delivery date
    const deliveryDateElement = document.getElementById('delivery-date');
    const futureDate = new Date();
    const minDays = 1; // Minimum days from now
    const maxDays = 30; // Maximum days from now

    // Random number of days to add
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    futureDate.setDate(futureDate.getDate() + randomDays);

    // Format the date (e.g., Aug 15, 2024)
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = futureDate.toLocaleDateString(undefined, options);

    // Set the delivery date text
    deliveryDateElement.textContent = `Estimated Delivery Date: ${formattedDate}`;
});

document.getElementById('menu-btn').addEventListener('click', function() {
    document.getElementById('hamburger-menu').style.display = 'block';
});

document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('hamburger-menu').style.display = 'none';
});

// Close hamburger menu if a link is clicked (optional)
document.querySelectorAll('.hamburger-navbar a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('hamburger-menu').style.display = 'none';
    });
});
