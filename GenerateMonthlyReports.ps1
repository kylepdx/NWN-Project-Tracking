# 
#  Script to populate Project Status for a Month 
# 


$siteUrl = 'http://firefly.pdx.local/sites/nwnb' 


connect-pnponline $siteUrl 

$ProjectList = get-pnpList -Identity "Lists/ProjectTracking"
$ReportDates = get-pnpList -Identity "Lists/ReportDates"
$ProjectStatus = get-pnpList -Identity "Lists/ProjectStatus"



$projects = Get-PnPListItem -List $projectList   
$date= Get-PnPListItem -List $ReportDates -Query "<View><Query><OrderBy><FieldRef Name='StartDate' Ascending='False' /></OrderBy></Query><RowLimit Paged='False'>1</RowLimit></View>"  




foreach ($p in $projects) 
{

    # Check if we already have a status record for this project/report date 
    write-host "Check for " + $p.FieldValues["Title"]  

    $dateLookup = "" + $date.id + ";#" + $date.FieldValues["Title"] 
    

    $query = "<View><Query><Where><And><Eq><FieldRef Name='ReportPeriod'/><Value Type='Lookup'>" + $date.FieldValues["Title"] + "</Value></Eq><Eq><FieldRef Name='Project'/><Value Type='Lookup'>" + $p.FieldValues["Title"] + "</Value></Eq></And></Where></Query></View>" 
    $check = Get-PnPListItem -List $ProjectStatus -Query $query 
    

    if ($check -ne $null) 
    {
        write-host $p.FieldValues["Title"]  " already exists with " $date.FieldValues["Title"]

        continue; 
    } 



    #
    #  Retrieve the Previous Month's Data 
    # 

    $prevDate = get-date($date.FieldValues["StartDate"]).AddDays(-1) 
    $isoDate = [microsoft.sharepoint.utilities.sputility]::CreateISO8601DateTimeFromSystemDateTime($prevDate) 
    
    $q = "<View><Query><Where><Lt><FieldRef Name='StartDate'/><Value Type='Datetime' IncludeTimeValue='True'>" + $isoDate + "</Value></Lt></Where><OrderBy><FieldRef Name='StartDate' Ascending='False' /></OrderBy></Query><RowLimit Paged='False'>1</RowLimit></View>"    
          
    $lastMonthReportPeriod = Get-PnPListItem -List $ReportDates -Query $q 

  
    $lastMonthQuery = "<View><Query><Where><And><Eq><FieldRef Name='ReportPeriod'/><Value Type='Lookup'>" + $lastMonthReportPeriod.FieldValues["Title"] + "</Value></Eq><Eq><FieldRef Name='Project'/><Value Type='Lookup'>" + $p.FieldValues["Title"] + "</Value></Eq></And></Where></Query></View>" 
    $lastMonthReport =  Get-PnPListItem -List $ProjectStatus -Query $lastMonthQuery 
    
    
    # Create a new Entry in Project Status 
     $return = Add-PnPListItem -List $ProjectStatus  -Values @{"Title"=$p.FieldValues["Title"]}  
     $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"Project" = $p.id} 
     $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"ReportPeriod" = $date.id} 


     if ($lastMonthReport -ne $null) 
     {
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"ApprovalStatus" =  $lastMonthReport.FieldValues["ApprovalStatus"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"GeneralComment"  = $lastMonthReport.FieldValues["GeneralComment"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"Decisions"  = $lastMonthReport.FieldValues["Decisions"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"Issues"  = $lastMonthReport.FieldValues["Issues"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"Accomplishments"  = $lastMonthReport.FieldValues["Accomplishments"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"NextSteps" = $lastMonthReport.FieldValues["NextSteps"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"TotalBudget"  = $lastMonthReport.FieldValues["TotalBudget"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"ActualBudget"  = $lastMonthReport.FieldValues["ActualBudget"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"PctBudgetUsed"  = $lastMonthReport.FieldValues["PctBudgetUsed"]}
        $null = Set-PnPListItem -List $ProjectStatus -Identity $return.Id   -Values @{"ForecastAndActuals"  = $lastMonthReport.FieldValues["ForecastAndActuals"]}
     }

     break; 

     

}


# Get the newest ReportDate 







