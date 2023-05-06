import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {
  @Input() message!:string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

  ngOnInit(): void {
  }

}
