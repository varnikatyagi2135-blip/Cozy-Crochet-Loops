/* =========================================================
   COZY CROCHET LOOPS - MAIN SCRIPT
   ========================================================= */


/* ================= ADD TO CART ================= */

function addToCart(button) {

    const productCard = button.closest(".product-card");

    if (!productCard) {
        alert("Sorry, this product could not be added.");
        return;
    }

    const nameElement = productCard.querySelector("h4, h3");
    const priceElement = productCard.querySelector(".price");
    const imageElement = productCard.querySelector("img");
    const colourElement = productCard.querySelector(".colour-select");

    const name = nameElement
        ? nameElement.textContent.trim()
        : "Crochet Product";

    const price = priceElement
        ? parseInt(priceElement.textContent.replace(/[^\d]/g, ""))
        : 0;

    const image = imageElement
        ? imageElement.getAttribute("src")
        : "";

    const colour = colourElement
        ? colourElement.value
        : "Black";

    if (!price) {
        alert("There was a problem with this product.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cozyCart")) || [];

    const existingProduct = cart.find(
        item => item.name === name && item.colour === colour
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            colour: colour,
            quantity: 1
        });
    }

    localStorage.setItem("cozyCart", JSON.stringify(cart));

    alert(name + " added to your cart! 🛒✨");
}


/* ================= ORDERS ================= */

function getOrders() {
    return JSON.parse(localStorage.getItem("cozyOrderHistory")) || [];
}


function saveOrders(orders) {
    localStorage.setItem(
        "cozyOrderHistory",
        JSON.stringify(orders)
    );
}


/* ================= DISPLAY MY ORDERS ================= */

function displayMyOrders() {

    const container =
        document.getElementById("orders-container") ||
        document.getElementById("my-orders-content");

    if (!container) {
        return;
    }

    const orders = getOrders();

    /* No orders */

    if (orders.length === 0) {

        container.innerHTML = `
            <div class="no-orders">
                <h3>🛍️ No orders yet</h3>

                <p>
                    Your placed orders will appear here.
                </p>

                <a href="#shop">
                    Start Shopping ✨
                </a>
            </div>
        `;

        return;
    }


    /* Orders exist */

    container.innerHTML = "";


    orders.forEach((order, index) => {

        const products = order.products || order.items || [];

        let productHTML = "";

        products.forEach(product => {

            const quantity =
                product.quantity || 1;

            productHTML += `
                <div class="order-product">

                    <img
                        src="${product.image || ""}"
                        alt="${product.name || "Crochet Product"}"
                    >

                    <div>
                        <strong>
                            ${product.name || "Crochet Product"}
                        </strong>

                        <p>
                            Colour:
                            ${product.colour || product.color || "Black"}
                        </p>

                        <p>
                            Quantity:
                            ${quantity}
                        </p>

                        <p>
                            ₹${product.price || 0}
                        </p>
                    </div>

                </div>
            `;
        });


        const orderStatus =
            order.status || "Order Placed";


        const orderCard = document.createElement("div");

        orderCard.className = "order-card";


        orderCard.innerHTML = `

            <div class="order-card-header">

                <div>

                    <h3>
                        🧶 Order ${order.id || order.orderId || "CCL-ORDER"}
                    </h3>

                    <p>
                        📅 ${order.date || "Recently placed"}
                    </p>

                </div>

                <span class="order-status">
                    ${orderStatus}
                </span>

            </div>


            <div class="order-details">

                <p>
                    <strong>👤 Customer:</strong>
                    ${order.name || "Customer"}
                </p>

                <p>
                    <strong>📍 Delivery:</strong>
                    ${order.city || "Delivery address saved"}
                </p>

                <p>
                    <strong>💳 Payment:</strong>
                    ${order.payment || "Cash on Delivery"}
                </p>

            </div>


            <div class="order-products">

                <h4>🛍️ Your Products</h4>

                ${productHTML}

            </div>


            <div class="order-total">

                <strong>
                    Total: ₹${order.total || 0}
                </strong>

            </div>


            <div class="order-actions">

                <button
                    onclick="trackOrder(${index})"
                    class="track-order-btn"
                >
                    🚚 Track Order
                </button>


                ${
                    orderStatus !== "Delivered" &&
                    orderStatus !== "Cancelled"
                    ? `
                        <button
                            onclick="cancelOrder(${index})"
                            class="cancel-order-btn"
                        >
                            ❌ Cancel Order
                        </button>
                    `
                    : ""
                }


                ${
                    orderStatus === "Delivered"
                    ? `
                        <button
                            onclick="returnOrder(${index})"
                            class="return-order-btn"
                        >
                            🔄 Return Order
                        </button>
                    `
                    : ""
                }

            </div>


            <div
                id="tracking-${index}"
                class="tracking-box"
                style="display:none;"
            ></div>

        `;


        container.appendChild(orderCard);

    });

}


/* ================= TRACK ORDER ================= */

function trackOrder(index) {

    const orders = getOrders();

    const order = orders[index];

    if (!order) {
        return;
    }

    const trackingBox =
        document.getElementById("tracking-" + index);

    if (!trackingBox) {
        return;
    }


    const status =
        order.status || "Order Placed";


    let placed = "✅";
    let shipped = "⬜";
    let outForDelivery = "⬜";
    let delivered = "⬜";


    if (status === "Shipped") {

        shipped = "✅";

    } else if (status === "Out for Delivery") {

        shipped = "✅";
        outForDelivery = "✅";

    } else if (status === "Delivered") {

        shipped = "✅";
        outForDelivery = "✅";
        delivered = "✅";

    } else if (status === "Cancelled") {

        trackingBox.innerHTML = `
            <div class="tracking-cancelled">
                ❌ This order has been cancelled.
            </div>
        `;

        trackingBox.style.display = "block";

        return;
    }


    trackingBox.innerHTML = `

        <h4>🚚 Order Tracking</h4>

        <div class="tracking-step">
            <span>${placed}</span>
            <strong>Order Placed</strong>
        </div>

        <div class="tracking-line"></div>

        <div class="tracking-step">
            <span>${shipped}</span>
            <strong>Shipped</strong>
        </div>

        <div class="tracking-line"></div>

        <div class="tracking-step">
            <span>${outForDelivery}</span>
            <strong>Out for Delivery</strong>
        </div>

        <div class="tracking-line"></div>

        <div class="tracking-step">
            <span>${delivered}</span>
            <strong>Delivered</strong>
        </div>

    `;


    trackingBox.style.display = "block";
}


/* ================= CANCEL ORDER ================= */

function cancelOrder(index) {

    const orders = getOrders();

    if (!orders[index]) {
        return;
    }


    if (orders[index].status === "Delivered") {

        alert("A delivered order cannot be cancelled.");
        return;
    }


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this order?"
        );


    if (!confirmCancel) {
        return;
    }


    orders[index].status = "Cancelled";

    saveOrders(orders);

    displayMyOrders();

    alert("Your order has been cancelled. ❌");
}


/* ================= RETURN ORDER ================= */

function returnOrder(index) {

    const orders = getOrders();

    if (!orders[index]) {
        return;
    }


    if (orders[index].status !== "Delivered") {

        alert(
            "You can request a return after the order is delivered."
        );

        return;
    }


    const confirmReturn =
        confirm(
            "Would you like to request a return for this order?"
        );


    if (!confirmReturn) {
        return;
    }


    orders[index].status = "Return Requested";

    saveOrders(orders);

    displayMyOrders();

    alert(
        "Your return request has been submitted. 🔄✨"
    );
}


/* ================= PAGE LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayMyOrders();

    }
);