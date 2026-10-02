const money = value => '$' + Number(value).toLocaleString('es-CO');
const one = (selector, root = document) => root.querySelector(selector);
const all = (selector, root = document) => [...root.querySelectorAll(selector)];

function feedback(form, message) {
  let status = one('.site-feedback', form.parentElement);
  if (!status) {
    status = document.createElement('p');
    status.className = 'site-feedback';
    status.setAttribute('role', 'status');
    form.insertAdjacentElement('afterend', status);
  }
  status.textContent = message;
}

function bindHome(root, cleanups) {
  const cards = all('.tutor-card', root);
  const search = one('#searchInput', root);
  let category = 'todos';
  const filter = () => {
    const term = (search?.value || '').trim().toLocaleLowerCase('es');
    for (const card of cards) {
      const matchesCategory = category === 'todos' || card.dataset.category === category;
      card.style.display = matchesCategory && card.textContent.toLocaleLowerCase('es').includes(term) ? 'flex' : 'none';
    }
  };
  const click = event => {
    const button = event.target.closest('[data-action]');
    if (!button || !root.contains(button)) return;
    if (button.dataset.action === 'filter-category') {
      category = button.dataset.category;
      all('[data-action="filter-category"]', root).forEach(chip => {
        chip.classList.toggle('bg-on-secondary-fixed', chip === button);
        chip.classList.toggle('text-surface', chip === button);
        chip.classList.toggle('bg-surface-container-lowest', chip !== button);
        chip.classList.toggle('text-on-surface', chip !== button);
      });
      filter();
    }
    if (button.dataset.action === 'filter-tutors') filter();
  };
  root.addEventListener('click', click);
  search?.addEventListener('input', filter);
  cleanups.push(() => { root.removeEventListener('click', click); search?.removeEventListener('input', filter); });
}

function bindHow(root, cleanups) {
  const click = event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'switch-role') {
      const role = button.dataset.role;
      const studentTab = one('#tab-student', root);
      const tutorTab = one('#tab-tutor', root);
      const studentView = one('#view-student', root);
      const tutorView = one('#view-tutor', root);
      studentView?.classList.toggle('hidden', role !== 'student');
      tutorView?.classList.toggle('hidden', role !== 'tutor');
      for (const [tab, active] of [[studentTab, role === 'student'], [tutorTab, role === 'tutor']]) {
        tab?.classList.toggle('bg-on-secondary-fixed', active);
        tab?.classList.toggle('text-surface-container-lowest', active);
        tab?.classList.toggle('shadow-md', active);
        tab?.classList.toggle('bg-transparent', !active);
        tab?.classList.toggle('text-on-surface-variant', !active);
        tab?.setAttribute('aria-selected', String(active));
      }
    }
    if (button.dataset.action === 'toggle-faq') {
      const index = button.dataset.index;
      const answer = one(`#faq-ans-${index}`, root);
      const icon = one(`#faq-icon-${index}`, root);
      if (!answer) return;
      const expanded = answer.classList.contains('hidden');
      answer.classList.toggle('hidden', !expanded);
      icon?.classList.toggle('rotate-180', expanded);
      button.setAttribute('aria-expanded', String(expanded));
      button.setAttribute('aria-controls', `faq-ans-${index}`);
    }
  };
  root.addEventListener('click', click);
  cleanups.push(() => root.removeEventListener('click', click));
}

function bindTutor(root, cleanups) {
  let hours = 8;
  let tariff = 38000;
  const recalculate = () => {
    const total = one('#monto-total', root);
    if (total) total.textContent = money(hours * tariff * 4);
  };
  const click = event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.dataset.action === 'set-horas') {
      hours = Number(button.dataset.value);
      const label = one('#label-horas', root);
      if (label) label.textContent = `${hours} hrs / semana`;
      all('.hora-btn', root).forEach(chip => {
        const active = Number(chip.dataset.val) === hours;
        chip.classList.toggle('bg-primary-container', active);
        chip.classList.toggle('text-on-primary', active);
        chip.classList.toggle('bg-[#190c23]', !active);
        chip.classList.toggle('text-surface', !active);
      });
      recalculate();
    }
    if (button.dataset.action === 'set-tarifa') {
      tariff = Number(button.dataset.value);
      const label = one('#label-tarifa', root);
      if (label) label.textContent = `${money(tariff)} COP`;
      all('.tarifa-btn', root).forEach(chip => {
        const active = Number(chip.dataset.val) === tariff;
        chip.classList.toggle('bg-tertiary-fixed', active);
        chip.classList.toggle('text-on-tertiary-fixed', active);
        chip.classList.toggle('bg-[#190c23]', !active);
        chip.classList.toggle('text-surface', !active);
      });
      recalculate();
    }
  };
  root.addEventListener('click', click);
  cleanups.push(() => root.removeEventListener('click', click));
}

function bindSubjects(root, cleanups) {
  const chips = all('.faculty-chip', root);
  const cards = all('.materia-card', root);
  const search = one('#searchInput', root);
  const clear = one('#clearSearch', root);
  const reset = one('#resetFaculties', root);
  let category = 'all';
  const filter = () => {
    const term = (search?.value || '').trim().toLocaleLowerCase('es');
    cards.forEach(card => card.classList.toggle('hidden', !(category === 'all' || (card.dataset.category || '').includes(category)) || !card.textContent.toLocaleLowerCase('es').includes(term)));
    clear?.classList.toggle('hidden', !term);
  };
  const selectChip = chip => {
    category = chip.dataset.cat || 'all';
    chips.forEach(item => {
      item.classList.toggle('bg-[#21152B]', item === chip);
      item.classList.toggle('bg-white/20', item !== chip);
      item.setAttribute('aria-pressed', String(item === chip));
    });
    filter();
  };
  const click = event => {
    const chip = event.target.closest('.faculty-chip');
    if (chip) selectChip(chip);
    if (event.target.closest('#resetFaculties')) { if (search) search.value = ''; if (chips[0]) selectChip(chips[0]); else filter(); }
    if (event.target.closest('#clearSearch')) { if (search) search.value = ''; filter(); search?.focus(); }
    const detail = event.target.closest('.open-detail-btn');
    if (detail) {
      event.preventDefault();
      const modal = one('#subjectModal', root);
      const title = one('#modalTitle', root);
      const code = one('#modalCode', root);
      if (title) title.textContent = detail.dataset.subject || 'Cátedra Universitaria';
      if (code) code.textContent = `Cód. ${detail.dataset.code || 'GEN-001'}`;
      modal?.classList.remove('hidden', 'opacity-0');
    }
    if (event.target.closest('#closeModalBtn, #closeModalSecondary') || event.target.id === 'subjectModal') {
      const modal = one('#subjectModal', root);
      modal?.classList.add('hidden', 'opacity-0');
    }
  };
  root.addEventListener('click', click);
  search?.addEventListener('input', filter);
  cleanups.push(() => { root.removeEventListener('click', click); search?.removeEventListener('input', filter); });
}

function bindExplore(root, cleanups) {
  const form = one('form', root);
  const query = form?.querySelector('input[type="text"]');
  const cards = all('article', root);
  const tabContainer = all('.overflow-x-auto', root).find(element => element.textContent.includes('Ingeniería y Ciencias'));
  const tabs = tabContainer ? all('button', tabContainer) : [];
  const controls = all('select', root);
  let faculty = 'Todas';
  const filter = () => {
    const term = (query?.value || '').trim().toLocaleLowerCase('es');
    cards.forEach(card => {
      const text = card.textContent.toLocaleLowerCase('es');
      const matchFaculty = faculty === 'Todas' || faculty === 'Ingeniería y Ciencias' && /ingenier|sistemas|mecatrónica|estructuras/.test(text) || faculty === 'Economía y Negocios' && /economía|finanzas|negocios/.test(text) || faculty === 'Ciencias de la Salud' && /bioestadística|medicina|salud/.test(text) || faculty === 'Humanidades y Derecho' && /derecho|humanidad/.test(text) || faculty === 'Diseño y Arquitectura' && /diseño|arquitectura/.test(text);
      const priceText = text.match(/\$\s*(\d{2})\s*k/);
      const price = priceText ? Number(priceText[1]) : 0;
      const priceFilter = controls[2]?.value || 'any';
      const matchPrice = priceFilter === 'any' || priceFilter === '25k' && price <= 25 || priceFilter === '35k' && price >= 25 && price <= 35 || priceFilter === 'more' && price > 35;
      card.classList.toggle('hidden', !(matchFaculty && matchPrice && text.includes(term)));
    });
  };
  const submit = event => { event.preventDefault(); filter(); };
  const click = event => {
    const tab = event.target.closest('button');
    if (tab && tabs.includes(tab)) {
      faculty = tab.querySelector('span')?.textContent.trim() || 'Todas';
      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('bg-on-secondary-fixed', active);
        item.classList.toggle('text-surface', active);
        item.classList.toggle('bg-surface-container-lowest', !active);
        item.classList.toggle('text-on-surface-variant', !active);
        item.setAttribute('aria-pressed', String(active));
      });
      filter();
    }
    if (tab?.textContent.includes('Limpiar filtros')) {
      faculty = 'Todas';
      if (query) query.value = '';
      controls.forEach((select, index) => { if (index > 1) select.selectedIndex = 0; });
      tabs[0]?.click();
      filter();
    }
    if (tab?.textContent.trim().startsWith('Reservar')) window.location.href = '/iniciar-sesion/';
    if (tab?.textContent.trim().startsWith('Ver perfil')) {
      const card = tab.closest('article');
      if (card) openProfile(card);
    }
    if (tab?.textContent.includes('Publicar solicitud urgente')) window.location.href = '/materias/#solicitud';
  };
  form?.addEventListener('submit', submit);
  query?.addEventListener('input', filter);
  root.addEventListener('click', click);
  controls.forEach(control => control.addEventListener('change', filter));
  cleanups.push(() => { form?.removeEventListener('submit', submit); query?.removeEventListener('input', filter); root.removeEventListener('click', click); controls.forEach(control => control.removeEventListener('change', filter)); });
}

function openProfile(card) {
  const dialog = document.createElement('dialog');
  dialog.className = 'profile-dialog';
  const title = card.querySelector('h2, h3, h4')?.textContent.trim() || 'Tutor verificado';
  const content = card.textContent.replace(/\s+/g, ' ').trim();
  dialog.innerHTML = '<button type="button" class="close-dialog" aria-label="Cerrar">×</button><h2></h2><p></p><a href="/iniciar-sesion/">Reservar sesión</a>';
  dialog.querySelector('h2').textContent = title;
  dialog.querySelector('p').textContent = content;
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}

function bindLogin(root, cleanups) {
  const student = one('#roleStudent', root);
  const tutor = one('#roleTutor', root);
  const password = one('#passwordInput', root);
  const icon = one('#passwordIcon', root);
  const click = event => {
    if (event.target.closest('#roleStudent, #roleTutor')) {
      const selected = event.target.closest('#roleStudent') ? student : tutor;
      [student, tutor].forEach(button => {
        button?.classList.toggle('bg-surface-container-lowest', button === selected && button === student);
        button?.classList.toggle('bg-on-secondary-fixed', button === selected && button === tutor);
        button?.classList.toggle('text-on-secondary', button === selected && button === tutor);
        button?.classList.toggle('shadow-sm', button === selected);
        button?.setAttribute('aria-pressed', String(button === selected));
      });
    }
    if (event.target.closest('#togglePasswordBtn') && password) {
      password.type = password.type === 'password' ? 'text' : 'password';
      if (icon) icon.textContent = password.type === 'password' ? 'visibility' : 'visibility_off';
    }
  };
  root.addEventListener('click', click);
  cleanups.push(() => root.removeEventListener('click', click));
}

export function bindInteractions(page) {
  const root = one('.page-content');
  if (!root) return () => {};
  const cleanups = [];
  if (page === 'inicio') bindHome(root, cleanups);
  if (page === 'como-funciona') bindHow(root, cleanups);
  if (page === 'ser-tutor') bindTutor(root, cleanups);
  if (page === 'materias') bindSubjects(root, cleanups);
  if (page === 'explorar-tutores') bindExplore(root, cleanups);
  if (page === 'iniciar-sesion') bindLogin(root, cleanups);
  const submit = event => {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const messages = {
      postulacion: 'Datos validados en esta demostración. El registro aún no está conectado a un servicio.',
      'subject-request': 'Solicitud preparada en esta demostración. Aún no se ha enviado.',
      login: 'Esta demostración todavía no conecta con el inicio de sesión.'
    };
    feedback(form, messages[form.dataset.form]);
  };
  root.addEventListener('submit', submit);
  cleanups.push(() => root.removeEventListener('submit', submit));
  return () => cleanups.forEach(cleanup => cleanup());
}
