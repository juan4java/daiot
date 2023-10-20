import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPipe',
  standalone: true
})
export class EstadoPipe implements PipeTransform {

  transform(value: Number): unknown {
    if(value == 1) {
      return "Abierto";
    } else if(value == 0) {
      return "Cerrado"
    } else {
      return "¿?"
    }
  }

}
