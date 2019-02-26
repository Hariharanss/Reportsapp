import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }
  title = 'Reportsapp';
  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 1 seconds */
      this.spinner.hide();
    }, 1000);
  }

}
