/**
 * VibeGuard – Scan Orchestrator
 * Controls the full scan flow from the scan.html page
 */

// ── Samples ──
const SAMPLES = {
  js: `// AI-Generated JavaScript – Deliberately Vulnerable
const password = "admin123";
const apiKey = "sk-proj-abc123secretkey456";
const userId = req.params.id;

// SQL Injection
const query = "SELECT * FROM users WHERE id=" + userId;
db.execute(query);

// XSS vulnerability
document.getElementById("output").innerHTML = userInput;

// Dangerous eval
eval(userInput);

// Insecure random for token
const token = Math.random().toString(36);

// External HTTP (not HTTPS)
fetch("http://api.example.com/data");

// Debug logs with sensitive data
console.log("User data:", userData);
console.log("Token:", token);

// TODO: add proper authentication
// FIXME: this loop might be infinite
let i = 0;
while (true) {
  if (someCondition) break;
  i++;
}`,

  py: `# AI-Generated Python – Deliberately Vulnerable
import pickle
import os
import hashlib

DEBUG = True
password = "supersecret123"
api_key = "sk-abc123xyz"

# Shell injection
user_input = input("Enter filename: ")
os.system("cat " + user_input)

# Pickle deserialization from untrusted source
data = pickle.loads(user_data_from_network)

# Weak hashing
hashed = hashlib.md5(password.encode()).hexdigest()

# SQL injection
query = "SELECT * FROM users WHERE name='" + username + "'"
cursor.execute(query)

# HTTP instead of HTTPS
import urllib.request
urllib.request.urlopen("http://api.example.com/endpoint")

# Broad exception catch
try:
    risky_operation()
except:
    pass

# FIXME: need to validate input here
# TODO: add rate limiting`,

  clean: `// Clean, Secure JavaScript Example
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';

// Environment variables for secrets
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// Parameterized query – no SQL injection
async function getUserById(userId) {
  const result = await db.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] ?? null;
}

// Sanitized output – no XSS
function displayMessage(message) {
  const el = document.getElementById('output');
  el.textContent = message; // Safe: textContent not innerHTML
}

// Cryptographically secure token generation
function generateToken() {
  return randomBytes(32).toString('hex');
}

// Proper password hashing
async function hashPassword(plaintext) {
  return hash(plaintext, 12); // bcrypt with cost factor 12
}

// HTTPS endpoint
const ENDPOINT = 'https://api.example.com/data';

export { getUserById, displayMessage, generateToken, hashPassword };`,
};

// ── DOM References ──
const codeInput = document.getElementById('code-input');
const langSelect = document.getElementById('lang-select');
const fileInput = document.getElementById('file-input');
const lineCount = document.getElementById('line-count');
const analyzeBtn = document.getElementById('analyze-btn');
const btnText = document.getElementById('btn-text');
const btnIcon = document.getElementById('btn-icon');
const scanProgress = document.getElementById('scan-progress');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiBtn = document.getElementById('save-api-btn');
const apiStatus = document.getElementById('api-status');
const editorBadge = document.getElementById('editor-lang-badge');

// ── Restore saved API key ──
const savedKey = localStorage.getItem('vg_api_key') || '';
if (savedKey) {
  apiKeyInput.value = savedKey;
  updateApiStatus(savedKey);
}

function updateApiStatus(key) {
  if (key && key.startsWith('sk-')) {
    apiStatus.textContent = '✅ External audit key saved — additional logic validation enabled';
    apiStatus.className = 'api-status ok';
  } else {
    apiStatus.textContent = '⚠ No external audit key — built-in scan only';
    apiStatus.className = 'api-status missing';
  }
}

saveApiBtn.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  localStorage.setItem('vg_api_key', key);
  updateApiStatus(key);
  showToast('✅ API key saved!');
});

// ── Language selector ──
langSelect.addEventListener('change', () => {
  editorBadge.textContent = langSelect.value;
});

// ── Line counter ──
codeInput.addEventListener('input', () => {
  const lines = codeInput.value.split('\n').length;
  lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
});

// ── File Upload ──
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const langMap = { js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript', py: 'python' };
  if (langMap[ext]) {
    langSelect.value = langMap[ext];
    editorBadge.textContent = langMap[ext];
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    codeInput.value = ev.target.result;
    const lines = codeInput.value.split('\n').length;
    lineCount.textContent = `${lines} lines`;
  };
  reader.readAsText(file);
});

// ── Load sample ──
function loadSample(type) {
  const sample = SAMPLES[type];
  if (!sample) return;
  codeInput.value = sample;
  const langMap = { js: 'javascript', py: 'python', clean: 'javascript' };
  const lang = langMap[type];
  langSelect.value = lang;
  editorBadge.textContent = lang;
  lineCount.textContent = `${sample.split('\n').length} lines`;
}

function guessLanguageFromCode(code) {
  const text = code.trim();
  if (!text) return '';
  const lower = text.toLowerCase();

  if (/^\s*<\?php|\$[a-z_][\w]*\s*=|echo\s+|\bnamespace\b|\bfunction\b\s+[a-z_]/.test(text)) return 'php';
  if (/\bdef\s+\w+\b|\bimport\s+\w+|\bprint\(|\bself\b|\bexcept\b|\belif\b/.test(lower)) return 'python';
  if (/\bconsole\.log\b|\bfunction\b|\bconst\b|\blet\b|\bvar\b|=>|document\.|window\.|\bimport\s+.*from\b/.test(text)) return 'javascript';
  if (/\bclass\b.*\{?|\bpublic\s+static\s+void\s+main\b|System\.out\.println|\bString\b|new\s+[A-Z]\w*\(/.test(text)) return 'java';
  if (/\busing\s+System\b|Console\.WriteLine|namespace\s+\w+|\bpublic\s+class\b|\bvar\s+\w+\s*=|\basync\s+Task\b/.test(text)) return 'csharp';
  if (/\bfunc\s+\w+\s*\(|fmt\.Println|package\s+\w+|import\s+\("|go\s+func\b/.test(text)) return 'go';
  if (/\bputs\b|\bdef\b\s+\w+|end\b|\bclass\b\s+\w+|\brequire\b/.test(text) && /\bend\b/.test(lower)) return 'ruby';
  if (/\b#include\b|std::|cout\s*<<|cin\s*>>|\bint\s+main\s*\(/.test(text)) return 'cpp';
  if (/^\s*</.test(text) && /<[^>]+>/.test(text)) return 'html';
  if (/^[^{]+\{[^}]+\}/.test(text) && /[.#]?[a-zA-Z][\w-]*\s*\{/.test(text) && !/<[^>]+>/.test(text)) return 'css';

  return '';
}

function isLanguageMismatch(code, selectedLanguage) {
  const guessed = guessLanguageFromCode(code);
  return guessed && selectedLanguage && guessed !== selectedLanguage;
}

// ── Step helpers ──
function setStep(id, state) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'progress-step ' + state;
  const icon = el.querySelector('.step-icon');
  if (state === 'done') icon.textContent = '✓';
  else if (state === 'active') icon.textContent = '◷';
  else icon.textContent = '◷';
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main Analyze ──
analyzeBtn.addEventListener('click', async () => {
  const code = codeInput.value.trim();
  const language = langSelect.value;

  if (!language) {
    showToast('⚠ Please select a language before running the scan.', true);
    return;
  }

  if (!code || code.length < 5) {
    showToast('⚠ Please enter some code first.', true);
    return;
  }

  if (isLanguageMismatch(code, language)) {
    showToast('⚠ The selected language does not match the pasted code. Please choose the correct language and try again.', true);
    return;
  }

  const apiKey = localStorage.getItem('vg_api_key') || '';

  // UI → loading
  analyzeBtn.disabled = true;
  btnText.textContent = 'Scanning…';
  btnIcon.textContent = '⏳';
  scanProgress.classList.add('visible');
  ['step-sast','step-ai','step-score','step-road'].forEach(s => setStep(s, ''));

  try {
    // Step 1 – SAST
    setStep('step-sast', 'active');
    await delay(500);
    const sastFindings = runSAST(code, language);
    setStep('step-sast', 'done');

    // Step 2 – AI Audit
    setStep('step-ai', 'active');
    let aiFindings = [];
    if (apiKey && apiKey.startsWith('sk-')) {
      aiFindings = await runOpenAIAudit(code, language, apiKey);
    } else {
      await delay(600); // simulate
    }
    setStep('step-ai', 'done');

    // Step 3 – Score
    setStep('step-score', 'active');
    await delay(400);
    const allFindings = [...sastFindings, ...aiFindings];
    const scoreData = calculateScore(allFindings);
    setStep('step-score', 'done');

    // Step 4 – Roadmap
    setStep('step-road', 'active');
    await delay(400);
    const roadmap = generateRoadmap(allFindings, scoreData.score, language);
    setStep('step-road', 'done');

    // Build result object
    const result = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      language,
      code: code.substring(0, 2000),
      findings: allFindings,
      score: scoreData.score,
      breakdown: scoreData.breakdown,
      grade: scoreData.grade,
      gradeColor: scoreData.gradeColor,
      gradeEmoji: scoreData.gradeEmoji,
      roadmap,
      aiEnabled: !!(apiKey && apiKey.startsWith('sk-')),
      lines: code.split('\n').length,
    };

    // Save to history on the backend first, then keep a local fallback copy.
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      if (response.ok) {
        const body = await response.json();
        result.id = body.id;
      } else {
        console.warn('Failed to save scan history:', await response.text());
      }
    } catch (err) {
      console.warn('Backend history save failed:', err);
    }

    const history = JSON.parse(localStorage.getItem('vg_history') || '[]');
    history.push(result);
    if (history.length > 50) history.shift(); // cap at 50
    localStorage.setItem('vg_history', JSON.stringify(history));

    localStorage.setItem('vg_active_result', JSON.stringify(result));
    await delay(300);
    window.location.href = `results.html${result.id ? `?id=${result.id}` : ''}`;

  } catch (err) {
    console.error(err);
    showToast('❌ Scan failed: ' + err.message, true);
    analyzeBtn.disabled = false;
    btnText.textContent = 'Analyze Code';
    btnIcon.textContent = '🔍';
    scanProgress.classList.remove('visible');
  }
});

// ── Toast ──
function showToast(message, isError = false) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
