/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// Función para cargar los productos del carrito
function loadCart() {
    // Obtener el carrito guardado en localStorage, si no existe se asigna un arreglo vacío
    const cart = JSON.parse(localStorage.getItem('cart')) || []; 

    // Contenedores HTML donde se mostrarán los productos y el total de la compra
    const cartContainer = document.getElementById('cartItems'); 
    const totalContainer = document.getElementById('totalPrice'); 

    // Si el carrito está vacío, mostramos un mensaje indicándolo
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>"; // Mensaje si no hay productos
        totalContainer.innerHTML = ""; // Limpiar el total si el carrito está vacío
    } else {
        // Si el carrito tiene productos, limpiamos el contenedor para cargar los nuevos productos
        cartContainer.innerHTML = ""; 
        let totalPrice = 0; // Variable para almacenar el total de la compra

        // Iteramos sobre cada producto en el carrito para mostrarlo
        cart.forEach((item, index) => {
            // Calcular el total de cada producto (precio * cantidad)
            const itemTotal = parseFloat(item.price) * item.quantity; 
            totalPrice += itemTotal; // Sumar el total del producto al total global

            // Crear el HTML para mostrar un producto en el carrito
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item'); // Agregar una clase al producto
            productElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image"> 
                <div class="cart-item-info">
                    <p><strong>${item.name}</strong></p> <!-- Nombre del producto -->
                    <p>Talla: ${item.size}</p> <!-- Talla del producto -->
                    <p>Cantidad: ${item.quantity}</p> <!-- Cantidad del producto -->
                    <p>Precio unitario: S/. ${item.price}</p> <!-- Precio por unidad -->
                    <p>Total: S/. ${itemTotal.toFixed(2)}</p> <!-- Total por producto -->
                </div>
                <button onclick="removeFromCart(${index})">Eliminar</button> <!-- Botón para eliminar el producto -->
            `;
            cartContainer.appendChild(productElement); // Agregar el producto al contenedor
        });

        // Mostrar el total acumulado de la compra
        totalContainer.innerHTML = `<p><strong>Total de la compra: S/. ${totalPrice.toFixed(2)}</strong></p>`;
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    // Obtener el carrito actual desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || []; 

    // Eliminar el producto en la posición 'index' del carrito
    cart.splice(index, 1); 

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart)); 

    // Recargar el carrito para actualizar la vista con los cambios
    loadCart(); 
}

// Función de pago (redirigir a una página de pago)
function checkout() {
    // Verificar si hay productos en el carrito antes de proceder con el pago
    if (JSON.parse(localStorage.getItem('cart')).length > 0) {
        window.location.href = 'pago.html'; // Redirigir a la página de pago si hay productos en el carrito
    } else {
        // Si el carrito está vacío, mostrar una alerta
        alert("Tu carrito está vacío. Agrega productos antes de proceder.");
    }
}


// Ejecuta la función loadCart cuando la página se haya cargado completamente, 
// asegurando que los productos del carrito se muestren al usuario al iniciar la página.
window.onload = loadCart; 

