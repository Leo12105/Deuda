// Cargar datos guardados o inicializar
let deudaTotal = parseFloat(localStorage.getItem('deudaTotal')) || 0;
let pagos = JSON.parse(localStorage.getItem('pagos')) || [];

// Poner la fecha de hoy por defecto
document.getElementById('inputFecha').valueAsDate = new Date();

// Establecer la deuda total
function establecerDeuda() {
    const input = document.getElementById('inputDeuda');
    const monto = parseFloat(input.value);

    if (!monto || monto <= 0) {
        alert('Por favor ingresa un monto válido');
        return;
    }

    deudaTotal = monto;
    localStorage.setItem('deudaTotal', deudaTotal);
    input.value = '';
    actualizarVista();
}

// Registrar un pago
function registrarPago() {
    const inputPago = document.getElementById('inputPago');
    const inputFecha = document.getElementById('inputFecha');
    const inputNota = document.getElementById('inputNota');

    const monto = parseFloat(inputPago.value);
    const fecha = inputFecha.value;
    const nota = inputNota.value || 'Sin nota';

    if (!monto || monto <= 0) {
        alert('Por favor ingresa un monto válido');
        return;
    }

    if (!fecha) {
        alert('Por favor selecciona una fecha');
        return;
    }

    const pago = {
        id: Date.now(),
        monto: monto,
        fecha: fecha,
        nota: nota
    };

    pagos.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagos));

    // Limpiar campos
    inputPago.value = '';
    inputNota.value = '';
    inputFecha.valueAsDate = new Date();

    actualizarVista();
}

// Eliminar un pago
function eliminarPago(id) {
    if (confirm('¿Seguro que quieres eliminar este pago?')) {
        pagos = pagos.filter(p => p.id !== id);
        localStorage.setItem('pagos', JSON.stringify(pagos));
        actualizarVista();
    }
}

// Borrar todo
function borrarTodo() {
    if (confirm('⚠️ ¿Seguro que quieres borrar TODOS los datos?')) {
        deudaTotal = 0;
        pagos = [];
        localStorage.clear();
        actualizarVista();
    }
}

// Actualizar toda la vista
function actualizarVista() {
    const totalPagado = pagos.reduce((sum, p) => sum + p.monto, 0);
    const restante = Math.max(deudaTotal - totalPagado, 0);
    const porcentaje = deudaTotal > 0 ? Math.min((totalPagado / deudaTotal) * 100, 100) : 0;

    // Actualizar tarjetas
    document.getElementById('deudaTotal').textContent = formatearDinero(deudaTotal);
    document.getElementById('totalPagado').textContent = formatearDinero(totalPagado);
    document.getElementById('restante').textContent = formatearDinero(restante);

    // Actualizar barra de progreso
    const barra = document.getElementById('barraProgreso');
    barra.style.width = porcentaje + '%';
    document.getElementById('porcentaje').textContent = porcentaje.toFixed(1) + '%';

    // Actualizar tabla
    const cuerpo = document.getElementById('cuerpoTabla');
    const sinPagos = document.getElementById('sinPagos');

    if (pagos.length === 0) {
        cuerpo.innerHTML = '';
        sinPagos.style.display = 'block';
    } else {
        sinPagos.style.display = 'none';

        // Ordenar por fecha (más reciente primero)
        const pagosOrdenados = [...pagos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        cuerpo.innerHTML = pagosOrdenados.map((pago, index) => `
            <tr>
                <td>${pagosOrdenados.length - index}</td>
                <td>${formatearFecha(pago.fecha)}</td>
                <td>${formatearDinero(pago.monto)}</td>
                <td>${pago.nota}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarPago(${pago.id})">
                        ❌
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Formatear dinero
function formatearDinero(cantidad) {
    return '$' + cantidad.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Formatear fecha
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
}

// Cargar vista inicial
actualizarVista();
