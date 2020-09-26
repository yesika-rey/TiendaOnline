import React from 'react';
import * as firebase from 'firebase';
import { BrowserRouter as Router, Route, Link, IndexRoute } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Tienda from './Tienda.jsx';
import BarraNavegacion from './BarraNavegacion.jsx';
import Carrito from './Carrito.jsx';
import LoginForm from '../Login.jsx';

class Producto extends React.Component{
  constructor(props){
    super(props)
    this.state = {
        producto : [],
        listaProductos : [],
        idProducto : [],
        atras : 0,
        siguiente : 0,
        refresh: false
      }
    }
    //==============================================================================
    //                    Component Will Mount
    //------------------------------------------------------------------------------
    componentWillMount(){
    const { idProducto } = this.props.match.params;
      const listaProductos = []
      const producto = []
        if(this.state.producto == ""){                                                   //Verificar si se ha cargado previamente la información del catálogo
        firebase.database().ref("productos").once("value").then((snapshot) => {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            if(childData.id == idProducto){
              producto.push(childData);
            }
            listaProductos.push(childData)
          });
          this.setState({listaProductos : listaProductos, producto : producto });
        })
      }
      this.navegacion(idProducto);
    }
    //==============================================================================
    //                    Render
    //------------------------------------------------------------------------------
    render() {
        return(
          <div className="container">
            <BarraNavegacion contador={this.contadorCarrito()}/>
            <div className="class panel panel-default">
            <div className="row main">
            <div className="col-lg-4 col-md-4 col-sm-4">
              <h2>{this.state.producto.map((producto)=>producto.descripcion)}</h2>
          </div>
            </div>
          <hr></hr>
          <div className="row main">
              { this.mostrarProducto() }
          </div>
          <Link className="btn btn-primary" to="/tienda">Atras</Link>
          </div>
          </div>
       );
    }

    mostrarProducto(){
      return this.state.producto.map(
        (producto) => { return (<DetalleProducto siguiente={this.state.siguiente} atras={this.state.atras} navegacion={this.navegacion.bind(this)} listaProductos={this.state.listaProductos} actualizarDisponible={this.actualizarDisponible.bind(this)} key={ producto.id } producto={producto} /> )}
      )
    }


    //==============================================================================
    //                    Verificar items en carrito
    //------------------------------------------------------------------------------
    itemsCarrito(){
      if(sessionStorage.getItem("Carrito")){
        this.state.listaCarrito = JSON.parse(sessionStorage.getItem("Carrito"));
        return JSON.parse(sessionStorage.getItem("Carrito"));
      }
      return 0;
    }
    //--------------------Contador de items en menu---------------------------------
    contadorCarrito(){
      return this.itemsCarrito().length //Contar la cantidad de items en el carrito
    }
    //=============================================================================
    //             Guardar Items en el carrito
    //--------------Actualizar Disponible------------------------------------------
    actualizarDisponible(item, cantidad){
      for (let productoLista of this.state.producto){
        if (productoLista.id == item.id){
          this.verificarCarrito(item, cantidad)
          productoLista.disponible = (Number(productoLista.disponible) - Number(cantidad))
          this.setState({producto : this.state.producto})
          this.setState({listaCarrito : this.state.listaCarrito})
        }
      }
    }

    //-------------Verificar Carrito------------------------------------------------
    verificarCarrito(item, cantidad){
      if(this.guardarCarrito(item, cantidad) == false){
        this.state.listaCarrito.push(item)
      }
      this.setState({listaCarrito : this.state.listaCarrito})
      sessionStorage.setItem("Carrito", JSON.stringify(this.state.listaCarrito));
    }
    //------------Agregar a Carrito-------------------------------------------------
    guardarCarrito(item, cantidad){
      if(this.state.listaCarrito.length > 0){
        for(let itemGuardado of this.state.listaCarrito){
          if(itemGuardado.id == item.id){
            itemGuardado.cantidad = (Number(itemGuardado.cantidad) + Number(cantidad))
            return true //Devolver verdadero si el producto existia en el carrito
          }
        }
        return false; //Devolver falso si el producto no existia en el carrito
      }
      return false; //Devolver falso si el producto no existia en el carrito
    }

    navegacion(id:number){ //Navegar entre productos en vista detalle recibiendo como parámetro el id del URL actual
      let back = Number(id-1); //Restarle una unidad al valor del id actual
      if(back >= 0){ //Verificar que el valor sea mayor o igual a cero
        this.setState({atras : back }) ; //Devolver el resultado como parámetro
      }

      let next = Number(id+1);
      if(id < this.state.listaProductos.length){ //Verificar que el id actual sea menor que la cantidad de productos en el catálogo
        this.setState({siguiente : next}); //Devolver el resultado como parámetro
      }

    }
 }
export default Producto;









class DetalleProducto extends React.Component{

//===============================================================================
//                    Constructor
//------------------------------------------------------------------------------
constructor(props) {
  super(props);
  this.state = { //Inicializar variables
      inputValue : 1,
      disponible : this.props.producto.disponible,
      contadorCarrito : 0,
      listaProductos: this.props.listaProductos,
      listaCarrito: JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : [] ,
      producto : this.props.producto,
      productoCarrito : {
        id : '',
        descripcion : '',
        imagen : '',
        cantidad : '',
      },
        atras: this.props.atras,
        siguiente : this.props.siguiente,
      };
}
//==============================================================================
//                    Component Will Mount
//------------------------------------------------------------------------------
componentWillMount(){
      this.checkCarrito(this.props.producto);
      this.props.navegacion(this.props.producto.id);
}
//==============================================================================
//                    Render
//------------------------------------------------------------------------------
  render(){
  if(!sessionStorage.getItem('Session')){
    return <Redirect to="/" />
  }
    const producto = this.props.producto
    return (
      <div>
      <div className="col-lg-3 col-md-3 col-sm-12">
        <a className="thumbnail">
          <img src={producto.imagen}/>
        </a>
      </div>
      <div className="col-lg-3 col-md-3 col-sm-12">
        <h5>precio: {producto.precio} </h5>
        <h6>Unidades Disponibles: {this.state.disponible ? this.state.disponible : 'Agotado'}</h6>
      </div>
      </div>
    )
  }

  //==============================================================================
  //                    Funciones
  //------------------------------------------------------------------------------
  //--------------------Agregar Productos-----------------------------------------
    agregarProducto(){
       let cantidad = this.state.inputValue;
       const producto = this.props.producto;
       if (cantidad <=0) {
        alert('Seleccione una cantidad válida');
        return
       }
       if(this.state.disponible < cantidad){
         alert('Máxima existencia es: '+ this.state.disponible);
       }else{
         let disponibles = (Number(this.state.disponible) - Number(cantidad));
         let agregarACarrito = (Number(this.state.contadorCarrito) + Number(cantidad));
         this.setState({disponible : disponibles});
         this.setState({contadorCarrito : agregarACarrito});
         this.state.productoCarrito.id =  producto.id;
         this.state.productoCarrito.descripcion =  producto.descripcion;
         this.state.productoCarrito.imagen =  producto.imagen;
         this.state.productoCarrito.precio =  producto.precio;
         this.state.productoCarrito.cantidad = (Number(this.state.productoCarrito.cantidad) +  Number(cantidad));
         this.props.actualizarDisponible(this.state.productoCarrito, cantidad, false);
       }
    }
  //------------------------------------------------------------------------------
  //======================EventListener para campo de cantidades====================
    updateInputValue(evt) {
      this.setState({
        inputValue: evt.target.value
      });
    }
  //---------------------Verificar carrito----------------------------------------
    checkCarrito(producto){
      for(let itemCarrito of this.state.listaCarrito){ //Recorrer el arreglo de productos almacenados en el carrito
        if(itemCarrito.id == producto.id){
          let actualizarDisponible = (Number(this.state.disponible) - Number(itemCarrito.cantidad));
          this.setState({disponible : actualizarDisponible, contadorCarrito : itemCarrito.cantidad});
        }
      }
    }
  //------------------------------------------------------------------------------
}
