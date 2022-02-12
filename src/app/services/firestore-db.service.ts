import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Comentario } from '../models/comentario.model';
import { AuthAngularFireService } from './auth-angular-fire.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreDBService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AuthAngularFireService
  ) { }

  agregarComentarioById(id: string, comentario: Comentario){
    this.getComentariosById(id).then(reviewsArray => {
      reviewsArray.unshift(comentario);
      this.firestore.doc('peliculas/' + id)
      .set({comentarios: reviewsArray},
        { merge: true }
      );
  });
  }

  getComentariosById(id: string){
    return new Promise<Comentario[]>((resolve, reject) => {
      this.firestore
          .collection('peliculas')
          .doc(id.toString())
          .ref.get()
          .then((doc: any) => {
              if (doc.exists) {
                  resolve(doc.data().comentarios || []);
              } else {
                  resolve([]); // Devuelve array vacio
              }
          })
          .catch((error) => {
              reject('Error al obtener el documento: ' + error);
          });
  });
  }

  toggleWatchListItem(id: number, add: boolean) {
    const userId = '1';//this.auth.getUserID();

    this.getList('watchlist').then(watchlist => {
        let filteredWatchlist: number[];
        if (!add && watchlist.indexOf(id) !== -1) {
            filteredWatchlist = watchlist;
            // Eliminar id de la watchlist.
            filteredWatchlist.splice(filteredWatchlist.indexOf(id), 1);
        } else if (add) {
            const dirtyWatchlist = [...watchlist, id];
            filteredWatchlist = Array.from(new Set(dirtyWatchlist));
        } else {
            console.log('Error actualizando la Watchlist');
        }
        this.firestore.doc(`users/${userId}`).set(
            {
                userId,
                watchlist: filteredWatchlist
            },
            { merge: true }
        );
    });
  }

  toggleFavoritosItem(id: string, add: boolean) {
      const userId = this.auth.getUserID();

      this.getList('favoritos').then(favoritos => {
          let filteredFavoritoslist: string[];
          if (!add && favoritos.indexOf(id) !== -1) {
              filteredFavoritoslist = favoritos;
              filteredFavoritoslist.splice(favoritos.indexOf(id), 1);
          } else if (add) {
              const dirtyfavoritoslist = [...favoritos, id];
              filteredFavoritoslist = Array.from(
                  new Set(dirtyfavoritoslist)
              );
          } else {
              console.log('Error ');
              return;
          }

          this.firestore.doc(`users/${userId}`).set(
              {
                  userId,
                  favoritos: filteredFavoritoslist
              },
              { merge: true } // Merge document if it already exists
          );
      });
  }

  getList(tipo: string) {
      return new Promise<any[]>((resolve, reject) => {
          this.firestore
              .collection('users')
              .doc(this.auth.getUserID())
              .ref.get()
              .then((doc: any)=> {
                  if (doc.exists) {
                      if (tipo === 'watchlist') {
                          resolve(doc.data().watchlist || []);
                      } else if (tipo === 'favoritos') {
                          console.log('Lista de favs');
                          resolve(doc.data().favoritos || []);
                      } else {
                          reject('Tipo de lista invalido');
                      }
                  } else {
                      resolve([]);//No encontrado
                  }
              })
              .catch((error)=> {
                  reject('Error al obtener la información: ' + error);
              });
      });
  }
}
