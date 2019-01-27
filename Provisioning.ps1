
$siteUrl = "http://firefly.pdx.local/sites/nwn" 
$newsiteUrl = "https://projectsdv.nwnatural.com" 


<# 

# 
#  Extract new Template 
# 
 
Connect-PnPOnline $siteUrl   

$a = Get-Date
$d = $a.ToString('MMddyy')

$fileName = "C:\temp\nwNatural\template_" + $d + ".xml" 

Get-PnPProvisioningTemplate -Out $fileName -Force 

#>  


Connect-PnPOnline $newSiteUrl   
write-host "Connected to " $newsiteUrl 


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
}


 
