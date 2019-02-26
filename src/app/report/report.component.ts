import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportserviceService } from '../services/reportservice.service';
import { NgForm } from '@angular/forms';
import { Content } from '@angular/compiler/src/render3/r3_ast';

import * as jsPDF from 'jspdf';

declare var jQuery: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private _reportsservice: ReportserviceService) { }

  reportsdata;
  reportslength = false;
  projectnames;
  employernames;
  totalhours = 0;
  noofdaysworked = 0;
  showfooter = false;

  //Pagination
  selectpages = '10';
  totalRec: number;
  page: number = 1;
  getitemperpage: number = 10;

  //Sorting
  key: string = 'ProjectName'; //set default
  reverse: boolean = false;

  ngOnInit() {
    this.getallreports();
    this.getallprojectname();
    this.getallemployername();
  }

  getallreports() {
    this.reportslength = false;
    this._reportsservice.Getallreports()
      .subscribe(success => {
        this.reportsdata = success;
        this.totalRec = this.reportsdata.length;

        if(this.totalRec == 0 || this.totalRec <= 0){
          this.reportslength = false;
        } else{
          this.reportslength = true;
        }

        // console.log(success);
      }, error => {
      });
  }

  getallprojectname() {
    this._reportsservice.Getallprojectnames()
      .subscribe(success => {
        this.projectnames = success;
        // console.log(success);
      }, error => {
      });
  }

  Gettodayrecords(){
    this.reportsdata = [];
    this.showfooter = false;
    this.totalRec = 0;
    this.page;
    this._reportsservice.Gettodayreports()
      .subscribe(success => {
        this.reportsdata = success;
        this.totalRec = this.reportsdata.length;
        if(this.reportsdata == 0 || this.reportsdata <= 0 || this.reportsdata == null || this.reportsdata == undefined){
          this.reportslength = false;
        } else{
          this.reportslength = true;
        }

      }, error => {
      });
  }

  getallemployername() {
    this._reportsservice.Getallemployernames()
      .subscribe(success => {
        this.employernames = success;
        // console.log(success);
      }, error => {
      });
  }

  reportsform(formvalues, reportsformvalid) {

    this.reportsdata = [];
    this.reportslength = false;
    this.showfooter = true;
    this.totalhours = 0;
    this.noofdaysworked = 0;
    this.totalRec = 0;
    this.page;

    console.log(reportsformvalid);

    var project = jQuery('#projectname').val();
    var projectmodule = jQuery('#module').val();
    var fromdate = jQuery('#fromdate').val();
    var todate = jQuery('#todate').val();
    var employeename = jQuery('#employeename').val();

    var data = { 'Projectname': project, 'Module': projectmodule, 'Fromdate': fromdate, 'Todate': todate, 'Employername': employeename };

    console.log(data);

    if(project != '' || employeename != ''){
          this.showfooter = true;
    }else{
      this.showfooter = false;
    }

    this._reportsservice.searchbasedoninputs(data)
      .subscribe(success => {
        // console.log(success);
        var temp = success;
        this.noofdaysworked = temp[1];
        this.noofdaysworked = this.noofdaysworked[0].Noofdays
        this.reportsdata = temp[0];
        for (let i = 0; i < this.reportsdata.length; i++) {
          this.totalhours += this.reportsdata[i].hours;
        }
    
        this.totalRec = this.reportsdata.length;

        if(temp == 0 || temp <= 0 || temp == null || temp == undefined){
          this.reportslength = false;
        } else{
          this.reportslength = true;
        }

      }, error => {
      });

  }

  pagesitemschange(getpages) {
    console.log(getpages);
    this.getitemperpage = getpages;
  }

  @ViewChild('content') content: ElementRef;

  public downloadpdf() {

    alert('Exporting as Pdf');

    // var pdf = new jsPDF('p','pt','a4');
    //   //var source = document.getElementById('table-container').innerHTML;
    //   console.log(document.getElementById('reporttable'));
    //   var margins = {
    //     top: 25,
    //     bottom: 60,
    //     left: 20,
    //     width: 522
    //   };
    //   // all coords and widths are in jsPDF instance's declared units
    //   // 'inches' in this case
    // pdf.text(20, 20, 'Hello world.');
    //  pdf.addHTML(document.body, margins.top, margins.left, {}, function() {
    //    pdf.save('test.pdf');
    //  });


    let doc = new jsPDF('p', 'pt', 'a1');

    let specialelementhandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML, 230, 15, {
      // 'width': 500,
      'elementHandlers': specialelementhandlers
    });

    doc.save('test.pdf');

  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  clearreportsform() {
    this.showfooter = false;
    this.totalhours = 0;
    this.noofdaysworked = 0;
    jQuery('#fromdate').val('');
    jQuery('#todate').val('');
    jQuery('#projectname').val('');
    jQuery('#module').val('');
    jQuery('#employeename').val('');
    this.getallreports();
  }

}
