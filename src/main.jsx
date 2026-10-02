import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './palettes.css';
import './site.css';
import inicio from './pages/inicio.html?raw';
import comoFunciona from './pages/como-funciona.html?raw';
import explorarTutores from './pages/explorar-tutores.html?raw';
import materias from './pages/materias.html?raw';
import serTutor from './pages/ser-tutor.html?raw';
import iniciarSesion from './pages/iniciar-sesion.html?raw';
import { bindInteractions } from './site-interactions.js';

const pages = {
  inicio,
  'como-funciona': comoFunciona,
  'explorar-tutores': explorarTutores,
  materias,
  'ser-tutor': serTutor,
  'iniciar-sesion': iniciarSesion
};
const navigation = [
  { label: 'Inicio', href: '/', page: 'inicio' },
  { label: 'Cómo funciona', href: '/como-funciona/', page: 'como-funciona' },
  { label: 'Explorar tutores', href: '/explorar-tutores/', page: 'explorar-tutores' },
  { label: 'Materias', href: '/materias/', page: 'materias' },
  { label: 'Ser tutor', href: '/ser-tutor/', page: 'ser-tutor' }
];
const logo = '/assets/stitch-01-df062fdfa1a6.png';
const profile = '/assets/stitch-02-0ba41644a4d4.png';

function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(33,21,43,0.04)]">
    <div className="site-header-inner h-20 w-full px-margin flex items-center justify-between">
      <div className="flex items-center gap-space-md shrink-0">
        <a className="brand-link flex items-center gap-space-sm group" href="/" aria-label="TutorMayor, ir al inicio">
          <img alt="Isotipo de TutorMayor: dos estudiantes conectados" className="h-9 w-auto object-contain rounded-lg shadow-sm" src={logo} />
          <span className="flex flex-col brand-copy">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none group-hover:text-primary transition-colors">TutorMayor</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase mt-0.5">Entre pares todo hace clic</span>
          </span>
        </a>
        <span className="beta-pill hidden xl:inline-flex items-center px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">Beta universitaria</span>
      </div>
      <nav className="site-desktop-nav hidden lg:flex items-center gap-space-xs p-1 rounded-full bg-surface-container/60" aria-label="Navegación principal">
        {navigation.map(item => <a key={item.page} href={item.href} aria-current={page === item.page ? 'page' : undefined} className={`px-space-md py-space-xs rounded-full transition-all ${page === item.page ? 'bg-surface-container-high text-on-surface font-title-md text-title-md' : 'font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}>{item.label}</a>)}
      </nav>
      <div className="site-header-actions flex items-center gap-space-sm shrink-0">
        <a className="site-login px-space-md py-2.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline-flex items-center" href="/iniciar-sesion/">Iniciar sesión</a>
        <a className="site-find px-space-lg py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_8px_20px_rgba(255,100,51,0.25)] hover:shadow-[0_12px_24px_rgba(255,100,51,0.40)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-space-xs" href="/explorar-tutores/"><span>Encontrar tutor</span><span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span></a>
        <img alt="Avatar de la comunidad TutorMayor" className="site-profile w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed ml-space-xs" src={profile} />
        <button type="button" className="menu-trigger" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(open => !open)}><span className="material-symbols-outlined" aria-hidden="true">{menuOpen ? 'close' : 'menu'}</span></button>
      </div>
    </div>
    {menuOpen && <nav className="mobile-menu" aria-label="Navegación móvil">{navigation.map(item => <a key={item.page} href={item.href} aria-current={page === item.page ? 'page' : undefined}>{item.label}</a>)}<a href="/iniciar-sesion/">Iniciar sesión</a></nav>}
  </header>;
}

function Footer() {
  return <footer className="w-full bg-on-secondary-fixed text-surface pt-space-xl pb-space-lg">
    <div className="w-full px-margin">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-lg pb-space-xl border-b border-surface/10">
        <div className="lg:col-span-2 flex flex-col gap-space-md pr-0 lg:pr-space-xl">
          <a href="/" className="flex items-center gap-space-sm"><img alt="Isotipo TutorMayor" className="h-10 w-auto object-contain rounded-lg" src={logo}/><span className="font-headline-sm text-headline-sm text-surface tracking-tight">TutorMayor</span></a>
          <p className="font-headline-md text-headline-md text-primary-fixed tracking-tight leading-snug">Entre pares, todo hace clic.</p>
          <p className="font-body-md text-body-md text-secondary-fixed-dim max-w-md">Conectamos estudiantes de cursos avanzados con compañeros que necesitan superar materias clave mediante tutorías dinámicas y personalizadas.</p>
          <div className="flex items-center gap-space-xs pt-space-xs"><span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed"></span><span className="font-label-sm text-label-sm text-tertiary-fixed">Comunidad académica activa en 18+ universidades</span></div>
        </div>
        <FooterColumn title="Plataforma" links={navigation.filter(item => item.page !== 'inicio')} />
        <FooterColumn title="Soporte y guía" links={[{label:'Preguntas frecuentes',href:'/como-funciona/#preguntas-frecuentes'},{label:'Garantía de pares',href:'/como-funciona/#garantia'}]} />
        <div className="flex flex-col gap-space-sm"><h3 className="font-label-lg text-label-lg text-surface tracking-wide uppercase">Legalidad</h3><div className="flex flex-col gap-space-xs font-body-md text-body-md text-secondary-fixed-dim"><span>Términos de servicio</span><span>Política de privacidad</span><span>Código de honor</span></div></div>
      </div>
      <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md"><div className="flex items-center gap-space-sm flex-wrap"><span className="font-body-sm text-body-sm text-secondary-fixed-dim">© 2025 TutorMayor Inc. Todos los derechos reservados.</span><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/10 text-tertiary-fixed font-label-sm text-label-sm"><span className="material-symbols-outlined text-[14px]" aria-hidden="true">school</span>Hecho por y para estudiantes universitarios</span></div><div className="flex items-center gap-space-md text-secondary-fixed-dim font-label-sm text-label-sm"><span className="inline-flex items-center gap-1 text-tertiary-fixed-dim"><span className="material-symbols-outlined text-[16px]" aria-hidden="true">verified</span>Verificación estudiantil obligatoria</span></div></div>
    </div>
  </footer>;
}

function FooterColumn({ title, links }) {
  return <div className="flex flex-col gap-space-sm"><h3 className="font-label-lg text-label-lg text-surface tracking-wide uppercase">{title}</h3><div className="flex flex-col gap-space-xs font-body-md text-body-md text-secondary-fixed-dim">{links.map(link => <a key={link.href} className="hover:text-surface transition-colors" href={link.href}>{link.label}</a>)}</div></div>;
}

function App() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const page = path || 'inicio';
  const markup = pages[page] || pages.inicio;
  useEffect(() => bindInteractions(page), [page]);
  return <div data-page={page} className={`site-frame font-body-md text-on-surface antialiased min-h-screen bg-surface ${page === 'iniciar-sesion' ? 'login-frame' : ''}`}>
    {page !== 'iniciar-sesion' && <Header page={page} />}
    <div className="page-content" dangerouslySetInnerHTML={{ __html: markup }} />
    {page !== 'iniciar-sesion' && <Footer />}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
