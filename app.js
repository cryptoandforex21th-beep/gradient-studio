(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const menuButton = $('#menu-button');
  const mobileNav = $('#mobile-nav');
  const setMenu = (open) => {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    document.body.classList.toggle('menu-open', open);
    $('#main').inert = open;
    $('.footer').inert = open;
    $('.skip-link').inert = open;
  };
  menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  $$('.header a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {if (e.key === 'Escape' && !mobileNav.hidden) {setMenu(false);menuButton.focus();}});
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || mobileNav.hidden) return;
    const focusable = $$('.header a, .header button, #mobile-nav a').filter(el => el.offsetParent !== null);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
    else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
  });
  const desktop = window.matchMedia('(min-width: 901px)');
  desktop.addEventListener('change', e => {if(e.matches) setMenu(false);});

  const tabs = $$('[role="tab"]');
  function activateTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if(event.key === 'ArrowRight') next = (index+1)%tabs.length;
      else if(event.key === 'ArrowLeft') next = (index-1+tabs.length)%tabs.length;
      else if(event.key === 'Home') next = 0;
      else if(event.key === 'End') next = tabs.length-1;
      if(next !== undefined){event.preventDefault();activateTab(tabs[next],true);}
    });
  });
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    $$('[data-filter]').forEach(item => {const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
    let count=0;
    $$('.study-card').forEach(card => {card.hidden=button.dataset.filter!=='all' && card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
    $('#gallery-status').textContent = `${count} eksplorasi${button.dataset.filter==='all'?'':` · ${button.textContent}`}`;
  }));
  $$('[data-service]').forEach(link => link.addEventListener('click', () => {$('#service-select').value=link.dataset.service;}));

  const concepts = {
    courtyard: {
      title: 'Studi Paviliun Halaman',
      label: 'Arsitektur · Eksplorasi Konsep',
      image: 'assets/courtyard-concept.png',
      alt: 'Ilustrasi konsep paviliun tropis dengan halaman tengah dan naungan lebar',
      description: 'Studi konsep paviliun dengan halaman tengah, pohon peneduh, dan naungan atap lebar.',
      facts: [
        ['Status', 'Konsep eksploratif'],
        ['Media', 'Visual konseptual AI'],
        ['Fokus', 'Halaman & naungan']
      ],
      sections: [
        ['Eksplorasi Halaman Tengah', 'Halaman tengah berfungsi sebagai ruang transisi sekaligus pendingin alami mikro. Bukaan naungan lebar dirancang untuk menangkap sirkulasi udara dan menyaring sinar matahari langsung.'],
        ['Catatan Batasan Teknis', 'Materi ini merupakan studi visual konseptual tahap awal GradiEnt Studio. Detail struktural terinci, spesifikasi material, dan simulasi iklim komprehensif dikembangkan pada tahap perancangan lanjutan.']
      ]
    },
    space: {
      title: 'Diagram Organisasi Ruang',
      label: 'Riset Spasial · Diagram Konsep',
      image: 'assets/space-study.svg',
      alt: 'Diagram konseptual hubungan ruang terbuka, naungan, dan ruang bersama',
      description: 'Diagram hubungan fungsional antara ruang bersama, halaman terbuka, dan area bernaung.',
      facts: [
        ['Status', 'Diagram konsep'],
        ['Skala', 'Diagram skematik'],
        ['Fokus', 'Hubungan antarruang']
      ],
      sections: [
        ['Hubungan Fungsional', 'Diagram menempatkan ruang terbuka, naungan, dan ruang bersama sebagai tiga bagian yang saling terhubung untuk mengatur alur aktivitas harian.'],
        ['Dasar Rancangan Denah', 'Susunan skematik ini menjadi landasan sebelum menentukan dimensi fisik, aksesibilitas, dan orientasi tapak secara mendalam.']
      ]
    },
    light: {
      title: 'Diagram Cahaya & Naungan',
      label: 'Riset Pencahayaan · Diagram Konsep',
      image: 'assets/light-study.svg',
      alt: 'Diagram prinsip overhang menyaring sinar matahari tropis',
      description: 'Diagram prinsip overhang dan peneduh dalam mengatur penetrasi cahaya alami.',
      facts: [
        ['Status', 'Diagram prinsip'],
        ['Metode', 'Geometri naungan'],
        ['Fokus', 'Bukaan & pembiasan']
      ],
      sections: [
        ['Pengendalian Radiasi Matahari', 'Diagram menggambarkan interaksi antara kedalaman kanopi dan bidang bukaan dinding untuk meminimalkan panas radiasi tanpa mengurangi terang alami.'],
        ['Pengembangan Simulasi Lanjutan', 'Diagram ini menyajikan prinsip geometri dasar. Analisis kuantitatif lux dan faktor daylighting mendalam dilakukan menggunakan simulasi digital sesuai data tapak spesifik.']
      ]
    }
  };
  const projectDialog=$('#project-dialog');
  let projectTrigger;
  let contactAfterClose = false;
  function openProject(key, trigger){
    const item=concepts[key];if(!item)return;
    projectTrigger=trigger;
    contactAfterClose=false;
    $('#project-dialog-title').textContent=item.title;
    $('#project-dialog-label').textContent=item.label;
    $('#project-dialog-description').textContent=item.description;
    $('#project-dialog-image').src=item.image;
    $('#project-dialog-image').alt=item.alt;
    const facts=$('#project-dialog-facts');facts.replaceChildren();
    item.facts.forEach(([term,value])=>{const box=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term;dd.textContent=value;box.append(dt,dd);facts.append(box);});
    const notes=$('#project-dialog-notes');notes.replaceChildren();
    item.sections.forEach(([heading,copy])=>{const h=document.createElement('h3'),p=document.createElement('p');h.textContent=heading;p.textContent=copy;notes.append(h,p);});
    projectDialog.showModal();projectDialog.scrollTop=0;document.body.classList.add('dialog-open');
  }
  $$('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project,button)));
  $$('dialog').forEach(dialog=>{
    $('.dialog-close',dialog).addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
    dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  });
  projectDialog.addEventListener('close',()=>{
    if(contactAfterClose){
      $('#client-name').focus({preventScroll:true});
      $('#contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      contactAfterClose=false;
    }else if(projectTrigger){projectTrigger.focus();}
  });
  $('.dialog-contact').addEventListener('click',event=>{event.preventDefault();contactAfterClose=true;projectDialog.close();});

  const messageDialog=$('#message-dialog');
  const messagePreview=$('#message-preview');
  function updateWhatsApp(){ $('#whatsapp-link').href='https://wa.me/6285143628550?text='+encodeURIComponent(messagePreview.value); }
  $('#inquiry-form').addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.currentTarget;if(!form.reportValidity())return;
    const data=new FormData(form);
    const name=String(data.get('name')).trim(),location=String(data.get('location')).trim(),brief=String(data.get('brief')).trim();
    if(!name||!location||!brief){const empty=!name?$('#client-name'):!location?$('#project-location'):$('#project-brief');empty.setCustomValidity('Mohon lengkapi kolom ini.');empty.reportValidity();empty.addEventListener('input',()=>empty.setCustomValidity(''),{once:true});return;}
    messagePreview.value=`Halo GradiEnt Studio, saya ingin berdiskusi mengenai rencana proyek.\n\nNama: ${name}\nLokasi: ${location}\nLayanan: ${data.get('service')}\n\nKebutuhan:\n${brief}\n\nTerima kasih.`;
    updateWhatsApp();$('#copy-status').textContent='';$('#copy-message').textContent='Salin pesan';messageDialog.showModal();document.body.classList.add('dialog-open');
  });
  messagePreview.addEventListener('input',updateWhatsApp);
  $('#copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(messagePreview.value);$('#copy-message').textContent='Tersalin ✓';$('#copy-status').textContent='Pesan berhasil disalin ke clipboard.';}catch{messagePreview.focus();messagePreview.select();$('#copy-status').textContent='Pilih teks pesan, lalu salin melalui perangkat Anda.';}});
})();
