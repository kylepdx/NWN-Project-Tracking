// ~sitecollection/siteassets/jsLink/jsNotes.js
// 
// jsLink that is used on the Project Tracker Viewform to pass in the current project ID to the New Note form.
// 
// Also installed in the ProjectNotes NewForm to catch the ID and pre-select the correct project 

var myOverride = {};
myOverride.Templates = {};
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
            		var url1 =  baseUrl + "/ProjectNotes/NewForm.aspx?RootFolder=&ID="+itemId + "&isDlg=1"; 
            		link[i].onclick = function() {displayDialog(url1); return false;};  			
		} 
	}


    	var elem = document.getElementsByClassName("ms-viewheadertr");  
	if (elem.length) 
	{
        	// elem[0].style.display = 'none';
    	}

}

