// ~sitecollection/siteassets/jslink/kpi.js

var myOverride = {};
myOverride.Templates = {};
myOverride.Templates.Fields = {"KPIBudget": { "View" : showKPI }, "KPIScope": { "View" : showKPI }, "KPISchedule": { "View" : showKPI } };

SPClientTemplates.TemplateManager.RegisterTemplateOverrides(myOverride); 

var cssId = 'PMOcss';   // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '../../siteassets/jslink/PMO.css';
    link.media = 'all';
    head.appendChild(link);
}


function showKPI(ctx) 
{
	var fieldName = ctx.CurrentFieldSchema.Name;  
    var theValue  = ctx.CurrentItem[fieldName];


    switch (theValue)
    {
        case "Pending": 
            return "<div class='circle kpi_white'></div>"; 
            break;  

        case "Red": 
            return "<div class='circle kpi_red'></div>"; 
            break;  

        case "Yellow": 
            return "<div class='circle kpi_yellow'></div>"; 
            break;  

        case "Green": 
            return "<div class='circle kpi_green'></div>"; 
            break;  
    }

}



