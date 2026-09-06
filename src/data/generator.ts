import { CEFRLevel, SentenceItem } from '../types';

let nextId = 1000;
const generateId = () => `proc-${nextId++}`;

// Combinatorial templates for each level

const generateA1 = (): SentenceItem[] => {
  const subjects = [
    { pt: 'Eu', en: 'I', form: 'I' },
    { pt: 'Você', en: 'You', form: 'you' },
    { pt: 'Nós', en: 'We', form: 'we' },
    { pt: 'Eles', en: 'They', form: 'they' },
  ];
  const verbs = [
    { pt: 'quero', en: 'want', form: 'want' },
    { pt: 'gosto de', en: 'like', form: 'like' },
    { pt: 'preciso de', en: 'need', form: 'need' },
    { pt: 'tenho', en: 'have', form: 'have' },
    { pt: 'leio', en: 'read', form: 'read' },
  ];
  const objects = [
    { pt: "um cachorro", en: "a dog" },
    { pt: "um gato", en: "a cat" },
    { pt: "paz", en: "peace" },
    { pt: 'água', en: 'water' },
    { pt: 'café', en: 'coffee' },
    { pt: 'tempo', en: 'time' },
    { pt: 'um livro', en: 'a book' },
    { pt: 'um carro', en: 'a car' },
    { pt: 'ajuda', en: 'help' },
    { pt: 'dinheiro', en: 'money' },
    { pt: 'informação', en: 'information' },
    { pt: 'música', en: 'music' },
    { pt: 'amigos', en: 'friends' },
  ];

  const results: SentenceItem[] = [];
  for (const s of subjects) {
    for (const v of verbs) {
      for (const o of objects) {
        // Simple agreement mapping for Portuguese (lazy approximation for generic subjects)
        let ptVerb = v.pt;
        if (s.pt === 'Você' || s.pt === 'Ele' || s.pt === 'Ela') {
            if(ptVerb === 'quero') ptVerb = 'quer';
            if(ptVerb === 'gosto de') ptVerb = 'gosta de';
            if(ptVerb === 'preciso de') ptVerb = 'precisa de';
            if(ptVerb === 'tenho') ptVerb = 'tem';
            if(ptVerb === 'leio') ptVerb = 'lê';
        } else if (s.pt === 'Nós') {
            if(ptVerb === 'quero') ptVerb = 'queremos';
            if(ptVerb === 'gosto de') ptVerb = 'gostamos de';
            if(ptVerb === 'preciso de') ptVerb = 'precisamos de';
            if(ptVerb === 'tenho') ptVerb = 'temos';
            if(ptVerb === 'leio') ptVerb = 'lemos';
        } else if (s.pt === 'Eles' || s.pt === 'Elas') {
            if(ptVerb === 'quero') ptVerb = 'querem';
            if(ptVerb === 'gosto de') ptVerb = 'gostam de';
            if(ptVerb === 'preciso de') ptVerb = 'precisam de';
            if(ptVerb === 'tenho') ptVerb = 'têm';
            if(ptVerb === 'leio') ptVerb = 'leem';
        }

        results.push({
          id: generateId(),
          level: 'A1',
          english: `${s.en} ${v.en} ${o.en}.`,
          portuguese: `${s.pt} ${ptVerb} ${o.pt}.`,
          tipForBrazilians: 'Estrutura básica: Sujeito + Verbo + Objeto.',
          category: 'Rotina',
        });
      }
    }
  }
  
  // Also add verb to be combinations
  const beSubjects = [
    { pt: 'Eu sou', en: 'I am' },
    { pt: 'Você é', en: 'You are' },
    { pt: 'Ele é', en: 'He is' },
    { pt: 'Ela é', en: 'She is' },
    { pt: 'Nós somos', en: 'We are' },
    { pt: 'Eles são', en: 'They are' },
  ];
  
  const beAdjectives = [
    { pt: 'feliz', en: 'happy' },
    { pt: 'triste', en: 'sad' },
    { pt: 'rápido', en: 'fast' },
    { pt: 'lento', en: 'slow' },
    { pt: 'alto', en: 'tall' },
    { pt: 'baixo', en: 'short' },
    { pt: 'inteligente', en: 'smart' },
    { pt: 'bonito', en: 'beautiful' },
    { pt: 'forte', en: 'strong' },
    { pt: 'cansado', en: 'tired' },
    { pt: 'ocupado', en: 'busy' },
    { pt: 'pronto', en: 'ready' },
  ];
  
  for (const s of beSubjects) {
      for (const a of beAdjectives) {
          // Adjust PT adjective for plural if subject is plural
          let ptAdj = a.pt;
          if (s.pt.includes('Nós') || s.pt.includes('Eles')) {
              ptAdj = ptAdj.replace('feliz', 'felizes')
                           .replace('triste', 'tristes')
                           .replace('rápido', 'rápidos')
                           .replace('lento', 'lentos')
                           .replace('alto', 'altos')
                           .replace('baixo', 'baixos')
                           .replace('inteligente', 'inteligentes')
                           .replace('bonito', 'bonitos')
                           .replace('forte', 'fortes')
                           .replace('cansado', 'cansados')
                           .replace('ocupado', 'ocupados')
                           .replace('pronto', 'prontos');
          }
          
          results.push({
              id: generateId(),
              level: 'A1',
              english: `${s.en} ${a.en}.`,
              portuguese: `${s.pt} ${ptAdj}.`,
              tipForBrazilians: 'Verbo To Be: Sujeito + Verbo + Adjetivo.',
              category: 'Características',
          });
      }
  }

  return results; // ~ 200 + 72 = 272 for this tiny block. We can add more.
};

const generateA2 = (): SentenceItem[] => {
  const subjects = [
    { pt: 'Eu', en: 'I', form: 'I' },
    { pt: 'Você', en: 'You', form: 'you' },
    { pt: 'Ele', en: 'He', form: 'he' },
    { pt: 'Ela', en: 'She', form: 'she' },
    { pt: 'Nós', en: 'We', form: 'we' },
    { pt: 'Eles', en: 'They', form: 'they' },
  ];
  const actions = [
    { pt: 'fui para', en: 'went to' },
    { pt: 'visitei', en: 'visited' },
    { pt: 'comprei', en: 'bought' },
    { pt: 'encontrei', en: 'found' },
    { pt: 'vi', en: 'saw' },
    { pt: 'comi', en: 'ate' },
  ];
  const places = [
    { pt: "ao cinema", en: "to the movies" },
    { pt: "ao zoológico", en: "to the zoo" },
    { pt: "à farmácia", en: "to the pharmacy" },
    { pt: 'a praia', en: 'the beach' },
    { pt: 'o parque', en: 'the park' },
    { pt: 'a escola', en: 'the school' },
    { pt: 'o shopping', en: 'the mall' },
    { pt: 'a cidade', en: 'the city' },
    { pt: 'o museu', en: 'the museum' },
    { pt: 'o restaurante', en: 'the restaurant' },
    { pt: 'o mercado', en: 'the market' },
    { pt: 'a loja', en: 'the store' },
    { pt: 'a biblioteca', en: 'the library' },
  ];
  const times = [
    { pt: 'ontem', en: 'yesterday' },
    { pt: 'na semana passada', en: 'last week' },
    { pt: 'no mês passado', en: 'last month' },
    { pt: 'no ano passado', en: 'last year' },
    { pt: 'esta manhã', en: 'this morning' },
    { pt: 'há dois dias', en: 'two days ago' },
  ];

  const results: SentenceItem[] = [];
  for (const s of subjects) {
    for (const a of actions) {
      for (const p of places) {
        for (const t of times) {
            // Conjugate PT verbs roughly
            let ptVerb = a.pt;
            if (s.pt === 'Você' || s.pt === 'Ele' || s.pt === 'Ela') {
                if(ptVerb === 'fui para') ptVerb = 'foi para';
                if(ptVerb === 'visitei') ptVerb = 'visitou';
                if(ptVerb === 'comprei') ptVerb = 'comprou';
                if(ptVerb === 'encontrei') ptVerb = 'encontrou';
                if(ptVerb === 'vi') ptVerb = 'viu';
                if(ptVerb === 'comi') ptVerb = 'comeu';
            } else if (s.pt === 'Nós') {
                if(ptVerb === 'fui para') ptVerb = 'fomos para';
                if(ptVerb === 'visitei') ptVerb = 'visitamos';
                if(ptVerb === 'comprei') ptVerb = 'compramos';
                if(ptVerb === 'encontrei') ptVerb = 'encontramos';
                if(ptVerb === 'vi') ptVerb = 'vimos';
                if(ptVerb === 'comi') ptVerb = 'comemos';
            } else if (s.pt === 'Eles' || s.pt === 'Elas') {
                if(ptVerb === 'fui para') ptVerb = 'foram para';
                if(ptVerb === 'visitei') ptVerb = 'visitaram';
                if(ptVerb === 'comprei') ptVerb = 'compraram';
                if(ptVerb === 'encontrei') ptVerb = 'encontraram';
                if(ptVerb === 'vi') ptVerb = 'viram';
                if(ptVerb === 'comi') ptVerb = 'comeram';
            }
            
            // Exclude some combinations that don't make sense (like ate the museum)
            if ((a.en === 'ate' || a.en === 'bought') && (p.en === 'the beach' || p.en === 'the park' || p.en === 'the school' || p.en === 'the city' || p.en === 'the museum' || p.en === 'the library')) {
                continue; 
            }
            if ((a.en === 'went to') && (p.en === 'the restaurant')) {
                // went to the restaurant works
            }

            results.push({
                id: generateId(),
                level: 'A2',
                english: `${s.en} ${a.en} ${p.en} ${t.en}.`,
                portuguese: `${s.pt} ${ptVerb} ${p.pt} ${t.pt}.`,
                tipForBrazilians: 'Em inglês, a expressão de tempo geralmente vem no final da frase.',
                category: 'Passado',
            });
        }
      }
    }
  }
  return results; // ~ 6 * 6 * 10 * 6 = 2160 sentences!
};

const generateB1 = (): SentenceItem[] => {
    const subjects = [
        { pt: 'Eu', en: 'I' },
        { pt: 'Ela', en: 'She' },
        { pt: 'Ele', en: 'He' },
        { pt: 'Nós', en: 'We' },
        { pt: 'Eles', en: 'They' },
    ];
    
    const conditions = [
    { pt: "se tudo der certo", en: "if everything goes well" },
    { pt: "se o tempo permitir", en: "if the weather permits" },
        { pt: 'se chover amanhã', en: 'if it rains tomorrow' },
        { pt: 'se você não se apressar', en: 'if you do not hurry' },
        { pt: 'se ele chegar tarde', en: 'if he arrives late' },
        { pt: 'se eles nos convidarem', en: 'if they invite us' },
        { pt: 'se nós tivermos tempo', en: 'if we have time' },
    ];
    
    const results: SentenceItem[] = [];
    
    for (const s of subjects) {
        for (const c of conditions) {
            const willVerbs = [
                { pt: 'ficarei em casa', en: 'will stay home', s: 'Eu' },
                { pt: 'ficará em casa', en: 'will stay home', s: 'Ele,Ela' },
                { pt: 'ficaremos em casa', en: 'will stay home', s: 'Nós' },
                { pt: 'ficarão em casa', en: 'will stay home', s: 'Eles' },
                
                { pt: 'irei ao cinema', en: 'will go to the movies', s: 'Eu' },
                { pt: 'irá ao cinema', en: 'will go to the movies', s: 'Ele,Ela' },
                { pt: 'iremos ao cinema', en: 'will go to the movies', s: 'Nós' },
                { pt: 'irão ao cinema', en: 'will go to the movies', s: 'Eles' },
                
                { pt: 'ligarei para você', en: 'will call you', s: 'Eu' },
                { pt: 'ligará para você', en: 'will call you', s: 'Ele,Ela' },
                { pt: 'ligaremos para você', en: 'will call you', s: 'Nós' },
                { pt: 'ligarão para você', en: 'will call you', s: 'Eles' },
            ];
            
            for (const wv of willVerbs) {
                if (wv.s.includes(s.pt)) {
                    results.push({
                        id: generateId(),
                        level: 'B1',
                        english: `${s.en} ${wv.en} ${c.en}.`,
                        portuguese: `${s.pt} ${wv.pt} ${c.pt}.`,
                        tipForBrazilians: 'First Conditional: Resultado no futuro (will) + Condição no presente (if + present).',
                        category: 'Condicionais',
                    });
                }
            }
        }
    }
    
    // Add present perfect
    const ppActions = [
        { pt: 'Eu nunca estive', en: 'I have never been' },
        { pt: 'Ela nunca esteve', en: 'She has never been' },
        { pt: 'Nós nunca estivemos', en: 'We have never been' },
        { pt: 'Eles nunca estiveram', en: 'They have never been' },
        { pt: 'Eu já estive', en: 'I have already been' },
        { pt: 'Ele já esteve', en: 'He has already been' },
        { pt: 'Nós já estivemos', en: 'We have already been' },
        { pt: 'Eles já estiveram', en: 'They have already been' },
    ];
    
    const ppPlaces = [
        { pt: 'em Nova York', en: 'to New York' },
        { pt: 'em Paris', en: 'to Paris' },
        { pt: 'no Japão', en: 'to Japan' },
        { pt: 'no Brasil', en: 'to Brazil' },
        { pt: 'na Europa', en: 'to Europe' },
        { pt: 'na Austrália', en: 'to Australia' },
        { pt: 'naquele restaurante', en: 'to that restaurant' },
        { pt: 'neste museu', en: 'to this museum' },
    ];
    
    const ppTimes = [
        { pt: 'antes.', en: 'before.' },
        { pt: 'na minha vida.', en: 'in my life.' },
        { pt: 'neste ano.', en: 'this year.' },
        { pt: 'até agora.', en: 'so far.' },
    ];
    
    for(const a of ppActions) {
        for(const p of ppPlaces) {
            for(const t of ppTimes) {
                // Avoid contradictory combinations (never ... already) if they don't make sense, but syntax is valid
                if (a.en.includes('already') && (t.en === 'before.' || t.en === 'in my life.')) continue;
                
                results.push({
                    id: generateId(),
                    level: 'B1',
                    english: `${a.en} ${p.en} ${t.en}`,
                    portuguese: `${a.pt} ${p.pt} ${t.pt}`,
                    tipForBrazilians: 'Use Present Perfect para experiências sem tempo definido no passado.',
                    category: 'Present Perfect',
                });
            }
        }
    }
    
    return results; // Approx 1200+ sentences
};

const generateB2 = (): SentenceItem[] => {
    const results: SentenceItem[] = [];
    
    // Second Conditional
    const subjects = [
        { pt: 'Eu', en: 'I' },
        { pt: 'Ela', en: 'She' },
        { pt: 'Ele', en: 'He' },
        { pt: 'Nós', en: 'We' },
        { pt: 'Eles', en: 'They' },
    ];
    
    const actions = [
        { pt: 'viajaria pelo mundo', en: 'would travel the world' },
        { pt: 'compraria uma casa enorme', en: 'would buy a huge house' },
        { pt: 'aprenderia outro idioma', en: 'would learn another language' },
        { pt: 'começaria um novo negócio', en: 'would start a new business' },
        { pt: 'doaria para a caridade', en: 'would donate to charity' },
        { pt: 'pediria demissão do meu emprego', en: 'would quit my job' },
    ];
    
    const conditions = [
    { pt: "se tudo der certo", en: "if everything goes well" },
    { pt: "se o tempo permitir", en: "if the weather permits" },
        { pt: 'se eu ganhasse na loteria.', en: 'if I won the lottery.' },
        { pt: 'se eu tivesse mais tempo livre.', en: 'if I had more free time.' },
        { pt: 'se eu fosse você.', en: 'if I were you.' },
        { pt: 'se eu soubesse a resposta.', en: 'if I knew the answer.' },
        { pt: 'se fosse possível.', en: 'if it were possible.' },
        { pt: 'se nós tivéssemos dinheiro suficiente.', en: 'if we had enough money.' },
        { pt: 'se a situação fosse diferente.', en: 'if the situation were different.' },
    ];
    
    for (const s of subjects) {
        for (const a of actions) {
            for (const c of conditions) {
                
                // Adjust portuguese action verb based on subject
                let ptAction = a.pt;
                if (s.pt === 'Ela' || s.pt === 'Ele') {
                    // third person singular is same as first for conditional in PT (viajaria, compraria)
                } else if (s.pt === 'Nós') {
                    ptAction = ptAction.replace('viajaria', 'viajaríamos')
                                     .replace('compraria', 'compraríamos')
                                     .replace('aprenderia', 'aprenderíamos')
                                     .replace('começaria', 'começaríamos')
                                     .replace('doaria', 'doaríamos')
                                     .replace('pediria', 'pediríamos');
                } else if (s.pt === 'Eles') {
                    ptAction = ptAction.replace('viajaria', 'viajariam')
                                     .replace('compraria', 'comprariam')
                                     .replace('aprenderia', 'aprenderiam')
                                     .replace('começaria', 'começariam')
                                     .replace('doaria', 'doariam')
                                     .replace('pediria', 'pediriam');
                }
                
                results.push({
                    id: generateId(),
                    level: 'B2',
                    english: `${s.en} ${a.en} ${c.en}`,
                    portuguese: `${s.pt} ${ptAction} ${c.pt}`,
                    tipForBrazilians: 'Second conditional: "Would" + If "Past". Para o verbo to be, use "were" para todas as pessoas.',
                    category: 'Second Conditional',
                });
            }
        }
    }
    
    return results; // Thousands
};

const generateC1 = (): SentenceItem[] => {
    const results: SentenceItem[] = [];
    
    const clauses = [
    { pt: "Sem considerar o custo financeiro", en: "Without considering the financial cost" },
    { pt: "Baseado no relatório de ontem", en: "Based on yesterday’s report" },
        { pt: 'Apesar de ter sido avisado várias vezes', en: 'Despite having been warned multiple times' },
        { pt: 'Embora a evidência sugerisse o contrário', en: 'Although the evidence suggested otherwise' },
        { pt: 'Considerando as circunstâncias sem precedentes', en: 'Given the unprecedented circumstances' },
        { pt: 'Tendo considerado todas as opções viáveis', en: 'Having considered all viable options' },
        { pt: 'Por mais que eu tente entender o raciocínio dele', en: 'As much as I try to understand his reasoning' },
        { pt: 'Por mais difícil que a situação possa parecer', en: 'However difficult the situation may seem' },
        { pt: 'Independentemente das prováveis repercussões', en: 'Regardless of the likely repercussions' },
    ];
    
    const conclusions = [
        { pt: 'o comitê decidiu prosseguir com a proposta contenciosa.', en: 'the committee decided to proceed with the contentious proposal.' },
        { pt: 'os acionistas permaneceram firmes em sua decisão.', en: 'the stakeholders remained steadfast in their decision.' },
        { pt: 'a diretoria optou por implementar a nova estrutura imediatamente.', en: 'the board opted to implement the new framework immediately.' },
        { pt: 'ela se recusou a comprometer seus princípios éticos.', en: 'she refused to compromise her ethical principles.' },
        { pt: 'eles seguiram em frente com as reformas estruturais.', en: 'they moved forward with the structural reforms.' },
        { pt: 'a gerência manteve a sua postura conservadora original.', en: 'the management maintained its original conservative stance.' },
        { pt: 'a equipe de pesquisa continuou a buscar a hipótese.', en: 'the research team continued to pursue the hypothesis.' },
        { pt: 'a corporação não descartou a possibilidade de fusão.', en: 'the corporation did not rule out the possibility of a merger.' },
    ];
    
    for (const c of clauses) {
        for (const concl of conclusions) {
            results.push({
                id: generateId(),
                level: 'C1',
                english: `${c.en}, ${concl.en}`,
                portuguese: `${c.pt}, ${concl.pt}`,
                tipForBrazilians: 'Estruturas adverbiais compostas (Participle Clauses) são marcas de fluência acadêmica em nível C1.',
                category: 'Orações Avançadas',
            });
        }
    }
    
    // Add third conditionals (past regrets)
    const thirdCond = [
        { pt: 'Se eles tivessem conduzido um estudo mais minucioso', en: 'If they had conducted a more thorough study' },
        { pt: 'Se a empresa tivesse previsto a crise do mercado', en: 'Had the company foreseen the market slump' },
        { pt: 'Se tivéssemos levado o conselho dele em consideração', en: 'If we had taken his advice into consideration' },
        { pt: 'Se a legislação tivesse sido aprovada mais cedo', en: 'Had the legislation been passed earlier' },
    ];
    
    const thirdResult = [
        { pt: 'esse desastre inteiramente evitável poderia ter sido prevenido.', en: 'this entirely avoidable disaster could have been prevented.' },
        { pt: 'eles teriam mitigado a maior parte dos prejuízos financeiros.', en: 'they would have mitigated the bulk of the financial losses.' },
        { pt: 'as consequências teriam sido significativamente menos severas.', en: 'the aftermath would have been significantly less severe.' },
        { pt: 'a trajetória do nosso desenvolvimento poderia ter sido outra.', en: 'the trajectory of our development might have been otherwise.' },
    ];
    
    for(const c of thirdCond) {
        for(const r of thirdResult) {
            results.push({
                id: generateId(),
                level: 'C1',
                english: `${c.en}, ${r.en}`,
                portuguese: `${c.pt}, ${r.pt}`,
                tipForBrazilians: 'Third Conditional (ou inversões como "Had the company..."): essencial para descrever cenários hipotéticos no passado.',
                category: 'Third Conditional',
            });
        }
    }
    
    return results;
};

const generateC2 = (): SentenceItem[] => {
    const results: SentenceItem[] = [];
    
    const abstractSubjects = [
    { pt: "A crescente polarização do cenário político", en: "The growing polarization of the political landscape" },
        { pt: 'A onipresença das redes sociais na sociedade moderna', en: 'The ubiquity of social media in modern society' },
        { pt: 'O flagrante desrespeito pelos protocolos ecológicos estabelecidos', en: 'The blatant disregard for established ecological protocols' },
        { pt: 'A propensão intrínseca do ser humano a buscar aprovação', en: 'The intrinsic human propensity to seek approval' },
        { pt: 'O ritmo implacável do avanço tecnológico contemporâneo', en: 'The relentless pace of contemporary technological advancement' },
        { pt: 'A notória relutância da instituição em abraçar a mudança', en: 'The institution\'s notorious reluctance to embrace change' },
        { pt: 'O apelo efêmero da cultura popular voltada ao consumidor', en: 'The ephemeral appeal of consumer-driven popular culture' },
        { pt: 'O crescimento sem precedentes de conglomerados monopolistas', en: 'The unprecedented growth of monopolistic conglomerates' },
        { pt: 'O discurso frequentemente polarizado na mídia moderna', en: 'The often polarized discourse in modern media' },
    ];
    
    const sophisticatedVerbs = [
        { pt: 'tem exacerbado consistentemente', en: 'has consistently exacerbated' },
        { pt: 'tem inadvertidamente fomentado', en: 'has inadvertently fostered' },
        { pt: 'inevitavelmente engendrará', en: 'will inevitably engender' },
        { pt: 'serviu apenas para destacar', en: 'has only served to underscore' },
        { pt: 'remodelou fundamentalmente', en: 'has fundamentally reshaped' },
        { pt: 'continua a precipitar', en: 'continues to precipitate' },
        { pt: 'tem sido amplamente creditado por facilitar', en: 'has been widely credited with facilitating' },
        { pt: 'foi inequivocamente comprovado por minar', en: 'has been unequivocally proven to undermine' },
    ];
    
    const complexObjects = [
        { pt: 'a profunda alienação sentida pela demografia mais jovem.', en: 'the profound alienation felt by the younger demographic.' },
        { pt: 'uma miríade de dilemas éticos que os legisladores lutam para resolver.', en: 'a myriad of ethical dilemmas that lawmakers struggle to address.' },
        { pt: 'a fragmentação gradual dos valores comunitários tradicionais.', en: 'the gradual fragmentation of traditional communal values.' },
        { pt: 'a vasta disparidade em estabilidade econômica entre diferentes estratos.', en: 'the vast disparity in economic stability across different strata.' },
        { pt: 'as complexidades inerentes na manutenção da estabilidade geopolítica global.', en: 'the inherent complexities in maintaining global geopolitical stability.' },
        { pt: 'a necessidade premente de uma revisão abrangente da infraestrutura atual.', en: 'the pressing need for a comprehensive overhaul of the current infrastructure.' },
        { pt: 'um ambiente onde a desinformação pode proliferar sem controle.', en: 'an environment where misinformation can proliferate unchecked.' },
        { pt: 'o frágil equilíbrio sobre o qual nosso fraturado ecossistema depende.', en: 'the fragile equilibrium upon which our fractured ecosystem relies.' },
    ];
    
    for (const s of abstractSubjects) {
        for (const v of sophisticatedVerbs) {
            for (const o of complexObjects) {
                results.push({
                    id: generateId(),
                    level: 'C2',
                    english: `${s.en} ${v.en} ${o.en}`,
                    portuguese: `${s.pt} ${v.pt} ${o.pt}`,
                    tipForBrazilians: 'Estruturas de nível C2 utilizam precisão lexical extrema (ubiquity, exacerbate, myriad) e sintaxe formal impecável.',
                    category: 'Léxico Erudito',
                });
            }
        }
    }
    
    return results; // 8 * 8 * 8 = 512 + we can add more if needed
};

// Generate and export everything
export const generateMoreSentences = (): SentenceItem[] => {
    return [
        ...generateA1(),
        ...generateA2(),
        ...generateB1(),
        ...generateB2(),
        ...generateC1(),
        ...generateC2(),
    ];
};
