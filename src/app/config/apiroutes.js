var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());

var db = require('./dbconnection');

var request = new db.Request();


// Get all Project name
router.get('/GetProjectname', function (req, res) {
    var query = "SELECT distinct project_name as ProjectName FROM ProjectMaster.dbo.Dailysheet order by ProjectName asc;";
    // console.log(query);
    request.query(query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.send(rows.recordset);
        }
    });
});

// Get all Employer name
router.get('/GetEmployername', function (req, res) {
    var query = "SELECT distinct Cre_by as EmployeeName FROM ProjectMaster.dbo.Dailysheet order by EmployeeName asc;";
    // console.log(query);
    request.query(query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.send(rows.recordset);
        }
    });
});

// Get Module based on Project search
router.post('/Getmodule', function (req, res) {
    var projectname = req.body.projectname;
    // console.log(req.body);
    var query = "SELECT distinct Pro_module as module FROM ProjectMaster.dbo.Dailysheet where project_name = '"+projectname+"' order by module asc ;";
    //   console.log(query);
    request.query(query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.send(rows.recordset);
        }
    });
});

//Get all Reports record
router.get('/showrecords', function (req, res) {
    var query = "SELECT top 100 project_name as ProjectName, Pro_module as Module, Date as WorkingDate, Dailysheet_infor as Description, Cre_by as EmployeeName, [hours],[minu] FROM [ProjectMaster].[dbo].[Dailysheet] order by WorkingDate desc";
    // console.log(query);
    request.query(query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.send(rows.recordset);
        }
    });
});

//Get Today Reports record
router.get('/Todayrecords', function (req, res) {
    var query = "select project_name as ProjectName, Pro_module as Module, Date as WorkingDate, Dailysheet_infor as Description, Cre_by as EmployeeName, [hours],[minu] from ProjectMaster.dbo.Dailysheet where Date = cast(getdate() as Date) order by WorkingDate asc;";
    //  console.log(query);
    request.query(query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.send(rows.recordset);
        }
    });
});


//Get Reports based on record
router.post('/searchbasedoninputs', function (req, res) {
    var projectname = (req.body.Projectname != '' && req.body.Projectname != undefined ? req.body.Projectname : '');
    var projectmodule = (req.body.Module != ''  && req.body.Module != undefined ? req.body.Module : '');
    var developername = (req.body.Employername != '' ? req.body.Employername : '');
    var fromdate = (req.body.Fromdate != '' ? req.body.Fromdate : '');
    var todate = (req.body.Todate != '' ? req.body.Todate : '');

    fromdate = fromdate.split("-").reverse().join("-");

    todate = todate.split("-").reverse().join("-");     

    if (projectname == '' && projectmodule == '' && developername == '' && fromdate == '' && todate == '') {
        request.query('SELECT top 100 project_name as ProjectName, Pro_module as Module, Date as WorkingDate, Dailysheet_infor as Description, Cre_by as EmployeeName, [hours],[minu] FROM [ProjectMaster].[dbo].[Dailysheet] order by WorkingDate desc', function (err, rows) {
            if (err) {
                res.status(400).json(err);
            } else {
                res.send(rows.recordset);
            }
        });
    }
    else{

    var query = " SearchDailysheet '"+projectname+"','"+projectmodule+"','"+developername+"','"+fromdate+"','"+todate+"' ";

    // var query = " select * from ProjectManagent.dbo.Dailysheet where (project_name = '"+prjectname+"' or project_name = '') and (Cre_by = '"+developername+"' or Cre_by = '') and (pro_module = '"+projectmodule+"' or pro_module = '') and date between convert(date,'"+fromdate+"',105) and convert(date,'"+todate+"',105) ";

    // console.log(query);
    
    request.query(query, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            if(rows.recordset.length != 0){
                // console.log('fdsfds');
                var recordlength = rows.recordset.length;
                var fromdate = new Date(rows.recordset[0].WorkingDate).toISOString();
                var todate = new Date(rows.recordset[recordlength-1].WorkingDate).toISOString();
               
                // console.log(fromdate);
                // console.log(todate);

                var diffDaysquery = " SELECT * FROM dbo.fn_CountWeekDays('"+fromdate+"','"+todate+"'); ";
                // console.log(diffDaysquery);
                request.query(diffDaysquery, function (err, rec) {
                    if (err) {
                        res.status(400).json(err);
                    }
                    else {
                        // console.log(rec.recordset)
                        var noofdays = rec.recordset[0].Noofworkingdays;
                        var obj = [rows.recordset,[{'Noofdays':noofdays}]]
                        // console.log(obj);
                        res.send(obj);

                    }
                });
               
            }
        }
    });
}
});


module.exports = router;