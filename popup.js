// popup.js - Modal "URGENTE" (funciona com header carregado por fetch/innerHTML)
(function initUrgentPopup(){
  function showModal(){
    const modal = document.getElementById('urgentModal');
    if (!modal) return false;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    return true;
  }

  // Expor globalmente (porque o botão do HTML chama onclick="closeUrgentModal()")
  window.closeUrgentModal = function(){
    const modal = document.getElementById('urgentModal');
    if (!modal) return;

    const dont = document.getElementById('urgentDontShow');
    if (dont && dont.checked) localStorage.setItem('urgentModalHidden', '1');

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Fecha clicando fora
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('urgentModal');
    if (!modal || !modal.classList.contains('show')) return;
    if (e.target === modal) window.closeUrgentModal();
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeUrgentModal();
  });

  // Tenta mostrar quando o header terminar de carregar (porque ele vem via fetch)
  function tryOpen(){
    if (localStorage.getItem('urgentModalHidden') === '1') return;

    if (showModal()) return;
    // header ainda não entrou no DOM — tenta novamente
    setTimeout(tryOpen, 120);
  }

  // pequeno delay inicial pra não "piscar" durante o carregamento
  setTimeout(tryOpen, 200);
})();
