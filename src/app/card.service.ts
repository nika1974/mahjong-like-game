import { Injectable } from '@angular/core';
import { Card } from './types';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  selectedCardValue: BehaviorSubject<number>;

  matrixCards(): Observable<Card[]> {
    let validateObjOnDuplication = {};
    // storing already generated values in object to check
    // on duplication
    let cards: Card[] = [];
    let iterations = this.primesQuantityBetween(1, 50);

    for (let i = 0; i < iterations; i++) {
      if (Object.keys(validateObjOnDuplication).length === iterations) {
        break;
      }

      let randomNum = this.generateRandomCardValue();
      if (validateObjOnDuplication[randomNum]) {
        i = i-1;
        continue;
      }

      validateObjOnDuplication[randomNum] = randomNum;
      
      cards[i] = {
        value: randomNum,
        paired: false
      };
    }
    
    // array of cards are filled with prime numbers without pairs (half size)
    // here we concat array with its copy to double them and then shuffle
    cards = cards
        .concat(cards.map(item => Object.assign({}, item)))
        .sort(() => Math.random() - 0.5);
        
    return of(cards);
  }

  generateRandomCardValue(): number {
    let num = Math.floor((Math.random() * 50) + 1);
    while (!this.isPrime(num)) {
      num = Math.floor((Math.random() * 50) + 1);
    }
    
    return num;
  }

  isPrime(num: number): boolean {
    if (num === 1) return false;
    for (let i = 2; i <= Math.floor(num/2); i++) {
      if (num % i === 0) {
        return false;
      }
    }
    
    return true;
  }

  // how many prime numbers are between begin - end
  // to determine the length or cards array
  primesQuantityBetween(begin: number, end: number): number {
    let count = 0;
    for (let i = begin; i <= end; i++) {
      if (this.isPrime(i)) {
        count++;
      }
    }

    return count;
  }

  constructor() {
    this.selectedCardValue = new BehaviorSubject(-1);
  }
}
