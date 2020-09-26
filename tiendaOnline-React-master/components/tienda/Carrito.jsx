import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import * as request from 'superagent';
import { FormattedMessage } from 'react-intl';
import BarraNavegacion from './BarraNavegacion.jsx';
import CarritoDetalle from './CarritoDetalle.jsx'

class Carrito extends React.Component{
  //===============================================================================
  //                    Constructor
  //------------------------------------------------------------------------------
  constructor(props) {
    super(props)
    this.state = {
      listaCarrito : [],
      inputValue:0,
      redirect : false,
      counter : 1,
      pagar : false
    }
    this.vaciarCarrito = this.vaciarCarrito.bind(this)
  }
  //==============================================================================
  //                    Component Will Mount
  //------------------------------------------------------------------------------
  componentWillMount(){
    this.setState({listaCarrito : JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : '[]' })
  }
  //============================================================================
  //                    Render
  //----------------------------------------------------------------------------
  render(){
    if(!sessionStorage.getItem('Session')){
      return <Redirect to="/" />
    }
    if(this.contadorCarrito()){
      return(
        <div className="container">
        <BarraNavegacion contador={this.contadorCarrito()}/>
          <div className="class panel panel-default">
          <div className="row main">
            <div className="col-lg-4 col-md-4 col-sm-4">

            </div>
          </div>
          <hr></hr>
            <div className="row main">
              <div className="col-lg-6 col-md-3 col-sm-12">
                      {  this.mostrarCarrito()}
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12">
          <h4>Total: <FormattedMessage   id="total"  defaultMessage={`$ {total, number}`} values={{total : this.total()}}  /></h4>
            <a onClick={this.vaciarCarrito} className="btn btn-default" role="button">Cancelar</a>
            <a onClick={this.vaciarCarrito} className="btn btn-success" role="button">Pagar</a>
          </div>
            </div>
        </div>
        </div>
      )
    }else if(!this.contadorCarrito() && this.state.redirect == false){
      return (
        <div className="tienda row">
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
            <div className="animated fadeIn slow">
              <div className="box white col s12 center-align" style={{padding: '5%'}}>
                <h5  style={{height : '70vh', display : 'table-cell', verticalAlign : 'middle'}} >Debes agregar productos al carrito de compras. Vuelve a <Link to="/tienda">La Bodega</Link></h5>
              </div>
            </div>
          </div>
        </div>
      )
    }else{
      return <Redirect to="/tienda"/>; //Redireccionar a la tienda
    }
  }
  //==============================================================================
  //                    Funciones
  //----------------------Mostrar items en carrito=-------------------------------
  mostrarCarrito(){
    return this.state.listaCarrito.map(
      (producto) => { return <CarritoDetalle key={ producto.id } id={producto.id}  descripcion={ producto.descripcion } imagen={ producto.imagen } descripcion={ producto.descripcion } cantidad={ producto.cantidad } precio ={producto.precio} actualizarDisponible={this.actualizarDisponible.bind(this)}/> }
    )
  }
  //==============================================================================
  //                    Verificar items en carrito
  itemsCarrito(){
    if(sessionStorage.getItem("Carrito")){                                    //Verificar si la sesión del carrito contiene información
      this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito")); //Actualizar la información del carrito con la sesión actual en formato JSON
      return JSON.parse(sessionStorage.getItem("Carrito"));                    //Devolver los items del carrito en formato JSON
    }
    return 0;                                                                  //Devolver 0 si no existen carritos
  }
  //--------------------Contador de items en menu---------------------------------
  contadorCarrito(){
    return this.itemsCarrito().length //Contar la cantidad de items en el carrito
  }
  //=============================================================================
  //             Guardar Items en el carrito
  //--------------Actualizar Disponible------------------------------------------
  actualizarDisponible(item:Object, cantidad:Number, remover:Boolean = false){
    for (let productoLista of this.state.listaCarrito){
      if (productoLista.id == item.id){
        productoLista.cantidad = cantidad
        if(productoLista.cantidad == 0 || remover == true){
          this.removerItem(item)
        }
      }
    }
    sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito))
    this.setState({listaCarrito : this.state.listaCarrito})
  }
  //---------------Remover item del carrito--------------------------------------
  removerItem(item){
    let index = this.state.listaCarrito.findIndex(producto => producto.id === item.id)
    let newArray =   this.state.listaCarrito.splice(index, 1)
  }
  //-----------------Vaciar los items del carrito------------------------------------
  vaciarCarrito(){
    this.setState({listaCarrito : []})
    sessionStorage.setItem('Carrito', '[]') //Asignar como parámetro un array vacío en formato string a la sesion Carrito
  }
  //==============Calcular Totales================================================
  total(){
    let total :number = 0 //Inicializar los totales
    let items = this.state.listaCarrito; //Iniciar la variable items con los items actuales en el carrito
    for(let subtotal of items ){ //recorrer los items dentro del carrito
      total += subtotal.cantidad * subtotal.precio; //Realizar el producto entre la cantidad y el precio y agregarlo al valor guardado anteriormente
    }
    return total; //Devolver el valor de la suma total de todos lso subtotales del producto
  }
  //=============Pagar Carrito==================================================
  pagarCarrito(){
    const listaCarrito = this.state.listaCarrito                                   //Definir la constante lista carrito
    this.setState({ pagar : true})
    request
    .get('https://tienda-angular2.firebaseio.com/productos/.json')                //Realizar una consulta a la base de datos
    .then((res) => {
      if( res.error || !res.ok){                                                   //Si existe mensaje de error
        console.log('Se produjo un error al realizar la petición al servidor. '+error )
        alert('Se produjo un error al realizar la petición al servidor. '+error )
      }else{
        console.log('Conexión establecida. Actualizando base de datos')           //Mostrar mensaje en cónsola
        const respuesta = res.text                                                //Guardar la respuesta del servidor
        let catalogo = JSON.parse(respuesta)                                      //Convertir la respuesta del servidor en formato JSON
        for (let itemCatalogo of catalogo){                                       //Recorrer el arreglo de productos obtenidos de la base de datos
          for (let item of listaCarrito){                                         //Recorrer el arreglo de productos en el carrito
            if ( itemCatalogo.id == item.id ){                                    //Comparar el id del producto del carrito con el id del producto almacenado en la base de datos
              let cantidad = Number(item.cantidad);                               //obtener la cantidad del producto actual en el carrito
              itemCatalogo.disponible = itemCatalogo.disponible - cantidad;       //Restar la disponibilidad del producto en la base de datos con la cantidad actual en el carrito
              this.actualizarDB(itemCatalogo, cantidad)                           //Ejecutar la funcion actualizarDisponibles enviando como parámetros el id y el objeto Producto en la base de datos
            }
          }
        }
      }
    }
  )
}

actualizarDB(itemCatalogo, cantidad){
  request.put(`https://tienda-angular2.firebaseio.com/productos/${itemCatalogo.id}.json`)  //Realizar consulta a base de datos
  .set('Content-Type', 'application/json')                                                 //Especificar el tipo de datos
  .send(itemCatalogo)                                                                      //Enviar el producto como parámetro
  .then((res) => {                                                                         //Manejar la respuesta del servidor
    if( res.error || !res.ok){                                                             //Si ocurre un erro
      console.log('Se produjo un error al actualizar la base de datos. '+error );
      alert('Se produjo un error al actualizar la base de datos. '+error)                  //Mostrar alerta
    }else{
      if(this.state.listaCarrito.length == 1){                                             //Si la cantidad de items en el carrito es 1, vaciar el carrito y actualizar la variable redirect a true
        this.vaciarCarrito()
        this.setState({ redirect : true })
      }else{
        let counter = (Number(this.state.counter) + 1)                                     //Si no, Crear una variable contador
        if(counter == this.state.listaCarrito.length){                                     //Cuando la variable contador sea igual al número de productos en el carrito (se haya recorrido el arreglo)
          this.vaciarCarrito()                                                               //Vaciar carrito
          this.setState({ counter : counter})                                                //Actualizar el estado de la variable contador por el contador actual
          this.setState({ redirect : true })                                                 //Cambiar el estado de redireccion a true
        }else{
          this.setState({ counter : counter})                                              //Actualizar el estado de la variable contador por el contador actual
        }
      }
    }
  })
}

  componentDidUpdate(){
    console.log('Actualización de disponibilidad correcta.');                               //Mostrar mensaje en consola cada vez que el producto sea actualizado en la base de datos
  }
}

export default Carrito;
