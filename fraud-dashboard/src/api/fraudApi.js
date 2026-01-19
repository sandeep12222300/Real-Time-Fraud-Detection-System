

export async function fetchFraudPredictions() {
    const res = await fetch("/api/fraud/predictions");
    if (!res.ok) {
        throw new Error("Failed to fetch");
    }
    return res.json();
}
