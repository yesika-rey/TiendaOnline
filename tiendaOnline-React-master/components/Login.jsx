import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import * as request from 'superagent';
import {  BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
//-------------------------------------------------------
import LoginFirebase from './FirebaseDB.jsx';
//-------------------------------------------------------

const USUARIODB = firebase.database().ref().child('usuarios')

class LoginForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = { //Inicializar variables
      email: '',
      password: '',
      mensaje: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }
//-----------------------------------------------------------
  checkSession(){
    return sessionStorage.getItem("Session");
  }
//--------------------------------------------------------------
  handleChange(event) {
    if(event.target.id == "email"){
      this.setState({email: event.target.value});
    }
    if(event.target.id == "password"){
        this.setState({password: event.target.value});
    }
  }
//-----------------------------------------------------------------------------
  checkLogin(event) {
    event.preventDefault();

    let email = this.state.email.toLowerCase()
    let emailId = email.replace(/[^a-zA-Z 0-9.]+/g,'').replace(/\./g,'');
    let password = this.state.password;
    let mensajeLogin = '';

    USUARIODB.child(emailId).once('value', function(snapshot) {
    let userData = snapshot.val();
    console.log(email);
    console.log(password);
      if(email === "test@email.com") {
      //if (userData !== null) {
        //alert('user ' + email  + ' exists!' + snapshot.val());
        //console.log(snapshot.val())
        //console.log ('Email correcto: ' + userData.email)
        if (password === "test"){
        //if (userData.password == password){
          mensajeLogin = "Iniciando Sesión";
          sessionStorage.setItem("Session", email);
        }else{
          mensajeLogin = 'Contraseña incorrecta';
        }
      }else{
        mensajeLogin = "El usuario " +email + " no existe";
      }
    });
    this.setState({mensaje : mensajeLogin});
    console.log(mensajeLogin)
  }
//------------------------------------------------------------------------------
    render(){
    if (this.checkSession()){
      return <Redirect to='/tienda'/>
    }
      return(
        <div className="login row">
          <div className="col-12">
            <form className="col-lg-12 col-centered text-center" onSubmit={this.checkLogin}>
              <h4 className="text-center white-text">Iniciar Sesión</h4>
              <div className="col-lg-6 form-group">
                <input type="email" ref="email" id="email" value={this.state.email} onChange={this.handleChange} placeholder="test@email.com" className="validate white-text form-control" required aria-required="true" />
              </div>
              <div className="col-lg-6 form-group">
                <input type="password" ref="password" id="password" value={this.state.password} onChange={this.handleChange} placeholder="test" className="validate  white-text form-control" required aria-required="true" />
              </div>
              <div className="col-lg-12">
                <div className="mensaje text-center">
                {this.state.mensaje}
                </div>
                <button type="submit" className="btn btn-success" >INGRESAR</button>
              </div>
              <div className='login-p'>
                <p>Usuario: test@email.com</p>
                <p>Contraseña: test</p>
              </div>
            </form>
          </div>
        </div>
     );
    }
}
export default LoginForm;
