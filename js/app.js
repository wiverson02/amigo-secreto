// app.js — versão simples e limpa
const $ = id => document.getElementById(id);

const friends = [];
let pairs = [];

function renderFriends() {
  $('lista-amigos').textContent = friends.length ? friends.join(', ') : '—';
}

function renderPairs(showHidden = true) {
  const container = $('lista-sorteio');
  container.innerHTML = '';
  if (!pairs.length) return;
  pairs.forEach((p) => {
    const [giver, receiver] = p.split('→').map(s => s && s.trim());
    const div = document.createElement('div');
    div.className = 'pair';
    if (!showHidden) div.classList.add('hidden');
    div.innerHTML = `<span class="giver">${giver}</span><span class="arrow">→</span><span class="receiver">${receiver}</span>`;
    container.appendChild(div);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generatePairs() {
  if (friends.length < 2) return [];
  const src = friends.slice();
  let attempts = 0;
  while (attempts < 2000) {
    const dest = shuffle(src.slice());
    if (!dest.some((d, i) => d === friends[i])) {
      return friends.map((g, i) => `${g} → ${dest[i]}`);
    }
    attempts++;
  }
  return [];
}

function addFriend() {
  const input = $('nome-amigo');
  const name = input.value.trim();
  if (!name) return alert('Digite um nome.');
  if (friends.includes(name)) { input.value = ''; return alert('Nome já adicionado.'); }
  friends.push(name);
  input.value = '';
  input.focus();
  pairs = [];
  $('btn-reveal').disabled = true;
  renderFriends();
  renderPairs(true);
}

function sortear() {
  if (friends.length < 2) return alert('Adicione pelo menos 2 amigos.');
  pairs = generatePairs();
  if (!pairs.length) return alert('Não foi possível gerar o sorteio.');
  renderPairs(false); // renderiza oculto para revelar seq.
  $('btn-reveal').disabled = false;
}

function revealNext() {
  const hidden = document.querySelector('.pair.hidden');
  if (!hidden) { $('btn-reveal').disabled = true; return; }
  hidden.classList.remove('hidden');
  hidden.classList.add('pair-highlight');
  setTimeout(() => hidden.classList.remove('pair-highlight'), 700);
  if (!document.querySelector('.pair.hidden')) $('btn-reveal').disabled = true;
}

function reiniciar() {
  friends.length = 0;
  pairs = [];
  $('nome-amigo').value = '';
  $('btn-reveal').disabled = true;
  renderFriends();
  renderPairs(true);
  $('nome-amigo').focus();
}

document.addEventListener('DOMContentLoaded', () => {
  $('btn-adicionar').addEventListener('click', addFriend);
  $('btn-sortear').addEventListener('click', sortear);
  $('btn-reveal').addEventListener('click', revealNext);
  $('btn-reiniciar').addEventListener('click', reiniciar);
  $('nome-amigo').addEventListener('keypress', (e) => { if (e.key === 'Enter') addFriend(); });
  renderFriends();
  $('btn-reveal').disabled = true;
});

