let compras = [];

function agregarProducto(supermercado, producto, precio, descuento) {
    let nuevoProducto = {
        supermercado: supermercado,
        producto: producto,
        precio: parseFloat(precio),
        descuento: parseFloat(descuento),
        precioFinal: calcularPrecioConDescuento(precio, descuento)
    };
    compras.push(nuevoProducto);
    actualizarListaProductos();
    actualizarTotales();
    actualizarTopProductos();
    actualizarGraficoAhorros();
}

function calcularPrecioConDescuento(precio, descuento) {
    return precio - (precio * (descuento / 100));
}

function actualizarListaProductos() {
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = '';

    compras.forEach((item, index) => {
        let li = document.createElement('li');
        li.innerHTML = `${item.producto} - Precio: $${item.precio.toFixed(2)} - Descuento: ${item.descuento}% <strong>Precio final: $${item.precioFinal.toFixed(2)}</strong>`;
        li.innerHTML += `<button class="boton-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>`;
        listaProductos.appendChild(li);
    });
}

function actualizarTotales() {
    const totalGasto = compras.reduce((total, item) => total + item.precioFinal, 0);
    const totalDescuento = compras.reduce((total, item) => total + (item.precio - item.precioFinal), 0);

    document.getElementById('totalGasto').textContent = `Total de Gastos: $${totalGasto.toFixed(2)}`;
    document.getElementById('totalDescuento').textContent = `Ahorro: $${totalDescuento.toFixed(2)}`;
}

function eliminarProducto(index) {
    compras.splice(index, 1);
    actualizarListaProductos();
    actualizarTotales();
    actualizarTopProductos();
    actualizarGraficoAhorros();
}

function actualizarTopProductos() {
    const listaTopProductos = document.getElementById('listaTopProductos');
    listaTopProductos.innerHTML = '';
    const topProductos = [...compras].sort((a, b) => b.descuento - a.descuento).slice(0, 5);

    topProductos.forEach((item) => {
        let li = document.createElement('li');
        li.textContent = `${item.producto} - ${item.descuento}% de descuento`;
        listaTopProductos.appendChild(li);
    });
}

//Libreria CHART.JS
let graficoAhorros;
function actualizarGraficoAhorros() {
    const totalGasto = compras.reduce((total, item) => total + item.precioFinal, 0);
    const totalDescuento = compras.reduce((total, item) => total + (item.precio - item.precioFinal), 0);

    const ctx = document.getElementById('graficoAhorros').getContext('2d');

    if (graficoAhorros) {
        graficoAhorros.destroy();
    }

    graficoAhorros = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gasto Total', 'Ahorro Total'],
            datasets: [{
                data: [totalGasto, totalDescuento],
                backgroundColor: ['#1c6182', '#3b7754']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

document.getElementById('productoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const supermercado = document.getElementById('supermercado').value;
    const producto = document.getElementById('producto').value;
    const precio = document.getElementById('precio').value;
    const descuento = document.getElementById('descuento').value;

    agregarProducto(supermercado, producto, precio, descuento);
    e.target.reset();
});

function descargarExcel() {
    let libro = XLSX.utils.book_new();
    let datos = [["Supermercado", "Producto", "Precio", "Descuento", "Precio Final"]];

    compras.forEach(item => {
        datos.push([item.supermercado, item.producto, item.precio, item.descuento, item.precioFinal]);
    });

    let hoja = XLSX.utils.aoa_to_sheet(datos);
    XLSX.utils.book_append_sheet(libro, hoja, "Historial de Compras");
    XLSX.writeFile(libro, "historial_compras.xlsx");
}

document.getElementById('descargarExcel').addEventListener('click', descargarExcel);

