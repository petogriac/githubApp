import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

const storageTokenKey = 'githubToken';

@Injectable()
export class AuthService implements OnDestroy {
    token: string;
    signedIn: Observable<any>;
    subscription: Subscription;

    private authUserSubj: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public readonly authUser: Observable<any> = this.authUserSubj.asObservable();

    constructor(private afAuth: AngularFireAuth) {
        this.subscription = this.afAuth.authState.subscribe(response => {
            if (response) {
                this.authUserSubj.next({
                    name: response.displayName,
                    authenticated: true
                });
            } else {
                this.authUserSubj.next({ name: '', authenticated: false });
            }
        });
        if (localStorage.getItem(storageTokenKey)) {
            this.token = sessionStorage.getItem(storageTokenKey);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    async signIn() {
        const provider = new auth.GithubAuthProvider();
        provider.addScope('repo');
        this.afAuth.signInWithPopup(provider).then(response => {
            this.token = response.credential['accessToken'];
            sessionStorage.setItem(storageTokenKey, this.token);
        });
    }

    async signOut() {
        try {
            await this.afAuth.signOut();
            this.token = null;
            sessionStorage.removeItem(storageTokenKey);
        } catch (error) {
            console.log('Sign out failed', error);
        }
    }
}
