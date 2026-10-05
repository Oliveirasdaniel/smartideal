/* ==========================================================
   Número do WhatsApp da loja: (21) 96706-3243
   Formato: 55 + DDD + número, só dígitos.
   ========================================================== */
const WHATSAPP = "5521967063243";

const MENSAGEM_PADRAO = "Olá, Smart Ideal! Vim pelo site e gostaria de um orçamento.";

const waLink = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

// Todos os links marcados com data-wa abrem o WhatsApp da loja
document.querySelectorAll("[data-wa]").forEach((link) => {
  link.href = waLink(link.dataset.waText || MENSAGEM_PADRAO);
  link.target = "_blank";
  link.rel = "noopener";
});

/* ---------- menu mobile ---------- */

const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");

function fecharMenu() {
  toggle.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");
}

toggle.addEventListener("click", () => {
  const aberto = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!aberto));
  menu.classList.toggle("is-open", !aberto);
});

menu.addEventListener("click", (e) => {
  if (e.target.closest("a")) fecharMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("is-open")) {
    fecharMenu();
    toggle.focus();
  }
});

/* ---------- orçamento rápido do hero ---------- */

document.getElementById("hero-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const modelo = document.getElementById("hero-modelo").value.trim();
  const texto = modelo
    ? `Olá, Smart Ideal! Vim pelo site. Meu celular é um ${modelo}. Podem me passar um orçamento?`
    : MENSAGEM_PADRAO;
  window.open(waLink(texto), "_blank", "noopener");
});

/* ---------- monte seu orçamento: abas + diagrama ---------- */

const PROBLEMAS = {
  tela: {
    titulo: "Troca de tela",
    texto: "Vidro trincado, touch falhando, manchas, linhas ou tela preta.",
    prazo: "Geralmente no mesmo dia",
    frase: "a tela está quebrada ou com defeito",
  },
  bateria: {
    titulo: "Troca de bateria",
    texto: "Descarrega rápido, desliga sozinho, está estufada ou com a saúde baixa.",
    prazo: "Geralmente no mesmo dia",
    frase: "a bateria está descarregando rápido",
  },
  carga: {
    titulo: "Não carrega",
    texto: "Não carrega, só carrega em uma posição ou não reconhece o carregador. O diagnóstico mostra se o defeito é no conector ou na placa.",
    prazo: "Prazo informado após o diagnóstico",
    frase: "ele não está carregando direito",
  },
  software: {
    titulo: "Restauração de software",
    texto: "Travando, reiniciando ou preso no logo. Restauramos o sistema e, quando possível, salvamos seus dados antes.",
    prazo: "De algumas horas a 1 dia",
    frase: "ele está travando ou com problema no sistema",
  },
  placa: {
    titulo: "Reparo em placa",
    texto: "Não liga, molhou, oxidou ou entrou em curto. Diagnóstico e conserto direto na placa, com microscópio e micro-soldagem.",
    prazo: "Prazo informado após o diagnóstico",
    frase: "ele não liga ou parece ser problema na placa",
  },
  pelicula: {
    titulo: "Películas e acessórios",
    texto: "Películas, capas, carregadores, cabos e fones para o seu modelo.",
    prazo: "Consulte a disponibilidade",
  },
};

const NOME_SEM_MODELO = {
  Apple: "iPhone",
  Samsung: "Samsung",
  Motorola: "Motorola",
  LG: "LG",
};

// Se o cliente já escreveu a linha do aparelho, não repete a marca
const LINHAS = {
  Apple: /apple|iphone|ipad/i,
  Samsung: /samsung|galaxy/i,
  Motorola: /motorola|moto/i,
  LG: /\blg\b/i,
};

const builder = document.getElementById("builder");
const modelo = document.getElementById("modelo");
const preview = document.getElementById("msg-preview");
const enviar = document.getElementById("send");
const diagram = document.getElementById("diagram");
const infoTitulo = document.getElementById("info-title");
const infoTexto = document.getElementById("info-text");
const infoPrazo = document.getElementById("info-eta");

function nomeDoAparelho(marca, texto) {
  const m = texto.trim();
  if (!m) return NOME_SEM_MODELO[marca];
  return LINHAS[marca].test(m) ? m : `${marca} ${m}`;
}

function montarMensagem(marca, problema, texto) {
  const aparelho = nomeDoAparelho(marca, texto);
  if (problema === "pelicula") {
    return `Olá, Smart Ideal! Quero película ou acessórios para o meu ${aparelho}. O que vocês têm disponível?`;
  }
  return `Olá, Smart Ideal! Tenho um ${aparelho} e ${PROBLEMAS[problema].frase}. Podem me passar um orçamento?`;
}

function atualizar() {
  const marca = builder.elements.marca.value;
  const problema = builder.elements.problema.value;
  const info = PROBLEMAS[problema];

  infoTitulo.textContent = info.titulo;
  infoTexto.textContent = info.texto;
  infoPrazo.textContent = info.prazo;

  const mensagem = montarMensagem(marca, problema, modelo.value);
  preview.textContent = mensagem;
  enviar.href = waLink(mensagem);

  diagram.dataset.brand = marca;
  diagram.dataset.part = problema;
}

builder.addEventListener("change", atualizar);
modelo.addEventListener("input", atualizar);
builder.addEventListener("submit", (e) => {
  e.preventDefault();
  window.open(enviar.href, "_blank", "noopener");
});

atualizar();

/* ---------- tela de bloqueio: data e hora de agora ---------- */

const formatoData = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" });
const formatoHora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

function atualizarRelogio() {
  const agora = new Date();
  document.querySelectorAll(".js-data").forEach((el) => (el.textContent = formatoData.format(agora)));
  document.querySelectorAll(".js-hora").forEach((el) => (el.textContent = formatoHora.format(agora)));
}

atualizarRelogio();
setInterval(atualizarRelogio, 30000);

/* ---------- nebulosa roxa e azul (hero e papel de parede do iPhone) ---------- */

// Gerador com semente: a nebulosa, as estrelas e as rachaduras saem sempre iguais
function aleatorio(semente) {
  let s = semente;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Ruído simplex 2D, retorna valores entre -1 e 1
function criarRuido(semente) {
  const rand = aleatorio(semente);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const GX = [1, -1, 1, -1, 1, -1, 0, 0];
  const GY = [1, 1, -1, -1, 0, 0, 1, -1];
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;

  return (x, y) => {
    const k = (x + y) * F2;
    const i = Math.floor(x + k);
    const j = Math.floor(y + k);
    const t = (i + j) * G2;
    const x0 = x - i + t;
    const y0 = y - j + t;
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = 1 - i1;
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    let n = 0;
    let a = 0.5 - x0 * x0 - y0 * y0;
    if (a > 0) {
      const g = perm[ii + perm[jj]] & 7;
      a *= a;
      n += a * a * (GX[g] * x0 + GY[g] * y0);
    }
    a = 0.5 - x1 * x1 - y1 * y1;
    if (a > 0) {
      const g = perm[ii + i1 + perm[jj + j1]] & 7;
      a *= a;
      n += a * a * (GX[g] * x1 + GY[g] * y1);
    }
    a = 0.5 - x2 * x2 - y2 * y2;
    if (a > 0) {
      const g = perm[ii + 1 + perm[jj + 1]] & 7;
      a *= a;
      n += a * a * (GX[g] * x2 + GY[g] * y2);
    }
    return 70 * n;
  };
}

function fbm(ruido, x, y, oitavas = 5) {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < oitavas; o++) {
    v += amp * ruido(x * freq, y * freq);
    freq *= 2.03;
    amp *= 0.47;
  }
  return v;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const suave = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const misturar = (c1, c2, t) => [
  c1[0] + (c2[0] - c1[0]) * t,
  c1[1] + (c2[1] - c1[1]) * t,
  c1[2] + (c2[2] - c1[2]) * t,
];

// hero: meio roxo, meio azul
const PALETA_ROXA = {
  fundo: [7 / 255, 8 / 255, 31 / 255],
  base: [0.12, 0.15, 0.58],
  a: [0.24, 0.45, 1.0],
  b: [0.56, 0.33, 1.0],
  detalhe: [0.45, 0.85, 1.0],
  nucleo: [0.86, 0.86, 1.0],
};

// papel de parede do iPhone: dourado, no amarelo da marca, para contrastar com o hero
const PALETA_DOURADA = {
  fundo: [6 / 255, 3 / 255, 0],
  base: [0.5, 0.12, 0.0],
  a: [1.0, 0.42, 0.0],
  b: [1.0, 0.8, 0.12],
  detalhe: [1.0, 0.95, 0.7],
  nucleo: [1.0, 0.93, 0.75],
};

// Tela do iPhone: faixa diagonal entre o relógio e a notificação
function mascaraDaTela(largura, altura) {
  const cx = largura * 0.55;
  const cy = altura * 0.46;
  const ra = altura * 0.6;
  const rb = largura * 0.42;
  const nx = largura * 0.62;
  const ny = altura * 0.4;
  const sigma = largura * 0.22;
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const a = dx * -0.6 + dy * 0.8;
    const b = dx * 0.8 + dy * 0.6;
    const ex = x - nx;
    const ey = y - ny;
    return {
      faixa: Math.exp(-((a * a) / (ra * ra) + (b * b) / (rb * rb))),
      nucleo: Math.exp(-(ex * ex + ey * ey) / (2 * sigma * sigma)),
    };
  };
}

// Hero: faixa diagonal centrada no iPhone, descendo para a esquerda.
// O título fica no escuro.
function mascaraDoHero(largura, [celX, celY]) {
  const mobile = largura < 900;
  const cx = celX + (mobile ? 20 : 60);
  const cy = celY;
  const ra = mobile ? 560 : 700;
  const rb = mobile ? 230 : 300;
  return (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const a = dx * -0.8 + dy * 0.6;
    const b = dx * 0.6 + dy * 0.8;
    const ex = dx - (mobile ? 40 : 150);
    const ey = dy + 60;
    return {
      faixa: Math.exp(-((a * a) / (ra * ra) + (b * b) / (rb * rb))),
      nucleo: Math.exp(-(ex * ex + ey * ey) / (2 * 190 * 190)),
    };
  };
}

// Gera a nebulosa num canvas pequeno (1/passo da resolução), em lotes
// para não travar a página, e devolve o canvas já desfocado
async function gerarNebulosa({ largura, altura, mascara, passo, nuvem, semente, desfoque, paleta = PALETA_ROXA, exposicao = 1.75 }) {
  const w = Math.max(40, Math.round(largura / passo));
  const h = Math.max(40, Math.round(altura / passo));
  const img = new ImageData(w, h);
  const ruido = criarRuido(semente);
  const poeira = criarRuido(semente + 2905);
  const zoom = passo / nuvem;
  const torcao = 1.1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x * zoom;
      const ny = y * zoom;
      const { faixa, nucleo } = mascara(x * passo, y * passo);

      // nuvens: ruído fractal com uma torção leve
      const wx = fbm(ruido, nx + 11.3, ny + 4.1, 3);
      const wy = fbm(ruido, nx + 2.7, ny + 17.9, 3);
      const f = 0.5 + 0.5 * fbm(ruido, nx + torcao * wx, ny + torcao * wy, 5);

      // filamentos finos onde o ruído cruza o zero
      const crista = 1 - Math.abs(fbm(ruido, nx * 1.7 + 30 + 0.8 * wx, ny * 1.7 + 0.8 * wy, 4));
      const filamentos = Math.pow(crista, 9);

      // a cor muda devagar, em grandes regiões, entre as duas cores da paleta
      const tom = 0.5 + 0.5 * fbm(ruido, nx * 0.55 + 50, ny * 0.55 + 50, 3);
      const tomCiano = 0.5 + 0.5 * fbm(ruido, nx * 0.7 + 90, ny * 0.7 + 20, 3);
      let cor = misturar(paleta.a, paleta.b, suave(0.38, 0.62, tom));
      cor = misturar(paleta.base, cor, suave(0.35, 0.75, f));
      cor = misturar(cor, paleta.detalhe, suave(0.62, 0.78, tomCiano) * 0.4);

      const densidade = Math.pow(suave(0.36, 0.9, f), 2.2);
      const faixas = 1 - 0.7 * suave(0.55, 0.72, 0.5 + 0.5 * fbm(poeira, nx * 1.3 + 3, ny * 1.3 + 11, 5));
      const brilho = (densidade * 2 + filamentos * 0.45) * faixa * faixas;
      const ambiente = 0.07 * faixa + 0.025;
      const centro = nucleo * f * f * 1.1;

      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const luz = cor[c] * (brilho + ambiente * f) + paleta.nucleo[c] * centro;
        img.data[i + c] = 255 * clamp01(paleta.fundo[c] + 1 - Math.exp(-luz * exposicao));
      }
      img.data[i + 3] = 255;
    }
    if (y % 24 === 23) await new Promise((ok) => setTimeout(ok, 0));
  }

  const bruto = document.createElement("canvas");
  bruto.width = w;
  bruto.height = h;
  bruto.getContext("2d").putImageData(img, 0, 0);

  // desfoque leve para o gás ficar macio
  const macio = document.createElement("canvas");
  macio.width = w;
  macio.height = h;
  const ctx = macio.getContext("2d");
  ctx.filter = `blur(${desfoque}px)`;
  ctx.drawImage(bruto, 0, 0);
  return macio;
}

function desenharEstrelas(ctx, largura, altura, { mascara, densidade, brilhantes, tamanho, semente, evitarAte = 0 }) {
  const rand = aleatorio(semente);
  const cores = ["255,255,255", "214,226,255", "226,232,255", "232,222,255"];
  const total = Math.round((largura * altura) / densidade);

  for (let n = 0; n < total; n++) {
    const x = rand() * largura;
    const y = rand() * altura;
    // mais estrelas dentro da nebulosa, menos no céu escuro
    if (rand() > 0.35 + 0.65 * mascara(x, y).faixa) continue;
    const r = 0.3 + Math.pow(rand(), 5) * 1.3;
    const cor = cores[Math.floor(rand() * cores.length)];
    if (r > 1) {
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      halo.addColorStop(0, `rgba(${cor},0.35)`);
      halo.addColorStop(1, `rgba(${cor},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
    }
    ctx.fillStyle = `rgba(${cor},${0.4 + rand() * 0.6})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // poucas estrelas brilhantes, com raios de difração, longe do texto
  for (let n = 0, tentativas = 0; n < brilhantes && tentativas < 400; tentativas++) {
    const x = rand() * largura;
    const y = rand() * altura;
    if (mascara(x, y).faixa < 0.35 || x < evitarAte) continue;
    n++;
    const tam = tamanho * (0.7 + rand() * 0.6);
    const halo = ctx.createRadialGradient(x, y, 0, x, y, tam);
    halo.addColorStop(0, "rgba(255,255,255,0.9)");
    halo.addColorStop(0.15, "rgba(220,225,255,0.45)");
    halo.addColorStop(1, "rgba(170,180,255,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(x - tam, y - tam, tam * 2, tam * 2);

    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const raio = ctx.createLinearGradient(x - dx * tam * 2.2, y - dy * tam * 2.2, x + dx * tam * 2.2, y + dy * tam * 2.2);
      raio.addColorStop(0, "rgba(255,255,255,0)");
      raio.addColorStop(0.5, "rgba(255,255,255,0.8)");
      raio.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = raio;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - dx * tam * 2.2, y - dy * tam * 2.2);
      ctx.lineTo(x + dx * tam * 2.2, y + dy * tam * 2.2);
      ctx.stroke();
    }
  }
}

/* ---------- rachaduras da tela quebrada ---------- */

// Linhas que saem do ponto de impacto, com anéis, galhos e cacos de vidro
function gerarRachaduras(svg, w, h) {
  const rand = aleatorio(9);
  const cx = w * 0.3;
  const cy = h * 0.7;
  const diagonal = Math.hypot(w, h);
  const N = 16;

  const principais = [];
  for (let i = 0; i < N; i++) {
    let ang = (i / N) * Math.PI * 2 + (rand() - 0.5) * 0.3;
    const pts = [[cx, cy]];
    let x = cx;
    let y = cy;
    const alcance = diagonal * (0.25 + rand() * 0.55);
    for (let andado = 0; andado < alcance; ) {
      const passo = 8 + rand() * 22;
      ang += (rand() - 0.5) * 0.45;
      x += Math.cos(ang) * passo;
      y += Math.sin(ang) * passo;
      andado += passo;
      pts.push([x, y]);
      if (x < -5 || x > w + 5 || y < -5 || y > h + 5) break;
    }
    principais.push(pts);
  }

  // ponto a uma distância d do impacto, seguindo a linha
  const pontoEm = (pts, d) => {
    let acc = 0;
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1];
      const [x1, y1] = pts[k];
      const s = Math.hypot(x1 - x0, y1 - y0);
      if (acc + s >= d) {
        const t = (d - acc) / s;
        return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
      }
      acc += s;
    }
    return null;
  };

  const aneis = [10, 24, 44, 72];
  const linhasAnel = [];
  aneis.forEach((r, ri) => {
    for (let i = 0; i < N; i++) {
      if (rand() < 0.25 + ri * 0.1) continue;
      const a = pontoEm(principais[i], r * (0.85 + rand() * 0.3));
      const b = pontoEm(principais[(i + 1) % N], r * (0.85 + rand() * 0.3));
      if (!a || !b) continue;
      const meio = [(a[0] + b[0]) / 2 + (rand() - 0.5) * 6, (a[1] + b[1]) / 2 + (rand() - 0.5) * 6];
      linhasAnel.push([a, meio, b]);
    }
  });

  const cacos = [];
  for (let ri = 0; ri < aneis.length - 1; ri++) {
    for (let i = 0; i < N; i++) {
      if (rand() > 0.35) continue;
      const q = [
        pontoEm(principais[i], aneis[ri]),
        pontoEm(principais[i], aneis[ri + 1]),
        pontoEm(principais[(i + 1) % N], aneis[ri + 1]),
        pontoEm(principais[(i + 1) % N], aneis[ri]),
      ];
      if (q.every(Boolean)) cacos.push([q, 0.04 + rand() * 0.12]);
    }
  }

  const galhos = [];
  principais.forEach((pts) => {
    for (let k = 3; k < pts.length - 1; k += 2) {
      if (rand() > 0.35) continue;
      let [x, y] = pts[k];
      let ang = Math.atan2(pts[k + 1][1] - y, pts[k + 1][0] - x) + (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.6);
      const g = [[x, y]];
      const n = 2 + Math.floor(rand() * 4);
      for (let s = 0; s < n; s++) {
        const passo = 6 + rand() * 14;
        ang += (rand() - 0.5) * 0.5;
        x += Math.cos(ang) * passo;
        y += Math.sin(ang) * passo;
        g.push([x, y]);
      }
      galhos.push(g);
    }
  });

  // mancha preta: o display danificado em volta do impacto
  const mancha = [];
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 9) {
    const r = 18 + rand() * 22;
    mancha.push([cx + 8 + Math.cos(a) * r * 1.2, cy + 4 + Math.sin(a) * r]);
  }

  const caminho = (pts) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L");
  const grossas = principais.map(caminho).join("");
  const finas = linhasAnel.map(caminho).join("") + galhos.map(caminho).join("");

  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.innerHTML = `
    <defs>
      <filter id="mancha" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
      <radialGradient id="impacto">
        <stop offset="0" stop-color="#fff" stop-opacity=".95"/>
        <stop offset=".5" stop-color="#fff" stop-opacity=".35"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <path d="${caminho(mancha)}Z" fill="#000" opacity=".9" filter="url(#mancha)"/>
    ${cacos.map(([q, a]) => `<path d="${caminho(q)}Z" fill="#fff" fill-opacity="${a.toFixed(2)}"/>`).join("")}
    <g fill="none" stroke="#000" stroke-opacity=".45" stroke-linecap="round" stroke-linejoin="round" transform="translate(.7 .7)">
      <path d="${grossas}" stroke-width="1.6"/>
      <path d="${finas}" stroke-width="1"/>
    </g>
    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
      <path d="${grossas}" stroke-opacity=".9" stroke-width="1.1"/>
      <path d="${finas}" stroke-opacity=".7" stroke-width=".7"/>
    </g>
    <circle cx="${cx}" cy="${cy}" r="9" fill="url(#impacto)"/>`;
}

/* ---------- desenha a tela do iPhone (papel de parede + rachaduras) ---------- */

const tela = document.getElementById("screen");
let larguraDaTela = 0;

async function desenharTela() {
  const largura = tela.offsetWidth;
  const altura = tela.offsetHeight;
  if (!largura || Math.abs(largura - larguraDaTela) < 8) return;
  larguraDaTela = largura;

  const mascara = mascaraDaTela(largura, altura);
  const nebulosa = await gerarNebulosa({ largura, altura, mascara, passo: 2, nuvem: largura * 0.95, semente: 1337, desfoque: 0.8, paleta: PALETA_DOURADA, exposicao: 2.4 });

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const papel = document.createElement("canvas");
  papel.width = Math.round(largura * dpr);
  papel.height = Math.round(altura * dpr);
  const ctx = papel.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(nebulosa, 0, 0, papel.width, papel.height);
  ctx.scale(dpr, dpr);
  desenharEstrelas(ctx, largura, altura, { mascara, densidade: 600, brilhantes: 2, tamanho: 8, semente: 20251004 });

  // o mesmo papel de parede nas duas camadas (antes e depois)
  tela.querySelectorAll("[data-wall]").forEach((wall) => {
    wall.width = papel.width;
    wall.height = papel.height;
    wall.getContext("2d").drawImage(papel, 0, 0);
  });

  gerarRachaduras(document.getElementById("cracks"), largura, altura);
}

/* ---------- nebulosa atrás do hero ---------- */

const hero = document.getElementById("inicio");
const ceuNebulosa = document.getElementById("hero-nebula");
const ceuEstrelas = document.getElementById("hero-stars");
let tamanhoDoHero = [0, 0];

// centro da vitrine (estável mesmo com o iPhone girando)
function centroDoIphone() {
  const h = hero.getBoundingClientRect();
  const v = document.querySelector(".showcase").getBoundingClientRect();
  return [v.left - h.left + v.width / 2, v.top - h.top + v.height / 2];
}

async function desenharHero() {
  const largura = hero.offsetWidth;
  const altura = hero.offsetHeight;
  const [l, a] = tamanhoDoHero;
  if (Math.abs(largura - l) < 40 && Math.abs(altura - a) < 120) return;
  tamanhoDoHero = [largura, altura];

  const mascara = mascaraDoHero(largura, centroDoIphone());

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  ceuEstrelas.width = Math.round(largura * dpr);
  ceuEstrelas.height = Math.round(altura * dpr);
  const ctxEstrelas = ceuEstrelas.getContext("2d");
  ctxEstrelas.scale(dpr, dpr);
  desenharEstrelas(ctxEstrelas, largura, altura, {
    mascara,
    densidade: 1400,
    brilhantes: Math.max(3, Math.round((largura * altura) / 300000)),
    tamanho: 14,
    semente: 99,
    evitarAte: largura < 900 ? 0 : largura * 0.5,
  });

  const nebulosa = await gerarNebulosa({ largura, altura, mascara, passo: 4, nuvem: 640, semente: 7331, desfoque: 1.2 });
  ceuNebulosa.width = nebulosa.width;
  ceuNebulosa.height = nebulosa.height;
  ceuNebulosa.getContext("2d").drawImage(nebulosa, 0, 0);
  ceuNebulosa.classList.add("is-ready");
}

// Espera a fonte carregar para o hero estar com a altura final
Promise.race([document.fonts.ready, new Promise((ok) => setTimeout(ok, 1500))]).then(async () => {
  await desenharTela();
  await desenharHero();

  let espera;
  new ResizeObserver(() => {
    clearTimeout(espera);
    espera = setTimeout(async () => {
      await desenharTela();
      await desenharHero();
    }, 250);
  }).observe(hero);
});

/* ---------- header transparente sobre o hero, preto no resto ---------- */

const header = document.querySelector(".site-header");

function atualizarHeader() {
  header.classList.toggle("on-dark", hero.getBoundingClientRect().bottom > header.offsetHeight);
}

let quadroHeader = 0;
window.addEventListener(
  "scroll",
  () => {
    cancelAnimationFrame(quadroHeader);
    quadroHeader = requestAnimationFrame(atualizarHeader);
  },
  { passive: true }
);
atualizarHeader();

/* ---------- iPhone 3D: lateral de titânio ---------- */

// A espessura do aparelho é feita de camadas empilhadas, cada uma com um tom
// do metal, para a borda parecer arredondada e polida quando ele gira
const borda = document.getElementById("phone-edge");
const CAMADAS = 18;
const TITANIO = [200, 190, 166];

for (let i = 0; i < CAMADAS; i++) {
  const t = i / (CAMADAS - 1);
  // brilho em faixa, mais claro um pouco acima do meio da espessura
  const luz = 0.62 + 0.42 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 1.6);
  const cor = `rgb(${TITANIO.map((c) => Math.min(255, Math.round(c * luz))).join(",")})`;
  const camada = document.createElement("span");
  camada.style.background = cor;
  camada.style.color = cor;
  camada.style.transform = `translateZ(calc(var(--d) * ${(t - 0.5).toFixed(3)}))`;
  if (t > 0.25 && t < 0.75) camada.className = "com-botoes";
  borda.appendChild(camada);
}

/* ---------- ciclo: tela rachada → gira mostrando a traseira → tela nova ---------- */

const celular = document.getElementById("phone3d");
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let geracao = 0; // cada ciclo novo invalida o anterior
let telaVisivel = false;

function girar(graus) {
  celular.style.transform = `rotateZ(-9deg) rotateX(12deg) rotateY(${26 + graus}deg)`;
}

const esperar = (ms, g) => new Promise((ok) => setTimeout(() => ok(g === geracao), ms));

// uma volta completa; quando a frente some de vista, troca a tela
function darUmaVolta(duracao, g, aoFicarDeCostas) {
  return new Promise((ok) => {
    const inicio = performance.now();
    let trocou = false;
    function quadro(agora) {
      if (g !== geracao) {
        girar(0);
        return ok(false);
      }
      const k = Math.min(1, (agora - inicio) / duracao);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      const graus = 360 * e;
      girar(graus);
      if (!trocou && graus >= 180) {
        trocou = true;
        aoFicarDeCostas();
      }
      if (k < 1) requestAnimationFrame(quadro);
      else {
        girar(0);
        ok(true);
      }
    }
    requestAnimationFrame(quadro);
  });
}

async function cicloAutomatico() {
  const g = ++geracao;
  while (g === geracao) {
    tela.classList.remove("is-fixed", "show-notif");
    if (!(await esperar(2600, g))) return;

    if (!(await darUmaVolta(2200, g, () => tela.classList.add("is-fixed")))) return;
    if (!(await esperar(300, g))) return;
    tela.classList.add("show-notif");
    if (!(await esperar(5000, g))) return;

    // a tela "desliga" por um instante e o ciclo recomeça com outro aparelho quebrado
    tela.classList.remove("show-notif");
    tela.classList.add("is-off");
    if (!(await esperar(450, g))) break;
    tela.classList.remove("is-fixed");
    if (!(await esperar(250, g))) break;
    tela.classList.remove("is-off");
  }
  tela.classList.remove("is-off");
}

girar(0);

if (reduzirMovimento) {
  // sem animação: mostra a tela já consertada
  tela.classList.add("is-fixed", "show-notif");
} else {
  // só anima enquanto o iPhone está na tela
  new IntersectionObserver(([entrada]) => {
    telaVisivel = entrada.isIntersecting;
    if (telaVisivel) cicloAutomatico();
    else geracao++;
  }).observe(document.querySelector(".showcase"));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) geracao++;
    else if (telaVisivel) cicloAutomatico();
  });
}

/* ---------- logo oficial: usa assets/imagens/logo.png quando existir ---------- */

// aceita logo.png, logo.jpg, logo.jpeg ou logo.webp; a mesma imagem vira o favicon
// da aba e o ícone ao salvar o site na tela do celular
const NOMES_DA_LOGO = ["logo.png", "logo.jpg", "logo.jpeg", "logo.webp"];

function usarLogo(src) {
  document.querySelectorAll(".logo-badge").forEach((img) => (img.src = src));
  document.querySelectorAll(".logo, .footer-brand").forEach((el) => el.classList.add("has-badge"));

  const favicon = document.querySelector('link[rel="icon"]');
  favicon.removeAttribute("type");
  favicon.href = src;
  const icone = document.createElement("link");
  icone.rel = "apple-touch-icon";
  icone.href = src;
  document.head.appendChild(icone);
}

(function procurarLogo(i) {
  if (i >= NOMES_DA_LOGO.length) return;
  const teste = new Image();
  teste.onload = () => usarLogo(teste.src);
  teste.onerror = () => procurarLogo(i + 1);
  teste.src = `assets/imagens/${NOMES_DA_LOGO[i]}`;
})(0);

/* ---------- lojas: mapa e loja mais perto ---------- */

const lojas = [...document.querySelectorAll("#store-list .store")];
const listaLojas = document.getElementById("store-list");
const mapa = document.getElementById("store-map");
const botaoLocalizar = document.getElementById("locate");
const statusLocal = document.getElementById("locate-status");

const urlDoMapa = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&hl=pt-BR&output=embed`;
const urlDaRota = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

function escolherLoja(loja) {
  lojas.forEach((l) => {
    const ativa = l === loja;
    l.classList.toggle("is-active", ativa);
    l.querySelector(".store-pick").setAttribute("aria-pressed", String(ativa));
  });
  const nova = urlDoMapa(loja.dataset.query);
  if (mapa.src !== nova) mapa.src = nova;
}

lojas.forEach((loja) => {
  loja.querySelector(".store-route").href = urlDaRota(loja.dataset.query);
  loja.querySelector(".store-pick").addEventListener("click", () => escolherLoja(loja));
});
escolherLoja(lojas[0]);

// distância em linha reta entre dois pontos (fórmula de haversine)
function distanciaKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

const formatarDistancia = (km) =>
  km < 1 ? `${Math.max(10, Math.round(km * 100) * 10)} m` : `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;

botaoLocalizar.addEventListener("click", () => {
  if (!("geolocation" in navigator)) {
    statusLocal.textContent = "Seu navegador não informa a localização. Escolha uma loja na lista.";
    return;
  }
  statusLocal.textContent = "Procurando sua localização…";
  botaoLocalizar.disabled = true;

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      botaoLocalizar.disabled = false;
      const medidas = lojas
        .map((l) => ({ l, km: distanciaKm(coords.latitude, coords.longitude, Number(l.dataset.lat), Number(l.dataset.lng)) }))
        .sort((a, b) => a.km - b.km);

      // reordena a lista da mais perto para a mais longe
      medidas.forEach(({ l, km }, i) => {
        listaLojas.appendChild(l);
        l.querySelector(".store-tags").hidden = false;
        const dist = l.querySelector(".store-dist");
        dist.textContent = `${formatarDistancia(km)} de você`;
        dist.hidden = false;
        l.querySelector(".store-near").hidden = i !== 0;
      });

      const maisPerto = medidas[0];
      escolherLoja(maisPerto.l);
      statusLocal.textContent = `A loja mais perto é a da ${maisPerto.l.querySelector("strong").textContent}, a ${formatarDistancia(maisPerto.km)} em linha reta.`;
    },
    (erro) => {
      botaoLocalizar.disabled = false;
      statusLocal.textContent =
        erro.code === 1
          ? "Você não liberou a localização. Escolha uma loja na lista."
          : "Não conseguimos achar sua localização agora. Escolha uma loja na lista.";
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  );
});

document.getElementById("year").textContent = new Date().getFullYear();
