import { Injectable } from '@angular/core';
import { Card } from './types';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  matrixCards(iteration: number): Observable<Card[]> {
    let cards: Card[] = [{
      value: 2,
      paired: false,
      index: 0
    }];

    for (let i = 3; i <= iteration; i++) {
      for (let j = 0; j < cards.length; j++) {
        if (i % cards[j].value === 0 && i !== cards[j].value) {
          break;
        }
        if (j === cards.length - 1) {
          cards.push({
            value: i,
            paired: false,
            index: cards[cards.length - 1].index + 1
          });
          break;
        }
      }
    }

    cards = cards
      .concat(cards.map(item => Object.assign({}, item)))
      .sort(() => Math.random() - 0.5);

    return of(cards);
  }

  constructor() {
  }
}
