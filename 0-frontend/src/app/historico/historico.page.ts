import { Medicion } from './../class/Medicion';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Dispositivo } from '../class/Dispositivo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  private service:DataService
  public dispositivo:Dispositivo
  public title:String = `Historico`
  public medArray:Array<Medicion> = new Array


  constructor(service:DataService, router:ActivatedRoute) {
    
    this.service = service
    const id = router.snapshot.paramMap.get( 'dispositivo_id' );
    console.log(`constructor historico`)

    let a = Number(id)
    this.dispositivo = new Dispositivo()
    this.dispositivo.equipoId = a
    
    if(Number.isNaN(a)){
      console.log(`${a} no es un numero valido`)
    } else {
      this.getMedicionList(a)
    }

  }

  ngOnInit() {
  }

  private async getMedicionList(id:Number){
    await this.service.getMedicionList(id)
    .then((dList) => {
      console.log(dList)

      for (let e of dList) {
        var med:Medicion = new Medicion()
        
        med.id = e.medicionId
        med.fecha = e.fecha
        med.valor = e.valor
    
        this.medArray.push(med)
      }

    })
    .catch((error) => {
      console.log("ERROR " +error)
  })
  console.log('Cargue los dispositivos')
  }

  private isValidId(id:String){
    
    let a = Number(id)
    if(Number.isNaN(a)){
      return -1
    } else {
      return a
    }
  }
}
