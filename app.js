(() => {
  "use strict";

  const RULES = window.WFRP1E || {locations:["head","rightArm","leftArm","body","rightLeg","leftLeg"],characteristics:[],advanceableCharacteristics:[],careers:{basic:[],advanced:[]},careerDetails:{},careerOptions:[],skills:[],skillDetails:{},armourPresets:[],weaponPresets:[],equipmentPresets:[],spellPresets:[],allowedLayerPairs:[],rules:{advanceCost:100,skillCost:100,spellArmourCostPerPoint:2,specialistUntrainedValue:10}};
  const KEY = "altdorf-geldbeutel-v9";
  const OLD_KEYS = ["altdorf-geldbeutel-v8","altdorf-geldbeutel-v7","altdorf-geldbeutel-v6","altdorf-geldbeutel-v5","altdorf-geldbeutel-v4","altdorf-geldbeutel-v3","altdorf-geldbeutel-v2","altdorf-geldbeutel-v1"];
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const id = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const clone = value => JSON.parse(JSON.stringify(value));
  const escapeHtml = text => String(text ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  const num = (value, fallback=0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const int = (value, fallback=0) => Number.isSafeInteger(Number(value)) ? Number(value) : fallback;
  const signed = value => {
    const text=String(value ?? "0").trim();
    if(!text || text==="0") return "0";
    return /^[+-]/.test(text) ? text : `+${text}`;
  };

  const splitCoins = total => {
    let value = Math.abs(total || 0);
    const gold = Math.floor(value / 240); value %= 240;
    const silver = Math.floor(value / 12);
    return {gold, silver, brass:value % 12};
  };
  const label = total => {
    const coins = splitCoins(total);
    const parts = [];
    if (coins.gold) parts.push(`${coins.gold} GK`);
    if (coins.silver) parts.push(`${coins.silver} S`);
    if (coins.brass || !parts.length) parts.push(`${coins.brass} P`);
    return parts.join(" · ");
  };
  const moneyFields = values => {
    const coins=splitCoins(values||0);
    return `<div class="money-inputs"><label><span>Goldkronen</span><input name="gold" type="number" min="0" inputmode="numeric" value="${coins.gold||""}" placeholder="0"><small>GK</small></label><label><span>Schilling</span><input name="silver" type="number" min="0" inputmode="numeric" value="${coins.silver||""}" placeholder="0"><small>S</small></label><label><span>Pfennige</span><input name="brass" type="number" min="0" inputmode="numeric" value="${coins.brass||""}" placeholder="0"><small>P</small></label></div>`;
  };
  const amountFromForm = form => ["gold","silver","brass"].reduce((sum,name,index)=>sum+(Number(form.elements[name]?.value)||0)*[240,12,1][index],0);

  const emptyArmour = () => Object.fromEntries(RULES.locations.map(location=>[location,0]));
  const sanitizeArmour = armour => Object.fromEntries(RULES.locations.map(location=>[location,Math.max(0,Math.min(20,num(armour?.[location],0))) ]));
  const sanitizeWeapon = weapon => ({
    mode:["melee","missile"].includes(weapon?.mode)?weapon.mode:"melee",
    initiative:String(weapon?.initiative??"0").slice(0,30),
    toHit:String(weapon?.toHit??"0").slice(0,30),
    damage:String(weapon?.damage??"0").slice(0,30),
    parry:String(weapon?.parry??"0").slice(0,30),
    skill:String(weapon?.skill??"").slice(0,100),
    specialist:Boolean(weapon?.specialist ?? String(weapon?.skill||"").toLowerCase().includes("specialist weapon")),
    effectiveStrength:String(weapon?.effectiveStrength??"S").slice(0,30),
    rangeShort:String(weapon?.rangeShort??"").slice(0,30),
    rangeLong:String(weapon?.rangeLong??"").slice(0,30),
    rangeExtreme:String(weapon?.rangeExtreme??"").slice(0,30),
    load:String(weapon?.load??"").slice(0,100)
  });
  const sanitizeItem = item => ({
    id:item?.id || id(),
    name:String(item?.name || "Gegenstand").slice(0,120),
    quantity:Math.max(1,Math.min(9999,int(item?.quantity,1))),
    enc:Math.max(0,Math.min(99999,num(item?.enc,0))),
    value:Math.max(0,Number.isSafeInteger(Number(item?.value))?Number(item.value):0),
    note:String(item?.note || "").slice(0,1000),
    type:["generic","armor","weapon"].includes(item?.type)?item.type:"generic",
    presetId:String(item?.presetId||"").slice(0,80),
    equipped:Boolean(item?.equipped),
    armourMaterial:["metal","leather","shield","custom"].includes(item?.armourMaterial)?item.armourMaterial:"custom",
    armour:sanitizeArmour(item?.armour),
    weapon:sanitizeWeapon(item?.weapon)
  });

  const defaultStats = () => Object.fromEntries(RULES.characteristics.map(stat=>[stat.key,{base:0,advance:0,purchased:0,manual:0}]));
  const sanitizeStats = stats => {
    const next=defaultStats();
    RULES.characteristics.forEach(stat=>{
      const source=stats?.[stat.key]||{};
      next[stat.key]={
        base:num(source.base,0),
        advance:num(source.advance,0),
        purchased:Math.max(0,num(source.purchased,0)),
        manual:num(source.manual,0)
      };
    });
    return next;
  };
  const emptyScheme = () => Object.fromEntries((RULES.advanceableCharacteristics||[]).map(key=>[key,0]));
  const careerKey = text => String(text||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const sanitizeCareerScheme = scheme => {
    const next=emptyScheme();
    (RULES.advanceableCharacteristics||[]).forEach(key=>next[key]=Math.max(0,num(scheme?.[key],0)));
    return next;
  };
  const sanitizeCareerRecord = record => ({
    name:String(record?.name||"").slice(0,120),
    presetId:String(record?.presetId||"").slice(0,160),
    type:["basic","advanced","custom"].includes(record?.type)?record.type:"custom",
    scheme:sanitizeCareerScheme(record?.scheme),
    notes:String(record?.notes||"").slice(0,3000),
    freeAdvanceUsed:Boolean(record?.freeAdvanceUsed),
    archivedAt:String(record?.archivedAt||"").slice(0,60)
  });
  const defaultSheet = () => ({
    identity:{race:"",sex:"",age:"",height:"",weight:"",alignment:"",birthplace:"",eyes:"",hair:"",previousCareers:"",marks:"",notes:""},
    stats:defaultStats(),
    resources:{currentWounds:0,fateCurrent:0,fateMax:0,magicCurrent:0,magicMax:0,xpAvailable:0,xpTotal:0},
    career:{name:"Abenteurer",presetId:"",type:"custom",scheme:emptyScheme(),notes:"",freeAdvanceUsed:false},
    careerHistory:[],
    careerMeta:{initialAdvanceUsed:false,careerChanges:0},
    profileMeta:{schemeSyncedPreset:""},
    magic:{armourPointOverride:""},
    armourManual:emptyArmour(),
    skills:[],
    spells:[]
  });
  const emptyProfileBonuses = () => Object.fromEntries(RULES.characteristics.map(stat=>[stat.key,0]));
  const defaultSkillProfileBonuses = name => {
    const bonuses=emptyProfileBonuses();
    const key=String(name||"").trim().toLowerCase();
    if(key==="fleet footed") bonuses.M=1;
    if(key==="lightning reflexes") bonuses.I=10;
    if(key==="very resilient") bonuses.T=1;
    if(key==="very strong") bonuses.S=1;
    if(key==="strongman") bonuses.S=1;
    return bonuses;
  };
  const sanitizeProfileBonuses = (bonuses,name="") => {
    const defaults=defaultSkillProfileBonuses(name);
    const out=emptyProfileBonuses();
    RULES.characteristics.forEach(stat=>{
      const supplied=bonuses && Object.prototype.hasOwnProperty.call(bonuses,stat.key);
      out[stat.key]=num(supplied?bonuses[stat.key]:defaults[stat.key],0);
    });
    return out;
  };
  const coreSkillDetail = name => {
    const text=String(name||"");
    const names=RULES.skills||[];
    const exact=RULES.skillDetails?.[text];
    if(exact) return exact;
    const base=names.filter(candidate=>text===candidate||text.startsWith(candidate+" -")).sort((a,b)=>b.length-a.length)[0];
    return base ? RULES.skillDetails?.[base] || null : null;
  };
  const coreSpellPreset = presetId => (RULES.spellPresets||[]).find(preset=>preset.id===presetId) || null;
  const sanitizeSkill = skill => {
    const name=String(skill?.name||"Fertigkeit").slice(0,120);
    const detail=coreSkillDetail(name);
    return {
      id:skill?.id||id(),
      name,
      attribute:String(skill?.attribute||"").slice(0,50),
      note:String(skill?.note||"").slice(0,1000),
      description:String(skill?.description||((skill?.source==="core"||detail)?detail?.description||"":"")).slice(0,6000),
      source:skill?.source==="core"?"core":"custom",
      profileBonuses:sanitizeProfileBonuses(skill?.profileBonuses,name)
    };
  };
  const sanitizeSpell = spell => {
    const presetId=String(spell?.presetId||"").slice(0,120);
    const preset=coreSpellPreset(presetId);
    const storedDescription=String(spell?.description||spell?.note||"");
    const legacyDescription=!storedDescription || storedDescription.startsWith("Core spell summary entry.") || Boolean(preset?.note && storedDescription===preset.note);
    const description=legacyDescription ? String(preset?.description||storedDescription||preset?.note||"") : storedDescription;
    return {
      id:spell?.id||id(),presetId,source:spell?.source==="core"?"core":"custom",school:String(spell?.school||preset?.school||"").slice(0,100),name:String(spell?.name||preset?.name||"Zauber").slice(0,160),level:String(spell?.level??preset?.level??"").slice(0,30),magicPoints:Math.max(0,Math.min(999,num(spell?.magicPoints,preset?.magicPoints||0))),costVerified:Boolean(spell?.costVerified ?? (num(spell?.magicPoints,preset?.magicPoints||0)>0)),range:String(spell?.range||preset?.range||"").slice(0,120),duration:String(spell?.duration||preset?.duration||"").slice(0,120),ingredients:String(spell?.ingredients||preset?.ingredients||"").slice(0,500),description:description.slice(0,6000),active:Boolean(spell?.active),armourBonus:Math.max(-20,Math.min(20,num(spell?.armourBonus,0)))
    };
  };
  const sanitizeSheet = sheet => {
    const base=defaultSheet();
    const identity=sheet?.identity||{};
    Object.keys(base.identity).forEach(key=>base.identity[key]=String(identity?.[key]??"").slice(0,key==="notes"?4000:1000));
    base.stats=sanitizeStats(sheet?.stats);
    const resources=sheet?.resources||{};
    base.resources={
      currentWounds:num(resources.currentWounds,0),fateCurrent:num(resources.fateCurrent,0),fateMax:num(resources.fateMax,0),magicCurrent:num(resources.magicCurrent,0),magicMax:num(resources.magicMax,0),xpAvailable:num(resources.xpAvailable,0),xpTotal:num(resources.xpTotal,0)
    };
    const career=sheet?.career||{};
    base.career=sanitizeCareerRecord({...career,name:String(career.name||"").slice(0,120)});
    base.careerHistory=Array.isArray(sheet?.careerHistory)?sheet.careerHistory.slice(0,30).map(sanitizeCareerRecord):[];
    const legacyFreeUsed=Boolean(career.freeAdvanceUsed)||base.careerHistory.some(entry=>entry.freeAdvanceUsed);
    base.careerMeta={initialAdvanceUsed:Boolean(sheet?.careerMeta?.initialAdvanceUsed ?? legacyFreeUsed),careerChanges:Math.max(0,int(sheet?.careerMeta?.careerChanges,base.careerHistory.length))};
    base.profileMeta={schemeSyncedPreset:String(sheet?.profileMeta?.schemeSyncedPreset||"").slice(0,160)};
    base.magic={armourPointOverride:sheet?.magic?.armourPointOverride===""||sheet?.magic?.armourPointOverride==null?"":Math.max(0,num(sheet.magic.armourPointOverride,0))};
    base.armourManual=Object.fromEntries(RULES.locations.map(location=>[location,Math.max(-20,Math.min(20,num(sheet?.armourManual?.[location],0))) ]));
    base.skills=Array.isArray(sheet?.skills)?sheet.skills.slice(0,500).map(sanitizeSkill):[];
    base.spells=Array.isArray(sheet?.spells)?sheet.spells.slice(0,500).map(sanitizeSpell):[];
    return base;
  };

  const ensureCharacter = character => {
    if (!Array.isArray(character.transactions)) character.transactions=[];
    if (!Array.isArray(character.inventory)) character.inventory=[];
    character.inventory=character.inventory.map(sanitizeItem);
    if (!Array.isArray(character.storages)) character.storages=[];
    character.storages=character.storages.map(storage=>({
      id:storage?.id||id(),name:String(storage?.name||"Lager").slice(0,100),type:String(storage?.type||"chest"),carried:Boolean(storage?.carried),money:Number.isSafeInteger(Number(storage?.money))&&Number(storage.money)>=0?Number(storage.money):0,items:Array.isArray(storage?.items)?storage.items.map(item=>({...sanitizeItem(item),equipped:false})):[]
    }));
    if (!Number.isSafeInteger(Number(character.balance))||Number(character.balance)<0) character.balance=0; else character.balance=Number(character.balance);
    character.name=String(character.name||"Konrad").slice(0,80);
    character.career=String(character.career||"Abenteurer").slice(0,120);
    character.sheet=sanitizeSheet(character.sheet);
    if(!character.sheet.career.name) character.sheet.career.name=character.career||"Abenteurer";
    character.career=character.sheet.career.name||character.career||"Abenteurer";
    if(!Array.isArray(character.sheet.careerHistory)) character.sheet.careerHistory=[];
    if(!character.sheet.careerMeta) character.sheet.careerMeta={initialAdvanceUsed:Boolean(character.sheet.career.freeAdvanceUsed),careerChanges:character.sheet.careerHistory.length};
    return character;
  };
  const freshState = () => {
    const character = ensureCharacter({id:id(),name:"Konrad",career:"Abenteurer",balance:0,transactions:[],inventory:[],storages:[],sheet:defaultSheet()});
    return {characters:[character],activeId:character.id};
  };

  let state;
  try {
    const raw = localStorage.getItem(KEY) || OLD_KEYS.map(key=>localStorage.getItem(key)).find(Boolean);
    state = raw ? JSON.parse(raw) : freshState();
    if (!state.characters?.length) state = freshState();
    state.characters=state.characters.map(ensureCharacter);
    if (!state.characters.some(character=>character.id===state.activeId)) state.activeId=state.characters[0].id;
  } catch { state = freshState(); }

  const persist = () => localStorage.setItem(KEY, JSON.stringify(state));
  const active = () => state.characters.find(character => character.id === state.activeId) || state.characters[0];
  const skillProfileModifier = (character,key) => {
    const details=[];
    let total=0;
    (character.sheet.skills||[]).forEach(skill=>{
      const amount=num(skill?.profileBonuses?.[key],0);
      if(!amount) return;
      total+=amount;
      details.push({name:skill.name,amount});
    });
    return {total,details};
  };
  const startStatValue = (character,key) => {
    const stat=character.sheet.stats[key]||{base:0,advance:0,purchased:0,manual:0};
    return num(stat.base)+skillProfileModifier(character,key).total;
  };
  const statValue = (character,key) => {
    const stat=character.sheet.stats[key]||{base:0,advance:0,purchased:0,manual:0};
    return startStatValue(character,key)+num(stat.purchased);
  };
  const advanceStep = key => ["M","S","T","W","A"].includes(key)?1:10;
  const purchasedAdvance = (character,key) => Math.max(0,num(character.sheet.stats?.[key]?.purchased,0));
  const woundsMax = character => Math.max(0,statValue(character,"W"));
  const carryingCapacity = character => Math.max(0,statValue(character,"S")*100);
  const itemEnc = item => (Number(item.enc)||0)*(Number(item.quantity)||1);
  const itemValue = item => (Number(item.value)||0)*(Number(item.quantity)||1);
  const itemsEnc = items => (items||[]).reduce((sum,item)=>sum+itemEnc(item),0);
  const bodyEnc = character => itemsEnc(character.inventory)+character.storages.filter(storage=>storage.carried).reduce((sum,storage)=>sum+itemsEnc(storage.items),0);
  const storedEnc = character => character.storages.filter(storage=>!storage.carried).reduce((sum,storage)=>sum+itemsEnc(storage.items),0);
  const storageIcon = type => ({backpack:"🎒",chest:"▣",horse:"♞",cart:"▤",ship:"⚓",room:"⌂",stash:"✦"}[type]||"▣");
  const storageTypeLabel = type => ({backpack:"Rucksack",chest:"Truhe",horse:"Pferd",cart:"Karren",ship:"Schiff",room:"Quartier",stash:"Versteck"}[type]||"Lager");
  const locationLabel = location => ({head:"Kopf",rightArm:"Rechter Arm",leftArm:"Linker Arm",body:"Körper",rightLeg:"Rechtes Bein",leftLeg:"Linkes Bein"}[location]||location);

  const allItemPresets = () => [...(RULES.armourPresets||[]),...(RULES.weaponPresets||[]),...(RULES.equipmentPresets||[])];
  const presetById = presetId => allItemPresets().find(preset=>preset.id===presetId);
  const allowedLayer = (a,b) => RULES.allowedLayerPairs.some(pair=>pair.includes(a)&&pair.includes(b));
  const armourBreakdown = character => {
    const result=Object.fromEntries(RULES.locations.map(location=>[location,{fixed:0,leather:false,leatherSuppressed:false,effects:0,manual:num(character.sheet.armourManual?.[location],0),metal:false}]));
    character.inventory.filter(item=>item.equipped&&item.type==="armor").forEach(item=>{
      RULES.locations.forEach(location=>{
        const points=num(item.armour?.[location],0); if(!points) return;
        if(item.armourMaterial==="leather"){ result[location].leather=true; return; }
        result[location].fixed+=points;
        if(item.armourMaterial==="metal") result[location].metal=true;
      });
    });
    const effectBonus=character.sheet.spells.filter(spell=>spell.active).reduce((sum,spell)=>sum+num(spell.armourBonus,0),0);
    RULES.locations.forEach(location=>{
      result[location].effects=effectBonus;
      if(result[location].leather&&result[location].metal) result[location].leatherSuppressed=true;
      result[location].total=Math.max(0,result[location].fixed+result[location].effects+result[location].manual);
    });
    return result;
  };
  const armourDisplay = part => {
    const base=part.total;
    if(part.leather&&!part.leatherSuppressed) return `${base?`${base} + `:""}0/1`;
    return String(base);
  };
  const armourWarnings = character => {
    const equipped=character.inventory.filter(item=>item.equipped&&item.type==="armor"&&item.armourMaterial==="metal");
    const warnings=[];
    const seen=new Map();
    equipped.forEach(item=>{if(item.presetId){seen.set(item.presetId,(seen.get(item.presetId)||0)+1)}});
    seen.forEach((count,presetId)=>{if(count>1)warnings.push(`${presetById(presetId)?.name||"Ein Rüstungsteil"} ist mehrfach angelegt.`)});
    for(let i=0;i<equipped.length;i++) for(let j=i+1;j<equipped.length;j++){
      const a=equipped[i],b=equipped[j];
      const overlap=RULES.locations.some(location=>num(a.armour?.[location])>0&&num(b.armour?.[location])>0);
      if(!overlap) continue;
      if(a.presetId&&b.presetId&&allowedLayer(a.presetId,b.presetId)) continue;
      warnings.push(`${a.name} und ${b.name} überdecken dieselbe Trefferzone. Das ist keine Standard-Schichtung; als Hausregel bleibt es trotzdem möglich.`);
    }
    return [...new Set(warnings)];
  };

  const physicalArmourPoints = character => {
    if(character.sheet.magic?.armourPointOverride!=="" && character.sheet.magic?.armourPointOverride!=null) return Math.max(0,num(character.sheet.magic.armourPointOverride));
    return character.inventory.filter(item=>item.equipped&&item.type==="armor").reduce((sum,item)=>{
      if(item.armourMaterial==="shield") return sum+1;
      return sum+RULES.locations.reduce((part,location)=>part+Math.max(0,num(item.armour?.[location],0)),0);
    },0);
  };
  const spellArmourSurcharge = character => physicalArmourPoints(character)*num(RULES.rules?.spellArmourCostPerPoint,2);
  const hasSpecialistWeaponSkill = (character,item) => {
    const requirement=String(item.weapon?.skill||"").trim(); if(!item.weapon?.specialist||!requirement) return true;
    const owned=character.sheet.skills.map(skill=>skill.name.toLowerCase());
    const required=requirement.split("+").map(x=>x.trim().toLowerCase()).filter(Boolean);
    return required.every(req=>owned.some(name=>name===req||name.startsWith(req+" -")||name.startsWith(req+" –")));
  };
  const weaponSkillWarning = (character,item) => item.weapon?.specialist&&!hasSpecialistWeaponSkill(character,item) ? ` · ohne passende ${escapeHtml(item.weapon.skill||"Specialist Weapon")}-Fertigkeit gilt ${item.weapon.mode==="missile"?"BS":"WS"} ${RULES.rules?.specialistUntrainedValue||10}` : "";

  const modal = content => {
    const layer = document.createElement("div");
    layer.className = "modal"; layer.setAttribute("role","dialog"); layer.setAttribute("aria-modal","true");
    layer.innerHTML = `<button class="backdrop" aria-label="Schließen"></button>${content}`;
    document.body.append(layer); $(".backdrop",layer).addEventListener("click",()=>layer.remove()); return layer;
  };
  const remountModal = (layer,callback) => { layer?.remove(); callback(); };

  const mount = () => {
    const template = $("#app-template").content.cloneNode(true);
    $("#app").replaceWith(template);
    bind(); render();
  };
  const render = () => {
    const character = ensureCharacter(active());
    syncAdvancedFromCareerScheme(character,currentCareerRecord(character),false);
    const coins = splitCoins(character.balance);
    $("#active-avatar").textContent = character.name.charAt(0).toUpperCase();
    $("#active-name").textContent = character.name;
    $("#active-career").textContent = character.career;
    $("#wallet-region").setAttribute("aria-label",`Guthaben von ${character.name}`);
    $("#balance-gold").textContent = coins.gold;
    $("#balance-silver").textContent = coins.silver;
    $("#balance-brass").textContent = coins.brass;
    $("#transaction-count").textContent = character.transactions.length;
    const storageCount=character.storages.length;
    $("#storage-summary-line").textContent=`${storageCount?`${storageCount} Lager`:"Keine Lager"} · ${bodyEnc(character)} ENC am Körper`;
    const cap=carryingCapacity(character);
    const ap=armourBreakdown(character);
    $("#character-summary-line").textContent=`${character.career} · W ${character.sheet.resources.currentWounds}/${woundsMax(character)} · AP Körper ${armourDisplay(ap.body)}${cap?` · ${bodyEnc(character)}/${cap} ENC`:""}`;
    $("#transaction-list").innerHTML = character.transactions.length ? `<div class="transactions">${character.transactions.map(transaction => `
      <article class="transaction">
        <span class="transaction-icon ${transaction.type}">${transaction.type === "income" ? "＋" : "−"}</span>
        <div class="transaction-copy"><strong>${escapeHtml(transaction.note)}</strong><small>${new Intl.DateTimeFormat("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(transaction.createdAt))}</small></div>
        <div class="transaction-amount ${transaction.type}"><strong>${transaction.type === "income" ? "+" : "−"} ${label(transaction.amount)}</strong><button class="undo" data-undo="${transaction.id}">rückgängig</button></div>
      </article>`).join("")}</div>` : `<div class="empty"><img class="empty-coin" src="./coin-brass.png" alt=""><h3>Das Buch ist noch leer</h3><p>Noch wurde kein Pfennig verdient – oder verloren.</p></div>`;
    $$('[data-undo]').forEach(button => button.addEventListener("click", () => undo(button.dataset.undo)));
    persist();
  };

  const characterPicker = () => {
    const layer = modal(`<section class="sheet"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Geldbeutel</span><h2>Charaktere</h2></div><button class="close" aria-label="Schließen">×</button></div>
      <div class="character-list">${state.characters.map(character => `<article class="character-row ${character.id===active().id?"selected":""}"><button class="character-select" data-select="${character.id}"><span class="avatar">${escapeHtml(character.name.charAt(0).toUpperCase())}</span><span><strong>${escapeHtml(character.name)}</strong><small>${escapeHtml(character.career)} · ${label(character.balance)}</small></span></button>${state.characters.length>1?`<button class="delete" data-delete="${character.id}" aria-label="${escapeHtml(character.name)} löschen">×</button>`:""}</article>`).join("")}</div>
      <div class="backup-actions"><button type="button" class="secondary-button" id="backup-character">↓ ${escapeHtml(active().name)} sichern</button><button type="button" class="secondary-button" id="restore-character">↑ Sicherung einlesen</button><input class="hidden" id="backup-file" type="file" accept=".json,application/json"></div>
      <p class="backup-note">Die Sicherung enthält Charakterbogen, Geldbeutel, Münzbuch, Inventar und alle Truhen/Lager dieses Charakters.</p><button class="full-button" id="new-character">＋ Neuen Charakter anlegen</button></section>`);
    $(".close",layer).addEventListener("click",()=>layer.remove());
    $$('[data-select]',layer).forEach(button => button.addEventListener("click",()=>{state.activeId=button.dataset.select;layer.remove();render()}));
    $$('[data-delete]',layer).forEach(button => button.addEventListener("click",()=>{const character=state.characters.find(item=>item.id===button.dataset.delete);if(character&&confirm(`${character.name} und alle zugehörigen Daten wirklich löschen?`)){state.characters=state.characters.filter(item=>item.id!==character.id);if(state.activeId===character.id)state.activeId=state.characters[0].id;layer.remove();render();characterPicker()}}));
    $("#backup-character",layer).addEventListener("click",backupCharacter); $("#restore-character",layer).addEventListener("click",()=>$("#backup-file",layer).click()); $("#backup-file",layer).addEventListener("change",event=>restoreCharacter(event,layer)); $("#new-character",layer).addEventListener("click",()=>newCharacter(layer));
  };
  const newCharacter = previous => {
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Neuer Charakter</span><h2>Charakter anlegen</h2></div><button type="button" class="close">×</button></div><label>Name<input name="name" required placeholder="z. B. Johan Kümmerling" autocomplete="off"></label><label>Beruf oder Laufbahn<input name="career" placeholder="z. B. Apotheker" autocomplete="off"></label><button class="full-button">Charakter anlegen</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const data=new FormData(event.currentTarget);const character=ensureCharacter({id:id(),name:String(data.get("name")).trim(),career:String(data.get("career")).trim()||"Abenteurer",balance:0,transactions:[],inventory:[],storages:[],sheet:defaultSheet()});state.characters.push(character);state.activeId=character.id;layer.remove();previous.remove();render();characterSheet("profile")}); $("input",layer).focus();
  };

  const sheetTabs = activeTab => `<nav class="sheet-tabs" aria-label="Charakterbogen"><button data-sheet-tab="profile" class="${activeTab==="profile"?"active":""}">Profil</button><button data-sheet-tab="career" class="${activeTab==="career"?"active":""}">Karriere</button><button data-sheet-tab="combat" class="${activeTab==="combat"?"active":""}">Kampf</button><button data-sheet-tab="skills" class="${activeTab==="skills"?"active":""}">Skills</button><button data-sheet-tab="magic" class="${activeTab==="magic"?"active":""}">Magie</button></nav>`;
  const sheetBox = (eyebrow,title,action,body,extraClass="") => `<section class="sheet-box ${extraClass}"><div class="sheet-box-head"><div><span class="eyebrow">${eyebrow}</span><h3>${title}</h3></div>${action||""}</div><div class="sheet-box-body">${body}</div></section>`;
  const profileCell = (label,value,extraClass="") => `<article class="profile-cell ${extraClass}"><small>${label}</small><strong>${escapeHtml(value||"—")}</strong></article>`;
  const careerHistory = character => Array.isArray(character.sheet.careerHistory)?character.sheet.careerHistory:(character.sheet.careerHistory=[]);
  const careerDefinition = record => {
    if(record?.presetId && RULES.careerDetails?.[record.presetId]) return RULES.careerDetails[record.presetId];
    const wanted=careerKey(record?.name);
    return Object.values(RULES.careerDetails||{}).find(def=>careerKey(def.label||def.name)===wanted || careerKey(def.name)===wanted) || null;
  };
  const currentCareerRecord = character => {
    if(!character.sheet.career) character.sheet.career=sanitizeCareerRecord({name:character.career||"Abenteurer"});
    if(!character.sheet.career.name) character.sheet.career.name=character.career||"Abenteurer";
    character.sheet.career=sanitizeCareerRecord(character.sheet.career);
    character.career=character.sheet.career.name||character.career||"Abenteurer";
    return character.sheet.career;
  };
  const mergedCareerScheme = record => {
    const own=record?.scheme||{};
    const hasOwn=(RULES.advanceableCharacteristics||[]).some(key=>num(own[key],0)>0);
    return sanitizeCareerScheme(hasOwn?own:careerDefinition(record)?.scheme);
  };
  const syncAdvancedFromCareerScheme = (character,record=currentCareerRecord(character),force=false) => {
    const scheme=mergedCareerScheme(record);
    const preset=String(record?.presetId||record?.name||"");
    character.sheet.profileMeta=character.sheet.profileMeta||{schemeSyncedPreset:""};
    if(!force && character.sheet.profileMeta.schemeSyncedPreset===preset) return scheme;
    RULES.characteristics.forEach(stat=>{
      const row=character.sheet.stats[stat.key]||(character.sheet.stats[stat.key]={base:0,advance:0,purchased:0,manual:0});
      row.advance=num(scheme?.[stat.key],0);
    });
    character.sheet.profileMeta.schemeSyncedPreset=preset;
    return scheme;
  };
  const careerSkills = record => Array.isArray(careerDefinition(record)?.skills)?careerDefinition(record).skills:[];
  const learnedSkillNames = character => new Set(character.sheet.skills.map(skill=>skill.name));
  const applyCareerRecord = (character,record,{archiveCurrent=true}={}) => {
    const next=sanitizeCareerRecord(record);
    if(!next.name) return false;
    const current=currentCareerRecord(character);
    const isActualChange=current.name && current.name!=="Abenteurer" && current.name!==next.name;
    if(isActualChange) character.sheet.careerMeta.careerChanges=Math.max(0,int(character.sheet.careerMeta.careerChanges,0))+1;
    if(archiveCurrent && isActualChange){
      careerHistory(character).unshift(sanitizeCareerRecord({...current,archivedAt:new Date().toISOString()}));
      character.sheet.careerHistory=careerHistory(character).slice(0,30);
    }
    if(!(RULES.advanceableCharacteristics||[]).some(key=>num(next.scheme?.[key],0)>0)) next.scheme=mergedCareerScheme(next);
    character.sheet.career=next;
    character.career=next.name;
    syncAdvancedFromCareerScheme(character,next,true);
    return true;
  };
  const restoreCareerFromHistory = (index,previous) => {
    const character=active(),history=careerHistory(character),idx=int(index,-1);
    if(idx<0||idx>=history.length)return;
    const picked=sanitizeCareerRecord(history.splice(idx,1)[0]);
    const current=currentCareerRecord(character);
    if(current.name&&current.name!==picked.name&&current.name!=="Abenteurer") history.unshift(sanitizeCareerRecord({...current,archivedAt:new Date().toISOString()}));
    character.sheet.career=picked;
    character.sheet.career.scheme=mergedCareerScheme(character.sheet.career);
    character.career=character.sheet.career.name||"Abenteurer";
    syncAdvancedFromCareerScheme(character,character.sheet.career,true);
    persist();previous.remove();render();characterSheet("career");
  };
  const learnCareerSkill = (skillName,previous,note="") => {
    const name=String(skillName||"").trim(); if(!name)return;
    const character=active(),cost=num(RULES.rules?.skillCost,100);
    if(character.sheet.skills.some(skill=>skill.name===name)){alert("Dieser Skill ist bereits eingetragen.");return}
    if(character.sheet.resources.xpAvailable<cost){alert(`Nicht genug EP. Benötigt: ${cost}.`);return}
    character.sheet.resources.xpAvailable-=cost;
    character.sheet.skills.push(sanitizeSkill({name,source:"core",note:note||`Karriere-Skill · ${character.career}`}));
    persist();previous.remove();render();characterSheet("career");
  };
  const statProfileTable = character => {
    const current=currentCareerRecord(character);
    syncAdvancedFromCareerScheme(character,current,false);
    const header=RULES.characteristics.map(stat=>`<th scope="col"><span>${escapeHtml(stat.key)}</span><small>${escapeHtml(stat.label)}</small></th>`).join("");
    const row=(labelName,getValue,className="")=>`<tr class="${className}"><th scope="row">${labelName}</th>${RULES.characteristics.map(stat=>`<td>${getValue(stat)}</td>`).join("")}</tr>`;
    const startCell=stat=>{
      const mod=skillProfileModifier(character,stat.key);
      const title=mod.details.map(item=>`${item.name} ${signed(item.amount)}`).join(" · ");
      return `<span class="start-stat-value"${title?` title="${escapeHtml(title)}"`:""}>${startStatValue(character,stat.key)}${mod.total?`<sup class="profile-skill-star" aria-label="Skill-/Talentbonus">*</sup>`:""}</span>`;
    };
    const currentCell=stat=>`<span class="current-stat-value">${statValue(character,stat.key)}</span>`;
    const compactCards=RULES.characteristics.map(stat=>{
      const mod=skillProfileModifier(character,stat.key);
      const start=startStatValue(character,stat.key);
      const advanced=num(character.sheet.stats[stat.key]?.advance,0);
      const title=mod.details.map(item=>`${item.name} ${signed(item.amount)}`).join(" · ");
      return `<article class="profile-stat-card"><header><strong>${escapeHtml(stat.key)}</strong><small>${escapeHtml(stat.label)}</small></header><dl><div><dt>Start</dt><dd${title?` title="${escapeHtml(title)}"`:""}>${start}${mod.total?`<sup class="profile-skill-star" aria-label="Skill-/Talentbonus">*</sup>`:""}</dd></div><div><dt>Advanced</dt><dd>${advanced?signed(advanced):"0"}</dd></div><div class="current"><dt>Current</dt><dd>${statValue(character,stat.key)}</dd></div></dl></article>`;
    }).join("");
    const bought=(RULES.characteristics||[]).filter(stat=>purchasedAdvance(character,stat.key)>0).map(stat=>`${stat.key} ${signed(purchasedAdvance(character,stat.key))}`).join(" · ");
    const skillMods=(RULES.characteristics||[]).map(stat=>{const mod=skillProfileModifier(character,stat.key);return mod.total?`${stat.key} ${signed(mod.total)} (${mod.details.map(x=>x.name).join(", ")})`:""}).filter(Boolean).join(" · ");
    return `<div class="profile-table-wrap"><table class="profile-table"><thead><tr><th scope="col">Profil</th>${header}</tr></thead><tbody>${row("Start",startCell,"profile-start-row")}${row("Advanced",stat=>{const value=num(character.sheet.stats[stat.key]?.advance,0);return value?signed(value):"0"},"profile-advanced-row")}${row("Current",currentCell,"profile-current-row")}</tbody></table></div><div class="profile-compact-grid" aria-label="Profilwerte">${compactCards}</div><div class="profile-calculation-note"><span><strong>Gekauft:</strong> ${bought||"noch keine Advances"}</span>${skillMods?`<span><strong>* Start inkl. Skill/Talent:</strong> ${escapeHtml(skillMods)}</span>`:""}</div>`;
  };
  const resourceCards = character => {
    const r=character.sheet.resources;
    return `<div class="resource-grid"><article><small>Wunden</small><strong>${r.currentWounds}/${woundsMax(character)}</strong><span>aktuell / max</span></article><article><small>Schicksal</small><strong>${r.fateCurrent}/${r.fateMax}</strong><span>aktuell / max</span></article><article><small>Magiepunkte</small><strong>${r.magicCurrent}/${r.magicMax}</strong><span>aktuell / max</span></article><article><small>Erfahrung</small><strong>${r.xpAvailable}</strong><span>${r.xpTotal} gesamt</span></article></div>`;
  };
  const profileTab = character => {
    const i=character.sheet.identity,current=currentCareerRecord(character),history=careerHistory(character).map(entry=>entry.name).filter(Boolean);
    const meta=`<div class="sheet-meta-strip"><span><b>Name:</b> ${escapeHtml(character.name)}</span><span><b>Karriere:</b> ${escapeHtml(current.name)}</span><span><b>Volk:</b> ${escapeHtml(i.race||"—")}</span></div>`;
    const grid=`<div class="profile-facts">${[profileCell("Karriere",current.name),profileCell("Volk",i.race),profileCell("Geschlecht",i.sex),profileCell("Alter",i.age),profileCell("Größe",i.height),profileCell("Gewicht",i.weight),profileCell("Gesinnung",i.alignment),profileCell("Geburtsort",i.birthplace),profileCell("Augen",i.eyes),profileCell("Haare",i.hair),profileCell("Karriere-Historie",history.join(", "),"wide"),profileCell("Freitext frühere Karrieren",i.previousCareers,"wide"),profileCell("Besondere Merkmale",i.marks,"wide")].join("")}</div>${i.notes?`<p class="character-note">${escapeHtml(i.notes)}</p>`:""}`;
    return `${sheetBox("Charakter",escapeHtml(character.name),`<button class="mini-button" id="edit-profile">Bearbeiten</button>`,`${meta}${grid}`,"identity-box")}${sheetBox("Charakteristika","Profilwerte",`<button class="mini-button" id="edit-stats">Bearbeiten</button>`,statProfileTable(character),"stats-box")}${sheetBox("Ressourcen","Wunden, Schicksal & Magie",`<button class="mini-button" id="edit-resources">Bearbeiten</button>`,resourceCards(character),"resources-box")}`;
  };
  const careerTab = character => {
    const c=currentCareerRecord(character),def=careerDefinition(c),scheme=mergedCareerScheme(c),available=character.sheet.resources.xpAvailable,history=careerHistory(character),learned=learnedSkillNames(character),skills=careerSkills(c);
    c.scheme=sanitizeCareerScheme(scheme);
    const intro=`<div class="career-summary"><article><small>Quelle</small><strong>${c.type==="custom"?"Freier Eintrag":"Grundregelwerk"}</strong></article><article><small>Typ</small><strong>${c.type==="basic"?"Basic":c.type==="advanced"?"Advanced":"Frei"}</strong></article><article><small>EP verfügbar</small><strong>${available}</strong></article><article><small>Schema</small><strong>${def?.verifiedScheme?"GRW hinterlegt":"manuell"}</strong></article></div>${def?.notes?`<p class="character-note">${escapeHtml(def.notes)}</p>`:""}`;
    syncAdvancedFromCareerScheme(character,c,false);
    const schemeBody=`<div class="scheme-grid">${(RULES.advanceableCharacteristics||[]).map(key=>{const max=num(scheme[key],0),bought=purchasedAdvance(character,key),step=advanceStep(key),cost=num(RULES.rules?.advanceCost,100),canBuy=max>0&&bought+step<=max&&available>=cost;return `<article class="scheme-card"><small>${key}</small><strong>${max?signed(max):"0"}</strong><span>Schema · gekauft ${bought?signed(bought):"0"}</span>${max?`<button class="mini-button" data-buy-advance="${key}" ${canBuy?"":"disabled"}>+${step} kaufen · ${cost} EP</button>`:`<span>—</span>`}</article>`}).join("")}</div><p class="hint"><strong>Advanced</strong> zeigt nur das Potential der aktuellen Karriere. Erst ein gekaufter Advance erhöht <strong>Current</strong>. Bereits in früheren Karrieren gekaufte Advances bleiben erhalten und zählen gegen das Maximum des neuen Schemas.</p>`;
    const skillBody=skills.length?`<div class="career-skills-list">${skills.map(skill=>{const done=learned.has(skill.name);return `<article class="career-skill-row ${done?"learned":""}"><div><strong>${escapeHtml(skill.name)}</strong><small>${escapeHtml(skill.note||"Karriere-Skill")}</small></div>${done?`<span class="skill-state">gelernt</span>`:`<button class="mini-button" data-learn-career-skill="${escapeHtml(skill.name)}" data-career-note="${escapeHtml((skill.note||"")+` · ${c.name}`)}">Lernen · 100 EP</button>`}</article>`}).join("")}</div>`:`<p class="hint">Für freie Karrieren können Skills weiterhin manuell hinzugefügt werden.</p>`;
    const historyBody=history.length?`<div class="career-history-list">${history.map((entry,index)=>{const oldScheme=mergedCareerScheme(entry);const summary=(RULES.advanceableCharacteristics||[]).filter(key=>num(oldScheme[key],0)>0).map(key=>`${key} +${num(oldScheme[key],0)}`).join(" · ");return `<article class="career-history-row"><div><strong>${escapeHtml(entry.name)}</strong><small>${entry.type==="basic"?"Basic":entry.type==="advanced"?"Advanced":"Frei"}${entry.archivedAt?` · ${new Date(entry.archivedAt).toLocaleDateString("de-DE")}`:""}</small>${summary?`<span class="career-history-scheme">${escapeHtml(summary)}</span>`:""}</div><button class="mini-button" data-restore-career="${index}">Aktivieren</button></article>`}).join("")}</div>`:`<div class="empty compact"><h3>Noch keine früheren Karrieren</h3><p>Beim Karrierewechsel kann die bisherige Karriere automatisch archiviert werden.</p></div>`;
    return `${sheetBox("Grundregelwerk",escapeHtml(c.name),`<button class="mini-button" id="choose-career">Karriere wählen</button>`,intro,"career-box")}${sheetBox("Advance Scheme","Advanced",`<button class="mini-button" id="edit-career-scheme">Werte bearbeiten</button>`,schemeBody,"career-scheme-box")}${sheetBox("Karriere-Skills",`${skills.filter(skill=>!learned.has(skill.name)).length} offen`,"",skillBody,"career-skill-box")}${sheetBox("Frühere Karrieren",`${history.length} gespeichert`,"",historyBody,"career-history-box")}`;
  };
  const HIT_LOCATION_RANGES = {head:"01-15",rightArm:"16-35",leftArm:"36-55",body:"56-80",rightLeg:"81-90",leftLeg:"91-00"};
  const armourCard = (location,part) => `<article class="armour-zone zone-${location}"><div class="armour-zone-head"><small>${locationLabel(location)}</small><span class="hit-location-range">${HIT_LOCATION_RANGES[location]||"—"}</span></div><strong>${armourDisplay(part)}</strong><span>${part.effects?`Effekt ${signed(part.effects)} · `:""}${part.manual?`Manuell ${signed(part.manual)} · `:""}${part.leatherSuppressed?"Leder unter Metall ohne Zusatzschutz":"AP gesamt"}</span></article>`;
  const weaponSummary = (character,item) => {
    const w=item.weapon;if(w.mode==="missile")return `ES ${escapeHtml(w.effectiveStrength||"—")} · Reichweite ${escapeHtml(w.rangeShort||"—")}/${escapeHtml(w.rangeLong||"—")}/${escapeHtml(w.rangeExtreme||"—")} · ${escapeHtml(w.load||"—")}${weaponSkillWarning(character,item)}`;
    const s=statValue(character,"S"),damage=String(w.damage||"0").trim();return `Schaden 1W6 + ${s}${damage&&damage!=="0"?` ${signed(damage)}`:""} · I ${escapeHtml(w.initiative||"0")} · Treffer ${escapeHtml(w.toHit||"0")} · Parade ${escapeHtml(w.parry||"0")}${weaponSkillWarning(character,item)}`;
  };
  const combatTab = character => {
    const armour=armourBreakdown(character),warnings=armourWarnings(character),equipment=character.inventory,cap=carryingCapacity(character),carried=bodyEnc(character);
    const armourBody=`<div class="armour-grid">${RULES.locations.map(location=>armourCard(location,armour[location])).join("")}</div><p class="hit-location-note"><strong>Trefferzone:</strong> Die beiden Ziffern des erfolgreichen Angriffswurfs werden vertauscht (z. B. 27 → 72); das Ergebnis bestimmt anhand der Zahlen oben die getroffene Zone.</p>${warnings.length?`<div class="rules-warning"><strong>Rüstungshinweis</strong>${warnings.map(w=>`<p>${escapeHtml(w)}</p>`).join("")}</div>`:""}`;
    const loadBody=`<div class="resource-grid combat-strip"><article><small>Getragene Last</small><strong>${carried}</strong><span>ENC am Körper</span></article><article><small>Traglast</small><strong>${cap||0}</strong><span>aus Stärke × 100</span></article><article><small>Rüstungs-Punkte</small><strong>${physicalArmourPoints(character)}</strong><span>relevant für Magie</span></article><article><small>Magie-Malus</small><strong>+${spellArmourSurcharge(character)}</strong><span>MP pro Zauber</span></article></div>${cap&&carried>cap?`<div class="rules-warning"><strong>Überladen</strong><p>Die getragene Last liegt über der aus Stärke × 100 abgeleiteten Traglast.</p></div>`:""}`;
    const equipmentBody=`<div class="equipment-list">${equipment.length?equipment.map(item=>{
      const details=item.type==="armor"
        ? `${item.equipped?"angelegt":"nicht angelegt"} · ${item.armourMaterial==="leather"?"0/1 Leder":"Rüstung"} · ${itemEnc(item)} ENC`
        : item.type==="weapon"
          ? `${weaponSummary(character,item)} · ${itemEnc(item)} ENC`
          : `${itemEnc(item)} ENC${item.value?` · Wert ${label(itemValue(item))}`:""}${item.note?` · ${escapeHtml(item.note)}`:""}`;
      const equipButton=(item.type==="armor"||item.type==="weapon")?`<button class="mini-button" data-equip="${item.id}">${item.equipped?"Ablegen":"Anlegen"}</button>`:"";
      return `<article class="equipment-row ${item.equipped?"equipped":""}"><div><strong>${escapeHtml(item.name)}${item.quantity>1?` ×${item.quantity}`:""}</strong><small>${details}</small></div><div class="item-actions">${equipButton}<button class="mini-button" data-edit-item="${item.id}">✎</button></div></article>`;
    }).join(""):`<div class="empty compact"><h3>Noch keine Ausrüstung am Körper</h3><p>Alles, was im Bereich „Truhen &amp; Lager“ unter „Am Körper“ liegt, erscheint auch hier.</p></div>`}</div>`;
    const effectBody=character.sheet.spells.some(spell=>spell.active&&spell.armourBonus)?character.sheet.spells.filter(spell=>spell.active&&spell.armourBonus).map(spell=>`<p class="character-note">${escapeHtml(spell.name)}: ${signed(spell.armourBonus)} AP auf alle Trefferzonen</p>`).join(""):`<p class="hint">Derzeit sind keine rüstungsrelevanten Zaubereffekte aktiv.</p>`;
    return `${sheetBox("Trefferzonen","Rüstung",`<button class="mini-button" id="edit-resources">Manuell</button>`,armourBody,"combat-armour-box")}${sheetBox("Belastung","Getragene Last","",loadBody,"combat-load-box")}${sheetBox("Ausrüstung","Am Körper",`<button class="mini-button" id="add-equipment">＋</button>`,equipmentBody,"combat-equipment-box")}${sheetBox("Magische Effekte","Aktiv","",effectBody,"combat-effects-box")}`;
  };
  const skillsTab = character => {
    const current=currentCareerRecord(character),learned=learnedSkillNames(character),suggestions=careerSkills(current).filter(skill=>!learned.has(skill.name));
    const hint=suggestions.length?`<div class="career-skill-hint"><strong>Offene Skills aus ${escapeHtml(current.name)}</strong><span>${suggestions.slice(0,10).map(skill=>escapeHtml(skill.name)).join(", ")}${suggestions.length>10?" …":""}</span></div>`:`<p class="hint">Alle Skills der aktuellen Karriere sind eingetragen oder die Karriere hat keine feste Liste.</p>`;
    const rows=character.sheet.skills.length?character.sheet.skills.map(skill=>{
      const detail=skill.description||coreSkillDetail(skill.name)?.description||"";
      return `<article class="skill-entry"><div class="skill-entry-main"><div><strong>${escapeHtml(skill.name)}</strong><small>${skill.source==="core"?"GRW · ":"frei · "}${escapeHtml(skill.attribute||"frei")}${skill.note?` · ${escapeHtml(skill.note)}`:""}</small></div><div class="item-actions"><button class="mini-button" data-edit-skill="${skill.id}">✎</button><button class="mini-button danger" data-delete-skill="${skill.id}">×</button></div></div>${detail?`<details class="rule-description"><summary>Beschreibung &amp; Regelwirkung</summary><p>${escapeHtml(detail)}</p></details>`:""}</article>`;
    }).join(""):`<div class="empty compact"><h3>Noch keine Skills</h3><p>Skills können direkt aus der Karriere-Ansicht gelernt werden.</p></div>`;
    return `${sheetBox(`Grundregelwerk · ${RULES.skills.length} Skills`,"Skills",`<button class="mini-button" id="add-skill">＋</button>`,`${hint}<div class="simple-list skills-list">${rows}</div>`,"skills-box")}`;
  };
  const magicTab = character => {
    const r=character.sheet.resources,ap=physicalArmourPoints(character),surcharge=spellArmourSurcharge(character);
    const intro=`${ap?`<div class="rules-warning"><strong>Rüstung & Magie</strong><p>${ap} relevante Rüstungspunkte → +${surcharge} MP auf jeden Zauber/Scroll. Meditation ist in Rüstung bzw. mit Schild nicht möglich.</p></div>`:`<p class="hint">Keine Rüstungshindernis-Kosten aktiv.</p>`}<div class="resource-grid combat-strip"><article><small>Aktuelle MP</small><strong>${r.magicCurrent}</strong><span>verfügbar</span></article><article><small>Maximale MP</small><strong>${r.magicMax}</strong><span>gesamt</span></article><article><small>Rüstungspunkte</small><strong>${ap}</strong><span>relevant</span></article><article><small>MP-Zuschlag</small><strong>+${surcharge}</strong><span>pro Zauber</span></article></div>`;
    const book=`<div class="spell-list">${character.sheet.spells.length?character.sheet.spells.map(spell=>{const total=Math.max(0,num(spell.magicPoints))+surcharge;return `<article class="spell-card ${spell.active?"active":""}"><div class="spell-title"><div><strong>${escapeHtml(spell.name)}</strong><small>${escapeHtml(spell.school||"frei")} · Grad ${escapeHtml(spell.level||"—")} · ${spell.costVerified?`${spell.magicPoints} MP + ${surcharge} Rüstung = ${total} MP`:"MP-Kosten noch nicht bestätigt"} · ${escapeHtml(spell.range||"Reichweite frei")}</small></div><span>${spell.active?"AKTIV":""}</span></div>${spell.duration?`<p><b>Dauer:</b> ${escapeHtml(spell.duration)}</p>`:""}${spell.ingredients?`<p><b>Zutaten:</b> ${escapeHtml(spell.ingredients)}</p>`:""}${spell.description?`<details class="rule-description spell-description"><summary>Beschreibung &amp; Wirkung</summary><p>${escapeHtml(spell.description)}</p></details>`:""}${spell.armourBonus?`<p><b>Automatik:</b> ${signed(spell.armourBonus)} AP auf alle Trefferzonen, solange aktiv.</p>`:""}<div class="storage-toolbar"><button class="secondary-button" data-cast-spell="${spell.id}" ${spell.costVerified?"":"disabled"}>Wirken (${total} MP)</button><button class="secondary-button" data-toggle-spell="${spell.id}">${spell.active?"Deaktivieren":"Aktivieren"}</button></div><div class="item-actions right"><button class="mini-button" data-edit-spell="${spell.id}">✎ Bearbeiten</button><button class="mini-button danger" data-delete-spell="${spell.id}">×</button></div></article>`}).join(""):`<div class="empty compact"><h3>Noch keine Zauber</h3><p>Über + kannst du Core-Zauber übernehmen.</p></div>`}</div>`;
    return `${sheetBox("Magiepunkte",`${r.magicCurrent} / ${r.magicMax}`,`<button class="mini-button" id="edit-resources">Bearbeiten</button>`,intro,"magic-intro-box")}${sheetBox(`Core-Zauberbibliothek · ${RULES.spellPresets.length} Einträge`,"Zauberbuch",`<button class="mini-button" id="add-spell">＋</button>`,book,"magic-book-box")}`;
  };
  const characterSheet = (tab="profile") => {
    const character=ensureCharacter(active()),current=currentCareerRecord(character),content=tab==="career"?careerTab(character):tab==="combat"?combatTab(character):tab==="skills"?skillsTab(character):tab==="magic"?magicTab(character):profileTab(character);
    const layer=modal(`<section class="sheet character-sheet tab-${tab}"><div class="handle"></div><div class="character-sheet-frame"><div class="sheet-watermark" aria-hidden="true">Warhammer Character Record</div><div class="heading character-sheet-heading"><div><span class="eyebrow">Warhammer Fantasy Roleplay</span><h2>Character Sheet</h2><p class="sheet-edition-line">1st Edition · Grundregelwerk</p></div><button class="close" aria-label="Schließen">×</button></div><div class="sheet-header-band"><div><small>Name</small><strong>${escapeHtml(character.name)}</strong></div><div><small>Karriere</small><strong>${escapeHtml(current.name)}</strong></div><div><small>Volk</small><strong>${escapeHtml(character.sheet.identity.race||"—")}</strong></div><div><small>Wunden</small><strong>${character.sheet.resources.currentWounds}/${woundsMax(character)}</strong></div></div>${sheetTabs(tab)}<div class="sheet-content tab-${tab}">${content}</div><p class="sheet-footer-note">WFRP 1E Core: Karrieren, Advance Schemes und Karriere-Skills sind hinterlegt. Freie Felder bleiben editierbar.</p></div></section>`);
    $(".close",layer).addEventListener("click",()=>layer.remove());
    $$('[data-sheet-tab]',layer).forEach(button=>button.addEventListener("click",()=>remountModal(layer,()=>characterSheet(button.dataset.sheetTab))));
    $("#edit-profile",layer)?.addEventListener("click",()=>editProfile(layer,tab));$("#edit-stats",layer)?.addEventListener("click",()=>editStats(layer,tab));$("#edit-resources",layer)?.addEventListener("click",()=>editResources(layer,tab));$("#add-equipment",layer)?.addEventListener("click",()=>itemEditor("body",null,layer,{sheetTab:"combat"}));
    $$('[data-equip]',layer).forEach(button=>button.addEventListener("click",()=>{const item=character.inventory.find(entry=>entry.id===button.dataset.equip);if(!item)return;item.equipped=!item.equipped;persist();remountModal(layer,()=>characterSheet("combat"))}));$$('[data-edit-item]',layer).forEach(button=>button.addEventListener("click",()=>itemEditor("body",button.dataset.editItem,layer,{sheetTab:"combat"})));
    $("#choose-career",layer)?.addEventListener("click",()=>careerPicker(layer));$("#edit-career-scheme",layer)?.addEventListener("click",()=>careerSchemeEditor(layer));$$('[data-buy-advance]',layer).forEach(button=>button.addEventListener("click",()=>buyAdvance(button.dataset.buyAdvance,layer)));$$('[data-restore-career]',layer).forEach(button=>button.addEventListener("click",()=>restoreCareerFromHistory(button.dataset.restoreCareer,layer)));$$('[data-learn-career-skill]',layer).forEach(button=>button.addEventListener("click",()=>learnCareerSkill(button.dataset.learnCareerSkill,layer,button.dataset.careerNote||"")));
    $("#add-skill",layer)?.addEventListener("click",()=>skillPicker(layer));$$('[data-edit-skill]',layer).forEach(button=>button.addEventListener("click",()=>skillEditor(button.dataset.editSkill,layer)));$$('[data-delete-skill]',layer).forEach(button=>button.addEventListener("click",()=>{const skill=character.sheet.skills.find(entry=>entry.id===button.dataset.deleteSkill);if(skill&&confirm(`${skill.name} löschen?`)){character.sheet.skills=character.sheet.skills.filter(entry=>entry.id!==skill.id);persist();remountModal(layer,()=>characterSheet("skills"))}}));
    $("#add-spell",layer)?.addEventListener("click",()=>spellPicker(layer));$$('[data-edit-spell]',layer).forEach(button=>button.addEventListener("click",()=>spellEditor(button.dataset.editSpell,layer)));$$('[data-delete-spell]',layer).forEach(button=>button.addEventListener("click",()=>{const spell=character.sheet.spells.find(entry=>entry.id===button.dataset.deleteSpell);if(spell&&confirm(`${spell.name} löschen?`)){character.sheet.spells=character.sheet.spells.filter(entry=>entry.id!==spell.id);persist();remountModal(layer,()=>characterSheet("magic"))}}));$$('[data-toggle-spell]',layer).forEach(button=>button.addEventListener("click",()=>{const spell=character.sheet.spells.find(entry=>entry.id===button.dataset.toggleSpell);if(!spell)return;spell.active=!spell.active;persist();remountModal(layer,()=>characterSheet("magic"))}));$$('[data-cast-spell]',layer).forEach(button=>button.addEventListener("click",()=>castSpell(button.dataset.castSpell,layer)));
  };
  const buyAdvance = (key,previous) => {
    const character=active();
    const career=currentCareerRecord(character);
    syncAdvancedFromCareerScheme(character,career,false);
    const stat=character.sheet.stats[key];
    if(!stat) return;
    const max=Math.max(0,num(stat.advance,0));
    const step=advanceStep(key);
    const bought=purchasedAdvance(character,key);
    const cost=num(RULES.rules?.advanceCost,100);
    if(!max || bought+step>max){alert(`Das aktuelle Advance Scheme erlaubt für ${key} keine weitere Steigerung.`);return}
    if(character.sheet.resources.xpAvailable<cost){alert(`Nicht genug EP. Benötigt: ${cost} EP.`);return}
    character.sheet.resources.xpAvailable-=cost;
    stat.purchased=bought+step;
    persist();
    previous.remove();
    render();
    characterSheet("career");
  };

  const careerPicker = previous => {
    const character=active(),current=currentCareerRecord(character),options=(RULES.careerOptions||[]).length?RULES.careerOptions:[...RULES.careers.basic.map(name=>({id:"",name,label:name,type:"basic"})),...RULES.careers.advanced.map(name=>({id:"",name,label:name,type:"advanced"}))];
    const basics=options.filter(o=>o.type==="basic"),advanced=options.filter(o=>o.type==="advanced");
    const optionHtml=o=>`<option value="${escapeHtml(o.id||o.label||o.name)}" ${current.presetId===(o.id||"")?"selected":""}>${escapeHtml(o.label||o.name)}</option>`;
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Grundregelwerk</span><h2>Karriere wählen</h2></div><button type="button" class="close">×</button></div><label>Core-Karriere<select name="career"><option value="">— auswählen —</option><optgroup label="Basic Careers">${basics.map(optionHtml).join("")}</optgroup><optgroup label="Advanced Careers / Stufen">${advanced.map(optionHtml).join("")}</optgroup></select></label><label>Oder freie Karriere<input name="custom" placeholder="Eigener Name"></label><label class="toggle-line"><span><strong>Bisherige Karriere in Historie verschieben</strong><br><small>Dadurch bleiben mehrere durchlaufene Karrieren erhalten.</small></span><input name="archiveCurrent" type="checkbox" ${current.name&&current.name!=="Abenteurer"?"checked":""}></label><p class="hint">Bei Core-Karrieren werden Advance Scheme und Skills automatisch geladen. Mehrstufige Karrieren wie Wizard, Cleric, Alchemist oder Sea Captain sind als eigene Stufen auswählbar.</p><button class="full-button">Übernehmen</button></form>`);
    layer.classList.add("high");$(".close",layer).addEventListener("click",()=>layer.remove());$("form",layer).addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements,custom=f.custom.value.trim();let next;if(custom){next=sanitizeCareerRecord({name:custom,type:"custom",scheme:emptyScheme()})}else{const selected=options.find(o=>(o.id||o.label||o.name)===f.career.value);if(!selected){alert("Bitte eine Karriere auswählen.");return}const def=RULES.careerDetails?.[selected.id];next=sanitizeCareerRecord({name:selected.label||selected.name,presetId:selected.id,type:selected.type,scheme:def?.scheme||emptyScheme(),notes:def?.notes||""})}applyCareerRecord(character,next,{archiveCurrent:f.archiveCurrent.checked});persist();layer.remove();previous.remove();render();characterSheet("career")});
  };
  const careerSchemeEditor = previous => {
    const character=active(),c=currentCareerRecord(character);c.scheme=mergedCareerScheme(c);
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Advance Scheme</span><h2>${escapeHtml(character.career)}</h2></div><button type="button" class="close">×</button></div><div class="form-grid two">${RULES.advanceableCharacteristics.map(key=>`<label>${key} Advanced<input name="${key}" type="number" min="0" step="1" value="${num(c.scheme?.[key],0)}"></label>`).join("")}</div><label>Notiz / Quellenvermerk<textarea name="notes">${escapeHtml(c.notes)}</textarea></label><p class="hint">Advanced entspricht dem Advance Scheme der aktuellen Karriere. Die Werte werden im Charakterprofil direkt in die Zeile Advanced übernommen.</p><button class="full-button">Schema speichern</button></form>`);
    layer.classList.add("high");$(".close",layer).addEventListener("click",()=>layer.remove());$("form",layer).addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements;RULES.advanceableCharacteristics.forEach(key=>c.scheme[key]=Math.max(0,num(f[key].value,0)));c.notes=f.notes.value.trim();syncAdvancedFromCareerScheme(character,c,true);persist();layer.remove();previous.remove();characterSheet("career")});
  };
  const editProfile = (previous,returnTab) => {
    const character=active(),i=character.sheet.identity;
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Charakterbogen</span><h2>Profil bearbeiten</h2></div><button type="button" class="close">×</button></div><div class="form-grid two"><label>Name<input name="name" value="${escapeHtml(character.name)}"></label><label>Karriere<input name="career" value="${escapeHtml(character.career)}"></label><label>Volk<input name="race" value="${escapeHtml(i.race)}"></label><label>Geschlecht<input name="sex" value="${escapeHtml(i.sex)}"></label><label>Alter<input name="age" value="${escapeHtml(i.age)}"></label><label>Größe<input name="height" value="${escapeHtml(i.height)}"></label><label>Gewicht<input name="weight" value="${escapeHtml(i.weight)}"></label><label>Gesinnung<input name="alignment" value="${escapeHtml(i.alignment)}"></label><label>Geburtsort<input name="birthplace" value="${escapeHtml(i.birthplace)}"></label><label>Augen<input name="eyes" value="${escapeHtml(i.eyes)}"></label><label>Haare<input name="hair" value="${escapeHtml(i.hair)}"></label><label>Frühere Karrieren<input name="previousCareers" value="${escapeHtml(i.previousCareers)}"></label></div><label>Besondere Merkmale<textarea name="marks">${escapeHtml(i.marks)}</textarea></label><label>Freie Notizen<textarea name="notes">${escapeHtml(i.notes)}</textarea></label><button class="full-button">Speichern</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements;character.name=String(f.name.value).trim()||character.name;character.career=String(f.career.value).trim()||"Abenteurer";character.sheet.career.name=character.career;character.sheet.career.presetId="";character.sheet.career.type="custom";character.sheet.career.scheme=emptyScheme();syncAdvancedFromCareerScheme(character,character.sheet.career,true);Object.keys(character.sheet.identity).forEach(key=>{if(f[key])character.sheet.identity[key]=String(f[key].value).trim()});persist();layer.remove();previous.remove();render();characterSheet(returnTab)});
  };
  const editStats = (previous,returnTab) => {
    const character=active();
    const bought=(RULES.characteristics||[]).filter(stat=>purchasedAdvance(character,stat.key)>0).map(stat=>`${stat.key} ${signed(purchasedAdvance(character,stat.key))}`).join(" · ");
    const cards=RULES.characteristics.map(stat=>{
      const mod=skillProfileModifier(character,stat.key);
      const modTitle=mod.details.map(item=>`${item.name} ${signed(item.amount)}`).join(" · ");
      return `<article class="profile-edit-card"><header><strong>${escapeHtml(stat.key)}</strong><small>${escapeHtml(stat.label)}</small></header><label>Start<input name="${stat.key}-base" type="number" step="1" value="${num(character.sheet.stats[stat.key]?.base,0)}" aria-label="${stat.key} Start"><span class="profile-edit-start-preview" data-start-stat="${stat.key}"${modTitle?` title="${escapeHtml(modTitle)}"`:""}>Anzeige: ${startStatValue(character,stat.key)}${mod.total?`<sup class="profile-skill-star">*</sup>`:""}</span></label><label>Advanced<input name="${stat.key}-advance" type="number" step="1" min="0" value="${num(character.sheet.stats[stat.key]?.advance,0)}" aria-label="${stat.key} Advanced"></label><div class="profile-edit-current"><small>Current</small><output class="profile-current-output" data-current-stat="${stat.key}">${statValue(character,stat.key)}</output></div></article>`;
    }).join("");
    const layer=modal(`<form class="sheet form stat-profile-form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Profilwerte</span><h2>Charakteristika</h2></div><button type="button" class="close">×</button></div><div class="profile-edit-grid">${cards}</div><div class="profile-calculation-note"><span><strong>Gekaufte Advances:</strong> ${bought||"noch keine"}</span><span><strong>*</strong> kennzeichnet einen in Start eingerechneten Skill-/Talentbonus.</span></div><p class="hint"><strong>Start</strong> = Wert aus der Charaktererschaffung plus feste Profilboni aus Skills/Talenten. <strong>Advanced</strong> = maximal kaufbare Werte aus dem Scheme der aktuellen Karriere und frei editierbar. <strong>Current</strong> = effektiver Start + tatsächlich gekaufte Advances. Advanced selbst wird nicht auf Current addiert.</p><button class="full-button">Werte speichern</button></form>`);
    layer.classList.add("high");
    const form=$("form",layer);
    const refreshCurrent=()=>RULES.characteristics.forEach(stat=>{
      const rawStart=num(form.elements[`${stat.key}-base`]?.value,0);
      const bought=purchasedAdvance(character,stat.key);
      const modifier=skillProfileModifier(character,stat.key).total;
      const effectiveStart=rawStart+modifier;
      const startPreview=$(`[data-start-stat="${stat.key}"]`,form);
      const output=$(`[data-current-stat="${stat.key}"]`,form);
      if(startPreview) startPreview.innerHTML=`Anzeige: ${effectiveStart}${modifier?'<sup class="profile-skill-star">*</sup>':""}`;
      if(output) output.textContent=String(effectiveStart+bought);
    });
    $$('[name$="-base"]',form).forEach(input=>input.addEventListener("input",refreshCurrent));
    $(".close",layer).addEventListener("click",()=>layer.remove());
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const f=event.currentTarget.elements;
      const career=currentCareerRecord(character);
      RULES.characteristics.forEach(stat=>{
        const existing=character.sheet.stats[stat.key]||{};
        const advanced=Math.max(0,num(f[`${stat.key}-advance`].value));
        character.sheet.stats[stat.key]={base:num(f[`${stat.key}-base`].value),advance:advanced,purchased:Math.max(0,num(existing.purchased,0)),manual:num(existing.manual,0)};
        if((RULES.advanceableCharacteristics||[]).includes(stat.key)) career.scheme[stat.key]=advanced;
      });
      character.sheet.profileMeta.schemeSyncedPreset=String(career.presetId||career.name||"");
      persist();layer.remove();previous.remove();render();characterSheet(returnTab);
    });
  };
  const editResources = (previous,returnTab) => {
    const character=active(),r=character.sheet.resources,m=character.sheet.armourManual;
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Aktuelle Werte</span><h2>Ressourcen &amp; manuelle AP</h2></div><button type="button" class="close">×</button></div><div class="form-grid two"><label>Aktuelle Wunden<input name="currentWounds" type="number" value="${r.currentWounds}"></label><label>Max. Wunden (aus W)<input value="${woundsMax(character)}" disabled></label><label>Schicksal aktuell<input name="fateCurrent" type="number" value="${r.fateCurrent}"></label><label>Schicksal max.<input name="fateMax" type="number" value="${r.fateMax}"></label><label>Magiepunkte aktuell<input name="magicCurrent" type="number" value="${r.magicCurrent}"></label><label>Magiepunkte max.<input name="magicMax" type="number" value="${r.magicMax}"></label><label>EP verfügbar<input name="xpAvailable" type="number" value="${r.xpAvailable}"></label><label>EP gesamt<input name="xpTotal" type="number" value="${r.xpTotal}"></label><label>Magie-Rüstungs-AP (Override)<input name="magicArmourOverride" type="number" min="0" value="${character.sheet.magic.armourPointOverride}"></label></div><span class="eyebrow">Manueller Rüstungsmodifikator</span><div class="form-grid two">${RULES.locations.map(location=>`<label>${locationLabel(location)}<input name="armour-${location}" type="number" min="-20" max="20" value="${m[location]||0}"></label>`).join("")}</div><p class="hint">Die manuellen AP werden zusätzlich zu angelegter Rüstung und aktiven Zaubereffekten verrechnet.</p><button class="full-button">Speichern</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements;Object.keys(r).forEach(key=>r[key]=num(f[key].value));character.sheet.magic.armourPointOverride=f.magicArmourOverride.value===""?"":Math.max(0,num(f.magicArmourOverride.value));RULES.locations.forEach(location=>character.sheet.armourManual[location]=num(f[`armour-${location}`].value));persist();layer.remove();previous.remove();render();characterSheet(returnTab)});
  };
  const skillPicker = previous => {
    const character=active(),current=currentCareerRecord(character),learned=learnedSkillNames(character);
    const careerPool=[];[current,...careerHistory(character)].forEach(record=>careerSkills(record).forEach(skill=>{if(!careerPool.some(x=>x.name===skill.name))careerPool.push({...skill,origin:record.name})}));
    const encode=x=>encodeURIComponent(JSON.stringify(x));
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Grundregelwerk</span><h2>Skill hinzufügen</h2></div><button type="button" class="close">×</button></div><label>Skill<select name="skill" required><option value="">— auswählen —</option>${careerPool.length?`<optgroup label="Aktuelle & frühere Karrieren">${careerPool.map(skill=>`<option value="${encode(skill)}" ${learned.has(skill.name)?"disabled":""}>${escapeHtml(skill.name)} · ${escapeHtml(skill.origin)}</option>`).join("")}</optgroup>`:""}<optgroup label="Alle Core-Skills">${RULES.skills.map(name=>`<option value="${encode({name})}">${escapeHtml(name)}</option>`).join("")}</optgroup></select></label><label>Specialist Weapon-Kategorie (nur falls benötigt)<select name="specialist"><option value="">— keine —</option>${(RULES.specialistWeaponCategories||[]).map(name=>`<option>${escapeHtml(name)}</option>`).join("")}</select></label><label class="toggle-line"><span><strong>Mit 100 EP als Karriere-Skill kaufen</strong><br><small>optional; freie Einträge können ohne Abzug gespeichert werden</small></span><input name="spendXp" type="checkbox"></label><button class="full-button">Skill hinzufügen</button><button type="button" class="secondary-button" id="custom-skill">Freien Skill anlegen</button></form>`);
    layer.classList.add("high");$(".close",layer).addEventListener("click",()=>layer.remove());$("#custom-skill",layer).addEventListener("click",()=>{layer.remove();skillEditor(null,previous)});$("form",layer).addEventListener("submit",event=>{event.preventDefault();let payload={};try{payload=JSON.parse(decodeURIComponent(event.currentTarget.elements.skill.value||""))}catch{}let name=payload.name||"";const category=event.currentTarget.elements.specialist.value;if(name==="Specialist Weapon"&&category)name=`Specialist Weapon - ${category}`;const spend=event.currentTarget.elements.spendXp.checked,cost=num(RULES.rules?.skillCost,100);if(!name)return;if(character.sheet.skills.some(s=>s.name===name)){alert("Dieser Skill ist bereits eingetragen.");return}if(spend&&character.sheet.resources.xpAvailable<cost){alert("Nicht genug EP für einen neuen Karriere-Skill.");return}if(spend)character.sheet.resources.xpAvailable-=cost;character.sheet.skills.push(sanitizeSkill({name,source:"core",note:payload.note?`${payload.note}${payload.origin?` · ${payload.origin}`:""}`:(payload.origin?`Karriere: ${payload.origin}`:"")}));persist();layer.remove();previous.remove();render();characterSheet("skills")});
  };
  const skillEditor = (skillId,previous) => {
    const character=active(); const existing=character.sheet.skills.find(skill=>skill.id===skillId); const skill=existing||sanitizeSkill({name:""});
    const bonusFields=RULES.characteristics.map(stat=>`<label>${escapeHtml(stat.key)} Bonus<input name="bonus-${stat.key}" type="number" step="1" value="${num(skill.profileBonuses?.[stat.key],0)}"></label>`).join("");
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Fertigkeit</span><h2>${existing?"Skill bearbeiten":"Freien Skill hinzufügen"}</h2></div><button type="button" class="close">×</button></div><label>Name<input name="name" required value="${escapeHtml(skill.name)}"></label><label>Zugehöriger Wert / Kategorie<input name="attribute" value="${escapeHtml(skill.attribute)}" placeholder="z. B. Dex, Int oder frei"></label><label>Notiz<textarea name="note">${escapeHtml(skill.note)}</textarea></label><label>Beschreibung / Regelwirkung<textarea name="description" rows="7">${escapeHtml(skill.description||coreSkillDetail(skill.name)?.description||"")}</textarea></label><details class="profile-bonus-editor"><summary>Profilbonus durch Skill/Talent</summary><p class="hint">Core-Talente werden automatisch vorbelegt: Fleet Footed M +1, Lightning Reflexes I +10, Very Resilient T +1, Very Strong S +1. Strongman erhält S +1; den im Grundregelwerk ausgewürfelten D4-Wundenbonus kannst du hier bei W eintragen.</p><div class="form-grid two">${bonusFields}</div></details><button class="full-button">Speichern</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements;const name=f.name.value.trim();const profileBonuses=Object.fromEntries(RULES.characteristics.map(stat=>[stat.key,num(f[`bonus-${stat.key}`].value,0)]));const saved=sanitizeSkill({id:existing?.id||id(),name,attribute:f.attribute.value.trim(),note:f.note.value.trim(),description:f.description.value.trim(),source:existing?.source||"custom",profileBonuses});if(existing)Object.assign(existing,saved);else character.sheet.skills.push(saved);persist();layer.remove();previous.remove();characterSheet("skills")});
  };
  const spellPicker = previous => {
    const presets=RULES.spellPresets||[]; const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Grundregelwerk</span><h2>Zauber übernehmen</h2></div><button type="button" class="close">×</button></div><label>Core-Zauber<select name="spell" required><option value="">— auswählen —</option>${presets.map(spell=>`<option value="${escapeHtml(spell.id)}">${escapeHtml(spell.school)} · ${escapeHtml(spell.level)} · ${escapeHtml(spell.name)}</option>`).join("")}</select></label><p class="hint">Petty-Magic-Kosten und eindeutig ausgelesene Werte sind vorbelegt. Bei anderen Core-Zaubern bleiben nicht sicher extrahierte Detailwerte bewusst leer, bis du sie bestätigst.</p><button class="full-button">Übernehmen & bearbeiten</button><button type="button" class="secondary-button" id="custom-spell">Freien Zauber anlegen</button></form>`);layer.classList.add("high");$(".close",layer).addEventListener("click",()=>layer.remove());$("#custom-spell",layer).addEventListener("click",()=>{layer.remove();spellEditor(null,previous)});$("form",layer).addEventListener("submit",event=>{event.preventDefault();const preset=presets.find(x=>x.id===event.currentTarget.elements.spell.value);if(!preset)return;const saved=sanitizeSpell({presetId:preset.id,source:"core",school:preset.school,name:preset.name,level:preset.level,magicPoints:preset.magicPoints,range:preset.range,duration:preset.duration,ingredients:preset.ingredients,description:preset.description||preset.note||"",costVerified:preset.school==="Petty Magic",armourBonus:preset.name==="Aura of Resistance"?1:preset.name==="Aura of Protection"?2:preset.name==="Aura of Invulnerability"?3:0});active().sheet.spells.push(saved);persist();layer.remove();spellEditor(saved.id,previous)});
  };
  const spellEditor = (spellId,previous) => {
    const character=active(); const existing=character.sheet.spells.find(spell=>spell.id===spellId); const spell=existing||sanitizeSpell({name:"",armourBonus:0});
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Zauberbuch</span><h2>${existing?"Zauber bearbeiten":"Zauber hinzufügen"}</h2></div><button type="button" class="close">×</button></div><div class="form-grid two"><label>Name<input name="name" required value="${escapeHtml(spell.name)}"></label><label>Schule / Typ<input name="school" value="${escapeHtml(spell.school)}"></label><label>Zaubergrad<input name="level" value="${escapeHtml(spell.level)}"></label><label>MP-Kosten<input name="magicPoints" type="number" min="0" value="${spell.magicPoints}"></label><label>Reichweite<input name="range" value="${escapeHtml(spell.range)}"></label><label>Dauer<input name="duration" value="${escapeHtml(spell.duration)}"></label><label>AP-Bonus wenn aktiv<input name="armourBonus" type="number" min="-20" max="20" value="${spell.armourBonus}"></label></div><label>Zutaten<input name="ingredients" value="${escapeHtml(spell.ingredients)}"></label><label class="toggle-line"><span><strong>MP-Kosten bestätigt</strong><br><small>erst dann darf „Wirken“ automatisch MP abziehen</small></span><input name="costVerified" type="checkbox" ${spell.costVerified?"checked":""}></label><label>Beschreibung / Regelnotiz<textarea name="description" rows="9">${escapeHtml(spell.description)}</textarea></label><p class="hint">Die Rüstungskosten (+2 MP je relevantem Rüstungspunkt) werden beim Wirken automatisch zusätzlich berechnet.</p><button class="full-button">Speichern</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements;const saved=sanitizeSpell({id:existing?.id||id(),presetId:existing?.presetId||"",source:existing?.source||"custom",school:f.school.value.trim(),name:f.name.value.trim(),level:f.level.value.trim(),magicPoints:num(f.magicPoints.value),costVerified:f.costVerified.checked,range:f.range.value.trim(),duration:f.duration.value.trim(),ingredients:f.ingredients.value.trim(),description:f.description.value.trim(),armourBonus:num(f.armourBonus.value),active:existing?.active||false});if(existing)Object.assign(existing,saved);else character.sheet.spells.push(saved);persist();layer.remove();previous.remove();characterSheet("magic")});
  };
  const castSpell = (spellId,previous) => {
    const character=active(); const spell=character.sheet.spells.find(entry=>entry.id===spellId); if(!spell)return;
    if(!spell.costVerified){alert("Die MP-Kosten dieses Zaubers sind noch nicht bestätigt. Bitte den Zauber zuerst bearbeiten.");return}
    const cost=Math.max(0,num(spell.magicPoints))+spellArmourSurcharge(character);
    if(cost>character.sheet.resources.magicCurrent){alert(`Nicht genug Magiepunkte. Benötigt: ${cost} MP (inkl. Rüstung).`);return}
    if(cost) character.sheet.resources.magicCurrent-=cost;
    if(spell.armourBonus) spell.active=true;
    persist(); previous.remove(); render(); characterSheet("magic");
  };

  const transactionSheet = type => {
    const character=active(); const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">${escapeHtml(character.name)}</span><h2>${type==="income"?"Geld erhalten":"Bezahlen"}</h2></div><button type="button" class="close">×</button></div>${moneyFields()}<p class="conversion hidden"></p><p class="error hidden">Dafür enthält der Geldbeutel nicht genug Münzen.</p><label>Notiz<input name="note" placeholder="z. B. Übernachtung im Roten Mond" autocomplete="off"></label><button class="full-button ${type}" disabled>${type==="income"?"Dem Geldbeutel hinzufügen":"Ausgabe verbuchen"}</button></form>`);
    layer.classList.add("high"); const form=$("form",layer),submit=$(".full-button",form),conversion=$(".conversion",form),error=$(".error",form); const check=()=>{const value=amountFromForm(form);const enough=type==="income"||value<=character.balance;conversion.classList.toggle("hidden",!value);conversion.textContent=value?`Entspricht ${label(value)}`:"";error.classList.toggle("hidden",enough);submit.disabled=!value||!enough}; $$('input[type="number"]',form).forEach(input=>input.addEventListener("input",check)); $(".close",layer).addEventListener("click",()=>layer.remove()); form.addEventListener("submit",event=>{event.preventDefault();const value=amountFromForm(form);if(!value||(type==="expense"&&value>character.balance))return;character.transactions.unshift({id:id(),type,amount:value,note:form.elements.note.value.trim()||(type==="income"?"Einnahme":"Ausgabe"),createdAt:new Date().toISOString()});character.balance+=type==="income"?value:-value;layer.remove();render()});
  };

  const storageSheet = () => {
    const character=ensureCharacter(active());
    const totalItems=character.inventory.length+character.storages.reduce((sum,s)=>sum+s.items.length,0);
    const layer=modal(`<section class="sheet"><div class="handle"></div><div class="heading"><div><span class="eyebrow">${escapeHtml(character.name)}</span><h2>Truhen &amp; Lager</h2></div><button class="close" aria-label="Schließen">×</button></div>
      <div class="storage-summary"><div class="summary-card"><small>Am Körper</small><strong>${bodyEnc(character)} ENC</strong></div><div class="summary-card"><small>In Lagern</small><strong>${storedEnc(character)} ENC</strong></div><div class="summary-card"><small>Gegenstandszeilen</small><strong>${totalItems}</strong></div><div class="summary-card"><small>Eingelagertes Geld</small><strong>${label(character.storages.reduce((sum,s)=>sum+s.money,0))}</strong></div></div>
      <div class="storage-list"><button class="storage-card body-card" data-body><span class="kind">⚔</span><span><strong>Am Körper</strong><small>${character.inventory.length} Gegenstände · ${itemsEnc(character.inventory)} ENC direkt getragen</small></span><span class="status">›</span></button>
      ${character.storages.map(storage=>`<button class="storage-card ${storage.carried?"carried":"dropped"}" data-storage="${storage.id}"><span class="kind">${storageIcon(storage.type)}</span><span><strong>${escapeHtml(storage.name)}</strong><small>${storageTypeLabel(storage.type)} · ${storage.items.length} Gegenstände · ${label(storage.money)}</small></span><span class="status">${storage.carried?"getragen":"gelagert"}<br>›</span></button>`).join("")}</div>
      <button class="full-button" id="new-storage">＋ Neues Lager anlegen</button></section>`);
    $(".close",layer).addEventListener("click",()=>layer.remove()); $("[data-body]",layer).addEventListener("click",()=>{layer.remove();locationSheet("body")}); $$('[data-storage]',layer).forEach(button=>button.addEventListener("click",()=>{layer.remove();locationSheet(button.dataset.storage)})); $("#new-storage",layer).addEventListener("click",()=>newStorage(layer));
  };
  const newStorage = previous => {
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Lagerbuch</span><h2>Neues Lager</h2></div><button type="button" class="close">×</button></div><label>Name<input name="name" required placeholder="z. B. Truhe auf der Schwarzen Möwe" autocomplete="off"></label><label>Art<select name="type"><option value="chest">Truhe</option><option value="backpack">Rucksack</option><option value="horse">Pferd</option><option value="cart">Karren</option><option value="ship">Schiff</option><option value="room">Quartier</option><option value="stash">Versteck</option></select></label><p class="hint">Rucksäcke können später als getragen oder abgelegt markiert werden. Getragene Lager zählen zum ENC am Körper.</p><button class="full-button">Lager anlegen</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const data=new FormData(event.currentTarget);const storage={id:id(),name:String(data.get("name")).trim(),type:String(data.get("type")),carried:String(data.get("type"))==="backpack",money:0,items:[]};active().storages.push(storage);persist();layer.remove();previous.remove();storageSheet()}); $("input",layer).focus();
  };
  const itemMeta = item => {
    const parts=[`${itemEnc(item)} ENC gesamt`];
    if(item.value)parts.push(`Wert ${label(itemValue(item))}`);
    if(item.type==="armor")parts.push(item.equipped?"angelegt":"Rüstung");
    if(item.type==="weapon")parts.push(item.equipped?"griffbereit":"Waffe");
    if(item.note)parts.push(escapeHtml(item.note));
    return parts.join(" · ");
  };
  const locationSheet = locationId => {
    const character=ensureCharacter(active()); const isBody=locationId==="body"; const storage=isBody?null:character.storages.find(s=>s.id===locationId); if(!isBody&&!storage){storageSheet();return}
    const items=isBody?character.inventory:storage.items; const title=isBody?"Am Körper":storage.name; const money=isBody?character.balance:storage.money;
    const layer=modal(`<section class="sheet"><div class="handle"></div><div class="heading"><div><span class="eyebrow">${isBody?"Persönliches Inventar":escapeHtml(storageTypeLabel(storage.type))}</span><h2>${escapeHtml(title)}</h2></div><button class="close" aria-label="Schließen">×</button></div>
      ${!isBody&&storage.type==="backpack"?`<div class="toggle-line"><span><strong>Rucksack ${storage.carried?"getragen":"abgelegt"}</strong><br><small>${storage.carried?"Sein Inhalt zählt zum ENC am Körper.":"Sein Inhalt zählt nicht zum ENC am Körper."}</small></span><button class="secondary-button" id="toggle-carried">${storage.carried?"Ablegen":"Aufnehmen"}</button></div>`:""}
      ${!isBody?`<div class="storage-money"><div class="storage-money-head"><span><small>Eingelagertes Geld</small><strong>${label(money)}</strong></span><span>⚿</span></div><div class="backup-actions"><button class="secondary-button" id="money-in">Geld einlagern</button><button class="secondary-button" id="money-out" ${money?"":"disabled"}>Geld entnehmen</button></div></div>`:""}
      <div class="section-title"><div><span class="eyebrow">Besitz</span><h3>Gegenstände</h3></div><small>${itemsEnc(items)} ENC</small></div>
      <div class="item-list">${items.length?items.map(item=>`<article class="item-row"><span><strong>${escapeHtml(item.name)}${item.quantity>1?` ×${item.quantity}`:""}</strong><small>${itemMeta(item)}</small></span><span class="item-actions">${isBody&&(item.type==="armor"||item.type==="weapon")?`<button class="mini-button" data-equip-item="${item.id}" title="${item.equipped?"Ablegen":"Anlegen"}">${item.equipped?"✓":"○"}</button>`:""}<button class="mini-button" data-edit-item="${item.id}" title="Bearbeiten">✎</button><button class="mini-button" data-move="${item.id}" title="Verschieben">↔</button><button class="mini-button danger" data-delete-item="${item.id}" title="Löschen">×</button></span></article>`).join(""):`<div class="empty"><h3>Hier liegt noch nichts</h3><p>Füge einen Gegenstand hinzu oder verschiebe Beute hierher.</p></div>`}</div>
      <div class="storage-toolbar"><button class="secondary-button" id="add-item">＋ Gegenstand</button><button class="secondary-button" id="back-storage">← Alle Lager</button></div>
      ${!isBody?`<button class="secondary-button danger" id="delete-storage">Lager löschen</button>`:""}</section>`);
    $(".close",layer).addEventListener("click",()=>layer.remove()); $("#back-storage",layer).addEventListener("click",()=>{layer.remove();storageSheet()}); $("#add-item",layer).addEventListener("click",()=>itemEditor(locationId,null,layer,{locationId}));
    $$('[data-edit-item]',layer).forEach(button=>button.addEventListener("click",()=>itemEditor(locationId,button.dataset.editItem,layer,{locationId})));
    $$('[data-equip-item]',layer).forEach(button=>button.addEventListener("click",()=>{const item=items.find(x=>x.id===button.dataset.equipItem);if(!item)return;item.equipped=!item.equipped;persist();layer.remove();render();locationSheet(locationId)}));
    $$('[data-move]',layer).forEach(button=>button.addEventListener("click",()=>moveItem(locationId,button.dataset.move,layer)));
    $$('[data-delete-item]',layer).forEach(button=>button.addEventListener("click",()=>{const item=items.find(x=>x.id===button.dataset.deleteItem);if(item&&confirm(`${item.name} wirklich löschen?`)){const idx=items.findIndex(x=>x.id===item.id);items.splice(idx,1);persist();layer.remove();render();locationSheet(locationId)}}));
    if(!isBody){ if(storage.type==="backpack") $("#toggle-carried",layer).addEventListener("click",()=>{storage.carried=!storage.carried;persist();layer.remove();render();locationSheet(locationId)}); $("#money-in",layer).addEventListener("click",()=>storageMoneySheet(storage,"in",layer)); $("#money-out",layer).addEventListener("click",()=>storageMoneySheet(storage,"out",layer)); $("#delete-storage",layer).addEventListener("click",()=>{if(storage.items.length||storage.money){alert("Leere das Lager zuerst: Gegenstände verschieben und Geld entnehmen.");return}if(confirm(`${storage.name} wirklich löschen?`)){character.storages=character.storages.filter(s=>s.id!==storage.id);persist();layer.remove();render();storageSheet()}}); }
  };

  const presetOptions = selected => `<option value="">— frei / kein Preset —</option><optgroup label="Rüstung">${RULES.armourPresets.map(p=>`<option value="${p.id}" ${p.id===selected?"selected":""}>${escapeHtml(p.name)}</option>`).join("")}</optgroup><optgroup label="Waffen">${RULES.weaponPresets.map(p=>`<option value="${p.id}" ${p.id===selected?"selected":""}>${escapeHtml(p.name)}</option>`).join("")}</optgroup><optgroup label="Ausrüstung">${(RULES.equipmentPresets||[]).map(p=>`<option value="${p.id}" ${p.id===selected?"selected":""}>${escapeHtml(p.name)}</option>`).join("")}</optgroup>`;
  const itemEditor = (locationId,itemId,previous,returnContext={locationId}) => {
    const character=active(); const target=locationId==="body"?character.inventory:character.storages.find(s=>s.id===locationId)?.items; if(!target)return;
    const existing=target.find(item=>item.id===itemId); const item=existing||sanitizeItem({name:"",type:"generic",equipped:false});
    const material=item.armourMaterial||"custom"; const w=item.weapon;
    const layer=modal(`<form class="sheet form equipment-form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Inventar &amp; Charakterbogen</span><h2>${existing?"Gegenstand bearbeiten":"Gegenstand hinzufügen"}</h2></div><button type="button" class="close">×</button></div><label>Vorlage<select name="presetId">${presetOptions(item.presetId)}</select></label><div class="form-grid two"><label>Name<input name="name" required value="${escapeHtml(item.name)}" placeholder="z. B. Kettenmantel"></label><label>Art<select name="type"><option value="generic" ${item.type==="generic"?"selected":""}>Allgemein</option><option value="armor" ${item.type==="armor"?"selected":""}>Rüstung / Schild</option><option value="weapon" ${item.type==="weapon"?"selected":""}>Waffe</option></select></label><label>Anzahl<input name="quantity" type="number" min="1" max="9999" value="${item.quantity}"></label><label>ENC je Stück<input name="enc" type="number" min="0" max="99999" step="1" value="${item.enc}"></label></div><span class="eyebrow">Wert je Stück</span>${moneyFields(item.value)}${locationId==="body"?`<label class="check-line"><input name="equipped" type="checkbox" ${item.equipped?"checked":""}><span>Aktiv angelegt / griffbereit</span></label>`:""}
      <section id="armor-fields" class="nested-fields"><div class="section-title"><div><span class="eyebrow">Automatik</span><h3>Rüstungswerte</h3></div></div><label>Material / Regelart<select name="armourMaterial"><option value="metal" ${material==="metal"?"selected":""}>Metall (feste AP)</option><option value="leather" ${material==="leather"?"selected":""}>Leder (0/1 AP)</option><option value="shield" ${material==="shield"?"selected":""}>Schild / feste AP</option><option value="custom" ${material==="custom"?"selected":""}>Frei / magisch</option></select></label><div class="form-grid two">${RULES.locations.map(location=>`<label>${locationLabel(location)} AP<input name="ap-${location}" type="number" min="0" max="20" value="${item.armour[location]||0}"></label>`).join("")}</div><p class="hint">Bei Leder wird ein eingetragener Schutzpunkt als 0/1-Regel behandelt. Metall über Leder unterdrückt den zusätzlichen Lederschutz automatisch.</p></section>
      <section id="weapon-fields" class="nested-fields"><div class="section-title"><div><span class="eyebrow">Automatik</span><h3>Waffenwerte</h3></div></div><div class="form-grid two"><label>Modus<select name="weaponMode"><option value="melee" ${w.mode==="melee"?"selected":""}>Nahkampf</option><option value="missile" ${w.mode==="missile"?"selected":""}>Fernkampf</option></select></label><label>Spezialwaffe / Skill<input name="weaponSkill" value="${escapeHtml(w.skill)}"></label><label>Initiative-Mod.<input name="weaponInitiative" value="${escapeHtml(w.initiative)}"></label><label>Treffer-Mod.<input name="weaponToHit" value="${escapeHtml(w.toHit)}"></label><label>Schaden-Mod.<input name="weaponDamage" value="${escapeHtml(w.damage)}"></label><label>Parade-Mod.<input name="weaponParry" value="${escapeHtml(w.parry)}"></label><label>Effektive Stärke<input name="weaponES" value="${escapeHtml(w.effectiveStrength)}"></label><label>Lade-/Feuerzeit<input name="weaponLoad" value="${escapeHtml(w.load)}"></label><label>Reichweite kurz<input name="rangeShort" value="${escapeHtml(w.rangeShort)}"></label><label>Reichweite lang<input name="rangeLong" value="${escapeHtml(w.rangeLong)}"></label><label>Reichweite extrem<input name="rangeExtreme" value="${escapeHtml(w.rangeExtreme)}"></label></div></section>
      <label>Notiz<textarea name="note">${escapeHtml(item.note)}</textarea></label><button class="full-button">Speichern</button></form>`);
    layer.classList.add("high"); const form=$("form",layer); const typeSelect=form.elements.type; const presetSelect=form.elements.presetId;
    const toggleFields=()=>{$("#armor-fields",form).classList.toggle("hidden",typeSelect.value!=="armor");$("#weapon-fields",form).classList.toggle("hidden",typeSelect.value!=="weapon")};
    const applyPreset=presetId=>{const preset=presetById(presetId);if(!preset)return;form.elements.name.value=preset.name;form.elements.type.value=preset.type;form.elements.enc.value=preset.enc||0;if(Number.isSafeInteger(preset.value)){const coins=splitCoins(preset.value);form.elements.gold.value=coins.gold||"";form.elements.silver.value=coins.silver||"";form.elements.brass.value=coins.brass||""} if(preset.type==="armor"){form.elements.armourMaterial.value=preset.material||"custom";RULES.locations.forEach(location=>form.elements[`ap-${location}`].value=preset.armour?.[location]||0)} if(preset.type==="weapon"){const pw=preset.weapon||{};form.elements.weaponMode.value=pw.mode||"melee";form.elements.weaponSkill.value=pw.skill||"";form.elements.weaponInitiative.value=pw.initiative||"0";form.elements.weaponToHit.value=pw.toHit||"0";form.elements.weaponDamage.value=pw.damage||"0";form.elements.weaponParry.value=pw.parry||"0";form.elements.weaponES.value=pw.effectiveStrength||"S";form.elements.weaponLoad.value=pw.load||"";form.elements.rangeShort.value=pw.rangeShort||"";form.elements.rangeLong.value=pw.rangeLong||"";form.elements.rangeExtreme.value=pw.rangeExtreme||""} if(preset.note)form.elements.note.value=preset.note;toggleFields()};
    toggleFields(); typeSelect.addEventListener("change",toggleFields); presetSelect.addEventListener("change",()=>applyPreset(presetSelect.value)); $(".close",layer).addEventListener("click",()=>layer.remove());
    form.addEventListener("submit",event=>{event.preventDefault();const f=event.currentTarget.elements;const saved=sanitizeItem({id:existing?.id||id(),name:f.name.value.trim(),quantity:num(f.quantity.value,1),enc:num(f.enc.value,0),value:amountFromForm(event.currentTarget),note:f.note.value.trim(),type:f.type.value,presetId:f.presetId.value,equipped:locationId==="body"?Boolean(f.equipped?.checked):false,armourMaterial:f.armourMaterial.value,armour:Object.fromEntries(RULES.locations.map(location=>[location,num(f[`ap-${location}`].value,0)])),weapon:{mode:f.weaponMode.value,skill:f.weaponSkill.value,specialist:String(f.weaponSkill.value).toLowerCase().includes("specialist weapon"),initiative:f.weaponInitiative.value,toHit:f.weaponToHit.value,damage:f.weaponDamage.value,parry:f.weaponParry.value,effectiveStrength:f.weaponES.value,load:f.weaponLoad.value,rangeShort:f.rangeShort.value,rangeLong:f.rangeLong.value,rangeExtreme:f.rangeExtreme.value}});if(existing)Object.assign(existing,saved);else target.push(saved);persist();layer.remove();previous.remove();render();if(returnContext.sheetTab)characterSheet(returnContext.sheetTab);else locationSheet(returnContext.locationId||locationId)});
  };

  const moveItem = (fromId,itemId,previous) => {
    const character=active(); const source=fromId==="body"?character.inventory:character.storages.find(s=>s.id===fromId)?.items; const item=source?.find(x=>x.id===itemId); if(!item)return; const destinations=[{id:"body",name:"Am Körper"},...character.storages.map(s=>({id:s.id,name:s.name}))].filter(d=>d.id!==fromId);
    if(!destinations.length){alert("Lege zuerst ein weiteres Lager an.");return}
    const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">Verschieben</span><h2>${escapeHtml(item.name)}</h2></div><button type="button" class="close">×</button></div><label>Ziel<select name="target">${destinations.map(d=>`<option value="${d.id}">${escapeHtml(d.name)}</option>`).join("")}</select></label><button class="full-button">Verschieben</button></form>`);
    layer.classList.add("high"); $(".close",layer).addEventListener("click",()=>layer.remove()); $("form",layer).addEventListener("submit",event=>{event.preventDefault();const targetId=event.currentTarget.elements.target.value;const target=targetId==="body"?character.inventory:character.storages.find(s=>s.id===targetId)?.items;if(!target)return;const idx=source.findIndex(x=>x.id===itemId);const moved=source.splice(idx,1)[0];if(targetId!=="body")moved.equipped=false;target.push(moved);persist();layer.remove();previous.remove();render();locationSheet(fromId)});
  };
  const storageMoneySheet = (storage,direction,previous) => {
    const character=active(); const sourceMoney=direction==="in"?character.balance:storage.money; const layer=modal(`<form class="sheet form"><div class="handle"></div><div class="heading"><div><span class="eyebrow">${escapeHtml(storage.name)}</span><h2>${direction==="in"?"Geld einlagern":"Geld entnehmen"}</h2></div><button type="button" class="close">×</button></div>${moneyFields()}<p class="conversion hidden"></p><p class="error hidden">Dafür ist nicht genug Geld verfügbar.</p><button class="full-button" disabled>${direction==="in"?"In das Lager legen":"In den Geldbeutel nehmen"}</button></form>`);
    layer.classList.add("high");const form=$("form",layer),submit=$(".full-button",form),conversion=$(".conversion",form),error=$(".error",form);const check=()=>{const value=amountFromForm(form);const enough=value<=sourceMoney;conversion.classList.toggle("hidden",!value);conversion.textContent=value?`Entspricht ${label(value)}`:"";error.classList.toggle("hidden",enough);submit.disabled=!value||!enough};$$('input[type="number"]',form).forEach(input=>input.addEventListener("input",check));$(".close",layer).addEventListener("click",()=>layer.remove());form.addEventListener("submit",event=>{event.preventDefault();const value=amountFromForm(form);if(!value||value>sourceMoney)return;if(direction==="in"){character.balance-=value;storage.money+=value}else{storage.money-=value;character.balance+=value}persist();layer.remove();previous.remove();render();locationSheet(storage.id)});
  };

  const backupCharacter = () => {
    const character=active(); const payload={format:"altdorf-geldbeutel-charakter",version:8,createdAt:new Date().toISOString(),character:{name:character.name,career:character.career,balance:character.balance,transactions:character.transactions,inventory:character.inventory,storages:character.storages,sheet:character.sheet}}; const safeName=character.name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase()||"charakter"; const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.href=url; link.download=`${safeName}-charakter.json`; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const restoreCharacter = async (event,layer) => {
    const file=event.target.files?.[0]; if(!file)return;
    try{
      const payload=JSON.parse(await file.text()); const source=payload?.character;
      if(payload?.format!=="altdorf-geldbeutel-charakter"||![1,2,3,4,5,6,7,8].includes(payload?.version)||!source)throw new Error("Unbekanntes Sicherungsformat");
      if(typeof source.name!=="string"||!source.name.trim()||source.name.length>80)throw new Error("Ungültiger Charaktername"); if(typeof source.career!=="string"||source.career.length>100)throw new Error("Ungültige Laufbahn"); if(!Number.isSafeInteger(Number(source.balance))||Number(source.balance)<0)throw new Error("Ungültiger Münzstand"); if(!Array.isArray(source.transactions)||source.transactions.length>10000)throw new Error("Ungültiges Münzbuch");
      const transactions=source.transactions.map(item=>{if(!item||!["income","expense"].includes(item.type)||!Number.isSafeInteger(Number(item.amount))||Number(item.amount)<=0)throw new Error("Fehlerhafte Buchung");const createdAt=new Date(item.createdAt);if(Number.isNaN(createdAt.getTime()))throw new Error("Fehlerhaftes Datum");return{id:id(),type:item.type,amount:Number(item.amount),note:String(item.note||"Buchung").slice(0,300),createdAt:createdAt.toISOString()}});
      const restored=ensureCharacter({id:id(),name:source.name.trim(),career:source.career.trim()||"Abenteurer",balance:Number(source.balance),transactions,inventory:payload.version>=2&&Array.isArray(source.inventory)?source.inventory:[],storages:payload.version>=2&&Array.isArray(source.storages)?source.storages:[],sheet:payload.version>=3?source.sheet:defaultSheet()});
      restored.inventory=restored.inventory.map(item=>({...item,id:id()})); restored.storages=restored.storages.map(storage=>({...storage,id:id(),items:storage.items.map(item=>({...item,id:id(),equipped:false}))})); restored.sheet.skills=restored.sheet.skills.map(skill=>({...skill,id:id()}));restored.sheet.spells=restored.sheet.spells.map(spell=>({...spell,id:id()})); state.characters.push(restored);state.activeId=restored.id;persist();layer.remove();render();alert(`${restored.name} wurde aus der Sicherung wiederhergestellt.`);
    }catch(error){alert(`Die Sicherung konnte nicht gelesen werden: ${error.message}`)}finally{event.target.value=""}
  };

  const undo = transactionId => {const character=active();const transaction=character.transactions.find(item=>item.id===transactionId);if(!transaction)return;const next=character.balance+(transaction.type==="income"?-transaction.amount:transaction.amount);if(next<0){alert("Diese Einnahme kann nicht rückgängig gemacht werden, solange das Geld bereits ausgegeben ist.");return}character.balance=next;character.transactions=character.transactions.filter(item=>item.id!==transactionId);render()};
  const bind=()=>{$("#open-characters").addEventListener("click",characterPicker);$("#open-character-sheet").addEventListener("click",()=>characterSheet("profile"));$("#open-storage").addEventListener("click",storageSheet);$$('[data-transaction]').forEach(button=>button.addEventListener("click",()=>transactionSheet(button.dataset.transaction)))};

  mount();
  if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();
