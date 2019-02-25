var sgSearchTable, selectedPRM_ID, selectedSG_ID;
var constSGListGUID = "ba646cdc-83dc-4839-b233-73233d322656"; //Stage Gate list guid

//var constPRMListGUID = "bb19fc93-4684-4bc2-957f-e226e5d12c25"; //PRM list guid
var constPRMListGUID = "6798C9F6-24C0-4BA9-BE82-9A2DBA647682"; //PRM list guid


function searchPRM() {
    var siteurl = _spPageContextInfo.webAbsoluteUrl;
	var query = "/_api/web/lists(guid'" + constPRMListGUID + "')/items"
				+ "?$select=ID,Title,Owning_x0020_Department,Project_x0020_Requestor/Title"
				+ "&$expand=Project_x0020_Requestor/Title"
				+ "&$filter=(PriorList eq 'In Queue') or (PriorList eq 'In Process')&$top=1000"; //added top parameter to overcome 100 item api limit
				//+ "&$filter=Status eq 'In Queue'";
				
	/* // deprecated in favor of using PRM list guid
	var query = "/_api/web/lists/GetByTitle('Project%20Request%20Memo')/items"
			+ "?$select=ID,Title,Owning_x0020_Department,Project_x0020_Requestor/Title"
			+ "&$expand=Project_x0020_Requestor/Title"
			+ "&$filter=Status eq 'In Queue'";	
	*/
	
    NWF$.ajax({
               url: siteurl + query,
               method: "GET",
               headers: { "Accept": "application/json; odata=verbose" },
               success: function (data) {
                    //if (data.d.results.length > 0 ) {
						if ( $.fn.dataTable.isDataTable( '#prm-search-table' ) ) {
						    //prmSearchTable = $('#prm-search-table').DataTable();
						    prmSearchTable = $('#prm-search-table').dataTable();						    
						}
						else {
						    prmSearchTable = $('#prm-search-table').dataTable({
								/*destroy: true,
								dom: 'Bfrtip',*/
								select: {
							        style: 'single'
							    },
								data: data.d.results,
								columnDefs: [
									{ "visible": false, "targets": 0 }
								],
								columns: [
									{"data": "ID"},
									{"data": "Title"},
									{"data": "Project_x0020_Requestor.Title"},
									{"data": "Owning_x0020_Department"}									
								],
								fnDrawCallback: function() {
									$("#prm-search-table tbody tr").click(function() {
										var position = prmSearchTable.fnGetPosition(this); // getting the clicked row position
										selectedPRM_ID = prmSearchTable.fnGetData(position).ID; // getting the value of the first (invisible) column
										console.log(selectedPRM_ID);
									});
								}
							});
						}
						
						//open resulting datatable in modal dialog using jQuery UI
						NWF$('#prm-search-table_wrapper').dialog({
							title: "Select an existing Project Request",
							minWidth: 700,
							minHeight: 500,
							modal: true,
							buttons: [
								{
									text: "Select",
									class: "nng-select-button",
									click: function() {
										var selectedRows = NWF$('#prm-search-table .selected');
										if (selectedRows.length > 0) {											
											NWF$(this).data("selectedPRM", selectedPRM_ID).dialog("close");											
										}
										else {
											NWF$(this).data("selectedPRM", null).dialog("close");
										}
									}
								},
								{
									text: "Not Found?",
									class: "nng-cancel-button",
									click: function() {
										//return 0 and close
										NWF$(this).data("selectedPRM", 0).dialog("close");
									}
								}
							],
							close: prmDialogClosed
						});							 
                    //}       
              },
              error: function (ex) {
                  console.log("Error: "+ ex.responseText);
             }
      });
}
function prmDialogClosed(data){
	var selectedPRMID = NWF$('#prm-search-table_wrapper').data('selectedPRM');
	if (selectedPRMID > 0){
		NWF$('#' + boolSearchResultChosen).prop('checked', true).change(); //PRM was selected
		NWF$('#' + boolSearchResultSkipped).prop('checked', false).change();				
		NWF$('#' + txtSelectedPRMSearchItem_ID).val(selectedPRMID).change();
		console.log("You chose: " + selectedPRMID);
		populateFromPRM(selectedPRMID);
	}
	else {
		NWF$('#' + boolSearchResultChosen).prop('checked', false).change(); 
		if (typeof(selectedPRMID) != 'undefined') {
			NWF$('#' + boolSearchResultSkipped).prop('checked', true).change();		
		}
		NWF$('#' + txtSelectedPRMSearchItem_ID).val("").change();
		console.log("You didn't choose anything: " + selectedPRMID);				
	}
}
function populateFromPRM(prmID) {
    var siteurl = _spPageContextInfo.webAbsoluteUrl;
	var query = "/_api/web/lists(guid'" + constPRMListGUID + "')/items(" + prmID + ")"
				+ "?$select=Title,Project,Project_x0020_Description,ExecutiveSponsor/Title,Project_x0020_Sponsor/Title,FY_x0020_Earmark,Total_x0020_Earmark"				
				+ "&$expand=ExecutiveSponsor/Title,Project_x0020_Sponsor/Title";
				
	/* //Deprecated model expanding 'UserName' field for NF people picker field resolution in favor of using 'Title' attribute
	var query = "/_api/web/lists/getbytitle('Project%20Request%20Memo')/items(" + prmID + ")"
				+ "?$select=Title,Project_x0020_Description,ExecutiveSponsor/UserName,Project_x0020_Sponsor/UserName,FY_x0020_Earmark,Total_x0020_Earmark"				
				+ "&$expand=ExecutiveSponsor/UserName,Project_x0020_Sponsor/UserName";
	*/
	/* //Changed to use PRM list guid
	var query = "/_api/web/lists/getbytitle('Project%20Request%20Memo')/items(" + prmID + ")"
				+ "?$select=Title,Project_x0020_Description,ExecutiveSponsor/Title,Project_x0020_Sponsor/Title,FY_x0020_Earmark,Total_x0020_Earmark"				
				+ "&$expand=ExecutiveSponsor/Title,Project_x0020_Sponsor/Title";	
	*/
	NWF$.ajax({
	       url: siteurl + query,
	       method: "GET",
	       headers: { "Accept": "application/json; odata=verbose" },
	       success: function (data) {
	            if (data.d) {
	            	//use PRM data to populate the pertinent fields on this form
	            	NWF$('#' + txtProjectName).val(data.d.Title);
	            	NWF$('#' + mlotProjectDescription).val(data.d.Project_x0020_Description);	            	
	            	//executive sponsor - multi people picker
	            	var execSponsor = new NF.PeoplePickerApi('#' + pplExecutiveSponsors);
	            	if (data.d.ExecutiveSponsor.results.length > 0) {
	            		data.d.ExecutiveSponsor.results.forEach(function(result) {
	            			if (result) {                    	                    	
		                    	//execSponsor.search('nng\\' + result.UserName).done(function(data) {
		                    	execSponsor.search(result.Title).done(function(data) {
		                    		execSponsor.add(data[0]); 
		                    	});
		                    }
		                });
	            	}
	            	//project sponsor - multi people picker  
	            	var projSponsor = new NF.PeoplePickerApi('#' + pplProjectSponsor);
	            	if (data.d.Project_x0020_Sponsor.results.length > 0) {
						data.d.Project_x0020_Sponsor.results.forEach(function(result) {
	            			if (result) {                   	                    	
		                    	//projSponsor.search('nng\\' + result.UserName).done(function(data) {
		                    	projSponsor.search(result.Title).done(function(data) {
		                    		projSponsor.add(data[0]); 
		                    	});
		                    }
		                });
	            	}  
	            	NWF$('#' + txtFYEarmark).val(data.d.FY_x0020_Earmark);                    
	            	NWF$('#' + txtTotalEarmark).val(data.d.Total_x0020_Earmark); 
	            	
					// Fill in Project Lookup 
					if (data.d.Project != null && data.d.Project.length) 
					{
						debugger; 
						
						var pid = data.d.Project.split(";#")[0]; 
						// hack to set the Project lookup
                    	ddProject = ddProject.replace("_hid","");                    	
                    	NWF$('#' + ddProject).val(pid);                     	
                    	NWF$('#' + ddProject).change();                     	
                    	NWF$('#' + ddProject).hide();    
					}                   		
	            }               
	       },
	      error: function (ex) {
	          console.log("Error: "+ ex.responseText);
		  }
	});
}

function searchSG() { 

	debugger; 
    var siteurl = _spPageContextInfo.webAbsoluteUrl;
	//var query = "/_api/web/lists(guid'ba646cdc-83dc-4839-b233-73233d322656')/items" 
	
	var query = "/_api/lists/GetByTitle('Project%20Tracking')/items"
			+ "?$select=ID,Title,Author/Title,SAP"
			+ "&$expand=Author/Title"
			+ "&$filter=ProjectStage ne 'Closed'&$top=1000"; //added top parameter to overcome 1000 item api limit

	/*
	var query = "/_api/web/lists(guid'" + constSGListGUID + "')/items"
				+ "?$select=ID,Title,Author/Title,SAP_x0020_Project_x0020_Number"
				+ "&$expand=Author/Title"
				+ "&$filter=Current_x0020_Stage ne 'Closed'&$top=1000"; //added top parameter to overcome 100 item api limit
	
	var query = "/_api/web/lists/GetByTitle('Stage%20Gate%20Form')/items"
				+ "?$select=ID,Title,Author/Title,SAP_x0020_Project_x0020_Number"
				+ "&$expand=Author/Title"
				//+ "&$filter=Status ne 'Stage Gate Complete'";
				+ "&$filter=Current_x0020_Stage ne 'Closed'";
	*/
    NWF$.ajax({
               url: siteurl + query,
               method: "GET",
               headers: { "Accept": "application/json; odata=verbose" },
               success: function (data) {
                    //if (data.d.results.length > 0 ) {
	                    if ( $.fn.dataTable.isDataTable( '#sg-search-table' ) ) {
							    //sgSearchTable = $('#sg-search-table').DataTable();
							    sgSearchTable = $('#sg-search-table').dataTable();							    
							}
							else {
							    sgSearchTable = $('#sg-search-table').dataTable({
									/*destroy: true,*/
									select: {
								        style: 'single'
								    },
									data: data.d.results,
									columnDefs: [
										{ "visible": false, "targets": 0 }
									],									
									columns: [
										{"data": "ID"},
										{"data": "Title"},
										{"data": "Author.Title"},
										{"data": "SAP"}									
									],
									fnDrawCallback: function() {
										$("#sg-search-table tbody tr").click(function() {
											var position = sgSearchTable.fnGetPosition(this); // getting the clicked row position
											selectedSG_ID = sgSearchTable.fnGetData(position).ID; // getting the value of the first (invisible) column
											console.log(selectedSG_ID);
										});
									}
								});
							}
                    
						//open resulting datatable in modal dialog using jQuery UI
						NWF$('#sg-search-table_wrapper').dialog({
							title: "Select an existing Stage Gate item",
							minWidth: 700,
							minHeight: 500,
							modal: true,
							buttons: [
								{
									text: "Select",
									class: "nng-select-button",
									click: function() {
										var selectedRows = NWF$('#sg-search-table .selected');
										if (selectedRows.length > 0) {											
											NWF$(this).data("selectedSG", selectedSG_ID).dialog("close");											
										}
										else {
											NWF$(this).data("selectedSG", null).dialog("close");
										}
									}
								},
								{
									text: "Not Found?",
									class: "nng-cancel-button",
									click: function() {
										//return 0 and close
										NWF$(this).data("selectedSG", 0).dialog("close");
									}
								}
							],							
							close: sgDialogClosed
						});							 
                    //}       
              },
              error: function (ex) {
                  console.log("Error in SearchSG: "+ ex.responseText);
             }
      });
}

function sgDialogClosed(data){
	var selectedSGID = NWF$('#sg-search-table_wrapper').data('selectedSG');
	if (selectedSGID > 0){
		NWF$('#' + boolSearchResultChosen).prop('checked', true).change(); //SG was selected
		NWF$('#' + boolSearchResultSkipped).prop('checked', false).change();				
		NWF$('#' + txtSelectedSGSearchItem_ID).val(selectedSGID).change();
		console.log("You chose: " + selectedSGID);
		populateFromSG(selectedSGID);
	}
	else {
		NWF$('#' + boolSearchResultChosen).prop('checked', false).change(); 
		if (typeof(selectedSGID) != 'undefined') {
			NWF$('#' + boolSearchResultSkipped).prop('checked', true).change();		
		}
		NWF$('#' + txtSelectedSGSearchItem_ID).val("").change();
		console.log("You didn't choose anything: " + selectedSGID);				
	}
}

function populateFromSG(sgID) {
	debugger; 
    var siteurl = _spPageContextInfo.webAbsoluteUrl; 
    
    var query = "/_api/web/lists/getbytitle('Project%20Tracking')/items(" + sgID + ")"
			+ "?$select=ID,Title,ProjectDescription,ExecutiveSponsor/Title,OtherSignators/Title,ProjectSponsor/Title,ProjectManager/Title,FYCapitalEarmark,CapitalEarmark,SAP,Tier"
			+ "&$expand=ExecutiveSponsor/Title,ProjectSponsor/Title,ProjectManager/Title,OtherSignators/Title";	
    
/*    
	var query = "/_api/web/lists(guid'" + constSGListGUID + "')/items(" + sgID + ")"
			+ "?$select=Title,Project_x0020_Description,Executive_x0020_Sponsors/Title,Project_x0020_Sponsors/Title,Project_x0020_Manager/Title,Other_x0020_Signators/Title,FY_x0020_Earmark,Total_x0020_Earmark,SAP_x0020_Project_x0020_Number,Tier"
			+ "&$expand=Executive_x0020_Sponsors/Title,Project_x0020_Sponsors/Title,Project_x0020_Manager/Title,Other_x0020_Signators/Title";	
*/ 
	/* //Deprecated model expanding 'UserName' field for NF people picker field resolution in favor of using 'Title' attribute
	var query = "/_api/web/lists/getbytitle('Stage%20Gate%20Form')/items(" + sgID + ")"
				+ "?$select=Title,Project_x0020_Description,Executive_x0020_Sponsors/UserName,Project_x0020_Sponsors/UserName,Project_x0020_Manager/UserName,Other_x0020_Signators/UserName,FY_x0020_Earmark,Total_x0020_Earmark,SAP_x0020_Project_x0020_Number,Tier"
				+ "&$expand=Executive_x0020_Sponsors/UserName,Project_x0020_Sponsors/UserName,Project_x0020_Manager/UserName,Other_x0020_Signators/UserName";
	*/				
	/* //changed to use Stage Gate list guid
	var query = "/_api/web/lists/getbytitle('Stage%20Gate%20Form')/items(" + sgID + ")"
			+ "?$select=Title,Project_x0020_Description,Executive_x0020_Sponsors/Title,Project_x0020_Sponsors/Title,Project_x0020_Manager/Title,Other_x0020_Signators/Title,FY_x0020_Earmark,Total_x0020_Earmark,SAP_x0020_Project_x0020_Number,Tier"
			+ "&$expand=Executive_x0020_Sponsors/Title,Project_x0020_Sponsors/Title,Project_x0020_Manager/Title,Other_x0020_Signators/Title";
	*/	
	
	NWF$.ajax({
               url: siteurl + query,
               method: "GET",
               headers: { "Accept": "application/json; odata=verbose" },
               success: function (data) {
                    if (data.d) {
                    	//use SG data to populate the pertinent fields on this form
                    	NWF$('#' + txtProjectName).val(data.d.Title);
                    	//Populate Total Approved Amount for selected Project (by ProjectName/Title)
                    	CalculateTotalApprovedAmount(data.d.Title);
                    	
                    	NWF$('#' + txtSAPProjectNumber).val(data.d.SAP);                    	
                    	NWF$('#' + mlotProjectDescription).val(data.d.ProjectDescription);
                    	NWF$('#' + ddlTier).val(data.d.Tier); //drop down                     	
                    	
                    	// hack to set the Project lookup
                    	ddProject = ddProject.replace("_hid","");                    	
                    	NWF$('#' + ddProject).val(data.d.ID);                     	
                    	NWF$('#' + ddProject).change();                     	
                    	NWF$('#' + ddProject).hide();                     	
                    	
                    	
                    	//executive sponsor - multi ppl picker 
                    	var execSponsor = new NF.PeoplePickerApi('#' + pplExecutiveSponsors);
                    	//if (data.d.Executive_x0020_Sponsors.results.length > 0) {
                    	if (typeof data.d.ExecutiveSponsor.results !== "undefined" && data.d.ExecutiveSponsor.results.length > 0) {
                    		data.d.ExecutiveSponsor.results.forEach(function(result) {
                    			if (result) {                    	
			                    	//execSponsor.search('nng\\' + result.UserName).done(function(data) {
			                    	execSponsor.search(result.Title).done(function(data) {
			                    		execSponsor.add(data[0]); 
			                    	});
			                    }
	                    	});
                    	}
                    	
                    	//project sponsor - multi ppl picker   
                    	var projSponsor = new NF.PeoplePickerApi('#' + pplProjectSponsor);
                    	//if (data.d.Project_x0020_Sponsors.results.length > 0) {
                    	if (typeof data.d.ProjectSponsor.results !== "undefined" && data.d.ProjectSponsor.results.length > 0) {
	                   		data.d.ProjectSponsor.results.forEach(function(result) {
                    			if (result) {                    	
			                    	//projSponsor.search('nng\\' + result.UserName).done(function(data) {
			                    	projSponsor.search(result.Title).done(function(data) {
			                    		projSponsor.add(data[0]); 
			                    	});
			                    }
			                });
                    	}
                    	
                    	//project manager  
                    	var projManager = new NF.PeoplePickerApi('#' + pplProjectManager);                    	

						if (typeof data.d.ProjectManager !== "undefined" && data.d.ProjectManager.UserName) {                    	
	                    	projManager.clear(); //remove existing data first
	                    	projManager.search(data.d.ProjectManager.Title).done(function(data) {
	                    		projManager.add(data[0]); 
	                    	});
                    	}                    	  
                    	
                    	//other signator(s) - multi ppl picker  
                    	var otherSignators = new NF.PeoplePickerApi('#' + pplOtherSignators);
                    	//if (data.d.Other_x0020_Signators.results.length > 0) {
                    	if (typeof data.d.Other_x0020_Signators.results !== "undefined" && data.d.Other_x0020_Signators.results.length > 0) {                    	
                    		data.d.Other_x0020_Signators.results.forEach(function(result) {
								if (result) {
			                    	otherSignators.search(result.Title).done(function(data) {
			                    		otherSignators.add(data[0]); 
			                    	});
		                    	}								
							});                    	
                    	}  
                    	
                  	
                    	NWF$('#' + txtFYEarmark).val(data.d.FYCapitalEarmark);                    
                    	NWF$('#' + txtTotalEarmark).val(data.d.CapitalEarmark);                    		
                    }               
               },
              error: function (ex) {
                  console.log("Error in PopulateFromSG: "+ ex.responseText);
			  }
	});
}

function CalculateTotalApprovedAmount(projectName){
    var encodedProjectName = encodeURIComponent(projectName);
    if (encodedProjectName.indexOf("'") >=0)
	{    
	 encodedProjectName = encodedProjectName.replace(/'/g, "''");
	}
    var siteurl = _spPageContextInfo.webAbsoluteUrl;
	var query = "/_api/web/lists/GetByTitle('Stage%20Gate%20Form')/items"
				+ "?$select=ID,Title,Capital_x0020_Request,Request_x0020_Type,DesignBuild,DesignBuildAmountRequested,TotalApprovedAmt"
				+ "&$filter=(Title eq '" + encodedProjectName + "') and (Current_x0020_Stage ne 'Closed')";			
	
    NWF$.ajax({
			url: siteurl + query,
			method: "GET",
			headers: { "Accept": "application/json; odata=verbose" },
			success: function (data) {
            	var totalAmt = 0;
            	if (data.d.results.length > 0 ) {	            	
	        		for (var counter = 0; counter < data.d.results.length; counter++) {
						var result = data.d.results[counter];
						console.log("Approved Capital Funding: " + result.Capital_x0020_Request);
						totalAmt += result.Capital_x0020_Request;
						//include design build amount requested in move to planning forms
						if (result.Request_x0020_Type == "Move to Planning" && result.DesignBuild) {
							totalAmt += result.DesignBuildAmountRequested;
							console.log("Design/Build amount approved: " + result.DesignBuildAmountRequested);
						}
						//include total approved amount for Engr Init Memo
						else if (result.Request_x0020_Type == "Engr Initiation Memo") {
							totalAmt += result.TotalApprovedAmt;
							console.log("Engr Init Memo Total Approved Amt" + result.TotalApprovedAmt);
						}						
					}
            	}
            	NWF$('#' + txtTotalApprovedAmt).val(totalAmt);
            	//console.log(totalAmt);
			},
			error: function (ex) {
			  console.log("Error: "+ ex.responseText);
			}
      });
}