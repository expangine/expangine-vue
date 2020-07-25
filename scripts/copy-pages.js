var fs = require('fs');
var path = require('path');
var pagesBranchLocation = '../expangine-vue-pages/';

function copyFolderSync(from, to) {
    if (!fs.existsSync(to) || !fs.statSync(to).isDirectory()) {
        fs.mkdirSync(to);
    }
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}
function removeFile(path) {
    if (fs.existsSync(path) && fs.statSync(path).isFile()) {
        fs.unlinkSync(path);
    }
}
function removeDirectory(path) {
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
        fs.rmdirSync(path, { recursive: true });        
    }
}

removeDirectory(pagesBranchLocation + 'css');
removeDirectory(pagesBranchLocation + 'examples');
removeDirectory(pagesBranchLocation + 'img');
removeDirectory(pagesBranchLocation + 'js');
removeDirectory(pagesBranchLocation + 'api');
removeFile(pagesBranchLocation + 'index.html');

fs.readdirSync(pagesBranchLocation)
    .filter(f => /precache-manifest/.test(f))
    .map(f => removeFile(pagesBranchLocation + f));

copyFolderSync('dist', pagesBranchLocation);