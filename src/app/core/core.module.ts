import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Material
import { MatToolbarModule } from '@angular/material/toolbar';
// Components
import { HeaderComponent } from './shell/header/header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
  ],
  exports: [HeaderComponent],
})
export class CoreModule {}
