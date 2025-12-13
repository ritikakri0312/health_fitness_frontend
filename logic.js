document.getElementById("fitnessForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const weight = document.getElementById("weight").value;
    const goal = document.getElementById("goal").value;

    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerHTML = "<p>⏳ Generating AI recommendations...</p>";

    try {
        console.log("📤 Sending to backend:", { age, gender, weight, goal });

        const response = await fetch(
            "https://health-fitness-backend-1.onrender.com/recommend",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ age, gender, weight, goal })
            }
        );

        const data = await response.json();
        console.log("📥 Response from backend:", data);

        // ❌ Backend error
        if (!response.ok) {
            resultBox.innerHTML = `
                <p style="color:red; font-weight:bold;">❌ API Error</p>
                <pre style="background:#ffeeee; padding:12px; border-radius:8px;">
${JSON.stringify(data, null, 2)}
                </pre>
            `;
            return;
        }

        // ✅ SUPPORT BOTH POSSIBLE RESPONSE KEYS
        const aiText = data.result || data.response;

        if (!aiText) {
            resultBox.innerHTML = `
                <p style="color:red;">❌ No AI result received.</p>
                <p>Check backend logs on Render.</p>
            `;
            return;
        }

        // ✨ Beautify AI text
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
