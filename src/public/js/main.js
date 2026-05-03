// main.js - consume /api/productos and render carousel
(function(){
  // 🔥 URL CORREGIDA (IMPORTANTE)
  const API = 'https://nexatech-backend-production.up.railway.app/api/productos';

  const track = document.getElementById('sliderTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const view = document.querySelector('.slider-view');
  const prev = document.querySelector('.slider-nav.prev');
  const next = document.querySelector('.slider-nav.next');
  const blurToggle = document.getElementById('blurToggle');

  function formatCurrency(val){
    try{ return new Intl.NumberFormat('es-ES',{style:'currency',currency:'USD'}).format(val); }catch(e){return '$'+val}
  }

  function createProductCard(p){
    const art = document.createElement('article');
    art.className = 'product-card';

    const preview = document.createElement('div'); preview.className = 'product-preview';
    const img = document.createElement('img');
    img.alt = p.nombre || 'Producto';

    let imgSrc = p.imagen || '';
    if(!imgSrc){
      imgSrc = 'https://via.placeholder.com/800x600?text='+encodeURIComponent(p.nombre||'Producto');
    } else if(!imgSrc.startsWith('http') && !imgSrc.startsWith('/')){
      imgSrc = '/images/' + imgSrc;
    }

    img.src = imgSrc;
    img.onerror = () => {
      img.onerror = null;
      img.src = 'https://via.placeholder.com/800x600?text='+encodeURIComponent(p.nombre||'Producto');
    };

    preview.appendChild(img);

    const content = document.createElement('div'); content.className = 'product-content';
    const label = document.createElement('span'); label.className = 'product-label'; label.textContent = p.categoria || 'Producto';
    const name = document.createElement('h3'); name.className = 'product-name'; name.textContent = p.nombre || 'Sin nombre';
    const copy = document.createElement('p'); copy.className = 'product-copy'; copy.textContent = p.descripcion || '';

    const meta = document.createElement('div'); meta.className = 'product-meta';
    const m1 = document.createElement('span'); m1.textContent = (p.cantidad!=null)?('Stock: '+p.cantidad):'Disponible';
    const m2 = document.createElement('span'); m2.textContent = p.tipo || '';
    meta.appendChild(m1);
    meta.appendChild(m2);

    const footer = document.createElement('div'); footer.className = 'product-footer';
    const price = document.createElement('div'); price.className = 'product-price'; price.textContent = formatCurrency(p.precio || 0);
    const cta = document.createElement('div'); cta.className = 'product-cta'; cta.textContent = 'Ver detalles';

    footer.appendChild(price);
    footer.appendChild(cta);

    content.appendChild(label);
    content.appendChild(name);
    content.appendChild(copy);
    content.appendChild(meta);
    content.appendChild(footer);

    art.appendChild(preview);
    art.appendChild(content);

    return art;
  }

  async function loadProducts(){
    try{
      const res = await fetch(API, {cache:'no-store'});
      if(!res.ok) throw new Error('API status '+res.status);
      const data = await res.json();
      const list = Array.isArray(data)?data:(data.rows||[]);
      render(list);
    }catch(err){
      console.error('Error cargando productos', err);
      render([]);
    }
  }

  let cards = [];
  let index = 0;

  function render(list){
    if(!track) return;

    track.innerHTML = '';
    dotsWrap && (dotsWrap.innerHTML = '');

    cards = list.map(p=> createProductCard(p));
    cards.forEach(c=> track.appendChild(c));

    if(dotsWrap){
      cards.forEach((_,i)=>{
        const b = document.createElement('button');
        b.type='button';
        b.addEventListener('click',()=> goTo(i));
        dotsWrap.appendChild(b);
      });
    }

    update();
  }

  function update(){
    if(!track || cards.length===0) return;

    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const containerWidth = track.parentElement.clientWidth;

    const offset = Math.max(0, (cardWidth + gap) * index - (containerWidth - cardWidth) / 2);
    track.style.transform = `translateX(${-offset}px)`;

    cards.forEach((card,i)=> card.classList.toggle('active', i===index));

    if(dotsWrap){
      Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle('active', i===index));
    }
  }

  function goTo(i){
    index = ((i % cards.length) + cards.length) % cards.length;
    update();
  }

  prev?.addEventListener('click', ()=> goTo(index-1));
  next?.addEventListener('click', ()=> goTo(index+1));

  let pointerStart = null, pointerDelta = 0;

  view?.addEventListener('pointerdown', (e)=>{
    pointerStart = e.clientX;
    pointerDelta = 0;
    view.setPointerCapture(e.pointerId);
  });

  view?.addEventListener('pointermove', (e)=>{
    if(pointerStart===null) return;
    pointerDelta = e.clientX - pointerStart;
  });

  view?.addEventListener('pointerup', ()=>{
    if(pointerStart===null) return;
    if(Math.abs(pointerDelta)>40){
      goTo(pointerDelta>0?index-1:index+1);
    }
    pointerStart=null;
    pointerDelta=0;
  });

  view?.addEventListener('pointercancel', ()=>{
    pointerStart=null;
    pointerDelta=0;
  });

  window.addEventListener('resize', ()=> setTimeout(update,80));

  blurToggle?.addEventListener('change', ()=>{
    track.classList.toggle('no-blur', !blurToggle.checked);
  });

  // INIT
  loadProducts();
})();
