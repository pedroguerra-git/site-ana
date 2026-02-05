async function loadConfigSmart(){
  const candidates = ["./site.config.json","../site.config.json","../../site.config.json"];
  for (const p of candidates){
    try{
      const res = await fetch(p, { cache: "no-store" });
      if(res.ok){
        const cfg = await res.json();
        // base directory of the config file (important for nested pages)
        const abs = new URL(p, window.location.href);
        const baseUrl = abs.href.replace(/site\.config\.json(?:\?.*)?$/, "");
        return { cfg, baseUrl };
      }
    }catch(e){}
  }
  throw new Error("Não foi possível localizar site.config.json.");
}

function resolveFromBase(baseUrl, path){
  if(!path) return null;
  // already absolute
  if(/^https?:\/\//i.test(path)) return path;
  try{ return new URL(path, baseUrl).href; }catch(e){ return path; }
}

function isPlaceholder(value){
  if(value === undefined || value === null) return true;
  const v = String(value).trim().toLowerCase();
  return v === "" || v === "preencher" || v === "a definir";
}

function setTextOrHide(el, value){
  if(!el) return false;
  if(isPlaceholder(value)){
    el.textContent = "";
    const container = el.closest(".js-hide-if-empty");
    if(container) container.classList.add("hide");
    return false;
  }
  el.textContent = value;
  return true;
}

function makeWhatsAppLink(numberE164, msg){
  const num = (numberE164 || "").replace("+","").replace(/\s/g,"");
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
}

function setupMobileNav(){
  const btn = document.getElementById("navBtn");
  const nav = document.getElementById("nav");
  if(!btn || !nav) return;
  btn.addEventListener("click", ()=>{
    nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click", ()=>nav.classList.remove("open"));
  });
}

(async ()=>{
  const { cfg, baseUrl } = await loadConfigSmart();
  window.__CFG = cfg;

  // Hero image: CSS fallback already exists. If config points to images, resolve safely.
  const hero = cfg.assets?.hero_webp || cfg.assets?.hero_jpg;
  const heroUrl = resolveFromBase(baseUrl, hero);
  if(heroUrl){
    document.documentElement.style.setProperty("--hero-url", `url("${heroUrl}")`);
  }

  // Logo
  const logoEl = document.getElementById("logo");
  if(logoEl && cfg.assets?.logo){
    const logoUrl = resolveFromBase(baseUrl, cfg.assets.logo);
    if(logoUrl) logoEl.src = logoUrl;
  }

  // CRM
  const crmEl = document.getElementById("crm");
  setTextOrHide(crmEl, cfg.clinic?.crm);

  // Endereço e horários
  const addrEl = document.getElementById("addr");
  const hasAddr = setTextOrHide(addrEl, cfg.clinic?.address_line);

  const hoursEl = document.getElementById("hours");
  const hasHours = setTextOrHide(hoursEl, cfg.clinic?.hours_line);

  const contactFallback = document.getElementById("contactFallback");
  if(contactFallback && !hasAddr && !hasHours){
    contactFallback.classList.remove("hide");
  }

  // WhatsApp
  const waNumber = cfg.clinic?.whatsapp_e164 || cfg.clinic?.phone_e164 || "+5561981573081";
  const waMsg = `Olá! Gostaria de informações sobre consulta com a ${cfg.clinic?.name || "Dra. Ana Paula Rocha"}.`;
  const waHref = makeWhatsAppLink(waNumber, waMsg);

  ["waTop","waHero","waFooter","waContact","waMid"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.href = waHref;
  });

  // Telefone
  const telEl = document.getElementById("tel");
  if(telEl){
    const tel = (cfg.clinic?.phone_e164 || "+5561981573081").replace(/\s/g,"");
    telEl.href = "tel:" + tel;
  }

  // Instagram (se não tiver, esconde)
  const igEl = document.getElementById("ig");
  if(igEl){
    const url = cfg.clinic?.instagram_url;
    if(url && url !== "PREENCHER"){
      igEl.href = url;
    } else {
      igEl.classList.add("hide");
    }
  }

  setupMobileNav();
})().catch(err=>{
  console.error(err);
});
