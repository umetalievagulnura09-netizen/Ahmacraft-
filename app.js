const $ = x => document.getElementById(x);

let money = 0;
let plots = 0;

const names = {
  ahma: 'AhmaCraft',
  minecraft: 'Minecraft',
  mono: 'Монокрафт',
  kuri: 'Куризикрафт',
  monopoly: 'Монополия'
};

function screen(id) {
  ['menu', 'play', 'chat'].forEach(x =>
    $(x).classList.toggle('hidden', x !== id)
  );
  $('home').classList.toggle('hidden', id === 'menu');
}

function add(label, fn) {
  let b = document.createElement('button');
  b.textContent = label;
  b.onclick = fn;
  $('actions').append(b);
}

function score() {
  $('coins').textContent = '🪙 ' + money;
}

function start(id) {
  screen('play');
  $('title').textContent = names[id];
  $('actions').innerHTML = '';

  let a = $('arena');
  score();

  if (id === 'ahma' || id === 'minecraft') {
    $('info').textContent = 'Добывай блоки и строй свой мир.';
    a.innerHTML = '<div class="emoji">🌳🟩🟫</div><div id="count">Блоки: 0</div>';

    let n = 0;

    add('⛏️ Добыть блок', () => {
      n++;
      money++;
      $('count').textContent = 'Блоки: ' + n;
      score();
    });

    add('🧱 Поставить блок', () => {
      if (n) {
        n--;
        $('count').textContent = 'Блоки: ' + n;
        a.querySelector('.emoji').textContent += '🧱';
      } else {
        alert('Сначала добудь блок!');
      }
    });

  } else if (id === 'mono' || id === 'kuri') {
    $('info').textContent = id === 'mono'
      ? 'Собирай ресурсы и находи сокровища.'
      : 'Исследуй остров и ищи приключения.';

    a.innerHTML = '<div class="emoji">' +
      (id === 'mono' ? '🌍🌲💎' : '🏝️🧭💰') +
      '</div><div id="found">Находки: 0</div><p id="result">Нажми «Исследовать»!</p>';

    let n = 0;

    add('🔎 Исследовать', () => {
      n++;
      money += 2;
      $('found').textContent = 'Находки: ' + n;

      $('result').textContent = [
        'Ты нашёл дерево!',
        'Попался камень!',
        'Нашёл кристалл!',
        'Ты обнаружил сундук!'
      ][Math.floor(Math.random() * 4)];

      score();
    });

  } else {
    $('info').textContent =
      'Упрощённая мини-монополия: бросай кубик и покупай участки.';

    a.innerHTML = '<div class="emoji">🎲🏘️</div>' +
      '<div id="cash">Монеты: ' + money + '</div>' +
      '<div id="plots">Участки: ' + plots + '</div>' +
      '<p id="result">Ты на старте.</p>';

    add('🎲 Бросить кубик', () => {
      let n = 1 + Math.floor(Math.random() * 6);

      if (n >= 4) money += 3;

      $('result').textContent = 'Выпало ' + n +
        (n >= 4 ? '! Бонус +3 монеты.' : '');

      $('cash').textContent = 'Монеты: ' + money;
      score();
    });

    add('🏠 Купить участок (5)', () => {
      if (money >= 5) {
        money -= 5;
        plots++;
        $('result').textContent = 'Участок куплен!';
      } else {
        $('result').textContent = 'Нужно 5 монет.';
      }

      $('cash').textContent = 'Монеты: ' + money;
      $('plots').textContent = 'Участки: ' + plots;
      score();
    });
  }
}

document.querySelectorAll('[data-id]').forEach(b => {
  b.onclick = () => start(b.dataset.id);
});

$('back').onclick = () => screen('menu');
$('home').onclick = () => screen('menu');
$('ai').onclick = () => screen('chat');
$('chatback').onclick = () => screen('menu');

function answer(t) {
  t = t.toLowerCase();

  if (t.includes('привет'))
    return 'Привет! Добро пожаловать в AhmaCraft Games!';

  if (t.includes('блок') || t.includes('крафт'))
    return 'Добывай блоки кнопкой «Добыть блок», затем ставь их в мир.';

  if (t.includes('монопол'))
    return 'Бросай кубик и покупай участки за монеты.';

  if (t.includes('монет'))
    return 'Монеты дают добыча блоков, исследования и бонусы за кубик.';

  if (t.includes('игр'))
    return 'Есть AhmaCraft, Minecraft, Монокрафт, Куризикрафт и Монополия.';

  return 'Я пока простой помощник. Спроси про игры, блоки, монеты или Монополию!';
}

$('form').onsubmit = e => {
  e.preventDefault();

  let q = $('question').value.trim();
  if (!q) return;

  let u = document.createElement('p');
  u.className = 'user';
  u.textContent = q;
  $('messages').append(u);

  $('question').value = '';

  let r = document.createElement('p');
  r.className = 'bot';
  r.textContent = answer(q);
  $('messages').append(r);

  $('messages').scrollTop = $('messages').scrollHeight;
};

screen('menu');