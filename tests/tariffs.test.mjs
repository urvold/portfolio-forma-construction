import {test} from 'node:test';import assert from 'node:assert/strict';import{estimate}from'../src/tariffs.ts';
test('all 384 combinations have a finite increasing price range',()=>{for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<2;c++)for(let d=0;d<4;d++)for(let e=0;e<3;e++){const [lo,hi]=estimate([a,b,c,d,e]);assert.ok(Number.isFinite(lo)&&lo>0&&hi>lo)}});
test('area and completion increase estimates',()=>{const base=estimate([0,0,0,0,0]);assert.ok(estimate([0,1,0,0,0])[0]>base[0]);assert.ok(estimate([0,0,0,0,2])[0]>base[0])});
