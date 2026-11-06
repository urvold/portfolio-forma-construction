import {useId} from 'react';
import {materials, styles} from '../data';
import {tariffs} from '../tariffs';

/** Original parametric volume study. It never claims to be a photorealistic building model. */
export default function HouseVisual({selection}:{selection:number[]}) {
  const [style, area, floor, material, completion] = selection;
  const id = useId().replace(/:/g,'');
  const storeys = floor + 1;
  const width = (style===2 ? 290 : style===1 ? 210 : 260) + area*24 - floor*25;
  const depth = 135 + area*12;
  const height = storeys*88;
  const pitched = style===1 || style===2;
  const peak = pitched ? 55 : 0;
  const p = (x:number,y:number,z:number) => `${130+x+y*.65},${405+x*.17-y*.4-z}`;
  const poly = (...pts:number[][]) => pts.map(([x,y,z])=>p(x,y,z)).join(' ');
  const wall = ['#d7d1c3','#bc9d80','#b49b7d','#bfc0b6'][material];
  const face = completion===0 ? wall : style===3 ? '#e4decd' : material===2 ? '#b7a080' : '#dad7c9';
  const description = `${styles[style]}, ${storeys===1?'один этаж':'два этажа'}, ${tariffs.areas[area].join('–')} м², ${materials[material]}, ${['тёплый контур','предчистовая','под ключ'][completion]}`;
  return <svg className="house-visual" viewBox="0 0 720 535" role="img" aria-label={`Объёмная схема: ${description}`} data-style={style} data-floors={storeys} data-area={area} data-material={material} data-completion={completion}>
    <defs>
      <pattern id={`${id}-grid`} width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#d9dcd1" strokeWidth=".6"/></pattern>
      <pattern id={`${id}-wall`} width={material===2?8:32} height={material===0?20:16} patternUnits="userSpaceOnUse"><path d={material===2?'M0 0V16':material===3?'M1 1h1':'M0 0H32M16 0V16'} fill="none" stroke="#777b6b" strokeWidth={material===2?.6:.5} opacity=".45"/></pattern>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#879689"/><stop offset="1" stopColor={completion===2?'#c7b995':'#a8b6ae'}/></linearGradient>
    </defs>
    <rect width="720" height="535" fill="#e3e6dc"/><rect width="720" height="535" fill={`url(#${id}-grid)`}/>
    <ellipse cx="370" cy="414" rx="262" ry="49" fill="#b7c0ab" opacity=".35"/>
    <path d="M75 445L575 520L690 423" fill="none" stroke="#a7af9d" strokeWidth="1"/>
    <polygon points={poly([-18,-18,-6],[width+18,-18,-6],[width+18,depth+18,-6],[-18,depth+18,-6])} fill="#c3c7b8"/>
    <g className="house-volume" stroke="#636c5c" strokeWidth="1.2" strokeLinejoin="round">
      <polygon points={poly([0,0,0],[width,0,0],[width,0,height],[0,0,height])} fill={face}/>
      <polygon points={poly([width,0,0],[width,depth,0],[width,depth,height],[width,0,height])} fill={material===2?'#a28f73':'#c1c4b4'}/>
      {completion===0&&<><polygon points={poly([0,0,0],[width,0,0],[width,0,height],[0,0,height])} fill={`url(#${id}-wall)`}/><polygon points={poly([width,0,0],[width,depth,0],[width,depth,height],[width,0,height])} fill={`url(#${id}-wall)`}/></>}
      {Array.from({length:storeys},(_,level)=> <g key={level} data-storey={level+1}>
        {Array.from({length:style===3?5:3},(_,n)=>{
          const count=style===3?5:3, gap=width/(count+.4), start=gap*(n+.3), end=start+gap*.64;
          return <polygon key={n} points={poly([start,0,level*88+13],[end,0,level*88+13],[end,0,level*88+72],[start,0,level*88+72])} fill={`url(#${id}-glass)`} strokeWidth="3"/>;
        })}
        <polygon points={poly([width,18,level*88+13],[width,depth-18,level*88+13],[width,depth-18,level*88+70],[width,18,level*88+70])} fill={`url(#${id}-glass)`} strokeWidth="3"/>
        {level>0&&<line x1={130} y1={405-level*88} x2={130+width} y2={405+width*.17-level*88} strokeWidth="3"/>}
      </g>)}
      {pitched?<>
        <polygon points={poly([0,0,height],[width/2,0,height+peak],[width,0,height])} fill={face}/>
        <polygon points={poly([-8,-8,height],[width/2,-8,height+peak],[width/2,depth+8,height+peak],[-8,depth+8,height])} fill="#626d60"/>
        <polygon points={poly([width/2,-8,height+peak],[width+8,-8,height],[width+8,depth+8,height],[width/2,depth+8,height+peak])} fill="#4e594d"/>
        {style===2&&<polygon points={poly([width*.32,0,height+3],[width*.68,0,height+3],[width*.5,0,height+peak-13])} fill={`url(#${id}-glass)`}/>}
      </>:<polygon points={poly([-8,-8,height+6],[width+8,-8,height+6],[width+8,depth+8,height+6],[-8,depth+8,height+6])} fill={style===3?'#e6dfce':'#bec3b5'} strokeWidth="2"/>}
      {completion===2&&<><polygon points={poly([12,-38,0],[width-10,-38,0],[width-10,0,0],[12,0,0])} fill="#b5a58c"/>{[20,45,70,95].map(x=><line key={x} x1={130+x} y1={405+x*.17} x2={130+x-24.7} y2={405+x*.17+15.2} stroke="#928873" strokeWidth=".6"/>)}</>}
    </g>
    <g stroke="#8d9782" strokeWidth="1" fill="none"><path d={`M${p(0,-65,0)} L${p(width,-65,0)}`}/><path d={`M${p(0,-72,0)} L${p(0,-58,0)} M${p(width,-72,0)} L${p(width,-58,0)}`}/></g>
    <text x="34" y="40" className="drawing-label">FORMA / ОБЪЁМНАЯ СХЕМА</text>
    <text x="34" y="505" className="drawing-label">{storeys} {storeys===1?'ЭТАЖ':'ЭТАЖА'} / {tariffs.areas[area].join('–')} М²</text>
    <text x="686" y="505" textAnchor="end" className="drawing-label">НЕ ПРОЕКТНАЯ ДОКУМЕНТАЦИЯ</text>
  </svg>;
}
