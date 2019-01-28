// ~sitecollection/siteassets/jsLink/jsSchedule.js
// 
// jsLink that is used on the Project Tracker Viewform to pass in the current project ID to the New Schedule form.
// 
// Also installed in the Schedule NewForm to catch the ID and pre-select the correct project 

var myOverride = {};
myOverride.Templates = {};
//myOverride.Templates.Header = renderHeader;
//myOverride.Templates.Footer = renderFooter;
//myOverride.Templates.Item = showFeedback; 
myOverride.OnPostRender = addQueryString;  
myOverride.Templates.Fields = { 'Project': { 'NewForm': selectProject} };

SPClientTemplates.TemplateManager.RegisterTemplateOverrides(myOverride);

function selectProject(ctx){

    debugger; 

    var itemId = GetUrlKeyValue('ID'); 

    if (itemId.length)
    {
        ctx.CurrentFieldValue = itemId; 
    }

    return SPFieldLookup_Edit(ctx); 
}



function displayDialog(url)
{
    var options = SP.UI.$create_DialogOptions();
    options.url = url;     
    SP.UI.ModalDialog.showModalDialog(options);
}


// 
// Injects the current item ID into the NewForm url 
// 
function addQueryString(ctx)
{	
    	// Make sure we are in List Mode  
    	if (ctx.BaseViewID != 1) {return}; 

	debugger;

    	// Find the New link and add a query string
	var link = document.getElementsByClassName("ms-heroCommandLink");  
        var itemId = GetUrlKeyValue('ID');   

	var baseUrl = ctx.HttpRoot + "/Lists" 
				     

	for (var i=0; i < link.length; i++)
	{
		// skip over the Edit links 
		if (link[i].id == "idHomePageNewItem" && i==0) 
		{
            		var url1 =  baseUrl + "/ProjectSchedule/NewForm.aspx?RootFolder=&ID="+itemId + "&isDlg=1"; 
            		link[i].onclick = function() {displayDialog(url1); return false;};  			
		} 

		if (link[i].id == "idHomePageNewItem" && i==2) 
		{
            		//var url2 = baseUrl + "/ProjectChangeOrders/NewForm.aspx?RootFolder=&ID="+itemId + "&isDlg=1"; 
            		link[i].onclick = function() {alert("Use Stage Gate workflow to add new Change Orders"); return false;};  			
		} 			
	}


    	var elem = document.getElementsByClassName("ms-viewheadertr");  
	if (elem.length) 
	{
        	// elem[0].style.display = 'none';
    	}

}

function renderHeader(ctx)
{
    var oldHeader = RenderHeaderTemplate(ctx); 
    return oldHeader + "<div>";
}

function renderFooter(ctx)
{
    var footer = RenderFooterTemplate(ctx)
    return "</div>" + footer;
}

