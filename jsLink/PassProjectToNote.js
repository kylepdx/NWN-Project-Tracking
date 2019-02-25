// ~sitecollection/siteassets/jsLink/PassProjectId.js
// 
// jsLink that is used on Forms with embedded lists of releated entries.  
//  When user clicks on Add New item the parent Project ID is passed on the query string.  
//  Requires that the child list NEWFORM has the PreSelectProject jsLink installed 
// 

var myOverride = {};
myOverride.Templates = {};
myOverride.OnPostRender = addQueryString;  

SPClientTemplates.TemplateManager.RegisterTemplateOverrides(myOverride);


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
	debugger;


	// Make sure we are in List Mode  
	if (ctx.BaseViewID != 1) {return}; 


    // Find the New link and add a query string
	var link = document.getElementsByClassName("ms-heroCommandLink");  
    var itemId = getQueryString().ID;   
	var baseUrl = ctx.HttpRoot + "/Lists" 

				     
	for (var i=0; i < link.length; i++)
	{
		//TODO:   Figure out which List we are installed on 
	
		// skip over the Edit links 
		if (link[i].id == "idHomePageNewItem") 
		{
            var url1 =  baseUrl + "/ProjectNotes/NewForm.aspx?RootFolder=&ID="+itemId + "&isDlg=1"; 
            link[i].onclick = function() {displayDialog(url1); return false;};  			
		} 		
	}


	//  ?? what was this for ?? 
    var elem = document.getElementsByClassName("ms-viewheadertr");  
	if (elem.length) 
	{
        	// elem[0].style.display = 'none';
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



