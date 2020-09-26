import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";

@Injectable()
export class ProductosService {

  constructor(private http: Http) { }

  obtenerProductos(){
    return this.http.get("https://tiendaenlinea-bea91.firebaseio.com/productos/.json")
      .map((res: Response) => {
      	console.log(res.json());
      	return res.json();
      });
  }

  obtenerProductoPorId(id:number){
    return this.http.get("https://tiendaenlinea-bea91.firebaseio.com/productos/" + (id - 1) + "/.json")
      .map((res: Response) => res.json());
  }
}
