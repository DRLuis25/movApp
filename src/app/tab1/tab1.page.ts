import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TheMovieDBService } from '../services/api/themoviedb.service';
import { AuthAngularFireService } from '../services/auth-angular-fire.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  modelType = 'movie';
  sliderContainer: any = [];
  generosList: any = [];
  page: number;
  generoSelectedValue: any;
  generoSelectedId: string;
  appCardContainer: any = [];
  loadingCurrentEventData: any;
  constructor(
    private service: TheMovieDBService,
    private modalService: ModalService,
    private auth2: AuthAngularFireService
  ) {}
  ngOnInit(): void {
    this.initSliderList();
    this.initGenerosList();
    this.initPopularList();
    //this.auth2.login({email: 'admin@gmail.com', password: 'password'});
    //this.auth2.registro({email: 'admin2@gmail.com', password: 'password2'});

  }
  initSliderList(): void {
    this.service.getTrendingList(this.modelType).
    subscribe(res =>{
      res.results.forEach(el => {
        this.sliderContainer.push({
          id: el.id,
          title: el.title,
          image: ('http://image.tmdb.org/t/p/original' + el.backdrop_path),
          posterPath: ('http://image.tmdb.org/t/p/original' + el.poster_path),
          modelItem: el
        });
      });
    });
  }
  initGenerosList(){
    this.service.getGeneros(this.modelType).subscribe(res => {
      res.genres.forEach(el => this.generosList.push(el));
    });
  }
  genSelectChange(e){
    const generoVal = e.detail.value;
    if (generoVal.length > 0 || this.generoSelectedId != null) {
      this.page = 1;
      this.appCardContainer = [];
      this.generoSelectedId = generoVal.toString();
      this.fillPopulares();
    }
  };
  initPopularList(){
    this.page = 1;
    this.generoSelectedId = '';
    this.fillPopulares();
  }
  fillPopulares(){
    this.service.getPopulares(this.modelType, this.page, this.generoSelectedId).subscribe(res => {
      res.results.forEach(el =>{
        this.appCardContainer.push({
          id: el.id,
          title: el.title,
          description: el.overview,
          image: (el.backdrop_path || el.poster_path)?('http://image.tmdb.org/t/p/original/' +
          (el.backdrop_path || el.poster_path)):
          'https://www.delivery.sv/a/img/no-disponible.png',
          rating: el.vote_average,
          modelItem: el
        });
      });
      if (this.page>1) {
        this.loadingCurrentEventData.target.complete();
        if(res.results.length === 0) {
          this.loadingCurrentEventData.target.disabled = true;
        }
      }
    });
  }
  loadData(e){
    this.page += 1;
    this.loadingCurrentEventData = e;
    this.fillPopulares();
  }
  cardEventListener(modelItem){
    forkJoin(this.service.getDetalleById(this.modelType,modelItem.id),
    this.service.getCreditosById(this.modelType,modelItem.id),
    this.service.getVideosById(this.modelType,modelItem.id)).
    subscribe(res=>{
      modelItem.detailResponse = res[0];
      modelItem.creditsResponse = res[1];
      modelItem.videos = res[2];
      this.modalService.presentModal(modelItem, this.modelType);
    });
  }
}
