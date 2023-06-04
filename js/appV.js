const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
   formulario.addEventListener('submit', validarFormulario)
}

//funciones
function validarFormulario(e){
    e.preventDefault();
    const terminoBusqueda = document.querySelector('#termino').value;
    if(terminoBusqueda == ''){
        mostrarAlerta('Agregue un término de búsqueda');
        return;
    }  
    buscarImagenes();
}
function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('bg-red-100');

    if (!existeAlerta){
    const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100','border-red-400','text-red-700',
    'px-4','py-3','rounded','max-w-lg','mx-auto','mt-6', 'text-center');
    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">${mensaje}</span>
    `;
    formulario.appendChild(alerta);
    setTimeout(()=>{
        alerta.remove();
      },2000);
    }

}
async function buscarImagenes() {
   try {
     const termino = document.querySelector('#termino').value;
     const key = '36392038-3f8e964e17d50614335d6c117';
     const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
   
     const respuesta = await fetch(url);
     const resultado = await respuesta.json();
 
     totalPaginas = calcularPaginas(resultado.totalHits);
     mostrarImagenes(resultado.hits);
   } catch (error) {
     console.log('Error al buscar imágenes:', error);
   }
 }
 function mostrarImagenes(imagenes){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    } 
   //iteración sobre el arreglo de imagenes de la consulta
   //y construyo el HTML respectivo para esas imagenes
   imagenes.forEach(imagen => {
      const {previewURL, likes, views, largeImageURL} = imagen;
      resultado.innerHTML += 
      `
       <div class="w-1/2 md:w-1/3 lg:1/4 p-3 mb-4">
        <div class="bg-white">
            <img class="w-full h-48 max-h-full" src="${previewURL}">
            <div class="p-4>
                <p class="font-bold">${likes} 
                   <span class="font-light"> Me gusta
                   </span>
                </p>
                <p class="font-bold">${views} 
                  <span class="font-light"> veces vista
                  </span>
                </p>
                <a  class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase
                          font-bold text-center rounded mt-5 p-1"
                   href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                    Ver imagen
                </a> 
            </div>  
        </div>

       </div>
      `
   })
   //removes todos los elementos del paginador 
   while(paginacionDiv.firstChild){
    paginacionDiv.removeChild(paginacionDiv.firstChild);
   }
    //generamos el nuevo HTML para el paginador
    imprimirPaginador();

 }
 function *crearPaginador(total){
    for (let i = 1; i <= total; i++){
       yield i;
    }

 }
 function calcularPaginas(total){
    return parseInt(Math.ceil(total/registrosPorPagina));
 }

function imprimirPaginador(){
   iterador = crearPaginador(totalPaginas);
   while(true){
     const {value, done} = iterador.next();
     if(done){return }
     const boton = document.createElement('a');
     boton.href = '#';
     boton.dataset.id = value;
     boton.textContent = value;
     boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2',
                         'font-bold','mb-2','rounded');
     boton.onclick = ()=>{
        paginaActual = value; 
        buscarImagenes();
        
     }
     paginacionDiv.appendChild(boton);
   }
}