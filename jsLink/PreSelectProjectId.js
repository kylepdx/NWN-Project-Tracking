// ~sitecollection/siteassets/jsLink/PreSelectProject.js
// 
// jsLink that is used on New forms to check for the ID of the Project on the QueryString and pre-select the project
// 

var myOverride = {};
myOverride.Templates = {};
myOverride.Templates.Fields = { 'Project': { 'NewForm': selectProject} };

SPClientTemplates.TemplateManager.RegisterTemplateOverrides(myOverride);

function selectProject(ctx){

    //debugger; 

    var itemId = getQueryString().ID; 

    if (itemId.length)
    {
        ctx.CurrentFieldValue = itemId; 
    }

    return SPFieldLookup_Edit(ctx); 
}


function getQueryString ()
{
	var queryStringKeyValue = document.location.search.replace('?', '').split('&');
    var qsJsonObject = {};
    if (queryStringKeyValue != '') {
        for (i = 0; i < queryStringKeyValue.length; i++) {
            qsJsonObject[queryStringKeyValue[i].split('=')[0]] = queryStringKeyValue[i].split('=')[1];
        }
    }
    return qsJsonObject;
}
