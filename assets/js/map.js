// =====================================================
// District Explorer: an interactive map of Sindh's 24 districts.
// Uses the Leaflet library (assets/vendor/leaflet) and the
// district list in data.js. Clicking a marker selects that
// district in the Water, Soil and Crop Planning tools.
// =====================================================

var regionColor = { upper: "#F59E0B", central: "#22C55E", lower: "#3B82F6", point: "#FC3D21" };
var regionKey = { upper: "grp_upper", central: "grp_central", lower: "grp_lower", point: "grp_point" };
var toolSelects = ["waterDistrict", "soilDistrict", "planDistrict"];

var map = null;
var markers = {};
var selectedKey = null;


// ---------- 1. Marker styles ----------
function markerStyle(key) {
    var on = key === selectedKey;
    return {
        radius: on ? 13 : 8,
        color: on ? "#FFFFFF" : "#0A0F1E",
        weight: on ? 4 : 1.5,
        fillColor: regionColor[districts[key].group],
        fillOpacity: on ? 1 : 0.85,
        bubblingMouseEvents: false   // clicking a marker doesn't also count as clicking the map
    };
}


// ---------- 2. Select a district everywhere ----------
function selectDistrict(key) {
    selectedKey = key;

    // The same district in all three tools
    for (var i = 0; i < toolSelects.length; i++) {
        document.getElementById(toolSelects[i]).value = key;
    }

    // Highlight its marker
    for (var k in markers) {
        markers[k].setStyle(markerStyle(k));
    }
    if (markers[key]) markers[key].bringToFront();

    // Panel next to the map
    var d = districts[key];
    setText("mapName", districtName(key));
    setText("mapInfo", t("map_info", { region: t(regionKey[d.group]), lat: d.lat.toFixed(2), lon: d.lon.toFixed(2) }));
    document.querySelector(".map-pick").style.borderColor = regionColor[d.group];
}


// ---------- 3. Names in the current language (called by setLang in script.js) ----------
function refreshMap() {
    if (!map) return;
    for (var key in markers) {
        markers[key].setTooltipContent(districtName(key));
    }
    if (selectedKey) selectDistrict(selectedKey);
}


// ---------- 4. Build the map ----------
function buildMap() {
    if (typeof L === "undefined") {   // Leaflet didn't load: the panel and buttons still work
        selectDistrict(document.getElementById("waterDistrict").value || "badin");
        return;
    }

    map = L.map("map", { scrollWheelZoom: false, zoomSnap: 0.25 });

    // Background: Esri satellite imagery with place names (no API key needed).
    // If it fails to load, switch to OpenStreetMap.
    var esri = "https://server.arcgisonline.com/ArcGIS/rest/services/";
    var satellite = L.tileLayer(esri + "World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 12,
        attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics"
    }).addTo(map);
    var labels = L.tileLayer(esri + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 12
    }).addTo(map);

    var failed = 0;
    satellite.on("tileerror", function () {
        failed++;
        if (failed === 3) {
            map.removeLayer(satellite);
            map.removeLayer(labels);
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 12,
                attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            }).addTo(map);
        }
    });

    var points = [];
    for (var key in districts) {
        var d = districts[key];
        points.push([d.lat, d.lon]);

        markers[key] = L.circleMarker([d.lat, d.lon], markerStyle(key))
            .bindTooltip(districtName(key), { direction: "top", offset: [0, -8] })
            .addTo(map);

        markers[key].on("click", (function (k) {
            return function () { selectDistrict(k); };
        })(key));
    }

    map.fitBounds(points, { padding: [30, 30] });

    // Click anywhere on the map to use that exact spot
    map.on("click", function (e) {
        pickPoint(e.latlng.lat, e.latlng.lng);
    });

    // Picking from a dropdown also moves the highlight on the map
    for (var i = 0; i < toolSelects.length; i++) {
        document.getElementById(toolSelects[i]).addEventListener("change", function () {
            selectDistrict(this.value);
        });
    }

    selectDistrict(document.getElementById("waterDistrict").value || "badin");
}


// ---------- 5. Pick any spot in Sindh ----------
var SINDH = { south: 23.6, north: 28.6, west: 66.6, east: 71.2 };   // a box around Sindh

function nearestDistrict(lat, lon) {
    var best = null, bestDist = Infinity;
    for (var key in districts) {
        if (key === "myPoint") continue;
        var d = (districts[key].lat - lat) * (districts[key].lat - lat) + (districts[key].lon - lon) * (districts[key].lon - lon);
        if (d < bestDist) { bestDist = d; best = key; }
    }
    return best;
}

function pickPoint(lat, lon) {
    if (lat < SINDH.south || lat > SINDH.north || lon < SINDH.west || lon > SINDH.east) {
        setText("mapInfo", t("point_outside"));
        return;
    }

    lat = Math.round(lat * 100) / 100;
    lon = Math.round(lon * 100) / 100;

    // Forget the old point's NASA data, so the new spot gets fresh data
    delete cache.myPoint;
    delete climateCache.myPoint;
    if (markers.myPoint) map.removeLayer(markers.myPoint);

    districts.myPoint = { name: "My point", ur: "میرا مقام", group: "point", lat: lat, lon: lon, near: nearestDistrict(lat, lon) };

    markers.myPoint = L.circleMarker([lat, lon], markerStyle("myPoint"))
        .bindTooltip(districtName("myPoint"), { direction: "top", offset: [0, -8] })
        .addTo(map);
    markers.myPoint.on("click", function () { selectDistrict("myPoint"); });

    fillSelects();               // adds "My point" to the 3 dropdowns
    selectDistrict("myPoint");
}


// ---------- 6. Buttons under the selected district ----------
var goTo = {
    water: { section: "water", button: "waterBtn" },
    soil:  { section: "soilcheck", button: "soilBtn" },
    plan:  { section: "plan", button: "planBtn" }
};

var goButtons = document.querySelectorAll(".map-go button");
for (var g = 0; g < goButtons.length; g++) {
    goButtons[g].addEventListener("click", function () {
        var target = goTo[this.getAttribute("data-go")];
        document.getElementById(target.section).scrollIntoView({ behavior: "smooth" });
        document.getElementById(target.button).click();
    });
}

buildMap();
