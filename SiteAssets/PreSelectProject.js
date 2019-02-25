// ~sitecollection/siteassets/jsLink/PreSelectProject.js
// 
// jsLink that is used on New forms to check for the ID of the Project on the QueryString and pre-select the project
// 

var myOverride = {};
myOverride.Templates = {};
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


