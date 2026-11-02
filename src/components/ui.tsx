import React from 'react';import{Link}from'react-router-dom';import{ArrowUpRight}from'lucide-react';import{img}from'../data';
export const Arrow=()=> <ArrowUpRight size={20} strokeWidth={1.4}/>;
export function Button({to,children,light=false}:{to:string;children:React.ReactNode;light?:boolean}){return <Link className={'button '+(light?'light':'')} to={to}>{children}<Arrow/></Link>}
export function Photo({name,alt,className='',eager=false}:{name:string;alt:string;className?:string;eager?:boolean}){return <img className={className} src={img(name)} srcSet={`${img(name).replace('.webp','-small.webp')} 800w, ${img(name)} 1800w`} sizes={className==='full'?'100vw':'(max-width: 767px) 100vw, 75vw'} alt={alt} fetchPriority={eager?'high':'auto'} loading={eager?'eager':'lazy'} decoding="async"/>}
export function Label({children}:{children:React.ReactNode}){return <div className="eyebrow"><span className="dot"/>{children}</div>}
export function PageHead({label,title,text}:{label:string;title:string;text?:string}){return <section className="page-head"><Label>{label}</Label><h1>{title}</h1>{text&&<p>{text}</p>}</section>}
