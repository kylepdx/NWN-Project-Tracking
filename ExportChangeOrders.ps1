Connect-PnPOnline https://projects.nwnatural.com  

$list = get-pnplist -Identity stagegatedocs 

$items  = Get-PnPListItem -List stagegatedocs 

$co = $items | ?  {$_.FieldValues["DocType"] -eq "Change Order" }  

$changeOrders = @() 


foreach ($c in $co) 
{
    $change = new-object -TypeName PSObject -Property @{  
        "ProjectID" = $c.FieldValues["ProjectID"]   
        "Title" = $c.FieldValues["Title"] 
        "Created" = $c.FieldValues["Created"] 
        "File" = $c.FieldValues["FileRef"] 
    }

    $ChangeOrders += $change 

}

#$changeOrders | export-csv C:\temp\nwn\changeOrders.csv -NoTypeInformation 