// =====================================================
// Words for the whole site, in English and Urdu.
// t("key") gives the text in the language that is switched on.
// Words like {name} are filled in by t("key", { name: "Badin" }).
// English is the main language. Urdu is an extra switch.
// =====================================================

var lang = "en";

var STR = {
  en: {
    // Menu and top of the page
    nav_map: "Map", nav_water: "Water", nav_soil: "Soil", nav_plan: "Plan", nav_data: "NASA Data",
    nav_what: "What we use", nav_limits: "Limits",
    brand: "Field Shift Sindh",
    hero1: "Right crop.", hero2: "Right water.", hero3: "Right time.",
    hero_p: "Pakistan's farms are running out of water, and their soil is turning salty. Both get worse when farmers water by habit instead of need. We use NASA data to help Sindh farmers water only when their field needs it, spot salt-risk conditions and plan their next crop.",
    hero_short: "NASA data to help Sindh farmers water only when needed, protect their soil from salt and pick their next crop.",
    problem_t: "⚠️ The problem",
    hero_b1: "Do I need to water?", hero_b1x: "Check this week's soil wetness and rain",
    hero_b2: "Is my soil at risk?", hero_b2x: "Check for conditions that build up salt",
    hero_b3: "What should I plant next?", hero_b3x: "Get the top 3 crops for next season",
    hero_map: "🗺️ Or pick your spot on the map",

    // Shared
    lbl_district: "District",
    grp_upper: "Upper Sindh", grp_central: "Central Sindh", grp_lower: "Lower Sindh",
    status_loading: "Getting NASA data for {name}...", status_done: "Results for {name}",
    status_nodata: "NASA data isn't available for these dates yet. Please try again later.",
    status_error: "Couldn't load NASA data. Check your internet and try again.",
    src_power: "NASA POWER", src_om: "Open-Meteo forecast",
    why: "Why:",
    date_note: "Latest NASA data: {d}. Simple rules for exploring options, not final advice.",
    date_range: "NASA data: {a} to {b}. Simple rules for exploring options, not final advice.",
    usual_rain: "Usual for these months: {u} mm",

    // District Explorer (map)
    map_title: "🗺️ District Explorer",
    map_sub: "Click a district marker, or anywhere in Sindh, to choose it for the Water, Soil and Crop Planning tools.",
    map_selected: "Selected district",
    grp_point: "📍 Your point", point_name: "My point, near {near}",
    point_outside: "Please click a spot inside Sindh.",
    map_info: "{region} · {lat}°N, {lon}°E",
    map_go_water: "💧 Check water", map_go_soil: "🌱 Check soil", map_go_plan: "🌾 Plan crop",
    map_how_t: "How the map connects to the tools",
    map_how_1: "Each marker is one of Sindh's 24 districts. Clicking it selects that district in all three tools.",
    map_how_2: "The Water and Soil checks ask NASA POWER for that location's soil wetness, rain and heat.",
    map_how_3: "Crop Planning combines those numbers with NASA climatology, what is normal for each month, to rank the next crops.",
    map_note: "Note: markers show each district's main town, not individual farms. NASA POWER data covers an area about 50 km wide around each point.",

    // Water check
    water_title: "💧 Water check", water_sub: "Should you water your field this week?", btn_water: "Check water",
    cond_week: "This week",
    cond_soil: "Soil wetness", cond_rain: "Rain, last 90 days", cond_rain_next: "Rain, next 3 days",
    adv_wait: "🟢 Wait — the soil is wet enough or rain is coming",
    adv_soon: "🟠 Water soon — the soil is drying",
    adv_now: "🔴 Water now — the soil is dry and no rain is expected",
    why_wait_soil: "Soil wetness is {n}%, above our 50% level, so the roots still have water.",
    why_wait_rain: "{r} mm of rain is forecast for the next 3 days, so let the rain water the field first.",
    why_soon: "Soil wetness is {n}%, between 30% and 50%, and only {r} mm of rain is forecast for the next 3 days.",
    why_soon_na: "Soil wetness is {n}%, between 30% and 50%. The rain forecast isn't available right now.",
    why_now: "Soil wetness is {n}%, below 30%, and only {r} mm of rain is forecast for the next 3 days.",
    why_now_na: "Soil wetness is {n}%, below 30%. The rain forecast isn't available right now.",

    // Soil check
    soil_title: "🌱 Soil check", soil_sub: "Are conditions raising the risk of salt building up in your soil?",
    btn_soil: "Check soil", btn_flood: "🌊 2022 floods example",
    cond_hot: "Hottest day, last 90 days", cond_peak: "Peak soil wetness", cond_hot_flood: "Hottest day",
    cond_rain_flood: "Rain, 15 June – 15 September 2022",
    flood_t: "🌊 Looking back: Dadu during the 2022 floods",
    flood_x: "This uses NASA POWER data from 15 June to 15 September 2022, when floods covered large parts of Sindh. It shows how the tool flags waterlogging and salt risk in a flood year.",
    flood_status: "Dadu, 2022 floods (past data)",
    salt_high_t: "🧂 Salt-risk conditions: High",
    salt_high_x: "Waterlogged fields can pull salt up to the surface as the water dries. Avoid extra watering, and drain standing water where possible.",
    salt_med_t: "🧂 Salt-risk conditions: Medium",
    salt_med_x: "Extreme heat speeds up evaporation, which can leave salt behind in the soil. Water by need, not by habit.",
    salt_low_t: "🧂 Salt-risk conditions: Low",
    salt_low_x: "Current soil wetness and heat are not raising salt risk.",
    why_salt_soil: "Soil wetness is {n}%, above 60%, which is a sign of waterlogging.",
    why_salt_rain: "{r} mm of rain fell, about {x} times the usual {u} mm for these months. Fields can stay waterlogged after rain like this.",
    why_salt_heat: "The hottest day reached {t}°C, above our 42°C level.",
    why_salt_low: "Soil wetness is {n}% (under 60%) and the hottest day was {t}°C (under 42°C).",
    soil_next: "Next: plan your next crop ↓",

    // Plan your next crop
    plan_title: "🌾 Plan your next crop",
    plan_sub: "Pick your district and what is on the field now. We suggest the 3 best crops to grow next, and explain why.",
    lbl_current: "What is growing now (or planned)?",
    opt_none: "Nothing yet / not sure", btn_plan: "Get my plan",
    cond_title: "Your field right now",
    cond_usual: "Usual for {month}: {n}%",
    state_dry: "Dry", state_normal: "Normal", state_wet: "Wet",
    rec_title: "Top 3 crops to grow next", rec_season: "Next season: {season}",
    season_rabi: "Rabi (winter crops)", season_kharif: "Kharif (summer crops)",
    rank_1: "Best fit", rank_2: "Second choice", rank_3: "Third choice",
    score: "Fit score: {n}/100", watch: "Watch out:", sow: "Sowing tip:",
    locked_t: "Sugarcane stays in the field for 12–14 months",
    locked_x: "Wait until it is harvested. Then choose \"Nothing yet\" above to see what suits an empty field.",
    hist_title: "Want a sharper answer?",
    hist_unsure: "We can't pick one clear winner yet. Tell us what grew on this field in recent seasons.",
    hist_opt: "Optional: add your crop history for a sharper answer.",
    hist_1: "Last season", hist_2: "2 seasons ago", hist_3: "3 seasons ago",
    hist_none: "Not sure / none", hist_btn: "Update my plan", hist_applied: "Updated using your crop history",

    // NASA data and limits
    data_title: "NASA data we use",
    data_1: "<strong>GWETROOT:</strong> root-zone soil wetness, top 1 m (NASA POWER, from NASA's MERRA-2 model, ~50 km grid)",
    data_2: "<strong>PRECTOTCORR:</strong> daily rainfall (NASA POWER)",
    data_3: "<strong>T2M_MAX:</strong> daily maximum temperature (NASA POWER)",
    data_4: "<strong>POWER climatology:</strong> typical monthly heat, rain and soil wetness, used to judge what is \"normal\" and whether a crop suits the heat",
    data_5: "<strong>Open-Meteo:</strong> 3-day rain forecast (not NASA data)",
    limits_title: "Limits",
    lim_1: "NASA data gives estimates for an area about 50 km wide, not an individual field.",
    lim_2: "It doesn't show canal water supply, which most Sindh farms depend on.",
    lim_3: "We flag conditions linked to salt risk. We don't measure salt.",
    lim_4: "Crop scores use simple, approximate rules for exploring options, not final advice. Check with a local agriculture expert.",
    foot: "Data: NASA POWER (power.larc.nasa.gov) · Forecast: Open-Meteo · NASA does not endorse this project.",

    // Chat
    chat_toggle: "💬 Ask", chat_head: "🌾 Field Helper", chat_ph: "Ask about water, soil, crops...",

    // Crops
    crop_wheat: "Wheat", crop_rice: "Rice", crop_cotton: "Cotton", crop_sugarcane: "Sugarcane",
    crop_mungbean: "Mungbean", crop_mustard: "Mustard", crop_chickpea: "Chickpea", crop_sorghum: "Sorghum",

    // Reasons on the crop cards
    r_same: "Same crop as {prev}: pests and disease build up.",
    r_legume: "A legume, so it can add nitrogen to the soil after {prev}.",
    r_afterlegume: "Follows a legume, which can leave nitrogen in the soil, so it may need less fertiliser.",
    r_break: "A different crop family from {prev}, which breaks the pest cycle.",
    r_family: "Same crop family as {prev}, so some pests carry over.",
    r_familiar: "A common pairing in Sindh, so it is easy to adopt.",
    r_late: "{prev} harvest can run late, which may delay sowing.",
    r_short: "A shorter crop, so it copes better with a late {prev} harvest.",
    r_popular: "Widely grown in Sindh, so seed and markets are easy to find.",
    r_heat_bad: "Typical highs of {t}°C in {months} are above its {lim}°C comfort limit.",
    r_heat_ok: "Typical highs of {t}°C in {months} suit it.",
    r_dry_good: "Needs little water, which suits the dry soil.",
    r_dry_bad: "Needs a lot of water and the soil is dry.",
    r_wet_log: "The soil is already very wet, which hurts this crop.",
    r_wet_salt: "Very wet soil raises salt risk, and this crop is salt-sensitive.",
    r_hist_family: "You grew the same crop family here recently.",
    r_hist_same: "You grew this exact crop here recently.",
    r_hist_nolegume: "No legume in your recent history, so this can help restore nitrogen.",
    r_fallback: "Fits the current conditions.",
    sow_tip: "Sow in {sow}. Typical highs in {crit}: {t}°C.",
    sow_tip_hot: " That is above its {lim}°C limit, so sow on time rather than late.",
    sow_tip_plain: "Sow in {sow}."
  },

  ur: {
    nav_map: "نقشہ", nav_water: "پانی", nav_soil: "مٹی", nav_plan: "اگلی فصل", nav_data: "ناسا ڈیٹا",
    nav_what: "ہم کیا استعمال کرتے ہیں", nav_limits: "حدود",
    brand: "فیلڈ شفٹ سندھ",
    hero1: "صحیح فصل۔", hero2: "صحیح پانی۔", hero3: "صحیح وقت۔",
    hero_p: "پاکستان کے کھیتوں میں پانی کم ہو رہا ہے اور زمین کھاری ہوتی جا رہی ہے۔ جب کسان ضرورت کے بجائے عادت کے مطابق پانی دیتے ہیں تو دونوں مسائل بڑھ جاتے ہیں۔ ہم ناسا کے ڈیٹا کی مدد سے سندھ کے کسانوں کو صرف ضرورت پر پانی دینے، کھاری پن کے خطرے کو پہچاننے اور اگلی فصل کا منصوبہ بنانے میں مدد دیتے ہیں۔",
    hero_short: "ناسا کا ڈیٹا، تاکہ سندھ کے کسان صرف ضرورت پر پانی دیں، زمین کو نمک سے بچائیں اور اگلی فصل چنیں۔",
    problem_t: "⚠️ مسئلہ",
    hero_b1: "کیا مجھے پانی دینا چاہیے؟", hero_b1x: "اس ہفتے مٹی کی نمی اور بارش دیکھیں",
    hero_b2: "کیا میری زمین خطرے میں ہے؟", hero_b2x: "نمک جمع ہونے والے حالات چیک کریں",
    hero_b3: "اگلی فصل کون سی لگاؤں؟", hero_b3x: "اگلے موسم کی 3 بہترین فصلیں دیکھیں",
    hero_map: "🗺️ یا نقشے پر اپنی جگہ چنیں",

    lbl_district: "ضلع",
    grp_upper: "بالائی سندھ", grp_central: "وسطی سندھ", grp_lower: "زیریں سندھ",
    status_loading: "{name} کے لیے ناسا کا ڈیٹا حاصل کیا جا رہا ہے...", status_done: "{name} کے نتائج",
    status_nodata: "ان تاریخوں کا ناسا ڈیٹا ابھی دستیاب نہیں۔ بعد میں دوبارہ کوشش کریں۔",
    status_error: "ناسا کا ڈیٹا لوڈ نہیں ہو سکا۔ انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔",
    src_power: "ناسا پاور", src_om: "Open-Meteo پیش گوئی",
    why: "وجہ:",
    date_note: "ناسا کا تازہ ترین ڈیٹا: {d}۔ یہ سادہ اصول ہیں، حتمی مشورہ نہیں۔",
    date_range: "ناسا ڈیٹا: {a} سے {b} تک۔ یہ سادہ اصول ہیں، حتمی مشورہ نہیں۔",
    usual_rain: "ان مہینوں میں عام طور پر: {u} ملی میٹر",

    map_title: "🗺️ اضلاع کا نقشہ",
    map_sub: "کسی ضلع کے نشان پر یا سندھ میں کہیں بھی کلک کریں تاکہ وہ جگہ پانی، مٹی اور فصل کے منصوبے، تینوں حصوں میں منتخب ہو جائے۔",
    map_selected: "منتخب ضلع",
    grp_point: "📍 آپ کا مقام", point_name: "میرا مقام، {near} کے قریب",
    point_outside: "براہ کرم سندھ کے اندر کسی جگہ پر کلک کریں۔",
    map_info: "{region} · {lat}°N، {lon}°E",
    map_go_water: "💧 پانی چیک کریں", map_go_soil: "🌱 مٹی چیک کریں", map_go_plan: "🌾 فصل کا منصوبہ",
    map_how_t: "نقشہ باقی حصوں سے کیسے جڑا ہے",
    map_how_1: "ہر نشان سندھ کے 24 اضلاع میں سے ایک ہے۔ اس پر کلک کرنے سے وہ ضلع تینوں حصوں میں منتخب ہو جاتا ہے۔",
    map_how_2: "پانی اور مٹی کی جانچ اس جگہ کے لیے ناسا پاور سے مٹی کی نمی، بارش اور گرمی کا ڈیٹا لیتی ہے۔",
    map_how_3: "فصل کا منصوبہ ان نمبروں کو ناسا کلائمیٹولوجی (ہر مہینے کا معمول) کے ساتھ ملا کر اگلی فصلوں کی درجہ بندی کرتا ہے۔",
    map_note: "نوٹ: نشانات ہر ضلع کے مرکزی شہر کو ظاہر کرتے ہیں، کسی ایک کھیت کو نہیں۔ ناسا پاور کا ڈیٹا ہر نقطے کے گرد تقریباً 50 کلومیٹر کے علاقے کا ہوتا ہے۔",

    water_title: "💧 پانی کی جانچ", water_sub: "کیا اس ہفتے آپ کو کھیت کو پانی دینا چاہیے؟", btn_water: "پانی چیک کریں",
    cond_week: "اس ہفتے",
    cond_soil: "مٹی میں نمی", cond_rain: "پچھلے 90 دنوں کی بارش", cond_rain_next: "اگلے 3 دنوں کی بارش",
    adv_wait: "🟢 رکیں — مٹی میں کافی نمی ہے یا بارش آنے والی ہے",
    adv_soon: "🟠 جلد پانی دیں — مٹی خشک ہو رہی ہے",
    adv_now: "🔴 ابھی پانی دیں — مٹی خشک ہے اور بارش کی امید نہیں",
    why_wait_soil: "مٹی میں نمی {n}% ہے، جو 50% سے زیادہ ہے، اس لیے جڑوں کو ابھی پانی مل رہا ہے۔",
    why_wait_rain: "اگلے 3 دنوں میں {r} ملی میٹر بارش کی پیش گوئی ہے، اس لیے پہلے بارش کو کھیت سیراب کرنے دیں۔",
    why_soon: "مٹی میں نمی {n}% ہے، یعنی 30% اور 50% کے درمیان، اور اگلے 3 دنوں میں صرف {r} ملی میٹر بارش کی پیش گوئی ہے۔",
    why_soon_na: "مٹی میں نمی {n}% ہے، یعنی 30% اور 50% کے درمیان۔ بارش کی پیش گوئی ابھی دستیاب نہیں۔",
    why_now: "مٹی میں نمی {n}% ہے، جو 30% سے کم ہے، اور اگلے 3 دنوں میں صرف {r} ملی میٹر بارش کی پیش گوئی ہے۔",
    why_now_na: "مٹی میں نمی {n}% ہے، جو 30% سے کم ہے۔ بارش کی پیش گوئی ابھی دستیاب نہیں۔",

    soil_title: "🌱 مٹی کی جانچ", soil_sub: "کیا موجودہ حالات سے آپ کی زمین میں نمک جمع ہونے کا خطرہ بڑھ رہا ہے؟",
    btn_soil: "مٹی چیک کریں", btn_flood: "🌊 2022 کے سیلاب کی مثال",
    cond_hot: "پچھلے 90 دنوں کا گرم ترین دن", cond_peak: "مٹی میں سب سے زیادہ نمی", cond_hot_flood: "گرم ترین دن",
    cond_rain_flood: "بارش، 15 جون تا 15 ستمبر 2022",
    flood_t: "🌊 ماضی کی جھلک: 2022 کے سیلاب میں دادو",
    flood_x: "یہ 15 جون سے 15 ستمبر 2022 تک کا ناسا پاور ڈیٹا ہے، جب سیلاب نے سندھ کے بڑے حصے کو ڈبو دیا تھا۔ اس سے پتا چلتا ہے کہ سیلاب کے سال میں یہ ٹول پانی کھڑا ہونے اور کھاری پن کے خطرے کی نشاندہی کیسے کرتا ہے۔",
    flood_status: "دادو، 2022 کا سیلاب (پرانا ڈیٹا)",
    salt_high_t: "🧂 کھاری پن کے حالات: زیادہ",
    salt_high_x: "کھیت میں پانی کھڑا رہے تو سوکھتے وقت نمک زمین کی سطح پر آ سکتا ہے۔ اضافی پانی نہ دیں، اور جہاں ممکن ہو کھڑا پانی نکالیں۔",
    salt_med_t: "🧂 کھاری پن کے حالات: درمیانے",
    salt_med_x: "شدید گرمی سے پانی تیزی سے اڑتا ہے، جس سے مٹی میں نمک رہ سکتا ہے۔ عادت کے بجائے ضرورت کے مطابق پانی دیں۔",
    salt_low_t: "🧂 کھاری پن کے حالات: کم",
    salt_low_x: "مٹی کی موجودہ نمی اور گرمی سے کھاری پن کا خطرہ نہیں بڑھ رہا۔",
    why_salt_soil: "مٹی میں نمی {n}% ہے، جو 60% سے زیادہ ہے۔ یہ کھیت میں پانی کھڑا ہونے کی علامت ہے۔",
    why_salt_rain: "{r} ملی میٹر بارش ہوئی، جو ان مہینوں کی عام بارش {u} ملی میٹر سے تقریباً {x} گنا ہے۔ ایسی بارش کے بعد کھیتوں میں پانی کھڑا رہ سکتا ہے۔",
    why_salt_heat: "گرم ترین دن {t}°C تک پہنچا، جو 42°C سے زیادہ ہے۔",
    why_salt_low: "مٹی میں نمی {n}% ہے (60% سے کم) اور گرم ترین دن {t}°C تھا (42°C سے کم)۔",
    soil_next: "آگے: اپنی اگلی فصل کا منصوبہ بنائیں ↓",

    plan_title: "🌾 اگلی فصل کا منصوبہ",
    plan_sub: "اپنا ضلع اور کھیت میں موجود فصل چنیں۔ ہم اگلی فصل کے لیے 3 بہترین انتخاب اور ان کی وجہ بتائیں گے۔",
    lbl_current: "اس وقت کھیت میں کیا ہے (یا کیا لگانے کا ارادہ ہے)؟",
    opt_none: "ابھی کچھ نہیں / معلوم نہیں", btn_plan: "میرا منصوبہ دکھائیں",
    cond_title: "آپ کے کھیت کی موجودہ حالت",
    cond_usual: "{month} میں عام طور پر: {n}%",
    state_dry: "خشک", state_normal: "معمول کے مطابق", state_wet: "زیادہ گیلی",
    rec_title: "اگلی فصل کے لیے بہترین 3 انتخاب", rec_season: "اگلا موسم: {season}",
    season_rabi: "ربیع (سردیوں کی فصلیں)", season_kharif: "خریف (گرمیوں کی فصلیں)",
    rank_1: "بہترین انتخاب", rank_2: "دوسرا انتخاب", rank_3: "تیسرا انتخاب",
    score: "موزونیت: {n}/100", watch: "خیال رکھیں:", sow: "بوائی کا مشورہ:",
    locked_t: "گنا کھیت میں 12 سے 14 ماہ رہتا ہے",
    locked_x: "کٹائی کا انتظار کریں۔ اس کے بعد اوپر \"ابھی کچھ نہیں\" چنیں تاکہ خالی کھیت کے لیے موزوں فصلیں دیکھ سکیں۔",
    hist_title: "مزید درست جواب چاہیے؟",
    hist_unsure: "ہم ابھی کسی ایک فصل کو واضح طور پر بہتر نہیں کہہ سکتے۔ بتائیں کہ اس کھیت میں پچھلے موسموں میں کیا اگایا گیا۔",
    hist_opt: "اختیاری: مزید درست جواب کے لیے پچھلی فصلوں کی تفصیل شامل کریں۔",
    hist_1: "پچھلا موسم", hist_2: "2 موسم پہلے", hist_3: "3 موسم پہلے",
    hist_none: "معلوم نہیں / کچھ نہیں", hist_btn: "منصوبہ اپ ڈیٹ کریں", hist_applied: "آپ کی فصلوں کی تفصیل کے مطابق اپ ڈیٹ",

    data_title: "ہم ناسا کا کون سا ڈیٹا استعمال کرتے ہیں",
    data_1: "<strong>GWETROOT:</strong> جڑوں والی مٹی (اوپر کا 1 میٹر) میں نمی (ناسا پاور، ناسا کے MERRA-2 ماڈل سے، تقریباً 50 کلومیٹر کا گرڈ)",
    data_2: "<strong>PRECTOTCORR:</strong> روزانہ بارش (ناسا پاور)",
    data_3: "<strong>T2M_MAX:</strong> روزانہ زیادہ سے زیادہ درجہ حرارت (ناسا پاور)",
    data_4: "<strong>پاور کلائمیٹولوجی:</strong> ہر مہینے کی عام گرمی، بارش اور مٹی کی نمی، جس سے \"معمول\" اور فصل کے لیے گرمی کی موزونیت کا اندازہ ہوتا ہے",
    data_5: "<strong>Open-Meteo:</strong> اگلے 3 دن کی بارش کی پیش گوئی (ناسا کا ڈیٹا نہیں)",
    limits_title: "حدود",
    lim_1: "ناسا کا ڈیٹا تقریباً 50 کلومیٹر کے علاقے کا اندازہ دیتا ہے، کسی ایک کھیت کا نہیں۔",
    lim_2: "اس میں نہری پانی کی فراہمی شامل نہیں، جس پر سندھ کے زیادہ تر کھیت انحصار کرتے ہیں۔",
    lim_3: "ہم کھاری پن سے جڑے حالات کی نشاندہی کرتے ہیں، نمک ناپتے نہیں۔",
    lim_4: "فصلوں کے نمبر سادہ اور تقریبی اصولوں پر مبنی ہیں، حتمی مشورہ نہیں۔ مقامی زرعی ماہر سے ضرور پوچھیں۔",
    foot: "ڈیٹا: ناسا پاور (power.larc.nasa.gov) · پیش گوئی: Open-Meteo · ناسا اس منصوبے کی توثیق نہیں کرتا۔",

    chat_toggle: "💬 پوچھیں", chat_head: "🌾 فیلڈ ہیلپر", chat_ph: "",

    crop_wheat: "گندم", crop_rice: "چاول", crop_cotton: "کپاس", crop_sugarcane: "گنا",
    crop_mungbean: "مونگ", crop_mustard: "سرسوں", crop_chickpea: "چنا", crop_sorghum: "جوار",

    r_same: "{prev} والی ہی فصل ہے: کیڑے اور بیماریاں بڑھتی ہیں۔",
    r_legume: "یہ پھلی دار فصل ہے، اس لیے {prev} کے بعد مٹی میں نائٹروجن شامل کر سکتی ہے۔",
    r_afterlegume: "پھلی دار فصل کے بعد آتی ہے، جو مٹی میں نائٹروجن چھوڑ سکتی ہے، اس لیے کھاد کم لگ سکتی ہے۔",
    r_break: "{prev} سے مختلف فصلی خاندان ہے، جس سے کیڑوں کا چکر ٹوٹتا ہے۔",
    r_family: "{prev} کے ساتھ ایک ہی فصلی خاندان ہے، اس لیے کچھ کیڑے آگے چل سکتے ہیں۔",
    r_familiar: "سندھ میں عام جوڑی ہے، اس لیے اپنانا آسان ہے۔",
    r_late: "{prev} کی کٹائی دیر سے ہو سکتی ہے، جس سے بوائی لیٹ ہو سکتی ہے۔",
    r_short: "کم مدت کی فصل ہے، اس لیے {prev} کی دیر سے کٹائی کے باوجود بہتر رہتی ہے۔",
    r_popular: "سندھ میں بہت اگائی جاتی ہے، اس لیے بیج اور منڈی آسانی سے ملتے ہیں۔",
    r_heat_bad: "{months} میں عام طور پر {t}°C درجہ حرارت اس کی {lim}°C کی حد سے زیادہ ہوتا ہے۔",
    r_heat_ok: "{months} میں عام طور پر {t}°C درجہ حرارت اس کے لیے مناسب ہے۔",
    r_dry_good: "اسے کم پانی چاہیے، جو خشک مٹی کے لیے موزوں ہے۔",
    r_dry_bad: "اسے بہت پانی چاہیے اور مٹی خشک ہے۔",
    r_wet_log: "مٹی پہلے ہی بہت گیلی ہے، جو اس فصل کو نقصان دیتی ہے۔",
    r_wet_salt: "بہت گیلی مٹی سے نمک کا خطرہ بڑھتا ہے اور یہ فصل نمک کے لیے حساس ہے۔",
    r_hist_family: "آپ نے حال ہی میں اس کھیت میں اسی خاندان کی فصل اگائی ہے۔",
    r_hist_same: "آپ نے حال ہی میں یہی فصل اس کھیت میں اگائی ہے۔",
    r_hist_nolegume: "آپ کی حالیہ فصلوں میں کوئی پھلی دار فصل نہیں، اس لیے یہ نائٹروجن بحال کرنے میں مدد دے سکتی ہے۔",
    r_fallback: "موجودہ حالات کے مطابق ہے۔",
    sow_tip: "{sow} میں بوئیں۔ {crit} میں عام درجہ حرارت: {t}°C۔",
    sow_tip_hot: " یہ اس کی {lim}°C کی حد سے زیادہ ہے، اس لیے بوائی وقت پر کریں، دیر نہ کریں۔",
    sow_tip_plain: "{sow} میں بوئیں۔"
  }
};

var MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  ur: ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"]
};

// t in one chosen language (the chatbot always uses English)
function tl(l, key, params) {
  var text = (STR[l] && STR[l][key] !== undefined) ? STR[l][key] : STR.en[key];
  if (text === undefined) return key;
  // In Urdu, keep numbers with their units (31°C, 49%, 13/11/2026) in the right order
  if (l === "ur") {
    text = text.replace(/\{(t|lim|n|d|a|b|r|u|x|lat|lon)\}(°C|%|\/100)?/g, function (m) { return "⁦" + m + "⁩"; });
  }
  for (var name in params || {}) {
    text = text.split("{" + name + "}").join(params[name]);
  }
  return text;
}

function t(key, params) { return tl(lang, key, params); }

function monthName(m) { return MONTHS[lang][m - 1]; }

// [10, 11] -> "October–November",  [3, 4] -> "March–April",  [11] -> "November"
function monthRange(list) {
  if (list.length === 1) return monthName(list[0]);
  return monthName(list[0]) + "–" + monthName(list[list.length - 1]);
}

// Numbers with units for the stat cards (Urdu keeps the digits in the right order)
function num(text) { return lang === "ur" ? "⁦" + text + "⁩" : text; }
function mm(v) { return lang === "ur" ? num(v) + " ملی میٹر" : v + " mm"; }
function pct(v) { return num(v + "%"); }
function deg(v) { return num(v + "°C"); }
