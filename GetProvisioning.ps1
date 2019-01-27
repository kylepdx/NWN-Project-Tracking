$siteUrl = "http://firefly.pdx.local/sites/nwn4" 
#$siteUrl = "https://projectsdv.nwnatural.com" 



# 
#  Extract new Template 
# 
 
Connect-PnPOnline $siteUrl   

$a = Get-Date
$d = $a.ToString('MMddyy')

$fileName = "C:\temp\nwNatural\template_" + $d + ".xml" 

Get-PnPProvisioningTemplate -Out $fileName -Force 
 
