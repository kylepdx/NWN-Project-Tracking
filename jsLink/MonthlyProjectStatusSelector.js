<script type="text/javascript" src="/siteassets/jslink/jquery.min.js"></script>
<script type="text/javascript" src="/siteassets/jslink/jquery.SPServices.min.js"></script>


<div id='draftBanner'>
Draft Mode 
</div> 


<div id="selectReportDate" style="float:left; width:300px"><h3>Select Report Period</h3><select id="ddReportDate"></select></div>

<div id="selectReportTier" style="float:left; width:200px"><h3>Select Tier</h3><select id="ddTier"> 
<option value="">All</option> 
<option value="4">Tier 4</option> 
<option value="3">Tier 3</option> 
<option value="2">Tier 2</option> 
<option value="1">Tier 1</option> 
<option value="MSG">MSG</option> 
</select></div>


<script language="javascript" type="text/javascript"> 


// Hide the Left Navigation 



// 
//  Adds Date Selector to the MonthlyStatus page and passes &status=1 to the Status Display Page so we can hide the page chrome 
//


var currentDate = null; 
var currentTier = "";  


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

$(document).ready(function() {
    //debugger; 
	
	// Hide the results until we are ready 
	$('.ms-wpContentDivSpace').hide(); 
	$('#ddReportDate').hide();
	
	// When date is changed refresh page 
	 $("#ddReportDate").change(function(){
	 
         var selectedDate = $(this).val();     
         
         // get the selected Tier  
         var selectedTier = $('#ddTier').val();  
                  
         if (selectedTier == "") 
         {
     	 	var newPage = location.href.split('?')[0] + '?date=' + encodeURIComponent(selectedDate);
         }
         else 
         {
         	var newPage = location.href.split('?')[0] + '?date=' + encodeURIComponent(selectedDate) + '&tier=' + selectedTier;
         }
     	 
         document.location.href = newPage; 
     });



	 $("#ddTier").change(function(){
         var selectedTier = $(this).val();      
         
         // Get the selected Date 
         var selectedDate = $('#ddReportDate').val(); 
         
         if (selectedTier == "") 
         {
     	 	var newPage = location.href.split('?')[0] + '?date=' + encodeURIComponent(selectedDate);
         }
         else 
         {
         	var newPage = location.href.split('?')[0] + '?date=' + encodeURIComponent(selectedDate) + '&tier=' + selectedTier;
         }
     	 
         document.location.href = newPage; 
     });




	var qsDate = getQueryString().date; 
	if (qsDate) 
	{
		currentDate = decodeURIComponent(qsDate); 
	}	
	
	var qsTier = getQueryString().tier; 
	if (qsTier) 
	{
		currentTier = decodeURIComponent(qsTier);  
		
		$('#ddTier option[value=' + currentTier + ']').attr("selected","selected");
	}	
	
	 	
	
  $().SPServices({
    operation: "GetListItems",
    async: false,
    listName: "Report Dates",
    CAMLViewFields: "<ViewFields><FieldRef Name='Title' /><FieldRef Name='Status' /></ViewFields>",
    CAMLQuery: "<Query><OrderBy><FieldRef Name='StartDate' Ascending='False' /></OrderBy></Query>",
    completefunc: function (xData, Status) { 
    
      var select = document.getElementById("ddReportDate"); 
      var redirect = false; 
     
      $(xData.responseXML).SPFilterNode("z:row").each(function() {

		if (currentDate) 
		{
			$('.ms-wpContentDivSpace').show(); 
			$('#ddReportDate').show();
	         	    
	        var el = document.createElement("option");
		    el.textContent = $(this).attr("ows_Title");
		    el.value = $(this).attr("ows_Title"); 
		    
			//TODO:  Change Logic so that if status == draft then the date is not added to the dropdown 		    
		    
		    if (currentDate == el.textContent)
		    {
		    	el.selected = true;   
		    	
		    	if ($(this).attr("ows_Status") == "Draft") 
		    	{
		    		// Display Draft Mode  
		    		document.getElementById("draftBanner").style.display='block'; 
		    	}
		    }		    
		    select.appendChild(el);
        }
        else 
        {
        	if (!redirect) 
        	{
        		// No date passed in QueryString so re-load with the first date we got back 	    	
		    	var newPage = location.href.split('?')[0] + '?date=' + $(this).attr("ows_Title"); 
		        document.location.href = newPage; 	    
		        redirect=true; 
	        }
        }
        
      }); 
    }    
	
  }); 
  
});


</script>
