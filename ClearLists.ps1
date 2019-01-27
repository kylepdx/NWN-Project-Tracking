# Clear List 

$siteUrl = "http://firefly.pdx.local/sites/nwnTest" 

Connect-PnPOnline $siteUrl  


function ClearList ($listName) 
{

    
    write-host "Clearing " $listname 

    $fullListName = "Lists/" + $ListName  

    $list  = get-pnpList -Identity $FullListName

    $items = Get-PnPListItem -list $FullListname 

    foreach ($i in $items) 
    {
        try 
        {
            write-host "Remove item:" $i.id 
            Remove-PnPListItem -List $FulllistName -Identity $i.id -force 
        }
        catch 
        {
            write-host -ForegroundColor Red "Delete error:" $i.ID 
        }
    } 
}


ClearList "ProjectSchedule" 
ClearList "ProjectChangeOrders" 
ClearList "ProjectStatus" 
ClearList "ProjectTracking" 
ClearList "ReportDates"  


