import { Component, OnInit } from '@angular/core';
import { UsersApiService } from '../users.api.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  location: string;
  // TODO add interface IUser
  users: Array<any>;

  constructor(private usersApiService: UsersApiService) {}

  ngOnInit(): void {}

  searchUsers(): void {
    this.usersApiService.getUsersByLocation(this.location).subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        alert('Something went wrong');
      }
    );
  }
}
