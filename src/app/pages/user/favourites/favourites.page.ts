import { forkJoin, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TheMovieDBService } from 'src/app/services/api/themoviedb.service';
import { FirestoreDBService } from 'src/app/services/firestore-db.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {
  favoritos: any[];
  detalleFavoritos: any[];
  itemLimit = 10;
  constructor(
    private navCtrl: NavController,
    private firestoreDB: FirestoreDBService,
    private service: TheMovieDBService,
    private alertCtrl: AlertController,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.getFavoritos();
  }

  refreshFavoritos() {
    this.getFavoritos();
  }

  getFavoritos() {
    return this.firestoreDB.getList('favoritos').then(movies => {
        this.favoritos = movies;
        console.log(movies);
        this.getDetailedFavoritos();
    });
  }

  getDetailedFavoritos() {
      this.detalleFavoritos = [];
      this.favoritos.forEach(id=>{
        this.service.getDetalleById('movie',id).subscribe(el=>{
          this.detalleFavoritos.push({
            id: el.id,
            title: el.title || el.name,
            description: el.overview,
            image: (el.backdrop_path || el.poster_path)?('http://image.tmdb.org/t/p/original/' +
            (el.backdrop_path || el.poster_path)):
            'https://www.delivery.sv/a/img/no-disponible.png',
            rating: el.vote_average,
            modelItem: el
          });
        });
      });
  }
  cardEventListener(modelItem){
    forkJoin(this.service.getDetalleById('movie',modelItem.id),
    this.service.getCreditosById('movie',modelItem.id),
    this.service.getVideosById('movie',modelItem.id)).
    subscribe(res=>{
      modelItem.detailResponse = res[0];
      modelItem.creditsResponse = res[1];
      modelItem.videos = res[2];
      this.modalService.presentModal(modelItem, 'movie');
    });
  }
  removeItemFromFavoritos(listLength: number, index: number,movieId: string,movieName: string ) {
      const indexToDel = listLength - index - 1;
      this.detalleFavoritos.splice(indexToDel, 1);
      // Eliminar de la watchlist
      this.firestoreDB.toggleFavoritosItem(movieId, false);
  }

  doRefresh(ionRefresh){
    this.refreshFavoritos();
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
