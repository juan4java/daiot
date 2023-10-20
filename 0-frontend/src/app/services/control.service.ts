import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class ControlService {

    constructor(){

    }

    public accionarElectrovalvula(electrovalvulaId:Number, accion:Number){
        //Crear registro de log
        console.log(`se acciono electrovalvula: ${electrovalvulaId} , accion: ${accion}`)
    }
}