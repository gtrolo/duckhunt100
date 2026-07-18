const BEAR_COUNT = 100;
const ADMIN_STORAGE_KEY = "duckhunt100-admin-pin-v1";
const PUBLIC_URL = "https://duckhunt100.vercel.app";

const duckNames = [
  "Bram Badmeester",
  "Kayleigh Kwakqueen",
  "Rubberen Rolo",
  "Cintha Snavelstorm",
  "Claudia Cabana",
  "Dennis Diesel",
  "Dorith Drijver",
  "Suus Snatercoach",
  "Dustin Duikbril",
  "Esther Eendurance",
  "Frans Floatbaas",
  "Joy Jacuzzi",
  "Maarten Meeuwschrik",
  "Martin Modderplons",
  "Nouelle Natnek",
  "Priscilla Pooldiva",
  "Rachel Rietradar",
  "Ray Relschopper",
  "Richard Reddingsboei",
  "Stephan Sloopduck",
  "Tim Tostiduck",
  "Veronica Vinylvleugel",
  "Steffie Strandwacht",
  "Kelly Kwekservice",
  "Nijlpaardbadje Nicole",
  "Isha IJsklont",
  "Roy Rietrakker",
  "Dee Drijfveer",
  "Isabella Inflatable",
  "Jacinta Jetstream",
  "Denise Duikplank",
  "Barry Bilnaad",
  "Willy Wipkip",
  "Sjef Snavel",
  "Pietje Plonsbroek",
  "Ria Romance",
  "Tonnie Waterbed",
  "Kees Casanova",
  "Annie Afterparty",
  "Harrie Handdoek",
  "Miep Boven",
  "Luchtbedliefde Lowie",
  "Frits Frietvet",
  "Truus Terras",
  "Buitendouche Bennie",
  "Sjaan Sjans",
  "Gerrie Grotebek",
  "Liesje Limonade",
  "Koos Koelbox",
  "Rinus Romeo",
  "Toos Tease",
  "Adje Afterdark",
  "Marietje Maxisjans",
  "Joost Jatter",
  "Nellie Natpak",
  "Dirk Deluxe",
  "Puck Pretpaal",
  "Sjors Scharrel",
  "Mats Moves",
  "Lola Lingerie",
  "Raffie Romance",
  "Bibi Booty",
  "Gijs Gigolo",
  "Noor Natkrant",
  "Fenna Flirt",
  "Sem Smoesjes",
  "Bo Bootycall",
  "Jules Jetduck",
  "HornyDuck 69",
  "Max Modderspetter",
  "Luna Ligbed",
  "Daan Ducksnack",
  "Mila Mojito",
  "Saar Schuimkop",
  "Noud Nekkletser",
  "Fleur Floatie",
  "Lex Luchtmatras",
  "Morris Magneet",
  "Pip Pillowtalk",
  "Kiki Kamasutra",
  "Teun Tango",
  "Lotte Limoncello",
  "Boris Bilspier",
  "Jip Jatter",
  "Nina Nachtduik",
  "Sam Scharrel",
  "Eva Eendje",
  "Moos Masseur",
  "Isa IJsbreker",
  "Ravi Romantiek",
  "Nora Naaktstrand",
  "Guus Glimlach",
  "Mick Matras",
  "Lieke Luchtbedlek",
  "Tijn Tongen",
  "Floor Frietflirt",
  "Olivier Opblaasboot",
  "Sofie Sproeikop",
  "Cas Cabanacrash",
  "Vera Vijvervandaal"
];

const duckCrimes = [
  "jat kruimels alsof het gemeentebelasting is en kijkt er nog trots bij ook",
  "roept 'kwak' alsof heel de straat daarom gevraagd heeft",
  "loopt door Bram en Kayleigh hun nieuwe huis alsof hij de huur betaalt",
  "heeft een alibi van nat karton, dus gewoon waardeloos",
  "doet undercover als decoratief geel probleem en denkt dat niemand kijkt",
  "claimt dat de badkuip zijn priveterrein is, belachelijk gedoe",
  "wijst met z'n snavel naar niks en zegt dan: 'ja, zoek het uit gast'",
  "laat pootafdrukken achter en noemt dat interieuradvies, malloot",
  "neemt brood aan zonder dankjewel, asociaal waterwild",
  "zit in je eendje te wachten tot gij compleet afhaakt"
];

const duckHideouts = [
  "achter het gordijn met een smoel van 'wa nou?'",
  "naast iets geels, want camouflage voor beginners, gast",
  "in de badkamer alsof daar z'n eigen clubhuis zit",
  "bij de planten, waar hij doet alsof hij bij het housewarmingcadeau hoort, tuurlijk",
  "op een plankje dat Bram net recht heeft gehangen, dus meteen respectloos",
  "vlakbij water, pils, fris, of iets dat zichzelf nat genoeg vindt",
  "in een hoekje waar Kayleigh net nog zei: 'daar ligt vast niks', nou mooi wel dus",
  "tussen verhuisdozen die later allemaal bewijsstuk worden, hoppa",
  "bij de snackvoorraad, met kruimels op zijn reputatie en saus op zijn snavel",
  "op een plek die alleen logisch is voor iemand met zwemvliezen en nul opvoeding"
];

const duckInsults = [
  "Kortom: klein van stuk, grote bek, natte voeten.",
  "Waarschuwing: kijkt alsof gij hier de rare zijt.",
  "Niet voeren. Gewoon niet. Dan krijg je praatjes.",
  "Heeft nul spijt en twee voeten die klinken als slecht nieuws op laminaat.",
  "Niet gevaarlijk, wel irritant op dorpsplein-niveau.",
  "Wanneer gevonden: rustig blijven, nie praten met dit waterwild.",
  "Deze duck is geen fase. Dit is een levenskeuze met veren en overlast.",
  "Maakt van iedere zoektocht een natte chaos en noemt dat 'effe regelen'.",
  "Kan schattig lijken. Trap er nie in, gast.",
  "Heeft het charisma van een badeend en de moraal van een fout geparkeerde verhuisbus."
];

const defaultNames = Array.from({ length: BEAR_COUNT }, (_, index) => duckNames[index]);

const defaultStories = Array.from({ length: BEAR_COUNT }, (_, index) => {
  const title = duckNames[index];
  const crime = duckCrimes[index % duckCrimes.length];
  const hideout = duckHideouts[Math.floor(index / 2) % duckHideouts.length];
  const insult = duckInsults[Math.floor(index / 3) % duckInsults.length];
  return `Serie-eend #${String(index + 1).padStart(3, "0")}: ${title} ${crime}. Meestal verstopt ${hideout}. ${insult}`;
});

const quips = [
  "De eenden doen dom. De tweeling mag ze aanwijzen, volwassenen mogen bukken.",
  "Er is vooruitgang. Niet veel, maar genoeg om de kids stoer over te laten doen.",
  "Dit begint op recherchewerk te lijken. Lekker dan, housewarming veranderd in kinderspeurtocht.",
  "Meer dan de helft gepakt. De ducks krijgen praatjes terug in hun snavel.",
  "Bijna klaar. De laatste eenden doen ineens heel stil. Laf.",
  "100/100. Duckhunt klaar. Housewarming gered. Houdoe, klaar, wegwezen."
];

const heroQuotes = [
  "Bram dacht: nieuw huis, rust. De eenden dachten: mooi niet, gast.",
  "Kayleigh had de boel net gezellig. Toen kwamen jullie kutvrienden met 100 eenden. Klasse.",
  "Verhuizen naar Brabant is stap een. Honderd ducks uit je tuin vissen is blijkbaar stap twee.",
  "Geen housewarming zonder lichte paniek, nat plastic en vrienden die veel te trots op zichzelf zijn.",
  "Deze activiteit is bedacht door mensen die zeggen: 'we houden het klein' en daarna 100 eenden meenemen.",
  "Bram en Kayleigh wilden een warm welkom. Ze kregen waterwild met een grote bek.",
  "De tweeling zoekt. De volwassenen bukken. De eenden lachen. Brabant leeft.",
  "Wie een eend vindt, krijgt eeuwige roem. Of in ieder geval vijf minuten gezeik in de groepsapp.",
  "Nieuwe sleutel, nieuw adres, oude vrienden, slechte ideeen. Mooi man.",
  "Als dit liefde is, hebben Bram en Kayleigh echt vervelende vrienden.",
  "Brabant: waar ge welkom zijt, tenzij ge een eend zonder kwakbewijs zijt.",
  "Niet voeren. Niet knuffelen. Gewoon vinden en fotograferen, jonge.",
  "Deze duckhunt is kids-proof, maar duidelijk niet volwassenen-proof.",
  "De eenden zijn genummerd. De vrienden helaas niet, anders konden we die ook afvinken.",
  "Bram hangt een plank recht. Kayleigh maakt het gezellig. De rest verstopt eenden. Topteam.",
  "Welkom in Brabant: eerst worstenbrood, dan waterwild-arrestaties.",
  "100 eenden. 2 kids. 0 normale verklaringen.",
  "De buurt weet nog van niks. Houden zo.",
  "Elke gevonden duck is een kleine overwinning op jullie sociale kring.",
  "Geen foto? Dan is het geen vondst maar gewoon Brabants gelul."
];

const tokenThemes = [
  ["#ffdf43", "#ff8db7"],
  ["#56f1ff", "#a5e85c"],
  ["#ff9f68", "#ffe8a9"],
  ["#89d5ff", "#ffdf43"],
  ["#bca7ff", "#56f1ff"],
  ["#a5e85c", "#ff8db7"],
  ["#ffc66b", "#14b8c4"],
  ["#ff6b52", "#ffe8a9"]
];

const grid = document.querySelector("#bearGrid");
const template = document.querySelector("#bearCardTemplate");
const progressBig = document.querySelector("#progressBig");
const meterFill = document.querySelector("#meterFill");
const statusLine = document.querySelector("#statusLine");
const unlockLine = document.querySelector("#unlockLine");
const heroQuote = document.querySelector("#heroQuote");
const searchInput = document.querySelector("#searchInput");
const panicButton = document.querySelector("#panicButton");
const modeBanner = document.querySelector("#modeBanner");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const filterLinks = [...document.querySelectorAll("[data-filter-link]")];
const dialog = document.querySelector("#bearDialog");
const dialogImage = document.querySelector("#dialogImage");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogText = document.querySelector("#dialogText");
const closeDialog = document.querySelector(".close");
const shareDialog = document.querySelector("#shareDialog");
const shareTitle = document.querySelector("#shareTitle");
const shareIntro = document.querySelector("#shareIntro");
const shareText = document.querySelector("#shareText");
const copyShareButton = document.querySelector("#copyShareButton");
const whatsappShareLink = document.querySelector("#whatsappShareLink");
const closeShareDialog = document.querySelector(".share-close");
const proofDialog = document.querySelector("#proofDialog");
const proofDialogTitle = document.querySelector("#proofDialogTitle");
const proofDialogText = document.querySelector("#proofDialogText");
const proofDialogInput = document.querySelector("#proofDialogInput");
const closeProofDialog = document.querySelector(".proof-close");

let activeFilter = "all";
let state = createFreshState();
let saveTimer;
let isSaving = false;
let pendingProofBearId = 0;
const adminPin = getAdminPin();
let isAdmin = false;

function isLocalHost() {
  return window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
}

function createFreshState() {
  return Array.from({ length: BEAR_COUNT }, (_, index) => ({
    id: index + 1,
    found: false,
    name: defaultNames[index],
    story: defaultStories[index],
    note: ""
  }));
}

function setRandomHeroQuote() {
  if (!heroQuote) return;
  heroQuote.textContent = heroQuotes[Math.floor(Math.random() * heroQuotes.length)];
}

function getAdminPin() {
  const params = new URLSearchParams(window.location.search);
  const urlPin = params.get("beheer") || params.get("admin");
  if (urlPin) {
    localStorage.setItem(ADMIN_STORAGE_KEY, urlPin);
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    return urlPin;
  }

  return localStorage.getItem(ADMIN_STORAGE_KEY) || "";
}

async function loadSharedState() {
  try {
    const response = await fetch(`/api/state?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("API state unavailable");
    const sharedState = await response.json();
    state = mergeSharedState(sharedState);
  } catch (error) {
    const response = await fetch(`/data/state.json?t=${Date.now()}`, { cache: "no-store" });
    const sharedState = await response.json();
    state = mergeSharedState(sharedState);
  }

  render();
}

async function verifyAdminAccess() {
  if (!adminPin) return;
  setModeBanner("Beheerlink gevonden. Effe checken of gij hier de baas zijt, of gewoon een eend met wifi.", "saving");

  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminPin, verifyOnly: true })
    });

    if (!response.ok) throw new Error("beheerlink niet geldig");
    isAdmin = true;
    setModeBanner("Beheerstand. Gij zijt admin. Mooi. Niet naast uw schoenen gaan lopen.", "success");
  } catch (error) {
    if (isLocalHost()) {
      isAdmin = true;
      setModeBanner("Lokale beheerstand. Productie controleert dit met de geheime server-PIN.", "saving");
      return;
    }

    isAdmin = false;
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setModeBanner("Publieke jachtstand. Deze beheerlink is niks. Kwakbewijs indienen mag wel, dus doe nuttig.", "warning");
  }
}

function mergeSharedState(sharedState) {
  const sharedBears = Array.isArray(sharedState?.bears) ? sharedState.bears : [];
  return createFreshState().map((bear) => {
    const sharedBear = sharedBears.find((item) => Number(item.id) === bear.id);
    if (!sharedBear) return bear;
    return {
      ...bear,
      found: Boolean(sharedBear.found),
      name: typeof sharedBear.name === "string" && sharedBear.name.trim() ? sharedBear.name : bear.name,
      note: typeof sharedBear.note === "string" ? sharedBear.note : "",
      proofImage: typeof sharedBear.proofImage === "string" ? sharedBear.proofImage : ""
    };
  });
}

function imagePath(id) {
  const realImageId = 2582 + ((id - 1) % 10);
  return `./assets/real-ducks/img_${realImageId}.jpg`;
}

function initialsForName(name) {
  return name
    .replace(/^Duck\s+#\d+\s+-\s+/i, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}


function render() {
  grid.innerHTML = "";

  state.forEach((bear) => {
    const card = template.content.firstElementChild.cloneNode(true);
    const imageButton = card.querySelector(".image-button");
    const duckToken = card.querySelector(".duck-token");
    const duckInitials = card.querySelector(".duck-initials");
    const badge = card.querySelector(".badge");
    const checkbox = card.querySelector("input[type='checkbox']");
    const nameInput = card.querySelector(".name-input");
    const storyText = card.querySelector(".story-text");
    const noteInput = card.querySelector(".note-input");
    const noteField = card.querySelector(".note-field");
    const proofBlock = card.querySelector(".proof-block");
    const proofImageButton = card.querySelector(".proof-image-button");
    const proofImage = card.querySelector(".proof-image");
    const proofTarget = card.querySelector(".proof-target");
    const proofStamp = card.querySelector(".proof-stamp");
    const proofEmpty = card.querySelector(".proof-empty");
    const proofUpload = card.querySelector(".proof-upload");
    const proofInput = card.querySelector(".proof-input");

    card.id = bearAnchor(bear.id);
    imageButton.setAttribute("aria-label", `Bekijk eend ${bear.id}: ${bear.name}`);
    const tokenTheme = tokenThemes[(bear.id - 1) % tokenThemes.length];
    duckToken.style.setProperty("--token-a", tokenTheme[0]);
    duckToken.style.setProperty("--token-b", tokenTheme[1]);
    duckToken.style.setProperty("--token-rotate", `${((bear.id % 7) - 3) * 2}deg`);
    duckInitials.textContent = initialsForName(bear.name);
    badge.textContent = `#${String(bear.id).padStart(3, "0")}`;
    checkbox.checked = bear.found;
    checkbox.disabled = false;
    nameInput.value = bear.name;
    autoGrow(nameInput);
    nameInput.readOnly = !isAdmin;
    storyText.textContent = bear.story;
    noteInput.value = bear.note;
    autoGrow(noteInput);
    noteInput.readOnly = !isAdmin;
    card.dataset.id = bear.id;
    card.classList.toggle("is-found", bear.found);
    card.classList.toggle("is-view-only", !isAdmin);
    proofBlock.hidden = !bear.found;
    noteField.hidden = !bear.found;
    proofImageButton.hidden = !bear.proofImage;
    proofEmpty.hidden = Boolean(bear.proofImage);
    proofUpload.hidden = false;
    proofImage.src = bear.proofImage || "";
    proofImage.alt = bear.proofImage ? `Kwakbewijs voor ${bear.name}` : "";
    proofTarget.textContent = bear.proofImage
      ? `Dit kwakbewijs hoort bij #${String(bear.id).padStart(3, "0")} - ${bear.name}. Nummer onderop moet zichtbaar zijn.`
      : `Kwakbewijs voor #${String(bear.id).padStart(3, "0")} - ${bear.name}: fotografeer het nummer onderop.`;
    proofStamp.textContent = `Onderop #${String(bear.id).padStart(3, "0")}`;

    checkbox.addEventListener("change", () => {
      const wasFound = bear.found;
      if (wasFound && !checkbox.checked) {
        checkbox.checked = true;
        alert("Deze eend is al vrijgelaten. Terugduwen is zwak gedrag, jonge.");
        return;
      }

      if (!wasFound && checkbox.checked) {
        checkbox.checked = false;
        openProofDialog(bear);
        return;
      }
    });

    nameInput.addEventListener("input", () => {
      if (!isAdmin) return;
      updateBear(bear.id, { name: nameInput.value });
      duckInitials.textContent = initialsForName(nameInput.value);
      autoGrow(nameInput);
      applyFilters();
      queueSave();
    });

    noteInput.addEventListener("input", () => {
      if (!isAdmin) return;
      updateBear(bear.id, { note: noteInput.value });
      autoGrow(noteInput);
      applyFilters();
      queueSave();
    });

    nameInput.addEventListener("focus", () => {
      if (!isAdmin) denyBearTheft();
    });

    noteInput.addEventListener("focus", () => {
      if (!isAdmin) denyBearTheft();
    });

    proofInput.addEventListener("change", async () => {
      const file = proofInput.files?.[0];
      if (!file) return;

      try {
        setModeBanner("Kwakbewijs wordt ingestuurd. Als het onderkantnummer niet op de foto staat: gezeik gegarandeerd.", "saving");
        const proofDataUrl = await resizeImage(file);
        const wasFound = bear.found;
        const savedBear = await saveProofSubmission(bear.id, proofDataUrl);
        render();
        if (!wasFound) {
          showFoundSharePopup(savedBear);
        }
      } catch (error) {
        rejectBadPhoto(error.message);
      } finally {
        proofInput.value = "";
      }
    });

    proofImageButton.addEventListener("click", () => {
      if (!bear.proofImage) return;
      const currentBear = state.find((item) => item.id === bear.id) || bear;
      dialogImage.src = currentBear.proofImage;
      dialogImage.alt = `Kwakbewijs voor ${currentBear.name}`;
      dialogTitle.textContent = `Kwakbewijs #${String(bear.id).padStart(3, "0")} ${currentBear.name}`;
      dialogText.textContent = currentBear.note || "Kwakbewijs ingediend. De vijverrechtbank kijkt streng. Terecht ook.";
      dialog.showModal();
    });

    imageButton.addEventListener("click", () => {
      const currentBear = state.find((item) => item.id === bear.id) || bear;
      openBearDetail(currentBear);
    });

    grid.append(card);
  });

  applyFilters();
  updateProgress();
  markLinkedBear();
}

function updateBear(id, patch) {
  state = state.map((bear) => (bear.id === id ? { ...bear, ...patch } : bear));
}

function setModeBanner(text, kind = "info") {
  modeBanner.textContent = text;
  modeBanner.dataset.kind = kind;
}

function denyBearTheft() {
  const message = "Nee. Afblijven. Dossierredactie is voor Bram en Kayleigh hun eendenadministratie. Gij moogt zoeken, nie de geschiedenis verbouwen.";
  setModeBanner(message, "warning");
  alert(message);
}

function rejectBadPhoto(reason) {
  const message = `${publicUploadError(reason)} Maak een echte foto van de verdachte eend met het nummer onderop zichtbaar. Selfies en plafonds tellen nie, kunstenaar.`;
  setModeBanner(message, "warning");
  alert(message);
}

function publicUploadError(reason) {
  if (!reason) return "Deze foto kwam niet door de eendenbalie.";
  if (/github api|docs\.github|branch .*not found|create-or-update-file/i.test(reason)) {
    return "De online eendenadministratie had even kuren. Probeer nog eens; als ie blijft zeiken, geef Rolo een por.";
  }
  return reason;
}

function openProofDialog(bear) {
  pendingProofBearId = bear.id;
  setModeBanner(`Kwakbewijs nodig voor #${String(bear.id).padStart(3, "0")}. Foto van het nummer onderop, dan pas gevonden. Simpel zat.`, "saving");
  proofDialogTitle.textContent = `Kwakbewijs voor #${String(bear.id).padStart(3, "0")} ${bear.name}`;
  proofDialogText.textContent = `Draai de eend om en maak een foto waarop nummer ${String(bear.id).padStart(3, "0")} onderop duidelijk zichtbaar is. Geen nummer, geen worstenbrood. Klaar.`;
  proofDialogInput.value = "";
  proofDialog.showModal();
}

async function finishFoundWithProof(file) {
  const bear = state.find((item) => item.id === pendingProofBearId);
  if (!bear || !file) return;

  try {
    setModeBanner("Kwakbewijs wordt verwerkt. Hopelijk staat dat onderkantnummer erop, jonge.", "saving");
    const proofDataUrl = await resizeImage(file);
    const savedBear = await saveProofSubmission(bear.id, proofDataUrl);
    proofDialog.close();
    pendingProofBearId = 0;
    render();
    showFoundSharePopup(savedBear);
  } catch (error) {
    rejectBadPhoto(error.message);
  }
}

function bearAnchor(id) {
  return `duck-${String(id).padStart(3, "0")}`;
}

function bearUrl(id) {
  return `${PUBLIC_URL}/#${bearAnchor(id)}`;
}

function buildShareText(bear) {
  return [
    "Update vanaf de housewarming van Bram en Kayleigh in Brabant: weer een eend gepakt. Mooi. Door.",
    "",
    `Eend #${String(bear.id).padStart(3, "0")}: ${bear.name}`,
    `Dossier: ${bear.story}`,
    bear.note ? `Vindplaatsnotitie / kwakrapport: ${bear.note}` : "",
    "",
    "Laatste Brabantse kwakstand hier:",
    bearUrl(bear.id)
  ].filter(Boolean).join("\n");
}

function showFoundSharePopup(bear) {
  if (!bear) return;
  const text = buildShareText(bear);
  shareTitle.textContent = `#${String(bear.id).padStart(3, "0")} ${bear.name} is gevonden`;
  shareIntro.textContent = "Kopieer naar WhatsApp voordat iemand anders stoer gaat doen met jouw vondst.";
  shareText.value = text;
  whatsappShareLink.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
  shareDialog.showModal();
  shareText.focus();
  shareText.select();
}

function openBearDetail(bear, preferProof = false) {
  const imageSource = preferProof && bear.proofImage ? bear.proofImage : imagePath(bear.id);
  dialogImage.src = imageSource;
  dialogImage.alt = `Detail van ${bear.name}`;
  dialogTitle.textContent = `#${String(bear.id).padStart(3, "0")} ${bear.name}`;
  dialogText.textContent = [
    bear.found ? "Status: gevonden. Beetje beledigd, jammer dan." : "Status: nog voortvluchtig met natte voeten en praatjes.",
    bear.story,
    bear.note ? `Vindplaatsnotitie / kwakrapport: ${bear.note}` : "",
    `Directe link: ${bearUrl(bear.id)}`
  ].filter(Boolean).join(" ");
  dialog.showModal();
}

function markLinkedBear() {
  document.querySelectorAll(".bear-card.is-linked").forEach((card) => card.classList.remove("is-linked"));
  const id = idFromHash();
  if (!id) return;
  document.querySelector(`#${bearAnchor(id)}`)?.classList.add("is-linked");
}

function openLinkedBear() {
  const id = idFromHash();
  if (!id) return;
  const bear = state.find((item) => item.id === id);
  const card = document.querySelector(`#${bearAnchor(id)}`);
  if (!bear || !card) return;
  card.scrollIntoView({ behavior: "smooth", block: "start" });
  openBearDetail(bear, bear.found);
}

function idFromHash() {
  const match = window.location.hash.match(/^#duck-(\d{3})$/);
  if (!match) return 0;
  const id = Number(match[1]);
  return id >= 1 && id <= BEAR_COUNT ? id : 0;
}

function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveSharedState, 500);
}

async function saveSharedState() {
  if (!isAdmin || isSaving) return;
  isSaving = true;
  setModeBanner("Beheerstand. Opslaan naar de eendenadministratie. Even normaal doen.", "saving");

  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminPin,
        state: {
          bears: state.map(({ id, found, name, note, proofImage, proofDataUrl }) => ({
            id,
            found,
            name,
            note,
            proofImage,
            proofDataUrl
          }))
        }
      })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Opslaan mislukt.");
    state = mergeSharedState(body);
    render();
    setModeBanner("Beheerstand. Eendenadministratie bijgewerkt. Lekker bezig, niet overdrijven.", "success");
  } catch (error) {
    setModeBanner(error.message, "warning");
  } finally {
    isSaving = false;
  }
}

async function saveProofSubmission(id, proofDataUrl) {
  const localProofBear = state.find((item) => item.id === id);
  if (!localProofBear) throw new Error("Deze eend bestaat nie. Knap, maar onbruikbaar.");

  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission: {
          id,
          proofDataUrl
        }
      })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Bewijs indienen mislukt.");
    state = mergeSharedState(body);
    setModeBanner("Kwakbewijs geaccepteerd. Nummer onderop gezien? Dan doorpakken.", "success");
    return state.find((item) => item.id === id);
  } catch (error) {
    if (!isLocalHost()) throw error;
    updateBear(id, {
      found: true,
      proofImage: proofDataUrl
    });
    setModeBanner("Lokale teststand. Foto geaccepteerd in deze browser; live opslaan werkt via Vercel.", "success");
    return state.find((item) => item.id === id);
  }
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Dat bestand is geen foto."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 1200;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.onerror = () => reject(new Error("de foto kon niet gelezen worden"));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error("de foto kon niet geladen worden"));
    reader.readAsDataURL(file);
  });
}

function autoGrow(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function updateProgress() {
  const found = state.filter((bear) => bear.found).length;
  const remaining = BEAR_COUNT - found;
  const percent = Math.round((found / BEAR_COUNT) * 100);

  progressBig.textContent = found;
  meterFill.style.width = `${percent}%`;

  if (found === BEAR_COUNT) {
    statusLine.textContent = quips[5];
    unlockLine.textContent = "Duckhunt klaar. Bram en Kayleigh mogen wonen. Tweeling blij. Niemand zeuren.";
  } else if (found >= 90) {
    statusLine.textContent = quips[4];
    unlockLine.textContent = `Nog ${remaining}. Zelfs het broodrooster kijkt verdacht. Belachelijk huisfeest.`;
  } else if (found >= 50) {
    statusLine.textContent = quips[3];
    unlockLine.textContent = `Nog ${remaining}. Die eenden worden stil. Mooi, eindelijk.`;
  } else if (found >= 20) {
    statusLine.textContent = quips[2];
    unlockLine.textContent = `Nog ${remaining}. Waarschijnlijk achter iets dat Kayleigh net netjes had gezet. Laat de kids maar wijzen.`;
  } else if (found > 0) {
    statusLine.textContent = quips[1];
    unlockLine.textContent = `Nog ${remaining} te gaan. Doorzoeken, nie lullen.`;
  } else {
    statusLine.textContent = quips[0];
    unlockLine.textContent = "Nog 100 te gaan. Bram en Kayleigh wonen hier net; de tweeling heeft werk te doen.";
  }
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const numberMatch = query.match(/^#?0*(\d{1,3})$/);
  const directHitId = numberMatch ? Number(numberMatch[1]) : 0;
  const hasDirectHit = directHitId >= 1 && directHitId <= BEAR_COUNT;

  [...grid.children].forEach((card) => {
    const bear = state.find((item) => item.id === Number(card.dataset.id));
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "found" && bear.found) ||
      (activeFilter === "missing" && !bear.found);
    const haystack = `${bear.id} ${bear.name} ${bear.story} ${bear.note}`.toLowerCase();
    const isDirectHit = hasDirectHit && bear.id === directHitId;
    const matchesSearch = !query || isDirectHit || haystack.includes(query);
    card.classList.toggle("is-hidden", !(isDirectHit || (matchesFilter && matchesSearch)));
    card.classList.toggle("is-found", bear.found);
    card.classList.toggle("is-direct-hit", isDirectHit);
  });
}

function setBearFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === filter));
  applyFilters();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setBearFilter(button.dataset.filter);
  });
});

filterLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setBearFilter(link.dataset.filterLink);
  });
});

searchInput.addEventListener("input", applyFilters);

panicButton.addEventListener("click", () => {
  const missing = state.filter((bear) => !bear.found).map((bear) => `#${bear.id}`);
  alert(
    missing.length
      ? `Nog zoek: ${missing.join(", ")}. Kom op gast, dit is geen kijkmiddag.`
      : "Alles gevonden. Klaar. Ge moogt weer normaal doen."
  );
});

closeDialog.addEventListener("click", () => dialog.close());
closeShareDialog.addEventListener("click", () => shareDialog.close());
closeProofDialog.addEventListener("click", () => {
  pendingProofBearId = 0;
  proofDialog.close();
});

proofDialogInput.addEventListener("change", () => {
  const file = proofDialogInput.files?.[0];
  if (!file) return;
  finishFoundWithProof(file);
});

copyShareButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(shareText.value);
  copyShareButton.textContent = "Gekopieerd";
  setTimeout(() => {
    copyShareButton.textContent = "Kopieer tekst";
  }, 1400);
});

window.addEventListener("hashchange", openLinkedBear);

setModeBanner(
  adminPin
    ? "Beheerlink gevonden. Effe controleren of gij hier iets te vertellen hebt..."
    : "Publieke jachtstand. Iedereen mag een eend vinden, ook de tweeling. Alleen met kwakbewijs. Geen foto, geen praatjes."
);
setRandomHeroQuote();
render();
Promise.all([loadSharedState(), verifyAdminAccess()]).then(() => {
  render();
  openLinkedBear();
});
