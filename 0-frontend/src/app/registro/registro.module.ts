import { ResaltarDirective } from './../directive/resaltar.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPageRoutingModule } from './registro-routing.module';

import { RegistroPage } from './registro.page';
import { EstadoPipe } from '../pipe/estado.pipe';
import { TimePipe } from '../pipe/time.pipe';

@NgModule({
  imports: [
    TimePipe,
    EstadoPipe,
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPageRoutingModule,
    ResaltarDirective
  ],
  declarations: [RegistroPage]
})
export class RegistroPageModule {}
