import { Injectable } from '@angular/core';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, setDoc,  } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    public fireAuth: AngularFireAuth,
    // public firestore: Firestore,
  ) { }

  async registerUser(matricule: string, password: string) {
    return await this.fireAuth.createUserWithEmailAndPassword(matricule, password)
  }

  async loginUser(matricule: string, password: string) {
    return await this.fireAuth.signInWithEmailAndPassword(matricule, password)
  }

  async signOut() {
    return await this.fireAuth.signOut()
  }

  async getProfile() {
    return await this.fireAuth.currentUser
  }

  // docRef(path: any) {
  //   return doc(this.firestore, path)
  // }

  // setDocument(path: any, data: any) {
  //   const dataref = this.docRef(path)
  //   return setDoc(dataref, data);
  // }
}

