/* =========================================================
   SECTION-VIEW.JS
   ========================================================= */

const SectionView = (() => {

  function currentSectionId(){
    const sel = document.getElementById('sectionSelect');
    return sel ? sel.value : null;
  }

  function populateSectionSelect(){
    const sel = document.getElementById('sectionSelect');
    const { sections } = WC.get();
    const prev = sel.value;
    sel.innerHTML = sections.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
    if(sections.some(s => s.id === prev)) sel.value = prev;
  }

  function renderMeta(){
    const { sections, sectionSlots } = WC.get();
    const section = sections.find(s => s.id === currentSectionId());
    const meta = document.getElementById('sectionMeta');
    if(!section){
      meta.innerHTML = `<div class="meta-item"><span class="meta-label">Status</span><span class="meta-value small">No section selected</span></div>`;
      return;
    }
    const mySlots = sectionSlots.filter(s => s.sectionId === section.id);
    const hours = mySlots.length;
    const subjects = new Set(mySlots.map(s => s.subject)).size;
    meta.innerHTML = `
      <div class="meta-item"><span class="meta-label">Section</span><span class="meta-value">${escapeHtml(section.name)}</span></div>
      <div class="meta-item"><span class="meta-label">Adviser</span><span class="meta-value small">${escapeHtml(section.adviser || '—')}</span></div>
      <div class="meta-item"><span class="meta-label">Class Hours</span><span class="meta-value small">${hours} hr${hours===1?'':'s'} / week</span></div>
      <div class="meta-item"><span class="meta-label">Subjects</span><span class="meta-value small">${subjects}</span></div>
    `;
  }

  function renderGrid(){
    const head = document.getElementById('sectionGridHead');
    const body = document.getElementById('sectionGridBody');
    const { sectionSlots } = WC.get();
    const sectionId = currentSectionId();

    head.innerHTML = `<th>Time</th>` + WC.DAYS.map(d => `<th>${d}</th>`).join('');

    body.innerHTML = WC.TIME_SLOTS.map(slot => {
      if(slot.isBreak){
        return `<tr class="row-break"><td>${slot.label}</td><td colspan="${WC.DAYS.length}" style="text-align:center; color:var(--gold-600); font-style:italic; font-size:12.5px;">${slot.breakLabel}</td></tr>`;
      }
      const cells = WC.DAYS.map(day => {
        const found = sectionSlots.find(s => s.sectionId === sectionId && s.day === day && s.slotId === slot.id);
        if(found){
          return `<td>
            <div class="slot-card" data-hue="${found.hue ?? 0}" data-action="edit-slot" data-id="${found.id}">
              <span class="slot-subject">${escapeHtml(found.subject)}</span>
              <span class="slot-sub">${escapeHtml(found.withWhom || '')}</span>
              <span class="slot-sub">${escapeHtml(found.room || '')}</span>
            </div>
          </td>`;
        }
        return `<td><div class="cell-empty" data-action="add-slot" data-day="${day}" data-slot="${slot.id}"></div></td>`;
      }).join('');
      return `<tr><td>${slot.label}</td>${cells}</tr>`;
    }).join('');

    body.querySelectorAll('[data-action="add-slot"]').forEach(el => {
      el.addEventListener('click', () => openSlotModal({ day: el.dataset.day, slotId: el.dataset.slot }));
    });
    body.querySelectorAll('[data-action="edit-slot"]').forEach(el => {
      el.addEventListener('click', () => openSlotModal({ editId: el.dataset.id }));
    });
  }

  function render(){
    populateSectionSelect();
    renderMeta();
    renderGrid();
  }

  // ---------- Add/Edit subject slot modal ----------
  function openSlotModal({ day, slotId, editId } = {}){
    const { sectionSlots, teachers } = WC.get();
    const sectionId = currentSectionId();
    let editing = null;
    if(editId) editing = sectionSlots.find(s => s.id === editId);
    if(editing){ day = editing.day; slotId = editing.slotId; }

    const teacherOptions = teachers.map(t => `<option value="${escapeHtml(t.name)}" ${editing && editing.withWhom === t.name ? 'selected':''}>${escapeHtml(t.name)}</option>`).join('');

    Modal.open({
      title: editing ? 'Edit Subject' : 'Add Subject',
      body: `
        <div class="field-row">
          <div class="field">
            <label>Day</label>
            <select id="slotDay">${WC.DAYS.map(d => `<option value="${d}" ${d===day?'selected':''}>${d}</option>`).join('')}</select>
          </div>
          <div class="field">
            <label>Time Slot</label>
            <select id="slotTime">${WC.TIME_SLOTS.filter(s=>!s.isBreak).map(s => `<option value="${s.id}" ${s.id===slotId?'selected':''}>${s.label}</option>`).join('')}</select>
          </div>
        </div>
        <div class="field">
          <label>Subject</label>
          <input type="text" id="slotSubject" placeholder="e.g. Mathematics 7" value="${editing ? escapeHtml(editing.subject) : ''}">
          <div class="field-error" id="slotSubjectErr">Subject is required.</div>
        </div>
        <div class="field">
          <label>Teacher</label>
          <select id="slotTeacher">
            <option value="">— Select teacher —</option>
            ${teacherOptions}
          </select>
        </div>
        <div class="field">
          <label>Room (optional)</label>
          <input type="text" id="slotRoom" placeholder="e.g. Rm 101" value="${editing ? escapeHtml(editing.room||'') : ''}">
        </div>
        <div class="field">
          <label>Color tag</label>
          ${colorRadios(editing ? editing.hue : 0)}
        </div>
        <div class="field-error" id="slotConflictErr">This section already has a subject at this time.</div>
      `,
      footRight: editing
        ? [{ label:'Delete', cls:'btn-danger', onClick: () => { removeSlot(editing.id); Modal.close(); } }]
        : [],
      onMount: (card) => {
        if(editing && editing.withWhom){
          card.querySelector('#slotTeacher').value = editing.withWhom;
        }
      },
      primaryLabel: editing ? 'Save Changes' : 'Add Subject',
      onPrimary: (card) => {
        const dayVal = card.querySelector('#slotDay').value;
        const timeVal = card.querySelector('#slotTime').value;
        const subjectVal = card.querySelector('#slotSubject').value.trim();
        const teacherVal = card.querySelector('#slotTeacher').value;
        const roomVal = card.querySelector('#slotRoom').value.trim();
        const hueVal = card.querySelector('input[name="hue"]:checked')?.value ?? '0';

        const subjectErr = card.querySelector('#slotSubjectErr');
        const conflictErr = card.querySelector('#slotConflictErr');
        subjectErr.classList.remove('is-shown');
        conflictErr.classList.remove('is-shown');

        if(!subjectVal){
          subjectErr.classList.add('is-shown');
          return false;
        }
        if(!sectionId){
          Toast.show('Select a section first.');
          return false;
        }
        const conflict = sectionSlots.find(s =>
          s.sectionId === sectionId && s.day === dayVal && s.slotId === timeVal &&
          (!editing || s.id !== editing.id)
        );
        if(conflict){
          conflictErr.classList.add('is-shown');
          return false;
        }

        WC.update(state => {
          if(editing){
            const target = state.sectionSlots.find(s => s.id === editing.id);
            Object.assign(target, { day: dayVal, slotId: timeVal, subject: subjectVal, withWhom: teacherVal, room: roomVal, hue: Number(hueVal) });
          } else {
            state.sectionSlots.push({
              id: WC.cryptoId(), sectionId, day: dayVal, slotId: timeVal,
              subject: subjectVal, withWhom: teacherVal, room: roomVal, hue: Number(hueVal)
            });
          }
        });
        Toast.show(editing ? 'Subject updated.' : 'Subject added.');
        render();
        return true;
      }
    });
  }

  function removeSlot(id){
    WC.update(state => { state.sectionSlots = state.sectionSlots.filter(s => s.id !== id); });
    Toast.show('Subject removed.');
    render();
  }

  // ---------- Manage sections modal ----------
  function openManageSections(){
    renderManageList();
  }

  function renderManageList(){
    const { sections, sectionSlots } = WC.get();
    Modal.open({
      title:'Manage Sections',
      wide:true,
      body: `
        <div class="manage-list" id="manageSectionList">
          ${sections.map(s => {
            const count = sectionSlots.filter(x => x.sectionId === s.id).length;
            return `<div class="manage-row" data-id="${s.id}">
              <div>
                <div class="manage-row-name">${escapeHtml(s.name)}</div>
                <div class="manage-row-sub">Adviser: ${escapeHtml(s.adviser || '—')} &middot; ${count} subject${count===1?'':'s'} scheduled</div>
              </div>
              <div class="manage-row-actions">
                <button class="icon-btn" data-act="edit" aria-label="Edit section">${pencilIcon()}</button>
                <button class="icon-btn danger" data-act="del" aria-label="Remove section">${trashIcon()}</button>
              </div>
            </div>`;
          }).join('') || `<p style="color:var(--ink-soft); font-size:13.5px;">No sections yet. Add one below.</p>`}
        </div>
        <div class="add-inline">
          <input type="text" id="newSectionName" placeholder="Section name (e.g. Grade 10 - Diligence)">
          <input type="text" id="newSectionAdviser" placeholder="Adviser" style="max-width:160px;">
          <button class="btn btn-primary" id="newSectionBtn">Add</button>
        </div>
      `,
      footRight: [],
      primaryLabel: 'Done',
      onPrimary: () => true,
      onMount: (card) => {
        card.querySelectorAll('.manage-row').forEach(row => {
          const id = row.dataset.id;
          row.querySelector('[data-act="del"]').addEventListener('click', () => {
            const s = WC.get().sections.find(x=>x.id===id);
            if(!confirm(`Remove ${s.name}? Its scheduled subjects will also be removed.`)) return;
            WC.update(state => {
              state.sections = state.sections.filter(x => x.id !== id);
              state.sectionSlots = state.sectionSlots.filter(x => x.sectionId !== id);
            });
            Toast.show('Section removed.');
            render();
            renderManageList();
          });
          row.querySelector('[data-act="edit"]').addEventListener('click', () => {
            openEditSectionModal(id);
          });
        });
        card.querySelector('#newSectionBtn').addEventListener('click', () => {
          const nameInput = card.querySelector('#newSectionName');
          const advInput = card.querySelector('#newSectionAdviser');
          const name = nameInput.value.trim();
          if(!name){ nameInput.focus(); return; }
          WC.update(state => {
            state.sections.push({ id: WC.cryptoId(), name, adviser: advInput.value.trim() });
          });
          nameInput.value=''; advInput.value='';
          Toast.show('Section added.');
          render();
          renderManageList();
        });
      }
    });
  }

  function openEditSectionModal(id){
    const s = WC.get().sections.find(x => x.id === id);
    if(!s) return;
    Modal.open({
      title:'Edit Section',
      body:`
        <div class="field"><label>Section Name</label><input type="text" id="editSectionName" value="${escapeHtml(s.name)}"></div>
        <div class="field"><label>Adviser</label><input type="text" id="editSectionAdviser" value="${escapeHtml(s.adviser||'')}"></div>
      `,
      primaryLabel:'Save Changes',
      onPrimary:(card) => {
        const name = card.querySelector('#editSectionName').value.trim();
        if(!name) return false;
        WC.update(state => {
          const target = state.sections.find(x=>x.id===id);
          target.name = name;
          target.adviser = card.querySelector('#editSectionAdviser').value.trim();
        });
        Toast.show('Section updated.');
        render();
        return true;
      },
      onClose: () => renderManageList()
    });
  }

  return { render, openSlotModal, openManageSections, currentSectionId };
})();
