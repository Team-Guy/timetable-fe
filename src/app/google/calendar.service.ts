import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // Client ID and API key from the Developer Console
  clientID = '842499161640-o9r7ocra55ludlii18nr6dgdhi3l4517.apps.googleusercontent.com';
  clientSecret = 'x2mRuDz8pi29-SfwPgRF_S8J';
  apiKey = 'AIzaSyDrqXzozn_wHz0eoRzjmjtQapFkNq8ONRc';

  user: any;
  calendarItems: any[];

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.initClient();
    this.user = afAuth.authState;
    console.log('here');
    this.login().then(() => {
      this.getCalendar().then(() => {
        this.logout();
      });
    });
  }

  initClient() {
    gapi.load('client', () => {
      console.log('client library loaded');
      gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });
      gapi.client.load('calendar', 'v3', () => {
        console.log('loaded calendar');
      });
    });
  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    console.log(googleUser);

    const credential = auth.GoogleAuthProvider.credential(token);
    await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
  }

  async logout() {
    this.afAuth.auth.signOut();
  }

  async getCalendar() {
    const events = await gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    });

    console.log(events);
  }

}
