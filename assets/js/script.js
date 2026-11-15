// ===== Field Shift Sindh: water check, soil (salt-risk) check and crop planner, using NASA POWER =====
// Files: i18n.js (words), data.js (districts and crops), this file (logic), chatbot.js (Field Helper)

var lastResult = null;   // newest NASA result for today (used by the chatbot)
var lastPlan = null;     // newest crop plan (used by the chatbot)
var waterView = null;    // what the water section is showing: { key }
var soilView = null;     // what the soil section is showing: { key, flood }
var planState = null;    // what the planner is showing: { key, prev, hist }

// The 2022 floods example: Dadu, 15 June to 15 September 2022
var FLOOD = { key: "dadu", start: "20220615", end: "20220915" };


// ---------- 1. Small helpers ----------
function makeDate(date) {
    return date.toISOString().slice(0, 10).replaceAll("-", "");   // "20261114"
}

function prettyDate(d) {   // "20261114" -> "14/11/2026"
    return d.slice(6, 8) + "/" + d.slice(4, 6) + "/" + d.slice(0, 4);
}

function setText(id, text) {
    document.getElementById(id).textContent = text;
}

function setHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

function cropName(id) {
    return id === "none" ? t("opt_none") : t("crop_" + id);
}

function districtName(key) {
    var d = districts[key];
    if (key === "myPoint") return t("point_name", { near: districtName(d.near) });
    return lang === "ur" ? d.ur : d.name;
}

function findDistrictIn(text) {   // used by the chatbot
    for (var key in districts) {
        if (text.includes(key) || text.includes(districts[key].name.toLowerCase())) return key;
    }
    return null;
}

// Coloured edge of a result box (left in English, right in Urdu)
function setAccent(id, color) {
    var box = document.getElementById(id);
    box.style.borderLeftColor = color;
    box.style.borderRightColor = color;
}

function whyLine(text) {
    return "<strong>" + t("why") + "</strong> " + text;
}

var MONTH_CODES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];


// ---------- 2. NASA POWER: daily soil wetness, rain and max temperature ----------
async function getNasa(place, start, end) {
    var url = "https://power.larc.nasa.gov/api/temporal/daily/point" +
        "?parameters=GWETROOT,PRECTOTCORR,T2M_MAX&community=AG" +
        "&latitude=" + place.lat + "&longitude=" + place.lon +
        "&start=" + start + "&end=" + end + "&format=JSON";

    var response = await fetch(url);
    if (!response.ok) throw new Error("NASA POWER error " + response.status);
    var data = await response.json();
    return data.properties.parameter;
}

// ---------- 3. NASA POWER climatology: what is "normal" for each month ----------
// Returns { tmax: [12], rain: [12] mm/day or null, soil: [12] or null }, or null if it fails.
var climateCache = {};

async function getClimate(key) {
    if (climateCache[key] !== undefined) return climateCache[key];

    var place = districts[key];
    var base = "https://power.larc.nasa.gov/api/temporal/climatology/point" +
        "?community=AG&latitude=" + place.lat + "&longitude=" + place.lon + "&format=JSON&parameters=";
    var tries = ["T2M_MAX,PRECTOTCORR,GWETROOT", "T2M_MAX,PRECTOTCORR", "T2M_MAX"];

    for (var i = 0; i < tries.length; i++) {
        try {
            var response = await fetch(base + tries[i]);
            if (!response.ok) continue;
            var p = (await response.json()).properties.parameter;
            var c = { tmax: [], rain: [], soil: [] };
            for (var m = 0; m < 12; m++) {
                c.tmax.push(p.T2M_MAX[MONTH_CODES[m]]);
                c.rain.push(p.PRECTOTCORR ? p.PRECTOTCORR[MONTH_CODES[m]] : null);
                c.soil.push(p.GWETROOT ? p.GWETROOT[MONTH_CODES[m]] : null);
            }
            if (c.tmax.some(function (v) { return !(v > -90); })) continue;
            if (c.rain.some(function (v) { return !(v >= 0); })) c.rain = null;
            if (c.soil.some(function (v) { return !(v >= 0); })) c.soil = null;
            climateCache[key] = c;
            return c;
        } catch (error) { /* try the next option */ }
    }
    climateCache[key] = null;
    return null;
}

// ---------- 4. Open-Meteo: rain forecast for the next 3 days (null if it fails) ----------
async function getForecast(place) {
    try {
        var url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.lat +
            "&longitude=" + place.lon + "&daily=precipitation_sum&timezone=Asia/Karachi";
        var response = await fetch(url);
        if (!response.ok) return null;
        var days = (await response.json()).daily.precipitation_sum.slice(0, 3);
        return Math.round(days[0] + days[1] + days[2]);
    } catch (error) {
        return null;
    }
}

// ---------- 5. Turn the daily data into a few numbers (NASA uses -999 for missing days) ----------
function summarise(p, clim) {
    var s = { soil: -1, soilDate: "", peak: -1, rain: 0, hottest: -100, usualRain: null, first: "", last: "" };
    var usual = 0;

    for (var date in p.GWETROOT) {
        if (!s.first) s.first = date;
        s.last = date;
        if (p.GWETROOT[date] >= 0) {
            s.soil = p.GWETROOT[date];
            s.soilDate = date;
            if (p.GWETROOT[date] > s.peak) s.peak = p.GWETROOT[date];
        }
        if (p.PRECTOTCORR[date] >= 0) s.rain += p.PRECTOTCORR[date];
        if (p.T2M_MAX[date] > s.hottest) s.hottest = p.T2M_MAX[date];
        if (clim && clim.rain) usual += clim.rain[Number(date.slice(4, 6)) - 1];   // usual mm per day in that month
    }

    s.rain = Math.round(s.rain);
    s.hottest = Math.round(s.hottest);
    if (clim && clim.rain) s.usualRain = Math.round(usual);
    return s;
}


// ---------- 6. Simple rules ----------
function wateringLevel(soil, rainNext) {
    if (soil >= 0.5 || rainNext >= 5) return "wait";
    if (soil >= 0.3) return "soon";
    return "now";
}
var adviceColor = { wait: "var(--green)", soon: "var(--orange)", now: "var(--red)" };

// Much more rain than usual (at least 150 mm, and 2x normal) can leave fields waterlogged
function veryWetSeason(s) {
    return s.usualRain !== null && s.rain >= 150 && s.rain >= s.usualRain * 2;
}

// soil = the soil wetness to judge (latest value today, or the peak in the flood example)
function saltLevel(soil, s) {
    if (soil >= 0.6) return { level: "high", why: "soil" };
    if (veryWetSeason(s)) return { level: "high", why: "rain" };
    if (s.hottest >= 42) return { level: "med", why: "heat" };
    return { level: "low", why: "low" };
}

// "dry", "normal" or "wet", compared with what is usual for this month when NASA climatology is available
function soilState(soil, usual) {
    if (soil < 0.3) return "dry";
    if (soil >= 0.6) return "wet";
    if (usual) {
        if (soil < usual * 0.75) return "dry";
        if (soil > usual * 1.3) return "wet";
    }
    return "normal";
}

function percent(v) { return Math.round(v * 100); }


// ---------- 7. Get and work out everything for one district (saved, so it's only fetched once) ----------
var cache = {};

async function loadDistrict(key) {
    if (!cache[key]) {
        var place = districts[key];
        var start = new Date();
        start.setDate(start.getDate() - 90);

        var results = await Promise.all([
            getNasa(place, makeDate(start), makeDate(new Date())),
            getClimate(key),
            getForecast(place)
        ]);
        var clim = results[1];
        var s = summarise(results[0], clim);
        if (s.soil < 0) return null;

        var month = new Date().getMonth();   // 0 = January
        var usualSoil = clim && clim.soil ? clim.soil[month] : null;

        cache[key] = {
            key: key, place: place, s: s, clim: clim, rainNext: results[2], usualSoil: usualSoil,
            level: wateringLevel(s.soil, results[2]),
            salt: saltLevel(s.soil, s),
            state: soilState(s.soil, usualSoil)
        };
    }
    lastResult = cache[key];
    return cache[key];
}

// The 2022 floods example (past data, so it is never used by the chatbot or planner)
async function loadFlood() {
    if (!cache.flood2022) {
        var results = await Promise.all([
            getNasa(districts[FLOOD.key], FLOOD.start, FLOOD.end),
            getClimate(FLOOD.key)
        ]);
        var s = summarise(results[0], results[1]);
        if (s.peak < 0) return null;
        cache.flood2022 = { key: FLOOD.key, place: districts[FLOOD.key], s: s, flood: true, salt: saltLevel(s.peak, s) };
    }
    return cache.flood2022;
}


// ---------- 8. Words built from the numbers ----------
function adviceText(r, l) { return tl(l || lang, "adv_" + r.level); }
function saltTitle(r, l) { return tl(l || lang, "salt_" + r.salt.level + "_t"); }
function saltText(r, l) { return tl(l || lang, "salt_" + r.salt.level + "_x"); }

function waterWhy(r, l) {
    var n = percent(r.s.soil);
    if (r.level === "wait") {
        return r.s.soil >= 0.5 ? tl(l || lang, "why_wait_soil", { n: n }) : tl(l || lang, "why_wait_rain", { r: r.rainNext });
    }
    var na = r.rainNext === null ? "_na" : "";
    return tl(l || lang, "why_" + r.level + na, { n: n, r: r.rainNext });
}

function saltWhy(r, l) {
    var s = r.s;
    var soil = r.flood ? s.peak : s.soil;
    var w = r.salt.why;
    if (w === "soil") return tl(l || lang, "why_salt_soil", { n: percent(soil) });
    if (w === "rain") {
        var times = Math.round(s.rain / Math.max(s.usualRain, 1) * 10) / 10;
        return tl(l || lang, "why_salt_rain", { r: s.rain, u: s.usualRain, x: times });
    }
    if (w === "heat") return tl(l || lang, "why_salt_heat", { t: s.hottest });
    return tl(l || lang, "why_salt_low", { n: percent(soil), t: s.hottest });
}

function dateNote(r) {
    if (r.flood) return t("date_range", { a: prettyDate(r.s.first), b: prettyDate(r.s.last) });
    return t("date_note", { d: prettyDate(r.s.soilDate) });
}


// =====================================================
// WATER CHECK
// =====================================================
function showWater() {
    var r = cache[waterView.key];
    setText("waterAnswer", adviceText(r));
    setHtml("waterWhy", whyLine(waterWhy(r)));
    setAccent("waterAnswerBox", adviceColor[r.level]);
    setText("wSoil", pct(percent(r.s.soil)));
    setText("wRainPast", mm(r.s.rain));
    setText("wRainNext", r.rainNext === null ? "n/a" : mm(r.rainNext));
    setText("waterDate", dateNote(r));
    document.getElementById("waterResults").classList.remove("hidden");
}


// =====================================================
// SOIL CHECK (salt-risk conditions)
// =====================================================
function showSoil() {
    var r = soilView.flood ? cache.flood2022 : cache[soilView.key];
    var s = r.s;

    document.getElementById("floodBanner").classList.toggle("hidden", !r.flood);

    setText("sSoilLabel", "🌱 " + t(r.flood ? "cond_peak" : "cond_soil"));
    setText("sSoil", pct(percent(r.flood ? s.peak : s.soil)));
    setText("sTempLabel", "🌡️ " + t(r.flood ? "cond_hot_flood" : "cond_hot"));
    setText("sTemp", deg(s.hottest));
    setText("sRainLabel", "🌧️ " + t(r.flood ? "cond_rain_flood" : "cond_rain"));
    setText("sRainPast", mm(s.rain));
    setText("sRainUsual", s.usualRain === null ? t("src_power") : t("usual_rain", { u: s.usualRain }));

    setText("saltTitle", saltTitle(r));
    setText("saltText", saltText(r));
    setHtml("saltWhy", whyLine(saltWhy(r)));
    setAccent("saltBox", { high: "var(--red)", med: "var(--orange)", low: "var(--green)" }[r.salt.level]);

    setText("soilDate", dateNote(r));
    document.getElementById("soilResults").classList.remove("hidden");
}


// =====================================================
// PLAN YOUR NEXT CROP
// =====================================================

// Which season comes next?
function nextSeason(prev) {
    if (prev === "sugarcane") return "locked";
    if (prev !== "none") return crops[prev].season === "rabi" ? "kharif" : "rabi";
    return new Date().getMonth() + 1 >= 9 ? "rabi" : "kharif";   // empty field: Sep-Dec -> winter crops
}

// Average of the usual monthly highs during a crop's heat-sensitive months
function criticalHeat(c, clim) {
    var sum = 0;
    for (var i = 0; i < c.critical.length; i++) sum += clim.tmax[c.critical[i] - 1];
    return Math.round(sum / c.critical.length * 10) / 10;
}

// Score one crop (0 to 100) and remember the reasons
function scoreCrop(id, prev, r, hist) {
    var c = crops[id];
    var reasons = [];   // { pts, key, params }
    function add(pts, key, params) { reasons.push({ pts: pts, key: key, params: params || {} }); }

    var prevName = prev === "none" ? "" : cropName(prev);
    var prevFamily = prev === "none" ? "" : (prev === "sugarcane" ? "cane" : crops[prev].family);
    var prevLegume = prev !== "none" && prev !== "sugarcane" && crops[prev].legume;

    // a) Rotation rules
    if (prev !== "none") {
        if (prev === id) {
            add(id === "cotton" || id === "mustard" ? -55 : -45, "r_same", { prev: prevName });
        } else if (c.legume && !prevLegume) {
            add(12, "r_legume", { prev: prevName });
        } else if (!c.legume && prevLegume) {
            add(10, "r_afterlegume");
        } else if (c.family === prevFamily) {
            add(-8, "r_family", { prev: prevName });
        } else {
            add(8, "r_break", { prev: prevName });
        }

        if (familiarPairs.indexOf(prev + ">" + id) >= 0) add(15, "r_familiar");

        if ((prev === "cotton" || prev === "rice") && id === "wheat") add(-4, "r_late", { prev: prevName });
        if ((prev === "cotton" || prev === "rice") && id === "mustard") add(3, "r_short", { prev: prevName });
    }

    // b) Easy to adopt: widely grown crops
    if (c.popular > 0) add(c.popular, "r_popular");

    // c) Heat during the crop's sensitive months (NASA POWER climatology)
    if (r.clim) {
        var avg = criticalHeat(c, r.clim);
        var months = monthRange(c.critical);
        if (avg > c.heatLimit) {
            add(-Math.min(25, Math.round((avg - c.heatLimit) * 5)), "r_heat_bad", { t: avg, months: months, lim: c.heatLimit });
        } else if (avg <= c.heatLimit - 3) {
            add(4, "r_heat_ok", { t: avg, months: months });
        }
    }

    // d) Water: how dry or wet the soil is now (NASA POWER)
    if (r.state === "dry") {
        if (c.water === "veryhigh") add(-16, "r_dry_bad");
        else if (c.water === "high") add(-8, "r_dry_bad");
        else if (c.water === "medium") add(-4, "r_dry_bad");
        else add(4, "r_dry_good");
    } else if (r.state === "wet") {
        if (c.waterlog) add(-10, "r_wet_log");
        if (c.saltSensitive) add(-8, "r_wet_salt");
    }

    // e) The farmer's own crop history (only when they filled it in)
    if (hist) {
        var weights = [14, 9, 5];
        var anyLegume = false;
        for (var h = 0; h < hist.length; h++) {
            if (hist[h] === "none") continue;
            var hf = hist[h] === "sugarcane" ? "cane" : crops[hist[h]].family;
            if (hist[h] !== "sugarcane" && crops[hist[h]].legume) anyLegume = true;
            if (hf === c.family) add(-weights[h], "r_hist_family");
            if (hist[h] === id) add(-6, "r_hist_same");
        }
        if (!anyLegume && c.legume) add(12, "r_hist_nolegume");
    }

    var total = 60;
    for (var k = 0; k < reasons.length; k++) total += reasons[k].pts;
    total = Math.max(0, Math.min(100, Math.round(total)));
    return { id: id, score: total, reasons: reasons };
}

// Rank the crops for the next season
function makePlan(r, prev, hist) {
    var season = nextSeason(prev);
    if (season === "locked") return { locked: true, season: season, ranked: [], unsure: false };

    var ranked = [];
    for (var id in crops) {
        if (crops[id].season === season) ranked.push(scoreCrop(id, prev, r, hist));
    }
    ranked.sort(function (a, b) { return b.score - a.score; });

    // Not sure? Empty field, a close call, or a weak winner -> ask for crop history
    var unsure = !hist && (prev === "none" || ranked[0].score < 55 ||
        (ranked.length > 1 && ranked[0].score - ranked[1].score < 6));

    return { locked: false, season: season, ranked: ranked.slice(0, 3), unsure: unsure, fromHistory: !!hist };
}

function reasonText(rs) { return t(rs.key, rs.params); }

function whyText(item) {
    var best = null;
    for (var i = 0; i < item.reasons.length; i++) {
        if (item.reasons[i].pts > 0 && (!best || item.reasons[i].pts > best.pts)) best = item.reasons[i];
    }
    return best ? reasonText(best) : t("r_fallback");
}

function watchText(item) {
    var worst = null;
    for (var i = 0; i < item.reasons.length; i++) {
        if (item.reasons[i].pts <= -8 && (!worst || item.reasons[i].pts < worst.pts)) worst = item.reasons[i];
    }
    return worst ? reasonText(worst) : "";
}

function sowText(id, r) {
    var c = crops[id];
    var sow = monthRange(c.sow);
    if (!r.clim) return t("sow_tip_plain", { sow: sow });

    var avg = criticalHeat(c, r.clim);
    var text = t("sow_tip", { sow: sow, crit: monthRange(c.critical), t: avg });
    if (avg > c.heatLimit) text += t("sow_tip_hot", { lim: c.heatLimit });
    return text;
}

function drawConditions(r) {
    var usualNote = r.usualSoil ? "<span>" + t("cond_usual", { month: monthName(new Date().getMonth() + 1), n: percent(r.usualSoil) }) + "</span>" : "";

    setHtml("planConditions",
        "<h3 class='block-title'>" + t("cond_title") + "</h3>" +
        "<div class='stats'>" +
            "<div class='stat'><p>🌱 " + t("cond_soil") + "</p><h4>" + pct(percent(r.s.soil)) + "</h4>" +
                "<em class='pill " + r.state + "'>" + t("state_" + r.state) + "</em>" + usualNote + "</div>" +
            "<div class='stat'><p>🌧️ " + t("cond_rain") + "</p><h4>" + mm(r.s.rain) + "</h4><span>" + t("src_power") + "</span></div>" +
            "<div class='stat'><p>🌡️ " + t("cond_hot") + "</p><h4>" + deg(r.s.hottest) + "</h4><span>" + t("src_power") + "</span></div>" +
        "</div>");
}

function drawRecommendations(r, plan) {
    if (plan.locked) {
        setHtml("planRecs", "<div class='locked'><h3>🌿 " + t("locked_t") + "</h3><p>" + t("locked_x") + "</p></div>");
        return;
    }

    var html = "<h3 class='block-title'>" + t("rec_title") + "</h3>" +
        "<p class='season'>" + t("rec_season", { season: t("season_" + plan.season) }) +
        (plan.fromHistory ? " · <strong>" + t("hist_applied") + "</strong>" : "") + "</p><div class='crops'>";

    for (var i = 0; i < plan.ranked.length; i++) {
        var item = plan.ranked[i];
        var watch = watchText(item);
        html += "<div class='crop" + (i === 0 ? " best" : "") + "'>" +
            "<span class='tag'>" + (i === 0 ? "✅ " : "#" + (i + 1) + " · ") + t("rank_" + (i + 1)) + "</span>" +
            "<h4>" + cropName(item.id) + "</h4>" +
            "<div class='bar'><div style='width:" + item.score + "%'></div></div>" +
            "<p class='score'>" + t("score", { n: item.score }) + "</p>" +
            "<p>" + whyLine(whyText(item)) + "</p>" +
            (watch ? "<p class='watch'><strong>" + t("watch") + "</strong> " + watch + "</p>" : "") +
            "<p class='sow'><strong>" + t("sow") + "</strong> " + sowText(item.id, r) + "</p></div>";
    }
    setHtml("planRecs", html + "</div>");
}

function cropOptions(selected, withNone) {
    var html = "<option value='none'>" + (withNone ? t("hist_none") : t("opt_none")) + "</option>";
    for (var i = 0; i < currentOptions.length; i++) {
        var id = currentOptions[i];
        html += "<option value='" + id + "'" + (id === selected ? " selected" : "") + ">" + cropName(id) + "</option>";
    }
    return html;
}

function drawHistory(plan) {
    if (plan.locked) { setHtml("planHistory", ""); return; }

    var old = planState.hist || ["none", "none", "none"];
    var html = "<div class='history" + (plan.unsure ? " unsure" : "") + "'>" +
        "<h3>" + t("hist_title") + "</h3><p>" + (plan.unsure ? t("hist_unsure") : t("hist_opt")) + "</p><div class='hist-row'>";
    for (var i = 0; i < 3; i++) {
        html += "<label>" + t("hist_" + (i + 1)) + "<select id='hist" + i + "'>" + cropOptions(old[i], true) + "</select></label>";
    }
    html += "</div><button id='histBtn' type='button'>" + t("hist_btn") + "</button></div>";
    setHtml("planHistory", html);

    document.getElementById("histBtn").addEventListener("click", function () {
        planState.hist = [0, 1, 2].map(function (i) { return document.getElementById("hist" + i).value; });
        showPlan();
    });
}

function showPlan() {
    var r = cache[planState.key];
    var plan = makePlan(r, planState.prev, planState.hist);
    lastPlan = plan;
    lastPlan.prev = planState.prev;

    drawConditions(r);
    drawRecommendations(r, plan);
    drawHistory(plan);
    setText("planDate", dateNote(r));
    document.getElementById("planResults").classList.remove("hidden");
}


// ---------- 9. Runs when a button is clicked ----------
async function runCheck(selectId, statusId, onDone) {
    var key = document.getElementById(selectId).value;
    setText(statusId, t("status_loading", { name: districtName(key) }));

    try {
        var r = await loadDistrict(key);
        if (!r) {
            setText(statusId, t("status_nodata"));
            return;
        }
        onDone(key);
        setText(statusId, t("status_done", { name: districtName(key) }));
    } catch (error) {
        setText(statusId, t("status_error"));
        console.error(error);
    }
}

document.getElementById("waterBtn").addEventListener("click", function () {
    runCheck("waterDistrict", "waterStatus", function (key) {
        waterView = { key: key };
        showWater();
    });
});

document.getElementById("soilBtn").addEventListener("click", function () {
    runCheck("soilDistrict", "soilStatus", function (key) {
        soilView = { key: key, flood: false };
        showSoil();
    });
});

document.getElementById("floodBtn").addEventListener("click", async function () {
    setText("soilStatus", t("status_loading", { name: t("flood_status") }));
    try {
        var r = await loadFlood();
        if (!r) { setText("soilStatus", t("status_nodata")); return; }
        soilView = { key: FLOOD.key, flood: true };
        showSoil();
        setText("soilStatus", t("status_done", { name: t("flood_status") }));
    } catch (error) {
        setText("soilStatus", t("status_error"));
        console.error(error);
    }
});

document.getElementById("planBtn").addEventListener("click", function () {
    runCheck("planDistrict", "planStatus", function (key) {
        planState = { key: key, prev: document.getElementById("planCrop").value, hist: null };
        showPlan();
    });
});


// =====================================================
// ENGLISH / URDU SWITCH
// =====================================================
function districtOptions(selected) {
    var groups = { point: "grp_point", upper: "grp_upper", central: "grp_central", lower: "grp_lower" };
    var html = "";
    for (var g in groups) {
        if (g === "point" && !districts.myPoint) continue;   // only when a point was picked on the map
        html += "<optgroup label='" + t(groups[g]) + "'>";
        for (var key in districts) {
            if (districts[key].group === g) {
                html += "<option value='" + key + "'" + (key === selected ? " selected" : "") + ">" + districtName(key) + "</option>";
            }
        }
        html += "</optgroup>";
    }
    return html;
}

function fillSelects() {
    var ids = ["waterDistrict", "soilDistrict", "planDistrict"];
    for (var i = 0; i < ids.length; i++) {
        var el = document.getElementById(ids[i]);
        el.innerHTML = districtOptions(el.value || "badin");
    }
    var crop = document.getElementById("planCrop");
    crop.innerHTML = cropOptions(crop.value || "none", false);
}

function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ur" ? "rtl" : "ltr";

    var plain = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < plain.length; i++) plain[i].textContent = t(plain[i].getAttribute("data-i18n"));

    var rich = document.querySelectorAll("[data-i18n-html]");
    for (var j = 0; j < rich.length; j++) rich[j].innerHTML = t(rich[j].getAttribute("data-i18n-html"));

    document.getElementById("langEn").classList.toggle("on", l === "en");
    document.getElementById("langUr").classList.toggle("on", l === "ur");

    // Field Helper only answers in English, so it is hidden in Urdu
    document.getElementById("chatToggle").classList.toggle("hidden", l === "ur");
    if (l === "ur") document.getElementById("chatBox").classList.add("hidden");

    fillSelects();
    if (typeof refreshMap === "function") refreshMap();

    // Redraw anything already on screen in the new language
    if (waterView) {
        setText("waterStatus", t("status_done", { name: districtName(waterView.key) }));
        showWater();
    }
    if (soilView) {
        setText("soilStatus", t("status_done", { name: soilView.flood ? t("flood_status") : districtName(soilView.key) }));
        showSoil();
    }
    if (planState) {
        setText("planStatus", t("status_done", { name: districtName(planState.key) }));
        showPlan();
    }
}

document.getElementById("langEn").addEventListener("click", function () { setLang("en"); });
document.getElementById("langUr").addEventListener("click", function () { setLang("ur"); });

setLang("en");
