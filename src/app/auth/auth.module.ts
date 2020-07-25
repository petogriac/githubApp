import { NgModule, ModuleWithProviders } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from './auth.service';

@NgModule({
  providers: [AngularFireAuth],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AuthModule,
      providers: [AuthService],
    };
  }
}
