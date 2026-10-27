import ts from 'typescript';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const source=fs.readFileSync('app/LivingHouse.tsx','utf8')+'\nexports.qa={joint,gait,along};';
const context={require:createRequire(process.cwd()+'/package.json'),exports:{}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText,context,{timeout:10000});
const {joint,gait,along}=context.exports.qa;
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
// Joint lengths remain bounded, even with a task target beyond arm's reach.
for(const t of [[12,-20,52],[30,-40,54],[0,0,20],[-23,4,35]]){const root=[0,0,47],r=joint(root,t,[0,.4,-1],16,15);assert(Math.abs(distance(root,r.mid)-16)<1e-6);assert(Math.abs(distance(r.mid,r.end)-15)<1e-6);}
// A stance foot stays still in world space as the root advances.
for(const side of [-1,1])for(let d=0;d<72;d+=.25){const a=gait(d,side),b=gait(d+.01,side);if(a.stance&&b.stance){assert.equal(a.lift,0);assert(Math.abs((d+a.forward)-(d+.01+b.forward))<1e-6)}assert(a.lift>=0&&a.lift<=5);}
// Headings follow cardinal paths and rotate gradually through corners.
for(const [x,y] of [[100,0],[-100,0],[0,100],[0,-100]]){const p=along([[0,0],[x,y]],.5);assert(p.dx*x+p.dy*y>0);assert(Math.abs(p.dx*y-p.dy*x)<1e-9)}
const turn=along([[0,0],[50,0],[50,50]],.5);assert(turn.dx>0&&turn.dy>0);
console.log('PASS: arm reach and joint lengths, planted stance feet, foot lift, four walking directions, corner turns.');
