import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';

  const totalUsers : Object = [];
  const config = {
    apiKey: "AIzaSyBAz3p_nHC1uolit6YQeWpY6BrUZqfKHpM",
    authDomain: "tiendaonline-react.firebaseapp.com",
    databaseURL: "https://tiendaonline-react.firebaseio.com",
    projectId: "tiendaonline-react",
    storageBucket: "tiendaonline-react.appspot.com",
    messagingSenderId: "786037490926"
  };
  firebase.initializeApp(config);

const productosDb = firebase.database().ref().child('productos')
const usuariosDb = firebase.database().ref().child('usuarios')

usuariosDb.orderByChild("id").on("child_added", function(snapshot) {
  totalUsers.push(snapshot.key)
});
