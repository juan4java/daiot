import { ResaltarDirective } from './../directive/resaltar.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricoPageRoutingModule } from './historico-routing.module';

import { HistoricoPage } from './historico.page';
import { TimePipe } from '../pipe/time.pipe';
import { ParserUnitPipe } from '../pipe/parser-unit.pipe';

@NgModule({
  imports: [
    TimePipe,
    ParserUnitPipe,
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricoPageRoutingModule,
    ResaltarDirective
  ],
  declarations: [HistoricoPage]
})
export class HistoricoPageModule {}
