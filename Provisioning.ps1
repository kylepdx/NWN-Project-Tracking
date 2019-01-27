
Add-PSSnapin "*point*" 

$siteUrl = "http://firefly.pdx.local/sites/nwn5" 
#New-SPSite -Name "NWN Test" -Url $siteUrl  -Template BLANKINTERNET#0 -OwnerAlias pdx\sp_admin



#$siteUrl = "https://projectsdv.nwnatural.com" 

Connect-PnPOnline $SiteUrl   
write-host "Connected to " $siteUrl 


$fileName = $psScriptRoot + "\template.xml" 
write-host "Apply " $fileName 

$ans = Read-Host -Prompt "Ok to Apply provisioning Template" 


if ($ans -ne "y") 
{
    write-host -ForegroundColor Red "aborted" 
}
else 
{
    #Apply-PnPProvisioningTemplate -Path $fileName  

    #  Provision our Files 
    $tempfileName = $psScriptRoot + "\jsSelectProject.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLinks"

    $tempfileName = $psScriptRoot + "\kpi.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLinks"

    $tempfileName = $psScriptRoot + "\pmo.css"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLinks"
}


 
