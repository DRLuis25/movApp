import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Comentario } from 'src/app/models/comentario.model';
import { FirestoreDBService } from 'src/app/services/firestore-db.service';

@Component({
  selector: 'app-modal-review',
  templateUrl: './modal-review.component.html',
  styleUrls: ['./modal-review.component.scss'],
})
export class ModalReviewComponent implements OnInit {

  @Input() movieId: string;
  @Input() movieName: string;
  review = {
    username: 'Luis'
  } as Comentario;
  constructor(
    private firestoreDB: FirestoreDBService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  async submitReview(review: Comentario) {
    if (!review.username || !review.valoracion || !review.comentario) {
      const alert = await this.alertCtrl.create({
        message: 'Error al registrar',
        buttons: ['OK']
      });
      alert.present();
        return;
    }
    review.fecha = new Date().toISOString();
    this.firestoreDB.agregarComentarioById(this.movieId, review);
    const toast =  await this.toastCtrl.create({
      message: 'Comentario añadido con éxito - Deslice hacia abajo para actualizar!',
      duration: 2000,
      color: 'dark'
    });
    await toast.present();
    this.closeReviewModal();
  }

    closeReviewModal() {
      this.modalCtrl.dismiss();
  }
}
