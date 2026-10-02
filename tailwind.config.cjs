const names = [
  'on-secondary-fixed-variant','primary-fixed-dim','primary-fixed','on-surface','surface',
  'surface-container-high','on-primary-fixed-variant','surface-container','surface-container-lowest',
  'tertiary-fixed','on-tertiary-container','background','secondary-container','secondary-fixed',
  'tertiary-container','inverse-surface','on-error-container','surface-bright','tertiary-fixed-dim',
  'on-tertiary-fixed-variant','secondary','on-primary','surface-container-low','error',
  'surface-dim','on-primary-container','on-secondary','outline-variant','error-container',
  'on-surface-variant','on-secondary-fixed','on-secondary-container','surface-tint','inverse-on-surface',
  'tertiary','outline','on-background','on-tertiary-fixed','on-error','primary','primary-container',
  'secondary-fixed-dim','surface-container-highest','on-primary-fixed','inverse-primary'
];
const fontSizes = {
  'body-sm': ['13px', {lineHeight:'20px',fontWeight:'400'}],
  'display-hero': ['64px', {lineHeight:'70px',letterSpacing:'-0.03em',fontWeight:'700'}],
  'headline-lg': ['44px', {lineHeight:'52px',letterSpacing:'-0.02em',fontWeight:'700'}],
  'display-hero-mobile': ['40px', {lineHeight:'46px',letterSpacing:'-0.02em',fontWeight:'700'}],
  'label-sm': ['10px', {lineHeight:'14px',letterSpacing:'0.06em',fontWeight:'700'}],
  'title-md': ['16px', {lineHeight:'22px',fontWeight:'600'}],
  'body-md': ['15px', {lineHeight:'24px',fontWeight:'400'}],
  'headline-lg-mobile': ['32px', {lineHeight:'38px',letterSpacing:'-0.02em',fontWeight:'700'}],
  'headline-md': ['28px', {lineHeight:'36px',letterSpacing:'-0.01em',fontWeight:'600'}],
  'label-lg': ['14px', {lineHeight:'18px',letterSpacing:'0.02em',fontWeight:'600'}],
  'label-md': ['12px', {lineHeight:'16px',letterSpacing:'0.04em',fontWeight:'600'}],
  'headline-sm': ['22px', {lineHeight:'28px',fontWeight:'600'}],
  'body-lg': ['18px', {lineHeight:'28px',fontWeight:'400'}],
  'title-lg': ['20px', {lineHeight:'26px',fontWeight:'600'}]
};
const fontFamilies = {};
for (const key of Object.keys(fontSizes)) {
  fontFamilies[key] = [key.startsWith('body') ? 'Plus Jakarta Sans' : key.startsWith('label') || key.startsWith('title') ? 'Sora' : 'Space Grotesk'];
}
module.exports = {
  content: ['./index.html','./*/index.html','./src/**/*.{js,jsx,html}'],
  theme: {
    extend: {
      colors: Object.fromEntries(names.map(name => [name, `rgb(var(--c-${name}) / <alpha-value>)`])),
      borderRadius: {DEFAULT:'0.25rem',lg:'0.5rem',xl:'0.75rem',full:'9999px'},
      spacing: {'space-xl':'2.5rem','space-xs':'0.25rem','space-sm':'0.5rem','space-md':'1rem','gutter-mobile':'1rem',margin:'3rem','space-lg':'1.5rem','margin-mobile':'1.25rem',gutter:'1.5rem'},
      fontFamily: fontFamilies,
      fontSize: fontSizes
    }
  }
};
