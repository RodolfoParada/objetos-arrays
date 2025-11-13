// Task 2: Métodos Modernos de Arrays (10 minutos)
// JavaScript moderno ofrece métodos funcionales poderosos para trabajar con arrays de manera declarativa.

//Métodos de Iteración
const numeros = [1, 2, 3, 4, 5];

// forEach - ejecutar función por cada elemento
numeros.forEach((numero, indice) => {
  console.log(`Elemento ${indice}: ${numero}`);
});

// map - transformar cada elemento
const duplicados = numeros.map(num => num * 2); // [2, 4, 6, 8, 10]

// filter - filtrar elementos que cumplan condición
const pares = numeros.filter(num => num % 2 === 0); // [2, 4]

// find - encontrar primer elemento que cumpla condición
const mayorQueTres = numeros.find(num => num > 3); // 4

// findIndex - encontrar índice del primer elemento
const indiceMayorQueTres = numeros.findIndex(num => num > 3); // 3

// some - verificar si al menos un elemento cumple condición
const hayPares = numeros.some(num => num % 2 === 0); // true

// every - verificar si todos los elementos cumplen condición
const todosMayoresQueCero = numeros.every(num => num > 0); // true

//Métodos de Transformación
const palabras = ["Hola", "Mundo", "JavaScript"];

// reduce - acumular valores
const concatenado = palabras.reduce((acumulador, palabra) => {
  return acumulador + " " + palabra;
}, ""); // "Hola Mundo JavaScript"

// Calcular suma
const suma = numeros.reduce((total, num) => total + num, 0); // 15

// flat - aplanar arrays anidados
const anidado = [1, [2, 3], [4, [5, 6]]];
const plano = anidado.flat(2); // [1, 2, 3, 4, 5, 6]

// flatMap - map + flat
const frases = ["Hola mundo", "JavaScript es genial"];
const palabrasSeparadas = frases.flatMap(frase => frase.split(" "));
// ["Hola", "mundo", "JavaScript", "es", "genial"]


//Métodos de Búsqueda y Ordenamiento

const productos = [
  { nombre: "Laptop", precio: 1000, categoria: "Electrónica" },
  { nombre: "Libro", precio: 20, categoria: "Educación" },
  { nombre: "Mouse", precio: 50, categoria: "Electrónica" }
];

// includes - verificar si array contiene elemento
const tieneLaptop = productos.map(p => p.nombre).includes("Laptop"); // true

// indexOf - encontrar índice de elemento
const indice = [1, 2, 3, 2, 1].indexOf(2); // 1
const ultimoIndice = [1, 2, 3, 2, 1].lastIndexOf(2); // 3

// sort - ordenar array
const ordenadoAsc = [...numeros].sort((a, b) => a - b); // [1, 2, 3, 4, 5]
const ordenadoDesc = [...numeros].sort((a, b) => b - a); // [5, 4, 3, 2, 1]

// Ordenar objetos
const porPrecio = [...productos].sort((a, b) => a.precio - b.precio);