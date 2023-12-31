
const path = require("path")
const fs = require("fs");
const { error } = require("console");

// Constructor de la clase, inicializa las propiedades
class ProductManager {
  constructor(file) {
    this.path = path.join(__dirname, file + ".json");
    this.products = [];
    this.lastID = 0;
  }

  /*Consejos del tutor:
  1_A mejorar o implementar  métodos que reciben parámetros realizar una evaluación más completa en los campos obligatorios.
  2_Comentar codigo para referencia de los metodos*/
  

// Método para agregar un nuevo producto al array de productos
  addProducts(title, description, price, thumbnail, code, stock) {
    const codeExist = this.products.find((p) => p.code === code)
// Verifica si hay campos obligatorios faltantes y si el código ya existe en algún producto    
    if (!title || !description || !price || !code || !stock) {
      return console.log("Por favor, completa todos los campos obligatorios.");      
    } else if (codeExist) {
      const mensaje = console.log("El codigo ya existe");
      return mensaje;
    } else {
      const ID = this.lastID += 1;
      const newProduct = {
        ID,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(newProduct);
      this.saveProductsToFile();
      const mensaje = console.log(`Producto Agregado correctamente el ID del producto es: ${newProduct.ID}`);
      return mensaje;
    }
  }

// Método para obtener todos los productos almacenados
  async getProducts() {
    try {
      await this.getProductsFromFile();
      return this.products;
    } catch (error) {
      return "Error al cargar los archivos", error;
    }
  }

// Método para obtener un producto por su ID
  async getProductById(ID) {
    try {
// Verifica si se proporciona un ID válido, luego busca el producto por su ID en el array
      if (!ID){
        return "Por favor, introduzca un ID";
      }else{
        const products = await this.getProductsFromFile();
        const existID = products.find((p) => p.ID === ID);
        return existID ?  existID : { message: "El producto no existe"};
      }
    } catch (error) {
      console.log(`error al obtener el producto, ${error}`);
    }
  }

// Método para actualizar un producto existente por su ID
  async updateProduct(ID, updateField) {
    try {
// Verifica si se proporcionan un ID y un objeto con los campos a actualizar,
// luego actualiza los campos del producto y guarda los cambios en el archivo
      if(!ID || !updateField){
        return console.log("Por favor, completa todos los campos obligatorios.");
      }else{
        const products = await this.getProductsFromFile();
        const productIndex = products.findIndex((p) => p.ID === ID);  
        if (productIndex !== -1) {
          const productUpdate = { ...products[productIndex], ...updateField};
          products[productIndex] = productUpdate;          
          this.saveProductsToFile(products)
          return console.log("Producto actualizado correctamente");
        } else {
          return console.log("El ID no existe");
        }
      }
    } catch (error) {
      console.log(`error al actualizar el producto, ${error}`);
    }
  }

// Método para eliminar un producto por su ID
  async deteleProduct(ID) {
    try {
// Busca el producto por su ID, lo elimina del array y guarda los cambios en el archivo
      const products = await this.getProductsFromFile()
      const productIndex = products.findIndex((p) => p.ID === ID);
      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        this.saveProductsToFile(products)
        return console.log("Producto Eliminado correctamente");
      } else {
        return console.log("ID no encontrado");
      }
    } catch (error) {
      return console.log(`error al borrar el producto, ${error}`);
    }
  }

// Método para guardar los productos en el archivo
  async saveProductsToFile() {
    try {
// Escribe los productos en el archivo en formato JSON
      await fs.promises.writeFile(this.path, JSON.stringify(this.products))
    } catch (error) {
      console.log(error);
    }
  }

// Método para obtener los productos desde el archivo
  async getProductsFromFile() {
    try {
// Verifica si el archivo existe, lee los productos desde el archivo y los guarda en el array
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        this.products = JSON.parse(data);
        return this.products;
      } else {
        return [];
      }
    } catch (error) {
      console.log(`Error al leer el archivo, ${error}`);
    }
  }

}

module.exports = ProductManager;