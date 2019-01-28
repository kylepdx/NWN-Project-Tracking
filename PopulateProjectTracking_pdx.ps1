$siteUrl = 'http://firefly.pdx.local/sites/nwnb' 
$fileName = 'C:\Temp\NWNatural\2019 PMO Project Database.accdb'  
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


function GetEmail ($userName, $role) 
{

    #Declare any Variables
    $orgUnit = "OU=NWNatural"
    $dummyPassword = ConvertTo-SecureString -AsPlainText "TheBig!" -Force

    #Autopopulate Domain
    $dnsDomain =gc env:USERDNSDOMAIN
    $split = $dnsDomain.split(".")
    if ($split[2] -ne $null) {
	    $domain = "DC=$($split[0]),DC=$($split[1]),DC=$($split[2])"
    } else {
	    $domain = "DC=$($split[0]),DC=$($split[1])"
    }

    $filter = "Name -like '" + $userName + "'"    
    
    # get user references 
    $adUser = get-aduser -filter $filter -Properties EmailAddress 

    if ($adUser -eq $null) 
    {
        write-host -ForegroundColor: Red  $role ":" $userName "not found"         
    }
    


    return $adUser 

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
            $adProjExecutive = GetEmail $execName "Project Executive"  
            $execs += $adProjExecutive.EmailAddress 
            write-host -ForegroundColor Yellow "WARNING:  Not handling multiple accounts: " $execs
        }         
    }
    else 
    {
        $adProjExecutive = Getemail $row.ProjEx  "Project Executive" 
    }
    

    
    

    if ($adProjManager -eq $null -or $adProjSponsor -eq $null -or $adProjExecutive -eq $null) 
    {
        write-host "Skipping" 
        continue;
    }


    $return = Add-PnPListItem -List $Projects -Values @{"Title"=$row.ProjName;} 
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectManager"=$adProjManager.EmailAddress;}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectSponsor"=$adProjSponsor.EmailAddress;}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ExecutiveSponsor"=$adProjExecutive.EmailAddress;}
    $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ProjectDescription"=$row.ProjDescription}
    # $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"Department"=$row.Dept}
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

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ListStatus"="In Process"} 

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ApprovedCapitalBudget"=$row.TotalCapitalBudget} 
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"ApprovedOMBudget"=$row.TotalOMBudget} 

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"CapitalEarmark"=0}
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"OMEarmark"=0} 
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"FYCapitalEarmark"=0}  

   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"AACompleted"=$true}
   $null = Set-PnPListItem -List $Projects -Identity $return.Id  -Values @{"AACompletionDate"='1/1/2000'}

}
