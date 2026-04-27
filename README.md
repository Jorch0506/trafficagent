# ⚡ TrafficAgent

Genera tráfico orgánico real a tu sitio web con IA.

---

## 🚀 Deploy en Vercel (10 minutos)

### Paso 1 — Sube a GitHub

1. Ve a **github.com** → botón verde **"New"** → crea repo llamado `trafficagent`
2. En tu computadora, abre la terminal en la carpeta del proyecto
3. Ejecuta estos comandos uno por uno:

```bash
git init
git add .
git commit -m "TrafficAgent v1"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/trafficagent.git
git push -u origin main
```

### Paso 2 — Conecta con Vercel

1. Ve a **vercel.com** → **Add New Project**
2. Importa tu repo `trafficagent` desde GitHub
3. En **"Environment Variables"** agrega:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-tu-key-aqui`
4. Click **Deploy**

### Paso 3 — ¡Listo!

Vercel te da una URL como `trafficagent.vercel.app` — esa es tu app funcionando en producción.

---

## 🔑 ¿Dónde consigo mi API key de Anthropic?

1. Ve a **console.anthropic.com**
2. Settings → API Keys → Create Key
3. Cópiala y pégala en Vercel como `ANTHROPIC_API_KEY`

---

## 📁 Estructura del proyecto

```
trafficagent/
├── pages/
│   ├── index.js        ← Frontend completo
│   └── api/
│       └── generate.js ← Backend seguro (llama a Claude)
├── styles/
│   └── globals.css
├── .env.example        ← Plantilla de variables de entorno
├── .gitignore          ← Protege tu API key
├── next.config.js
└── package.json
```

---

## 💡 Cómo funciona

1. Usuario ingresa su URL en el frontend (`index.js`)
2. El frontend llama a `/api/generate` (backend seguro en Vercel)
3. El backend usa `ANTHROPIC_API_KEY` (nunca expuesta al navegador)
4. Claude genera el plan de tráfico en JSON
5. El frontend muestra los resultados

---

## 🧪 Probar localmente

```bash
npm install
cp .env.example .env.local
# Edita .env.local y pon tu API key real
npm run dev
# Abre http://localhost:3000
```
