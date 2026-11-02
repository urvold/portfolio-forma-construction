// Условные демонстрационные тарифы, руб./м². Не коммерческое предложение.
export const tariffs={base:62000,styles:[1,1.02,.92,1.18],materials:[1,1.12,.9,1.24],completion:[.65,.85,1.15],floor:[1,1.08],areas:[[80,120],[120,180],[180,250],[250,330]],uncertainty:.15};
export function estimate(s:number[]){const [style,area,floor,material,completion]=s;const rate=tariffs.base*tariffs.styles[style]*tariffs.materials[material]*tariffs.completion[completion]*tariffs.floor[floor];return [Math.round(rate*tariffs.areas[area][0]*(1-tariffs.uncertainty)),Math.round(rate*tariffs.areas[area][1]*(1+tariffs.uncertainty))];}
export const money=(n:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(n/1e6)+' млн ₽';
