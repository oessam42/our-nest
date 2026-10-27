import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const source=fs.readFileSync('app/LivingHouse.tsx','utf8')+'\nexports.qa={paths,objects,routines,blocked};';
const context={require:createRequire(process.cwd()+'/package.json'),exports:{}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText,context,{timeout:10000});
const {paths,objects,routines,blocked}=context.exports.qa;
let samples=0;
for(const pair of paths)for(const path of pair)for(let i=1;i<path.length;i++)for(let t=0;t<=1;t+=.2){const x=path[i-1][0]+(path[i][0]-path[i-1][0])*t,y=path[i-1][1]+(path[i][1]-path[i-1][1])*t;assert(!blocked(x,y),`Furniture collision at ${x},${y}`);samples++;}
for(const o of objects){const rx=o.room%2*300,ry=o.room>=2?260:0;assert(o.x>=rx&&o.y>=ry&&o.x+o.w<=rx+300&&o.y+o.d<=ry+260,`Furniture outside room: ${o.label}`)}
assert(routines.length===8);assert(objects.some(o=>o.kind==='bed'&&o.y<=10));
console.log(`PASS: 16 walking routes, ${samples} collision samples, 19 furniture bounds; wall-aligned bed.`);
