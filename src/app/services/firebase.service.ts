import { Injectable } from '@angular/core';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, setDoc, } from '@angular/fire/firestore';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    public fireAuth: AngularFireAuth,
    public firestore: AngularFirestore,
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

  docRef(path: string) {
    return this.firestore.doc(path).ref;
  }

  setDocument(path: string, data: DocumentData) {
    const dataRef = this.docRef(path);
    return dataRef.set(data);
  }

  getData(collection:string, userId: string) {
    return this.firestore.collection(collection).doc(userId);
  }

}

