import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../types';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-5px)' }),
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
export class CardComponent implements OnInit {

  @Input() card: Card;
  constructor() { }

  ngOnInit() {
  }

}
