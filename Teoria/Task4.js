//Task 4: Prototype Chain Básica (4 minutos)
//JavaScript usa herencia basada en prototipos, no en clases tradicionales.

/* todos los objetos heredas de Object.prototype*/

const objeto = {};
console.log(objeto.toString()); // Método heredado

// Prototype chain
function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function() {
  return `Hola, soy ${this.nombre}`;
};

const ana = new Persona("Ana");
console.log(ana.saludar()); // "Hola, soy Ana"

// Herencia básica
function Desarrollador(nombre, lenguaje) {
  Persona.call(this, nombre); // Llamar constructor padre
  this.lenguaje = lenguaje;
}

Desarrollador.prototype = Object.create(Persona.prototype);
Desarrollador.prototype.constructor = Desarrollador;

Desarrollador.prototype.codificar = function() {
  return `${this.nombre} está programando en ${this.lenguaje}`;
};

const dev = new Desarrollador("Carlos", "JavaScript");
console.log(dev.saludar()); // "Hola, soy Carlos" (heredado)
console.log(dev.codificar()); // "Carlos está programando en JavaScript"