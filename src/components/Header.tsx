import {useEffect, useRef, useState} from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {Menu, X} from 'lucide-react';
import {Arrow} from './ui';

const links = [['/projects','Проекты'],['/services','Услуги'],['/about','О нас'],['/stages','Этапы'],['/contacts','Контакты']];
export default function Header() {
  const {pathname} = useLocation();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const navigating = useRef(false);
  const closeForNavigation = () => {navigating.current=true;setOpen(false)};
  const currentPath = useRef(pathname);
  currentPath.current = pathname;

  useEffect(() => {
    const update = () => setCompact(previous => window.scrollY > 72 ? true : window.scrollY < 24 ? false : previous);
    update(); window.addEventListener('scroll', update, {passive:true});
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {setOpen(false)}, [pathname]);
  useEffect(() => {
    const media = matchMedia('(min-width: 768px)');
    const closeDesktop = () => {if(media.matches) setOpen(false)};
    media.addEventListener('change', closeDesktop);
    return () => media.removeEventListener('change', closeDesktop);
  }, []);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const panel = dialog.current;
    const top = window.scrollY;
    const openedPath = currentPath.current;
    const oldBody = document.body.style.cssText;
    const oldOverflow = document.documentElement.style.overflow;
    const oldScroll = document.documentElement.style.scrollBehavior;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${top}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    panel.showModal();
    return () => {
      panel.close();
      document.body.style.cssText = oldBody;
      document.documentElement.style.overflow = oldOverflow;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({top:!navigating.current && currentPath.current === openedPath ? top : 0, behavior:'instant'});
      document.documentElement.style.scrollBehavior = oldScroll;
      if(!navigating.current && currentPath.current === openedPath) opener.current?.focus({preventScroll:true});
    };
  }, [open]);
  return <div className="header-shell">
    <header className={`site-header ${compact ? 'is-compact' : ''}`}>
      <Link className="logo" to="/" title="На главную">FORMA<span>АРХИТЕКТУРА И СТРОИТЕЛЬСТВО</span></Link>
      <nav className="desktop-nav" aria-label="Основная навигация">{links.map(([to,label])=><NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <Link className="header-cta" to="/configurator">Подобрать дом <Arrow/></Link>
      <button ref={opener} className="menu-button" aria-label="Открыть меню" aria-expanded={open} aria-controls="mobile-menu" aria-haspopup="dialog" onClick={()=>{navigating.current=false;setOpen(true)}}><Menu aria-hidden="true"/></button>
    </header>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-labelledby="menu-title" onKeyDown={event=>{
        if(event.key!=='Tab') return;
        const focusable=[...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(el=>el.offsetParent!==null);
        const first=focusable[0], last=focusable[focusable.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
      }} onCancel={e=>{e.preventDefault();setOpen(false)}} onClose={()=>setOpen(false)}>
      <div className="menu-top"><Link className="logo" to="/" onClick={closeForNavigation}>FORMA</Link><button className="menu-close" aria-label="Закрыть меню" onClick={()=>setOpen(false)}><X aria-hidden="true"/></button></div>
      <div className="eyebrow" id="menu-title">НАВИГАЦИЯ / FORMA</div>
      <nav aria-label="Мобильная навигация">{links.map(([to,label],i)=><NavLink key={to} to={to} onClick={closeForNavigation}><span className="menu-index">0{i+1}</span>{label}<Arrow/></NavLink>)}<Link className="mobile-config" to="/configurator" onClick={closeForNavigation}>Подобрать дом <Arrow/></Link></nav>
      <p className="menu-note">Пространство, в котором хочется жить.<br/>Концептуальный архитектурный бренд.</p>
    </dialog>
  </div>;
}
