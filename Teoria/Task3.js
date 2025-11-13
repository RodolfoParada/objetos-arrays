//Task 3: Destructuring - Desestructuración (8 minutos)
//Destructuring permite extraer valores de arrays y objetos de manera concisa.

//Destructuring de Arrays
const coordenadas = [10, 20, 30];

// Asignación básica
const [x, y, z] = coordenadas;
console.log(x, y, z); // 10 20 30

// Saltar elementos
const [primero, , tercero] = coordenadas;
console.log(primero, tercero); // 10 30

// Rest operator
const [cabeza, ...cola] = coordenadas;
console.log(cabeza); // 10
console.log(cola); // [20, 30]

// Valores por defecto
const [a = 0, b = 0, c = 0] = [1, 2];
console.log(a, b, c); // 1 2 0

// En funciones
function procesarCoordenadas([x, y, z = 0]) {
  return { x, y, z };
}
console.log(procesarCoordenadas([5, 10])); // { x: 5, y: 10, z: 0 }



//Destructuring de Objetos
const usuario = {
  nombre: "Ana",
  edad: 25,
  email: "ana@example.com",
  direccion: {
  calle: "Calle Principal",
  ciudad: "Madrid"
  }
};

// Destructuring básico
const { nombre, edad } = usuario;
console.log(nombre, edad); // "Ana" 25

// Alias para variables
const { nombre: nombreUsuario, email: correo } = usuario;
console.log(nombreUsuario, correo); // "Ana" "ana@example.com"

// Valores por defecto
const { telefono = "No especificado", activo = true } = usuario;

// Destructuring anidado
const { direccion: { calle, ciudad } } = usuario;
console.log(calle, ciudad); // "Calle Principal" "Madrid"

// Rest operator
const { nombre: n, ...resto } = usuario;
console.log(n); // "Ana"
console.log(resto); // { edad: 25, email: "...", direccion: {...} }

// En parámetros de función
function mostrarUsuario({ nombre, edad, email = "Sin email" }) {
  console.log(`${nombre} (${edad} años) - ${email}`);
}

mostrarUsuario(usuario); // "Ana (25 años) - ana@example.com"



//Casos de Uso Prácticos

// Intercambiar valores
let t = 1, u = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// Procesar retorno de funciones
function obtenerDatos() {
  return {
    titulo: "Mi App",
    version: "1.0.0",
    autor: "Ana García"
  };
}

const { titulo, version } = obtenerDatos();

// En bucles
const usuarios = [
  { nombre: "Ana", rol: "admin" },
  { nombre: "Carlos", rol: "user" }
];

for (const { nombre, rol } of usuarios) {
  console.log(`${nombre} es ${rol}`);
}