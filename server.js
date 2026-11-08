const express = require('express'), http = require('http'), { Server } = require('socket.io');
const missions = require('./missions');
const app = express(), srv = http.createServer(app), io = new Server(srv);
app.use(express.static('public'));
const rooms = {};
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);

function active(r) { const n = r.players.length; return n ? r.players[(r.si + r.mi) % n] : null; }
function send(code) {
  const r = rooms[code]; if (!r) return;
  const a = active(r), m = missions[r.mi], s = m && m.steps[r.si];
  r.players.forEach(p => io.to(p.id).emit('state', {
    code, phase: r.phase, players: r.players.map(x => x.name), host: r.players[0] && r.players[0].name,
    me: p.name, score: r.score, log: r.log.slice(-8), mi: r.mi, total: missions.length,
    title: m && m.title, intro: m && m.intro, step: r.si, steps: m && m.steps.length,
    q: s && s.q, who: a && a.name,
    opts: a && a.id === p.id ? r.shown : null
  }));
}
function show(r) { const s = missions[r.mi].steps[r.si]; r.shown = shuffle(s.opts); }

io.on('connection', sock => {
  let code = null;
  sock.on('join', ({ room, name }) => {
    code = String(room || '').trim().toUpperCase().slice(0, 8); name = String(name || '').trim().slice(0, 20);
    if (!code || !name) return;
    const r = rooms[code] = rooms[code] || { players: [], phase: 'lobby', mi: 0, si: 0, score: 0, log: [] };
    if (r.players.some(p => p.name === name)) return sock.emit('err', 'Name schon vergeben');
    r.players.push({ id: sock.id, name }); sock.join(code); send(code);
  });
  sock.on('start', () => {
    const r = rooms[code]; if (!r || r.players[0].id !== sock.id) return;
    Object.assign(r, { phase: 'play', mi: 0, si: 0, score: 0, log: ['Mission gestartet – redet miteinander!'] }); show(r); send(code);
  });
  sock.on('answer', opt => {
    const r = rooms[code]; if (!r || r.phase !== 'play') return;
    const a = active(r); if (!a || a.id !== sock.id) return;
    const s = missions[r.mi].steps[r.si];
    if (opt === s.opts[0]) {
      r.score += 10; r.log.push('✔ ' + a.name + ': ' + s.why);
      if (++r.si >= missions[r.mi].steps.length) { r.si = 0; r.mi++; r.log.push('★ Mission geschafft!'); }
      if (r.mi >= missions.length) r.phase = 'done'; else show(r);
    } else { r.score = Math.max(0, r.score - 3); r.log.push('✘ ' + a.name + ' wählte „' + opt + '“ – das war falsch, bespreche es im Team.'); show(r); }
    send(code);
  });
  sock.on('disconnect', () => {
    const r = rooms[code]; if (!r) return;
    r.players = r.players.filter(p => p.id !== sock.id);
    if (!r.players.length) delete rooms[code]; else send(code);
  });
});
srv.listen(3000, () => console.log('Netzwerk-Rallye auf Port 3000'));
