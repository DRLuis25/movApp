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


  constructor(

  ) { }

  ngOnInit() {
  }

}
