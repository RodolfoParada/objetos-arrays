console.log("=== SISTEMA DE GESTIÓN DE BIBLIOTECA ===\n");

// Base de datos de libros
const libros = [
  { id: 1, titulo: "JavaScript: The Good Parts", autor: "Douglas Crockford", genero: "Programación", disponible: true },
  { id: 2, titulo: "Clean Code", autor: "Robert C. Martin", genero: "Programación", disponible: false },
  { id: 3, titulo: "The Pragmatic Programmer", autor: "Andrew Hunt", genero: "Programación", disponible: true },
  { id: 4, titulo: "1984", autor: "George Orwell", genero: "Ficción", disponible: true },
  { id: 5, titulo: "To Kill a Mockingbird", autor: "Harper Lee", genero: "Ficción", disponible: false }
];

const usuarios = [
  { id: 101, nombre: "Alicia Torres", historialPrestamos: [] },
  { id: 102, nombre: "Beto Ruiz", historialPrestamos: [] },
  { id: 103, nombre: "Carla Soto", historialPrestamos: [] },
];

const DIAS_PRESTAMO_MAXIMO = 7; // Días permitidos antes de incurrir en multa
const TASA_MULTA_DIARIA = 0.50; // Tasa de multa por día de retraso

function calcularMulta(prestamo) {
    const fechaPrestamo = new Date(prestamo.fechaPrestamo);
    // Usa la fecha de devolución si existe, si no, usa la fecha actual (hoy) para calcular multas pendientes.
    const fechaFin = prestamo.fechaDevolucion 
        ? new Date(prestamo.fechaDevolucion) 
        : new Date();

    // 1. Diferencia en milisegundos ⏱️
    const diferenciaMs = fechaFin.getTime() - fechaPrestamo.getTime();

    // 2. Conversión a días (1 día = 86,400,000 ms)
    // Usamos Math.floor() para solo contar los días completos transcurridos.
    const diasTranscurridos = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    // 3. Cálculo de días de retraso
    const diasRetraso = diasTranscurridos - DIAS_PRESTAMO_MAXIMO;

    if (diasRetraso <= 0) {
        return 0; // No hay multa
    }

    // 4. Cálculo de la multa y redondeo a dos decimales
    const multa = diasRetraso * TASA_MULTA_DIARIA;
    return parseFloat(multa.toFixed(2));
}
// Sistema de gestión
const biblioteca = {
  // Obtener libros disponibles
  obtenerDisponibles() {
    return libros.filter(libro => libro.disponible);
  },

  // Buscar libros por título o autor
  buscar(criterio) {
    const termino = criterio.toLowerCase();
    return libros.filter(libro =>
      libro.titulo.toLowerCase().includes(termino) ||
      libro.autor.toLowerCase().includes(termino)
    );
  },

  
  // Prestar libro
  prestar(idLibro, idUsuario) {
    // 1. Encontrar el libro y el usuario
    const libro = libros.find(l => l.id === idLibro);
    const usuario = usuarios.find(u => u.id === idUsuario);

    // 2. Validaciones ❌
    if (!libro) return { exito: false, mensaje: "❌ Libro no encontrado." };
    if (!usuario) return { exito: false, mensaje: "❌ Usuario no encontrado." };
    if (!libro.disponible) return { exito: false, mensaje: `❌ Libro "${libro.titulo}" ya está prestado.` };

    // 3. Registrar el préstamo ✅
    
    // a) Actualizar el estado del libro (Mutación)
    libro.disponible = false; 
    
    // b) Registrar en el historial del usuario (Mutación)
    usuario.historialPrestamos.push({
        idLibro: libro.id,
        titulo: libro.titulo,
        fechaPrestamo: new Date().toISOString(), // Fecha actual del préstamo
        fechaDevolucion: null // Indicador de que el préstamo está activo
    });

    return { exito: true, mensaje: `✅ Libro "${libro.titulo}" prestado exitosamente a ${usuario.nombre}.` };
},

  // Devolver libro
  devolver(id) {
    const libro = libros.find(l => l.id === id);
    if (!libro) return { exito: false, mensaje: "Libro no encontrado" };
    if (libro.disponible) return { exito: false, mensaje: "Este libro ya está disponible" };

   // 1. Buscar el usuario que tiene el préstamo activo
    const usuarioConPrestamo = usuarios.find(u => 
        u.historialPrestamos.some(p => p.idLibro === id && p.fechaDevolucion === null)
    );

    if (!usuarioConPrestamo) {
        return { exito: false, mensaje: "❌ Error: Libro prestado, pero no se encontró un usuario con un préstamo activo." };
    }

    // 2. Registrar la devolución y calcular multa
    libro.disponible = true; 

    const prestamoActivo = usuarioConPrestamo.historialPrestamos.find(p => 
        p.idLibro === id && p.fechaDevolucion === null
    );
    
    if (prestamoActivo) {
        prestamoActivo.fechaDevolucion = new Date().toISOString();
        prestamoActivo.multaAplicada = calcularMulta(prestamoActivo); // ¡Cálculo de multa!
    } 

    const multaMensaje = prestamoActivo.multaAplicada > 0 
        ? `Se ha aplicado una multa de $${prestamoActivo.multaAplicada.toFixed(2)}.` 
        : "Devolución a tiempo, sin multa.";

    return { exito: true, mensaje: `✅ Libro "${libro.titulo}" devuelto exitosamente por ${usuarioConPrestamo.nombre}. ${multaMensaje}` };

    
  },

busquedaAvanzada({ titulo, autor, genero, disponible }){
    // Convierte todos los criterios presentes a minúsculas
    const t = titulo ? titulo.toLowerCase() : null;
    const a = autor ? autor.toLowerCase() : null;
    const g = genero ? genero.toLowerCase() : null;
    // El criterio 'disponible' es un booleano (true/false) o undefined, se usa directamente

    return libros.filter(libro => {
        // Destructuring en el objeto libro
        const { titulo: libroTitulo, autor: libroAutor, genero: libroGenero, disponible: libroDisponible } = libro;

        const coincideTitulo = !t || libroTitulo.toLowerCase().includes(t);
        const coincideAutor = !a || libroAutor.toLowerCase().includes(a);
        
        // ¡ERROR CORREGIDO AQUÍ! toLowerCase() no lleva argumentos.
        const coincideGenero = !g || libroGenero.toLowerCase() === g; 
        
        // Nuevo: Criterio de disponibilidad (solo se aplica si el valor es true o false)
        const coincideDisponible = (typeof disponible !== 'boolean') || (libroDisponible === disponible);
        
        return coincideTitulo && coincideAutor && coincideGenero && coincideDisponible;
    }) 
},

obtenerHistorialUsuario({ idUsuario }) {
    const usuario = usuarios.find(u => u.id === idUsuario);

    if (!usuario) {
      return { exito: false, mensaje: `❌ Usuario con ID ${idUsuario} no encontrado.` };
    }

    // Usar destructuring para obtener las propiedades clave
    const { nombre, historialPrestamos } = usuario;

    // Calcular las multas pendientes en tiempo real para los préstamos activos
    const historialConMultas = historialPrestamos.map(prestamo => {
      // Usamos el operador spread (...) para copiar las propiedades existentes
      return {
        ...prestamo, 
        multaPendiente: prestamo.fechaDevolucion === null ? calcularMulta(prestamo) : 0,
        estado: prestamo.fechaDevolucion === null ? 'ACTIVO' : 'DEVUELTO'
      };
    });

    return { exito: true, nombre, historial: historialConMultas };
  },

  obtenerRankingPopularidad() {
    // PASO 1: Conteo de Préstamos
    const conteoPrestamos = {}; 

    usuarios.forEach(usuario => {
        usuario.historialPrestamos.forEach(prestamo => {
            const idLibro = prestamo.idLibro;
            // Incrementa el contador (o lo inicializa en 1 si es el primero)
            conteoPrestamos[idLibro] = (conteoPrestamos[idLibro] || 0) + 1;
        });
    });

    // PASO 2: Mapear y Clasificar los libros
    return libros
      // 2a. Usamos map() para añadir la popularidad a cada libro
      .map(libro => ({
        ...libro, // Operador spread: copia todas las propiedades del libro
        popularidad: conteoPrestamos[libro.id] || 0 // Si no se prestó, la popularidad es 0
      }))
      // 2b. Usamos sort() para ordenar de forma descendente (el más popular primero)
      .sort((a, b) => b.popularidad - a.popularidad);
  },

  // Estadísticas
  obtenerEstadisticas() {
    const total = libros.length;
    const disponibles = libros.filter(l => l.disponible).length;
    const prestados = total - disponibles;

    // Agrupar por género usando reduce
    const porGenero = libros.reduce((acc, libro) => {
      acc[libro.genero] = (acc[libro.genero] || 0) + 1;
      return acc;
    }, {});

    return { total, disponibles, prestados, porGenero };
  }


  
};




// Demostraciones prácticas
console.log("📚 LIBROS DISPONIBLES:");
biblioteca.obtenerDisponibles().forEach(({ titulo, autor }) => {
  console.log(`- "${titulo}" por ${autor}`);
});

console.log("\n🔍 BÚSQUEDA 'JavaScript':");
biblioteca.buscar("JavaScript").forEach(({ titulo, autor }) => {
  console.log(`- "${titulo}" por ${autor}`);
});

console.log("\n📊 ESTADÍSTICAS:");
const stats = biblioteca.obtenerEstadisticas();
console.log(`Total de libros: ${stats.total}`);
console.log(`Disponibles: ${stats.disponibles}`);
console.log(`Prestados: ${stats.prestados}`);
console.log("Por género:", stats.porGenero);

console.log("\n📖 OPERACIONES DE PRÉSTAMO:");
console.log(biblioteca.prestar(1).mensaje);
console.log(biblioteca.prestar(1).mensaje); // Intento fallido
console.log(biblioteca.devolver(1).mensaje);

console.log("\n=== DEMOSTRACIÓN DE DESTRUCTURING ===\n");

// Función que usa destructuring extensivamente
function procesarPrestamo({ id, titulo, autor, disponible }) {
  if (!disponible) {
    return `❌ "${titulo}" no está disponible`;
  }

  const resultado = biblioteca.prestar(id);
  return resultado.exito ? `✅ ${resultado.mensaje}` : `❌ ${resultado.mensaje}`;
}

// Procesar múltiples libros con destructuring
const librosParaProcesar = [
  { id: 1, titulo: "JavaScript: The Good Parts", autor: "Douglas Crockford", disponible: true },
  { id: 4, titulo: "1984", autor: "George Orwell", disponible: true }
];

librosParaProcesar.forEach(libro => {
  console.log(procesarPrestamo(libro));
});

// Destructuring en bucles
console.log("\n📋 LISTADO DE LIBROS CON DESTRUCTURING:");
for (const { titulo, autor, genero, disponible } of libros) {
  const estado = disponible ? "✅ Disponible" : "❌ Prestado";
  console.log(`${titulo} - ${autor} (${genero}) ${estado}`);
}

// Estadísticas avanzadas usando métodos modernos
console.log("\n🎯 ANÁLISIS AVANZADO:");
const librosPorGenero = libros.reduce((acc, { genero, disponible }) => {
  if (!acc[genero]) acc[genero] = { total: 0, disponibles: 0 };
  acc[genero].total++;
  if (disponible) acc[genero].disponibles++;
  return acc;
}, {});

Object.entries(librosPorGenero).forEach(([genero, stats]) => {
  console.log(`${genero}: ${stats.disponibles}/${stats.total} disponibles`);
});


/*
Ejercicio: 
Usa destructuring, métodos modernos de arrays y objetos para implementar estas características.
Extiende el sistema de biblioteca agregando funcionalidades como: 
1.búsqueda avanzada por múltiples criterios, 
2.sistema de usuarios con historial de préstamos, 
3.cálculo de multas por retrasos, y 
4.reportes de popularidad de libros. 
*/

// 1.búsqueda avanzada por múltiples criterios.



// 1. Buscar por GÉNERO (Ficción)
console.log("🔍 BÚSQUEDA (Solo Género: Ficción):");
const res1 = biblioteca.busquedaAvanzada({ genero: "Ficción" });
res1.forEach(({ titulo, autor }) => {
  console.log(`- "${titulo}" por ${autor}`);
});

// 2. Buscar por TÍTULO y GÉNERO (Programación y que contenga 'The')
console.log("\n🔍 BÚSQUEDA (Título: 'The', Género: Programación):");
const res2 = biblioteca.busquedaAvanzada({ titulo: "The", genero: "Programación" });
res2.forEach(({ titulo, autor }) => {
  console.log(`- "${titulo}" por ${autor}`);
});

// 3. Buscar por AUTOR y GÉNERO (Autor: 'Martin' y Género: Programación)
console.log("\n🔍 BÚSQUEDA (Autor: 'Martin', Género: Programación):");
const res3 = biblioteca.busquedaAvanzada({ autor: "Martin", genero: "Programación" });
res3.forEach(({ titulo, autor }) => {
  console.log(`- "${titulo}" por ${autor}`);
});

// 4. Búsqueda sin criterios (debe devolver todos los libros)
console.log("\n🔍 BÚSQUEDA (Sin criterios):");
const res4 = biblioteca.busquedaAvanzada({});
console.log(`- Total de libros encontrados: ${res4.length}`);



//2.sistema de usuarios con historial de préstamos, 

// --- PRÉSTAMO 1: Alicia pide un libro (id: 4, 1984) ---
const resPrestamo1 = biblioteca.prestar(4, 101); 
console.log("PRESTAMO",resPrestamo1.mensaje);
// Resultado: ✅ Libro "1984" prestado exitosamente a Alicia Torres.

// --- PRÉSTAMO 2: Beto pide un libro (id: 3, The Pragmatic Programmer) ---
const resPrestamo2 = biblioteca.prestar(3, 102); 
console.log("PRESTAMO",resPrestamo2.mensaje);
// Resultado: ✅ Libro "The Pragmatic Programmer" prestado exitosamente a Beto Ruiz.

// --- DEVOLUCIÓN 1: Alicia devuelve el libro (id: 4, 1984) ---
const resDevolucion1 = biblioteca.devolver(4);
console.log("DEVOLUCIÓN",resDevolucion1.mensaje);
// Resultado: ✅ Libro "1984" devuelto exitosamente por Alicia Torres.






//3.cálculo de multas por retrasos
// 1. Prestamos el libro 4 ('1984') a Alicia (101).
//    NOTA: La fecha de préstamo se simuló hace 10 días para generar una multa.
console.log("MULTAS POR RETRASO",biblioteca.prestar(4, 101).mensaje);

// 2. Devolvemos el libro 4, lo que dispara el cálculo de multa.
//    (10 días transcurridos - 7 días máximo = 3 días de retraso * $0.50/día = $1.50)
console.log("MULTAS POR RETRASO",biblioteca.devolver(4).mensaje);



//4.reportes de popularidad de libros. 

const ranking = biblioteca.obtenerRankingPopularidad();

ranking.forEach(({ titulo, autor, popularidad }) => {
  console.log("lA POPULARIDAD SE MIDO POR CANTIDAD DE PRESTAMO",`- "${titulo}" por ${autor} (Préstamos: ${popularidad})`);
});