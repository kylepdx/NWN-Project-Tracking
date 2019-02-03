Import-Module C:\Users\kyle\AppData\Local\Apps\SharePointPnPPowerShell2013\Modules\SharePointPnPPowerShell2013 -DisableNameChecking
#Add-PSSnapin "*point*" 

#$siteUrl = "http://firefly.pdx.local/sites/nwnb"  
$siteUrl = "https://projectsdv.nwnatural.com" 


#$check = get-spsite $siteUrl -ErrorAction SilentlyContinue


if ($check -eq $null) 
{
    #write-host "Creating new Test Site" 
    #New-SPSite -Name "NWN Test" -Url $siteUrl  -Template STS#1 -OwnerAlias pdx\sp_admin
}




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
    
    #  Provision our Files 
    $tempfileName = $psScriptRoot + "\jslink\jsSelectProject.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"

    $tempfileName = $psScriptRoot + "\jslink\kpi.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"

    $tempfileName = $psScriptRoot + "\jsLink\pmo.css"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"

    $tempfileName = $psScriptRoot + "\jsLink\jsNotes.js"
    Add-PnPFile -Path $tempFilename  -Folder "SiteAssets/jsLink"
}


 
