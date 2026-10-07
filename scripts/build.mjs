import {readFileSync,writeFileSync,mkdirSync,rmSync,readdirSync,statSync,copyFileSync} from 'node:fs';
import path from 'node:path';
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff':'font/woff'};
const assets={};function visit(dir){for(const file of readdirSync(dir)){const p=path.join(dir,file);if(statSync(p).isDirectory())visit(p);else{const ext=path.extname(p);const binary=['.png','.webp','.jpg','.jpeg','.woff'].includes(ext);assets['/'+path.relative('public',p).split(path.sep).join('/')]={type:types[ext]||'application/octet-stream',binary,data:readFileSync(p,binary?'base64':'utf8')}}}}
visit('public');rmSync('dist',{recursive:true,force:true});mkdirSync('dist/server',{recursive:true});mkdirSync('dist/.openai',{recursive:true});
const database=readFileSync('worker/database.js','utf8').replaceAll('export ','');const worker=readFileSync('worker/index.js','utf8').replace(/^import .*;\n/,'');
writeFileSync('dist/server/index.js','const ASSETS='+JSON.stringify(assets)+';\n'+database+'\n'+worker);copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built Worker with '+Object.keys(assets).length+' assets');
