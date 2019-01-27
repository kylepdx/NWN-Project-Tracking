cls 
#$siteUrl = 'https://projectsdv.nwnatural.com' 
$siteUrl = 'http://firefly.pdx.local/sites/nwn4' 


$fileName = $psScriptRoot + "\2019 PMO Project Database.accdb" 
$connString = "PROVIDER=Microsoft.ACE.OLEDB.12.0;DATA SOURCE=" + $fileName + ";PERSIST SECURITY INFO=FALSE"

$conn = New-Object System.Data.OleDb.OleDbConnection($ConnString)

$cmd=$conn.CreateCommand()
$cmd.CommandText="Select * from MasterProjInfo" 
 
$conn.open() 


$rdr = $cmd.ExecuteReader()
$dt = New-Object System.Data.Datatable
$dt.Load($rdr)




Connect-PnPOnline $siteUrl 
$Projects = Get-PnPList -Identity "lists/ProjectTracking"    

$web = get-pnpWeb 
$siteUsers = $web.SiteUsers  

return 

function GetEmail ($userName, $role) 
{

    $name = $username.replace('.','') + '*' 

    $match = $siteUsers | ? {$_.Title -like $name}  

    if ($match.count -eq 1) 
    {
        return $match[0].Email 
    }
    elseif ($match.count -eq 0) 
    {
        write-host -ForegroundColor Red " " $userName " (" $role ") not found" 
        return $null 
    }
    else 
    {
        # multiple matching rows...try with 
        write-host "Found multiple matches"  
        return $null 
    }
}



function CleanDate ($rawDate) 
{
    $DBNull = [System.DBNull]::Value

   if ($rawDate -eq $dbnull -or $rawDate -eq "" -or $rawDate -eq $null) 
   {
        $tempDate = $null 
   }
   else 
   {
        write-host "  Parsing Date:" $rawDate 
        $tempDate = get-date($rawDate) 
        write-host "  Date:" $tempDate 
   }

   return $tempDate 
}


foreach ($row in $dt.Rows) 
{

    write-host $row.ProjName   

    # get user references 
    $adProjManager = GetEmail $row.ProjMgr "Project Manager"  

   
    #Sponsor and Exec allow multiple selections  

    if ($row.ProjSpon.contains(".,"))  
    {
        $sponsors = @()

        $k = $row.ProjSpon -split "," 
        for ($i=0; $i -lt $k.Length; $i+=2) 
        {
            $last = $k[$i].TrimStart() + "," 
            $first = $k[$i+1] 

            $sponsorname = $last+$first 
            $adProjSponsor = GetEmail $SponsorName "Project Sponsor"  
            $sponsors += $adProjSponsor.EmailAddress 
            write-host -ForegroundColor Yellow "WARNING:  Not handling multiple accounts: " $sponsors 
        }         
    }
    else 
    {
        $adProjSponsor = GetEmail $row.ProjSpon "Project Sponsor" 
    }

    
    if ($row.ProjEx.Contains(".,")) 
    {
        $execs = @() 

        $k = $row.ProjEx -split "," 
        for ($i=0; $i -lt $k.Length; $i+=2) 
        {
            $last = $k[$i].TrimStart() + "," 
            $first = $k[$i+1] 

            $execname = $last+$first 
            $adProjExecutive = GetEmail $execName "Executive Sponsor"  
            $execs += $adProjExecutive.EmailAddress 
            write-host -ForegroundColor Yellow "WARNING:  Not handling multiple accounts: " $execs
        }         
    }
    else 
    {
        $adProjExecutive = Getemail $row.ProjEx  "Executive Sponsor" 
    }
    
     


    $return = Add-PnPListItem -List $Projects -Values @{"Title"=$row.ProjName;} 
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectManager"=$adProjManager;}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectSponsor"=$adProjSponsor;}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ExecutiveSponsor"=$adProjExecutive;}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectDescription"=$row.ProjDescription}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"Department"=$row.Dept}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"Tier"=$row.Tier}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"SAP"=$row.SAPNo} 

    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"NonDiscretionary"= -not $row.NonDiscretionary}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProgramName"=$row.ProgramName}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"Phased"=$true} 
   #siteurl 
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectStatus"=$row.ProjStatus}
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectRank"=$row.Rank}
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectStage"=$row.ProjStage}  
   

   $tempDate = CleanDate $row.PRMEstEnd    
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"OrigEndDate"= $tempDate }

   $tempDate = CleanDate $row.EstimateEnd   
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"EstEndDate"=$tempDate}

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ListStatus"=$true} 

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ApprovedCapitalBudget"=$row.TotalCapitalBudget} 
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ApprovedOMBudget"=$row.TotalOMBudget} 

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"CapitalEarmark"=0}
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"OMEarmark"=0} 
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"FYCapitalEarmark"=0}  

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"AACompleted"=$true}
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"AACompletionDate"='1/1/2000'}
}
