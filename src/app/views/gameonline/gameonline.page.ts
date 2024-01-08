/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationController, ModalController } from '@ionic/angular';
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



  formVSplayer = new FormGroup({
    matricule: new FormControl(),
    bat: new FormControl(),
  });

  constructor(
    private animationCtrl: AnimationController,
    private modale: ModalController,
    public auth: FirebaseService
  ) {
    this.getId();
    this.openModal();
  }

  ngOnInit() {
  }

  getId() {
    this.auth.getProfile()
      .then((res) => {
        this.currentUserID = res?.uid
      })
  }


  nouveauJeu() {
    this.joueur = 'humain'; // Le joueur humain commence
    this.message = 'À vous de jouer!';
    for (let index = 0; index < this.pile; index++) {
      this.tabDisplay.push(index)
    }

    this.modalIsOpen = false
  }

  
  // Retirer un nombre d'objets de la pile
  retirer(nombre: number) {
    // Vérifier que le coup est valide
    if (this.pile >= nombre && nombre > 0 && nombre <= 3) {
      // Mettre à jour la pile
      this.pile -= nombre;
      this.nombreDuJoueurCourant = nombre
      for (let index = 0; index < this.nombreDuJoueurCourant; index++) {
        this.tabDisplay.pop()
      }
      // Changer de joueur
      if (this.joueur === 'humain') {
        this.joueur = 'systeme'
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
    return this.pile === 0;
  }












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
