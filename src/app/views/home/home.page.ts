import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationController, IonicModule, ModalController } from '@ionic/angular';
import { GamePage } from '../game/game.page';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GameonlinePage } from '../gameonline/gameonline.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule],

})
export class HomePage implements OnInit {

  modalIsOpen: boolean = false;
  bat: number = 20;
  constructor(
    private animationCtrl: AnimationController,
    private modale: ModalController,
  ) { }


  formVSplayer = new FormGroup({
    matricule: new FormControl(),
    bat: new FormControl(),
  });

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  async goToGame(elt: number) {
    if (elt == 0) {
      const modale = await this.modale.create({
        component: GamePage
      });
      await modale.present();
    }
    else {
      const modale = await this.modale.create({
        component: GameonlinePage
      });
      await modale.present();
    }
  }


  openModal() {
    this.modalIsOpen = true
  }

  closeModal() {
    this.modale.dismiss();
    this.modalIsOpen = false
  }


}
