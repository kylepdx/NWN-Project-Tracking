
$fileName = 'C:\Users\kylep\OneDrive - PDX Portals\Clients\NW Natural\FromClient\2019 PMO Project Database.accdb' 

$connString = "PROVIDER=Microsoft.ACE.OLEDB.12.0;DATA SOURCE=" + $fileName + ";PERSIST SECURITY INFO=FALSE"



$conn = New-Object System.Data.OleDb.OleDbConnection($connString)

$cmd=$conn.CreateCommand()
$cmd.CommandText="Select * from MasterProjInfo" 
 
$conn.open()

$rdr = $cmd.ExecuteReader()
$dt = New-Object System.Data.Datatable
$dt.Load($rdr) 


foreach ($row in $dt.Rows) 
{
    Write-Output "ID: $($row.ProjectId)  Name: $($row.ProjName) Stage: $($row.ProjStage) Status: $($row.ProjStatus)"  
}

