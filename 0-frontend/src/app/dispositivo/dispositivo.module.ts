import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DispositivoPageRoutingModule } from './dispositivo-routing.module';

import { DispositivoPage } from './dispositivo.page';
import { EstadoPipe } from '../pipe/estado.pipe';
import { ParserUnitPipe } from '../pipe/parser-unit.pipe';
import { TimePipe } from '../pipe/time.pipe';

@NgModule({
  imports: [
    TimePipe,
    CommonModule,
    EstadoPipe,
    ParserUnitPipe,
    FormsModule,
    IonicModule,
    DispositivoPageRoutingModule
  ],
  declarations: [DispositivoPage]
})
export class DispositivoPageModule {}
