<script type="text/javascript" src="/sites/nwnb/siteassets/jslink/jquery.min.js"></script>
<script type="text/javascript" src="/sites/nwnb/siteassets/jslink/jquery.SPServices.min.js"></script>


<select id="ddReportDate"></select> 


<script language="javascript" type="text/javascript">

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
    debugger; 
	
	 $("#ddReportDate").change(function(){
         var selected = $(this).val(); 
         alert(selected); 
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
    CAMLViewFields: "<ViewFields><FieldRef Name='Title' /></ViewFields>",
    CAMLQuery: "<Query><OrderBy><FieldRef Name='StartDate' Ascending='False' /></OrderBy></Query>",
    completefunc: function (xData, Status) { 
    
      var select = document.getElementById("ddReportDate"); 
     
      $(xData.responseXML).SPFilterNode("z:row").each(function() {
        var liHtml = "<li>" + $(this).attr("ows_Title") + "</li>";
        $("#tasksUL").append(liHtml);
        
        var el = document.createElement("option");
	    el.textContent = $(this).attr("ows_Title");
	    el.value = $(this).attr("ows_Title"); 
	    
	    if (currentDate && currentDate == el.value)
	    {
	    	el.selected = true; 
	    }
	    
	    select.appendChild(el);
        
      }); 
    }
  });
});


</script>

<ul id="tasksUL"/>