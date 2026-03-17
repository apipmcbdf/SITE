// popup.js - Modal "URGENTE" (funciona com header carregado por fetch/innerHTML)
// Arquivo ajustado para NÃO quebrar se for incluído mais de uma vez (evita erro de "Identifier ... has already been declared").
// Mantém o controle ligar/desligar e o "Não mostrar novamente".

(() => {
  if (window.__urgentPopupInit) return;
  window.__urgentPopupInit = false;

  // popup.js - Modal "URGENTE" (funciona com header carregado por fetch/innerHTML)
//
// CONTROLE (ativar/desativar):
// 1) Padrão do site (edite aqui):
const URGENT_POPUP_DEFAULT_ENABLED = false; // true = ligado / false = desligado
//
// 2) Desativação por navegador (sem mexer no arquivo, via console):
//    window.disableUrgentPopup()   -> desliga
//    window.enableUrgentPopup()    -> liga
//    window.resetUrgentPopup()     -> volta ao padrão (acima)
//
// Obs.: A preferência do usuário "Não mostrar novamente" continua funcionando separadamente.

(function initUrgentPopup(){
  // ---- Toggle global (padrão + localStorage) ----
  const LS_DISABLED_KEY = 'urgentPopupDisabled';
  const LS_HIDE_KEY = 'urgentModalHidden';

  function isEnabled(){
    // Se resetado, segue o padrão do arquivo
    const disabled = localStorage.getItem(LS_DISABLED_KEY);
    if (disabled === null) return !!URGENT_POPUP_DEFAULT_ENABLED;
    return disabled !== '1';
  }

  // Expor controles para você ligar/desligar rapidamente (console, botão admin etc.)
  window.disableUrgentPopup = function(){
    localStorage.setItem(LS_DISABLED_KEY, '1');
  };
  window.enableUrgentPopup = function(){
    localStorage.setItem(LS_DISABLED_KEY, '0');
  };
  window.resetUrgentPopup = function(){
    localStorage.removeItem(LS_DISABLED_KEY);
  };

  if (!isEnabled()) return;

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
    if (dont && dont.checked) localStorage.setItem(LS_HIDE_KEY, '1');

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
    if (!isEnabled()) return;                 // pode ter sido desligado depois
    if (localStorage.getItem(LS_HIDE_KEY) === '1') return; // "não mostrar novamente"

    if (showModal()) return;
    // header ainda não entrou no DOM — tenta novamente
    setTimeout(tryOpen, 120);
  }

  // pequeno delay inicial pra não "piscar" durante o carregamento
  setTimeout(tryOpen, 200);
})();

})();
