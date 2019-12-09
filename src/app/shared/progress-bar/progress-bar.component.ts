import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() color: string;
  @Input() mode: string;
  @Input() value: number;
  @Input() bufferValue: number;
  // color = 'accent';
  // mode = 'determinate';
  // value = 50;
  // bufferValue = 75;

  constructor() { }

  ngOnInit() {
  }

}
