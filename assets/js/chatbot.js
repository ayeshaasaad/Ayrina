// =====================================================
// Field Helper chatbot (English only)
// Answers questions using the NASA results from script.js.
// It works with keyword rules, so it needs no AI or API key,
// and every answer comes from real data or fixed facts.
// =====================================================


// ---------- 1. Facts about each crop ----------
var cropFacts = {
    rice: "Rice needs the most water, about 1,500 mm per season in Sindh. Its fields are kept flooded, which can raise salt risk.",
    wheat: "Wheat is the main winter (Rabi) crop. It needs about 400–450 mm of water per season, and extreme heat in March–April can harm it.",
    sorghum: "Sorghum (jowar) needs much less water than rice and can be used as animal fodder, so it's a safer choice in dry years.",
    mungbean: "Mungbean (moong) is a short legume crop that can add nitrogen to the soil through its roots. It can fill the gap between wheat and rice.",
    cotton: "Cotton is Sindh's main summer cash crop. It is pest-prone, so growing it again and again in the same field is a bad idea.",
    mustard: "Mustard is a winter oil crop that needs little water and has a short season. Don't grow it after another mustard or brassica crop.",
    chickpea: "Chickpea (chana) is a winter legume that can add nitrogen to the soil. It needs little water but dislikes waterlogged fields."
};


// ---------- 2. Add a message to the chat ----------
function addMessage(text, who) {
    var msg = document.createElement("div");
    msg.className = "msg " + who;
    msg.textContent = text;   // textContent keeps it safe from typed HTML
    var box = document.getElementById("chatMessages");
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}


// ---------- 3. Quick-question buttons ----------
var chips = ["Should I water?", "Salt risk?", "What should I grow next?", "Where is the data from?"];

function showChips() {
    var html = "";
    for (var i = 0; i < chips.length; i++) {
        html += "<button type='button' class='chip'>" + chips[i] + "</button>";
    }
    document.getElementById("chatChips").innerHTML = html;

    var buttons = document.querySelectorAll(".chip");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].addEventListener("click", function () {
            handleQuestion(this.textContent);
        });
    }
}


// ---------- 4. Helpers ----------
function has(text, words) {
    for (var i = 0; i < words.length; i++) {
        if (text.includes(words[i])) return true;
    }
    return false;
}

var needData = "First tell me your district, e.g. \"Check Badin\", and I'll get the NASA data.";

function planSummary() {
    if (!lastPlan || lastPlan.locked || lastPlan.ranked.length === 0) return null;
    var lines = [];
    for (var i = 0; i < lastPlan.ranked.length; i++) {
        var item = lastPlan.ranked[i];
        lines.push((i + 1) + ". " + tl("en", "crop_" + item.id) + " (" + item.score + "/100)");
    }
    return lines.join("\n");
}


// ---------- 5. Work out the answer ----------
async function getReply(question) {
    var q = question.toLowerCase();

    // A district was mentioned → get its NASA data first
    var key = findDistrictIn(q);
    if (key) {
        try { await loadDistrict(key); } catch (error) { lastResult = null; }

        if (!lastResult || lastResult.key !== key) {
            return "Sorry, I couldn't load NASA data for " + districts[key].name + ". Check the internet and try again.";
        }
        // If they only named the district, give a summary
        if (!has(q, ["water", "irrigat", "soil", "rain", "salt", "crop", "rotation", "plant", "grow", "hot", "heat", "temp"])) {
            var r0 = lastResult;
            return "Here's " + r0.place.name + ":\n" +
                adviceText(r0, "en") + "\n" +
                "Soil wetness: " + Math.round(r0.s.soil * 100) + "%\n" +
                saltTitle(r0, "en") + "\n\n" +
                "For crop ideas, use \"Plan your next crop\" on this page, or ask me about water, salt or crops.";
        }
    }

    var r = lastResult;

    if (has(q, ["hello", "hi ", "hey", "salam", "assalam"]) || q === "hi") {
        return "Hi! I'm Field Helper. Tell me your district, e.g. \"Check Larkana\", then ask about watering, soil, salt or crops.";
    }
    if (has(q, ["thank", "shukria", "thx"])) {
        return "You're welcome! Good luck with your crops. 🌾";
    }

    if (has(q, ["flood", "2022"])) {
        return "In the Soil check, tap \"2022 floods example\". It uses NASA POWER data for Dadu from 15 June to 15 September 2022, " +
            "and shows how the tool flags waterlogging and salt risk in a flood year.";
    }

    if (has(q, ["nasa", "data", "source", "where", "satellite", "accurate", "trust"])) {
        return "Soil wetness, rainfall and temperature come from NASA POWER. Soil wetness is from NASA's MERRA-2 model, for the top 1 metre of soil, on a grid about 50 km wide. " +
            "Typical monthly heat, rain and soil wetness come from NASA POWER climatology. " +
            "The 3-day rain forecast comes from Open-Meteo, which isn't NASA data. " +
            "These are area estimates, not measurements of one field, so treat them as a guide.";
    }

    if (has(q, ["how do you", "how does", "rule", "decide", "calculate", "work out", "score"])) {
        return "My rules are simple:\n" +
            "• Soil wetness 50%+ or 5 mm+ rain coming → wait to water\n" +
            "• 30–50% → water soon; under 30% and no rain → water now\n" +
            "• Soil wetness 60%+, or rain at least double the usual (and 150 mm+) → high salt-risk conditions; 42°C+ → medium\n" +
            "• Crops get a score out of 100: points for rotation (legume after cereal, no repeat of the same crop), for widely grown crops, and for NASA heat and soil-wetness fit";
    }

    for (var crop in cropFacts) {
        if (q.includes(crop) || (crop === "sorghum" && q.includes("jowar")) ||
            (crop === "mungbean" && (q.includes("moong") || q.includes("mung"))) ||
            (crop === "chickpea" && (q.includes("chana") || q.includes("gram")))) {
            return cropFacts[crop];
        }
    }

    // Everything below needs NASA results
    if (!r) {
        if (has(q, ["water", "irrigat", "soil", "rain", "salt", "crop", "rotation", "plant", "grow", "hot", "heat", "temp", "should"])) {
            return needData;
        }
    }

    if (r) {
        if (has(q, ["rotation", "crop", "plant", "grow", "sow", "next season", "best"])) {
            var list = planSummary();
            if (!list) {
                return "Use \"Plan your next crop\" on this page: pick your district and what is on the field, and I'll show the top 3 crops with reasons.";
            }
            return "Top crops from your last plan:\n" + list + "\n\nThe plan cards show the reason for each one.";
        }

        if (has(q, ["water", "irrigat", "should i"])) {
            return adviceText(r, "en") + ".\n\nWhy: " + waterWhy(r, "en");
        }

        if (has(q, ["salt", "saline", "salinity"])) {
            return saltTitle(r, "en") + "\n" + saltText(r, "en") + "\n\nWhy: " + saltWhy(r, "en");
        }

        if (has(q, ["soil", "moist", "wet", "dry"])) {
            var p = Math.round(r.s.soil * 100);
            var meaning = p >= 50 ? "wet enough for most crops" : p >= 30 ? "starting to dry out" : "dry";
            return "The root-zone soil wetness in " + r.place.name + " is " + p + "%, which is " + meaning + ". 0% is completely dry, and 100% is fully soaked.";
        }

        if (has(q, ["rain", "monsoon", "forecast"])) {
            var next = r.rainNext === null ? "The forecast isn't available right now." : "About " + r.rainNext + " mm is forecast for the next 3 days.";
            var usual = r.s.usualRain === null ? "" : " The usual amount for these months is about " + r.s.usualRain + " mm.";
            return r.place.name + " got " + r.s.rain + " mm of rain in the last 90 days." + usual + " " + next;
        }

        if (has(q, ["hot", "heat", "temp"])) {
            return "The hottest day in " + r.place.name + " in the last 90 days reached " + r.s.hottest + "°C. Heat dries the soil faster, so crops need more water on hot days.";
        }
    }

    return "Sorry, I didn't get that. Try asking:\n• \"Check Sukkur\"\n• \"Should I water?\"\n• \"Salt risk?\"\n• \"What should I grow next?\"";
}


// ---------- 6. When the user sends a question ----------
async function handleQuestion(question) {
    if (question.trim() === "") return;
    addMessage(question, "user");
    addMessage("...", "bot typing");

    var reply = await getReply(question);

    var typing = document.querySelector(".msg.typing");
    if (typing) typing.remove();
    addMessage(reply, "bot");
}

document.getElementById("chatForm").addEventListener("submit", function (event) {
    event.preventDefault();   // stops the page from reloading
    var input = document.getElementById("chatInput");
    handleQuestion(input.value);
    input.value = "";
});


// ---------- 7. Open and close ----------
document.getElementById("chatToggle").addEventListener("click", function () {
    document.getElementById("chatBox").classList.toggle("hidden");
    document.getElementById("chatInput").focus();
});

document.getElementById("chatClose").addEventListener("click", function () {
    document.getElementById("chatBox").classList.add("hidden");
});


// ---------- 8. Start ----------
addMessage("Hi! I'm Field Helper. 🌾 Tell me your district, e.g. \"Check Badin\", or tap a question below.", "bot");
showChips();
