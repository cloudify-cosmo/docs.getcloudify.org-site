(function addGithubEditButton() {
    $('#edit-on-github').click(function (e) {
        if (location.hostname.indexOf("localhost") != -1 ) 
        {
            alert("Disabled for localhost")
            return;
        }
        var branch = getBranchFromUrl();
        var markdownFile = location.pathname.replace(/\/$/, '.md');
        location.href = getGithubUrl(branch, markdownFile);

    });
})()

function getBuildBranch(branch)
{
    if (isVersionBranch(branch))
        branch += "-build";
    return branch;
}

function isVersionBranch(branch)
{
    var versionPattern = new RegExp("\\d.\\d.\\d");
    return (versionPattern.test(branch))

}

function getBranchFromUrl() 
{
    var branch = location.pathname.split("/")[1];
    if (branch == "dev") 
        branch = "master";
    return branch;
}

function getGithubUrl(branch, markdownFile) 
{   
    if (isVersionBranch(branch))
        markdownFile = markdownFile.replace(branch,"")
    var branch = getBuildBranch(branch)        
    var repo = "https://github.com/cloudify-cosmo/docs.getcloudify.org";
    return repo + "/edit/" + branch + "/content" + markdownFile + "#";
}