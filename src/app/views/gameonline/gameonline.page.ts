/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationController, LoadingController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-gameonline',
  templateUrl: './gameonline.page.html',
  styleUrls: ['./gameonline.page.scss'],
})

export class GameonlinePage implements OnInit {

  tabDisplay: any[] = []
  pile: number = 20;
  joueur: string = '';
  nameGamer: string = '';
  message: string = '';
  modalIsOpen: boolean = false;
  nombreDuJoueurCourant = 0;
  displayNbOfCurrentMove = false;
  matricule = '';
  currentUserID: any
  currentUser: any
  displayNbSystem = false
  invitation: any
  responseInvited = false;


  formVSplayer = new FormGroup({
    matricule: new FormControl(),
    bat: new FormControl(),
  });

  constructor(
    private animationCtrl: AnimationController,
    private modale: ModalController,
    public service: FirebaseService,
    private loadctrl: LoadingController,
    public firestore: AngularFirestore,
  ) {
    this.getId();
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
    let valInvit = JSON.parse(localStorage.getItem('invitation') || '1')
    this.invitation = valInvit
    if (valInvit?.matriculeInvited != this.currentUser.matricule) {
      this.openModal();
    }
  }


  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userCurrent') || '1')
    console.log("currentUser : ", this.currentUser);

  }

  async getId() {
    await this.service.getProfile()
      .then((res) => {
        this.currentUserID = res?.uid
      })
  }


  async nouveauJeu() {
    const loading = await this.loadctrl.create()
    await loading.present();
    this.sendInvitation(this.currentUser.uid, this.matricule, this.pile)
    this.joueur = 'humain'; // Le joueur humain commence
    this.message = 'À vous de jouer!';
    for (let index = 0; index < this.pile; index++) {
      this.tabDisplay.push(index)
    }
    if (this.responseInvited) {
      loading.dismiss();
      this.modalIsOpen = false
    }
  }

  sendInvitation(idUser: string, matricule: string, pile: number) {
    const data = {
      idAutor: idUser,
      userName: this.currentUser.prenom,
      matriculeInvited: matricule,
      batonet: pile,
    }
    const batonet = { batonet: data.batonet }
    this.service.setDocument('invitations/' + 'invitation' + idUser, data)
    this.service.setDocument('GameParty/' + this.currentUserID, batonet)
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(30).substring(1, 9).toUpperCase();
    const formattedDate = date.getFullYear().toString()
    return formattedDate + randomId
  }

  // Retirer un nombre d'objets de la pile
  retirer(nombre: number) {
    // Vérifier que le coup est valide
    if (this.pile >= nombre && nombre > 0 && nombre <= 3) {
      // Mettre à jour la pile
      this.pile -= nombre;
      let date = new Date();
      let batonet = {
        idParty: this.generateUniqueId(date),
        batonet: this.pile
      }
      this.service.setDocument('GameParty/' + this.currentUserID, batonet)
      this.nombreDuJoueurCourant = nombre
      for (let index = 0; index < this.nombreDuJoueurCourant; index++) {
        this.tabDisplay.pop()
      }
      // Changer de joueur
      if (this.joueur === 'humain') {
        this.joueur = 'adversaire'
      } else {
        this.joueur = 'humain'
      }
      // Vérifier si le jeu est terminé
      if (this.estTermine()) {
        // Afficher le message de victoire
        this.message = this.joueur === 'humain' ? 'Vous avez gagné!' : 'Vous avez perdu!';
      } else {
        // Afficher le message de tour
        this.message = this.joueur === 'humain' ? 'À vous de jouer!' : '';
        this.nameGamer = this.joueur === 'humain' ? 'Votre ami a rétiré' : 'Vous avez rétiré';
      }
    }
  }

  estTermine() {
    // Le jeu est terminé si la pile est vide
    localStorage.removeItem('invitation')

    return this.pile === 0;
  }


  doc = this.firestore.collection('Responses').doc('Response');
  observer = this.doc.ref.onSnapshot((docSnapshot: any) => {
    if (docSnapshot.data()?.idUser === this.invitation?.matriculeInvited) {
      if (docSnapshot.data()?.response === 'oui') {
        this.responseInvited = true
      }
    }
  }, (err: any) => {
    console.log(`Erreur d'invitation : ${err}`);
  });









  nbBatSubs() {
    if (this.pile > 20) {
      this.pile--
    }
  }

  nbBatAdd() {
    this.pile++
  }

  openModal() {
    this.pile = 20;
    this.modalIsOpen = true
  }

  closeModal() {
    this.modalIsOpen = false
    this.modale.dismiss();
  }


  //======================= ANIMATION ========================

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

}
