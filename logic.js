document.getElementById("fitnessForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let weight = document.getElementById("weight").value;
    let goal = document.getElementById("goal").value;

    const resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    resultBox.innerHTML = "<p>⏳ Generating AI recommendations...</p>";

    try {
        console.log("📤 Sending to backend:", { age, gender, weight, goal });

        // ⭐ UPDATE #1 — Correct API endpoint
        const response = await fetch("https://health-fitness-backend-1.onrender.com/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ age, gender, weight, goal })
        });

        const data = await response.json();
        console.log("📥 Response from backend:", data);

        // ⭐ UPDATE #2 — Better backend error message
        if (!response.ok) {
            resultBox.innerHTML = `
                <p style="color:red; font-weight:bold;">❌ API Error</p>
                <pre style="color:#a30000; background:#ffeeee; padding:10px; border-radius:6px;">
${JSON.stringify(data, null, 2)}
                </pre>
            `;
            return;
        }

        // ⭐ UPDATE #3 — Ensure AI result exists
        if (!data.result) {
            resultBox.innerHTML = `<p style="color:red;">❌ No AI result received. Check backend logs.</p>`;
            return;
        }

        // ⭐ UPDATE #4 — Convert Markdown → HTML beautifully
        let formatted = data.result
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")  // Bold
            .replace(/[-•] /g, "👉 ")                // Bullet icons
            .replace(/\n/g, "<br>");                 // Line breaks

        // ⭐ UPDATE #5 — Final pretty output
        resultBox.innerHTML = `
            <h2>Your AI Recommendations</h2>
            <p>${formatted}</p>
        `;

    } catch (err) {
        // ⭐ UPDATE #6 — Clean error fallback
        console.error("⚠️ Frontend Error:", err);
        resultBox.innerHTML = `<p style="color:red;">⚠️ Frontend Error: ${err.message}</p>`;
    }
});
