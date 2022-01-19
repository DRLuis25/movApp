import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { TheMovieDBService } from 'src/app/services/api/themoviedb.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.component.html',
  styleUrls: ['./modal-page.component.scss'],
})
export class ModalPageComponent implements OnInit {
  @Input() modelItemList: any;
  @Input() modelType: any;

  isLoading: boolean;
  id: string;
  titulo: string;
  bgImage: string;
  lanzamiento: string;
  descripcion: string;
  elencoItemList: any = [];
  equipoItemList: any = [];
  duracion: string;
  valoracion: any;
  appRecommendationsContainer: any = [];
  isVideoEnabled: boolean;
  dangerousVideoUrl: string;
  videoUrl: any;
  constructor(
    private service: TheMovieDBService,
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.initContainer();
  }
  initContainer(){
    this.isLoading = true;
    const detail = this.modelItemList.detailResponse;
    const creditos = this.modelItemList.creditsResponse;
    const videos = this.modelItemList.videos;
    //console.log(detail, creditos, videos);
    this.titulo = this.modelType==='movie'?detail.title:detail.name;
    this.id = detail.id;
    this.bgImage = detail.backdrop_path?('http://image.tmdb.org/t/p/original/' + detail.backdrop_path):null;
    this.descripcion = detail.overview;
    this.lanzamiento = detail.release_date;
    this.duracion = detail.runtime;
    this.valoracion = detail.vote_average;
    creditos.cast.forEach(el => {
      if (el.profile_path) {
        el.profile_path = 'https://www.themoviedb.org/t/p/w138_and_h175_face/' + el.profile_path;
      }
      this.elencoItemList.push(el);
    });
    creditos.crew.forEach(el => {
      if (el.profile_path) {
        el.profile_path = 'https://www.themoviedb.org/t/p/w138_and_h175_face/' + el.profile_path;
      }
      this.equipoItemList.push(el);
    });
    if (this.modelItemList.videos.results.length > 0) {
      this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + this.modelItemList.videos.results[0].key;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
    }
    this.initRecomendaciones();
    this.isLoading = false;
  }
  closeModal(){
    this.modalService.closeModal();
  }
  playVideo(){
    this.isVideoEnabled = true;
  }
  initRecomendaciones(){
    this.service.getRecomendacionesById(this.modelType, this.id).subscribe(res => {
      res.results.forEach(el => {
        this.appRecommendationsContainer.push({
          id: el.id,
          title: this.modelType==='movie'?el.title:el.name,
          description: el.overview,
          image: (el.backdrop_path || el.poster_path)?('http://image.tmdb.org/t/p/original/' +
          (el.backdrop_path || el.poster_path)):
          'https://www.delivery.sv/a/img/no-disponible.png',
          rating: el.vote_average,
          modelItem: el
        });
      });
      this.isLoading = false;
    });
  }
  cardEventListener(modelItem){
    this.isVideoEnabled = false;
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
