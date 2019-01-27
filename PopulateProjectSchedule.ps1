# Populate Project Schedule 

$fileName = $psScriptRoot + '\ProjectSchedule.csv'
$siteUrl = 'https://projectsdv.nwnatural.com'  
$siteUrl = 'http://firefly.pdx.local/sites/nwn4' 


#
#  Export 
# 


<# 

connect-pnponline $siteUrl 

$list = get-pnpList -Identity "Lists/ProjectSchedule"

$items = Get-PnPListItem -List $list  


$scheduleItems = @() 

foreach ($item in $items) 
{ 

    # Dereference the looksups 
    $project = $item.FieldValues["Project"]  
        
    $scheduleItem  = New-Object PSObject
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name Project -Value $project.LookupValue 
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name Title -Value $item.FieldValues["Title"]             
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name DisplayOrder -Value  $item.FieldValues["DisplayOrder"] 
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name EstStartDate -Value  $item.FieldValues["EstStartDate"] 
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name ActualStartDate -Value  $item.FieldValues["ActualStartDate"] 
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name EstEndDate -Value  $item.FieldValues["EstEndDate"] 
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name ActualEndDate -Value  $item.FieldValues["ActualEndDate"]     
    Add-Member -InputObject $scheduleItem  -MemberType NoteProperty -Name Comment -Value  $item.FieldValues["Comment"] 
    
    $scheduleItems += $scheduleItem     
}


$scheduleItems | export-csv -Path $fileName  -Force 

#> 



#
#  Import 
# 

# Clear the list 


connect-pnponline $siteUrl  

$Projlist = get-pnpList -Identity "Lists/ProjectTracking"


$list = get-pnpList -Identity "Lists/ProjectSchedule" 
$items = Get-PnPListItem -List $list   

foreach ($i in $items) { Remove-PnPListItem -List $list -Identity $i.Id -Force  } 


$newEntries = Import-Csv -Path  $fileName 

foreach ($new in $newEntries) 
{
    $pItem = get-PnpListItem -List $projList | ? {$_.FieldValues["Title"] -eq $new.project}  


    write-host "Adding Schedule "$new.Title 
     
    $return = Add-PnPListItem -List $List  -Values @{"Title"=$new.title } 
        
    
      
    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Project" = $pItem.id} 

    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"DisplayOrder" =  $new.DisplayOrder}

    if ($new.EstStartDate -ne "") 
    {
        $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"EstStartDate"  = $new.EstStartDate}
    }

    if ($new.ActualStartDate -ne "") 
    {
        $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ActualStartDate" = $new.ActualStartDate} 
    }

    if ($new.EstEndDate -ne "") 
    {
        $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"EstEndDate" = $new.EstEndDate} 
    }
    
    if ($new.ActualEndDate -ne "") 
    {
        $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"ActualEndDate"  = $new.ActualEndDate} 
    } 

    $null = Set-PnPListItem -List $List -Identity $return.Id   -Values @{"Comment"  = $new.Comment}
}


