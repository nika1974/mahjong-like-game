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
            style({ opacity: 0, transform: 'rotate(90deg)' }))],
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
  clicksNotAvailable: boolean;
  showCardsToObserve: boolean = true;
  progressValue = 0;
  progressValueInNumbers = 0;

  constructor(
    private cardService: CardService
  ) { }

  ngOnInit() {
    this.cardService.matrixCards(50).pipe(map(result => {
      return result.map((item, index) => {
        return {
          index,
          value: item.value,
          paired: item.paired
        };
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
    // ignore click if 1.observation phase or 2.phase after swong card pair or
    // 3.clicks on the flipped card 4.card is paired
    if (this.showCardsToObserve || this.clicksNotAvailable || card.paired) {
      return;
    }
    debugger;
    // card becomes paired even for some time
    card.paired = true;

    if (this.selectedCard) {
      if (card.value !== this.selectedCard.value) {
        this.clicksNotAvailable = true;
        setTimeout(() => {
          this.cards.some(item => {
            // check if there is a way doing it w/o index
            if (item.index === this.selectedCard.index) {
              item.paired = false;
              return false;
            }
          });

          this.selectedCard = null;
          card.paired = false;
          this.clicksNotAvailable = false;
        }, 1000);
      } else {
        this.progressValue += 100 / (this.cards.length / 2);
        this.progressValueInNumbers++;
        this.selectedCard = null;
      }
    } else {
      this.selectedCard = card;
    }
  }

  restartGame() {
    // this.cards$.next();
  }

}
