/* =========================================================
   TEACHER-VIEW.JS
   ========================================================= */

const TeacherView = (() => {

  function currentTeacherId(){
    const sel = document.getElementById('teacherSelect');
    return sel ? sel.value : null;
  }

  function populateTeacherSelect(){
    const sel = document.getElementById('teacherSelect');
    const { teachers } = WC.get();
    const prev = sel.value;
    sel.innerHTML = teachers.map(t => `<option value="${t.id}">${escapeHtml(t.name)}</option>`).join('');
    if(teachers.some(t => t.id === prev)) sel.value = prev;
  }

  function renderMeta(){
    const { teachers, teacherSlots } = WC.get();
    const teacher = teachers.find(t => t.id === currentTeacherId());
    const meta = document.getElementById('teacherMeta');
    if(!teacher){
      meta.innerHTML = `<div class="meta-item"><span class="meta-label">Status</span><span class="meta-value small">No teacher selected</span></div>`;
      return;
    }
    const mySlots = teacherSlots.filter(s => s.teacherId === teacher.id);
    const hours = mySlots.length; // 1hr blocks
    const sections = new Set(mySlots.map(s => s.withWhom)).size;
    meta.innerHTML = `
      <div class="meta-item"><span class="meta-label">Teacher</span><span class="meta-value">${escapeHtml(teacher.name)}</span></div>
      <div class="meta-item"><span class="meta-label">Department</span><span class="meta-value small">${escapeHtml(teacher.dept || '—')}</span></div>
      <div class="meta-item"><span class="meta-label">Teaching Load</span><span class="meta-value small">${hours} hr${hours===1?'':'s'} / week</span></div>
      <div class="meta-item"><span class="meta-label">Sections Handled</span><span class="meta-value small">${sections}</span></div>
    `;
  }

  function renderGrid(){
    const head = document.getElementById('teacherGridHead');
    const body = document.getElementById('teacherGridBody');
    const { teacherSlots } = WC.get();
    const teacherId = currentTeacherId();

    head.innerHTML = `<th>Time</th>` + WC.DAYS.map(d => `<th>${d}</th>`).join('');

    body.innerHTML = WC.TIME_SLOTS.map(slot => {
      if(slot.isBreak){
        return `<tr class="row-break"><td>${slot.label}</td><td colspan="${WC.DAYS.length}" style="text-align:center; color:var(--gold-600); font-style:italic; font-size:12.5px;">${slot.breakLabel}</td></tr>`;
      }
      const cells = WC.DAYS.map(day => {
        const found = teacherSlots.find(s => s.teacherId === teacherId && s.day === day && s.slotId === slot.id);
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
    populateTeacherSelect();
    renderMeta();
    renderGrid();
  }

  // ---------- Add/Edit class slot modal ----------
  function openSlotModal({ day, slotId, editId } = {}){
    const { teacherSlots, teachers, sections } = WC.get();
    const teacherId = currentTeacherId();
    const teacher = teachers.find(t => t.id === teacherId);
    let editing = null;
    if(editId) editing = teacherSlots.find(s => s.id === editId);
    if(editing){ day = editing.day; slotId = editing.slotId; }

    const sectionOptions = sections.map(s => `<option value="${escapeHtml(s.name)}" ${editing && editing.withWhom === s.name ? 'selected':''}>${escapeHtml(s.name)}</option>`).join('');

    Modal.open({
      title: editing ? 'Edit Class' : 'Add Class',
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
          <label>Section</label>
          <select id="slotSection">
            <option value="">— Select section —</option>
            ${sectionOptions}
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
        <div class="field-error" id="slotConflictErr">This teacher already has a class at this time.</div>
      `,
      footRight: editing
        ? [{ label:'Delete', cls:'btn-danger', onClick: () => { removeSlot(editing.id); Modal.close(); } }]
        : [],
      onMount: (card) => {
        if(editing && editing.withWhom){
          card.querySelector('#slotSection').value = editing.withWhom;
        }
      },
      primaryLabel: editing ? 'Save Changes' : 'Add Class',
      onPrimary: (card) => {
        const dayVal = card.querySelector('#slotDay').value;
        const timeVal = card.querySelector('#slotTime').value;
        const subjectVal = card.querySelector('#slotSubject').value.trim();
        const sectionVal = card.querySelector('#slotSection').value;
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
        if(!teacherId){
          Toast.show('Select a teacher first.');
          return false;
        }
        const conflict = teacherSlots.find(s =>
          s.teacherId === teacherId && s.day === dayVal && s.slotId === timeVal &&
          (!editing || s.id !== editing.id)
        );
        if(conflict){
          conflictErr.classList.add('is-shown');
          return false;
        }

        WC.update(state => {
          if(editing){
            const target = state.teacherSlots.find(s => s.id === editing.id);
            Object.assign(target, { day: dayVal, slotId: timeVal, subject: subjectVal, withWhom: sectionVal, room: roomVal, hue: Number(hueVal) });
          } else {
            state.teacherSlots.push({
              id: WC.cryptoId(), teacherId, day: dayVal, slotId: timeVal,
              subject: subjectVal, withWhom: sectionVal, room: roomVal, hue: Number(hueVal)
            });
          }
        });
        Toast.show(editing ? 'Class updated.' : 'Class added.');
        render();
        return true;
      }
    });
  }

  function removeSlot(id){
    WC.update(state => { state.teacherSlots = state.teacherSlots.filter(s => s.id !== id); });
    Toast.show('Class removed.');
    render();
  }

  // ---------- Manage teachers modal ----------
  function openManageTeachers(){
    renderManageList();
  }

  function renderManageList(){
    const { teachers, teacherSlots } = WC.get();
    Modal.open({
      title:'Manage Teachers',
      wide:true,
      body: `
        <div class="manage-list" id="manageTeacherList">
          ${teachers.map(t => {
            const count = teacherSlots.filter(s => s.teacherId === t.id).length;
            return `<div class="manage-row" data-id="${t.id}">
              <div>
                <div class="manage-row-name">${escapeHtml(t.name)}</div>
                <div class="manage-row-sub">${escapeHtml(t.dept || '—')} &middot; ${count} class${count===1?'':'es'} scheduled</div>
              </div>
              <div class="manage-row-actions">
                <button class="icon-btn" data-act="edit" aria-label="Edit teacher">${pencilIcon()}</button>
                <button class="icon-btn danger" data-act="del" aria-label="Remove teacher">${trashIcon()}</button>
              </div>
            </div>`;
          }).join('') || `<p class="empty-state-inline" style="color:var(--ink-soft); font-size:13.5px;">No teachers yet. Add one below.</p>`}
        </div>
        <div class="add-inline">
          <input type="text" id="newTeacherName" placeholder="Teacher name (e.g. Mr. Dela Cruz, P.)">
          <input type="text" id="newTeacherDept" placeholder="Department" style="max-width:160px;">
          <button class="btn btn-primary" id="newTeacherBtn">Add</button>
        </div>
      `,
      footRight: [],
      primaryLabel: 'Done',
      onPrimary: () => true,
      onMount: (card) => {
        card.querySelectorAll('.manage-row').forEach(row => {
          const id = row.dataset.id;
          row.querySelector('[data-act="del"]').addEventListener('click', () => {
            const t = WC.get().teachers.find(x=>x.id===id);
            if(!confirm(`Remove ${t.name}? Their scheduled classes will also be removed.`)) return;
            WC.update(state => {
              state.teachers = state.teachers.filter(x => x.id !== id);
              state.teacherSlots = state.teacherSlots.filter(s => s.teacherId !== id);
            });
            Toast.show('Teacher removed.');
            render();
            renderManageList();
          });
          row.querySelector('[data-act="edit"]').addEventListener('click', () => {
            openEditTeacherModal(id);
          });
        });
        card.querySelector('#newTeacherBtn').addEventListener('click', () => {
          const nameInput = card.querySelector('#newTeacherName');
          const deptInput = card.querySelector('#newTeacherDept');
          const name = nameInput.value.trim();
          if(!name){ nameInput.focus(); return; }
          WC.update(state => {
            state.teachers.push({ id: WC.cryptoId(), name, dept: deptInput.value.trim() });
          });
          nameInput.value=''; deptInput.value='';
          Toast.show('Teacher added.');
          render();
          renderManageList();
        });
      }
    });
  }

  function openEditTeacherModal(id){
    const t = WC.get().teachers.find(x => x.id === id);
    if(!t) return;
    Modal.open({
      title:'Edit Teacher',
      body:`
        <div class="field"><label>Name</label><input type="text" id="editTeacherName" value="${escapeHtml(t.name)}"></div>
        <div class="field"><label>Department</label><input type="text" id="editTeacherDept" value="${escapeHtml(t.dept||'')}"></div>
      `,
      primaryLabel:'Save Changes',
      onPrimary:(card) => {
        const name = card.querySelector('#editTeacherName').value.trim();
        if(!name) return false;
        WC.update(state => {
          const target = state.teachers.find(x=>x.id===id);
          target.name = name;
          target.dept = card.querySelector('#editTeacherDept').value.trim();
        });
        Toast.show('Teacher updated.');
        render();
        return true;
      },
      onClose: () => renderManageList()
    });
  }

  return { render, openSlotModal, openManageTeachers, currentTeacherId };
})();
