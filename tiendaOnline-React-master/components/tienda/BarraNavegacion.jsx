import React from 'react';
import { BrowserRouter as Router, Route, NavLink , IndexRoute, Link } from 'react-router-dom';

class Main extends React.Component{
  render(){
      return(
          <nav className="navbar navbar-default">
            <div className="container-fluid">
            <div className="navbar-header">
              <Link to="/tienda" className="navbar-brand">LaBodega</Link>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><NavLink  to="/tienda"><span className="glyphicon glyphicon-th" aria-hidden="true"></span></NavLink ></li>
                <li><NavLink  to="/carrito"><span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span><span hidden={(this.props.contador > 0) ? false : true } className="item-counter">{this.props.contador}</span></NavLink ></li>
                <li onClick={this.logout}><Link  to="/"><span className="glyphicon glyphicon-log-out" aria-hidden="true"></span></Link ></li>
              </ul>
            </div>
            </div>
          </nav>
        );
  }

  logout(){
    sessionStorage.removeItem('Session'); //Eliminar los datos de la sesión
  }
}
export default Main;
