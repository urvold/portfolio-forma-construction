import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getPlan} from '../src/plans.ts';
test('room totals and geometric proportions match every conceptual project',()=>{
  for(const [area,floors] of [[218,1],[156,2],[112,1],[286,2],[178,1],[242,2]]){
    let sum=0;
    for(let floor=0;floor<floors;floor++){
      const plan=getPlan(floors,area,floor);sum+=plan.floorArea;
      assert.equal(plan.rooms.reduce((n,r)=>n+r.area,0),plan.floorArea);
      for(const room of plan.rooms){assert.ok(room.area>0);assert.ok(Math.abs(room.width*room.height/(520*360)-room.area/plan.floorArea)<1e-9)}
      for(let i=0;i<plan.rooms.length;i++)for(let j=i+1;j<plan.rooms.length;j++){
        const a=plan.rooms[i],b=plan.rooms[j];
        const overlap=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
        assert.ok(overlap<1e-6,'room zones must not overlap');
      }
    }
    assert.equal(sum,area);
  }
});
