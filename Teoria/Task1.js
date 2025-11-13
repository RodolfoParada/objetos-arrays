//Task 1: Creación y Manipulación de Objetos (8 minutos)
//Los objetos son estructuras de datos fundamentales en JavaScript, compuestas por propiedades y métodos.

//Creación de Objetos

// Object literal - forma más común
const persona = {
  nombre: "Ana",
  edad: 25,
  profesion: "Desarrolladora",
  activo: true
};

// Constructor Object
const coche = new Object();
coche.marca = "Toyota";
coche.modelo = "Corolla";
coche.año = 2020;

// Object.create() - para herencia
const vehiculo = {
  tipo: "Vehículo",
  moverse: function() {
    console.log("Me estoy moviendo");
  }
};

const bicicleta = Object.create(vehiculo);
bicicleta.ruedas = 2;
bicicleta.tipo = "Bicicleta"; // Sobrescribe propiedad heredada



//Acceso y Modificación de Propiedades

// Notación punto
console.log("nombre persona : ",persona.nombre); // "Ana"
persona.edad = 26;

// Notación corchetes - útil para propiedades dinámicas
const propiedad = "profesion";
console.log("persona propiedad :",persona[propiedad]); // "Desarrolladora"

// Propiedades dinámicas
const clave = "ciudad";
persona[clave] = "Madrid";

// Verificar existencia de propiedades
console.log("nombr : " in persona); // true
console.log(persona.hasOwnProperty("email")); // false

// Obtener todas las propiedades
console.log(Object.keys(persona)); // ["nombre", "edad", "profesion", "activo", "ciudad"]
console.log(Object.values(persona)); // ["Ana", 26, "Desarrolladora", true, "Madrid"]
console.log(Object.entries(persona)); // [["nombre", "Ana"], ["edad", 26], ...]



//Métodos de Objetos

const calculadora = {
  sumar: function(a, b) {
    return a + b;
  },

  // Método conciso (ES6+)
  restar(a, b) {
    return a - b;
  },

  // Método con this
  calcularArea() {
    return this.base * this.altura;
  },

  // Setter y getter
  set base(value) {
    if (value <= 0) throw new Error("Base debe ser positiva");
    this._base = value;
  },

  get base() {
    return this._base;
  },

  set altura(value) {
    if (value <= 0) throw new Error("Altura debe ser positiva");
    this._altura = value;
  },

  get altura() {
    return this._altura;
  }
};

// Uso
calculadora.base = 10;
calculadora.altura = 5;
console.log("altura * area ",calculadora.calcularArea()); // 50