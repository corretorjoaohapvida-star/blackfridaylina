'use strict';
(() => {
  const clock = document.getElementById('black-friday-clock');
  if (!clock) return;
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo', hourCycle: 'h23',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const fields = ['hours', 'minutes', 'seconds'].map(name => clock.querySelector('[data-clock="' + name + '"]'));
  function update() {
    const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(part => [part.type, part.value]));
    const remaining = 86400 - (Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second));
    const values = [Math.floor(remaining / 3600), Math.floor(remaining % 3600 / 60), remaining % 60];
    fields.forEach((field, index) => { field.textContent = String(values[index]).padStart(2, '0'); });
  }
  update();
  setInterval(() => { if (!document.hidden) update(); }, 1000);
  document.addEventListener('visibilitychange', update);
})();
