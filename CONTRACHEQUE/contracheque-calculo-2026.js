const Contracheque = (() => {
  // Lei nº 15.395/2026, anexos II, V, VI, VII e IX. Valores em centavos.
  // Soldo, GFM, GEFM, VPE de referência, auxílio-moradia com e sem dependente.
  const tabela = {
    "Coronel": [541157, 104708, 377521, 1545211, 447561, 149187],
    "Tenente-Coronel": [519652, 104708, 363132, 1353303, 431848, 143949],
    "Major": [495174, 104708, 309017, 1161103, 404876, 134958],
    "Capitão": [413753, 104708, 254447, 1017043, 324919, 108306],
    "Primeiro-Tenente": [383086, 104708, 211711, 1009399, 284031, 94677],
    "Segundo-Tenente": [354591, 104708, 197115, 987370, 267755, 89251],
    "Subtenente": [273142, 69806, 167552, 1035304, 241501, 80500],
    "Primeiro-Sargento": [238296, 69806, 148282, 716185, 219243, 73080],
    "Segundo-Sargento": [204473, 69806, 118744, 624041, 188482, 62828],
    "Terceiro-Sargento": [185436, 69806, 107743, 590503, 173868, 57955],
    "Cabo": [165311, 69806, 83437, 534321, 143944, 47981],
    "Soldado - 1ª Classe": [151869, 69806, 75598, 511076, 136205, 45401],
    "Soldado - 2ª Classe": [138708, 69806, 51151, 364761, 105747, 35249],
  };

  const soldos = Object.fromEntries(Object.entries(tabela).map(([posto, [soldo]]) => [posto, soldo]));
  Object.assign(soldos, {
    'Aspirante a Oficial': 305436,
    'Cadete (último ano)': 166418,
    'Cadete (demais anos)': 138708,
  });

  const adicionalPosto = [80, 80, 80, 75, 70, 70, 65, 65, 65, 65, 60, 60, 50];
  const postos = Object.keys(tabela);
  const competencias = {
    aperfeicoamento: ['Aperfeiçoamento', 20],
    altosEstudos: ['Altos Estudos', 30],
    especializacao: ['Especialização', 15],
  };
  const minimo2026 = 162100;
  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function formatar(cents) {
    return moeda.format(cents / 100);
  }

  // Calcula em centavos e arredonda metade para cima.
  function ratear(cents, numerador, denominador) {
    const parte = BigInt(cents) * BigInt(numerador);
    const total = BigInt(denominador);
    return Number((parte * 2n + total) / (total * 2n));
  }

  function fracao(numerador, denominador) {
    if (!/^\d+$/.test(numerador) || !/^\d+$/.test(denominador)) return null;
    const parte = Number(numerador);
    const total = Number(denominador);
    if (!Number.isSafeInteger(parte) || !Number.isSafeInteger(total) || parte < 1 || parte > total) return null;
    return [parte, total];
  }

  function estimarTempo(posto, soldoPago) {
    const integral = soldos[posto];
    if (!integral || !Number.isSafeInteger(soldoPago) || soldoPago < 1 || soldoPago > integral) return null;
    const anos = Math.round(soldoPago * 30 / integral);
    if (anos < 1 || Math.abs(ratear(integral, anos, 30) - soldoPago) > 1) return null;
    return anos;
  }

  function calcular({ posto, tempo, aux, vpe, opcionais, anuenios }) {
    const [soldoIntegral, gfm, gefm, vpeReferencia, auxCom, auxSem] = tabela[posto];
    const anos = Math.min(tempo, 30);
    const soldo = ratear(soldoIntegral, anos, 30);
    const complemento = Math.max(0, minimo2026 - soldo);
    const baseSoldo = soldo + complemento;

    const linhas = [
      { label: 'Soldo', cents: soldo },
      ...(complemento ? [{ label: 'Complemento de soldo', cents: complemento }] : []),
      { label: 'Gratificação de Representação Militar', cents: ratear(baseSoldo, 1, 100) },
      { label: 'Adicional de Certificação Profissional — Formação', cents: ratear(baseSoldo, 10, 100) },
      { label: 'GFM', cents: gfm },
      { label: 'GEFM', cents: gefm },
    ];

    if (vpe) linhas.push({ label: 'Diferença da VPE (VPE de referência menos GFM e GEFM)', cents: vpeReferencia - gfm - gefm });
    if (aux !== 'NAO') {
      // Exibe a tabela do benefício. Eventual rateio segue a rubrica da folha ou o título individual.
      linhas.push({ label: 'Auxílio-moradia', cents: aux === 'COM_DEP' ? auxCom : auxSem, rateavel: false });
    }
    for (const [id, [label, percentual]] of Object.entries(competencias)) {
      if (opcionais.includes(id)) linhas.push({ label, cents: ratear(baseSoldo, percentual, 100) });
    }
    if (opcionais.includes('postoGraduacao')) {
      linhas.push({ label: 'Adicional de Posto ou Graduação', cents: ratear(baseSoldo, adicionalPosto[postos.indexOf(posto)], 100) });
    }
    if (opcionais.includes('anuenios')) {
      linhas.push({ label: 'Adicional de Tempo de Serviço (anuênios)', cents: ratear(baseSoldo, Math.round(anuenios * 100), 10000) });
    }
    if (opcionais.includes('operacoes')) {
      linhas.push({ label: 'Adicional de Operações Militares na Inatividade', cents: ratear(soldos.Coronel, 127 * anos, 30000) });
    }

    return linhas;
  }

  return { postos, soldos, formatar, ratear, fracao, estimarTempo, calcular };
})();
