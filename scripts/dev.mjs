import http from 'node:http';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
const {default:worker}=await import('../dist/server/index.js');
const portArgument=process.argv.indexOf('--port');
const port=Number(portArgument>=0?process.argv[portArgument+1]:(process.env.PORT||3000));
http.createServer(async(req,res)=>{
 try{
  const headers=new Headers(req.headers);
  // Preview stays anonymous; account identity belongs to Sites dispatch.
  for(const key of [...headers.keys()])if(key.startsWith('oai-authenticated-'))headers.delete(key);
  const origin='http://'+(req.headers.host||'localhost:'+port);
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  const request=new Request(new URL(req.url,origin),{method:req.method,headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
  const response=await worker.fetch(request,{});
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500,{'Content-Type':'text/plain'});res.end('Preview request failed')}
}).listen(port,'0.0.0.0',()=>console.log('Prompt Atlas preview listening on '+port));
