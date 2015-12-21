(function addGithubEditButton() {
    $('#edit-on-github').click(function (e) {
        if (location.hostname.indexOf("localhost") != -1 ) 
        {
            alert("Disabled for localhost")
            return;
        }
        location.href = getGithubUrl(getBranch(), location.pathname.replace(/\/$/, '.md'));
    });
})()

function getBranch() 
{
    var branch = location.pathname.split("/")[1];
    if (branch == "dev") 
        branch = "master";
    versionPattern = new RegExp("\\d.\\d.\\d");
    if (versionPattern.test(branch))
        branch += "-build";
    return branch;
}

function getGithubUrl(branch, markdownFile) 
{        
   var repo = "https://github.com/cloudify-cosmo/docs.getcloudify.org";
   return repo + "/edit/" + branch + "/content" + markdownFile + "#";
}