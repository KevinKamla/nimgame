import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private navctrl: NavController
  ) {
    this.redirect()
  }

  redirect() {
    if (!this.isLogger()) {
      this.navctrl.navigateRoot('firstpage')
    }
  }

  isLogger() {
    let login = localStorage.getItem("log") || ''
    return true && login === 'oui'
  }
}
