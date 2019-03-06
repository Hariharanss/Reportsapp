import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportserviceService } from '../services/reportservice.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import { Alert } from 'selenium-webdriver';

declare var jQuery: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private _reportsservice: ReportserviceService, private spinner: NgxSpinnerService,public route: Router) { }

  reportsdata;
  reportslength = false;
  projectnames;
  employernames;
  totalhours = 0;
  totaldays = 0;
  noofdaysworked = 0;
  showfooter = false;
  projvalue;
  projectmodule;
  minutestaken = 0;
  type;

  //Pagination
  selectpages = '10';
  totalRec: number;
  page: number = 1;
  getitemperpage: number = 10;

  //Sorting
  key: string = 'ProjectName'; //set default
  reverse: boolean = false;

  ngOnInit() {
    this.spinner.show();
    this.getallreports();
    this.getallprojectname();
    this.getallemployername();
    jQuery("#projectname").val("").trigger("change"); 
    jQuery("#employeename").val("").trigger("change"); 
    
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
    
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

  changeprojectname(){
    var projectname = jQuery('#projectname').val();
    var obj = {'projectname':projectname}
    this._reportsservice.Getprojectbasedmodule(obj)
    .subscribe(success => {
      this.projectmodule = success;
      // console.log(success);
    }, error => {
    });
  }

  modulefilter(){
    var temp;
    var projectname = jQuery('#projectname').val();
    temp = projectname;
    if(temp == projectname){
      jQuery("#projectname").val('');
    }
  }

  modulefilter2(){
    var temp;
    var modulename = jQuery('#module').val();
    temp = modulename;
    if(temp == modulename){
      jQuery("#module").val('');
    }
  }

  modulefilter3(){
    var temp;
    var modulename = jQuery('#employeename').val();
    temp = modulename;
    if(temp == modulename){
      jQuery("#employeename").val('');
    }
  }


  Gettodayrecords(){
    this.reportsdata = [];
    this.showfooter = false;
    this.totalRec = 0;
    this.page;
    this.type = 'today';
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
    this.minutestaken = 0;
    this.totaldays = 0;
    this.totalRec = 0;
    this.page = 1;
    this.type = '';

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
        // this.noofdaysworked = temp[1];
        // this.noofdaysworked = this.noofdaysworked[0].Noofdays
        this.reportsdata = success;
        for (let i = 0; i < this.reportsdata.length; i++) {
          this.totalhours += this.reportsdata[i].hours;
        }

        for (let i = 0; i < this.reportsdata.length; i++) {
          this.minutestaken += this.reportsdata[i].minu;
        }

        this.totaldays = Math.round((this.totalhours / 8) + (this.minutestaken / 60));

        // for (let i = 0; i < this.reportsdata.length; i++) {
        //   this.totaldays++;
        // }
        
    
        this.totalRec = this.reportsdata.length;

        if(this.reportsdata == 0 || this.reportsdata <= 0 || this.reportsdata == null || this.reportsdata == undefined){
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

  public callreports(){

    var name = jQuery('#employeename').val();
    var projectname = jQuery('#projectname').val();
    var projmodule = jQuery('#module').val();
    var fromdate = jQuery('#fromdate').val();
    var todate = jQuery('#todate').val();

    var days = Math.round((this.totalhours / 8) + (this.minutestaken / 60));
    var hours = this.totalhours;
    var mins = this.minutestaken;
    var checktype = this.type;

    if(this.showfooter){ 
      window.open("http://210.18.177.213/Reports_a/Default.aspx?name="+name+"&projectname="+projectname+"&module="+projmodule+"&fromdate="+fromdate+"&todate="+todate+"&totalhours="+hours+"&totaldays="+days+"&totalmins="+mins+"&recordtype="+checktype+" ", "_self");
    }
    else{
      // days = 0,hours = 0,mins = 0;
      window.open("http://210.18.177.213/Reports_a/Default.aspx?name="+name+"&projectname="+projectname+"&module="+projmodule+"&fromdate="+fromdate+"&todate="+todate+"&totalhours="+hours+"&totaldays="+days+"&totalmins="+mins+"&recordtype="+checktype+" ", "_self");
    }

    }


  public downloadpdf() {
    console.log(this.reportsdata);
    if(this.reportsdata.length != 0){
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

    doc.save('Reports.pdf');
  }
  }

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  clearreportsform() {
    this.projectmodule = [];
    this.showfooter = false;
    this.totalhours = 0;
    this.noofdaysworked = 0;
    this.page = 1;
    jQuery('#fromdate').val('');
    jQuery('#todate').val('');
    jQuery("#projectname").val("").trigger("change"); 
    jQuery('#module').val('');
    jQuery("#employeename").val("").trigger("change"); 
    this.getallreports();
  }

}
