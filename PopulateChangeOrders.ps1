
$siteUrl = 'https://projectsdv.nwnatural.com' 
$siteUrl = 'http://firefly.pdx.local/sites/nwn4' 


$fileName = $PSScriptRoot +  '\ChangeOrders2.csv'  

$changes = Import-Csv -Path $fileName 


Connect-PnPOnline $siteUrl 
$changelist = Get-PnPList -Identity "lists/ProjectChangeOrders"    
$projectList = Get-PnPList -Identity "lists/ProjectTracking" 
$projects = Get-PnPListItem -List $projectList 




#clear out the Change Order list 
$oldItems = Get-PnPListItem -list $changeList  
foreach ($o in $oldItems)  { Remove-PnPListItem -List $changelist -Identity $o.id -force }  


$unmatched = @() 




#coorelate 
foreach ($c in $changes) 
{
    #write-host -ForegroundColor green $c.Title 
    $found = $false 


    # Lookup the project by project name 
    foreach ($p in $projects) 
    {  
        $projectTitle = $p.fieldValues["Title"] 
        #write-host "   " $projectTitle 
        if ($c.Title -eq $projectTitle) 
        {
            #found matching project  
            $ProjectID = $p.id 
            $found = $true

            #Add into the Change Orders List  

            $return = Add-PnPListItem -List $changeList  -Values @{"Title"=$projectTitle} 
            $null = Set-PnPListItem -List $changeList   -Identity $return.Id   -Values @{"Project" = $p.id}
            break; 
        }
        
    }


    if ($found -eq $false) 
    {
        write-host -ForegroundColor Red "No Match Found for " $c.Title 
        $unmatched += $c.Title 
    }
    else 
    {
        
      
    }


    
}


write-host " Matching Change Orders" 
Get-PnPListItem -List $changeList 


write-host "" 
write-host "" 


write-host " Un Matched Change Orders" 
$unmatched | sort  

