
# Project Status 

$siteUrl = 'https://projectsdv.nwnatural.com' 
#$siteUrl = 'http://firefly.pdx.local/sites/nwn5' 


#
#  Export 
# 

<# 

connect-pnponline $siteurl 

$list = get-pnpList -Identity "Lists/ProjectStatus"

$items = Get-PnPListItem -List $list  


$statusItems = @() 

foreach ($item in $items) 
{ 

    # Dereference the looksups 
    $project = $item.FieldValues["Project"]  
    $reportPeriod = $item.FieldValues["ReportPeriod"] 
    

    $statusItem  = New-Object PSObject
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Project -Value $project.LookupValue 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name ReportPeriod -Value $reportPeriod.LookupValue 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Title -Value $item.FieldValues["Title"]         
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name ApprovalStatus -Value   $item.FieldValues["ApprovalStatus"]  
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name GeneralComment  -Value  $item.FieldValues["GeneralComment"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name KPIScope  -Value  $item.FieldValues["KPIScope"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name ScopeComment -Value  $item.FieldValues["ScopeComment"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name KPIBudget  -Value  $item.FieldValues["KPIBudget"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name BudgetComment  -Value  $item.FieldValues["BudgetComment"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name KPISchedule -Value  $item.FieldValues["KPISchedule"]  
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name ScheduleComment -Value  $item.FieldValues["ScheduleComment"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Decisions  -Value  $item.FieldValues["Decisions"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Issues  -Value  $item.FieldValues["Issues"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Accomplishments  -Value  $item.FieldValues["Accomplishments"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name NextSteps -Value  $item.FieldValues["NextSteps"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name TotalBudget  -Value  $item.FieldValues["TotalBudget"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name ActualBudget  -Value  $item.FieldValues["ActualBudget"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name PctBudgetUsed  -Value  $item.FieldValues["PctBudgetUsed"] 
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name ForecastAndActuals  -Value $item.FieldValues["ForecastAndActuals"] 
    
    $statusItems += $statusItem     
}


$statusItems |  export-csv -Path C:\temp\nwNatural\ProjectStatus.csv -Force 

#> 


#
#  Import 
# 



connect-pnponline $siteUrl 

$Projlist = get-pnpList -Identity "Lists/ProjectTracking"
$ReportDates = get-pnpList -Identity "Lists/ReportDates"


$list = get-pnpList -Identity "Lists/ProjectStatus" 
$items = Get-PnPListItem -List $list   

#
# Clear the list 
#
foreach ($i in $items) { Remove-PnPListItem -List $list -Identity $i.Id -Force  } 

#
#  Read input file 
#

$fileName = $PSScriptRoot + '\ProjectStatus.csv' 
$newEntries = Import-Csv -Path  $fileName 



foreach ($new in $newEntries) 
{
    write-host "Adding Status "$new.Title " - " $new.ReportPeriod 
     
    $return = Add-PnPListItem -List $List  -Values @{"Title"=$new.title } 
        

    $pItem = get-PnpListItem -List $projList | ? {$_.Title -eq $new.project} 

    $rp = get-pnpListItem -List $reportDates | ? {$_.Title -eq $new.ReportPeriod} 
        

    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Project" = $pItem.id} 
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ReportPeriod" = $rp.id} 

    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ApprovalStatus" =  $new.ApprovalStatus}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"GeneralComment"  = $new.GeneralComment}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"KPIScope" = $new.KPIScope} 
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ScopeComment" = $new.ScopeComment} 
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"KPIBudget"  = $new.KPIBudget} 
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"BudgetComment"  = $new.BudgetComment}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"KPISchedule" = $new.KPISchedule}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ScheduleComment" = $new.ScheduleComment}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Decisions"  = $new.Decisions}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Issues"  = $new.Issues}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Accomplishments"  = $new.Accomplishments}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"NextSteps" = $new.NextSteps}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"TotalBudget"  = $new.TotalBudget}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ActualBudget"  = $new.ActualBudget}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"PctBudgetUsed"  = $new.PctBudgetUsed}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ForecastAndActuals"  = $new.ForecastAndActuals}

}


