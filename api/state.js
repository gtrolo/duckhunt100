const fs = require("fs");
const path = require("path");

const DUCK_COUNT = 100;
const HINT_COUNT = 12;
const owner = cleanEnv("GITHUB_OWNER", "gtrolo");
const repo = cleanEnv("GITHUB_REPO", "duckhunt100");
const branch = cleanEnv("GITHUB_BRANCH", "main");
const statePath = "data/state.json";
const blobStatePath = "state/data.json";
const proofPassword = cleanPin(process.env.PROOF_PASSWORD || "bramkayleigh");
let blobSdkPromise;

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const state = await readState();
      res.status(200).json(state);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === "POST") {
    const body = await readBody(req);
    const adminPin = cleanPin(process.env.ADMIN_PIN || "rolo");

    if (body.submission) {
      try {
        const savedState = await writePublicSubmission(body.submission);
        res.status(200).json(savedState);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      return;
    }

    if (body.proofUpdate) {
      try {
        const savedState = await writeProofUpdate(body.proofUpdate);
        res.status(200).json(savedState);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      return;
    }

    if (body.hintUpdate) {
      try {
        const savedState = await writeHintUpdate(body.hintUpdate);
        res.status(200).json(savedState);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      return;
    }

    if (!adminPin || cleanPin(body.adminPin) !== adminPin) {
      res.status(403).json({
        error: "Nee, nee, nee, nee, nee. Waarschuwing: gij hebt geen eenden gevonden. Gewoon netjes zoeken, foto maken, kwakbewijs indienen. Niet de eendenadministratie van Bram en Kayleigh kapen, jonge."
      });
      return;
    }

    if (body.verifyOnly) {
      res.status(200).json({ ok: true });
      return;
    }

    try {
      const cleanState = sanitizeState(body.state);
      const savedState = await writeState(cleanState);
      res.status(200).json(savedState);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).json({ error: "Method not allowed" });
};

async function readState() {
  if (canUseBlob()) {
    const blobState = await readBlobState();
    if (blobState) return blobState;
  }

  if (process.env.GITHUB_TOKEN) {
    const file = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  }

  const localPath = path.join(process.cwd(), statePath);
  return JSON.parse(fs.readFileSync(localPath, "utf8"));
}

async function writeState(state) {
  if (!canUseBlob() && !process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN ontbreekt; gedeeld opslaan is nog niet gekoppeld.");
  }

  const stateWithProofs = { ...state, bears: [] };
  for (const bear of state.bears) {
    const nextBear = { ...bear };
    if (nextBear.proofDataUrl) {
      nextBear.proofImage = await writeStoredImage("proofs", "duck", nextBear.id, nextBear.proofDataUrl);
      delete nextBear.proofDataUrl;
    }
    stateWithProofs.bears.push(nextBear);
  }

  stateWithProofs.hints = [];
  for (const hint of state.hints || []) {
    const nextHint = { ...hint };
    if (nextHint.imageDataUrl) {
      nextHint.image = await writeStoredImage("hints", "hint", nextHint.id, nextHint.imageDataUrl);
      delete nextHint.imageDataUrl;
    }
    stateWithProofs.hints.push(nextHint);
  }

  const nextState = { ...stateWithProofs, updatedAt: new Date().toISOString() };
  if (canUseBlob()) {
    await writeBlobState(nextState);
    return nextState;
  }

  const current = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
  await githubRequest("PUT", `/repos/${owner}/${repo}/contents/${statePath}`, {
    message: "Update found duck state",
    content: Buffer.from(JSON.stringify(nextState, null, 2) + "\n").toString("base64"),
    sha: current.sha,
    branch
  });

  return nextState;
}

async function writePublicSubmission(submission) {
  const id = Number(submission?.id);
  if (!Number.isInteger(id) || id < 1 || id > DUCK_COUNT) {
    throw new Error("Deze eend bestaat nie in de administratie. Zeer verdacht, zunne.");
  }

  if (typeof submission.proofDataUrl !== "string" || !submission.proofDataUrl) {
    throw new Error("Geen foto, geen vondst. De Brabantse vijverrechtbank is streng.");
  }

  const currentState = await readState();
  const currentBears = Array.isArray(currentState.bears) ? currentState.bears : [];
  const targetBear = currentBears.find((item) => Number(item.id) === id) || {};
  if (targetBear.proofImage && cleanPin(submission.proofPassword) !== proofPassword) {
    throw new Error("Kwakbewijs aanpassen kan alleen met het wachtwoord.");
  }

  const proofImage = await writeProofImage(id, submission.proofDataUrl);
  const nextState = {
    updatedAt: new Date().toISOString(),
    bears: buildBears(currentBears, id, { found: true, proofImage }),
    hints: sanitizeHints(currentState.hints)
  };

  if (canUseBlob()) {
    await writeBlobState(nextState);
    return nextState;
  }

  const current = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
  await githubRequest("PUT", `/repos/${owner}/${repo}/contents/${statePath}`, {
    message: `Submit proof for duck ${id}`,
    content: Buffer.from(JSON.stringify(nextState, null, 2) + "\n").toString("base64"),
    sha: current.sha,
    branch
  });

  return nextState;
}

async function writeProofUpdate(update) {
  const id = Number(update?.id);
  if (!Number.isInteger(id) || id < 1 || id > DUCK_COUNT) {
    throw new Error("Deze eend bestaat nie in de administratie. Zeer verdacht, zunne.");
  }

  if (cleanPin(update.proofPassword) !== proofPassword) {
    throw new Error("Wachtwoord klopt niet.");
  }

  const currentState = await readState();
  const currentBears = Array.isArray(currentState.bears) ? currentState.bears : [];
  const targetBear = currentBears.find((item) => Number(item.id) === id) || {};
  let nextProofImage = typeof targetBear.proofImage === "string" ? targetBear.proofImage : "";
  let nextFound = Boolean(targetBear.found);
  let proofImageToDelete = "";

  if (update.deleteProof) {
    proofImageToDelete = nextProofImage;
    nextProofImage = "";
    nextFound = false;
  } else {
    if (typeof update.proofDataUrl !== "string" || !update.proofDataUrl) {
      throw new Error("Geen nieuwe kwakbewijsfoto ontvangen.");
    }
    nextProofImage = await writeProofImage(id, update.proofDataUrl);
    nextFound = true;
  }

  const nextState = {
    updatedAt: new Date().toISOString(),
    bears: buildBears(currentBears, id, { found: nextFound, proofImage: nextProofImage }),
    hints: sanitizeHints(currentState.hints)
  };

  if (canUseBlob()) {
    await writeBlobState(nextState);
    if (proofImageToDelete) {
      await deleteProofImage(proofImageToDelete);
    }
    return nextState;
  }

  const current = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
  await githubRequest("PUT", `/repos/${owner}/${repo}/contents/${statePath}`, {
    message: update.deleteProof ? `Remove proof for duck ${id}` : `Replace proof for duck ${id}`,
    content: Buffer.from(JSON.stringify(nextState, null, 2) + "\n").toString("base64"),
    sha: current.sha,
    branch
  });

  if (proofImageToDelete) {
    await deleteProofImage(proofImageToDelete);
  }

  return nextState;
}

async function writeProofImage(id, dataUrl) {
  return writeStoredImage("proofs", "duck", id, dataUrl);
}

async function writeHintUpdate(update) {
  const id = Number(update?.id);
  if (!Number.isInteger(id) || id < 1 || id > HINT_COUNT) {
    throw new Error("Deze hintplek bestaat nie. Probeer een normale hintkaart, speurneus.");
  }

  const currentState = await readState();
  const currentHints = sanitizeHints(currentState.hints);
  const targetHint = currentHints.find((item) => Number(item.id) === id) || {};
  const hasExistingContent = Boolean(targetHint.text || targetHint.image);
  const suppliedPassword = cleanPin(update.password);
  const needsPassword = hasExistingContent || update.deleteHint || update.deleteImage;
  if (needsPassword && suppliedPassword !== proofPassword) {
    throw new Error("Hint aanpassen of verwijderen kan alleen met het wachtwoord.");
  }

  let imageToDelete = "";
  let nextName = typeof targetHint.name === "string" ? targetHint.name : "";
  let nextText = typeof targetHint.text === "string" ? targetHint.text : "";
  let nextImage = typeof targetHint.image === "string" ? targetHint.image : "";
  let nextUpdatedAt = typeof targetHint.updatedAt === "string" ? targetHint.updatedAt : "";

  if (update.deleteHint) {
    imageToDelete = nextImage;
    nextName = "";
    nextText = "";
    nextImage = "";
    nextUpdatedAt = "";
  } else {
    nextName = typeof update.name === "string" ? update.name.slice(0, 70).trim() : nextName;
    nextText = typeof update.text === "string" ? update.text.slice(0, 320).trim() : nextText;
    if (update.deleteImage) {
      imageToDelete = nextImage;
      nextImage = "";
    }
    if (typeof update.imageDataUrl === "string" && update.imageDataUrl) {
      if (nextImage) imageToDelete = nextImage;
      nextImage = await writeStoredImage("hints", "hint", id, update.imageDataUrl);
    }
    if (!nextText && !nextImage) {
      throw new Error("Geen hint ingevuld. Tekst, foto, of allebei, jonge.");
    }
    if (!nextName) {
      throw new Error("Naam erbij graag. Anders is het laf anoniem gehint.");
    }
    nextUpdatedAt = new Date().toISOString();
  }

  const nextState = {
    updatedAt: new Date().toISOString(),
    bears: sanitizeBears(currentState.bears),
    hints: currentHints.map((hint) => hint.id === id ? { id, name: nextName, text: nextText, image: nextImage, updatedAt: nextUpdatedAt } : hint)
  };

  await writePersistedState(nextState);
  if (imageToDelete) {
    await deleteProofImage(imageToDelete);
  }
  return nextState;
}

async function writeStoredImage(folder, prefix, id, dataUrl) {
  const match = String(dataUrl).match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("Afbeelding heeft geen geldig formaat.");

  const extension = match[1] === "png" ? "png" : match[1] === "webp" ? "webp" : "jpg";
  const buffer = Buffer.from(match[2], "base64");
  const number = String(id).padStart(folder === "proofs" ? 3 : 2, "0");

  if (canUseBlob()) {
    const { put } = await loadBlobSdk();
    const blob = await put(`${folder}/${prefix}-${number}.${extension}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType: `image/${extension === "jpg" ? "jpeg" : extension}`
    });
    return blob.url;
  }

  const proofPath = `assets/${folder}/${prefix}-${number}.${extension}`;
  const existing = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${proofPath}?ref=${branch}`, undefined, true);

  await githubRequest("PUT", `/repos/${owner}/${repo}/contents/${proofPath}`, {
    message: `Update proof image for duck ${id}`,
    content: match[2],
    sha: existing?.sha,
    branch
  });

  return `/${proofPath}`;
}

async function deleteProofImage(proofImage) {
  if (canUseBlob() && /^https?:\/\//i.test(String(proofImage))) {
    const { del } = await loadBlobSdk();
    await del(proofImage);
    return;
  }

  const proofPath = String(proofImage).replace(/^\/+/, "");
  if (!proofPath.startsWith("assets/proofs/") && !proofPath.startsWith("assets/hints/")) return;

  const existing = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${proofPath}?ref=${branch}`, undefined, true);
  if (!existing?.sha) return;

  await githubRequest("DELETE", `/repos/${owner}/${repo}/contents/${proofPath}`, {
    message: `Delete proof image ${path.basename(proofPath)}`,
    sha: existing.sha,
    branch
  });
}

function sanitizeState(input) {
  return {
    updatedAt: new Date().toISOString(),
    bears: sanitizeBears(input?.bears),
    hints: sanitizeHints(input?.hints)
  };
}

function sanitizeBears(input) {
  const bears = Array.isArray(input) ? input : [];
  return Array.from({ length: DUCK_COUNT }, (_, index) => {
      const id = index + 1;
      const bear = bears.find((item) => Number(item.id) === id) || {};
      const proofImage = typeof bear.proofImage === "string" ? bear.proofImage.slice(0, 600) : "";
      const proofDataUrl = typeof bear.proofDataUrl === "string" ? bear.proofDataUrl : undefined;
      return {
        id,
        found: Boolean(bear.found),
        name: typeof bear.name === "string" ? bear.name.slice(0, 80) : undefined,
        note: typeof bear.note === "string" ? bear.note.slice(0, 400) : "",
        proofImage,
        proofDataUrl
      };
  });
}

function sanitizeHints(input) {
  const hints = Array.isArray(input) ? input : [];
  return Array.from({ length: HINT_COUNT }, (_, index) => {
    const id = index + 1;
    const hint = hints.find((item) => Number(item.id) === id) || {};
    return {
      id,
      name: typeof hint.name === "string" ? hint.name.slice(0, 70) : "",
      text: typeof hint.text === "string" ? hint.text.slice(0, 320) : "",
      image: typeof hint.image === "string" ? hint.image.slice(0, 600) : "",
      updatedAt: typeof hint.updatedAt === "string" ? hint.updatedAt.slice(0, 40) : "",
      imageDataUrl: typeof hint.imageDataUrl === "string" ? hint.imageDataUrl : undefined
    };
  });
}

function buildBears(currentBears, changedId, patch) {
  return sanitizeBears(currentBears).map((bear) => (
    bear.id === changedId ? { ...bear, ...patch } : bear
  ));
}

async function writePersistedState(nextState) {
  if (canUseBlob()) {
    await writeBlobState(nextState);
    return;
  }

  const current = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
  await githubRequest("PUT", `/repos/${owner}/${repo}/contents/${statePath}`, {
    message: "Update duckhunt state",
    content: Buffer.from(JSON.stringify(nextState, null, 2) + "\n").toString("base64"),
    sha: current.sha,
    branch
  });
}

function canUseBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function loadBlobSdk() {
  if (!blobSdkPromise) {
    blobSdkPromise = import("@vercel/blob");
  }
  return blobSdkPromise;
}

async function readBlobState() {
  const { get } = await loadBlobSdk();
  const result = await get(blobStatePath, { access: "public", useCache: false });
  if (!result?.stream) return null;

  const text = await new Response(result.stream).text();
  return JSON.parse(text);
}

async function writeBlobState(state) {
  const { put } = await loadBlobSdk();
  await put(blobStatePath, Buffer.from(JSON.stringify(state, null, 2) + "\n"), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    contentType: "application/json"
  });
}

async function githubRequest(method, apiPath, body, allowNotFound = false) {
  const response = await fetch(`https://api.github.com${apiPath}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "Duckhunt100"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    if (allowNotFound && response.status === 404) return null;
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  return response.json();
}

function cleanEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanPin(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}
