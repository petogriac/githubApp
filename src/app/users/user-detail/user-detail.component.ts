import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '../users.api.service';
import IUser from '../interfaces/IUser';
import { zip } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  username: string;
  user: IUser;
  isLoading: boolean;
  isLoadingAdditional: boolean;
  loggedUser: boolean;
  repos = new Array<any>();
  followers = new Array<any>();
  displayedReposColumns: string[] = ['name', 'description'];
  displayedFollowersColumns: string[] = ['avatar_url', 'login'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersApiService: UsersApiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.username = params.username;
      this.isLoading = true;
      this.usersApiService.getUser(this.username).subscribe(
        (response) => {
          this.user = response;
          this.isLoading = false;
          this.getAdditionalInfo();
        },
        (error) => {
          alert('something went wrong');
          this.isLoading = false;
        }
      );
    });
  }

  onFollowerClick(user: IUser): void {
    this.router.navigate([`/user/${user.login}`]);
  }

  private getAdditionalInfo(): void {
    this.isLoadingAdditional = true;
    zip(
      this.usersApiService.getUserPublicRepos(this.username),
      this.usersApiService.getUserFollowers(this.username)
    ).subscribe(([repos, followers]) => {
      this.repos = repos;
      this.followers = followers;
      this.isLoadingAdditional = false;
    });
  }
}
