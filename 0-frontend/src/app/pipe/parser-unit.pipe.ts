import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parserUnitPipe',
  standalone : true
})
export class ParserUnitPipe implements PipeTransform {

  transform(value: String, from: String , to: String): unknown {
    //1 KPa == 1 Cb
    if(from == "KPa" && to == "Cb"){
      return value + " " +to
    } else if (from == "Cb" && to == "KPa"){
      return value + " " +to
    } else {
      return value + " " + from
    }
  }
}
