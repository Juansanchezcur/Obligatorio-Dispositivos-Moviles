//GENERALES

//URLs

const URLBASEAPI = "https://calcount.develotion.com"
const URLIMAGENES = "https://calcount.develotion.com/imgs"

//Componentes
const MENU = document.querySelector("#menu")
const ROUTER = document.querySelector("#router")

//Pantallas
const HOME = document.querySelector("#pantallaHome")
const LOGIN = document.querySelector("#pantallaLogin")
const REGISTRARUSUARIO = document.querySelector("#pantallaRegistrarUsuario")
const REGISTRARCOMIDA = document.querySelector("#pantallaRegistrarComida")
const LISTADO = document.querySelector("#pantallaListadoAlimentos")
const INFORME = document.querySelector("#pantallaInforme")
const MAPA = document.querySelector("#pantallaMapa")

//Otras variables
let idUser
let apiKey
listaAlimentos = []
let listaPaises = []


//Funciones de navegación

function cerrarMenu() {
    MENU.close()
}

//Función de inicio y llamado a la misma

function inicio() {
    getMyPosition()
    previaCargarPaises()
    previaCargarAlimentos()
    chequearSesion()
    eventos()

}

inicio()


//Escucha de eventos de botones
function eventos() {
    ROUTER.addEventListener("ionRouteDidChange", navegar)
    document.querySelector("#btnLoguear").addEventListener("click", login)
    document.querySelector("#btnNavCerrarSesion").addEventListener("click", logout)
    document.querySelector("#btnNavRegistrarUsuario").addEventListener("click", previaCargarPaises)
    document.querySelector("#btnRegistroUsuario").addEventListener("click", registrarUsuario)
    document.querySelector("#btnNavRegistrarComida").addEventListener("click", previaCargarAlimentos)
    document.querySelector("#btnRegistrarComida").addEventListener("click", registrarAlimento)
    document.querySelector("#btnFiltrarListado").addEventListener("click", previaListado)
    document.querySelector("#btnNavListado").addEventListener("click", limpiarListado)
    document.querySelector("#btnNavInforme").addEventListener("click", llenarInformeCalorias)
    document.querySelector("#btnNavMapa").addEventListener("click", armarMapa)
    document.querySelector("#btnLlenarMapa").addEventListener("click", llenarMapa)

}

//Funcion navegar al escuchar evento del rounter
function navegar(evt) {
    ocultarPantallas()
    if (evt.detail.to == "/") HOME.style.display = "block"
    if (evt.detail.to == "/login") { if (localStorage.getItem("user") != null) { HOME.style.display = "block" } else { LOGIN.style.display = "block" } }
    if (evt.detail.to == "/registrarUsuario") { if (localStorage.getItem("user") != null) { HOME.style.display = "block" } else { REGISTRARUSUARIO.style.display = "block" } }
    if (evt.detail.to == "/registrarComida")  { if (localStorage.getItem("user") == null) { HOME.style.display = "block" } else { REGISTRARCOMIDA.style.display = "block" } }
    if (evt.detail.to == "/listadoAlimentos") { if (localStorage.getItem("user") ==null) { HOME.style.display = "block" } else { LISTADO.style.display = "block" } }
    if (evt.detail.to == "/informeCalorias") { if (localStorage.getItem("user") == null) { HOME.style.display = "block" } else { INFORME.style.display = "block" } }
    if (evt.detail.to == "/mapa"){ if (localStorage.getItem("user") == null) { HOME.style.display = "block" } else { MAPA.style.display = "block" } }
}
//Oculta todas las pantallas
function ocultarPantallas() {
    HOME.style.display = "none"
    LOGIN.style.display = "none"
    REGISTRARUSUARIO.style.display = "none"
    REGISTRARCOMIDA.style.display = "none"
    LISTADO.style.display = "none"
    INFORME.style.display = "none"
    MAPA.style.display = "none"
}

//Oculta todos los botones
function ocultarBotones() {
    document.querySelector("#btnNavHome").style.display = "none"
    document.querySelector("#btnNavLogin").style.display = "none"
    document.querySelector("#btnNavRegistrarUsuario").style.display = "none"
    document.querySelector("#btnNavRegistrarComida").style.display = "none"
    document.querySelector("#btnNavListado").style.display = "none"
    document.querySelector("#btnNavInforme").style.display = "none"
    document.querySelector("#btnNavMapa").style.display = "none"
    document.querySelector("#btnNavCerrarSesion").style.display = "none"
}

//Chequea que no haya una sesión abierta, mirando el local storage
function chequearSesion() {
    if (localStorage.getItem("user") != null) {
        mostrarMenuConLogin()
    } else {
        mostrarMenuSinLogin()
    }

}


//Muestra los botones del menú que puede ver el usuario que logueó correctamente
function mostrarMenuConLogin() {
    ocultarBotones()
    document.querySelector("#btnNavHome").style.display = "block"
    document.querySelector("#btnNavRegistrarComida").style.display = "block"
    document.querySelector("#btnNavListado").style.display = "block"
    document.querySelector("#btnNavInforme").style.display = "block"
    document.querySelector("#btnNavMapa").style.display = "block"
    document.querySelector("#btnNavCerrarSesion").style.display = "block"
}

//Muestra los botones del menú que puede ver el usuario que no ha logueado
function mostrarMenuSinLogin() {
    ocultarBotones()
    document.querySelector("#btnNavLogin").style.display = "block"
    document.querySelector("#btnNavRegistrarUsuario").style.display = "block"

}

//LOGIN
function login() {
    let usuario = document.querySelector("#txtLoginUsuario").value
    let contrasena = document.querySelector("#txtLoginContrasena").value


    let nuevoUsuario = {}
    nuevoUsuario.usuario = usuario
    nuevoUsuario.password = contrasena
    hacerLogin(nuevoUsuario)
}

//Loguea en la API
function hacerLogin(usuario) {

    fetch(`${URLBASEAPI}/login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            if (data.mensaje == undefined) {
                localStorage.setItem("user", data.id)
                idUser = data.id
                localStorage.setItem("apiKey", data.apiKey)
                apiKey = data.apiKey

                localStorage.setItem("caloriasDiarias", data.caloriasDiarias)
                mostrarMensaje("SUCCESS", "Login exitoso", "")
                ocultarPantallas()
                HOME.style.display = "block"
                mostrarMenuConLogin()
            }
            else {
                mostrarMensaje("ERROR", "Error", data.mensaje)


            }
            document.querySelector("#txtLoginUsuario").value = ""
            document.querySelector("#txtLoginContrasena").value = ""
        })
        .catch(function (error) {
            console.log(error)
        })

}

//LOGOUT
function logout() {
    localStorage.removeItem("user")
    localStorage.removeItem("apiKey")
    localStorage.removeItem("caloriasDiarias")
    ocultarPantallas()
    LOGIN.style.display = "block"
    mostrarMenuSinLogin()
}

//CARGAR PAISES AL SELECT
function previaCargarPaises() {
    fetch(`${URLBASEAPI}/paises.php`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            cargarPaises(data)
        })
        .catch(function (error) {
            console.log(error)
        })
}

function cargarPaises(data) {
    listaPaises = data.paises
    let opcionesSelect = ""

    for (let pais of listaPaises) {
        opcionesSelect += `<ion-select-option value=${pais.id}>${pais.name}</ion-select-option>`
    }
    document.querySelector("#slcPaises").innerHTML = opcionesSelect

}


//REGISTRAR USUARIO
function registrarUsuario() {

    let usuario = document.querySelector("#txtRegistroUsuario").value
    let password = document.querySelector("#txtRegistroContrasena").value
    let pais = document.querySelector("#slcPaises").value
    let caloriasDiarias = document.querySelector("#txtRegistroCaloriasDiarias").value

    if (usuario == null || usuario == "") {
        mostrarMensaje("ERROR", "Error", "El nombre de usuario no puede ser un dato vacío")
    } else
        if (password == null || password == "") {
            mostrarMensaje("ERROR", "Error", "La contraseña no puede ser un dato vacío")
        } else
            if (pais == undefined) {
                mostrarMensaje("ERROR", "Error", "El país no puede ser un dato vacío")
            } else
                if (caloriasDiarias <= 0 || isNaN(caloriasDiarias)) {
                    mostrarMensaje("ERROR", "Error", "Las calorías diarias deben ser un entero positivo")
                } else {
                    let nuevoUsuario = {}
                    nuevoUsuario.usuario = usuario
                    nuevoUsuario.password = password
                    nuevoUsuario.idPais = pais
                    nuevoUsuario.caloriasDiarias = caloriasDiarias
                    registrarUsuarioAPI(nuevoUsuario)
                }
}

//Registra usuario usando la API
function registrarUsuarioAPI(nuevoUsuario) {
    fetch(`${URLBASEAPI}/usuarios.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            if (data.mensaje == undefined) {
                localStorage.setItem("user", data.id)
                localStorage.setItem("apiKey", data.apiKey)
                localStorage.setItem("caloriasDiarias", data.caloriasDiarias)

                idUser = data.id
                apiKey = data.apiKey

                mostrarMensaje("SUCCESS", "Cuenta creada exitosamente", "")
                ocultarPantallas()
                HOME.style.display = "block"
                mostrarMenuConLogin()
            }
            else {
                mostrarMensaje("ERROR", "Error", data.mensaje)
            }
            document.querySelector("#txtRegistroUsuario").value = ""
            document.querySelector("#txtRegistroContrasena").value = ""
            document.querySelector("#slcPaises").value = ""
            document.querySelector("#txtRegistroCaloriasDiarias").value = ""
        })
        .catch(function (error) {
            console.log(error)
        })




}


//REGISTRAR ALIMENTOS

//Busca los alimentos en la API
function previaCargarAlimentos() {
    idUser = localStorage.getItem('user')
    apiKey = localStorage.getItem('apiKey')
    fetch(`${URLBASEAPI}/alimentos.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'iduser': idUser
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (respuesta) {
            cargarAlimentos(respuesta)
        })
        .catch(function (error) {
            console.log(error)
        })



}

//Carga los alimentos al select de la pantalla de cargar un alimento
function cargarAlimentos(data) {
    listaAlimentos = data.alimentos
    let opciones = ""

    for (let alimento of listaAlimentos) {
        opciones += `<ion-select-option value=${alimento.id}>${alimento.nombre}</ion-select-option>`
    }
    document.querySelector("#slcRegistroAlimentoAlimento").innerHTML = opciones
}


function registrarAlimento() {
    let alimento = Number(document.querySelector("#slcRegistroAlimentoAlimento").value)
    let cantidad = Number(document.querySelector("#txtRegistroAlimentoCantidad").value)
    let fecha = document.querySelector("#txtRegistroAlimentoFecha").value

    if (isNaN(alimento) || alimento == 0) {
        mostrarMensaje("ERROR", "Error", "Por favor seleccione un alimento")
    } else
        if (isNaN(cantidad) || cantidad <= 0) {
            mostrarMensaje("ERROR", "Error", "Ingrese una cantidad mayor a 0")
        }
        else
            if (fecha == "" || fecha == undefined || fecha == null) {
                mostrarMensaje("ERROR", "Error", "Por favor ingrese una fecha")
            }
            else {
                let nuevoAlimento = {
                }
                nuevoAlimento.idAlimento = alimento
                nuevoAlimento.cantidad = cantidad
                nuevoAlimento.fecha = fecha
                nuevoAlimento.idUsuario = Number(localStorage.getItem('user'))

                registrarAlimentoAPI(nuevoAlimento)
            }
}

//Registra un alimento en la API
function registrarAlimentoAPI(nuevoAlimento) {
    idUser = localStorage.getItem('user')
    apiKey = localStorage.getItem('apiKey')

    fetch(`${URLBASEAPI}/registros.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'iduser': idUser
        },
        body: JSON.stringify(nuevoAlimento)
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (respuesta) {
            mostrarMensaje("SUCCESS", "", respuesta.mensaje)
            document.querySelector("#slcRegistroAlimentoAlimento").value = ""
            document.querySelector("#txtRegistroAlimentoCantidad").value = ""
            document.querySelector("#txtRegistroAlimentoFecha").value = ""
        })
        .catch(function (error) {
            console.log(error)
        })

}

//LISTADO DE ALIMENTOS 
//Limpia la pantalla del listado antes de ingresar

function limpiarListado() {
    document.querySelector("#txtListadoFecha1").value = ""
    document.querySelector("#txtListadoFecha2").value = ""
    document.querySelector("#listado").innerHTML = ""
}

function previaListado() {
    let fecha1 = document.querySelector("#txtListadoFecha1").value
    let fecha2 = document.querySelector("#txtListadoFecha2").value

    if (fecha1 > fecha2) {
        let aux = fecha1
        fecha1 = fecha2
        fecha2 = aux
    }

    traerRegistrosListado(fecha1, fecha2)

}

//Trae los registros de la API
function traerRegistrosListado(fecha1, fecha2) {
    idUser = localStorage.getItem('user')
    apiKey = localStorage.getItem('apiKey')


    fetch(`${URLBASEAPI}/registros.php?idUsuario=${idUser}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'iduser': idUser
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (respuesta) {
            armarListadoAlimentos(fecha1, fecha2, respuesta)

        })
        .catch(function (error) {
            console.log(error)
        })

}
//Filtra los registros que trae la api entre dos fechas
function armarListadoAlimentos(fecha1, fecha2, listado) {
    let listadoFiltrado = []
    if ((fecha1 == "" || fecha1 == undefined || fecha1 == null) && ((fecha2 == "" || fecha2 == undefined || fecha2 == null))) {
        listadoFiltrado = listado.registros
    } else {
        for (let registro of listado.registros) {
            if (registro.fecha >= fecha1 && registro.fecha <= fecha2) {

                listadoFiltrado.push(registro)
            }
        }
    }
    armarListadoFiltrado(listadoFiltrado)
}

//Genera el listado
function armarListadoFiltrado(listado) {

    const LIST = document.querySelector("#listado")

    let alimentos = ""

    if (listado.length > 0) {
        for (let alimento of listado) {
            let alimentoRecuperado = recuperarAlimento(alimento.idAlimento)
            if (alimentoRecuperado != null) {
                alimentos += ` <ion-item>
        <ion-label>
        <img src="https://calcount.develotion.com/imgs/${alimento.idAlimento}.png" width="20vw"/>
       <h2> Nombre: ${alimentoRecuperado.nombre}</h2> 
        <p>Fecha: ${alimento.fecha}</p>
        <p>Calorías por porción: ${alimentoRecuperado.calorias}</p>
        <p>Cantidad: ${alimento.cantidad}</p>
        <p>Calorías totales: ${alimento.cantidad * alimentoRecuperado.calorias}</p>
        <ion-button  onclick="eliminarRegistro(${alimento.id})">Eliminar</ion-button>
        </ion-label>
      </ion-item>`
            }
        }
        LIST.innerHTML = alimentos
    }
    else {
        LIST.innerHTML = `<ion-item>
    <ion-label>
    Todavía no hay registros
    </ion-label>
    </ion-item>`
    }
}
//Recupera un alimento
function recuperarAlimento(id) {
    for (let alimento of listaAlimentos) {
        if (alimento.id == id) {
            return alimento
        }
    }
    return null
}

//Elimina un registro en la API
function eliminarRegistro(id) {
    fetch(`${URLBASEAPI}/registros.php?idRegistro=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'iduser': idUser
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (respuesta) {
            mostrarMensaje("SUCCESS", "", respuesta.mensaje)
            previaListado()
        })
        .catch(function (error) {
            console.log(error)
        })

}

//REPORTE DE CALORÍAS
//Busca la información para el reporte de calorías en la API
function llenarInformeCalorias() {

    idUser = localStorage.getItem('user')
    apiKey = localStorage.getItem('apiKey')
    caloriasDiariasRegistro = localStorage.getItem('caloriasDiarias')

    fetch(`${URLBASEAPI}/registros.php?idUsuario=${idUser}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'iduser': idUser
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (respuesta) {
            llenarInforme(respuesta.registros)

        })
        .catch(function (error) {
            console.log(error)
        })

}

//Llena el informe
function llenarInforme(listado) {
    let cantidadDiaria = 0
    let cantidadTotal = 0
    fechaActual = obtenerfechaActual()

    if (listado.length > 0) {
        for (let registro of listado) {
            let alimentoRecuperado = recuperarAlimento(registro.idAlimento)
            cantidadTotal += Number(alimentoRecuperado.calorias) * Number(registro.cantidad)
            if (registro.fecha == fechaActual) {
                cantidadDiaria += Number(alimentoRecuperado.calorias) * Number(registro.cantidad)
            }
        }
    }
    const PCANTIDADTOTAL = document.querySelector("#caloriasTotales")
    const PCANTIDADDIARIA = document.querySelector("#caloriasDiarias")

    PCANTIDADTOTAL.innerHTML = `Cantidad de calorías consumidas total: ${cantidadTotal}`
    PCANTIDADDIARIA.innerHTML = `Cantidad de calorías consumidas hoy: ${cantidadDiaria}`

    pintarCaloriasDiarias(caloriasDiariasRegistro, cantidadDiaria)

}

//Pinta el informe según las calorías diarias consumidas
function pintarCaloriasDiarias(caloriasDiariasRegistro, cantidadDiaria) {
    const P = document.querySelector("#caloriasDiarias")
    if (cantidadDiaria > caloriasDiariasRegistro) {
        P.style.color = "red"
    } else if ((cantidadDiaria >= caloriasDiariasRegistro * 0.9)) {
        P.style.color = "#CDC93C"
    } else {
        P.style.color = "green"

    }
}


//MAPA

let miLatitud
let miLongitud
let map = null
let markers=[]

//Trae mi posición
function getMyPosition() {
    navigator.geolocation.getCurrentPosition(miUbicacion)
}

function miUbicacion(position) {
    miLatitud = position.coords.latitude
    miLongitud = position.coords.longitude
}

//Arma el mapa
function armarMapa() {
    limpiarMarkers()
    if (!map) {
        map = L.map('map').setView([miLatitud, miLongitud], 10);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
            .addTo(map)
        markerUsuario = L.marker([miLatitud, miLongitud], { icon: posicionUsuarioIcon }).addTo(map)
      
    }
    document.querySelector("#txtMapaCantidad").value=""
}

let posicionUsuarioIcon = L.icon({
    iconUrl: "img/yo.png",
    iconSize: [25, 25]
})


let posicionPaisIcon = L.icon({
    iconUrl: "img/ellos.png",
    iconSize: [25, 25]
})

function llenarMapa() {
    fetch(URLBASEAPI + '/usuariosPorPais.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'iduser': idUser
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (respuesta) {
            if (respuesta.codigo == 200) {
                marcarPaises(respuesta.paises)
            }

        })
        .catch(function (error) {
            console.log(error)
        })
}

//Marca paises en el mapa que cumplan con las condiciones
function marcarPaises(paises) {
    limpiarMarkers()
    let encontrados=0
    let cantidad = Number(document.querySelector("#txtMapaCantidad").value)
    if(isNaN(cantidad)||cantidad<1){
        mostrarMensaje("ERROR", "", "Ingrese una cantidad mayor a 0")
    }else{
    for (let pais of paises) {
        let paisRecuperado = recuperarPais(pais)
        if (paisRecuperado != null) {
            if (pais.cantidadDeUsuarios > cantidad) {
             let   markerPais = L.marker([paisRecuperado.latitude, paisRecuperado.longitude], { icon: posicionPaisIcon }).addTo(map)
             markers.push(markerPais)
            encontrados++
            }
        }
    }
    if (encontrados>0){
        mostrarMensaje("SUCCESS", "", `Mostrando Resultados... se encontraron ${encontrados} países`)
    }else{
        mostrarMensaje("WARNING", "", `No se encontraron países que cumplan con la cantidad seleccionada`)
    }
    document.querySelector("#txtMapaCantidad").value=""
}
}

//Recupera un pais de la lista de paises
function recuperarPais(pais) {
    for (let paisLista of listaPaises)
        if (paisLista.id == pais.id) {
            return paisLista
        }
    return null
}
//Limpia los marcadores de los países 
function limpiarMarkers(){
    if(markers.length>0){
        for(let markerPais of markers){
            map.removeLayer(markerPais)
        }
    }
}

//OTROS

//Mensajes Toast
function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    toast.position = "bottom"
    if (!duracion) {
        duracion = 3000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
        toast.color = 'danger';
        toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
        toast.color = 'warning';
        toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
        toast.color = 'success';
        toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}


//Establece fecha máxima de todos los inputs de fecha, a la fecha de hoy
let inputsFecha = document.querySelectorAll('ion-input[type="date"]');
var fechaActual = obtenerfechaActual()
inputsFecha.forEach(function (input) {
    input.setAttribute('max', fechaActual);
});


//Devuelve la fecha actual
function obtenerfechaActual() {
    let fechaActual = new Date();
    fechaActual.setHours(fechaActual.getHours() - 3);
    fechaActual = fechaActual.toISOString().split('T')[0];
    return fechaActual
}
