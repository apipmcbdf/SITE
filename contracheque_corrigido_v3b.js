
(function(){ 
  const DATA = JSON.parse(document.getElementById('dataset').textContent || '{}');
  const postoSel = document.getElementById('posto');
  const auxSel = document.getElementById('aux');
  const vpeFlag = document.getElementById('vpeFlag');
  const tbody = document.getElementById('body');

  // Populate posts preserving order; keep placeholder
  const ORDER = (DATA.ordered_pg && DATA.ordered_pg.length) ? DATA.ordered_pg : [];
  ORDER.forEach(p => { const opt = document.createElement('option'); opt.value = p; opt.textContent = p; postoSel.appendChild(opt); });

  function clamp0(n){ if(n==null||isNaN(n)) return null; return n<0 ? 0 : n; }
  function fmt(v) { return (v==null||isNaN(v)) ? '' : Number(v).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2}); }
  function currentReg() { return document.querySelector('input[name="reg"]:checked')?.value || 'ALL'; }
  function toggleCols() {
    const reg = currentReg();
    const map = {ATUAL:'.col-atual', DEZ:'.col-dez', JAN:'.col-jan'};
    for (const k of ['ATUAL','DEZ','JAN']) {
      document.querySelectorAll(map[k]).forEach(el => el.style.display = (reg==='ALL'||reg===k)?'':'none');
    }
  }
  function __norm(s){ return !s ? '' : s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); }
  function __lookup(map, key){ const nk=__norm(key); for(const k in map) if(__norm(k)===nk) return map[k]; return null; }

  const FIXED = [
    ['SOLDO','SOLDO'],
    ['GRAT_REP_MILITAR','GRATIFICAÇÃO DE REPRES. MILITAR (1% do soldo)'],
    ['FORMACAO','AD. CERT. PROF. (FORMACAO)'],
    ['COMPLEMENTO_SOLDO','COMPLEMENTO DE SOLDO'],
    ['GFM','GFM'],
    ['GEFM','GEFM'],
    ['VPE','VPE'],
    ['AUX_MORADIA','AUXÍLIO MORADIA'],
  ];
  const OPTIONAL = [
    ['ESPECIALIZACAO','Especialização'],
    ['APERFEICOAMENTO','Aperfeiçoamento'],
    ['ALTOS_ESTUDOS','Altos Estudos'],
    ['AD_POST_GRAD','AD. POST/GRAD'],
    ['ADIC_TEMP_SERVICO_MILITAR','ADIC.TEMP.SERVIÇO-MILITAR'],
    ['ADIC_OPERACOES_MILITARES_INAT','ADIC.OPERAÇÕES MILITARES INAT'],
  ];
  function selectedOptionals() {
    const ids = OPTIONAL.map(([k]) => k);
    const enabled = new Set(ids.map(id => document.getElementById('opt__'+id)).filter(el => el && el.checked).map(el => el.id.replace('opt__','')));
    return OPTIONAL.filter(([k]) => enabled.has(k));
  }
  function currentLabelList() { return [...FIXED, ...selectedOptionals()]; }

  function build() {
    tbody.innerHTML='';
    const p = postoSel.value;
    if (!p) { toggleCols(); return; }
    const auxOpt = auxSel.value;

    currentLabelList().forEach(([key,label]) => {
      if (key==='VPE' && vpeFlag && vpeFlag.value==='NAO') return;
      if (key==='AUX_MORADIA' && auxSel && auxSel.value==='NAO') return;

      const tr = document.createElement('tr');
      const td0 = document.createElement('td'); td0.textContent = label; tr.appendChild(td0);
      const tdA = document.createElement('td'); tdA.className = 'col-atual';
      const tdD = document.createElement('td'); tdD.className = 'col-dez';
      const tdJ = document.createElement('td'); tdJ.className = 'col-jan';

      if (key==='AUX_MORADIA') {
const row = __lookup(DATA.aux, p);
        const vA = row ? row[auxOpt]?.ATUAL : null;
        const vD = row ? row[auxOpt]?.DEZ   : null;
        const vJ = row ? row[auxOpt]?.JAN   : null;
        tdA.textContent = fmt(vA); tdD.textContent = fmt(vD); tdJ.textContent = fmt(vJ);
      
      } else if (key==='GRAT_REP_MILITAR') {
        // 1% do SOLDO nas três colunas
        const soldo = DATA.rubricas.SOLDO || {ATUAL:{},DEZ:{},JAN:{}};
        const sA = __lookup(soldo.ATUAL||{}, p);
        const sD = __lookup(soldo.DEZ||{},   p);
        const sJ = __lookup(soldo.JAN||{},   p);
        const vA = (sA==null) ? null : sA * 0.01;
        const vD = (sD==null) ? null : sD * 0.01;
        const vJ = (sJ==null) ? null : sJ * 0.01;
        tdA.textContent = fmt(vA); tdD.textContent = fmt(vD); tdJ.textContent = fmt(vJ);
      } else {
        const map = DATA.rubricas[key] || {ATUAL:{},DEZ:{},JAN:{}};
        let vA = __lookup(map.ATUAL||{}, p);
        let vD = __lookup(map.DEZ||{}, p);
        let vJ = __lookup(map.JAN||{}, p);
        if (key==='COMPLEMENTO_SOLDO') { vA = clamp0(vA); vD = clamp0(vD); vJ = clamp0(vJ); }
        tdA.textContent = fmt(vA); tdD.textContent = fmt(vD); tdJ.textContent = fmt(vJ);
      }

      if (key==='COMPLEMENTO_SOLDO') {
        const toNum = (x) => (x===''||x==null) ? 0 : Number(String(x).replace(/\./g,'').replace(',','.'))||0;
        if (toNum(tdA.textContent)===0 && toNum(tdD.textContent)===0 && toNum(tdJ.textContent)===0) return;
      }

      tr.appendChild(tdA); tr.appendChild(tdD); tr.appendChild(tdJ);
      tbody.appendChild(tr);
    });
    toggleCols();
  }

  document.querySelectorAll('input[name="reg"]').forEach(el => el.addEventListener('change', build));
  auxSel && auxSel.addEventListener('change', build);
  vpeFlag && vpeFlag.addEventListener('change', build);
  document.querySelectorAll('#optsBox input[type=checkbox]').forEach(el => el.addEventListener('change', build));
  postoSel.addEventListener('change', build);

  // initial: don't render until posto chosen
  toggleCols();
})();