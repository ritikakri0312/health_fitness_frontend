// -----------------------------
// ELEMENT REFERENCES
// -----------------------------
const form = document.getElementById("fitnessForm");

const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const goalSelect = document.getElementById("goal");

const bmiBox = document.getElementById("bmiBox");
const bmiText = document.getElementById("bmiText");
const bmiSuggestion = document.getElementById("bmiSuggestion");

const resultBox = document.getElementById("result");

// -----------------------------
// BMI CALCULATION + SMART GOAL
// -----------------------------
function updateBMIAndGoal() {
    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);

    if (!height || !weight) {
        bmiBox.style.display = "none";
        return;
    }

    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let bmiCategory = "";
    let suggestedGoal = "";
    let badgeClass = "";

    if (bmi < 18.5) {
        bmiCategory = "Underweight";
        suggestedGoal = "muscle gain";
        badgeClass = "bmi-underweight";
    } else if (bmi < 25) {
        bmiCategory = "Normal";
        suggestedGoal = "maintain";
        badgeClass = "bmi-normal";
    } else if (bmi < 30) {
        bmiCategory = "Overweight";
        suggestedGoal = "fat loss";
        badgeClass = "bmi-overweight";
    } else {
        bmiCategory = "Obese";
        suggestedGoal = "fat loss";
        badgeClass = "bmi-obese";
    }

    // Show BMI info with badge
    bmiBox.style.display = "block";
    bmiText.innerHTML = `
        📊 BMI: <b>${bmi}</b>
        <span class="bmi-badge ${badgeClass}">
            ${bmiCategory}
        </span>
    `;

    bmiSuggestion.innerHTML = `💡 Based on your BMI, we recommend:
        <b>${
            suggestedGoal === "fat loss"
                ? "Lose Weight"
                : suggestedGoal === "muscle gain"
                ? "Gain Muscle"
                : "Maintain Health"
        }</b>`;

    // Auto-select goal (user can override)
    // if (!goalSelect.value) {
    //     goalSelect.value = suggestedGoal;
    // }
}

// Trigger BMI calculation while typing
heightInput.addEventListener("input", updateBMIAndGoal);
weightInput.addEventListener("input", updateBMIAndGoal);

// -----------------------------
// FORM SUBMIT
// -----------------------------
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const age = Number(ageInput.value);
    const gender = genderInput.value;
    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);
    const goal = goalSelect.value;

    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    resultBox.style.display = "block";
    resultBox.innerHTML = "<p>⏳ Generating AI recommendations...</p>";

    try {
        console.log("📤 Sending to backend:", {
            age,
            gender,
            height,
            weight,
            bmi,
            bmiCategory,
            goal
        });

        const response = await fetch(
            "https://health-fitness-backend-1.onrender.com/recommend",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    age,
                    gender,
                    height,
                    weight,
                    bmi,
                    bmiCategory,
                    goal
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            resultBox.innerHTML = `
                <p style="color:red; font-weight:bold;">❌ API Error</p>
                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;
            return;
        }

        const aiText = data.result || data.response;

        if (!aiText) {
            resultBox.innerHTML = `<p style="color:red;">❌ No AI result received.</p>`;
            return;
        }

        const formatted = aiText
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/[-•] /g, "👉 ")
            .replace(/\n/g, "<br>");

        resultBox.innerHTML = `
            <h2>🏋️ Your AI Fitness Plan</h2>
            <p>${formatted}</p>
        `;

    } catch (err) {
        console.error("⚠️ Frontend Error:", err);
        resultBox.innerHTML = `
            <p style="color:red;">⚠️ Frontend Error</p>
            <p>${err.message}</p>
        `;
    }
});
