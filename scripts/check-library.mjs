import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=name=>JSON.parse(fs.readFileSync('public/data/'+name,'utf8'));
const prompts=read('prompts.json'),images=read('image-sources.json').images,release=read('library-release.json');
const ids=new Set(),texts={CN:new Set(),EN:new Set()},slots=new Set();
const modes=new Set(['text','text-image','image-image','text-video','image-video']);
const categories=new Set(['ecommerce','portrait','product','marketing','photography','illustration','anime','architecture','environment','graphic-design','experimental','writing','coding','office']);
const normalize=text=>text.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
for(const p of prompts){
 assert(!ids.has(p.id),'Duplicate ID '+p.id);ids.add(p.id);assert(modes.has(p.mode));assert(categories.has(p.category));
 for(const field of ['title','titleEN','promptCN','promptEN','categoryCN','categoryEN','modeCN','modeEN'])assert(typeof p[field]==='string'&&p[field].trim(),'Missing '+field+' '+p.id);
 for(const lang of ['CN','EN']){const text=normalize(p['prompt'+lang]);assert(!texts[lang].has(text),'Duplicate text '+p.id);texts[lang].add(text);assert(!text.includes('\ufffd')&&!text.includes('[object object]'))}
 // Exact supplied artwork text can remain Chinese inside a quoted brand name.
 assert(!/[\u4e00-\u9fff]/u.test(p.promptEN.replace(/“[^”]*”/g,'')),'Untranslated prompt '+p.id);
 assert(p.models.length&&!p.models.includes('Sora'),'Obsolete tool '+p.id);assert(['基础','进阶','高级'].includes(p.difficulty));
 assert(p.reviewedAt===release.date);assert(p.sources?.length,'Missing reference '+p.id);
 for(const source of p.sources){const url=new URL(source.url);assert(url.protocol==='https:');assert(source.name)}
 const cover=p.cover;assert(cover&&fs.existsSync('public'+cover.atlas),'Missing cover '+p.id);assert(cover.column>=0&&cover.column<cover.columns&&cover.row>=0&&cover.row<cover.rows);
 const slot=[cover.atlas,cover.column,cover.row].join(':');assert(!slots.has(slot),'Duplicate illustration '+p.id);slots.add(slot);
 assert(images.some(image=>image.id===p.id&&image.atlas===cover.atlas&&image.column===cover.column&&image.row===cover.row));
}
assert.equal(prompts.length,release.totalPrompts);assert.equal(prompts.filter(p=>p.sourceType==='adapted').length,release.addedPrompts);assert.equal(images.length,release.uniqueIllustrations);
assert.equal(new Set(images.map(x=>x.id)).size,images.length);assert.equal(new Set(images.map(x=>x.source_sha256)).size,images.length);assert.equal(new Set(images.map(x=>x.tile_sha256)).size,images.length);
for(const image of images){assert.match(image.source,/^https:\/\/([\w-]+\.)?pinterest\.com\//);assert.match(image.image_url,/^https:\/\/i\.pinimg\.com\//);assert(fs.existsSync('public'+image.atlas))}
assert.equal(JSON.parse(fs.readFileSync('package.json','utf8')).version,release.version);
console.log(`PASS: ${prompts.length} bilingual prompts, ${release.addedPrompts} additions, unique IDs/texts/covers, ${images.length} image provenance records, source links, classifications and version ${release.version}.`);
