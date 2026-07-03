/* =========================================================
   CALENDAR-VIEW.JS
   ========================================================= */

const CalendarView = (() => {

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const TYPE_META = {
    holiday: { label:'Holiday', pillClass:'pill-holiday' },
    event:   { label:'School Event', pillClass:'pill-event' },
    exam:    { label:'Exam Period', pillClass:'pill-exam' },
  };

  let viewYear, viewMonth; // 0-indexed month

  function init(){
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
  }

  function pad(n){ return n.toString().padStart(2,'0'); }
  function isoOf(y,m,d){ return `${y}-${pad(m+1)}-${pad(d)}`; }

  function render(){
    const label = document.getElementById('calMonthLabel');
    label.textContent = `${MONTH_NAMES[viewMonth]} ${viewYear}`;

    const grid = document.getElementById('calGrid');
    const { events } = WC.get();

    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay(); // 0 = Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const todayIso = new Date().toISOString().slice(0,10);

    let cells = [];

    // leading days from previous month
    for(let i = startWeekday - 1; i >= 0; i--){
      cells.push({ day: daysInPrevMonth - i, outside:true });
    }
    // current month days
    for(let d = 1; d <= daysInMonth; d++){
      cells.push({ day:d, outside:false, iso: isoOf(viewYear, viewMonth, d) });
    }
    // trailing days to complete final week row
    let trail = 1;
    while(cells.length % 7 !== 0){
      cells.push({ day: trail++, outside:true });
    }

    grid.innerHTML = cells.map(c => {
      if(c.outside){
        return `<div class="cal-day is-outside"><span class="cal-daynum">${c.day}</span></div>`;
      }
      const dayEvents = events.filter(e => e.date === c.iso).sort((a,b)=> a.title.localeCompare(b.title));
      const isToday = c.iso === todayIso;
      const visible = dayEvents.slice(0,3);
      const overflow = dayEvents.length - visible.length;
      return `<div class="cal-day ${isToday?'is-today':''}" data-date="${c.iso}">
        <span class="cal-daynum">${c.day}</span>
        <div class="cal-events">
          ${visible.map(e => `<span class="cal-event-pill ${TYPE_META[e.type]?.pillClass||'pill-event'}" title="${escapeHtml(e.title)}">${escapeHtml(e.title)}</span>`).join('')}
          ${overflow > 0 ? `<span class="cal-more">+${overflow} more</span>` : ''}
        </div>
      </div>`;
    }).join('');

    grid.querySelectorAll('.cal-day[data-date]').forEach(el => {
      el.addEventListener('click', () => openDayModal(el.dataset.date));
    });

    renderUpcoming();
  }

  function renderUpcoming(){
    const { events } = WC.get();
    const todayIso = new Date().toISOString().slice(0,10);
    const upcoming = events
      .filter(e => e.date >= todayIso)
      .sort((a,b) => a.date.localeCompare(b.date))
      .slice(0, 6);

    const list = document.getElementById('upcomingList');
    if(upcoming.length === 0){
      list.innerHTML = `<li class="upcoming-empty">No upcoming events yet. Add holidays or school events using the button above.</li>`;
      return;
    }
    list.innerHTML = upcoming.map(e => {
      const d = new Date(e.date + 'T00:00:00');
      const dateLabel = `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}`;
      const meta = TYPE_META[e.type] || TYPE_META.event;
      return `<li class="upcoming-item">
        <span class="upcoming-date">${dateLabel}</span>
        <span class="upcoming-title">${escapeHtml(e.title)}</span>
        <span class="upcoming-type" style="background:var(--${e.type === 'holiday' ? 'holiday' : e.type === 'exam' ? 'exam' : 'event'})">${meta.label}</span>
      </li>`;
    }).join('');
  }

  // ---------- Day detail / add event modal ----------
  function openDayModal(iso){
    const d = new Date(iso + 'T00:00:00');
    const niceDate = `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    renderDayModalContent(iso, niceDate);
  }

  function renderDayModalContent(iso, niceDate){
    const { events } = WC.get();
    const dayEvents = events.filter(e => e.date === iso);

    Modal.open({
      title: niceDate,
      wide:true,
      body: `
        <div class="manage-list" id="dayEventList" style="margin-bottom:16px;">
          ${dayEvents.length ? dayEvents.map(e => `
            <div class="manage-row" data-id="${e.id}">
              <div>
                <div class="manage-row-name">${escapeHtml(e.title)}</div>
                <div class="manage-row-sub">${TYPE_META[e.type]?.label || 'School Event'}${e.note ? ' &middot; ' + escapeHtml(e.note) : ''}</div>
              </div>
              <div class="manage-row-actions">
                <button class="icon-btn" data-act="edit" aria-label="Edit event">${pencilIcon()}</button>
                <button class="icon-btn danger" data-act="del" aria-label="Remove event">${trashIcon()}</button>
              </div>
            </div>`).join('') : `<p style="color:var(--ink-soft); font-size:13.5px;">No events on this day yet.</p>`}
        </div>
        <button class="btn btn-ghost" id="addEventForDayBtn" style="width:100%;">+ Add Event for this Day</button>
      `,
      primaryLabel:'Close',
      onPrimary: () => true,
      onMount: (card) => {
        card.querySelectorAll('.manage-row').forEach(row => {
          const id = row.dataset.id;
          row.querySelector('[data-act="del"]').addEventListener('click', () => {
            WC.update(state => { state.events = state.events.filter(x => x.id !== id); });
            Toast.show('Event removed.');
            render();
            renderDayModalContent(iso, niceDate);
          });
          row.querySelector('[data-act="edit"]').addEventListener('click', () => {
            openEventForm(iso, id);
          });
        });
        card.querySelector('#addEventForDayBtn').addEventListener('click', () => openEventForm(iso));
      }
    });
  }

  // ---------- Add/edit event form ----------
  function openEventForm(iso, editId){
    const { events } = WC.get();
    const editing = editId ? events.find(e => e.id === editId) : null;
    const dateVal = editing ? editing.date : (iso || new Date().toISOString().slice(0,10));

    Modal.open({
      title: editing ? 'Edit Event' : 'Add Event',
      body: `
        <div class="field">
          <label>Title</label>
          <input type="text" id="evTitle" placeholder="e.g. Independence Day" value="${editing ? escapeHtml(editing.title) : ''}">
          <div class="field-error" id="evTitleErr">Title is required.</div>
        </div>
        <div class="field">
          <label>Date</label>
          <input type="date" id="evDate" value="${dateVal}">
        </div>
        <div class="field">
          <label>Type</label>
          <div class="color-radio-row" id="evTypeRow">
            ${Object.entries(TYPE_META).map(([key, m]) => `
              <label class="color-radio ${editing && editing.type===key ? 'is-checked' : (!editing && key==='event' ? 'is-checked':'')}">
                <input type="radio" name="evType" value="${key}" ${editing ? (editing.type===key?'checked':'') : (key==='event'?'checked':'')}>
                <span class="dot" style="background:var(--${key})"></span>${m.label}
              </label>
            `).join('')}
          </div>
        </div>
        <div class="field">
          <label>Note (optional)</label>
          <textarea id="evNote" rows="2" placeholder="Any extra detail...">${editing ? escapeHtml(editing.note||'') : ''}</textarea>
        </div>
      `,
      footRight: editing
        ? [{ label:'Delete', cls:'btn-danger', onClick: () => {
              WC.update(state => { state.events = state.events.filter(x => x.id !== editing.id); });
              Toast.show('Event removed.');
              render();
              Modal.close();
            }}]
        : [],
      onMount: (card) => {
        card.querySelectorAll('#evTypeRow .color-radio').forEach(label => {
          label.addEventListener('click', () => {
            card.querySelectorAll('#evTypeRow .color-radio').forEach(l => l.classList.remove('is-checked'));
            label.classList.add('is-checked');
          });
        });
      },
      primaryLabel: editing ? 'Save Changes' : 'Add Event',
      onPrimary: (card) => {
        const title = card.querySelector('#evTitle').value.trim();
        const date = card.querySelector('#evDate').value;
        const type = card.querySelector('input[name="evType"]:checked')?.value || 'event';
        const note = card.querySelector('#evNote').value.trim();
        const titleErr = card.querySelector('#evTitleErr');
        titleErr.classList.remove('is-shown');

        if(!title){ titleErr.classList.add('is-shown'); return false; }
        if(!date){ Toast.show('Please choose a date.'); return false; }

        WC.update(state => {
          if(editing){
            const target = state.events.find(e => e.id === editing.id);
            Object.assign(target, { title, date, type, note });
          } else {
            state.events.push({ id: WC.cryptoId(), title, date, type, note });
          }
        });
        Toast.show(editing ? 'Event updated.' : 'Event added.');
        render();
        return true;
      }
    });
  }

  function goToday(){ const n = new Date(); viewYear = n.getFullYear(); viewMonth = n.getMonth(); render(); }
  function prevMonth(){ viewMonth--; if(viewMonth<0){ viewMonth=11; viewYear--; } render(); }
  function nextMonth(){ viewMonth++; if(viewMonth>11){ viewMonth=0; viewYear++; } render(); }

  return { init, render, goToday, prevMonth, nextMonth, openEventForm: () => openEventForm(null) };
})();
