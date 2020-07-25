import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '../users.api.service';
import IUser from '../interfaces/IUser';
import { zip } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

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
  isProfile: boolean;
  repos = new Array<any>();
  followers = new Array<any>();
  issues = new Array<any>();
  displayedReposColumns: string[] = ['name', 'description'];
  displayedFollowersColumns: string[] = ['avatar_url', 'login'];
  displayedIssuesColumns: string[] = ['title', 'link'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersApiService: UsersApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isLoading = true;
      if (params && params.username) {
        this.isProfile = false;
        this.username = params.username;
        this.usersApiService.getUserByUsername(this.username).subscribe(
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
      } else {
        this.isProfile = true;
        this.usersApiService.getAuthUser().subscribe(
          (response) => {
            this.user = response;
            this.username = response.login;
            this.getAdditionalInfo();
            this.isLoading = false;
          },
          (error) => {
            alert('something went wrong');
            this.isLoading = false;
          }
        );
      }
    });
  }

  onFollowerClick(user: IUser): void {
    this.router.navigate([`/user/${user.login}`]);
  }

  private getAdditionalInfo(): void {
    this.isLoadingAdditional = true;
    const zippedApis = [
      this.usersApiService.getUserPublicRepos(this.username),
      this.usersApiService.getUserFollowers(this.username),
    ];
    if (this.isProfile) {
      zippedApis.push(this.usersApiService.getUserIssues());
    }
    zip(...zippedApis).subscribe(([repos, followers, issues]) => {
      this.repos = repos;
      this.followers = followers;
      if (issues) {
        this.issues = issues;
        console.log(this.issues);
      }
      this.isLoadingAdditional = false;
    });
  }
}
