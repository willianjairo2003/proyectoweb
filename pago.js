// Cargar el objeto jsPDF de la librería
const { jsPDF } = window.jspdf;  // Usamos esta línea para acceder correctamente a la clase jsPDF

// Función para cargar el resumen del carrito en la página de pago
function loadCartSummary() {
    // Verificar si localStorage está disponible en el navegador
    if (typeof(Storage) !== "undefined") {
        // Obtener el carrito desde localStorage, o un carrito vacío si no existe
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Obtener los elementos del DOM donde se mostrarán el resumen del carrito y el total
        const cartItemsSummary = document.getElementById('cartItemsSummary');
        const totalPriceSummary = document.getElementById('totalPriceSummary');
        const shippingMethodSelect = document.getElementById('shippingMethod'); // Select del método de envío
        let totalPrice = 0; // Variable para almacenar el total del precio de los productos
        let shippingCost = 30; // Costo de envío por defecto (Envío estándar)

        // Si el carrito está vacío, mostrar un mensaje indicando que está vacío
        if (cart.length === 0) {
            cartItemsSummary.innerHTML = "<p>Tu carrito está vacío.</p>";
            totalPriceSummary.innerHTML = ""; // Limpiar el total si el carrito está vacío
        } else {
            cartItemsSummary.innerHTML = ""; // Limpiar el contenedor antes de agregar los productos
            // Recorrer cada producto del carrito y mostrar su información
            cart.forEach(item => {
                const itemPrice = parseFloat(item.price) || 0; // Obtener el precio del producto
                const itemQuantity = parseInt(item.quantity) || 0; // Obtener la cantidad del producto
                const itemTotal = itemPrice * itemQuantity; // Calcular el total por producto
                totalPrice += itemTotal; // Sumar el total de cada producto al total global

                // Crear un elemento para mostrar la información del producto en el resumen
                const productElement = document.createElement('div');
                productElement.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; margin-right: 10px;">
                        <div>
                            <strong>${item.name}</strong> - Talla: ${item.size} - Cantidad: ${item.quantity} - S/. ${itemPrice.toFixed(2)} - Total: S/. ${itemTotal.toFixed(2)}
                        </div>
                    </div>
                `;
                cartItemsSummary.appendChild(productElement); // Añadir el producto al contenedor del carrito
            });

            // Actualizar el total sumando el costo de envío y el total de los productos
            updateTotal(shippingCost, totalPrice);
        }

        // Escuchar cambios en el select del método de envío para actualizar el costo de envío
        shippingMethodSelect.addEventListener('change', function () {
            // Verificar qué opción de envío se ha seleccionado y actualizar el costo de envío
            switch (shippingMethodSelect.value) {
                case "express":
                    shippingCost = 60; // Envío exprés
                    break;
                case "standard":
                default:
                    shippingCost = 30; // Envío estándar
                    break;
            }

            // Actualizar el total con el nuevo costo de envío y el total de productos
            updateTotal(shippingCost, totalPrice);
        });
    } else {
        console.log("localStorage no soportado"); // Si localStorage no está soportado, mostrar un mensaje en la consola
    }
}


// Función para actualizar el total
function updateTotal(shippingCost, totalPrice) {
    // Obtener el elemento donde se mostrará el resumen del precio total
    const totalPriceSummary = document.getElementById('totalPriceSummary');
    
    // Calcular el total general sumando el precio de los productos y el costo de envío
    const grandTotal = totalPrice + shippingCost;

    // Actualizar el contenido del resumen del total con los valores calculados
    totalPriceSummary.innerHTML = `
        <p><strong>Total de los productos: S/. ${totalPrice.toFixed(2)}</strong></p>
        <p><strong>Costo de envío: S/. ${shippingCost.toFixed(2)}</strong></p>
        <p><strong>Total de la compra: S/. ${grandTotal.toFixed(2)}</strong></p>
    `;
}



// Función para mostrar la ventana flotante para la vista previa del PDF
function openPreviewModal() {
    document.getElementById("pdfPreviewModal").style.display = "flex";
}


// Función para cerrar la ventana flotante
function closePreviewModal() {
    document.getElementById("pdfPreviewModal").style.display = "none";
}


// Función para generar el PDF después de confirmar el pedido
document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Mostrar mensaje de confirmación y ocultar formulario
    document.getElementById('paymentForm').style.display = 'none';
    document.getElementById('confirmationMessage').style.display = 'block';

    // Mostrar el botón de descarga del PDF
    document.getElementById('downloadPDF').style.display = 'inline-block';  // Aquí se asegura de que el botón se muestre
});



// Función para mostrar la vista previa antes de descargar el PDF
document.getElementById('downloadPDF').addEventListener('click', function() {
    // Obtener el contenido de los productos del carrito desde el resumen
    const cartItems = document.getElementById('cartItemsSummary').innerText;
    // Obtener el contenido del total de la compra desde el resumen
    const totalPrice = document.getElementById('totalPriceSummary').innerText;
    // Obtener la información del usuario desde los campos del formulario
    const userInfo = `
        Nombre: ${document.getElementById('nombre').value}
        Teléfono: ${document.getElementById('phoneNumber').value}
        DNI: ${document.getElementById('dni').value}
        Ciudad: ${document.getElementById('city').value}
        Dirección: ${document.getElementById('address').value}
    `;

    // Crear el contenido que se mostrará en la ventana flotante para la vista previa
    const previewContent = `
        <p><strong>Resumen de la compra:</strong></p>
        <p><strong>Productos:</strong> ${cartItems}</p>
        <p><strong>Total:</strong> ${totalPrice}</p>
        <p><strong>Información del usuario:</strong><br/>${userInfo}</p>
    `;
    
    // Insertar el contenido generado de la vista previa en el modal
    document.getElementById("pdfPreviewContent").innerHTML = previewContent;

    // Mostrar la ventana flotante de vista previa con el contenido generado
    openPreviewModal();

    // Mostrar el botón para confirmar y descargar el PDF
    document.getElementById("confirmDownloadBtn").style.display = "inline-block";
});


// Función para generar y descargar el PDF
function downloadPDF() {
    const doc = new jsPDF(); // Crear una nueva instancia de jsPDF para generar el PDF
    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Obtener los productos del carrito desde localStorage
    const totalPriceText = document.getElementById('totalPriceSummary').innerText; // Obtener el texto del total de los productos
    const shippingCost = totalPriceText.includes('30') ? 30 : 60;  // Detectar el costo de envío desde el texto (30 o 60 dependiendo del método)

    // Extraer el valor numérico del total de los productos usando una expresión regular
    const totalPriceMatch = totalPriceText.match(/Total de los productos: S\/.\s*(\d+[\.,]?\d*)/);
    const totalPrice = totalPriceMatch ? parseFloat(totalPriceMatch[1].replace(',', '').replace(' ', '').trim()) : 0;  // Extraer el valor numérico correctamente

    const userInfo = `  // Crear un string con la información del usuario
        Nombre: ${document.getElementById('nombre').value}
        Teléfono: ${document.getElementById('phoneNumber').value}
        DNI: ${document.getElementById('dni').value}
        Ciudad: ${document.getElementById('city').value}
        Dirección: ${document.getElementById('address').value}
    `;

    // Verificar si el total de los productos es un número válido
    if (isNaN(totalPrice) || totalPrice <= 0) {
        console.error('Total de los productos no es un número válido');
        return;
    }

    // Configuración del PDF: establecer la fuente y el tamaño
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Resumen de la Compra', 10, 10); // Escribir el título en el PDF

    // Crear la tabla de productos con las columnas correspondientes
    const tableColumns = ["Producto", "Talla", "Cantidad", "Precio Unitario", "Total"];
    const tableRows = cart.map(item => {  // Mapear los productos para obtener la fila de cada producto
        const itemPrice = parseFloat(item.price) || 0;  // Obtener el precio de cada producto
        const itemQuantity = parseInt(item.quantity) || 0;  // Obtener la cantidad de cada producto
        const itemTotal = itemPrice * itemQuantity;  // Calcular el total por producto
        return [item.name, item.size, item.quantity, `S/. ${itemPrice.toFixed(2)}`, `S/. ${itemTotal.toFixed(2)}`];  // Crear una fila con los datos
    });

    // Usar autoTable para agregar la tabla de productos al PDF
    doc.autoTable({
        head: [tableColumns],  // Definir las cabeceras de la tabla
        body: tableRows,  // Definir las filas de la tabla
        startY: 30,  // Empezar justo debajo del título
        theme: 'grid',  // Establecer el tema de la tabla
        headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' },  // Estilo para las cabeceras
        styles: { fontSize: 10 }  // Estilo para las celdas
    });

    // Agregar los totales en una tabla separada
    const totalTableColumns = ["Descripción", "Monto"];
    const totalTableRows = [
        ["Total de los productos", `S/. ${totalPrice.toFixed(2)}`],  // Fila para el total de los productos
        ["Costo de envío", `S/. ${shippingCost.toFixed(2)}`],  // Fila para el costo de envío
        ["Total de la compra", `S/. ${(totalPrice + shippingCost).toFixed(2)}`]  // Fila para el total final
    ];

    doc.autoTable({
        head: [totalTableColumns],  // Definir las cabeceras de la tabla de totales
        body: totalTableRows,  // Definir las filas de la tabla de totales
        startY: doc.lastAutoTable.finalY + 10,  // Colocar la tabla de totales debajo de la tabla de productos
        theme: 'grid',  // Establecer el tema de la tabla
        headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' },  // Estilo para las cabeceras
        styles: { fontSize: 10 }  // Estilo para las celdas
    });

    // Información del usuario en una tabla separada
    const userTableColumns = ["Campo", "Información"];
    const userTableRows = [
        ["Nombre", document.getElementById('nombre').value],  // Fila para el nombre del usuario
        ["Teléfono", document.getElementById('phoneNumber').value],  // Fila para el teléfono
        ["DNI", document.getElementById('dni').value],  // Fila para el DNI
        ["Ciudad", document.getElementById('city').value],  // Fila para la ciudad
        ["Dirección", document.getElementById('address').value]  // Fila para la dirección
    ];

    doc.autoTable({
        head: [userTableColumns],  // Definir las cabeceras de la tabla de información del usuario
        body: userTableRows,  // Definir las filas de la tabla de información del usuario
        startY: doc.lastAutoTable.finalY + 10,  // Colocar la tabla de usuario debajo de la tabla de totales
        theme: 'grid',  // Establecer el tema de la tabla
        headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12, fontStyle: 'bold' },  // Estilo para las cabeceras
        styles: { fontSize: 10 }  // Estilo para las celdas
    });

    // Descargar el PDF con el nombre 'reporte_compra.pdf'
    doc.save('reporte_compra.pdf');

    // Cerrar la ventana flotante después de la descarga
    closePreviewModal();
}


// Cargar el resumen cuando se cargue la página de pago
window.onload = loadCartSummary;
