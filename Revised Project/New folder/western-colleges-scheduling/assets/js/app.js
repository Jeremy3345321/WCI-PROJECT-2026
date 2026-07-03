/* =========================================================
   APP.JS — shell wiring: nav, modal system, toast, helpers
   ========================================================= */

// ---------- shared helpers (used across views) ----------
function escapeHtml(str){
  if(str === null || str === undefined) return '';
  return String(str)
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

function pencilIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16.5 3.5l4 4L8 20H4v-4L16.5 3.5z"/></svg>`;
}
function trashIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-9 0l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"/></svg>`;
}

const HUE_COLORS = ['var(--maroon-700)','var(--gold-600)','var(--event)','var(--exam)','#c1572f'];
function colorRadios(selectedHue){
  const sel = selectedHue ?? 0;
  return `<div class="swatch-row" id="hueRow">
    ${HUE_COLORS.map((c,i) => `<span class="swatch ${i===Number(sel)?'is-selected':''}" data-hue="${i}" style="background:${c}"></span>`).join('')}
  </div>
  <input type="hidden" name="hue" value="${sel}">`;
}

// wire up swatch clicks once modal body is in DOM (delegated, see Modal.open)

// ---------- TOAST ----------
const Toast = (() => {
  let timer = null;
  function show(msg){
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('is-shown');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('is-shown'), 2400);
  }
  return { show };
})();

// ---------- MODAL ----------
const Modal = (() => {
  let currentOnClose = null;

  function open(cfg){
    const overlay = document.getElementById('modalOverlay');
    const card = document.getElementById('modalCard');
    currentOnClose = cfg.onClose || null;

    card.style.maxWidth = cfg.wide ? '560px' : '460px';

    const footButtons = (cfg.footRight || []).map((b,i) =>
      `<button class="btn ${b.cls||'btn-ghost'}" data-extra="${i}">${b.label}</button>`
    ).join('');

    card.innerHTML = `
      <div class="modal-head">
        <h3>${cfg.title}</h3>
        <button class="modal-close" aria-label="Close" id="modalCloseBtn">&times;</button>
      </div>
      <div class="modal-body">${cfg.body}</div>
      <div class="modal-foot">
        ${footButtons}
        <button class="btn btn-ghost" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalPrimaryBtn">${cfg.primaryLabel || 'Save'}</button>
      </div>
    `;

    overlay.classList.add('is-open');

    // swatch picker wiring (delegated within this modal instance)
    card.querySelectorAll('.swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        card.querySelectorAll('.swatch').forEach(s => s.classList.remove('is-selected'));
        sw.classList.add('is-selected');
        const hidden = card.querySelector('input[name="hue"]');
        if(hidden) hidden.value = sw.dataset.hue;
      });
    });

    card.querySelector('#modalCloseBtn').addEventListener('click', close);
    card.querySelector('#modalCancelBtn').addEventListener('click', close);

    (cfg.footRight || []).forEach((b,i) => {
      card.querySelector(`[data-extra="${i}"]`).addEventListener('click', b.onClick);
    });

    card.querySelector('#modalPrimaryBtn').addEventListener('click', () => {
      const result = cfg.onPrimary ? cfg.onPrimary(card) : true;
      if(result !== false) close();
    });

    if(cfg.onMount) cfg.onMount(card);

    // focus first input for convenience
    const firstInput = card.querySelector('input, select, textarea');
    if(firstInput) setTimeout(() => firstInput.focus(), 30);
  }

  function close(){
    document.getElementById('modalOverlay').classList.remove('is-open');
    if(currentOnClose){ const fn = currentOnClose; currentOnClose = null; fn(); }
  }

  return { open, close };
})();

// close modal on backdrop click / Escape
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if(e.target.id === 'modalOverlay') Modal.close();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && document.getElementById('modalOverlay').classList.contains('is-open')){
    Modal.close();
  }
});

// ---------- NAVIGATION ----------
function switchView(viewKey){
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.view === viewKey);
  });
  document.querySelectorAll('.view').forEach(sec => {
    sec.classList.toggle('is-active', sec.id === `view-${viewKey}`);
  });
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ---------- BOOT ----------
document.addEventListener('DOMContentLoaded', () => {
  // Teacher view
  TeacherView.render();
  document.getElementById('teacherSelect').addEventListener('change', () => TeacherView.render());
  document.getElementById('addTeacherSlotBtn').addEventListener('click', () => TeacherView.openSlotModal({ day:'Mon', slotId:'t1' }));
  document.getElementById('manageTeachersBtn').addEventListener('click', () => TeacherView.openManageTeachers());

  // Section view
  SectionView.render();
  document.getElementById('sectionSelect').addEventListener('change', () => SectionView.render());
  document.getElementById('addSectionSlotBtn').addEventListener('click', () => SectionView.openSlotModal({ day:'Mon', slotId:'t1' }));
  document.getElementById('manageSectionsBtn').addEventListener('click', () => SectionView.openManageSections());

  // Calendar view
  CalendarView.init();
  CalendarView.render();
  document.getElementById('todayBtn').addEventListener('click', () => CalendarView.goToday());
  document.getElementById('prevMonthBtn').addEventListener('click', () => CalendarView.prevMonth());
  document.getElementById('nextMonthBtn').addEventListener('click', () => CalendarView.nextMonth());
  document.getElementById('addEventBtn').addEventListener('click', () => CalendarView.openEventForm());
});
