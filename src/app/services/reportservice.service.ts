import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportserviceService {

  constructor(private http: HttpClient) { }

  public getallreportsurl:string = '/apiroutes/showrecords';
  public getallprojectnamesurl:string = '/apiroutes/GetProjectname';
  public getallemployernamesurl:string = '/apiroutes/GetEmployername';
  public searchbasedonurl:string = '/apiroutes/searchbasedoninputs';
  public todayrecordsonurl:string = '/apiroutes/Todayrecords';
  public projectmoduleurl:string = '/apiroutes/Getmodule';

  Getallreports(){
    return this.http.get(this.getallreportsurl);
  }

  Gettodayreports(){
    return this.http.get(this.todayrecordsonurl);
  }

  Getallprojectnames(){
    return this.http.get(this.getallprojectnamesurl);
  }

  Getallemployernames(){
    return this.http.get(this.getallemployernamesurl);
  }

  searchbasedoninputs(data){
    return this.http.post(this.searchbasedonurl,data);
  }

  Getprojectbasedmodule(data){
    return this.http.post(this.projectmoduleurl,data);
  }

}