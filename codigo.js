// Plantilla para una fila en la tabla
const filaTemplate = `
<tr>
    <td class="id"></td>
    <td class="foto"></td>
    <td class="price"></td>
    <td class="title"></td>
    <td class="description"></td>
    <td class="category"></td>
    <td><button class="btn-eliminar" data-id="">Eliminar</button></td>
</tr>
`;

let productos = [];
let orden = 0;

// Función para obtener el código de categoría
function codigoCat(catstr) {
    const categorias = {
        "electronicos": "c1",
        "joyeria": "c2",
        "caballeros": "c3",
        "damas": "c4"
    };
    return categorias[catstr] || "null";
}

// Listar productos en la tabla
function listarProductos(productos) {
    const precio = document.getElementById("price");
    precio.setAttribute("onclick", "orden *= -1; listarProductos(productos);");
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    if (orden === 1) {
        ordenarAsc(productos, "price");
        precio.innerHTML = "Precio A";
        precio.style.color = "darkgreen";
    } else if (orden === -1) {
        ordenarDesc(productos, "price");
        precio.innerHTML = "Precio D";
        precio.style.color = "blue";
    } else {
        precio.innerHTML = "Precio";
        precio.style.color = "";
    }

    productos.forEach(producto => {
        tbody.insertAdjacentHTML("beforeend", filaTemplate);
        const fila = tbody.lastElementChild;

        fila.querySelector(".id").textContent = producto.id;
        fila.querySelector(".title").textContent = producto.title;
        fila.querySelector(".description").textContent = producto.description;
        fila.querySelector(".category").textContent = producto.category;
        fila.querySelector(".price").textContent = `$${producto.price.toFixed(2)}`;
        fila.querySelector(".foto").innerHTML = `<img src="${producto.image}" onclick="window.open('${producto.image}')" />`;

        const catCode = codigoCat(producto.category);
        fila.className = catCode;

        const btnEliminar = fila.querySelector(".btn-eliminar");
        btnEliminar.dataset.id = producto.id;
        btnEliminar.addEventListener("click", () => eliminarProducto(producto.id));
    });

    document.getElementById("listado").style.display = "block";
}

// Obtener productos de la API
function obtenerProductos() {
    fetch('https://api-generator.retool.com/WUdIen/productos')
        .then(response => response.json())
        .then(data => {
            productos = data.map(producto => ({ ...producto, price: parseFloat(producto.price) }));
            listarProductos(productos);
        })
        .catch(error => console.error("Error al obtener productos:", error));
}

// Ordenar productos de manera ascendente
function ordenarAsc(array, key) {
    array.sort((a, b) => (a[key] > b[key] ? 1 : -1));
}

// Ordenar productos de manera descendente
function ordenarDesc(array, key) {
    array.sort((a, b) => (a[key] < b[key] ? 1 : -1));
}

// Agregar un nuevo producto
function agregarProducto() {
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;

    if (!titulo || !descripcion || isNaN(precio) || !categoria || !imagen) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const nuevoProducto = { title: titulo, description: descripcion, price: precio, category: categoria, image: imagen };

    fetch('https://api-generator.retool.com/WUdIen/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
    })
        .then(response => response.json())
        .then(() => {
            alert("Producto agregado exitosamente.");
            obtenerProductos();
        })
        .catch(error => alert("Error al agregar producto: " + error.message));
}

function eliminarProducto(id) {
    // Elimina el producto del arreglo 'productos'
    productos = productos.filter(producto => producto.id !== id);
    
    // Elimina la fila del producto en la tabla
    const productoFila = document.getElementById(`producto-${id}`);
    if (productoFila) {
        productoFila.remove();
		
    }
    
    // Actualiza el listado de productos
    listarProductos(productos);
    
    // Opcional: Puedes hacer una petición al servidor para eliminar el producto de la base de datos
    fetch(`https://api-generator.retool.com/WUdIen/productos/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        console.log("Producto eliminado correctamente");
    })
    .catch(error => {
        console.error("Error al eliminar el producto:", error);
    });
}

