import { Injectable } from '@angular/core';
import { Dispositivo } from '../class/Dispositivo';
import { LogRiego } from '../class/LogRiego';
import { Medicion } from '../class/Medicion';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /**Sensores de humedad*/
  public diArray:Array<Dispositivo> = new Array;
  /**Regustro de la medicion*/
  public meArray:Array<Medicion> = new Array;
  /**Historico de equipos*/
  public lrArray:Array<LogRiego> = new Array;

  private host = 'http://192.168.0.37:3000'

  constructor(private _http: HttpClient) { }

  public loadDispostivo(id:Number){
    if(this.diArray.length==0){
      this.getDispositivoList()
    }
    return this.diArray
  }
  
  public getDispositivoList (): Promise<any> {
    return firstValueFrom(this._http.get(`${this.host}/dispositivo/list`))
  }

  public getDispositivo(id:Number): Promise<any> {
    return firstValueFrom(this._http.get(`${this.host}/dispositivo/${id}`))
  }

  public getMedicionLast(dispostivoId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`${this.host}/medicion/last/${dispostivoId}`))
  }

  
  public getMedicionList(dispostivoId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`${this.host}/medicion/${dispostivoId}`))
  }

  public putMedicion(medicion:JSON) : Promise<any> {
    return firstValueFrom(this._http.put(`${this.host}/medicion`,medicion))
  }

  public saveEquipo(json:JSON, isNew:boolean) : Promise<any> {
    if(isNew){
      return firstValueFrom(this._http.put(`${this.host}/dispositivo/create`,json))
    } else {
      return firstValueFrom(this._http.put(`${this.host}/dispositivo/update`,json))
    }
  }

  
  public getMedicionTimeSeriesList(dispostivoId:Number , minuteSelect:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`${this.host}/medicion/timeseries/${dispostivoId}/${minuteSelect}`))
  }

  public forceDevice(dispostivoId:Number) : Promise<any> {
    return firstValueFrom(this._http.get(`${this.host}/medicion/force/${dispostivoId}`))
  }
  

  public onDevice(dispostivoId:Number) : Promise<any> {
    console.log("on")
    var value = 1
    return firstValueFrom(this._http.get(`${this.host}/medicion/onoff/${dispostivoId}/${value}`))
  }

  
  public offDevice(dispostivoId:Number) : Promise<any> {
    console.log("off")
    var value = 0
    return firstValueFrom(this._http.get(`${this.host}/medicion/onoff/${dispostivoId}/${value}`))
  }
  
  public getDispositivoOld(id:Number){

    return { "equipoId" : id
    , "nombre" : `Sensor ${id}`
    , "ubicacion" : "Patio"
    , "tipoId" : id
    }

  }

  private getDispositivoListOld (){
  return ([
      { "equipoId" : 1
      , "nombre" : "Sensor 1"
      , "ubicacion" : "Patio"
      , "tipoId" : 1
      },
      { "equipoId" : 2
      , "nombre" : "Sensor 2"
      , "ubicacion" : "Cocina"
      , "tipoId" : 2
      },
      { "equipoId" : 3
      , "nombre" : "Sensor 3"
      , "ubicacion" : "Jardin Delantero"
      , "tipoId" : 3
      },
      { "equipoId" : 4
      , "nombre" : "Sensor 2"
      , "ubicacion" : "Living"
      , "tipoId" : 4
      }])
  }

  /** Obtener ultima medicion o todas las mediciones para 
   * un determinado dispositivo
   */
  public getMedicionListOld(dispostivoId:Number){
    return ([
      { "medicionId" : 10
      , "fecha" : 1692576861990
      , "valor" : "60"
      , "dispostivoId" : dispostivoId
      },
      { "medicionId" : 9
      , "fecha" : 1692576861990
      , "valor" : "55"
      , "dispostivoId" : dispostivoId
      },
    ]);
  }

  public getMedicionOld(dispostivoId:Number){
    return  { "medicionId" : 10
      , "fecha" : 16000001000
      , "valor" : "60"
      , "dispostivoId" : dispostivoId
      };
  }

  /** Obtener registros de riego */
  public getRegistroRiegoListOld(electrovalvulaId:Number){
    return ([
      { "logRiegoId" : 100
      , "fecha" : 1692576061990
      , "apertura" :1
      , "electrovalvulaId" : electrovalvulaId
      },
      { "logRiegoId" : 99
      , "fecha" : 1692506861990
      , "apertura" : 0
      , "electrovalvulaId" :  electrovalvulaId
      }
    ]);
  }
}