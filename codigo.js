var fila="<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td></tr>";
var productos = [];
  function codigoCat(catstr) {
	var code="null";
	switch(catstr) {
		case "electronicos":code="c1";break;
	    case "joyeria":code="c2";break;
		case "caballeros":code="c3";break;
		case "damas":code="c4";break;
	}
	return code;
}   
	  var orden=0;
	  
	  
function listarProductos(productos) {
	  var precio=document.getElementById("price"); 
	  precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	  var num=productos.length;
	  var listado=document.getElementById("listado");
	  var ids,titles,prices,descriptions,categories,fotos;
	  var tbody=document.getElementById("tbody"),nfila=0;
	  tbody.innerHTML="";
	  var catcode;
	  for(i=0;i<num;i++) tbody.innerHTML+=fila;
	  var tr; 
	  ids=document.getElementsByClassName("id");
	  titles=document.getElementsByClassName("title");
	  descriptions=document.getElementsByClassName("description");
	  categories=document.getElementsByClassName("category");   
	  fotos=document.getElementsByClassName("foto");   
	  prices=document.getElementsByClassName("price");   
	  if(orden===0) {orden=-1;precio.innerHTML="Precio"}
	  else
	     if(orden==1) {ordenarAsc(productos,"price");precio.innerHTML="Precio A";precio.style.color="darkgreen"}
	     else 
	       if(orden==-1) {ordenarDesc(productos,"price");precio.innerHTML="Precio D";precio.style.color="blue"}
	
		  
	  	  listado.style.display="block";
	  for(nfila=0;nfila<num;nfila++) {
        ids[nfila].innerHTML=productos[nfila].id;
		titles[nfila].innerHTML=productos[nfila].title;
		descriptions[nfila].innerHTML=productos[nfila].description;
		categories[nfila].innerHTML=productos[nfila].category;
		catcode=codigoCat(productos[nfila].category);
		tr=categories[nfila].parentElement;
		tr.setAttribute("class",catcode);
		prices[nfila].innerHTML="$"+productos[nfila].price;
		fotos[nfila].innerHTML="<img src='"+productos[nfila].image+"'>";
		fotos[nfila].firstChild.setAttribute("onclick","window.open('"+productos[nfila].image+"');" );
		}
		// Agregar datos "Guía #61b" y "RN22001" al listado
		document.querySelector(".container").insertAdjacentHTML('beforeend', `
			<p>Guía #61C</p>
			<p>RN22001</p>
			<p>ELEAZAR RIVAS</p>
		  `);
		for (nfila = 0; nfila < num; nfila++) {
			ids[nfila].innerHTML = productos[nfila].id;
			titles[nfila].innerHTML = productos[nfila].title;
			descriptions[nfila].innerHTML = productos[nfila].description;
			categories[nfila].innerHTML = productos[nfila].category;
			catcode = codigoCat(productos[nfila].category);
			tr = categories[nfila].parentElement;
			tr.setAttribute("class", catcode);
			prices[nfila].innerHTML = "$" + productos[nfila].price;
			fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
			fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");


	
			tr.setAttribute("id", `producto-${productos[nfila].id}`);
			tr.innerHTML += `<td><button onclick="eliminarProducto('${productos[nfila].id}')">Eliminar</button></td>`;


		}

	}

function obtenerProductos() {
	  fetch('https://api-generator.retool.com/WUdIen/productos')
            .then(res=>res.json())
            .then(data=>{
				productos=data;
				productos.forEach(
					function(producto){
						producto.price=parseFloat(producto.price)
					}
				);
				listarProductos(data)})
}

function ordenarDesc(p_array_json, p_key) {
   p_array_json.sort(function (a, b) {
      if(a[p_key] > b[p_key]) return -1;
if(a[p_key] < b[p_key]) return 1;
return 0;
   });
}

function ordenarAsc(p_array_json, p_key) {
   p_array_json.sort(function (a, b) {
      if(a[p_key] > b[p_key]) return 1;
if(a[p_key] < b[p_key]) return -1;
return 0;
   });
}


function agregarProducto() {
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;
    
    fetch('https://api-generator.retool.com/WUdIen/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: titulo,
            description: descripcion,
            price: precio,
            category: categoria,
            image: imagen
        })
    })
    .then(response => response.json())
    .then(() => {
        alert("Producto agregado exitosamente.");
        obtenerProductos(); // Refresca el listado de productos
    })
    .catch(error => {
        alert("Error al agregar el producto: " + error.message);
    });
}


function eliminarProducto(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        fetch(`https://api-generator.retool.com/WUdIen/productos/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
			console.log('Response:', response); // Ver el código de estado
			if (!response.ok) {
				throw new Error(`Error al eliminar: ${response.status} ${response.statusText}`);
			}
			alert('Producto eliminado exitosamente');
			
			// Refrescar la lista eliminando visualmente el producto
			productos = productos.filter(producto => producto.id !== parseInt(id));
			listarProductos(productos);
		})		
        .catch(error => {
            console.error('Error:', error);
            alert('No se pudo eliminar el producto');
        });
    }
}

