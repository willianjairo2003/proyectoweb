// Asignar el evento al botón de filtrado (cuando se hace clic en el botón "filtrarBoton")
document.getElementById("filtrarBoton").addEventListener("click", function() {

    // Obtener los valores de los filtros seleccionados por el usuario
    const disponibilidad = document.getElementById("disponibilidad").value;  // Obtener la disponibilidad seleccionada
    const precioMin = parseFloat(document.getElementById("precioMin").value); // Obtener el precio mínimo
    const precioMax = parseFloat(document.getElementById("precioMax").value); // Obtener el precio máximo

    // Validar que los precios sean números válidos
    const esPrecioValido = !isNaN(precioMin) && !isNaN(precioMax);

    // Obtener todos los productos que tienen la clase "producto"
    const productos = document.querySelectorAll(".producto");

    // Recorrer cada producto para aplicar los filtros
    productos.forEach(function(producto) {
        // Obtener el precio y la disponibilidad de cada producto
        const precioProducto = parseFloat(producto.getAttribute("data-precio")); // Precio del producto
        const disponibilidadProducto = producto.getAttribute("data-disponibilidad"); // Disponibilidad del producto

        let cumpleFiltro = true; // Inicializar la variable que verificará si el producto cumple con todos los filtros

        // Filtrar por disponibilidad
        if (disponibilidad !== "" && disponibilidad !== "todos" && disponibilidad !== disponibilidadProducto) {
            cumpleFiltro = false;
        }

        // Filtrar por precio
        if (esPrecioValido) {
            if ((precioMin && precioProducto < precioMin) || (precioMax && precioProducto > precioMax)) {
                cumpleFiltro = false;
            }
        }

        // Si el producto cumple con todos los filtros, se muestra, de lo contrario se oculta
        producto.style.display = cumpleFiltro ? "block" : "none";
    });
});

// Función para buscar productos
function searchProducts() {
    let input = document.getElementById("srch").value.toLowerCase(); // Obtener el valor de búsqueda
    let productos = document.querySelectorAll(".producto"); // Obtener los productos
    let results = document.getElementById("search-results"); // Contenedor de resultados de búsqueda

    // Si el campo de búsqueda está vacío, ocultamos los resultados
    if (!input.trim()) {
        results.innerHTML = "";
        results.style.display = 'none';
        return;
    }

    // Filtrar los productos basados en el texto ingresado en la búsqueda
    let filteredProducts = Array.from(productos).filter(product => {
        let nombre = product.querySelector("h3") ? product.querySelector("h3").textContent.toLowerCase() : '';
        let precio = product.getAttribute("data-precio") ? product.getAttribute("data-precio").toLowerCase() : '';
        let descripcion = product.querySelector("p") ? product.querySelector("p").textContent.toLowerCase() : '';

        // Compara el texto de búsqueda con el nombre, precio o descripción del producto
        return nombre.includes(input) || 
               precio.includes(input) || 
               descripcion.includes(input);
    });

    // Mostrar los productos filtrados si hay resultados
    if (filteredProducts.length > 0) {
        results.innerHTML = filteredProducts.map(product => {
            let nombre = product.querySelector("h3") ? product.querySelector("h3").textContent : '';
            let precio = product.getAttribute("data-precio") ? product.getAttribute("data-precio") : '';
            let imagen = product.querySelector("img") ? product.querySelector("img").getAttribute("src") : '';
            let link = product.querySelector("a") ? product.querySelector("a").getAttribute("href") : '';

            return `
                <div class="product" onclick="window.location='${link}';">
                    <img src="${imagen}" alt="${nombre}" class="product-thumbnail">
                    <div>
                        <h3>${nombre}</h3>
                        <p>S/. ${precio} PEN</p>
                    </div>
                </div>
            `;
        }).join('');
        results.style.display = 'block'; // Mostrar el contenedor de resultados
    } else {
        results.innerHTML = "<p>No se encontraron productos.</p>";
        results.style.display = 'block';
    }
}

// Asigna el evento 'onkeyup' al campo de búsqueda para ejecutar la función de búsqueda al escribir
document.getElementById("srch").addEventListener("keyup", searchProducts);

// Asignar un evento 'click' al botón de tipo 'submit'
document.querySelector("button[type='submit']").addEventListener("click", function(event) {
    event.preventDefault();  // Evitar que el formulario se envíe
    searchProducts();        // Ejecutar la función de búsqueda
});
