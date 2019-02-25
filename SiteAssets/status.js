<script type="text/javascript" src="/siteassets/jslink/jquery.min.js"></script>
<script type="text/javascript" src="/siteassets/jslink/jquery.SPServices.min.js"></script>
<div id='draftBanner'>
Draft Mode 
</div> 


<div><h3>Select Report Period</h3><select id="ddReportDate"></select></div>


<script language="javascript" type="text/javascript">

// 
//  Adds Date Selector to the MonthlyStatus page and passes &status=1 to the Status Display Page so we can hide the page chrome 
//


var currentDate = null; 

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
	
	 $("#ddReportDate").change(function(){
         var selected = $(this).val(); 
         //alert(selected); 
         var newPage = location.href.split('?')[0] + '?date=' + encodeURIComponent(selected);
         document.location.href = newPage; 
     });


	var qsDate = getQueryString().date; 
	if (qsDate) 
	{
		currentDate = decodeURIComponent(qsDate); 
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
	        var liHtml = "<li>" + $(this).attr("ows_Title") + "</li>";	    	    
	        var el = document.createElement("option");
		    el.textContent = $(this).attr("ows_Title");
		    el.value = $(this).attr("ows_Title"); 
		    
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
  
  
  // Append Status=1 to the Links so we can hide the chrome 
  $('.ms-listlink').attr("href", function(i,href){ return href + "&status=1"; }); 
  
  
});


</script>
