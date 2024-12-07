/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


// Función para cambiar la imagen principal
function changeImage(imageSrc) {
    document.getElementById("mainImage").src = imageSrc;
}

// Función para ordenar los productos por nombre
function sortCartByName(cart) {
    return cart.sort((a, b) => a.name.localeCompare(b.name));
}

// Función para agregar un producto al carrito
function addToCart() {
    // Obtener la información del producto desde el HTML
    const productName = document.querySelector(".product-name").innerText; // Nombre del producto
    const productPrice = parseFloat(document.querySelector(".product-price").innerText.replace("S/. ", "")); // Precio del producto (se elimina el "S/. " y se convierte a número)
    const productSize = document.getElementById("sizes").value; // Talla seleccionada
    const productQuantity = parseInt(document.getElementById("quantity").value) || 1; // Cantidad seleccionada, por defecto 1 si no se ingresa nada

    // Validar que todos los campos requeridos estén completos
    if (!productName || !productPrice || !productSize || !productQuantity) {
        alert("Por favor, complete todos los campos."); // Mostrar alerta si algún campo está vacío
        return; // Detener la ejecución de la función si falta algún dato
    }

    // Crear un objeto que representa el producto con los datos obtenidos
    const product = {
        name: productName,       // Nombre del producto
        price: productPrice,     // Precio del producto
        size: productSize,       // Talla del producto
        quantity: productQuantity, // Cantidad del producto
        image: document.getElementById("mainImage").src // Imagen del producto (obtenida de la fuente del elemento HTML)
    };

    // Obtener el carrito actual del localStorage o inicializarlo como un arreglo vacío si no existe
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Añadir el nuevo producto al carrito
    cart.push(product);

    // Ordenar el carrito por nombre de producto (usando la función sortCartByName)
    cart = sortCartByName(cart);

    // Guardar el carrito actualizado (y ordenado) de nuevo en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Mostrar un mensaje de confirmación al usuario
    alert("Producto añadido al carrito!");
}

// Función para manejar la compra inmediata (al hacer clic en "Comprar ahora")
function buyNow() {
    // Obtener información del producto desde la página
    const productName = document.querySelector(".product-name").innerText; // Nombre del producto
    const productPrice = parseFloat(document.querySelector(".product-price").innerText.replace("S/. ", "")); // Precio del producto (elimina el "S/. " y lo convierte a número)
    const productSize = document.getElementById("sizes").value; // Talla seleccionada
    const productQuantity = parseInt(document.getElementById("quantity").value) || 1; // Cantidad seleccionada, por defecto 1 si no se ingresa nada

    // Validar que todos los campos estén completos
    if (!productName || !productPrice || !productSize || !productQuantity) {
        alert("Por favor, complete todos los campos."); // Si falta algún campo, mostrar alerta
        return; // Detener la ejecución de la función si algún dato es incompleto
    }

    // Redirigir al usuario a la página de pago, pasando los detalles del producto como parámetros en la URL
    window.location.href = "pago.html?productName=" + productName + 
                          "&productPrice=" + productPrice + 
                          "&productSize=" + productSize + 
                          "&productQuantity=" + productQuantity;
}


// Asignar los eventos a los botones
document.getElementById("addToCartButton").addEventListener("click", addToCart);
document.getElementById("buyNowButton").addEventListener("click", buyNow);






  // Abrir y cerrar la ventana del chatbot
            document.getElementById("chatbotIcon").addEventListener("click", function() {
                const chatbotWindow = document.getElementById("chatbotWindow");
                chatbotWindow.style.display = chatbotWindow.style.display === "block" ? "none" : "block";
            });

            // Cerrar el chatbot con el botón 'X'
            document.getElementById("closeChatbot").addEventListener("click", function() {
                document.getElementById("chatbotWindow").style.display = "none";
            });

            // Función para enviar el mensaje
            document.getElementById("sendMessage").addEventListener("click", function() {
                const userMessage = document.getElementById("userMessage").value;
                if (userMessage.trim() === "") {
                    alert("Por favor, ingresa un mensaje.");
                    return;
                }

                // Mostrar el mensaje del usuario en el chatbot
                const chatbotContent = document.getElementById("chatbotContent");
                chatbotContent.innerHTML += `<p><strong>Tú:</strong> ${userMessage}</p>`;
                document.getElementById("userMessage").value = "";
            });

