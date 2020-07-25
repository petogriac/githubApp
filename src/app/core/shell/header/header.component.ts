import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private authService: AuthService, private router: Router) {}
  @Input() user: any;
  @Output() login = new EventEmitter();
  @Output() logout = new EventEmitter();

  onSignIn(): void {
    this.login.emit();
  }

  onSignOut(): void {
    this.logout.emit();
    this.router.navigate([`/users`]);
  }

  onProfile(): void {
    this.router.navigate([`/user`]);
  }
}
