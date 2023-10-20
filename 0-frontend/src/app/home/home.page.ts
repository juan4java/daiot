import { Dispositivo } from './../class/Dispositivo';
import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public title:string = "Home"
  private dArray:Array<Dispositivo> = new Array

  constructor(private _service:DataService) {
  }

  async ngOnInit() {

    await this._service.getDispositivoList()
      .then((dList) => {
        console.log(dList)
        for (let dispositivo of dList) {
          var disp = new Dispositivo()
          disp.equipoId = dispositivo.equipoId
          disp.nombre = dispositivo.nombre
          disp.ubicacion = dispositivo.ubicacion
          disp.tipoId = dispositivo.tipoId

          this.dArray.push(disp)
          console.log(dispositivo.nombre)
        }
        console.log(dList)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  public getArray(){
    return this.dArray
  }
}