// ~sitecollection/siteassets/jslink/kpi.js

var myOverride = {};
myOverride.Templates = {};
myOverride.OnPostRender = hideFields;  
myOverride.Templates.Fields = { "KPIBudget": { "View" : showKPI }, 
								"KPIScope": { "View" : showKPI }, 
								"KPISchedule": { "View" : showKPI }, 
								"LinkTitleNoMenu": { "View": handleTitle}
							 };

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


cssId = 'hideChrome';   // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '../../siteassets/jslink/hideChrome.css';
    link.media = 'all';
    head.appendChild(link);
}




function handleTitle(ctx) 
{
	if (ctx.CurrentItem["KPIScope"] == "Pending" &&    
		ctx.CurrentItem["KPIBudget"] == "Pending" &&   
		ctx.CurrentItem["KPISchedule"] == "Pending") 
	{
		return "<div class='ms-rteFontSize-2 projectTitle' ><strong>" + ctx.CurrentItem.Title + "</strong></div>" ;
	} 
	else 
	{ 
		// include report=1 to signal the Nintex form to hide the page chrome 
		return "<div class='ms-rteFontSize-2 projectTitle'> <a href='" + ctx.displayFormUrl + "&ID=" + ctx.CurrentItem.ID + "&report=1&source=" + document.location.href + "'><strong>" + ctx.CurrentItem.Title + "</strong></a></div>" ;
	}
}

function hideFields(ctx) 
{

	["ScopeComment","BudgetComment","ScheduleComment"].forEach(function(name){  
		var theField = document.querySelectorAll("[displayname=" + name + "]");  
		for (var f=0; f < theField.length; f++)
		{
			var header = document.querySelectorAll("[displayname=" + name + "]")[f].parentNode;  			
			var index = [].slice.call(header.parentNode.children).indexOf(header) + 1; 
			header.style.display = "none"; 
			for (var i=0, cells=document.querySelectorAll("td:nth-child(" + index + ")"); i < cells.length; i++) { 
				cells[i].style.display="none"; 
			}
		}		
	});
}


function showKPI(ctx) 
{
	var fieldName = ctx.CurrentFieldSchema.Name;  
    var theValue  = ctx.CurrentItem[fieldName];  
    
    //debugger; 
    var comment = ""; 
    
    switch (fieldName) 
    {
    	case "KPIScope": 
    		comment = ctx.CurrentItem["ScopeComment"]; 
    		break;  
    		
    	case "KPIBudget": 
    		comment = ctx.CurrentItem["BudgetComment"];  
    		break;  
    		
    	case "KPISchedule": 
    		comment = ctx.CurrentItem["ScheduleComment"];  
    		break; 	
    } 
    
    //var commentDiv = "<div class='overlay'><div class='kpiComment'><h2>Comment</h2><a class='close' href='#'>&times; </a><div class='content'> " + comment + "</div></div></div>"; 
    var commentDiv = "<div class='info'>" + comment + "</div>";  
    
    if (comment == null || comment.length == 0 || comment == "<div></div>") 
    {
    	// no comment provided to display
    	commentDiv = ""; 
    }
    
    switch (theValue)
    {
        case "Pending": 
            return "<div class='circle kpi_white'></div>"; 
            break;  

        case "Red": 
            return "<div class='circle kpi_red'>" + commentDiv + "</div>"; 
            break;  

        case "Yellow": 
            return "<div class='circle kpi_yellow'>" + commentDiv + "</div>"; 
            break;  

        case "Green": 
            return "<div class='circle kpi_green'></div>"; 
            break;  
    }
}



