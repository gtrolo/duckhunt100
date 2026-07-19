const fs = require("fs");
const path = require("path");

const DUCK_COUNT = 100;
const owner = cleanEnv("GITHUB_OWNER", "gtrolo");
const repo = cleanEnv("GITHUB_REPO", "duckhunt100");
const branch = cleanEnv("GITHUB_BRANCH", "main");
const statePath = "data/state.json";
const proofPassword = cleanPin(process.env.PROOF_PASSWORD || "rolo");

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
  if (process.env.GITHUB_TOKEN) {
    const file = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  }

  const localPath = path.join(process.cwd(), statePath);
  return JSON.parse(fs.readFileSync(localPath, "utf8"));
}

async function writeState(state) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN ontbreekt; gedeeld opslaan is nog niet gekoppeld.");
  }

  const stateWithProofs = { ...state, bears: [] };
  for (const bear of state.bears) {
    const nextBear = { ...bear };
    if (nextBear.proofDataUrl) {
      nextBear.proofImage = await writeProofImage(nextBear.id, nextBear.proofDataUrl);
      delete nextBear.proofDataUrl;
    }
    stateWithProofs.bears.push(nextBear);
  }

  const current = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${statePath}?ref=${branch}`);
  const nextState = { ...stateWithProofs, updatedAt: new Date().toISOString() };

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
    bears: Array.from({ length: DUCK_COUNT }, (_, index) => {
      const bearId = index + 1;
      const existing = currentBears.find((item) => Number(item.id) === bearId) || {};
      return {
        id: bearId,
        found: bearId === id ? true : Boolean(existing.found),
        name: typeof existing.name === "string" ? existing.name : undefined,
        note: typeof existing.note === "string" ? existing.note : "",
        proofImage: bearId === id ? proofImage : typeof existing.proofImage === "string" ? existing.proofImage : ""
      };
    })
  };

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
    bears: Array.from({ length: DUCK_COUNT }, (_, index) => {
      const bearId = index + 1;
      const existing = currentBears.find((item) => Number(item.id) === bearId) || {};
      return {
        id: bearId,
        found: bearId === id ? nextFound : Boolean(existing.found),
        name: typeof existing.name === "string" ? existing.name : undefined,
        note: typeof existing.note === "string" ? existing.note : "",
        proofImage: bearId === id ? nextProofImage : typeof existing.proofImage === "string" ? existing.proofImage : ""
      };
    })
  };

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
  const match = String(dataUrl).match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("Kwakbewijs heeft geen geldig afbeeldingsformaat.");

  const extension = match[1] === "png" ? "png" : match[1] === "webp" ? "webp" : "jpg";
  const proofPath = `assets/proofs/duck-${String(id).padStart(3, "0")}.${extension}`;
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
  const proofPath = String(proofImage).replace(/^\/+/, "");
  if (!proofPath.startsWith("assets/proofs/")) return;

  const existing = await githubRequest("GET", `/repos/${owner}/${repo}/contents/${proofPath}?ref=${branch}`, undefined, true);
  if (!existing?.sha) return;

  await githubRequest("DELETE", `/repos/${owner}/${repo}/contents/${proofPath}`, {
    message: `Delete proof image ${path.basename(proofPath)}`,
    sha: existing.sha,
    branch
  });
}

function sanitizeState(input) {
  const bears = Array.isArray(input?.bears) ? input.bears : [];
  return {
    updatedAt: new Date().toISOString(),
    bears: Array.from({ length: DUCK_COUNT }, (_, index) => {
      const id = index + 1;
      const bear = bears.find((item) => Number(item.id) === id) || {};
      return {
        id,
        found: Boolean(bear.found),
        name: typeof bear.name === "string" ? bear.name.slice(0, 80) : undefined,
        note: typeof bear.note === "string" ? bear.note.slice(0, 400) : "",
        proofImage: typeof bear.proofImage === "string" ? bear.proofImage.slice(0, 160) : "",
        proofDataUrl: typeof bear.proofDataUrl === "string" ? bear.proofDataUrl : undefined
      };
    })
  };
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
