import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { GameonlinePage } from './views/gameonline/gameonline.page';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  currentUser: any
  invitation: any

  constructor(
    private navctrl: NavController,
    public firestore: AngularFirestore,
    private alertCtrl: AlertController,
    private modale: ModalController,
    private service: FirebaseService
  ) {
    this.redirect()
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
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


  doc = this.firestore.collection('invitations');
  observer = this.doc.ref.onSnapshot((docSnapshot: any) => {
    docSnapshot.forEach((element: any) => {
      if (element.data().matriculeInvited === this.currentUser?.matricule) {
        this.invitation = element.data();
        localStorage.setItem('invitation', JSON.stringify(this.invitation))
        console.log(" Invitation ", element.data());
        this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '')
        this.showAlertCtrl()
      }else{
        console.log(" ========== Je n'ai pas été invité ========= : ", element.data());
        
      }
    });
  }, (err: any) => {
    console.log(`Erreur d'invitation : ${err}`);
  });

  async showAlertCtrl() {
    const alert = await this.alertCtrl.create({
      header: 'Invitation',
      subHeader: this.invitation.userName + ' vous invite a jouer une partie de NIM avec ' + this.invitation.batonet + ' batônets',
      buttons: [
        {
          text: 'Refuser',
          role: 'cancel',
          handler: () => { }
        },
        {
          text: 'Accepter',
          role: 'confirm',
          handler: async () => {
            const data = {
              idUser: this.currentUser.uid,
              response: 'oui'
            }
            this.service.setDocument('Responses/' + 'Response', data)
            const modale = await this.modale.create({
              component: GameonlinePage
            });
            await modale.present();
          }
        }
      ]
    })
    await alert.present()
  }

}
