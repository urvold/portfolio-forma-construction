export type Room = {name:string;area:number;x:number;y:number;width:number;height:number};
export function getPlan(floors:number, totalArea:number, floor:number) {
  const floorArea = floor===0 ? Math.ceil(totalArea/floors) : totalArea-Math.ceil(totalArea/floors);
  const names = floor===0 ? ['Кухня-гостиная','Спальня','Кабинет','Прихожая','Санузел',floors===2?'Лестница':'Техническая комната'] : ['Холл','Спальня','Детская','Гардеробная','Ванная','Лестница'];
  const weights = floor===0 ? [.30,.20,.17,.13,.12,.08] : [.18,.25,.24,.13,.12,.08];
  const areas = weights.map(w=>Math.floor(w*floorArea));
  const remainders = weights.map((w,i)=>({i,remainder:w*floorArea-areas[i]})).sort((a,b)=>b.remainder-a.remainder);
  const remaining = floorArea-areas.reduce((a,b)=>a+b,0);
  for(let i=0;i<remaining;i++) areas[remainders[i].i]++;
  const rooms:Room[] = names.map((name,i)=>({name,area:areas[i],x:0,y:40,width:0,height:0}));
  const order = floor===0 ? [0,1,2,3,4,5] : [1,2,0,3,4,5];
  let x=20;
  for(let col=0;col<3;col++) {
    const a=order[col*2], b=order[col*2+1], sum=areas[a]+areas[b];
    const width=520*sum/floorArea, height=360*areas[a]/sum;
    Object.assign(rooms[a],{x,y:40,width,height});
    Object.assign(rooms[b],{x,y:40+height,width,height:360-height});
    x+=width;
  }
  return {floorArea,rooms};
}
