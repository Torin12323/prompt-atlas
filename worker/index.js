import {listCustomPrompts,saveCustomPrompt} from './database.js';
const modes={'text-image':['文生图','Text to image'],'image-image':['图生图','Image to image'],'text-video':['文生视频','Text to video'],'image-video':['图生视频','Image to video'],text:['文本生成','Text generation']};
const categories={portrait:['人物肖像','Portrait'],product:['产品摄影','Product'],marketing:['广告创意','Marketing'],photography:['摄影','Photography'],illustration:['插画','Illustration'],anime:['动漫','Anime'],architecture:['建筑与室内','Architecture'],environment:['场景','Environment'],'graphic-design':['平面设计','Graphic design'],experimental:['实验与特效','Experimental'],ecommerce:['电商视觉','E-commerce'],writing:['写作与内容','Writing'],coding:['编程开发','Coding'],office:['办公效率','Office']};
function authenticatedUser(request){const id=request.headers.get('oai-authenticated-user-id');if(!id)return null;const email=request.headers.get('oai-authenticated-user-email')||'';let name=request.headers.get('oai-authenticated-user-full-name')||'';if(request.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8'){try{name=decodeURIComponent(name)}catch{name=''}}return {id,email,name}}
function json(value,status=200){return Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
function validatedPrompt(body){if(!body||typeof body!=='object'||Array.isArray(body))throw new Error('Invalid data');const string=(key,max,required=false)=>{const val=typeof body[key]==='string'?body[key].trim():'';if((required&&!val)||val.length>max)throw new Error(`Invalid ${key}`);return val};const id=string('id',60,true);if(!/^custom-[0-9a-f-]{36}$/.test(id))throw new Error('Invalid ID');const mode=string('mode',30,true),category=string('category',30,true);if(!modes[mode]||!categories[category])throw new Error('Invalid classification');const model=string('model',100)|| (mode.includes('video')?'Sora':mode==='text'?'ChatGPT':'GPT Image');return {id,title:string('title',120,true),titleEN:string('titleEN',120),promptCN:string('promptCN',10000,true),promptEN:string('promptEN',10000),mode,modeCN:modes[mode][0],modeEN:modes[mode][1],category,categoryCN:categories[category][0],categoryEN:categories[category][1],models:[model],tags:[categories[category][0]],difficulty:'基础',featured:false,priority:200,custom:true,createdAt:new Date().toISOString()}}
export default {async fetch(request,env){const url=new URL(request.url);const user=authenticatedUser(request);if(url.pathname==='/api/session'){if(request.method!=='GET')return json({error:'Method not allowed'},405);return json({user})}if(url.pathname==='/api/custom-prompts'){
 try{if(!user)return json({error:'Sign in to access your prompts'},401);if(request.method==='GET')return json({prompts:await listCustomPrompts(env,user)});
 if(request.method==='POST'){
 if(!request.headers.get('oai-authenticated-user-id'))return json({error:'Sign in to save your prompt'},401);
 const origin=request.headers.get('Origin');if(origin&&origin!==url.origin)return json({error:'Invalid origin'},403);
 if(request.headers.get('Sec-Fetch-Site')==='cross-site')return json({error:'Invalid origin'},403);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'JSON required'},415);
 const size=Number(request.headers.get('Content-Length')||0);if(size>65000)return json({error:'Request too large'},413);
 const raw=await request.text();if(raw.length>65000)return json({error:'Request too large'},413);
 let prompt;try{prompt=validatedPrompt(JSON.parse(raw))}catch{return json({error:'Check the title, content and generation mode'},400)}
 const result=await saveCustomPrompt(env,prompt,user);if(result.conflict)return json({error:'Prompt ID already exists'},409);return json(result,result.created?201:200)}
 return json({error:'Method not allowed'},405)
 }catch(error){console.error('Custom prompt storage error',error.message);return json({error:'Unable to load or save prompts. Please retry.'},503)}
 }
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
 const path=url.pathname==='/'?'/index.html':url.pathname;const asset=ASSETS[path];if(!asset)return new Response('Not found',{status:404});
 const body=request.method==='HEAD'?null:asset.binary?Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0)):asset.data;
 return new Response(body,{headers:{'Content-Type':asset.type,'Cache-Control':asset.binary?'public, max-age=86400':'no-cache','X-Content-Type-Options':'nosniff'}})
 }};
export {validatedPrompt};
