class Contenedor{

static fs= require('fs'); 

    //constructor que recibe el nombre del archivo
    constructor(nombreArchivoNuevo){
        this.nombreArchivo = nombreArchivoNuevo;
    }

    async getAll(){
        try{
            //si el archivo no existe lo creo vacio
            if(!Contenedor.fs.existsSync(this.nombreArchivo)){ //Si el archivo No existe 
                await Contenedor.fs.promises.writeFile(this.nombreArchivo,"","utf-8"); //crea el archivo vacio
            }
            //leo el archivo y lo asigno a una variable
            const contenidoArchivo = await Contenedor.fs.promises.readFile(this.nombreArchivo,"utf-8");//lee el archivo
            return Promise.resolve(contenidoArchivo.length>0 ? JSON.parse(contenidoArchivo):[]); //devuelve objeto Promise 
        }
        catch(error){
            throw Error(`Error en el método "getAll": ${error.message}`);
        }        
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
    async save(object){
        if(object != undefined){ // si el objeto existe
            try{
                const arrayContenidoArchivo = await this.getAll();// array con los objetos del archivo
                let idMasAlto = 0;
                if(arrayContenidoArchivo.length>0){ //si hay datos en el array obtengo el id mas alto
                    idMasAlto =  arrayContenidoArchivo.reduce((acum,proximo)=> acum>proximo.id? acum:proximo.id,0);
                }
                object.id = idMasAlto+1; //agrego el id al nuevo objeto
                arrayContenidoArchivo.push(object); //agrego al array el nuevo objeto con el id asignado
                
                await Contenedor.fs.promises.writeFile(this.nombreArchivo,JSON.stringify(arrayContenidoArchivo),"utf-8"); //piso el archivo con nuevo array donde agregue nuevo objeto
                return Promise.resolve(object.id);//devuelvo el id del nuevo objeto
            }
            catch(error){
                throw Error(`Error en el método "save": ${error.message}`);
            }
        }else{
            Promise.reject(new Error(`Error en el método "save": No existe el objeto recibido`));
        }   
    }

    //getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
    async getById(id){
        try{
            if(id!==undefined && typeof(id) === "number"){ //valido el valor ingresado
                const datosArchivo = await this.getAll(); //obtengo todo el array de objetos del archivo
                const objeto = datosArchivo.find(elemento => elemento.id === id); //busco y obtengo el objeto con el id ingresado
                return objeto===undefined ? Promise.reject(Error(`Error en el método "getById": El id ingresado no existe`)) : Promise.resolve(objeto); //devuelvo el objeto o error no encontrado
            }else{
                throw Error(`Error en el método "getById": El id ingresado es inválido`);
            }
        }
        catch(error){
            throw Error(`Error en el método "getById": ${error.message}`);
        }
    }

    //deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
    async deleteById(id){
        try{
            if(id!==undefined && typeof(id) === "number"){//valido el valor ingresado
                const datosArchivo = await this.getAll(); //obtengo todo el array de objetos del archivo
                let indice = datosArchivo.findIndex(element=> element.id === id); //busco y obtengo el indice del objeto con el id ingresado
                if(indice>-1){
                    datosArchivo.splice(indice,1); //reemplaza(1) por vacio (3er parametro), la posicion del index, o sea elimina objeto
                    await Contenedor.fs.promises.writeFile(this.nombreArchivo,JSON.stringify(datosArchivo), "utf-8"); //vuelve a guardar en el archivo el array modificado
                }
                else{ //no se encuentra en el archivo el id que se busca
                    return Promise.reject(Error(`Error en el método "deleteById": El id ingresado no se encontró en el archivo, no se elimina ningún objeto.`));
                }                
            }else{
                throw Error(`Error en el método "deleteById": El id ingresado es inválido`);
            }
        }
        catch(error){
            throw Error(`Error en el método "deleteById": ${error.message}`);
        }
        
    }

    //deleteAll(): void - Elimina todos los objetos presentes en el archivo.
    async deleteAll(){
        try{
            await Contenedor.fs.promises.writeFile(this.nombreArchivo,"", "utf-8"); //reemplazo el contenido del archivo por un vacio = eliminar todo lo que habia 
        }
        catch(error){
            throw Error(`Error en el método "deleteAll": ${error.message}`);
        }
    }
}

module.exports = Contenedor;