document.getElementById("fitnessForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // -----------------------------
    // 1️⃣ READ FORM VALUES
    // -----------------------------
    const age = Number(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const height = Number(document.getElementById("height").value); // NEW
    const weight = Number(document.getElementById("weight").value);
    const goal = document.getElementById("goal").value;

    // -----------------------------
    // 2️⃣ BMI CALCULATION
    // -----------------------------
    const heightM = height / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);

    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    // -----------------------------
    // 3️⃣ SHOW BMI TO USER
    // -----------------------------
    const bmiBox = document.getElementById("bmiResult");
    bmiBox.style.display = "block";
    bmiBox.innerHTML = `
        <h3>📊 Health Summary</h3>
        <p><b>BMI:</b> ${bmi}</p>
        <p><b>Category:</b> ${bmiCategory}</p>
    `;

    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerHTML = "<p>⏳ Generating AI recommendations...</p>";

    try {
        // -----------------------------
        // 4️⃣ SEND DATA TO BACKEND
        // -----------------------------
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
        console.log("📥 Response from backend:", data);

        // -----------------------------
        // 5️⃣ HANDLE BACKEND ERRORS
        // -----------------------------
        if (!response.ok) {
            resultBox.innerHTML = `
                <p style="color:red; font-weight:bold;">❌ API Error</p>
                <pre style="background:#ffeeee; padding:12px; border-radius:8px;">
${JSON.stringify(data, null, 2)}
                </pre>
            `;
            return;
        }

        // -----------------------------
        // 6️⃣ HANDLE AI RESPONSE
        // -----------------------------
        const aiText = data.result || data.response;

        if (!aiText) {
            resultBox.innerHTML = `
                <p style="color:red;">❌ No AI result received.</p>
                <p>Check backend logs on Render.</p>
            `;
            return;
        }

        // -----------------------------
        // 7️⃣ FORMAT AI TEXT
        // -----------------------------
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
