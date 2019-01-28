
Add-PSSnapin "*point*" 

$siteUrl = "http://firefly.pdx.local/sites/nwnb"  

$check = get-spsite $siteUrl -ErrorAction SilentlyContinue


if ($check -eq $null) 
{
    New-SPSite -Name "NWN Test" -Url $siteUrl  -Template STS#1 -OwnerAlias pdx\sp_admin
}



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
    Apply-PnPProvisioningTemplate -Path $fileName   


    #Connect again to pick up new site asset list 
    Connect-PnPOnline $SiteUrl   

    #Pause to let the SiteAssets Library get created 
    #Start-Sleep -Seconds 10 


    #  Provision our Files 
    $tempfileName = $psScriptRoot + "\jslink\jsSelectProject.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"

    $tempfileName = $psScriptRoot + "\jslink\kpi.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"

    $tempfileName = $psScriptRoot + "\jsLink\pmo.css"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"
}


 
