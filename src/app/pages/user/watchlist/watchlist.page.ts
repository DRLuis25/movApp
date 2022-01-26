import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { FirestoreDBService } from 'src/app/services/firestore-db.service';
import { TheMovieDBService } from 'src/app/services/api/themoviedb.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.page.html',
  styleUrls: ['./watchlist.page.scss'],
})
export class WatchlistPage implements OnInit {

  favoritos: any[];
  detalleFavoritos: Observable<any>[];
  itemLimit = 10;
  constructor(
    private navCtrl: NavController,
    private firestoreDB: FirestoreDBService,
    private service: TheMovieDBService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  refreshFavourites() {
    this.getFavourites().then(() => {
        this.getDetailedFavourites();
    });
  }

  getFavourites() {
    return this.firestoreDB.getList('favourites').then(movies => {
        this.favoritos = movies;
    });
  }

  getDetailedFavourites() {
      this.detalleFavoritos = [];
      // Display backwards later to show recently watched first.
      /*for (let i = 0; i < this.favoritos.length; i++) {
          this.detalleFavoritos.push(
              this.service.getDetalleById('movie',this.favoritos[i])
          );
      }*/
  }

  openMovieDetail(movieId: string) {
      /*this.navCtrl.push(MovieDetailPage, {
          movieObservable: this.movieDbProvider.getMovieDetail(movieId),
          movieCastObservable: this.movieDbProvider.getMovieCredits(movieId),
          movieId
      });*/
  }

  removeItemFromFavourites(listLength: number, index: number,movieId: number,movieName: string ) {
      const indexToDel = listLength - index - 1;
      this.detalleFavoritos.splice(indexToDel, 1);
      // Eliminar de la watchlist
      this.firestoreDB.toggleFavoritosItem(movieId, false);
  }

  doRefresh(ionRefresh){
    this.refreshFavourites();
    setTimeout(() => {
      console.log('Comentarios actualizado');
      ionRefresh.target.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll, totalItems) {
      if (this.itemLimit > totalItems) {
          infiniteScroll.complete();
          return;
      }
      setTimeout(() => {
          this.itemLimit += 6;
          console.log('Async operation has ended');
          infiniteScroll.complete();
      }, 1000);
  }

}
