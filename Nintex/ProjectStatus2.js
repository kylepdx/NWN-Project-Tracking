//
// JS Include on the Project Status Nintex form 
//

function nwnInit(editMode) 
{ 
	// Hide controls we use to pass data back to this script 
	NWF$('.nwn-lblProjectID').hide();  
	NWF$('.nwn-lblApprovalStatus').hide();  
		
	
	if (editMode) 
	{ 
	
	    //TODO:   Need to get the current ProjectID so we can pass it into the newForms
	    //        for Schedule and ChangeOrders  	
		
	
		// Wire up the Add New buttons 
		NWF$(".nwn-AddSchedule").click(AddNewSchedule);  
		NWF$(".nwn-AddChangeOrder").click(AddNewChangeOrder);  		
	}
	else 
	{		
		var qsReport = getQueryString().report; 
		if (qsReport) 
		{         
	        // If we are in Report Mode, hide the chrome 
	        // todo:  Check query string for report=1
     		NWF$(".ms-core-sideNavBox-removeLeftMargin").hide(); 
			NWF$("#contentBox").css("margin-left", "100px"); 
			NWF$('#s4-ribbonrow').hide(); 							
		}		
	}    
	

	var status = NWF$('.nwn-lblApprovalStatus').find('span').text();  
		
	if (status != "Draft") 
	{ 
		NWF$('.nwn-status').hide(); 
	}		
}


function getQueryString ()
{
	var queryStringKeyValue = window.parent.location.search.replace('?', '').split('&');
    var qsJsonObject = {};
    if (queryStringKeyValue != '') {
        for (i = 0; i < queryStringKeyValue.length; i++) {
            qsJsonObject[queryStringKeyValue[i].split('=')[0]] = queryStringKeyValue[i].split('=')[1];
        }
    }
    return qsJsonObject;
}




function AddNewSchedule(e) 
{
	var projectID = NWF$('.nwn-lblProjectID').find('span').text();
			
	//TODO:   Get Environment URL dynamically 
	var newForm = "https://projectsqa.nwnatural.com/Lists/ProjectSchedule/NewForm.aspx?ID=" + projectID + "&isDlg=1"; 

	myDisplayDialog(newForm); 		
}


function AddNewChangeOrder(e)
{
	var projectID = NWF$('.nwn-lblProjectID').find('span').text();
			
	//TODO:   Get Environment URL dynamically 
	var newForm = "https://projectsqa.nwnatural.com/Lists/ProjectChangeOrders/NewForm.aspx?ID=" + projectID + "&isDlg=1"; 

	myDisplayDialog(newForm); 		
}


function myDisplayDialog(url)
{ 
    var options = SP.UI.$create_DialogOptions();
    options.url = url;     
    SP.UI.ModalDialog.showModalDialog(options);
}


