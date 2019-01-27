# Report Dates

$siteUrl = 'http://firefly.pdx.local/sites/nwnTest' 
$fileName = "C:\temp\nwNatural\ReportDates.csv"

#
#  Export 
# 

<# 

connect-pnponline $siteurl 

$list = get-pnpList -Identity "Lists/ReportDates"
$items = Get-PnPListItem -List $list  


$statusItems = @() 

foreach ($item in $items) 
{ 

    # Dereference the looksups 
    $project = $item.FieldValues["Project"]  
    $reportPeriod = $item.FieldValues["ReportPeriod"] 
    

    $statusItem  = New-Object PSObject
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Title -Value $item.FieldValues["Title"]         
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name StartDate -Value   $item.FieldValues["StartDate"]  
    Add-Member -InputObject $statusItem  -MemberType NoteProperty -Name Status -Value  $item.FieldValues["Status"] 
    
    $statusItems += $statusItem     
}


$statusItems |  export-csv -Path $fileName -Force 

#> 


#
#  Import 
# 

# Clear the list 


connect-pnponline $siteUrl 

$Projlist = get-pnpList -Identity "Lists/ProjectTracking"
$ReportDates = get-pnpList -Identity "Lists/ReportDates"


$list = get-pnpList -Identity "Lists/ReportDates" 
$items = Get-PnPListItem -List $list   

foreach ($i in $items) { Remove-PnPListItem -List $list -Identity $i.Id -Force  } 




$newEntries = Import-Csv -Path  $fileName 

foreach ($new in $newEntries) 
{
    write-host "Adding Status "$new.Title " - " $new.ReportPeriod 
     
    $return = Add-PnPListItem -List $List  -Values @{"Title"=$new.title } 
             

    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"StartDate" =  $new.StartDate}
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Status"  = $new.Status}
}


