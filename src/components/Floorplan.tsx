import {useState} from 'react';
import {Label} from './ui';
import {getPlan} from '../plans';
export default function Floorplan({floors,area}:{floors:number;area:number}) {
  const [floor,setFloor] = useState(0);
  const [active,setActive] = useState(0);
  const {floorArea,rooms}=getPlan(floors,area,floor);
  return <div className="floor-layout"><div>
    <div className="floor-tabs" role="group" aria-label="Выбор этажа">{Array.from({length:floors},(_,i)=><button key={i} aria-pressed={floor===i} className={floor===i?'selected':''} onClick={()=>{setFloor(i);setActive(0)}}>{i+1} этаж</button>)}</div>
    <svg className="plan" viewBox="0 0 560 440" role="group" aria-label={`Интерактивная схема, этаж ${floor+1}`}>
      <text className="plan-caption" x="20" y="22">ЭТАЖ {floor+1} / {floorArea} М²</text>
      {rooms.map((r,i)=><g key={`${floor}-${i}`} tabIndex={0} role="button" aria-label={`${r.name}, ${r.area} м²`} aria-pressed={active===i} data-room={i} onClick={()=>setActive(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setActive(i)}}} className={active===i?'room active':'room'}>
        <rect x={r.x} y={r.y} width={r.width} height={r.height}/>
        <text x={r.x+r.width/2} y={r.y+r.height/2-7} textAnchor="middle">{String(i+1).padStart(2,'0')}</text>
        <text className="room-size" x={r.x+r.width/2} y={r.y+r.height/2+18} textAnchor="middle">{r.area} м²</text>
      </g>)}
      <path d="M20 415H540M20 410V420M540 410V420" fill="none" stroke="#8e9782"/>
    </svg>
    <p className="muted">Демонстрационная схема зонирования, не строительная документация. Пропорции зон соответствуют площадям. Выберите помещение на плане или в списке.</p>
  </div><aside>
    <Label>ЭТАЖ {floor+1} / {floorArea} М²</Label>
    <div aria-live="polite" aria-atomic="true"><h3>{rooms[active].name}</h3><p className="room-area">{rooms[active].area} <span>м²</span></p></div>
    <div className="legend">{rooms.map((r,i)=><button key={r.name} className={active===i?'selected':''} onClick={()=>setActive(i)} aria-pressed={active===i}><span>{String(i+1).padStart(2,'0')}　{r.name}</span><span>{r.area} м²</span></button>)}</div>
    <p className="floor-total">Всего на этаже <strong>{floorArea} м²</strong></p>
  </aside></div>;
}
