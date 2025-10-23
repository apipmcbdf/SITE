CONTRACHEQUE — RUBRICAS (CORRIGIDO) — PACOTE PRONTO PARA USO

O QUE VEM NO ZIP
-----------------
- index_contracheque_wizard.html  → NOVO fluxo por etapas (sem colunas laterais, com reset em todas as telas)
- contracheque_corrigido_v3b.css  → estilos atuais do site
- contracheque_corrigido_v3b.js   → script existente (mantido para compatibilidade)
- index_contracheque_corrigido_v3b.html → versão anterior (mantida, caso precise comparar)
- noticia1_contracheque_wizard.html → página de incorporação com iframe apontando para o wizard
- noticia1_contracheque.html, noticia1.html, contracheque_app.html → arquivos originais fornecidos

COMO USAR
---------
1) Envie todo o conteúdo do ZIP para a mesma pasta no seu servidor/hosting (ex.: GitHub Pages).
2) Use a página 'noticia1_contracheque_wizard.html' nos seus menus/links, OU
   incorpore o novo assistente por etapas em outra página com:
      <iframe src="index_contracheque_wizard.html"
              style="width:100%;min-height:1200px;border:0;display:block;"
              title="Consulta de Rubricas — Contracheque"></iframe>

OBSERVAÇÕES
-----------
- O 'index_contracheque_wizard.html' usa o mesmo dataset do arquivo 'index_contracheque_corrigido_v3b.html', embutido no próprio HTML.
- Mantive a referência ao CSS 'contracheque_corrigido_v3b.css' (deixe-o na mesma pasta).
- O Bootstrap é carregado via CDN.

- Agora com etapa de Tempo de Serviço (1 a 40) e cálculo corrigido de ADIC.TEMP.SERVIÇO-MILITAR.


MARCA / TÍTULO
--------------
- Título e navbar atualizados para: "Simulador de Reajustes do Contracheque 2025/2026".
- Texto inicial (passo 0) atualizado com aviso de simulador, assertividade
  dependendo da seleção correta e observação de pensão integral (sem divisão).

- VPE agora exibida como VPE - GFM - GEFM (em Atual, Dez/2025 e Jan/2026).
