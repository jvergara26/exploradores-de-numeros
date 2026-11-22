/* Exploradores de números · prototipo didáctico original · v1.2
   © 2026 John Fernando Vergara Arroyo.
   Código funcional original: MIT (archivo LICENSE).
   Textos, preguntas y demás contenidos educativos: CC BY-NC-SA 4.0 (LICENSE-CONTENIDOS.md).
   HTML/CSS/JavaScript sin librerías ni llamadas de red.
   Los resultados se guardan únicamente en localStorage del navegador. */
(() => {
  'use strict';
  const VERSION = '1.2';
  const STORAGE = 'exploradores_numeros_udes_v1';
  const META = [
    {id:'m1',name:'Múltiplos',subtitle:'Misión 1 · Descubrir patrones',icon:'✳',time:'55 minutos'},
    {id:'m2',name:'Divisores',subtitle:'Misión 2 · Agrupar sin sobrar',icon:'▦',time:'55 minutos'},
    {id:'m3',name:'Divisibilidad',subtitle:'Misión 3 · Encontrar pistas',icon:'⌕',time:'55 minutos'},
    {id:'m4',name:'Reto final',subtitle:'Misión 4 · Aplicar lo aprendido',icon:'★',time:'55 minutos'}
  ];
  const REFLECTION_GUIDES = {
  "m1": [
    "Escribe una multiplicación o división que relacione 28 y 4.",
    "Explica qué indica el resultado para decidir si 28 es múltiplo de 4."
  ],
  "m2": [
    "Calcula o representa 24 ÷ 8 y 24 ÷ 5.",
    "Compara los residuos y explica cuál de los dos números es divisor de 24."
  ],
  "m3": [
    "Suma las cifras de 123 y escribe el resultado.",
    "Explica si esa suma cumple el criterio de divisibilidad por 3 y por qué."
  ],
  "m4": [
    "Elige dos tamaños distintos de grupos con los que repartirías 36 fichas.",
    "Comprueba cada opción mediante división exacta o multiplicación y explica por qué no sobran fichas."
  ]
};
  const RUBRIC_HTML = "<section class=\"panel\" aria-label=\"Rúbrica de revisión docente\"><h2>Rúbrica de las reflexiones (revisión docente)</h2><p>Las respuestas abiertas no se califican automáticamente. El docente puede aplicar los siguientes tres criterios a cada una de las cuatro explicaciones:</p><ol><li><strong>Corrección matemática (0–2):</strong> 0 = incorrecta o ausente; 1 = parcialmente correcta; 2 = correcta.</li><li><strong>Procedimiento y comprobación (0–2):</strong> 0 = sin operación ni evidencia; 1 = procedimiento incompleto; 2 = procedimiento pertinente y comprobable.</li><li><strong>Claridad y pertinencia (0–2):</strong> 0 = no responde lo solicitado; 1 = idea comprensible pero poco precisa; 2 = explicación clara y relacionada con la pregunta.</li></ol><p><strong>Registro manual:</strong> hasta 6 puntos por reflexión y 24 en total. Los puntajes quedan pendientes hasta que el docente revise los textos; no se suman al resultado automático de opción múltiple.</p></section>";
  const reflectionStatus = value => value.trim() ? 'Registrada; pendiente de valoración docente' : 'Sin registrar';
  const DIAG = [
    {q:'¿Cuál de estos números es múltiplo de 6?',options:['19','24','25','31'],correct:1,reason:'24 = 6 × 4.'},
    {q:'¿Cuál afirmación es verdadera?',options:['5 es divisor de 15','15 es divisor de 5','4 es divisor de 15','15 es múltiplo de 4'],correct:0,reason:'15 ÷ 5 = 3, una división exacta.'},
    {q:'Continúa la secuencia: 5, 10, 15, …',options:['16','18','20','25'],correct:2,reason:'Se suman 5 unidades cada vez.'},
    {q:'¿Cuál de estos números es divisor de 18?',options:['4','5','3','7'],correct:2,reason:'18 ÷ 3 = 6, sin residuo.'},
    {q:'¿Qué número es divisible por 10?',options:['53','65','70','84'],correct:2,reason:'70 termina en cero.'},
    {q:'Si repartes 24 fichas en grupos de 6, ¿cuántos grupos completos haces?',options:['3','4','5','6'],correct:1,reason:'24 ÷ 6 = 4.'}
  ];
  const FORMATIVE = {
    'm1.context':{q:'En el Mercado del Sur, un vendedor organiza botellas en paquetes de 5. ¿Qué cantidad puede empacar sin que sobre ninguna?',options:['17 botellas','20 botellas','22 botellas','26 botellas'],correct:1,reason:'20 = 5 × 4; cuatro paquetes de cinco botellas.',hint:'Piensa en las cantidades que aparecen en la tabla del 5.'},
    'm2.context':{q:'Para una actividad escolar hay 36 cuadernos. ¿En qué paquetes se pueden organizar sin dejar cuadernos sueltos?',options:['Paquetes de 5','Paquetes de 7','Paquetes de 9','Paquetes de 8'],correct:2,reason:'36 ÷ 9 = 4 grupos completos. Los otros tamaños dejan residuos.',hint:'Busca un número que multiplicado por una cantidad entera dé 36.'},
    'm2.concept':{q:'¿Es 7 divisor de 42?',options:['Sí, porque 42 ÷ 7 = 6','No, porque 7 es impar','Sí, porque 42 es mayor que 7','No, porque 42 es múltiplo de 2'],correct:0,reason:'7 es divisor de 42 porque 42 ÷ 7 tiene residuo cero.',hint:'La división exacta es lo que determina si un número es divisor.'},
    'final.practice0':{q:'Para la feria se necesitan 36 carteles. ¿Cuál opción permite formar paquetes iguales sin sobrantes?',options:['Paquetes de 5','Paquetes de 7','Paquetes de 9','Paquetes de 8'],correct:2,reason:'36 ÷ 9 = 4 paquetes exactos. Las otras cantidades dejan residuos.',hint:'Comprueba el reparto con una multiplicación.'},
    'final.practice1':{q:'Hay 80 etiquetas para organizar. ¿Cuáles criterios de divisibilidad cumple el número 80?',options:['Solo por 3','Por 2, 5 y 10','Solo por 5','Por 2 y por 3'],correct:1,reason:'80 termina en cero, así que es divisible por 2, 5 y 10; 8 + 0 no es múltiplo de 3.',hint:'Observa la última cifra y luego suma sus cifras.'},
    'm3.context':{q:'Una biblioteca recibió 135 libros. ¿Qué dos criterios permiten comprobar que se pueden agrupar exactamente de 3 en 3 y de 5 en 5?',options:['Divisibilidad por 2 y por 3','Divisibilidad por 2 y por 10','Divisibilidad por 3 y por 5','Divisibilidad por 5 y por 10'],correct:2,reason:'1 + 3 + 5 = 9 (múltiplo de 3) y el número termina en 5.',hint:'Revisa la suma de las cifras y la última cifra.'}
  };
  const CASES = [
    {n:18,correct:[2,3],why:'18 termina en 8 y 1 + 8 = 9; es divisible por 2 y 3.'},
    {n:25,correct:[5],why:'25 termina en 5; únicamente cumple el criterio del 5.'},
    {n:30,correct:[2,3,5,10],why:'30 es par, sus cifras suman 3 y termina en 0.'},
    {n:43,correct:[],why:'43 es impar, 4 + 3 = 7, y no termina en 0 ni 5.'},
    {n:75,correct:[3,5],why:'7 + 5 = 12, que es múltiplo de 3, y 75 termina en 5.'},
    {n:120,correct:[2,3,5,10],why:'120 termina en 0 y 1 + 2 + 0 = 3, múltiplo de 3.'}
  ];
  const FINAL = [
    {q:'En una secuencia de 6 en 6, ¿qué número está entre 20 y 30?',options:['21','24','25','29'],correct:1,reason:'24 = 6 × 4.'},
    {q:'¿Cuál de estos números NO es divisor de 24?',options:['3','4','5','6'],correct:2,reason:'24 ÷ 5 = 4 y sobran 4.'},
    {q:'¿Por qué 54 es divisible por 3?',options:['Porque es par','Porque termina en 4','Porque 5 + 4 = 9, múltiplo de 3','Porque tiene dos cifras'],correct:2,reason:'La suma de sus cifras es 9, múltiplo de 3.'},
    {q:'¿Qué criterio permite verificar rápidamente que 136 es divisible por 2?',options:['Termina en 6, cifra par','La suma de sus cifras es 10','Termina en 5','Tiene tres cifras'],correct:0,reason:'Un número que termina en 0, 2, 4, 6 u 8 es divisible por 2.'},
    {q:'¿Qué permite afirmar que 270 es divisible por 10?',options:['Comienza por 2','Sus cifras suman 9','Es mayor que 100','Termina en 0'],correct:3,reason:'Los números divisibles por 10 terminan en 0.'},
    {q:'Para una feria escolar se organizan 48 botellas en bandejas de 8. ¿Cuántas bandejas completas se forman?',options:['5','6','7','8'],correct:1,reason:'48 ÷ 8 = 6.'},
    {q:'Hay 45 mangos para empacar en bolsas de 5. ¿Cuál resultado es correcto?',options:['8 bolsas y sobran 5','9 bolsas sin sobrantes','10 bolsas sin sobrantes','7 bolsas y sobran 10'],correct:1,reason:'45 ÷ 5 = 9, sin residuo.'},
    {q:'Selecciona la única afirmación verdadera.',options:['6 es múltiplo de 18','7 es divisor de 18','18 es múltiplo de 6','10 es divisor de 25'],correct:2,reason:'18 = 6 × 3; por eso 18 es múltiplo de 6 y 6 es divisor de 18.'}
  ];
  const INITIAL = () => ({version:VERSION,created:new Date().toISOString(),profile:{group:'',code:'EX-'+Math.random().toString(36).slice(2,8).toUpperCase()},diagnostic:{answers:{}},m1:{selected:[],solved:false,feedback:'',factor:5,context:null,reflection:''},m2:{selected:[],solved:false,feedback:'',groupSize:6,context:null,concept:null,reflection:''},m3:{selected:{},solved:{},feedback:{},context:null,reflection:''},final:{answers:{},practice0:null,practice1:null,reflection:''}});
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const loaded = (()=> {try {return JSON.parse(localStorage.getItem(STORAGE) || 'null');} catch (_e) {return null;}})();
  let state = (['1.0','1.1','1.2','1.3'].includes(loaded?.version)) && loaded?.profile && loaded?.diagnostic && loaded?.m1 && loaded?.m2 && loaded?.m3 && loaded?.final ? loaded : INITIAL();
  state.version=VERSION;
  let current='home';
  let storageOkay=true;
  function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state));storageOkay=true;}catch(_e){storageOkay=false;} }
  function announce(s){const node=document.getElementById('live');node.textContent='';setTimeout(()=>{node.textContent=s;},30);}
  const configured=()=> Boolean(state.profile.group && state.profile.code.trim());
  const complete = id => {
    if(id==='m1')return DIAG.every((q,i)=>state.diagnostic.answers[i]!==undefined) && state.m1.solved && state.m1.context===FORMATIVE['m1.context'].correct && state.m1.reflection.trim().length>=10;
    if(id==='m2')return state.m2.solved && state.m2.context===FORMATIVE['m2.context'].correct && state.m2.concept===FORMATIVE['m2.concept'].correct && state.m2.reflection.trim().length>=10;
    if(id==='m3')return CASES.every((c,i)=>state.m3.solved[i]) && state.m3.context===FORMATIVE['m3.context'].correct && state.m3.reflection.trim().length>=10;
    if(id==='m4')return state.final.practice0===FORMATIVE['final.practice0'].correct && state.final.practice1===FORMATIVE['final.practice1'].correct && FINAL.every((q,i)=>state.final.answers[i]!==undefined) && state.final.reflection.trim().length>=15;
    return false;
  };
  function isUnlocked(id){if(!configured())return false;const i=META.findIndex(m=>m.id===id);return i===0||complete(META[i-1].id);}
  function completedCount(){return META.filter(m=>complete(m.id)).length;}
  function score(){return FINAL.reduce((sum,q,i)=>sum+(state.final.answers[i]===q.correct?1:0),0);}
  function diagnosticScore(){return DIAG.reduce((sum,q,i)=>sum+(state.diagnostic.answers[i]===q.correct?1:0),0);}
  function completionRatio(){return Math.round(completedCount()/4*100);}
  function alertHTML(text,good=true){return text?`<div class="feedback ${good?'good':'wrong'}" role="status">${esc(text)}</div>`:'';}
  // Objetivos y puntos de acceso de las cuatro misiones; contenidos originales intactos.
  const MISSION_STRUCTURE = {
    "m1": {
      "objective": "Identificar múltiplos de números naturales, reconocer patrones y justificar una respuesta mediante multiplicaciones.",
      "steps": [
        {
          "label": "Diagnóstico inicial",
          "heading": "Diagnóstico inicial"
        },
        {
          "label": "Explora los patrones",
          "heading": "La máquina de multiplicar"
        },
        {
          "label": "Práctica de múltiplos",
          "heading": "Encuentra los múltiplos de 4"
        },
        {
          "label": "Problema contextualizado",
          "kicker": "Problema del entorno"
        },
        {
          "label": "Reflexión",
          "heading": "¿Qué descubriste?"
        }
      ]
    },
    "m2": {
      "objective": "Reconocer divisores a partir de repartos exactos y explicar la relación entre multiplicación y división.",
      "steps": [
        {
          "label": "Recuerda el concepto",
          "heading": "¿Qué es un divisor?"
        },
        {
          "label": "Explora los repartos",
          "heading": "Reparte 24 fichas"
        },
        {
          "label": "Práctica de divisores",
          "heading": "¿Cuáles son los divisores de 24?"
        },
        {
          "label": "Comprueba lo aprendido",
          "kicker": "Comprueba la idea"
        },
        {
          "label": "Problema contextualizado",
          "kicker": "Problema del entorno"
        },
        {
          "label": "Reflexión",
          "heading": "¿Qué significa repartir exactamente?"
        }
      ]
    },
    "m3": {
      "objective": "Aplicar los criterios de divisibilidad por 2, 3, 5 y 10 y justificar por qué un número cumple una regla.",
      "steps": [
        {
          "label": "Aprende las reglas",
          "heading": "Cuatro pistas rápidas"
        },
        {
          "label": "Clasifica seis números",
          "heading": "Clasifica seis números"
        },
        {
          "label": "Problema contextualizado",
          "kicker": "Problema del entorno"
        },
        {
          "label": "Reflexión",
          "heading": "¿Qué criterio utilizaste?"
        }
      ]
    },
    "m4": {
      "objective": "Aplicar múltiplos, divisores y criterios de divisibilidad a problemas contextualizados y argumentar las soluciones.",
      "steps": [
        {
          "label": "Recupera tus ideas",
          "heading": "Antes de resolver"
        },
        {
          "label": "Problemas integradores",
          "heading": "Dos problemas integradores"
        },
        {
          "label": "Evaluación final",
          "heading": "Ocho preguntas individuales"
        },
        {
          "label": "Argumentación y cierre",
          "heading": "Argumenta tu solución"
        }
      ]
    }
  };
  // Contador de actividades registradas: no constituye una calificación de dominio.
  function missionActivityProgress(id){
    const ready=(value,min)=>typeof value==='string'&&value.trim().length>=min;
    if(id==='m1')return {done:Object.keys(state.diagnostic.answers).length+Number(state.m1.solved)+Number(state.m1.context===FORMATIVE['m1.context'].correct)+Number(ready(state.m1.reflection,10)),total:9};
    if(id==='m2')return {done:Number(state.m2.solved)+Number(state.m2.concept===FORMATIVE['m2.concept'].correct)+Number(state.m2.context===FORMATIVE['m2.context'].correct)+Number(ready(state.m2.reflection,10)),total:4};
    if(id==='m3')return {done:CASES.filter((_,i)=>state.m3.solved[i]).length+Number(state.m3.context===FORMATIVE['m3.context'].correct)+Number(ready(state.m3.reflection,10)),total:8};
    if(id==='m4')return {done:Number(state.final.practice0===FORMATIVE['final.practice0'].correct)+Number(state.final.practice1===FORMATIVE['final.practice1'].correct)+Object.keys(state.final.answers).length+Number(ready(state.final.reflection,15)),total:11};
    return {done:0,total:0};
  }
  function sectionIntro(n,kicker,title,desc,stage){
    const id='m'+n,guide=MISSION_STRUCTURE[id],progress=missionActivityProgress(id);
    return `<header class="mission-header"><div class="eyebrow">Misión ${n} / 4 · ${esc(stage)}</div><div class="title-row"><h1>${esc(title)}</h1><span class="badge purple">55 minutos</span></div><p class="sublead">${esc(desc)}</p></header><div class="lesson-overview"><div><strong>Ruta de aprendizaje</strong><p>${esc(kicker)}</p></div><div class="lesson-steps"><span>Explora</span><span>Practica</span><span>Resuelve</span><span>Reflexiona</span></div></div><section class="lesson-guide" aria-label="Propósito, avance e índice de esta misión"><h2>Propósito de aprendizaje</h2><p>${esc(guide.objective)}</p><p class="lesson-progress-label">Actividades registradas: <strong>${progress.done} de ${progress.total}</strong>. El avance no equivale a dominio matemático.</p><div class="lesson-progress-track" role="progressbar" aria-label="Actividades registradas en la misión ${n}" aria-valuemin="0" aria-valuemax="${progress.total}" aria-valuenow="${progress.done}" aria-valuetext="${progress.done} de ${progress.total} actividades registradas"><span style="width:${Math.min(100,Math.round(progress.done/progress.total*100))}%"></span></div><nav class="lesson-index" aria-label="Ir a los apartados de la misión ${n}">${guide.steps.map((step,i)=>`<button type="button" class="lesson-jump" data-action="jump-section" data-step="${i}">${i+1}. ${esc(step.label)}</button>`).join('')}</nav></section>`;
  }
  function missionFooter(id,requirements){const done=complete(id);const index=META.findIndex(x=>x.id===id);const next=META[index+1];return `<div class="mission-complete" role="status"><h2>${done?'✓ ¡Misión completada!':'Tu misión sigue en marcha'}</h2><div class="details">${done?'Has realizado las actividades previstas. Las respuestas abiertas todavía requieren revisión del docente.':'Para completar: '+esc(requirements)}</div>${done&&next?`<div class="inline-actions"><button class="button" data-action="goto" data-target="${next.id}">Ir a la siguiente misión →</button></div>`:''}${done&&!next?'<p>Ahora puedes descargar tu reporte desde «Mi reporte».</p>':''}</div><div class="footer-nav"><button class="button button-outline" data-action="goto" data-target="home">← Volver a inicio</button><button class="button button-ghost" data-action="goto" data-target="report">Ver mi reporte ↓</button></div>`;}
  function quizItem(q,kind,key,number,label){let selected;
    if(kind==='diag')selected=state.diagnostic.answers[key];
    else if(kind==='final')selected=state.final.answers[key];
    else {let [module,field]=key.split('.');selected=state[module][field];}
    const done=selected!==undefined&&selected!==null;
    const isCorrect=done&&selected===q.correct;
    const lock=(kind==='diag'||kind==='final')&&done;
    const message=kind==='diag'?null:(done?(isCorrect?'Correcto. '+q.reason:(kind==='final'?'Esta respuesta no es correcta. '+q.reason:'Revisa tu respuesta. '+(q.hint || 'Usa los ejemplos y vuelve a intentarlo.'))):null);
    return `<section class="panel" aria-label="${esc(label)} ${number}"><div class="panel-kicker">${esc(label)} ${number}</div><h2 id="q-${kind}-${esc(key)}">${esc(q.q)}</h2><div class="choice-list" role="group" aria-labelledby="q-${kind}-${esc(key)}">${q.options.map((opt,i)=>`<button type="button" class="choice ${done&&kind==='final'&&(i===q.correct?'correct':i===selected?'incorrect':'')}${kind==='form'&&isCorrect&&i===selected?' correct':''}" data-action="quiz" data-kind="${kind}" data-key="${esc(key)}" data-choice="${i}" aria-pressed="${done&&selected===i}" ${lock||kind==='form'&&isCorrect?'disabled':''}><span class="marker">${'ABCD'[i]}</span><span>${esc(opt)}</span>${done&&selected===i?'<span class="option-selection">Seleccionada</span>':''}</button>`).join('')}</div>${message?`<div class="feedback ${isCorrect?'good':'wrong'}" role="status">${esc(message)}</div>`:''}${kind==='diag'&&done?'<p class="tiny muted">Respuesta diagnóstica guardada. No tiene calificación.</p>':''}</section>`;
  }
  function reflection(module,title,prompt,min=10){return `<section class="panel"><div class="panel-kicker">Reflexiona · 5 minutos</div><h2>${esc(title)}</h2><p>${esc(prompt)}</p><div class="callout"><strong>Guía para explicar tu respuesta</strong><ol>${REFLECTION_GUIDES[module].map(item=>`<li>${esc(item)}</li>`).join('')}</ol><p>Escribe el procedimiento con tus palabras. La aplicación no puede verificar si tu explicación es matemáticamente correcta.</p></div><label class="reflection-label" for="reflect-${module}">Tu explicación escrita</label><textarea id="reflect-${module}" aria-describedby="reflect-instructions-${module} reflect-status-${module}" class="textarea" data-reflection="${module}" maxlength="1500" placeholder="Escribe con tus propias palabras…">${esc(module==='m4'?state.final.reflection:state[module].reflection)}</textarea><p class="tiny muted" id="reflect-instructions-${module}">Se guarda en este navegador. Mínimo ${min} caracteres para guardar. La longitud no acredita aprendizaje: el docente revisará las cuatro explicaciones con una rúbrica.</p><p class="tiny" id="reflect-status-${module}">${((module==='m4'?state.final.reflection:state[module].reflection).trim().length>=min)?'✓ Texto guardado · pendiente de revisión docente':'Pendiente de escribir'}</p><button type="button" class="button button-outline" data-action="save-reflection">Guardar reflexión y revisar avance →</button></section>`;}
  function renderHome(){return `<section class="hero"><div class="eyebrow">Misión digital · Matemáticas de sexto grado</div><h1>Exploradores<br>de números</h1><p>Cuatro misiones para descubrir múltiplos, divisores y pistas de divisibilidad. Aprende a tu ritmo, practica y demuestra cómo piensas.</p><div class="hero-meta"><span>4 misiones · 55 min cada una</span><span>Retos con pistas</span><span>Sin crear cuentas</span></div><button class="button button-gold" data-action="goto" data-target="${configured()?'m1':'profile'}">${configured()?'Continuar expedición →':'Comenzar mi expedición →'}</button></section>
    <div class="section-head"><div><h2>Mapa de misiones</h2><p>Completa las actividades para desbloquear la siguiente misión. Este avance no equivale a una calificación.</p></div><span class="badge">${completedCount()} de 4 completadas</span></div><div class="cards">${META.map((m,i)=>`<article class="mission-card"><div class="card-symbol" aria-hidden="true">${m.icon}</div><h3>${i+1}. ${m.name}</h3><p>${['Encuentra regularidades y aprende a construir listas de múltiplos.','Forma grupos iguales, descubre divisores y justifica repartos exactos.','Descubre reglas para decidir si un número se divide entre 2, 3, 5 y 10.','Aplica lo aprendido en situaciones de una feria y del entorno.'][i]}</p><div class="card-foot"><span class="badge ${complete(m.id)?'':'purple'}">${complete(m.id)?'Completada':(m.id==='m1'||isUnlocked(m.id))?'Disponible':'Bloqueada'}</span><button class="button button-small ${isUnlocked(m.id)?'':'button-outline'}" ${(m.id==='m1'||isUnlocked(m.id))?'':'disabled'} data-action="goto" data-target="${m.id}">${complete(m.id)?'Repasar':(m.id==='m1'&&!configured())?'Empezar →':isUnlocked(m.id)?'Entrar →':'🔒'}</button></div></article>`).join('')}</div><div class="panel"><h2>¿Qué aprenderás?</h2><p>Reconocer múltiplos y divisores de números naturales, utilizar los criterios de divisibilidad por 2, 3, 5 y 10, y resolver situaciones de agrupación o reparto sin residuo.</p><div class="callout green"><strong>Recuerda</strong>El diagnóstico inicial no tiene calificación. Las pistas y oportunidades de corregir respuestas son parte del aprendizaje.</div></div><section class="panel guide-home-link"><h2>Guía didáctica de consulta</h2><p>Consulta dieciséis ejemplos resueltos, cuatro por misión, para comprender los temas y repasar a tu ritmo.</p><button class="button button-outline" data-action="goto" data-target="guide">Abrir la guía didáctica →</button></section><section class="panel report-guide"><div class="panel-kicker">Tu trabajo queda en este equipo</div><h2>¿Dónde encuentro mis avances?</h2><p>En <strong>Mi reporte</strong> puedes consultar las misiones realizadas y descargar tus respuestas. Antes de cambiar de computador, guarda el archivo y entrégalo por el medio indicado por el docente.</p><p class="tiny muted">El porcentaje indica actividades terminadas, no dominio matemático demostrado.</p>${configured()?'<button class="button button-outline" data-action="goto" data-target="report">Consultar y descargar mi reporte ↓</button>':'<p class="tiny muted">Al comenzar la expedición podrás consultar tu reporte.</p>'}</section>`;}
  function renderGuide(){
    return `<article class="didactic-guide" aria-labelledby="guide-title">
      <header class="guide-banner">
        <div class="eyebrow">Material de consulta · Matemáticas · Grado sexto</div>
        <h1 id="guide-title">Guía didáctica</h1>
        <p>Aprende a reconocer múltiplos, divisores y criterios de divisibilidad mediante ejemplos desarrollados y situaciones cercanas a la vida escolar en Montería.</p>
        <p class="guide-banner-note">Esta guía es para estudiantes de sexto grado. Puedes consultarla cuando necesites repasar; no modifica tus respuestas ni tus calificaciones.</p>
      </header>
      <nav class="guide-index" aria-label="Índice de la guía didáctica">
        <h2>Contenido de la guía</h2>
        <div class="guide-index-links">
          <button type="button" data-action="guide-section" data-section="purpose">1. Propósito y objetivos</button>
          <button type="button" data-action="guide-section" data-section="method">2. Cómo aprender</button>
          <button type="button" data-action="guide-section" data-section="multiples">3. Múltiplos</button>
          <button type="button" data-action="guide-section" data-section="divisors">4. Divisores</button>
          <button type="button" data-action="guide-section" data-section="divisibility">5. Divisibilidad</button>
          <button type="button" data-action="guide-section" data-section="integrated">6. Problemas integradores</button>
          <button type="button" data-action="guide-section" data-section="evaluation">7. Evaluación y reporte</button>
        </div>
      </nav>
      <section id="guide-purpose" class="guide-part" aria-labelledby="guide-purpose-title">
        <h2 id="guide-purpose-title" tabindex="-1">1. Propósito y objetivos de aprendizaje</h2>
        <p>Identificar múltiplos y divisores de números naturales, reconocer cuándo una división es exacta, aplicar criterios de divisibilidad por 2, 3, 5 y 10 y argumentar cada respuesta mediante operaciones.</p>
        <div class="guide-info"><strong>Conocimientos previos:</strong> tablas de multiplicar, divisiones y residuos. Ten lápiz y papel para representar agrupaciones o explicar procedimientos.</div>
        <p>Recorrido: <strong>múltiplos → divisores → divisibilidad → reto integrador</strong>. Cada misión tiene una duración orientativa de 55 minutos y puede desarrollarse en varias sesiones.</p>
      </section>
      <section id="guide-method" class="guide-part" aria-labelledby="guide-method-title">
        <h2 id="guide-method-title" tabindex="-1">2. Cómo aprender con Exploradores de números</h2>
        <ol class="guide-steps">
          <li><strong>Observa:</strong> lee las explicaciones y analiza los ejemplos.</li>
          <li><strong>Explora:</strong> cambia los números y observa sus resultados.</li>
          <li><strong>Practica:</strong> selecciona respuestas y utiliza las pistas cuando sea necesario.</li>
          <li><strong>Explica:</strong> escribe el procedimiento matemático con tus palabras.</li>
          <li><strong>Revisa:</strong> consulta el avance y descarga tu informe al terminar.</li>
        </ol>
        <div class="guide-info"><strong>Importante:</strong> las prácticas permiten corregir respuestas. El diagnóstico de seis preguntas no tiene nota; las ocho preguntas finales se registran al primer intento. Terminar una misión no acredita por sí solo dominio matemático.</div>
      </section>

      <section id="guide-multiples" class="guide-part" aria-labelledby="guide-multiples-title">
        <h2 id="guide-multiples-title" tabindex="-1">3. Misión 1: múltiplos</h2>
        <p>Un <strong>múltiplo</strong> se obtiene al multiplicar un número natural por otro. Observa cuatro situaciones diferentes y comprueba qué cantidad se repite en cada caso.</p>
        <div class="guide-example">
          <h3>Ejemplo resuelto 1 · Semilleros de la huerta escolar</h3>
          <p>En la huerta escolar se preparan 7 bandejas con 3 plantas en cada una. ¿Cuántas plantas se necesitan?</p>
          <p class="guide-equation">7 × 3 = 21</p>
          <p><strong>Procedimiento:</strong> sumamos 7 grupos de 3 plantas, o multiplicamos directamente. <strong>Conclusión:</strong> 21 es múltiplo de 3 y de 7.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 2 · Estantes de una biblioteca</h3>
          <p>Una biblioteca de Montería dispone 9 estantes pequeños con 8 libros en cada uno. ¿Cuántos libros se organizaron?</p>
          <p class="guide-equation">9 × 8 = 72</p>
          <p><strong>Comprobación:</strong> hay nueve grupos de ocho. <strong>Conclusión:</strong> 72 es múltiplo de 8 y de 9.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 3 · Materiales de una exposición</h3>
          <p>Para una exposición de ciencias se preparan 11 mesas con 4 marcadores por mesa. ¿Cuántos marcadores hay en total?</p>
          <p class="guide-equation">11 × 4 = 44</p>
          <p><strong>Procedimiento:</strong> multiplicamos las mesas por los marcadores de cada una. <strong>Conclusión:</strong> 44 pertenece a la lista de múltiplos de 11: 11, 22, 33, 44…</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 4 · ¿Una cantidad es múltiplo?</h3>
          <p>Un grupo reunió 62 fotografías. ¿Es posible repartirlas en paquetes de 8 sin sobrantes?</p>
          <p class="guide-equation">8 × 7 = 56; 8 × 8 = 64</p>
          <p><strong>Comprobación:</strong> 62 queda entre dos múltiplos consecutivos de 8. <strong>Conclusión:</strong> 62 no es múltiplo de 8.</p>
        </div>
        <p class="guide-check"><strong>Ahora inténtalo:</strong> escribe los primeros cinco múltiplos positivos de 12 y comprueba cada uno con una multiplicación. Esta actividad no se resuelve en los ejemplos.</p>
      </section>
      <section id="guide-divisors" class="guide-part" aria-labelledby="guide-divisors-title">
        <h2 id="guide-divisors-title" tabindex="-1">4. Misión 2: divisores</h2>
        <p>Un número es <strong>divisor</strong> de otro cuando la división es exacta: el residuo debe ser cero. Compara casos donde se puede repartir todo con otros donde quedan sobrantes.</p>
        <div class="guide-example">
          <h3>Ejemplo resuelto 5 · Fichas para una competencia</h3>
          <p>Se tienen 32 fichas. ¿Pueden organizarse en grupos de 8? ¿Y en grupos de 6?</p>
          <p class="guide-equation">32 ÷ 8 = 4; 32 = 6 × 5 + 2</p>
          <p><strong>Conclusión:</strong> 8 es divisor de 32 porque se forman cuatro grupos exactos. En grupos de 6 sobran dos fichas; por eso 6 no es divisor de 32.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 6 · Carpetas en la biblioteca</h3>
          <p>Una biblioteca organiza 50 carpetas en lotes de 10. ¿Sobran carpetas? ¿Qué sucede si los lotes son de 8?</p>
          <p class="guide-equation">50 ÷ 10 = 5; 50 = 8 × 6 + 2</p>
          <p><strong>Conclusión:</strong> 10 es divisor de 50 porque no sobra ninguna carpeta. El 8 no lo es porque sobran dos.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 7 · Material para equipos deportivos</h3>
          <p>Para una jornada deportiva se distribuyen 56 cintas en grupos de 7. ¿Cuántos grupos se forman? ¿Y si cada grupo recibe 9 cintas?</p>
          <p class="guide-equation">56 ÷ 7 = 8; 56 = 9 × 6 + 2</p>
          <p><strong>Conclusión:</strong> 7 es divisor de 56. El 9 no es divisor porque sobran dos cintas.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 8 · Sobres para una campaña escolar</h3>
          <p>Hay 63 sobres. Se quieren repartir en paquetes de 9 y también se considera hacerlo en paquetes de 8.</p>
          <p class="guide-equation">63 ÷ 9 = 7; 63 = 8 × 7 + 7</p>
          <p><strong>Conclusión:</strong> 9 es divisor de 63; en cambio, 8 no lo es porque quedarían siete sobres sueltos.</p>
        </div>
        <p class="guide-check"><strong>Ahora inténtalo:</strong> demuestra por qué 6 sí es divisor de 66 y por qué 4 no lo es. Justifica con operaciones propias.</p>
      </section>
      <section id="guide-divisibility" class="guide-part" aria-labelledby="guide-divisibility-title">
        <h2 id="guide-divisibility-title" tabindex="-1">5. Misión 3: criterios de divisibilidad</h2>
        <p>Las reglas permiten comprobar algunos divisores sin calcular toda la división. Revisa la última cifra y, cuando sea necesario, suma las cifras del número.</p>
        <div class="guide-table-wrap"><table class="guide-table">
          <caption>Reglas para los divisores 2, 3, 5 y 10</caption>
          <thead><tr><th scope="col">Divisor</th><th scope="col">Cómo reconocerlo</th></tr></thead>
          <tbody>
            <tr><th scope="row">2</th><td>Termina en 0, 2, 4, 6 u 8.</td></tr>
            <tr><th scope="row">3</th><td>La suma de sus cifras es múltiplo de 3.</td></tr>
            <tr><th scope="row">5</th><td>Termina en 0 o 5.</td></tr>
            <tr><th scope="row">10</th><td>Termina en 0.</td></tr>
          </tbody>
        </table></div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 9 · Código de un inventario</h3>
          <p>Una caja está identificada con el número 246. Determina cuáles de los criterios estudiados cumple.</p>
          <p class="guide-equation">2 + 4 + 6 = 12</p>
          <p><strong>Comprobación:</strong> termina en 6, una cifra par; además, la suma 12 es múltiplo de 3. <strong>Conclusión:</strong> 246 es divisible por 2 y por 3, pero no por 5 ni por 10.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 10 · Entradas para un evento</h3>
          <p>Se numeran unas entradas con el número 175. ¿Qué criterios cumple?</p>
          <p class="guide-equation">1 + 7 + 5 = 13</p>
          <p><strong>Comprobación:</strong> termina en 5, pero la suma de sus cifras no es múltiplo de 3. <strong>Conclusión:</strong> 175 solo es divisible por 5 entre los cuatro criterios estudiados.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 11 · Número sin criterios favorables</h3>
          <p>Un equipo recibe el número 91 y debe comprobarlo usando únicamente las reglas de 2, 3, 5 y 10.</p>
          <p class="guide-equation">9 + 1 = 10</p>
          <p><strong>Comprobación:</strong> termina en 1; no es par ni termina en 0 o 5. La suma de sus cifras tampoco es múltiplo de 3. <strong>Conclusión:</strong> 91 no cumple ninguno de esos cuatro criterios.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 12 · Una cantidad que cumple los cuatro criterios</h3>
          <p>En un inventario se registra el número 330. Comprueba la divisibilidad por 2, 3, 5 y 10.</p>
          <p class="guide-equation">3 + 3 + 0 = 6</p>
          <p><strong>Comprobación:</strong> termina en 0 y la suma de sus cifras es múltiplo de 3. <strong>Conclusión:</strong> 330 cumple los cuatro criterios.</p>
        </div>
        <p class="guide-check"><strong>Ahora inténtalo:</strong> ¿cuáles de los cuatro criterios cumple 322? Argumenta con la última cifra y la suma de cifras.</p>
      </section>
      <section id="guide-integrated" class="guide-part" aria-labelledby="guide-integrated-title">
        <h2 id="guide-integrated-title" tabindex="-1">6. Misión 4: problemas integradores</h2>
        <p>Lee cada situación, decide qué operación necesitas, comprueba los residuos y explica tu conclusión. Estos cuatro casos utilizan cantidades diferentes de las preguntas de evaluación.</p>
        <div class="guide-example">
          <h3>Ejemplo resuelto 13 · Cuadernos para una campaña</h3>
          <p>Una campaña escolar dispone de 96 cuadernos. ¿Pueden formarse paquetes de 12? ¿Y de 7?</p>
          <p class="guide-equation">96 ÷ 12 = 8; 96 = 7 × 13 + 5</p>
          <p><strong>Conclusión:</strong> con 12 cuadernos se forman ocho paquetes exactos. Con 7 por paquete quedan cinco sueltos.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 14 · Tarjetas en una exposición</h3>
          <p>Para una exposición de la institución se preparan 100 tarjetas. ¿Pueden distribuirse en grupos de 4? ¿Y en grupos de 6?</p>
          <p class="guide-equation">100 ÷ 4 = 25; 100 = 6 × 16 + 4</p>
          <p><strong>Conclusión:</strong> los grupos de 4 son exactos; los grupos de 6 dejan cuatro tarjetas sobrantes.</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 15 · Plantas para un proyecto ambiental</h3>
          <p>La huerta escolar tiene 144 plantas. Si se organizan en grupos de 9, ¿cuántos se forman? Comprueba también los criterios de divisibilidad por 2 y por 3.</p>
          <p class="guide-equation">144 ÷ 9 = 16; 1 + 4 + 4 = 9</p>
          <p><strong>Conclusión:</strong> se forman dieciséis grupos sin sobrantes. El 144 es divisible por 2 (termina en 4) y por 3 (sus cifras suman 9).</p>
        </div>
        <div class="guide-example">
          <h3>Ejemplo resuelto 16 · Etiquetas para una feria</h3>
          <p>Un salón dispone de 132 etiquetas. ¿Puede formar paquetes de 6 sin sobrantes? ¿Y de 5? Comprueba además si el número es divisible por 2 y por 3.</p>
          <p class="guide-equation">132 ÷ 6 = 22; 132 = 5 × 26 + 2</p>
          <p><strong>Conclusión:</strong> 6 es divisor de 132 y 5 no. Como termina en 2 y 1 + 3 + 2 = 6, también es divisible por 2 y por 3.</p>
        </div>
        <p class="guide-check"><strong>Ahora inténtalo:</strong> propón dos tamaños de paquetes para repartir exactamente 88 fichas y explica por qué. Comprueba tus elecciones sin copiar una respuesta resuelta.</p>
      </section>
      <section id="guide-evaluation" class="guide-part" aria-labelledby="guide-evaluation-title">
        <h2 id="guide-evaluation-title" tabindex="-1">7. Tu evaluación y tu reporte</h2>
        <p>En cada misión encontrarás actividades para practicar y demostrar cómo piensas. Así funcionan tus respuestas:</p>
        <div class="guide-table-wrap"><table class="guide-table">
          <caption>Cómo funcionan tus actividades</caption>
          <thead><tr><th scope="col">Actividad</th><th scope="col">¿Qué debes saber?</th></tr></thead>
          <tbody>
            <tr><th scope="row">Diagnóstico: 6 preguntas</th><td>Responde lo que ya sabes. No tiene nota y tus primeras respuestas quedan guardadas.</td></tr>
            <tr><th scope="row">Prácticas y retos</th><td>Puedes leer las pistas, revisar tu respuesta y volver a intentarlo cuando te equivoques.</td></tr>
            <tr><th scope="row">Evaluación final: 8 preguntas</th><td>Lee con atención antes de elegir: cada respuesta se registra al primer intento. Al terminar verás tus aciertos.</td></tr>
            <tr><th scope="row">Explicaciones escritas</th><td>Cuenta con tus palabras qué hiciste y por qué. Tu docente leerá y valorará estas explicaciones por separado.</td></tr>
            <tr><th scope="row">Mi reporte</th><td>Puedes consultar lo que hiciste y descargar un archivo TXT o CSV. También puedes imprimirlo o guardarlo como PDF.</td></tr>
          </tbody>
        </table></div>
        <div class="guide-info"><strong>Cuida tus datos:</strong> utiliza un código de trabajo. No escribas tu nombre, teléfono ni dirección. Tu avance se guarda en este navegador y no se envía automáticamente. Descarga tu reporte antes de cambiar de equipo.</div>
        <p class="guide-check"><strong>Recuerda:</strong> terminar una misión significa que realizaste sus actividades; para demostrar lo que aprendiste también necesitas explicar tus procedimientos.</p>
      </section>
      <div class="guide-end"><button class="button button-outline" data-action="goto" data-target="home">← Volver al mapa</button><button class="button button-ghost" data-action="guide-section" data-section="purpose">↑ Inicio de la guía</button></div>
    </article>`;
  }

  function renderCredits(){
    return `<article class="credits-page" aria-labelledby="credits-title">
      <header class="credits-banner"><div class="eyebrow">Exploradores de números · Información del recurso</div><h1 id="credits-title">Créditos</h1><p>Conoce quién elaboró este recurso educativo digital, su contexto académico y las condiciones para utilizar los materiales.</p></header>
      <section class="credits-panel" aria-labelledby="credits-auth-title">
        <h2 id="credits-auth-title">Autoría e información académica</h2>
        <dl class="credits-details">
          <div><dt>RED</dt><dd>Exploradores de números: retos de múltiplos y divisores para sexto grado</dd></div>
          <div><dt>Autor y desarrollo</dt><dd>John Fernando Vergara Arroyo</dd></div>
          <div><dt>Institución de referencia</dt><dd>IE Isabel La Católica · Montería, Córdoba, Colombia</dd></div>
          <div><dt>Contexto académico</dt><dd>Especialización en Aplicación de TIC para la Enseñanza · Centro Virtual CVUDES, Universidad de Santander (UDES)</dd></div>
          <div><dt>Destinatarios</dt><dd>Estudiantes de Matemáticas de sexto grado, grupos 6-1 y 6-2</dd></div>
          <div><dt>Contenidos</dt><dd>Múltiplos, divisores y criterios de divisibilidad por 2, 3, 5 y 10</dd></div>
          <div><dt>Tecnologías</dt><dd>HTML5, CSS y JavaScript</dd></div>
          <div><dt>Año y versión</dt><dd>2026 · Versión 1.2</dd></div>
        </dl>
        <p class="credits-note">La institución educativa y la Universidad de Santander se indican como contexto académico. Esto no significa que el RED sea una publicación institucional oficial.</p>
      </section>
      <section class="credits-panel" aria-labelledby="credits-license-title">
        <h2 id="credits-license-title">Licenciamiento de contenidos y código</h2>
        <p>Los materiales educativos originales y la programación utilizan licencias diferentes.</p>
        <div class="credits-license-grid">
          <div class="credits-license credits-license-content">
            <p class="credits-type">CONTENIDOS EDUCATIVOS</p><h3>CC BY-NC-SA 4.0</h3>
            <p>Los textos, las explicaciones, preguntas, actividades y ejemplos originales pueden compartirse y adaptarse con fines no comerciales, reconociendo la autoría y cumpliendo las condiciones de CompartirIgual.</p>
            <ul><li>Reconocer al autor y la fuente.</li><li>Indicar los cambios realizados.</li><li>Compartir las adaptaciones según las condiciones de esta licencia.</li></ul>
            <p><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer">Consultar la licencia Creative Commons</a></p>
            <p><a href="https://github.com/jvergara26/exploradores-de-numeros/blob/main/LICENSE-CONTENIDOS.md" target="_blank" rel="noopener noreferrer">Ver condiciones de los contenidos originales</a></p>
          </div>
          <div class="credits-license credits-license-code">
            <p class="credits-type">CÓDIGO FUNCIONAL</p><h3>MIT</h3>
            <p>El código funcional original puede utilizarse, copiarse, modificarse y distribuirse conservando el aviso de derechos de autor y el texto de la licencia MIT.</p>
            <p>Esta licencia del software <strong>no sustituye</strong> las condiciones CC BY-NC-SA de los contenidos pedagógicos.</p>
            <p><a href="https://github.com/jvergara26/exploradores-de-numeros/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Consultar licencia MIT del proyecto</a></p>
          </div>
        </div>
      </section>
      <section class="credits-panel" aria-labelledby="credits-privacy-title">
        <h2 id="credits-privacy-title">Uso responsable</h2>
        <p>Las licencias se aplican a los materiales originales cuando los derechos correspondan al autor. Las marcas y materiales de terceros conservan sus propias condiciones.</p>
        <p>Los códigos de trabajo, respuestas y reportes individuales de estudiantes <strong>no están autorizados para publicación o redistribución</strong> por estas licencias.</p>
        <p>El progreso personal se consulta en <strong>Mi reporte</strong>. Esta sección solo contiene información de créditos y derechos de autor.</p>
      </section>
      <div class="credits-end"><button type="button" class="button button-outline" data-action="goto" data-target="home">← Volver al inicio</button><button type="button" class="button button-ghost" data-action="goto" data-target="guide">Consultar la guía didáctica →</button></div>
    </article>`;
  }

  function renderProfile(){return `<div class="eyebrow">Antes de empezar</div><h1>Prepara tu expedición</h1><p class="sublead">Solo necesitamos tu grupo y un código de trabajo. No escribas tu nombre, apellidos, teléfono ni dirección.</p><div class="panel"><h2>Mi identificación de trabajo</h2><div class="flex-form"><div class="field"><label for="group">Grupo</label><select id="group" class="control" aria-describedby="profileError"><option value="">Selecciona tu grupo</option><option value="6-1" ${state.profile.group==='6-1'?'selected':''}>6-1</option><option value="6-2" ${state.profile.group==='6-2'?'selected':''}>6-2</option></select></div><div class="field"><label for="code">Código de estudiante (sin nombres)</label><input id="code" class="control" value="${esc(state.profile.code)}" maxlength="20" aria-describedby="codehint profileError"><span id="codehint" class="tiny muted">Puedes conservar el código sugerido o usar uno asignado por el docente.</span></div></div><div class="inline-actions"><button class="button" data-action="save-profile">Guardar y entrar a la Misión 1 →</button><button class="button button-outline" data-action="goto" data-target="home">Volver</button></div><div id="profileError" class="feedback wrong" hidden role="alert"></div></div><div class="callout"><strong>Privacidad</strong>El progreso solo se guarda en este navegador. Cuando termines, descarga el informe y compártelo con el profesor por el medio acordado. Si cambias de equipo, el avance no se transfiere automáticamente.</div>`;}
  function diagnosis(){const finished=DIAG.every((q,i)=>state.diagnostic.answers[i]!==undefined);return `<div class="panel"><div class="panel-kicker">Tu punto de partida · 10 minutos</div><h2>Diagnóstico inicial</h2><p>Responde lo que sabes sin consultar las pistas de la misión. No se asigna nota. Tus primeras respuestas quedan guardadas para orientar el aprendizaje.</p><div class="mini-progress"><span style="width:${Object.keys(state.diagnostic.answers).length/6*100}%"></span></div><p class="tiny muted">${Object.keys(state.diagnostic.answers).length} de 6 respuestas registradas</p></div>${DIAG.map((q,i)=>quizItem(q,'diag',String(i),i+1,'Diagnóstico')).join('')}${finished?`<div class="callout green"><strong>Diagnóstico completado</strong>Ya puedes continuar. El docente podrá analizar estos resultados al revisar tu reporte; aquí no se asigna calificación.</div>`:''}`;}
  function numChips(module,max){const curr=state[module].selected;return `<div class="number-grid" role="group" aria-label="Selecciona números de la actividad">${Array.from({length:max},(_,i)=>i+1).map(n=>`<button type="button" class="number-chip" aria-pressed="${curr.includes(n)}" data-action="chip" data-module="${module}" data-number="${n}" ${state[module].solved?'disabled':''}>${n}</button>`).join('')}</div>`;}
  // Recta numérica determinista: cada salto equivale al factor seleccionado.
  function multipleNumberLine(factor){
    const n=Math.max(2,Math.min(10,Math.trunc(Number(factor)||5)));
    const start=58,step=108,axisY=119;
    const marks=Array.from({length:9},(_,i)=>i*n);
    const ticks=marks.map((value,i)=>{
      const x=start+i*step;
      return `<line x1="${x}" y1="${axisY-8}" x2="${x}" y2="${axisY+8}" class="number-line-tick"/><text x="${x}" y="${axisY+33}" text-anchor="middle" class="number-line-label">${value}</text>`;
    }).join('');
    const jumps=Array.from({length:8},(_,i)=>{
      const x1=start+i*step,x2=x1+step,middle=(x1+x2)/2;
      return `<path d="M ${x1} ${axisY-9} Q ${middle} 31 ${x2} ${axisY-9}" class="number-line-jump"/><text x="${middle}" y="63" text-anchor="middle" class="number-line-step">+${n}</text>`;
    }).join('');
    return `<figure class="number-line-figure"><figcaption><strong>Ocho saltos iguales en la recta numérica</strong><span>Partimos de 0 y avanzamos de ${n} en ${n}. Los números alcanzados son múltiplos de ${n}.</span></figcaption><div class="number-line-canvas"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 175" role="img" aria-labelledby="number-line-title number-line-desc"><title id="number-line-title">Recta numérica de múltiplos de ${n}</title><desc id="number-line-desc">Desde el 0, ocho saltos de ${n} unidades: ${marks.join(', ')}.</desc><line x1="43" y1="${axisY}" x2="935" y2="${axisY}" class="number-line-axis"/><path d="M 935 119 L 926 113 M 935 119 L 926 125" class="number-line-axis"/>${jumps}${ticks}</svg></div></figure>`;
  }
  function renderM1(){const factor=Number(state.m1.factor)||5;return sectionIntro(1,'Diagnóstico 10 · Exploración 12 · Práctica 20 · Problema 8 · Reflexión 5','Descubre los múltiplos','Reconoce patrones numéricos y relaciónalos con multiplicaciones.','Patrones que se repiten')+diagnosis()+`<section class="panel"><div class="panel-kicker">Explora · 12 minutos</div><h2>La máquina de multiplicar</h2><p>Un múltiplo se obtiene al multiplicar un número natural por otro. Prueba diferentes cantidades y observa los resultados.</p><div class="select-row"><label for="factor">Número que se repite:</label><select id="factor" class="control" style="max-width:120px" data-select="factor">${Array.from({length:9},(_,i)=>i+2).map(n=>`<option value="${n}" ${n===factor?'selected':''}>${n}</option>`).join('')}</select></div><div class="factors" id="factor-preview" aria-live="polite">${Array.from({length:8},(_,i)=>`<span class="factor">${factor*(i+1)}</span>`).join('')}</div><div id="factor-number-line">${multipleNumberLine(factor)}</div><p class="tiny muted" id="factor-explanation">Ejemplo: ${factor} × 4 = ${factor*4}. Todos los resultados mostrados son múltiplos de ${factor}.</p></section>
    <section class="panel"><div class="panel-kicker">Practica · 20 minutos</div><h2>Encuentra los múltiplos de 4</h2><p>Selecciona <strong>todos</strong> los múltiplos positivos de 4, desde 1 hasta 32. Puedes marcar y desmarcar números antes de comprobar.</p>${numChips('m1',32)}<div class="inline-actions"><button class="button" data-action="verify-chips" data-module="m1" ${state.m1.solved?'disabled':''}>Comprobar selección</button><button class="button button-outline" data-action="clear-chips" data-module="m1" ${state.m1.solved?'disabled':''}>Borrar selección</button></div>${alertHTML(state.m1.feedback,state.m1.solved)}</section>${quizItem(FORMATIVE['m1.context'],'form','m1.context',1,'Problema del entorno · 8 min')}${reflection('m1','¿Qué descubriste?','Explica con tus palabras cómo podrías saber si 28 es múltiplo de 4.')}${missionFooter('m1','diagnóstico, lista de múltiplos, problema contextualizado y reflexión.')}`;}
  function batchesFor24(size){
    const quantity=Math.max(1,Math.min(12,Math.trunc(Number(size)||6)));
    const full=Math.floor(24/quantity),rest=24%quantity;
    const groups=Array.from({length:full},(_,i)=>`<div class="batch"><span class="batch-label" aria-hidden="true">Grupo ${i+1}</span><div class="dots" aria-hidden="true">${'<span class="dot"></span>'.repeat(quantity)}</div></div>`).join('');
    const remainder=rest?`<div class="batch leftover"><span class="batch-label" aria-hidden="true">Sobran ${rest}</span><div class="dots" aria-hidden="true">${'<span class="dot"></span>'.repeat(rest)}</div></div>`:'';
    return `<figure class="reparto-figure"><figcaption><strong>24 fichas en grupos de ${quantity}</strong></figcaption><div class="group-batches" role="img" aria-label="${full} grupos completos de ${quantity} fichas y ${rest} fichas sobrantes">${groups}${remainder}</div><p class="reparto-result">${full} grupos completos de ${quantity}${rest?', y sobran '+rest+' fichas.':', sin sobrantes.'} Comprobación: ${full} × ${quantity} + ${rest} = 24.</p></figure>`;
  }
  function renderM2(){let size=Number(state.m2.groupSize)||6;return sectionIntro(2,'Recordatorio 8 · Exploración 12 · Práctica 20 · Problema 10 · Reflexión 5','El desafío de los divisores','Aprende a reconocer divisores mediante agrupaciones y divisiones exactas.','Repartos y agrupaciones')+`<section class="panel"><div class="panel-kicker">Recuerda · 8 minutos</div><h2>¿Qué es un divisor?</h2><p>Un número es divisor de otro cuando permite una <strong>división exacta</strong>: no sobra ninguna unidad. Por ejemplo, 4 es divisor de 52 porque 52 ÷ 4 = 13.</p><div class="callout purple"><strong>Conexión con la misión anterior</strong>Si 68 es múltiplo de 4, entonces 4 es divisor de 68.</div><div class="compare-grid" aria-label="Comparación de múltiplos y divisores"><div class="compare-example"><strong>Cuando la división es exacta</strong><p><b>4 × 17 = 68</b></p><p>68 es múltiplo de 4. A la vez, 4 es divisor de 68 porque <b>68 ÷ 4 = 17</b>, sin residuo.</p></div><div class="compare-example compare-warning"><strong>Cuando quedan fichas sin repartir</strong><p><b>68 ÷ 6 = 11 y sobran 2</b></p><p>6 no es divisor de 68, porque al repartir quedan dos unidades sin agrupar.</p></div></div><p class="tiny muted">Comprueba siempre la operación: ¿la división deja residuo cero?</p></section><section class="panel"><div class="panel-kicker">Explora · 12 minutos</div><h2>Reparte 24 fichas</h2><p>Escoge cuántas fichas tendrá cada grupo. Observa si sobran algunas.</p><div class="select-row"><label for="group-size">Fichas por grupo:</label><select id="group-size" class="control" style="max-width:130px" data-select="groupSize">${Array.from({length:12},(_,i)=>i+1).map(n=>`<option value="${n}" ${n===size?'selected':''}>${n}</option>`).join('')}</select></div><div id="batch-preview">${batchesFor24(size)}</div></section>
    <section class="panel"><div class="panel-kicker">Practica · 20 minutos</div><h2>¿Cuáles son los divisores de 24?</h2><p>Marca <strong>todos</strong> los números entre 1 y 24 que permiten repartir 24 fichas sin que sobre ninguna.</p>${numChips('m2',24)}<div class="inline-actions"><button class="button" data-action="verify-chips" data-module="m2" ${state.m2.solved?'disabled':''}>Comprobar selección</button><button class="button button-outline" data-action="clear-chips" data-module="m2" ${state.m2.solved?'disabled':''}>Borrar selección</button></div>${alertHTML(state.m2.feedback,state.m2.solved)}</section>${quizItem(FORMATIVE['m2.concept'],'form','m2.concept',1,'Comprueba la idea')}${quizItem(FORMATIVE['m2.context'],'form','m2.context',2,'Problema del entorno · 10 min')}${reflection('m2','¿Qué significa repartir exactamente?','Propón un reparto exacto y otro con sobrantes, utilizando una cantidad diferente de 24 fichas. Comprueba ambos procedimientos y explica cuál número sí es divisor y cuál no.')}${missionFooter('m2','lista de divisores, dos problemas y reflexión.')}`;}
  function criteriaCase(c,i){const selected=state.m3.selected[i]||[];const done=state.m3.solved[i];const options=[2,3,5,10];return `<div class="panel"><div class="panel-kicker">Desafío ${i+1} / ${CASES.length}</div><h2>¿Por cuáles números es divisible ${c.n}?</h2><p>Selecciona todos los criterios que cumple. Si no cumple ninguno, deja las casillas sin marcar y pulsa Comprobar.</p><div class="inline-actions" role="group" aria-label="Criterios de ${c.n}">${options.map(k=>`<button type="button" data-action="criteria-toggle" data-index="${i}" data-criterion="${k}" aria-pressed="${selected.includes(k)}" class="number-chip" style="min-width:75px" ${done?'disabled':''}>÷ ${k}</button>`).join('')}</div><div class="inline-actions"><button class="button button-small" data-action="criteria-check" data-index="${i}" ${done?'disabled':''}>Comprobar</button><span class="badge ${done?'':'purple'}">${done?'✓ Resuelto':'Pendiente'}</span></div>${state.m3.feedback[i]?alertHTML(state.m3.feedback[i],done):''}</div>`;}
  function renderM3(){return sectionIntro(3,'Activación 8 · Criterios 15 · Clasificación 20 · Situación 7 · Reflexión 5','Detectives de la divisibilidad','Usa pistas en las cifras para decidir cuándo una división es exacta.','Pistas numéricas')+`<section class="panel"><div class="panel-kicker">Aprende · 23 minutos</div><h2>Cuatro pistas rápidas</h2><div class="rule-list"><div class="rule"><strong>2</strong><span>Termina en <b>0, 2, 4, 6 u 8</b>.</span></div><div class="rule"><strong>3</strong><span>La <b>suma de sus cifras</b> es múltiplo de 3.</span></div><div class="rule"><strong>5</strong><span>Termina en <b>0 o 5</b>.</span></div><div class="rule"><strong>10</strong><span>Termina en <b>0</b>.</span></div></div><figure class="divisibility-figure"><figcaption><strong>Ejemplo visual: el número 150</strong></figcaption><div class="digit-display" aria-hidden="true"><span class="digit-tile">1</span><span class="digit-tile">5</span><span class="digit-tile last-digit">0</span></div><div class="criterion-steps"><p><strong>Observa la última cifra: 0.</strong> Por terminar en 0, 150 es divisible por <strong>2, 5 y 10</strong>.</p><p><strong>Suma sus cifras:</strong> 1 + 5 + 0 = 6. Como 6 es múltiplo de 3, 150 también es divisible por <strong>3</strong>.</p></div></figure></section><div class="panel"><div class="panel-kicker">Practica · 20 minutos</div><h2>Clasifica seis números</h2><p>Comprueba cada caso. Puedes consultar las reglas anteriores y corregir si te equivocas.</p><p class="tiny muted">Resueltos: ${CASES.filter((c,i)=>state.m3.solved[i]).length} de ${CASES.length}</p></div>${CASES.map((c,i)=>criteriaCase(c,i)).join('')}${quizItem(FORMATIVE['m3.context'],'form','m3.context',1,'Problema del entorno · 7 min')}${reflection('m3','¿Qué criterio utilizaste?','Explica cómo puedes saber si 123 es divisible por 3 sin hacer la división.')}${missionFooter('m3','seis números clasificados, problema contextualizado y reflexión.')}`;}
  function renderM4(){const count=Object.keys(state.final.answers).length;return sectionIntro(4,'Recuperación 10 · Problemas 25 · Evaluación 15 · Reflexión 5','Gran reto de Montería','Resuelve nuevas situaciones para demostrar que comprendes múltiplos, divisores y criterios de divisibilidad.','Poner a prueba lo aprendido')+`<section class="panel"><div class="panel-kicker">Punto de llegada · 10 minutos</div><h2>Antes de resolver</h2><p>Un múltiplo se obtiene mediante una multiplicación. Un divisor permite una división exacta. Los criterios de divisibilidad son pistas para decidir sin efectuar toda la división.</p><div class="callout"><strong>Evaluación individual</strong>Cada pregunta se registra al primer intento y no puede cambiarse después. Tu resultado cuenta solo las preguntas de opción múltiple; el docente revisará por separado tu explicación escrita.</div><div class="mini-progress"><span style="width:${count/FINAL.length*100}%"></span></div><p class="tiny muted">${count} de ${FINAL.length} respuestas de evaluación guardadas</p></section><div class="panel"><div class="panel-kicker">Resuelve · 25 minutos</div><h2>Dos problemas integradores</h2><p>Antes de la evaluación, resuelve estas situaciones y revisa las pistas cuando las necesites. Puedes corregir tus respuestas.</p></div>${quizItem(FORMATIVE['final.practice0'],'form','final.practice0',1,'Problema de aplicación')}${quizItem(FORMATIVE['final.practice1'],'form','final.practice1',2,'Problema de aplicación')}<div class="panel"><div class="panel-kicker">Evaluación final · 15 minutos</div><h2>Ocho preguntas individuales</h2><p>En esta parte cada respuesta queda registrada al primer intento.</p></div>${FINAL.map((q,i)=>quizItem(q,'final',String(i),i+1,'Desafío final')).join('')}${reflection('m4','Argumenta tu solución','Una escuela tiene 36 fichas para repartir sin sobrantes. Describe dos tamaños posibles de grupo y explica cómo comprobaste tu respuesta.',15)}<section class="panel optional-challenge"><div class="panel-kicker">Profundiza a tu ritmo · opcional</div><h2>Desafío adicional sin nota</h2><p>Busca todos los números <strong>mayores que 30 y menores que 60</strong> que sean múltiplos de 4 y de 6 al mismo tiempo. Justifica cada respuesta con dos multiplicaciones.</p><details><summary>Ver una pista para empezar</summary><p>Escribe primero los múltiplos de 4 y luego los de 6 en ese intervalo. Compara las dos listas.</p></details><p class="tiny muted">Este reto no modifica el puntaje, las misiones completadas ni el archivo de resultados. Puedes resolverlo en una hoja suelta.</p></section>${complete('m4')?`<section class="panel"><div class="panel-kicker">Resultados orientativos</div><h2>¡Completaste la expedición!</h2><div class="result-header"><div class="score">${score()} / 8</div><p>${score()>=7?'Buen dominio de las preguntas objetivas.':score()>=5?'Vas avanzando. Revisa las explicaciones para seguir mejorando.':'Conviene repasar los ejemplos y practicar algunos conceptos.'}</p></div><p class="tiny muted">Este resultado no reemplaza la valoración docente de procedimientos y argumentación.</p><button class="button" data-action="goto" data-target="report">Descargar mi reporte ↓</button></section>`:''}${missionFooter('m4','dos problemas integradores, ocho respuestas finales y una explicación de al menos 15 caracteres.')}`;}
  function renderReport(){const done=complete('m4');const count=Object.keys(state.final.answers).length;return `<div class="eyebrow">Evidencia de aprendizaje</div><div class="title-row"><h1>Mi reporte</h1><span class="badge gold">Descarga individual</span></div><p class="sublead">Aquí puedes revisar tus <strong>actividades realizadas</strong> y descargar tus respuestas. Las misiones terminadas no son una calificación ni demuestran por sí solas dominio matemático.</p><div class="data-grid"><div class="stat"><strong>${esc(state.profile.group||'—')}</strong><span>Grupo</span></div><div class="stat"><strong>${completedCount()} / 4</strong><span>Misiones con actividades realizadas</span></div><div class="stat"><strong>${count} / 8</strong><span>Respuestas finales entregadas</span></div></div><div class="panel"><h2>Resumen de aprendizaje</h2><p><strong>Código de trabajo:</strong> ${esc(state.profile.code)}</p><p><strong>Diagnóstico:</strong> ${Object.keys(state.diagnostic.answers).length} de 6 respuestas registradas, sin nota.</p><p><strong>Evaluación final:</strong> ${done?`<strong>${score()} de 8 respuestas correctas</strong>`:`${count} de 8 respondidas. Sigue trabajando para completar el informe.`}</p><p><strong>Reflexión final:</strong> ${state.final.reflection.trim()?'Texto registrado; pendiente de valoración docente.':'Pendiente.'}</p><p><strong>Reflexiones:</strong> ${[state.m1.reflection,state.m2.reflection,state.m3.reflection,state.final.reflection].map((v,i)=>'Misión '+(i+1)+': '+reflectionStatus(v)).join(' · ')}</p><div class="callout green"><strong>Datos y privacidad</strong>El reporte se genera directamente en este dispositivo. No se transmiten respuestas automáticamente. Si compartes el computador, descarga tu informe y consulta con el docente antes de borrar el progreso.</div><div class="report-instructions"><h3>Antes de cerrar o cambiar de equipo</h3><ol><li>Descarga tu informe en TXT o CSV.</li><li>Comprueba que el archivo se guardó en la carpeta Descargas.</li><li>Entrégalo al docente por el medio acordado.</li><li>Si el computador es compartido, consulta al docente antes de borrar el avance.</li></ol></div><div class="report-actions"><button class="button" data-action="download-text">↓ Descargar informe .txt</button><button class="button button-purple" data-action="download-csv">↓ Descargar datos .csv</button><button class="button button-outline" data-action="print">Imprimir / guardar como PDF</button></div><p class="tiny muted">El archivo CSV contiene una fila que puede integrarse con otros resultados. Las reflexiones se conservan en ambos archivos.</p></div>${RUBRIC_HTML}<div class="panel"><h2>Revisión de tu evaluación</h2>${count?`<div class="review">${FINAL.map((q,i)=>{const sel=state.final.answers[i];return `<div class="review-item"><strong>${i+1}. ${esc(q.q)}</strong><span>Tu respuesta: ${sel===undefined?'Pendiente':esc(q.options[sel])}</span>${sel!==undefined?`<span>${sel===q.correct?'✓ Correcta':'✗ Por revisar'} · ${esc(q.reason)}</span>`:''}</div>`;}).join('')}</div>`:'<p class="empty">Aún no hay respuestas del desafío final.</p>'}</div><div class="panel"><h2>Administrar este dispositivo</h2><p class="tiny muted">El avance permanece en el navegador actual. Borrar los datos no se puede deshacer.</p><button class="button button-outline" data-action="reset">Borrar mi progreso de este dispositivo</button></div><div class="footer-nav"><button class="button button-outline" data-action="goto" data-target="home">← Volver al inicio</button></div>`;}
  function renderNav(){const node=document.getElementById('missionNav');node.innerHTML=`<button class="nav-item" data-action="goto" data-target="home" ${current==='home'?'aria-current="page"':''}><span class="nav-symbol" aria-hidden="true">⌂</span><span class="nav-copy">Inicio<small>Mapa del recorrido</small></span></button>`+META.map((m,i)=>`<button class="nav-item" data-action="goto" data-target="${m.id}" ${current===m.id?'aria-current="page"':''} ${(i===0||isUnlocked(m.id))?'':'disabled'}><span class="nav-symbol" aria-hidden="true">${complete(m.id)?'✓':isUnlocked(m.id)?m.icon:'·'}</span><span class="nav-copy">${i+1}. ${m.name}<small>${complete(m.id)?'Completada':(i===0||isUnlocked(m.id))?'Disponible':'Bloqueada'}</small></span></button>`).join('')+`<button class="nav-item nav-guide" data-action="goto" data-target="guide" ${current==='guide'?'aria-current="page"':''}><span class="nav-symbol" aria-hidden="true">▤</span><span class="nav-copy">Guía didáctica<small>Ejemplos y orientaciones</small></span></button>`+`<button class="nav-item nav-credits" data-action="goto" data-target="credits" ${current==='credits'?'aria-current="page"':''}><span class="nav-symbol" aria-hidden="true">©</span><span class="nav-copy">Créditos<small>Autoría y licencias</small></span></button>`;const progress=completionRatio();document.getElementById('sidePercent').textContent=progress+'%';document.getElementById('sideProgressFill').style.width=progress+'%';document.getElementById('sideProgress').setAttribute('aria-valuenow',progress);document.getElementById('sideProgress').setAttribute('aria-valuetext',completedCount()+' de 4 misiones terminadas');}
  function enhanceMissionStructure(){
    const guide=MISSION_STRUCTURE[current];if(!guide)return;
    const view=document.getElementById('view'),panels=[...view.querySelectorAll('.panel')];
    const targets=guide.steps.map((step,i)=>{
      const panel=panels.find(item=>step.heading
        ? item.querySelector('h2')?.textContent.trim()===step.heading
        : item.querySelector('.panel-kicker')?.textContent.trim().startsWith(step.kicker));
      if(panel){panel.id='lesson-step-'+i;const heading=panel.querySelector('h2');if(heading)heading.tabIndex=-1;}
      else{const button=view.querySelector('[data-action="jump-section"][data-step="'+i+'"]');if(button)button.disabled=true;}
      return panel||null;
    });
    targets.forEach((panel,i)=>{
      if(!panel)return;
      const next=targets.findIndex((item,j)=>j>i&&item);
      if(next<0)return;
      panel.insertAdjacentHTML('beforeend','<div class="lesson-continue"><button type="button" class="button button-outline button-small" data-action="jump-section" data-step="'+next+'">Siguiente apartado: '+esc(guide.steps[next].label)+' →</button></div>');
    });
  }
  // Claves visuales consistentes en todas las misiones; no alteran las respuestas ni el avance.
  function decorateLearningPanels(){
    if(!META.some(m=>m.id===current))return;
    document.querySelectorAll('#view .panel').forEach(panel=>{
      const kicker=panel.querySelector('.panel-kicker')?.textContent.trim()||'';
      const reflection=Boolean(panel.querySelector('textarea[data-reflection]'));
      const question=Boolean(panel.querySelector('.choice-list,[data-action="verify-chips"],[data-action="criteria-check"]'))
        ||panel.classList.contains('optional-challenge')
        ||/^(Practica|Clasifica|Evaluación final|Desafío)/.test(kicker);
      const kind=reflection?'reflection':question?'question':'content';
      const caption=kind==='reflection'?'Reflexiona y explica':kind==='question'?'Pregunta o reto':'Contenido y orientación';
      const glyph=kind==='reflection'?'✎':kind==='question'?'?':'▣';
      panel.classList.add('panel--'+kind);
      panel.insertAdjacentHTML('afterbegin','<div class="panel-purpose-tag"><span class="panel-purpose-icon" aria-hidden="true">'+glyph+'</span>'+caption+'</div>');
    });
  }
  function render(){if(!['home','profile','report','guide','credits',...META.map(m=>m.id)].includes(current))current='home';if(META.some(m=>m.id===current)&&!isUnlocked(current))current='home';renderNav();document.getElementById('view').innerHTML=({home:renderHome,profile:renderProfile,report:renderReport,guide:renderGuide,credits:renderCredits,m1:renderM1,m2:renderM2,m3:renderM3,m4:renderM4})[current]();enhanceMissionStructure();decorateLearningPanels();document.getElementById('reportNav').disabled=!configured();if(!storageOkay){document.getElementById('view').insertAdjacentHTML('afterbegin','<div class="feedback wrong">Este navegador no permite guardar el avance automáticamente. Descarga tu reporte antes de cerrar.</div>');}}
  function renderAfterAction(el){
    const fields=['action','kind','key','choice','module','number','index','criterion'];
    const identity=fields.filter(k=>el.dataset[k]!==undefined).map(k=>[k,el.dataset[k]]);
    const panelIndex=[...document.querySelectorAll('#view .panel')].indexOf(el.closest('.panel'));
    const previousY=window.scrollY;render();
    const equivalent=[...document.querySelectorAll('#view [data-action]')].find(item=>identity.every(([key,value])=>item.dataset[key]===value));
    let focusTarget=equivalent&&!equivalent.disabled?equivalent:null;
    if(!focusTarget){
      const panel=document.querySelectorAll('#view .panel')[panelIndex];
      focusTarget=panel?.querySelector('h2,h3')||document.getElementById('main');
      if(focusTarget!==document.getElementById('main'))focusTarget.tabIndex=-1;
    }
    focusTarget.focus({preventScroll:true});window.scrollTo({top:previousY,behavior:'auto'});
  }
  // Conserva el historial de pantallas y evita entradas duplicadas al pulsar la misma navegación.
  function goTo(next){
    if(next==='m1'&&!configured())next='profile';
    if(META.some(m=>m.id===next)&&!isUnlocked(next)){
      announce('Completa la misión anterior para desbloquearla.');return;
    }
    if(current!==next){
      current=next;
      history.pushState(null,'','#'+(next==='home'?'inicio':next==='credits'?'creditos':next==='guide'?'guia':next));
      render();
    }
    window.scrollTo({top:0,behavior:'auto'});
    document.getElementById('main').focus({preventScroll:true});
  }
  // Resuelve enlaces directos y entradas del historial con las mismas condiciones de desbloqueo.
  function viewFromUrl(){
    const hash=location.hash.replace(/^#/,'');
    const requested=!hash||hash==='inicio'?'home':hash==='guia'?'guide':hash==='creditos'?'credits':hash;
    if(!['home','profile','report','guide','credits',...META.map(m=>m.id)].includes(requested))return 'home';
    if(META.some(m=>m.id===requested)&&!isUnlocked(requested))return 'home';
    return requested;
  }
  function syncViewWithUrl(){
    const next=viewFromUrl(),canonical='#'+(next==='home'?'inicio':next==='credits'?'creditos':next==='guide'?'guia':next);
    if(location.hash&&location.hash!==canonical)history.replaceState(null,'',canonical);
    // Back/forward can raise popstate and hashchange; one render is enough.
    if(next===current)return;
    current=next;render();window.scrollTo({top:0,behavior:'auto'});
    document.getElementById('main').focus({preventScroll:true});
  }
  function sortedEqual(a,b){return a.length===b.length && [...a].sort((x,y)=>x-y).every((v,i)=>v===[...b].sort((x,y)=>x-y)[i]);}
  function handleAction(el){const action=el.dataset.action;
    if(action==='goto'){goTo(el.dataset.target);return;}
    if(action==='guide-section'){
      const section=document.getElementById('guide-'+el.dataset.section);
      const heading=section?.querySelector('h2');
      if(heading){heading.focus({preventScroll:true});section.scrollIntoView({behavior:'auto',block:'start'});}
      return;
    }
    if(action==='jump-section'){
      const section=document.getElementById('lesson-step-'+el.dataset.step);
      const heading=section?.querySelector('h2');
      if(heading){heading.focus({preventScroll:true});section.scrollIntoView({behavior:'auto',block:'start'});}
      return;
    }
    if(action==='save-profile'){
      const groupField=document.getElementById('group'),codeField=document.getElementById('code');
      const g=groupField.value,code=codeField.value.trim().toUpperCase(),error=document.getElementById('profileError');
      const groupValid=['6-1','6-2'].includes(g),codeValid=/^[-A-Z0-9]{2,20}$/.test(code);
      groupField.setAttribute('aria-invalid',String(!groupValid));
      codeField.setAttribute('aria-invalid',String(!codeValid));
      if(!groupValid||!codeValid){
        error.hidden=false;error.textContent='Elige tu grupo e introduce un código de 2 a 20 letras, números o guiones, sin nombres.';
        (!groupValid?groupField:codeField).focus();return;
      }
      error.hidden=true;state.profile={group:g,code};persist();goTo('m1');return;
    }
    if(action==='quiz'){const {kind,key,choice}=el.dataset;const index=Number(choice);
      if(kind==='diag'){if(state.diagnostic.answers[key]!==undefined)return;state.diagnostic.answers[key]=index;announce('Respuesta diagnóstica registrada. No tiene calificación.');}
      else if(kind==='final'){if(state.final.answers[key]!==undefined)return;state.final.answers[key]=index;announce('Respuesta final registrada.');}
      else {const [mod,field]=key.split('.');if(state[mod][field]===FORMATIVE[key].correct)return;state[mod][field]=index;announce(index===FORMATIVE[key].correct?'¡Correcto!':'Revisa la pista y vuelve a intentarlo.');}
      persist();renderAfterAction(el);return;}
    if(action==='chip'){const {module}=el.dataset;const n=Number(el.dataset.number);if(state[module].solved)return;let xs=state[module].selected;state[module].selected=xs.includes(n)?xs.filter(x=>x!==n):[...xs,n];state[module].feedback='';persist();renderAfterAction(el);return;}
    if(action==='clear-chips'){const module=el.dataset.module;if(state[module].solved)return;state[module].selected=[];state[module].feedback='';persist();renderAfterAction(el);return;}
    if(action==='verify-chips'){const module=el.dataset.module;if(state[module].solved)return;const correct=module==='m1'?Array.from({length:8},(_,i)=>(i+1)*4):Array.from({length:24},(_,i)=>i+1).filter(x=>24%x===0);const good=sortedEqual(state[module].selected,correct);state[module].solved=good;state[module].feedback=good?(module==='m1'?'¡Bien hecho! Son los ocho múltiplos positivos de 4 entre 1 y 32.':'¡Correcto! Los divisores positivos de 24 son 1, 2, 3, 4, 6, 8, 12 y 24.'):('Todavía hay números por revisar. '+(module==='m1'?'Piensa en 4 × 1, 4 × 2, …, 4 × 8.':'Comprueba cuáles permiten dividir 24 sin residuo.'));persist();renderAfterAction(el);announce(state[module].feedback);return;}
    if(action==='criteria-toggle'){const idx=Number(el.dataset.index),k=Number(el.dataset.criterion);if(state.m3.solved[idx])return;const xs=state.m3.selected[idx]||[];state.m3.selected[idx]=xs.includes(k)?xs.filter(v=>v!==k):[...xs,k];state.m3.feedback[idx]='';persist();renderAfterAction(el);return;}
    if(action==='criteria-check'){const idx=Number(el.dataset.index);const c=CASES[idx];if(state.m3.solved[idx])return;const good=sortedEqual(state.m3.selected[idx]||[],c.correct);state.m3.solved[idx]=good;state.m3.feedback[idx]=good?'¡Correcto! '+c.why:'Comprueba todas las reglas. Revisa la última cifra y la suma de cifras.';persist();renderAfterAction(el);announce(state.m3.feedback[idx]);return;}
    if(action==='save-reflection'){persist();renderAfterAction(el);announce('Texto guardado. La valoración matemática queda pendiente de revisión docente.');return;}
    if(action==='download-text'){downloadText();return;}
    if(action==='download-csv'){downloadCsv();return;}
    if(action==='print'){window.print();return;}
    if(action==='reset'){if(window.confirm('Se borrarán tus respuestas y el código guardado en este navegador. ¿Deseas continuar?')){state=INITIAL();persist();goTo('home');}return;}
  }
  function reportData(){return {version:VERSION,date:new Date().toLocaleString('es-CO'),group:state.profile.group||'Sin grupo',code:state.profile.code,diagnosticAnswered:Object.keys(state.diagnostic.answers).length,diagnosticCorrect:diagnosticScore(),mission1:complete('m1')?'Sí':'No',mission2:complete('m2')?'Sí':'No',mission3:complete('m3')?'Sí':'No',mission4:complete('m4')?'Sí':'No',finalAnswered:Object.keys(state.final.answers).length,finalCorrect:score(),finalTotal:FINAL.length,diagnosticResponses:DIAG.map((q,i)=>{let x=state.diagnostic.answers[i];return x===undefined?'Pendiente':q.options[x];}),finalResponses:FINAL.map((q,i)=>{let x=state.final.answers[i];return x===undefined?'Pendiente':q.options[x];}),reflections:[state.m1.reflection,state.m2.reflection,state.m3.reflection,state.final.reflection],reflectionStatuses:[state.m1.reflection,state.m2.reflection,state.m3.reflection,state.final.reflection].map(reflectionStatus)};}
  function filename(ext){return 'Exploradores_'+(state.profile.group||'sin-grupo')+'_'+(state.profile.code||'sin-codigo').replace(/[^A-Z0-9-]/gi,'').slice(0,20)+'.'+ext;}
  function downloadFile(text,name,type){const blob=new Blob(['\uFEFF',text],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);announce('Archivo descargado. Comprueba la carpeta de descargas.');}
  function downloadText(){let data=reportData();let lines=['EXPLORADORES DE NÚMEROS — INFORME DE APRENDIZAJE','Colegio Isabel La Católica, Montería | Matemáticas, grado sexto','Versión del RED: '+data.version,'Fecha de generación: '+data.date,'Código de trabajo: '+data.code,'Grupo: '+data.group,'','RESULTADOS','Diagnóstico inicial: '+data.diagnosticAnswered+'/6 respuestas, '+data.diagnosticCorrect+'/6 correctas. Sin calificación.','Misión 1: '+data.mission1,'Misión 2: '+data.mission2,'Misión 3: '+data.mission3,'Misión 4: '+data.mission4,'Evaluación final: '+data.finalAnswered+'/8 respondidas; '+data.finalCorrect+'/8 correctas.','Los aciertos registrados corresponden únicamente a las ocho preguntas cerradas.','La realización de las misiones no acredita por sí sola dominio conceptual.','Las reflexiones requieren valoración docente con rúbrica.','Estado reflexión 1: '+data.reflectionStatuses[0],'Estado reflexión 2: '+data.reflectionStatuses[1],'Estado reflexión 3: '+data.reflectionStatuses[2],'Estado reflexión 4: '+data.reflectionStatuses[3],'','RESPUESTAS INICIALES'];DIAG.forEach((q,i)=>lines.push((i+1)+'. '+q.q+' | '+data.diagnosticResponses[i]));lines.push('','RESPUESTAS DE EVALUACIÓN');FINAL.forEach((q,i)=>lines.push((i+1)+'. '+q.q+' | '+data.finalResponses[i]+' | Respuesta correcta: '+q.options[q.correct]));lines.push('','REFLEXIÓN MISIÓN 1',data.reflections[0]||'(vacía)','REFLEXIÓN MISIÓN 2',data.reflections[1]||'(vacía)','REFLEXIÓN MISIÓN 3',data.reflections[2]||'(vacía)','JUSTIFICACIÓN FINAL',data.reflections[3]||'(vacía)','','RÚBRICA PARA EL DOCENTE (no puntuada automáticamente)','Calificar cada criterio de 0 a 2 puntos en cada reflexión:','1. Corrección matemática: 0 incorrecta / 1 parcialmente correcta / 2 correcta.','2. Procedimiento y comprobación: 0 ausente / 1 incompleto / 2 pertinente y comprobable.','3. Claridad y pertinencia: 0 no responde / 1 poco precisa / 2 clara y pertinente.','Puntaje por reflexión: máximo 6 puntos. Total de cuatro reflexiones: máximo 24 puntos.','Reflexión 1: ___/6. Reflexión 2: ___/6. Reflexión 3: ___/6. Reflexión 4: ___/6.','Total manual: ___/24. Se registra aparte de las 8 preguntas cerradas.','','NOTAS','Este informe se genera en el navegador, sin conexión con bases de datos.','No acredita por sí mismo la identidad del estudiante ni sustituye la valoración docente.');downloadFile(lines.join('\n'),filename('txt'),'text/plain;charset=utf-8');}
  const csvCell = value => {let str=String(value??'');if(/^[=+\-@]/.test(str))str="'"+str;return '"'+str.replace(/"/g,'""')+'"';};
  function downloadCsv(){const d=reportData();const headers=['fecha','version','grupo','codigo','diagnostico_respuestas','diagnostico_aciertos','mision_1','mision_2','mision_3','mision_4','final_respuestas','final_aciertos','final_total',...DIAG.map((_,i)=>'diagnostico_p'+(i+1)),...FINAL.map((_,i)=>'final_p'+(i+1)),'reflexion_m1','reflexion_m2','reflexion_m3','justificacion_final','estado_reflexion_m1','estado_reflexion_m2','estado_reflexion_m3','estado_reflexion_m4','rubrica_manual_m1','rubrica_manual_m2','rubrica_manual_m3','rubrica_manual_m4','rubrica_manual_total'];const row=[d.date,d.version,d.group,d.code,d.diagnosticAnswered,d.diagnosticCorrect,d.mission1,d.mission2,d.mission3,d.mission4,d.finalAnswered,d.finalCorrect,d.finalTotal,...d.diagnosticResponses,...d.finalResponses,...d.reflections,...d.reflectionStatuses,'','','','',''];downloadFile(headers.map(csvCell).join(',')+'\r\n'+row.map(csvCell).join(','),filename('csv'),'text/csv;charset=utf-8');}
  document.addEventListener('click',event=>{const btn=event.target.closest('[data-action]');if(btn&&!btn.disabled)handleAction(btn);});
  document.addEventListener('input',event=>{const mod=event.target.dataset.reflection;if(mod){if(mod==='m4')state.final.reflection=event.target.value;else state[mod].reflection=event.target.value;persist();const indicator=document.getElementById('reflect-status-'+mod);if(indicator)indicator.textContent=(event.target.value.trim().length>=(mod==='m4'?15:10))?'✓ Texto guardado · pendiente de revisión docente':'Pendiente de escribir';}});
  document.addEventListener('change',event=>{const sel=event.target.dataset.select;if(sel==='factor'){state.m1.factor=Number(event.target.value);persist();document.getElementById('factor-preview').innerHTML=Array.from({length:8},(_,i)=>'<span class="factor">'+state.m1.factor*(i+1)+'</span>').join('');document.getElementById('factor-number-line').innerHTML=multipleNumberLine(state.m1.factor);const explanation=document.getElementById('factor-explanation');if(explanation)explanation.textContent='Ejemplo: '+state.m1.factor+' × 4 = '+(state.m1.factor*4)+'. Todos los resultados mostrados son múltiplos de '+state.m1.factor+'.';}if(sel==='groupSize'){state.m2.groupSize=Number(event.target.value);persist();document.getElementById('batch-preview').innerHTML=batchesFor24(state.m2.groupSize);}});
  document.getElementById('reportNav').addEventListener('click',()=>goTo('report'));
  document.getElementById('homeBrand').addEventListener('click',e=>{e.preventDefault();goTo('home');});
  // El salto al contenido no debe sustituir la dirección de la misión actual.
  const skipLink=document.querySelector('.skip');
  if(skipLink)skipLink.addEventListener('click',event=>{event.preventDefault();document.getElementById('main').focus();});
  window.addEventListener('popstate',syncViewWithUrl);
  window.addEventListener('hashchange',syncViewWithUrl);
  persist();current=viewFromUrl();
  const initialCanonical='#'+(current==='home'?'inicio':current==='guide'?'guia':current==='credits'?'creditos':current);
  if(location.hash&&location.hash!==initialCanonical)history.replaceState(null,'',initialCanonical);
  render();
  // Instrumentación auxiliar opcional para verificar matemática y completitud en pruebas automatizadas.
  if(location.search.includes('qa=1'))window.RED_TEST={state,DIAG,FORMATIVE,FINAL,CASES,complete,score,diagnosticScore,sortedEqual};
})();
