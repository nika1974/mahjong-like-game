import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from '../card.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from '../types';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-3px)' }),
          stagger(
            '50ms',
            animate('300ms ease-in',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          )
        ], { optional: true }),
        query(':leave',
          [animate('300ms',
            style({ opacity:0, transform: 'rotate(90deg)'}))],
              { optional: true }
        )
      ])
    ])
  ]
})
export class TableComponent implements OnInit, OnDestroy {

  cards$: Subscription;
  cards: Card[];
  selectedCard: Card;
  clicksNotAvailable: Boolean;
  showCardsToObserve: Boolean = true;
  
  constructor(
    private cardService: CardService
  ) { }

  ngOnInit() {
    this.cards$ = this.cardService.matrixCards().pipe(map(result => {
      return result.map((item, index) => {
        return {
          index: index,
          value: item.value,
          paired: item.paired
        }
      });
    })).subscribe(result => {
      this.cards = result;

      setTimeout(() => {
        this.showCardsToObserve = false;
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    this.cards$.unsubscribe();
  }

  handleCardClick(card: Card) {
    if (this.showCardsToObserve || this.clicksNotAvailable || 
      (this.selectedCard && this.selectedCard.index === card.index) || card.paired) {
      return;
    }

    card.paired = true;
    
    if (this.selectedCard) {
      if (card.value !== this.selectedCard.value) {
        this.clicksNotAvailable = true;
        setTimeout(() => {
          this.cards.some(item => {
            if (item.index === this.selectedCard.index) {
              item.paired = false;
              return;
            }
          });
          
          this.selectedCard = null;
          card.paired = false;
          this.clicksNotAvailable = false;
        }, 1500);
      } else {
        this.selectedCard = null;
      }
    } else {
      this.selectedCard = card;
    }
  }

}