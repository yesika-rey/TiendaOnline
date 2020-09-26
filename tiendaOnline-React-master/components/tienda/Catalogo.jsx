import React from 'react'
import { Link } from 'react-router-dom';
import * as firebase from 'firebase';
import { FormattedMessage } from 'react-intl';
import update from 'immutability-helper'; //Manejo de arrays
import BarraNavegacion from './BarraNavegacion.jsx';

class Catalogo extends React.Component {

//==============================================================================
//                    Component Will Mount
//------------------------------------------------------------------------------
  componentWillMount(){
    this.checkCarrito(this.props.id);
  }
//===============================================================================
//                    Constructor
//------------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = { //Inicializar los estados de las variables
      inputValue : 1,
      disponible : this.props.disponible,
      contadorCarrito : 0,
      listaProductos: [],
      listaCarrito: JSON.parse(sessionStorage.getItem('Carrito')) ? JSON.parse(sessionStorage.getItem('Carrito')) : [] ,
      productoCarrito : {
          id : '',
          descripcion : '',
          imagen : '',
          cantidad : '',
        },
    };
  }
//==============================================================================
//                    Render
//------------------------------------------------------------------------------
  render() {
    return (
        <div className="col-lg-3 col-md-3 col-sm-12">
          <div className="thumbnail">
            <img src={this.props.imagen} />
            <div className="caption">
            <h4>{this.props.descripcion}</h4>
            <p>Precio: <span><FormattedMessage   id="precio"  defaultMessage={`$ {precio, number}`} values={{precio : this.props.precio}} ></FormattedMessage></span></p>
            <p>Disponibles: <span>{this.state.disponible ? this.state.disponible : 'Agotado'}</span></p>
            <p>
              <Link to={`/producto/${this.props.id}`} className="btn btn-primary card-action">Ver más</Link>
              <a onClick={this.agregarProducto.bind(this)} disabled={ (this.props.disponible <= 0) ? true : false } className="btn btn-warning">Añadir</a>
            </p>
            <div className="form-group form-horizontal">
              <div className="col-12">
                <input type="number" value={this.state.inputValue} disabled={ (this.props.disponible <= 0 ) ? true : false } min="0" max={this.props.disponible} className="form-control input-md line" onChange={evt => this.updateInputValue(evt)}></input>
              </div>
            </div>
            </div>
          </div>
        </div>
    )
  }


//==============================================================================
//                    Funciones
//------------------------------------------------------------------------------
//--------------------Agregar Productos-----------------------------------------
  agregarProducto(){
     let cantidad = this.state.inputValue
     if (cantidad <=0) {
      alert('Seleccione una cantidad válida');
      return
     }
     if(this.state.disponible < cantidad){
       alert('Máxima existencia es: '+ this.state.disponible);    //Mostrar un mensaje de alerta con la cantidad maxima disponible
     }else{
       let disponibles = (Number(this.state.disponible) - Number(cantidad));
       let agregarACarrito = (Number(this.state.contadorCarrito) + Number(cantidad));
       this.setState({disponible : disponibles});
       this.setState({contadorCarrito : agregarACarrito});
       this.state.productoCarrito.id =  this.props.id;
       this.state.productoCarrito.descripcion =  this.props.descripcion;
       this.state.productoCarrito.imagen =  this.props.imagen;
       this.state.productoCarrito.precio =  this.props.precio;
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
  checkCarrito(id){
    let productoCarrito = this.props
    for(let itemCarrito of this.state.listaCarrito){ //Recorrer el arreglo de productos almacenados en el carrito
      if(itemCarrito.id == productoCarrito.id){
        let actualizarDisponible = (Number(this.state.disponible) - Number(itemCarrito.cantidad));
        this.setState({disponible : actualizarDisponible, contadorCarrito : itemCarrito.cantidad});
      }
      //(itemCarrito.id, itemCarrito.cantidad); //Actualizar las cantidades de los productos a agregar en el carrito
    }
  }
//------------------------------------------------------------------------------

}export default Catalogo
