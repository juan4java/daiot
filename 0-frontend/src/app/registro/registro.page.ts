import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Dispositivo } from '../class/Dispositivo';
import { ActivatedRoute } from '@angular/router';
import { LogRiego } from '../class/LogRiego';
import { Tipo } from '../class/Tipo';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public dispositivo:Dispositivo = new Dispositivo()
  public tipo:Tipo = new Tipo()
  public logArray:Array<LogRiego> = new Array
  public service:DataService
  public title:String = "Registro"
  public equipoId:Number = 0
  public typeDeviceSelect = 1
  public ubicacion:String = ""
  public nombre:String = ""

  constructor(service:DataService, router:ActivatedRoute) {
    
    this.service = service
    const dispId = router.snapshot.paramMap.get( 'dispositivo_id' );
    //const tipoId = router.snapshot.paramMap.get( 'tipo_id' );
    console.log(`constructor historico`)

    this.tipo = new Tipo()
    
    if(Number.isNaN(dispId)){
      console.log(`${dispId} no es un numero valido`)
    } else {
      this.equipoId = Number(dispId)
     // this.getRegistroRiegoList()
    }
  }

  async getRegistroRiegoList() {

    await this.service.getDispositivo(this.equipoId)
      .then((dList) => {
        console.log(dList)
        for (let e of dList) {
          var log:LogRiego = new LogRiego()
          
          log.logRiegoId = e.logRiegoId
          log.apertura = e.apertura
          log.tipoId = e.tipoId
          log.fecha = e.fecha

          this.logArray.push(log)
        }
        console.log(dList)
      })
      .catch((error) => {
        console.log(error)
      })
    console.log('Cargue los registros')
  }

  ngOnInit() {
    this.service.getDispositivo(this.equipoId)
    .then((d) => {
      console.log(d)
        this.dispositivo.equipoId = d[0].equipoId
        this.dispositivo.nombre = d[0].nombre
        this.dispositivo.ubicacion = d[0].ubicacion
        this.dispositivo.tipoId = d[0].tipoId

        this.typeDeviceSelect = d[0].tipoId

        console.log("tipo de equipo" + this.dispositivo.tipoId)
      
    })
    .catch((error) => {
      console.log(error)
    })
  }

  public save(isNew:boolean){
    
    var bodyE = `{"nombre":"${this.nombre}",
      "tipoId":${this.typeDeviceSelect},
      "ubicacion":"${this.ubicacion}"}`

    console.log(bodyE)
    if(this.nombre == undefined || this.nombre == ""){
      return
    }
        
        this.service.saveEquipo(JSON.parse(bodyE), isNew)
          .then((res) => {
          console.log(res)
            console.log(`id registro insertado ${res.insertId}`)
            if(isNew)
              alert("El registro se inserto correctamente")
            else
              alert("Registro actualizado")
          })
          .catch((error) => {
            console.log("ERROR " + error)
        })
  }
}