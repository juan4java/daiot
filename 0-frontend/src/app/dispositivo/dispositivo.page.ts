import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Dispositivo } from '../class/Dispositivo';

import * as Highcharts from 'highcharts';
import { ControlService } from '../services/control.service';
import { Timeseries } from '../class/Timeseries';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);


enum ESTADO {
  abierta = 1,
  cerrada = 0
}

enum ACCION {
  abrir = 1,
  cerrar = 0
}

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})
export class DispositivoPage implements OnInit, OnDestroy {

  private service:DataService
  private control:ControlService
  
  public title:string = "Dispositivo"
  private valorObtenido:number=0;
  public myChart:any;
  private chartOptions:any;
  public dispositivo:Dispositivo = new Dispositivo()
  public estado:Number = new Number
  public xData:Array<Number[]> = new Array
  public pData:Array<Number[]> = new Array
  public tData:Array<Number[]> = new Array
  public minutes = [240,120,60,30,10]
  public minuteSelect = 10

  public series:Array<Array<Number[]>> = new Array

  public lastTimeserie:Array<Timeseries> = new Array


  constructor(service:DataService, control:ControlService, router:ActivatedRoute) {
    this.control = control
    this.service = service
    const id = router.snapshot.paramMap.get( 'id' );
    console.log(`Constructor de dispositivo ${id}`)

    let numero = Number(id)
    if(Number.isNaN(numero)){
      console.log(`No es un numero valido ${numero}`)
    } else {
      this.dispositivo = new Dispositivo()
      this.dispositivo.equipoId = numero
    }
  }
  
  ngOnInit() {
    this.getDispositivo()
  }
  
  ngOnDestroy(): void {
    console.log("destroy")
    this.myChart = undefined
  }
  
  ionViewDidEnter() {
    console.log(`nombre ion view did enter : ${this.dispositivo.nombre}`)
    this.getMedicionTimeSeriesList()
    // this.getRegistroActual()
    // this.getMedicionActual()
    this.generarChart();
  }

  private async getDispositivo(){
    await this.service.getDispositivo(this.dispositivo.equipoId)
      .then((dList) => {
        console.log(dList)
        
        for (let d of dList) {
          
          this.dispositivo = new Dispositivo() 
          this.dispositivo.equipoId = d.equipoId
          this.dispositivo.tipoId = d.tipoId
          this.dispositivo.nombre = d.nombre
          this.dispositivo.ubicacion = d.ubicacion
          
          console.log(`Dispositivo encontrado ${this.dispositivo.nombre}`)
        }
        console.log(dList)
      })
      .catch((error) => {
        console.log("ERROR " +error)
    })
    console.log('Cargue el equipo')
  }

  public async forceDevice(){
    var time = new Date().getTime()
    await this.service.forceDevice(this.dispositivo.equipoId)
      .then((dList) => {
        
        var respTime = new Date().getTime() - time
        alert("Force : " + respTime + " ms")
    
      })
      .catch((error) => {
      console.log("Error" +error)
      alert("Fallo al intentar consultar al equipo :( ")
    })
    console.log('Cargue la lista de mediciones')
  }


  public async onoffDevice(status:Number){

    var time = new Date().getTime()
    
    if(status == 1){
      await this.service.onDevice(this.dispositivo.equipoId)
        .then((dList) => {
        })
        .catch((error) => {
        console.log("Error" +error)
        alert("Fallo al intentar consultar al equipo :( ")
      })
    
    } else if(status == 0){
      await this.service.offDevice(this.dispositivo.equipoId)
        .then((dList) => {
        })
        .catch((error) => {
        console.log("Error" +error)
        alert("Fallo al intentar consultar al equipo :( ")
      })
    
    } 
    console.log('Cargue la lista de mediciones')
  }


  private async getMedicionTimeSeriesList(){
    //[Date.UTC(1970, 9, 27, 11, 11), 0],
    
    await this.service.getMedicionTimeSeriesList(this.dispositivo.equipoId, this.minuteSelect)
    .then((dList) => {
      // console.log(dList)
      this.lastTimeserie = new Array
      let pm = new Timeseries
      let tm = new Timeseries

      this.pData = new Array
      this.tData = new Array
      this.xData = new Array

      console.log(dList)
      for (let e of dList) {
        
        if(e.meassure == 'P'){
          var med:Timeseries = new Timeseries()
          med.timestamp = e.timestamp
          med.device_id = e.device_id
          med.value = e.value

          var date = new Date(e.timestamp)
          var utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes())
  
          let c = [utc, med.value]
          this.pData.push(c)
          med.meassure ="Presión"
          pm = med

        } else if(e.meassure == 'T'){
          var med:Timeseries = new Timeseries()
          med.timestamp = e.timestamp
          med.device_id = e.device_id
          med.value = e.value

          var date = new Date(e.timestamp)
          var utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes())
  
          let c = [utc, med.value]
          this.tData.push(c)
          
          med.meassure ="Temperatura"
          tm = med

        } else if(e.meassure == 'X'){

          var med:Timeseries = new Timeseries()
          med.timestamp = e.timestamp
          med.device_id = e.device_id
          med.value = e.value

          var date = new Date(e.timestamp)
          var utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),date.getMinutes())
  
          let c = [utc, med.value]
          this.xData.push(c)
        }
      }

      //Todo esto es mejorable XD
      this.lastTimeserie.push(pm)
      this.lastTimeserie.push(tm)

      this.calculateLastTime(tm)
      if(dList.length==0){
        pm.device_id = tm.device_id = this.dispositivo.equipoId       
      }

      this.updateValor()
    })
    .catch((error) => {
      console.log("ERROR " +error)
  })
  console.log('Cargue la lista de mediciones')
  }
  calculateLastTime(tm: Timeseries) {
      this.estado = tm.timestamp
  }

  generarChart() {
      this.chartOptions = {chart: {
        type: 'spline'
    },
    title: {
        text: 'Historico'
    },
    subtitle: {
        text: 'Serie de tiempo'
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            // don't display the year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Fecha'
        }
    },
    yAxis: {
        title: {
            text: 'Valor'
        },
        min: 0
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: 'Fecha: {point.x:%e. %b} <br> Valor:{point.y:.2f}'
    },

    plotOptions: {
        series: {
            marker: {
                symbol: 'circle',
                fillColor: '#FFFFFF',
                enabled: true,
                radius: 2.5,
                lineWidth: 1,
                lineColor: null
            }
        }
    },

    colors: ['#6CF', '#0AF', '#06C', '#036', '#000'],

    // Define the data points. All series have a year of 1970/71 in order
    // to be compared on the same x axis. Note that in JavaScript, months start
    // at 0 for January, 1 for February etc.
    series: [
        {
          name: 'Medición Temp',
          data: [[Date.UTC(1970, 9, 27, 11, 11), 0]]
        },
        {
          name: 'Medición Presion',
          data: [[Date.UTC(1970, 9, 27, 11, 11), 0]]
        }
    ]
   } 
    this.myChart = Highcharts.chart('highcharts', this.chartOptions );
    
    console.log("Cargue el grafico")
  }

  private updateValor(){
    // this.myChart = Highcharts.chart('highcharts', this.chartOptions );
      // console.log("update grafico , valor " + this.valorObtenido)
        //llamo al update del chart para refrescar y mostrar el nuevo valor
      console.log("updateando grafica")
     // this.myChart = Highcharts.chart('highcharts', this.chartOptions );
      this.myChart.series[0].setData(this.tData)
      this.myChart.series[1].setData(this.pData)
      //this.myChart.series[2].setData(this.xData)
       
  }

  public updateGraph(){
    console.log("minutos elegidos " + this.minuteSelect)
    this.getMedicionTimeSeriesList()
  }

  public accionarValvula(accion:Number){
    console.log("accion " + accion)
   
  }

  private getDate(){
    var date = new Date();
    
    var month = (date.getMonth() + 1) + ""
    if(month.length == 1)
      month = "0" + month

    var hours = date.getHours() + ""
    if(hours.length == 1){
      hours = "0"+ hours
    }

    var minutes = date.getMinutes() + ""
    if(minutes.length == 1){
      minutes = "0"+ minutes
    }
    var seconds = date.getSeconds() + ""
    if(seconds.length == 1){
      seconds = "0"+ seconds
    }

    return date.getFullYear() + 
            "/" + month + 
            "/" + date.getDate() +
            " " + hours +
            ":" + minutes +
            ":" + seconds ;
  }
}
