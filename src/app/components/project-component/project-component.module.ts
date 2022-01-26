import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { SliderComponent } from '../slider/slider.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab1Page } from 'src/app/tab1/tab1.page';
import { ModalPageComponent } from '../modal-page/modal-page.component';
import { ModalReviewComponent } from '../modal-review/modal-review.component';

@NgModule({
  declarations: [
    CardComponent,
    SliderComponent,
    ModalPageComponent,
    ModalReviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [CardComponent,
    SliderComponent,
    ModalPageComponent,
    ModalReviewComponent]
})
export class ProjectComponentModule {}
