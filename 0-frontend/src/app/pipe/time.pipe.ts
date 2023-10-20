import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timePipe',
  standalone: true,
})
export class TimePipe implements PipeTransform {

  transform(value: any) {
    //2023-08-30T11:41:36.000Z
    var localDate = new Date(value);


    if(localDate.getTime()==0){
      return "Sin Datos"
    }

    return this.getDate(localDate)
 //   return this.convert(value)
  }

  private convert(value:String){
    if(value.length<20){
      return value
    }

    var date = value.substring(0,10)
    var time = value.substring(11,19)
    return date + " " + time 
  }

  private getDate(date:Date){
    
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
