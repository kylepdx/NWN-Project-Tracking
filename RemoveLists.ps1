
$siteUrl = "http://firefly.pdx.local/sites/nwn3" 
#$siteUrl = "https://projectsdv.nwnatural.com" 

Connect-PnPOnline $SiteUrl   
write-host "Connected to " $siteUrl 

$ans = Read-Host -Prompt "Ok to Delete Project Lists" 


if ($ans -ne "y") 
{
    write-host -ForegroundColor Red "aborted" 
}
else 
{    
    Remove-PnPList -Identity ProjectSchedule 
    Remove-PnPList -Identity ProjectChanges
    Remove-PnPList -Identity ProjectStatus
    Remove-PnPList -Identity ReportDates 
    Remove-PnPList -Identity ProjectTracking       
}



