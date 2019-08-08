#Requires -RunAsAdministrator

# IIS setup script for the Integrated Form project.
# Prerequisites:
# 1. IIS Installed
# 2. Url-Rewrite module is installed.
# 3. Ensure the following variables are set appropriately:
#    i) Certificate settings.
#   ii) Credentials for the application pool.

Import-Module WebAdministration
Import-Module IISAdministration # IIS 10/Server 2016

# START PARAMETERS

# Application pool name
$iisAppPoolName = "IntegratedFormAppPool"

# Managed runtime version. Set to "" for no managed code.
$iisAppPoolDotNetVersion = ""

# Username and type for application pool
# Type set to 4 for "ApplicationPoolIdentity".
# (see https://docs.microsoft.com/en-us/iis/configuration/system.applicationhost/applicationpools/add/processmodel)
$iisAppPoolUserName = "IIS AppPool\$iisAppPoolName"
$iisAppPoolIdentityType = 4

# Idle timeout
# This will prevent the application pool from terminating when there is no traffic. Otherwise a new w3wp.exe worker process 
# is started, and the application needs to boot all over again.
$iisAppPoolIdleTimeout = "0:00:00"

# App directory
$appDir = "c:\inetpub\integratedform"

# App name & host (IIS Site)
$iisAppName = "form.dev.ontellus.com"

# Certificate (PFX) location and password 
$certPath = ""
$certPass = ""

# END PARAMETERS.

# Validate parameters that must be set.
if (!$iisAppPoolUserName)
{
    Write-Error "Please set the application pool name"
    exit
}

# Install Cert
Write-Host "Adding certificate to Web Hosting store..."

$pfx = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2  
$pfx.Import($certPath,$certPass,"Exportable,PersistKeySet")   
$store = New-Object System.Security.Cryptography.X509Certificates.X509Store("WebHosting","LocalMachine")   
$store.Open("ReadWrite")  
$store.Add($pfx)   
$store.Close()
$certThumbprint = $pfx.Thumbprint

# Create application pool
cd IIS:\AppPools\

if (!(Test-Path $iisAppPoolName -pathType container))
{
    Write-Host "Creating application pool $iisAppPoolName..."

    $appPool = New-Item $iisAppPoolName
	Set-ItemProperty $iisAppPoolName -Name "processModel.identityType" -Value $iisAppPoolIdentityType
    Set-ItemProperty $iisAppPoolName -Name "processModel.idleTimeout" -Value $iisAppPoolIdleTimeout
	Set-ItemProperty $iisAppPoolName -Name "managedRuntimeVersion" -Value $iisAppPoolDotNetVersion
}
else
{
	Write-Warning "Application pool $iisAppPoolName already exists. Skipping."
}

# Create app directory if it doesn't exist
New-Item -ItemType Directory -Force -Path $appDir | Out-Null

# Give the app pool user full access to this folder.
# We have to get the application pool SID and translate that to a "virtual" user
# since the application pool identity isn't a real account.
$manager = Get-IISServerManager
$appPoolSid = $manager.ApplicationPools["$iisAppPoolName"].RawAttributes['applicationPoolSid']
$identifier = New-Object System.Security.Principal.SecurityIdentifier $appPoolSid
$user = $identifier.Translate([System.Security.Principal.NTAccount])
$acl = Get-Acl $appDir
$ar = New-Object System.Security.AccessControl.FileSystemAccessRule($user, "Read", "ContainerInherit,ObjectInherit", "None", "Allow")
$acl.SetAccessRule($ar)
Set-Acl $appDir $acl

# Create site
cd IIS:\Sites\

if (Test-Path $iisAppName -pathType container)
{
    Write-Warning "IIS site $iisAppName already exists. Skipping."
}
else
{
    Write-Host "Creating IIS site $iisAppName..."

	# SSLFlags is set to 0 for No SNI.
    $iisWebsiteBindings = @(
        @{protocol="https";bindingInformation="*:443:"+$iisAppName;hostHeader=$iisAppName;SSLFlags=0}
    )

    $iisApp = New-Item $iisAppName -bindings $iisWebsiteBindings -physicalPath $appDir

    # Set the certificate
    (Get-WebBinding -Name $iisAppName -Port 443 -Protocol "https").AddSslCertificate($certThumbprint, "WebHosting")

    # Set the sites app pool
    $iisApp | Set-ItemProperty -Name "applicationPool" -Value $iisAppPoolName
}