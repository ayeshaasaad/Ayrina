// =====================================================
// Fixed facts: Sindh districts and the crops we compare.
// Crop numbers below are APPROXIMATE agronomy rules of thumb.
// Check them with a local agriculture source before relying on them.
// =====================================================

// 1. Districts (main town coordinates). group = upper / central / lower
var districts = {
    jacobabad:         { name: "Jacobabad",           ur: "جیکب آباد",            group: "upper",   lat: 28.28, lon: 68.44 },
    kashmore:          { name: "Kashmore",            ur: "کشمور",                group: "upper",   lat: 28.24, lon: 69.18 },
    shikarpur:         { name: "Shikarpur",           ur: "شکارپور",              group: "upper",   lat: 27.96, lon: 68.64 },
    ghotki:            { name: "Ghotki",              ur: "گھوٹکی",               group: "upper",   lat: 28.01, lon: 69.32 },
    sukkur:            { name: "Sukkur",              ur: "سکھر",                 group: "upper",   lat: 27.70, lon: 68.86 },
    larkana:           { name: "Larkana",             ur: "لاڑکانہ",              group: "upper",   lat: 27.56, lon: 68.21 },
    qambar:            { name: "Qambar Shahdadkot",   ur: "قمبر شہداد کوٹ",       group: "upper",   lat: 27.59, lon: 68.00 },
    khairpur:          { name: "Khairpur",            ur: "خیرپور",               group: "upper",   lat: 27.53, lon: 68.76 },
    dadu:              { name: "Dadu",                ur: "دادو",                 group: "central", lat: 26.73, lon: 67.78 },
    naushahroferoze:   { name: "Naushahro Feroze",    ur: "نوشہرو فیروز",         group: "central", lat: 26.84, lon: 68.12 },
    nawabshah:         { name: "Shaheed Benazirabad", ur: "شہید بینظیر آباد",     group: "central", lat: 26.24, lon: 68.41 },
    sanghar:           { name: "Sanghar",             ur: "سانگھڑ",               group: "central", lat: 26.05, lon: 68.95 },
    matiari:           { name: "Matiari",             ur: "مٹیاری",               group: "central", lat: 25.60, lon: 68.45 },
    jamshoro:          { name: "Jamshoro",            ur: "جامشورو",              group: "central", lat: 25.43, lon: 68.28 },
    hyderabad:         { name: "Hyderabad",           ur: "حیدرآباد",             group: "lower",   lat: 25.39, lon: 68.37 },
    tandoallahyar:     { name: "Tando Allahyar",      ur: "ٹنڈو الہ یار",         group: "lower",   lat: 25.46, lon: 68.72 },
    tandomuhammadkhan: { name: "Tando Muhammad Khan", ur: "ٹنڈو محمد خان",        group: "lower",   lat: 25.12, lon: 68.54 },
    mirpurkhas:        { name: "Mirpur Khas",         ur: "میرپورخاص",            group: "lower",   lat: 25.53, lon: 69.01 },
    umerkot:           { name: "Umerkot",             ur: "عمر کوٹ",              group: "lower",   lat: 25.36, lon: 69.74 },
    tharparkar:        { name: "Tharparkar",          ur: "تھرپارکر",             group: "lower",   lat: 24.74, lon: 69.80 },
    badin:             { name: "Badin",               ur: "بدین",                 group: "lower",   lat: 24.66, lon: 68.84 },
    thatta:            { name: "Thatta",              ur: "ٹھٹھہ",                group: "lower",   lat: 24.75, lon: 67.92 },
    sujawal:           { name: "Sujawal",             ur: "سجاول",                group: "lower",   lat: 24.61, lon: 68.07 },
    malir:             { name: "Malir",               ur: "ملیر",                 group: "lower",   lat: 24.95, lon: 67.20 }
};

// 2. Crops we can recommend.
//   season   : rabi (winter, sown Oct-Dec) or kharif (summer, sown Apr-Aug)
//   family   : crops in one family share pests and diseases
//   legume   : can add nitrogen to the soil through its roots
//   water    : low / medium / high / veryhigh
//   sow      : usual sowing months
//   critical : months when heat hurts most (flowering / grain fill)
//   heatLimit: typical monthly high (°C) above which the crop struggles
//   popular  : extra points for crops that are widely grown (seed and market are easy)
var crops = {
    wheat:    { season: "rabi",   family: "cereal",   legume: false, water: "medium",   sow: [11],     critical: [2, 3],    heatLimit: 32, popular: 12 },
    mustard:  { season: "rabi",   family: "brassica", legume: false, water: "low",      sow: [10, 11], critical: [2, 3],    heatLimit: 30, popular: 2 },
    chickpea: { season: "rabi",   family: "legume",   legume: true,  water: "low",      sow: [10, 11], critical: [2, 3],    heatLimit: 33, popular: 0, waterlog: true },
    rice:     { season: "kharif", family: "cereal",   legume: false, water: "veryhigh", sow: [6, 7],   critical: [9],       heatLimit: 35, popular: 6, saltSensitive: true },
    cotton:   { season: "kharif", family: "cotton",   legume: false, water: "high",     sow: [4, 5],   critical: [7, 8, 9], heatLimit: 38, popular: 8 },
    mungbean: { season: "kharif", family: "legume",   legume: true,  water: "low",      sow: [7, 8],   critical: [8],       heatLimit: 38, popular: 2, waterlog: true },
    sorghum:  { season: "kharif", family: "cereal",   legume: false, water: "low",      sow: [6, 7],   critical: [7, 8],    heatLimit: 40, popular: 2 }
};

// Sugarcane can be the current crop, but it stays 12-14 months, so we never recommend it.
var currentOptions = ["wheat", "mustard", "chickpea", "rice", "cotton", "mungbean", "sorghum", "sugarcane"];
var cropFamilyOf = { sugarcane: "cane" };

// Pairs farmers in Sindh already use a lot. They get a bonus so advice stays close to current practice.
var familiarPairs = ["rice>wheat", "wheat>rice", "cotton>wheat", "wheat>cotton", "mustard>cotton", "mustard>rice"];
