const C=window.CHANGE_LAB_CONFIG||{};
const vars=["Conciencia","Confianza","Energía","Compromiso","Conocimiento","Capacidad","Apropiación"];
const practices=[
["ADKAR","Diagnóstico individual del cambio"],["Lean Change","Experimentos y feedback loops"],
["Moving Motivators","Motivadores intrínsecos"],["Delegation Poker","Decisiones y empoderamiento"],
["Campañas de comunicación-difusión","Generar conciencia y alcance del cambio"],["TRIZ","Identificar comportamientos contraproducentes"],
["Nudges","Reducir fricción conductual"],["Redes de influencia","Movilizar líderes informales"],
["Storytelling","Construir sentido"],["Co-creación","Diseñar con las personas"],
["Aprendizaje experiencial","Practicar para desarrollar capacidad"],["Coaching","Acompañamiento individual"],
["Reconocimiento","Reforzar comportamientos y exaltar victorias tempranas"],["Comunidades de práctica","Aprendizaje entre pares"],
["Lecciones aprendidas","Capturar y transferir aprendizaje de la experiencia"],["Comunicación segmentada","Claridad según audiencia"],
["Respaldo directivo","Dar legitimidad, prioridad y coherencia al cambio"],["Grupos focales","Conversar sobre el cambio y comprender percepciones"]
];

const practiceCosts={
 "ADKAR":20,
 "Lean Change":30,
 "Moving Motivators":20,
 "Delegation Poker":20,
 "Campañas de comunicación-difusión":25,
 "TRIZ":20,
 "Nudges":15,
 "Redes de influencia":30,
 "Storytelling":15,
 "Co-creación":35,
 "Aprendizaje experiencial":35,
 "Coaching":40,
 "Reconocimiento":20,
 "Comunidades de práctica":30,
 "Lecciones aprendidas":20,
 "Comunicación segmentada":25,
 "Respaldo directivo":20,
 "Grupos focales":25
};
const TOTAL_BUDGET=120;

const rounds=[
{title:"Ronda 1 · El cambio fue anunciado",situation:"La transformación técnicamente va según cronograma. Sin embargo, aparecen señales contradictorias.",signals:["📊 91% asistió al lanzamiento.","💬 “Nos enteramos de decisiones por otros equipos.”","📊 Conocimiento declarado: 76%.","💬 “Entiendo qué cambia, pero no por qué.”","📉 Uso del nuevo proceso: 43%."]},
{title:"Ronda 2 · La organización responde",situation:"Las primeras intervenciones generan movimiento, pero también efectos no previstos.",signals:["💬 “Nos están preguntando mucho, pero no sabemos qué hacen con lo que decimos.”","📈 Algunos líderes informales empiezan a movilizar equipos.","📉 Los errores operativos aumentan.","💬 “Tengo ganas de hacerlo, pero no sé si puedo.”"]},
{title:"Ronda 3 · Presión competitiva",situation:"Dirección exige acelerar: otras organizaciones del sector muestran mejores resultados.",signals:["⚠️ El proyecto debe adelantar hitos.","💬 “Otra prioridad nueva esta semana.”","📊 La formación aumentó, la aplicación no al mismo ritmo.","💬 “¿Qué hicieron los otros para avanzar tanto?”"]},
{title:"Ronda 4 · Sostener o acelerar",situation:"Los resultados empiezan a aparecer. Dirección quiere aprovechar el impulso, pero el sistema muestra señales de fatiga.",signals:["📈 El KPI de negocio mejora.","📉 La energía de algunos equipos cae.","💬 “Podemos hacerlo, pero no sé cuánto tiempo a este ritmo.”","💬 “Ahora sí veo para qué sirve el cambio.”"]}
];
let team="";
let classCode="";
let state=null;
function freshState(){return{round:0,score:0,business:55,metrics:{Conciencia:52,Confianza:58,Energía:72,Compromiso:44,Conocimiento:61,Capacidad:42,Apropiación:35},history:[]};}
function stateKey(){return "changeState_"+classCode+"_"+team}
function enterGame(){
 const t=$("joinTeam").value.trim();
 const c=$("joinCode").value.trim().toUpperCase();
 if(t.length<2 || c.length<3){$("joinError").textContent="Ingresa el nombre del equipo y el código de la clase.";return}
 team=t; classCode=c;
 localStorage.setItem("changeTeam",team);localStorage.setItem("changeClassCode",classCode);
 state=JSON.parse(localStorage.getItem(stateKey())||"null")||freshState();
 if(state.metrics.Conciencia===undefined) state.metrics.Conciencia=52;
if(state.spent===undefined) state.spent=0;
if(state.metrics.Claridad!==undefined) delete state.metrics.Claridad;
if(state.evolution) state.evolution.forEach(p=>{ if(p.metrics && p.metrics.Claridad!==undefined) delete p.metrics.Claridad; });
if(!state.evolution){
  state.evolution=[{
    label:"Inicio",
    metrics:{...state.metrics},
    business:state.business
  }];
}
$("teamTag").textContent=" · "+team+" · "+classCode;
 $("joinOverlay").style.display="none";
 render();updateBudget();
}
let selected=[]; let time=420, tick;
const $=id=>document.getElementById(id);
vars.forEach(v=>{$("target").innerHTML+=`<option>${v}</option>`;$("bets").innerHTML+=`<div class="betrow"><span>${v}</span><input type="range" min="-15" max="15" value="0" data-bet="${v}"><b id="b_${v}">0</b></div>`});
["Alta dirección","Líderes","Influenciadores","Equipos","Individuos"].forEach(a=>$("audience").innerHTML+=`<option>${a}</option>`);
practices.forEach((p,i)=>$("practices").innerHTML+=`<div class="practice" data-i="${i}"><b>${p[0]}</b><small>${p[1]}</small><span class="cost">${practiceCosts[p[0]]} créditos</span></div>`);
function selectedCost(){return selected.reduce((sum,i)=>sum+(practiceCosts[practices[i][0]]||0),0)}
function remainingBudget(){return Math.max(0,TOTAL_BUDGET-(state.spent||0)-selectedCost())}
function updateBudget(){
 const used=selectedCost(), spent=state.spent||0, remaining=Math.max(0,TOTAL_BUDGET-spent-used);
 $("budgetUsed").textContent=used;
 $("budgetSpent").textContent=spent;
 $("budgetRemaining").textContent=remaining;
 $("budgetFill").style.width=Math.min(100,((spent+used)/TOTAL_BUDGET)*100)+"%";
 document.querySelectorAll(".practice").forEach(x=>{
   const i=+x.dataset.i, cost=practiceCosts[practices[i][0]]||0;
   x.classList.toggle("unaffordable",!selected.includes(i) && cost>remaining);
 });
}
document.querySelectorAll(".practice").forEach(x=>x.onclick=()=>{
 let i=+x.dataset.i;
 if(selected.includes(i)){
   selected=selected.filter(z=>z!==i);x.classList.remove("selected");
 }else{
   const cost=practiceCosts[practices[i][0]]||0;
   if(cost>remainingBudget()){
     alert(`Esta intervención cuesta ${cost} créditos. Solo te quedan ${remainingBudget()} créditos para toda la transformación.`);
     return;
   }
   selected.push(i);x.classList.add("selected");
 }
 updateBudget();
});
document.querySelectorAll("[data-bet]").forEach(x=>x.oninput=()=>{$("b_"+x.dataset.bet).textContent=(+x.value>0?"+":"")+x.value});


function drawEvolutionChart(){
 const canvas=$("evolutionChart"); if(!canvas)return;
 const dpr=window.devicePixelRatio||1;
 const rect=canvas.getBoundingClientRect();
 const W=Math.max(520,Math.floor(rect.width||820)), H=340;
 canvas.width=W*dpr;canvas.height=H*dpr;
 const ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);
 ctx.clearRect(0,0,W,H);
 const pad={l:44,r:18,t:20,b:48}, cw=W-pad.l-pad.r,ch=H-pad.t-pad.b;
 // grid
 ctx.font="11px Arial";ctx.fillStyle="#666";ctx.strokeStyle="#e2e2e2";ctx.lineWidth=1;
 [0,25,50,75,100].forEach(v=>{
   const y=pad.t+ch-(v/100)*ch;
   ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
   ctx.fillText(String(v),10,y+4);
 });
 const pts=state.evolution||[];
 const series=[...vars,"KPI negocio"];
 // Browser-generated palette: no external dependency.
 const palette=["#111111","#5b5b5b","#8a8a8a","#b0b0b0","#3f6b7a","#7b5b8d","#7a6a3f","#3f7a59","#8a4d4d"];
 series.forEach((s,si)=>{
   ctx.strokeStyle=palette[si%palette.length];ctx.fillStyle=palette[si%palette.length];ctx.lineWidth=2.2;
   ctx.beginPath();
   pts.forEach((p,i)=>{
     const x=pts.length===1?pad.l+cw/2:pad.l+(i/(Math.max(1,pts.length-1)))*cw;
     const val=s==="KPI negocio"?p.business:p.metrics[s];
     const y=pad.t+ch-(val/100)*ch;
     if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
   });ctx.stroke();
   pts.forEach((p,i)=>{
     const x=pts.length===1?pad.l+cw/2:pad.l+(i/(Math.max(1,pts.length-1)))*cw;
     const val=s==="KPI negocio"?p.business:p.metrics[s];
     const y=pad.t+ch-(val/100)*ch;
     ctx.beginPath();ctx.arc(x,y,3.2,0,Math.PI*2);ctx.fill();
   });
 });
 ctx.fillStyle="#555";ctx.textAlign="center";
 pts.forEach((p,i)=>{
   const x=pts.length===1?pad.l+cw/2:pad.l+(i/(Math.max(1,pts.length-1)))*cw;
   ctx.fillText(p.label,x,H-25);
 });
 ctx.textAlign="left";
 let legend=canvas.parentElement.querySelector(".chartlegend");
 if(!legend){legend=document.createElement("div");legend.className="chartlegend";canvas.parentElement.appendChild(legend)}
 legend.innerHTML=series.map((s,i)=>`<span><i class="chartdot" style="background:${palette[i%palette.length]}"></i>${s}</span>`).join("");
}

function render(){
 let r=rounds[state.round]; $("roundTag").textContent=`Ronda ${state.round+1}/4`; $("roundTitle").textContent=r.title;$("situation").textContent=r.situation;$("signals").innerHTML=r.signals.map(s=>`<div class="signal">${s}</div>`).join("");
 $("scoreTag").textContent=Math.round(state.score)+"/100";
 $("diagnosis").innerHTML=vars.map(v=>`<div class="diagrow"><span>${v}</span><input type="range" min="0" max="40" value="0" data-diag="${v}"><b id="d_${v}">0</b></div>`).join("");
 document.querySelectorAll("[data-diag]").forEach(x=>x.oninput=()=>{let sum=[...document.querySelectorAll("[data-diag]")].reduce((a,b)=>a+(+b.value),0);if(sum>100){x.value-=sum-100} $("d_"+x.dataset.diag).textContent=x.value;$("diagSum").textContent=[...document.querySelectorAll("[data-diag]")].reduce((a,b)=>a+(+b.value),0)});
 $("metrics").innerHTML=vars.map(v=>`<div class="metricrow"><span>${v}</span><div class="bar"><div class="fill" style="width:${state.metrics[v]}%"></div></div><b>${Math.round(state.metrics[v])}</b></div>`).join("")+`<div class="metricrow"><span>KPI negocio</span><div class="bar"><div class="fill" style="width:${state.business}%"></div></div><b>${Math.round(state.business)}</b></div>`;
 $("history").innerHTML=state.history.length?state.history.map(h=>`<div class="historyitem"><b>R${h.round}: ${h.target}</b> · <b>${h.credits??"—"} créditos invertidos</b><br>${h.practices.join(" + ")}<br><small>${h.hypothesis}</small></div>`).join(""):"Aún no has ejecutado decisiones.";
 renderRanking(); drawEvolutionChart(); startTimer();
}
function startTimer(){clearInterval(tick);time=420;tick=setInterval(()=>{time--;let m=Math.floor(time/60),s=time%60;$("timer").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;if(time<=0)clearInterval(tick)},1000)}
function effects(){
  let e=Object.fromEntries(vars.map(v=>[v,0]));
  const names=selected.map(i=>practices[i][0]);
  const target=$("target").value;

  const map={
    "ADKAR":{Conciencia:4,Conocimiento:4,Compromiso:2},
    "Lean Change":{Confianza:4,Compromiso:4,Capacidad:2},
    "Moving Motivators":{Compromiso:7,Confianza:3},
    "Delegation Poker":{Confianza:4,Compromiso:5},
    "Campañas de comunicación-difusión":{Conciencia:9,Conocimiento:2,Energía:-1},
    "TRIZ":{Confianza:2,Conciencia:2},
    "Nudges":{Capacidad:3,Compromiso:2},
    "Redes de influencia":{Compromiso:6,Confianza:2},
    "Storytelling":{Conciencia:5,Compromiso:4},
    "Co-creación":{Confianza:5,Compromiso:6,Energía:-3},
    "Aprendizaje experiencial":{Conocimiento:5,Capacidad:8,Energía:-2},
    "Coaching":{Capacidad:5,Confianza:3},
    "Reconocimiento":{Energía:5,Compromiso:5},
    "Comunidades de práctica":{Conocimiento:5,Capacidad:5,Confianza:2},
    "Lecciones aprendidas":{Conocimiento:5,Capacidad:4},
    "Comunicación segmentada":{Conciencia:5,Conocimiento:3},
    "Respaldo directivo":{Conciencia:5,Confianza:6,Compromiso:5},
    "Grupos focales":{Confianza:5,Conciencia:3,Compromiso:4,Energía:-1}
  };

  // Pertinencia por momento. No existe una única respuesta correcta:
  // varias prácticas pueden ser válidas, pero no todas son igualmente oportunas.
  const fit=[
    {"ADKAR":1.35,"Lean Change":.75,"Moving Motivators":.65,"Delegation Poker":.55,"Campañas de comunicación-difusión":1.25,"TRIZ":.75,"Nudges":.45,"Redes de influencia":.85,"Storytelling":1.25,"Co-creación":.8,"Aprendizaje experiencial":.55,"Coaching":.45,"Reconocimiento":.55,"Comunidades de práctica":.5,"Lecciones aprendidas":.35,"Comunicación segmentada":1.15,"Respaldo directivo":1.1,"Grupos focales":1.0},
    {"ADKAR":.75,"Lean Change":1.2,"Moving Motivators":.8,"Delegation Poker":.9,"Campañas de comunicación-difusión":.35,"TRIZ":.8,"Nudges":.65,"Redes de influencia":1.15,"Storytelling":.55,"Co-creación":1.15,"Aprendizaje experiencial":1.35,"Coaching":1.2,"Reconocimiento":.65,"Comunidades de práctica":1.15,"Lecciones aprendidas":.7,"Comunicación segmentada":.7,"Respaldo directivo":.8,"Grupos focales":1.15},
    {"ADKAR":.55,"Lean Change":1.3,"Moving Motivators":.8,"Delegation Poker":1.05,"Campañas de comunicación-difusión":.25,"TRIZ":.7,"Nudges":1.05,"Redes de influencia":1.2,"Storytelling":.45,"Co-creación":.8,"Aprendizaje experiencial":1.05,"Coaching":.85,"Reconocimiento":.8,"Comunidades de práctica":.95,"Lecciones aprendidas":.75,"Comunicación segmentada":.55,"Respaldo directivo":.75,"Grupos focales":.7},
    {"ADKAR":.45,"Lean Change":1.05,"Moving Motivators":.85,"Delegation Poker":.9,"Campañas de comunicación-difusión":.15,"TRIZ":.6,"Nudges":.9,"Redes de influencia":.95,"Storytelling":.35,"Co-creación":.55,"Aprendizaje experiencial":.9,"Coaching":.8,"Reconocimiento":1.25,"Comunidades de práctica":1.2,"Lecciones aprendidas":1.35,"Comunicación segmentada":.45,"Respaldo directivo":.65,"Grupos focales":.65}
  ][state.round];

  const consequence={high:[],medium:[],low:[],irrelevant:[],counterproductive:[],opportunity:false,synergies:[],warnings:[]};

  names.forEach(n=>{
    const f=fit[n]??.6;
    const base=map[n]||{};

    if(f>=.95){
      consequence.high.push(n);
      Object.entries(base).forEach(([k,v])=>e[k]+=v*f);
    }else if(f>=.65){
      consequence.medium.push(n);
      Object.entries(base).forEach(([k,v])=>e[k]+=v*f*.72);
    }else if(f>=.40){
      consequence.low.push(n);
      Object.entries(base).forEach(([k,v])=>e[k]+=v*f*.28);
      // costo de dispersión: aporta poco y consume capacidad de cambio
      e.Energía-=1;e.Confianza-=0.5;e.Compromiso-=0.5;e.Capacidad-=0.5;e.Apropiación-=0.75;
    }else if(f>=.25){
      consequence.irrelevant.push(n);
      e.Energía-=2.5;e.Confianza-=1.5;e.Compromiso-=1.5;e.Capacidad-=1.5;e.Apropiación-=2;
    }else{
      consequence.counterproductive.push(n);
      Object.entries(base).forEach(([k,v])=>{if(v<0)e[k]+=v;});
      e.Energía-=5;e.Confianza-=4;e.Compromiso-=3.5;e.Capacidad-=3;e.Apropiación-=4;
    }
  });

  // Calidad del diagnóstico: enfocar el objetivo que el equipo identificó como crítico suma;
  // diagnosticar una cosa e intervenir otra genera incoherencia.
  const attention=Object.fromEntries([...document.querySelectorAll("[data-diag]")].map(x=>[x.dataset.diag,+x.value]));
  const highest=Object.entries(attention).sort((a,b)=>b[1]-a[1])[0];
  if(highest&&highest[0]===target)e[target]+=3;
  if(highest&&highest[1]>=40&&highest[0]!==target){
    e.Confianza-=2;e.Energía-=2;
    consequence.warnings.push("El foco de la intervención no coincide con la principal hipótesis diagnóstica del equipo.");
  }

  // Sinergias: combinaciones que se refuerzan entre sí.
  if(names.includes("Grupos focales")&&names.includes("Lean Change")){e.Confianza+=3;e.Compromiso+=2;consequence.synergies.push("Escucha + experimentación: el feedback se convierte en ajustes visibles.");}
  if(names.includes("Respaldo directivo")&&names.includes("Campañas de comunicación-difusión")){e.Conciencia+=4;consequence.synergies.push("Patrocinio + comunicación: aumenta la legitimidad del mensaje.");}
  if(names.includes("Redes de influencia")&&names.includes("Reconocimiento")){e.Compromiso+=3;e.Confianza+=2;consequence.synergies.push("Influencia + reconocimiento: se refuerzan conductas visibles en la red.");}
  if(names.includes("Aprendizaje experiencial")&&names.includes("Comunidades de práctica")){e.Capacidad+=4;e.Conocimiento+=2;consequence.synergies.push("Práctica + aprendizaje entre pares: acelera transferencia y capacidad.");}
  if(names.includes("Co-creación")&&names.includes("Delegation Poker")){e.Compromiso+=3;e.Confianza+=2;consequence.synergies.push("Co-creación + autonomía: aumenta participación con capacidad de decisión.");}

  // Condiciones contextuales: una práctica pertinente también puede ser mal ejecutada
  // si el sistema no tiene las condiciones necesarias.
  if(names.includes("Co-creación")&&state.metrics.Energía<50){e.Energía-=6;e.Compromiso-=2;consequence.warnings.push("Co-crear con energía baja aumentó la carga del sistema.");}
  if(names.includes("Delegation Poker")&&state.metrics.Capacidad<45){e.Confianza-=3;consequence.warnings.push("Delegar sin suficiente capacidad generó incertidumbre.");}
  if(names.includes("Aprendizaje experiencial")&&state.metrics.Compromiso<40){e.Energía-=3;consequence.warnings.push("La práctica exigió esfuerzo en un sistema con bajo compromiso.");}
  if(names.includes("Campañas de comunicación-difusión")&&state.metrics.Conciencia>75){e.Energía-=5;e.Confianza-=2;consequence.warnings.push("Más comunicación masiva cuando la conciencia ya era alta produjo saturación.");}
  if(names.includes("Reconocimiento")&&state.metrics.Confianza<40){e.Confianza-=3;consequence.warnings.push("El reconocimiento fue percibido con baja credibilidad por la falta de confianza.");}

  // Costo de oportunidad: si ninguna intervención tiene pertinencia media-alta,
  // el problema central continúa avanzando aunque el equipo haya gastado recursos.
  const useful=consequence.high.length+consequence.medium.length;
  if(useful===0){
    consequence.opportunity=true;
    const deterioration=[
      {Confianza:-2,Energía:-2,Compromiso:-3,Capacidad:-2,Apropiación:-3},
      {Confianza:-2,Energía:-3,Compromiso:-2,Capacidad:-3,Apropiación:-3},
      {Confianza:-2,Energía:-4,Compromiso:-3,Capacidad:-3,Apropiación:-4},
      {Confianza:-2,Energía:-4,Compromiso:-3,Capacidad:-2,Apropiación:-4}
    ][state.round];
    Object.entries(deterioration).forEach(([k,v])=>e[k]+=v);
    consequence.warnings.push("Costo de oportunidad: se invirtieron recursos sin intervenir suficientemente la condición crítica de la ronda.");
  }

  // Sobreintervención y concentración excesiva de presupuesto.
  const spend=selectedCost();
  if(names.length>=4){e.Energía-=4;e.Confianza-=2;consequence.warnings.push("La sobreintervención aumentó la carga y los costos de coordinación.");}
  if(spend>=70){e.Energía-=5;e.Compromiso-=2;consequence.warnings.push("Concentrar muchos recursos en una sola ronda redujo la sostenibilidad.");}
  if(spend>=90){e.Energía-=4;e.Confianza-=3;}

  // Presión natural de cada ronda: no actuar bien también tiene consecuencias.
  const pressure=[{Energía:-2},{Energía:-4,Capacidad:-2},{Energía:-6,Confianza:-2},{Energía:-5,Compromiso:-2}][state.round];
  Object.entries(pressure).forEach(([k,v])=>e[k]+=v);

  // Variabilidad moderada para evitar resultados completamente mecánicos.
  vars.forEach(v=>e[v]+=Math.round((Math.random()*4)-2));

  e.__consequence=consequence;
  return e;
}

async function execute(){
 let sum=[...document.querySelectorAll("[data-diag]")].reduce((a,b)=>a+(+b.value),0);
 if(sum!==100)return alert("Distribuye exactamente 100 puntos de atención.");
 if(selected.length<1)return alert("Selecciona al menos una intervención.");
 if(selectedCost()>TOTAL_BUDGET-(state.spent||0))return alert("No tienes suficientes créditos disponibles en la bolsa total de transformación.");
 let hyp=$("hypothesis").value.trim();if(hyp.length<20)return alert("Formula una hipótesis breve de al menos 20 caracteres.");
 const roundSpend=selectedCost();
 clearInterval(tick); let e=effects(), consequence=e.__consequence||{}; delete e.__consequence; let before={...state.metrics};
 vars.forEach(v=>state.metrics[v]=Math.max(0,Math.min(100,state.metrics[v]+e[v])));
  // Apropiación sistémica: depende especialmente de compromiso, capacidad y confianza.
  // Una mala decisión no puede convertir automáticamente el deterioro en una mejora.
  const appropriationAfterDecision=state.metrics.Apropiación;
  let emerg=(state.metrics.Conciencia*.18+state.metrics.Compromiso*.27+state.metrics.Conocimiento*.12+state.metrics.Capacidad*.27+state.metrics.Confianza*.16);
  let emergentAppropriation=appropriationAfterDecision*.78+emerg*.22;
  const badDecision=(consequence.irrelevant?.length||0)>0 || (consequence.counterproductive?.length||0)>0 || consequence.opportunity;
  state.metrics.Apropiación=Math.max(0,Math.min(100,badDecision?Math.min(appropriationAfterDecision,emergentAppropriation):emergentAppropriation));
let health=vars.slice(0,6).reduce((a,v)=>a+state.metrics[v],0)/6;
 state.business=Math.max(0,Math.min(100,state.business+(state.metrics.Apropiación-45)*.10+(state.metrics.Capacidad-45)*.06));
 let imbalance=Math.max(...vars.slice(0,6).map(v=>state.metrics[v]))-Math.min(...vars.slice(0,6).map(v=>state.metrics[v]));
 let bets=Object.fromEntries([...document.querySelectorAll("[data-bet]")].map(x=>[x.dataset.bet,+x.value]));
 let accuracy=vars.reduce((a,v)=>a+Math.abs(bets[v]-(state.metrics[v]-before[v])),0)/vars.length;
 let lectura=Math.max(0,100-accuracy*6);
 let sostenibilidad=Math.max(0,100-Math.max(0,imbalance-25)*1.6);
 // Puntaje final 0–100: 30% negocio, 30% apropiación, 20% salud del cambio,
 // 10% precisión de la hipótesis/apuesta y 10% equilibrio sostenible.
 state.score=Math.round(
   state.business*.30 +
   state.metrics.Apropiación*.30 +
   health*.20 +
   lectura*.10 +
   sostenibilidad*.10
 );
 state.history.push({round:state.round+1,target:$("target").value,practices:selected.map(i=>practices[i][0]),credits:roundSpend,hypothesis:hyp});
 state.spent=(state.spent||0)+roundSpend;
 state.evolution.push({label:"R"+(state.round+1),metrics:{...state.metrics},business:state.business});
 save();
 const deltas=vars.map(v=>Math.round(state.metrics[v]-before[v]));
 const net=deltas.reduce((a,b)=>a+b,0);
 const verdict=net>10?"La intervención generó avance sistémico.":net>=0?"El resultado fue mixto: hubo avances, pero también costos.":"La decisión deterioró el sistema: revisa diagnóstico, momento y combinación de prácticas.";
 $("feedback").className="feedback";
 $("feedback").innerHTML=`<b>Resultado observado</b><br><strong>${verdict}</strong>`;
 $("resultRoundNumber").textContent=state.round+1;
 $("resultVerdict").textContent=verdict;
 $("resultScore").textContent=state.score+"/100";
 $("resultTarget").textContent=$("target").value;
 $("resultAudience").textContent=$("audience").value;
 $("resultHypothesis").textContent=hyp;
 $("resultPractices").innerHTML=selected.map(i=>`<span>${practices[i][0]}</span>`).join("");
 $("resultSpentRound").textContent=roundSpend+" créditos";
 $("resultBudgetLeft").textContent=(TOTAL_BUDGET-state.spent)+" créditos";
 $("resultBusiness").textContent=Math.round(state.business)+"/100";
 const readingParts=[verdict];
 if(consequence.high?.length) readingParts.push("Hubo prácticas altamente pertinentes para las señales de esta ronda.");
 if(consequence.medium?.length) readingParts.push("Otras intervenciones aportaron de forma parcial o complementaria.");
 if(consequence.low?.length) readingParts.push("Algunas decisiones tuvieron baja pertinencia: consumieron capacidad con un impacto limitado.");
 if(consequence.irrelevant?.length) readingParts.push("Una o más prácticas no respondían suficientemente al problema central y prácticamente no generaron beneficio.");
 if(consequence.counterproductive?.length) readingParts.push("Una o más prácticas fueron inoportunas y produjeron efectos contraproducentes.");
 if(consequence.opportunity) readingParts.push("El problema crítico siguió deteriorándose por costo de oportunidad.");
 $("resultReading").textContent=readingParts.join(" ");
 $("resultDeltas").innerHTML=vars.map(v=>{const d=Math.round(state.metrics[v]-before[v]);return `<div class="resultDelta"><span>${v}</span><div class="resultDeltaBar"><i style="width:${Math.round(state.metrics[v])}%"></i></div><b class="${d<0?"down":"up"}">${Math.round(state.metrics[v])} (${d>0?"+":""}${d})</b></div>`}).join("");
 const warnings=[...(consequence.warnings||[])];
 if(net<0) warnings.unshift("La combinación elegida deterioró el balance general del sistema.");
 if(consequence.synergies?.length) consequence.synergies.forEach(s=>warnings.push("Sinergia: "+s));
 $("resultWarnings").innerHTML=warnings.map(w=>`<div class="resultWarning">${w}</div>`).join("");
 $("resultContinue").textContent=state.round>=3?"VER RESULTADO FINAL →":"CONTINUAR A LA SIGUIENTE RONDA →";
 $("roundResultOverlay").classList.add("show");
 $("execute").disabled=true;$("next").hidden=true;renderMetricsOnly();updateBudget();drawEvolutionChart();await syncScore();renderRanking();
}
function renderMetricsOnly(){$("metrics").innerHTML=vars.map(v=>`<div class="metricrow"><span>${v}</span><div class="bar"><div class="fill" style="width:${state.metrics[v]}%"></div></div><b>${Math.round(state.metrics[v])}</b></div>`).join("")+`<div class="metricrow"><span>KPI negocio</span><div class="bar"><div class="fill" style="width:${state.business}%"></div></div><b>${Math.round(state.business)}</b></div>`;$("scoreTag").textContent=state.score+"/100"}
function save(){localStorage.setItem(stateKey(),JSON.stringify(state))}
let sb=null;
if(C.supabaseUrl && C.supabaseAnonKey && window.supabase){
  sb = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey);
}
async function syncScore(){
 if(!sb)return;
 const {error}=await sb.from("change_leadership_scores").upsert({class_code:classCode,team,score:state.score,round:state.round+1,business:state.business,appropriation:state.metrics.Apropiación,updated_at:new Date().toISOString()},{onConflict:"class_code,team"});
 if(error){console.error("Supabase sync error:",error);alert("No se pudo actualizar el ranking. Revisa la conexión con Supabase.");}
}
async function renderRanking(){
 let rows=[{team,score:state.score,round:state.round+1}];
 if(sb){
   let {data,error}=await sb.from("change_leadership_scores").select("*").eq("class_code",classCode).order("score",{ascending:false});
   if(error)console.error("Supabase ranking error:",error);
   if(data?.length)rows=data;
 }
 rows.sort((a,b)=>b.score-a.score);$("ranking").innerHTML=rows.map((r,i)=>`<div class="rankrow ${r.team===team?"me":""}"><span>${i+1}</span><span>${r.team}</span><b>${Math.round(r.score||0)}/100</b><span>R${r.round||1}</span></div>`).join("");
}
$("execute").onclick=execute;
function continueAfterResult(){
  $("roundResultOverlay").classList.remove("show");
  if(state.round>=3){
    $("feedback").innerHTML=`<b>Simulación finalizada</b><br>Índice de desempeño sostenible: <strong>${state.score}/100</strong>.`;
    $("execute").disabled=true; window.scrollTo({top:0,behavior:"smooth"}); return;
  }
  state.round++;selected=[];
  document.querySelectorAll(".practice").forEach(x=>x.classList.remove("selected"));
  $("hypothesis").value="";$("feedback").innerHTML="";updateBudget();
  $("execute").disabled=false;$("next").hidden=true;save();render();
  window.scrollTo({top:0,behavior:"smooth"});
}
$("resultContinue").onclick=continueAfterResult;
$("next").onclick=continueAfterResult;

$("joinBtn").addEventListener("click", enterGame);
$("joinTeam").value=localStorage.getItem("changeTeam")||"";
$("joinCode").value=localStorage.getItem("changeClassCode")||"";
["joinTeam","joinCode"].forEach(id=>{
  $(id).addEventListener("keydown",e=>{
    if(e.key==="Enter") enterGame();
  });
});
window.addEventListener("resize",()=>{if(state)drawEvolutionChart();});