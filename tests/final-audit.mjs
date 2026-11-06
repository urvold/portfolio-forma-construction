import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {estimate,money} from '../src/tariffs.ts';
const base=(process.env.FORMA_TEST_URL||'http://localhost:4173/portfolio-forma-construction/').replace(/\/?$/,'/');
const output='reports/final-refinement';fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox'],...(base.startsWith('https:')&&process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{})});
const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();
const errors=[],badResponses=[],brokenImages=[],overflows=[],headings=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()})});
const ids=['horizon','nord','field','balance','grove','patio'];
const serviceIds=['design','construction','concept','interior','landscape','supervision'];
const routes=['/','/projects',...ids.map(id=>'/projects/'+id),'/services',...serviceIds.map(id=>'/services/'+id),'/about','/stages','/contacts','/configurator','/missing'];
const widths=[320,375,390,430,768,1024,1440];
async function go(route){await page.goto(base+'#'+route);await page.locator('h1').waitFor()}
for(const width of widths){await page.setViewportSize({width,height:900});for(const route of routes){await go(route);await page.evaluate(async()=>{for(const image of document.images){image.loading='eager';await image.decode().catch(()=>{})}});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))overflows.push({width,route});for(const alt of await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.alt)))brokenImages.push({width,route,alt});const h=await page.locator('h1').evaluate(el=>({width:el.scrollWidth,client:el.clientWidth}));if(h.width>h.client+1)headings.push({viewport:width,route,...h});}}
// Mobile header: constant flow space, smooth compact state, scroll preservation.
await page.setViewportSize({width:390,height:844});await go('/');
const initialHeight=await page.locator('.site-header').evaluate(e=>e.getBoundingClientRect().height);
const mainTop=await page.locator('main').evaluate(e=>e.getBoundingClientRect().top+scrollY);
await page.evaluate(()=>scrollTo({top:540,behavior:'instant'}));await page.waitForTimeout(50);
const compactHeight=await page.locator('.site-header').evaluate(e=>e.getBoundingClientRect().height);assert.ok(compactHeight<initialHeight&&compactHeight>=54);
assert.equal(await page.locator('main').evaluate(e=>e.getBoundingClientRect().top+scrollY),mainTop);
const scrollBefore=await page.evaluate(()=>scrollY);
await page.getByRole('button',{name:'Открыть меню'}).click();
assert.equal(await page.locator('#mobile-menu').evaluate(d=>d.open),true);
assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');
assert.equal(await page.evaluate(()=>document.elementFromPoint(innerWidth/2,innerHeight-15)?.closest('dialog')?.id),'mobile-menu');
for(let n=0;n<12;n++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.closest('dialog')?.id),'mobile-menu')}
await page.mouse.wheel(0,650);assert.equal(await page.evaluate(()=>scrollY),0);
await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').evaluate(d=>d.open),false);assert.equal(await page.evaluate(()=>scrollY),scrollBefore);
assert.equal(await page.getByRole('button',{name:'Открыть меню'}).evaluate(e=>e===document.activeElement),true);
await page.getByRole('button',{name:'Открыть меню'}).click();await page.screenshot({path:output+'/menu-mobile.png'});
await page.getByRole('navigation',{name:'Мобильная навигация'}).getByRole('link',{name:'Подобрать дом'}).click();assert.ok(page.url().endsWith('#/configurator'));assert.equal(await page.locator('#mobile-menu').evaluate(d=>d.open),false);assert.equal(await page.evaluate(()=>document.body.style.position),'');assert.equal(await page.evaluate(()=>scrollY),0);
// Filters: every dimension independently, then empty combination and reset.
await go('/projects');const filters=page.locator('.filters select');
for(const [index,value,count] of [[0,'0',1],[1,'3',1],[2,'2',3],[3,'3',2],[4,'low',3]]){await filters.nth(index).selectOption(value);assert.equal(await page.locator('.project-card').count(),count);await page.getByRole('button',{name:'Сбросить фильтры'}).click()}
await filters.nth(1).selectOption('3');await filters.nth(2).selectOption('2');assert.equal(await page.locator('.project-card').count(),0);await page.getByRole('button',{name:'Сбросить фильтры'}).click();assert.equal(await page.locator('.project-card').count(),6);
// Each style and floor count; all options, exact tariff formula, edit/back/reset.
const options=[['Современный минимализм','Скандинавский','Барнхаус','Современная классика'],['80–120 м²','120–180 м²','180–250 м²','Более 250 м²'],['Один этаж','Два этажа'],['Газобетон','Керамический блок','Деревянный каркас','Монолитная технология'],['Тёплый контур','Предчистовая','Под ключ']];
const configurations=[];
for(let style=0;style<4;style++)for(let floor=0;floor<2;floor++){
 await go('/configurator');const selection=[style,(style+floor)%4,floor,(style+floor)%4,(style+floor)%3];
 for(let step=0;step<5;step++){await page.getByRole('button',{name:options[step][selection[step]],exact:true}).click();await page.getByRole('button',{name:step===4?'Посмотреть результат':'Продолжить',exact:true}).click()}
 const visual=page.locator('.house-visual');assert.equal(await visual.getAttribute('data-style'),String(style));assert.equal(await visual.getAttribute('data-floors'),String(floor+1));assert.equal(await page.locator('[data-storey]').count(),floor+1);for(const [key,index] of [['area',1],['material',3],['completion',4]])assert.equal(await visual.getAttribute('data-'+key),String(selection[index]));
 const expected=estimate(selection).map(money).join(' — ');assert.equal(await page.getByTestId('estimate').textContent(),expected);configurations.push({selection,expected});
 await page.getByRole('button',{name:'Шаг 3: Этажность'}).click();assert.equal(await page.getByRole('button',{name:options[2][floor],exact:true}).getAttribute('aria-pressed'),'true');await page.getByRole('button',{name:'Назад',exact:true}).click();assert.equal(await page.getByRole('button',{name:options[1][selection[1]],exact:true}).getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Шаг 5: Комплектация'}).click();await page.getByRole('button',{name:'Посмотреть результат'}).click();await page.getByRole('button',{name:'Начать заново'}).click();assert.equal(await page.getByRole('button',{name:options[0][0],exact:true}).getAttribute('aria-pressed'),'true');assert.equal(await visual.getAttribute('data-floors'),'1');
}
// All projects and all rooms on each floor, geometry hit testing and keyboard.
let floorChecks=0,roomChecks=0;
for(const id of ids){await go('/projects/'+id);const floors=await page.locator('.floor-tabs button').count();for(let floor=0;floor<floors;floor++){await page.getByRole('button',{name:`${floor+1} этаж`,exact:true}).click();floorChecks++;for(let room=0;room<6;room++){const zone=page.locator('svg.plan g').nth(room);const label=await zone.getAttribute('aria-label');await zone.click();assert.equal(await zone.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.legend button').nth(room).getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.floor-layout aside h3').textContent(),label.split(',')[0]);await page.locator('.legend button').nth((room+1)%6).click();await zone.focus();await page.keyboard.press('Space');assert.equal(await zone.getAttribute('aria-pressed'),'true');roomChecks++}}}
await go('/contacts');await page.getByRole('button',{name:'Попробовать обращение'}).click();assert.ok(await page.getByRole('status').isVisible());
// Native touch context, no touch handler cancels vertical scroll.
const touch=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const tp=await touch.newPage();await tp.goto(base+'#/configurator');await tp.getByRole('button',{name:'Барнхаус',exact:true}).tap();await tp.getByRole('button',{name:'Продолжить'}).tap();await tp.getByRole('button',{name:'180–250 м²',exact:true}).tap();await tp.getByRole('button',{name:'Продолжить'}).tap();await tp.getByRole('button',{name:'Два этажа',exact:true}).tap();assert.equal(await tp.locator('.house-visual').getAttribute('data-floors'),'2');await tp.goto(base+'#/projects/nord');await tp.getByRole('button',{name:'2 этаж',exact:true}).tap();await tp.locator('svg.plan g').nth(2).tap();assert.equal(await tp.locator('.floor-layout aside h3').textContent(),'Детская');assert.ok((await tp.locator('.plan').evaluate(e=>getComputedStyle(e).touchAction)).includes('pan-y'));await touch.close();
const axe=[];for(const route of ['/','/projects','/configurator','/projects/nord','/contacts','/services/design']){await go(route);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();axe.push({route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))})}
async function screenshot(route,width,file,fullPage=true){await page.setViewportSize({width,height:900});await go(route);await page.evaluate(async()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});await page.screenshot({path:output+'/'+file,fullPage})}
await screenshot('/',1440,'home-desktop.png');await screenshot('/',390,'home-mobile.png');await screenshot('/projects',1440,'catalog-desktop.png');await screenshot('/projects/nord',390,'project-mobile.png');await screenshot('/services/design',320,'service-320.png');await screenshot('/configurator',390,'configurator-mobile.png');
const result={base,widths,routes:routes.length,errors,badResponses,brokenImages,overflows,headingOverflows:headings,header:{initialHeight,compactHeight,flowStable:true,backgroundLocked:true,focusTrap:true,scrollRestored:true},configurations,floorChecks,roomChecks,touchPassed:true,axe};fs.writeFileSync(output+'/browser.json',JSON.stringify(result,null,2));await browser.close();console.log(JSON.stringify({errors,badResponses,brokenImages,overflows,headings,axe,floorChecks,roomChecks},null,2));assert.equal(errors.length+badResponses.length+brokenImages.length+overflows.length+headings.length+axe.reduce((n,a)=>n+a.violations.length,0),0);
