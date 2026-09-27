const {execFileSync}=require('node:child_process');
for(const file of ["dist/wmf.node.js", "dist/wmf.js"]) execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
