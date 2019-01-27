Import-Module C:\Users\kyle\AppData\Local\Apps\SharePointPnPPowerShell2013\Modules\SharePointPnPPowerShell2013

Connect-PnPOnline -Url https://projects.nwnatural.com 

$a = get-date 
$d = $a.ToString("MMddyy") 
$fileName = "C:\temp\nwn\template" + $d + ".xml" 


get-pnpprovisioningTemplate -out $fileName 

