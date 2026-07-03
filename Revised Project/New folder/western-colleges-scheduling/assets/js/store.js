/* =========================================================
   STORE.JS — shared state, persistence, helpers
   ========================================================= */

const WC = (() => {

  const STORAGE_KEY = 'wc_scheduling_v1';

  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];

  // 7:00 AM – 5:00 PM in 30-min rows for flexible slot placement,
  // but displayed as hourly bands with a lunch break row.
  const TIME_SLOTS = [
    { id:'t1', label:'7:00 – 8:00',  start:7*60,  end:8*60  },
    { id:'t2', label:'8:00 – 9:00',  start:8*60,  end:9*60  },
    { id:'t3', label:'9:00 – 10:00', start:9*60,  end:10*60 },
    { id:'t4', label:'10:00 – 11:00',start:10*60, end:11*60 },
    { id:'t5', label:'11:00 – 12:00',start:11*60, end:12*60 },
    { id:'lunch', label:'12:00 – 1:00', start:12*60, end:13*60, isBreak:true, breakLabel:'Lunch Break' },
    { id:'t6', label:'1:00 – 2:00',  start:13*60, end:14*60 },
    { id:'t7', label:'2:00 – 3:00',  start:14*60, end:15*60 },
    { id:'t8', label:'3:00 – 4:00',  start:15*60, end:16*60 },
    { id:'t9', label:'4:00 – 5:00',  start:16*60, end:17*60 },
  ];

  function defaultState(){
    return {
      teachers: [
        { id:'tea-1', name:'Mr. Santos, R.',   dept:'Mathematics' },
        { id:'tea-2', name:'Ms. Reyes, A.',    dept:'English' },
        { id:'tea-3', name:'Mr. Cruz, J.',     dept:'Science' },
      ],
      sections: [
        { id:'sec-1', name:'Grade 7 - Faith',   adviser:'Ms. Reyes, A.' },
        { id:'sec-2', name:'Grade 8 - Hope',    adviser:'Mr. Santos, R.' },
        { id:'sec-3', name:'Grade 9 - Charity', adviser:'Mr. Cruz, J.' },
      ],
      // teacherSlots / sectionSlots: { id, day, slotId, subject, section/teacher, room, hue }
      teacherSlots: [
        { id:cryptoId(), teacherId:'tea-1', day:'Mon', slotId:'t1', subject:'Mathematics 7', withWhom:'Grade 7 - Faith', room:'Rm 101', hue:0 },
        { id:cryptoId(), teacherId:'tea-1', day:'Mon', slotId:'t2', subject:'Mathematics 8', withWhom:'Grade 8 - Hope', room:'Rm 101', hue:1 },
        { id:cryptoId(), teacherId:'tea-2', day:'Tue', slotId:'t3', subject:'English 7', withWhom:'Grade 7 - Faith', room:'Rm 203', hue:2 },
      ],
      sectionSlots: [
        { id:cryptoId(), sectionId:'sec-1', day:'Mon', slotId:'t1', subject:'Mathematics 7', withWhom:'Mr. Santos, R.', room:'Rm 101', hue:0 },
        { id:cryptoId(), sectionId:'sec-1', day:'Tue', slotId:'t3', subject:'English 7', withWhom:'Ms. Reyes, A.', room:'Rm 203', hue:2 },
      ],
      events: [
        // events use ISO date strings (YYYY-MM-DD)
        { id:cryptoId(), date: isoToday(), title:'Founding Anniversary', type:'event', note:'' },
      ],
    };
  }

  function cryptoId(){
    return 'id-' + Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4);
  }
  function isoToday(){
    const d = new Date();
    return d.toISOString().slice(0,10);
  }

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // light shape-check
      if(!parsed.teachers || !parsed.sections) return defaultState();
      return parsed;
    }catch(e){
      console.warn('WC store: failed to load, resetting', e);
      return defaultState();
    }
  }

  let state = load();

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function get(){ return state; }

  function update(mutatorFn){
    mutatorFn(state);
    save();
  }

  function slotById(id){ return TIME_SLOTS.find(s => s.id === id); }

  return {
    DAYS, TIME_SLOTS,
    get, update, save,
    cryptoId, slotById,
    resetAll(){ state = defaultState(); save(); },
  };
})();
