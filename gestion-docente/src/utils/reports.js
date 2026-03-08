import { scaleColor, calcEncargoNote, calcCorteNote, recText } from "./utils";

export { recText } from "./utils";

export function downloadHTML(html, filename) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function htmlShell(title, body) {
  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + '</title><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Roboto",sans-serif;color:#1a1a1a;padding:40px 56px;max-width:820px;margin:auto;font-size:14px;line-height:1.6}h1{font-size:22px;font-weight:700;color:#e7027c;margin-bottom:4px}h2{font-size:15px;font-weight:700;color:#6eb42c;margin-top:28px;margin-bottom:8px;border-bottom:2px solid #6eb42c;padding-bottom:4px}h3{font-size:13px;font-weight:600;margin-top:14px;margin-bottom:4px;color:#333}table{width:100%;border-collapse:collapse;margin:8px 0;font-size:13px}th{text-align:left;padding:6px 10px;background:#f5f5f5;border-bottom:2px solid #ddd;font-weight:600}td{padding:6px 10px;border-bottom:1px solid #eee}tr:nth-child(even){background:#fafafa}.bar-bg{height:10px;background:#eee;border-radius:5px;overflow:hidden}.bar-fill{height:100%;border-radius:5px}ul{padding-left:20px;margin:4px 0}li{margin-bottom:3px}.meta{font-size:13px;color:#555;margin-bottom:2px}.big-num{font-size:36px;font-weight:700;margin:8px 0}.footer{margin-top:40px;padding-top:14px;border-top:1px solid #ddd;font-size:11px;color:#999;text-align:center}.alert{color:#d32f2f}.print-btn{position:fixed;top:16px;right:16px;background:#6eb42c;color:#fff;border:none;border-radius:8px;padding:8px 16px;font-family:"Roboto",sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.15)}@media print{.print-btn{display:none}body{padding:20px 30px}}</style></head><body><button class="print-btn" onclick="window.print()">Imprimir / PDF</button>' + body + '<div class="footer">Prof. Odis &middot; Profesional en diseño gráfico<br>Especialista en pedagogía y docencia<br>ocorzo@areandina.edu.co</div></body></html>';
}

export function barH(v) {
  var p = (v / 5) * 100;
  return '<div class="bar-bg"><div class="bar-fill" style="width:' + p + '%;background:' + scaleColor(v) + '"></div></div>';
}

export function buildCourseReport({ course, selCorte, groupAvg, evaluated, students, encargos, avgByEnc, globalCritAvg, ranking, atRisk, strengths, weaknesses }) {
  var date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  var encR = encargos.map(function (e) { var v = avgByEnc[e.id] || 0; return "<tr><td>" + e.nombre + " (" + e.porcentaje + "%)</td><td style='width:40%'>" + barH(v) + "</td><td style='font-weight:600'>" + v.toFixed(2) + "</td></tr>"; }).join("");
  var critR = Object.entries(globalCritAvg).map(function (pair) { return "<tr><td>" + pair[0] + "</td><td style='width:40%'>" + barH(pair[1]) + "</td><td style='font-weight:600'>" + pair[1].toFixed(2) + "</td></tr>"; }).join("");
  var rankR = ranking.map(function (s, i) { return "<tr><td>" + (i + 1) + "</td><td>" + s.name + "</td><td style='font-weight:700;color:" + (s.final >= 3 ? "#6eb42c" : "#d32f2f") + "'>" + s.final.toFixed(2) + "</td></tr>"; }).join("");
  var alerts = atRisk.length ? "<h2>Alertas académicas</h2><ul>" + atRisk.map(function (s) { return '<li class="alert">' + s.name + " — " + s.final.toFixed(2) + "</li>"; }).join("") + "</ul>" : "";
  var body = "<h1>" + course.name + "</h1><p class='meta'>Grupo " + course.group + " · Semestre " + course.semester + " · Corte " + selCorte + "</p><p class='meta'>" + date + "</p><h2>Resumen</h2><table><tr><td>Promedio del corte</td><td style='font-size:20px;font-weight:700;color:" + (groupAvg >= 3 ? "#6eb42c" : "#d32f2f") + "'>" + groupAvg.toFixed(2) + " / 5.0</td></tr><tr><td>Evaluados</td><td>" + evaluated.length + " de " + students.length + "</td></tr></table><h2>Promedio por encargo</h2><table>" + encR + "</table><h2>Promedio por criterio</h2><table>" + critR + "</table><h2>Fortalezas</h2><ul>" + strengths.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul><h2>Aspectos por mejorar</h2><ul>" + weaknesses.map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ul>" + alerts + "<h2>Ranking</h2><table><thead><tr><th>#</th><th>Estudiante</th><th>Nota</th></tr></thead><tbody>" + rankR + "</tbody></table><h2>Recomendación pedagógica</h2><p>" + recText(groupAvg) + "</p>";
  return { html: htmlShell("Informe " + course.name + " G" + course.group + " C" + selCorte, body), filename: "informe_" + course.group + "_C" + selCorte + ".html" };
}

export function buildDashboardReport({ course, selCorte, groupAvg, evaluated, students, encargos, avgByEnc, globalCritAvg, allFinals, ranking }) {
  var date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  var encR = encargos.map(function (e) { var v = avgByEnc[e.id] || 0; return "<tr><td>" + e.nombre + "</td><td style='width:40%'>" + barH(v) + "</td><td>" + v.toFixed(2) + "</td></tr>"; }).join("");
  var critR = Object.entries(globalCritAvg).map(function (p) { return "<tr><td>" + p[0] + "</td><td style='width:40%'>" + barH(p[1]) + "</td><td>" + p[1].toFixed(2) + "</td></tr>"; }).join("");
  var distD = [1, 2, 3, 4, 5].map(function (v) { return { v: v, c: allFinals.filter(function (x) { return Math.round(x) === v; }).length }; });
  var mx = Math.max.apply(null, distD.map(function (d) { return d.c; }).concat([1]));
  var distR = distD.map(function (d) { return "<tr><td>" + d.v + "</td><td><div class='bar-bg'><div class='bar-fill' style='width:" + ((d.c / mx) * 100) + "%;background:" + scaleColor(d.v) + "'></div></div></td><td>" + d.c + "</td></tr>"; }).join("");
  var rankR = ranking.map(function (s, i) { return "<tr><td>" + (i + 1) + "</td><td>" + s.name + "</td><td style='color:" + (s.final >= 3 ? "#6eb42c" : "#d32f2f") + ";font-weight:700'>" + s.final.toFixed(2) + "</td></tr>"; }).join("");
  var body = "<h1>Dashboard — " + course.name + "</h1><p class='meta'>Grupo " + course.group + " · Sem " + course.semester + " · Corte " + selCorte + " · " + date + "</p><h2>Resumen</h2><table><tr><td>Promedio</td><td style='font-size:20px;font-weight:700;color:" + (groupAvg >= 3 ? "#6eb42c" : "#d32f2f") + "'>" + groupAvg.toFixed(2) + "</td></tr><tr><td>Evaluados</td><td>" + evaluated.length + "/" + students.length + "</td></tr></table><h2>Por encargo</h2><table>" + encR + "</table><h2>Por criterio</h2><table>" + critR + "</table><h2>Distribución</h2><table><thead><tr><th>Nota</th><th></th><th>Cant.</th></tr></thead><tbody>" + distR + "</tbody></table><h2>Ranking</h2><table><thead><tr><th>#</th><th>Estudiante</th><th>Nota</th></tr></thead><tbody>" + rankR + "</tbody></table><h2>Resumen pedagógico</h2><p>" + recText(groupAvg) + "</p>";
  return { html: htmlShell("Dashboard " + course.name, body), filename: "dashboard_" + course.group + "_C" + selCorte + ".html" };
}

export function buildStudentReport({ st, sg, course, selCorte, encargos, groupAvg, avgByCrit }) {
  var fn = calcCorteNote(sg, encargos);
  var date = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
  var det = "";
  encargos.forEach(function (enc) {
    var en = calcEncargoNote(sg[enc.id], enc.criterios);
    var cr = enc.criterios.map(function (c) {
      var v = (sg[enc.id] && sg[enc.id][c.id]) || 0;
      var ga = avgByCrit[enc.id + "__" + c.id] || 0;
      var d = v - ga;
      var ds = d >= 0 ? "+" + d.toFixed(1) : d.toFixed(1);
      return "<tr><td style='padding-left:24px'>" + c.nombre + "</td><td style='width:30%'>" + barH(v) + "</td><td>" + v + "</td><td style='font-size:11px;color:" + (d >= 0 ? "#6eb42c" : "#d32f2f") + "'>" + ds + "</td></tr>";
    }).join("");
    det += "<h3>" + enc.nombre + " — <span style='color:" + (en >= 3 ? "#6eb42c" : "#d32f2f") + "'>" + en.toFixed(2) + "</span> (" + enc.porcentaje + "%)</h3><table>" + cr + "</table>";
  });
  var obs = fn >= 4 ? "Desempeño sobresaliente." : fn >= 3 ? "Aceptable. Reforzar criterios débiles." : "Dificultades. Acompañamiento recomendado.";
  var body = "<h1>Informe individual</h1><p class='meta'>" + course.name + " · Grupo " + course.group + " · Corte " + selCorte + " · " + date + "</p><h2>Estudiante</h2><table><tr><td>Nombre</td><td style='font-weight:600'>" + st.name + "</td></tr><tr><td>ID</td><td>" + st.id + "</td></tr><tr><td>Nota del corte</td><td><span class='big-num' style='color:" + (fn >= 3 ? "#6eb42c" : "#d32f2f") + "'>" + fn.toFixed(2) + "</span> / 5.0</td></tr><tr><td>Promedio grupo</td><td>" + groupAvg.toFixed(2) + "</td></tr></table><h2>Detalle por encargo</h2>" + det + "<h2>Observación</h2><p>" + obs + "</p>";
  return { html: htmlShell("Informe " + st.name, body), filename: "informe_" + st.name.replace(/\s+/g, "_") + "_C" + selCorte + ".html" };
}
