let expenseChartInstance = null;

async function loadExpenseChart() {
    try {
        const response = await fetch(`http://localhost:5001/api/finance/expense-chart/${userId}`);
        const chartData = await response.json();

        const ctx = document.getElementById("expenseChart");

        if (!ctx) {
            console.error("No canvas found with id='expenseChart'");
            return;
        }

        if (!chartData || chartData.length === 0) {
            return;
        }

        const labels = chartData.map(item => item.category);
        const values = chartData.map(item => Number(item.total));

        if (expenseChartInstance) {
            expenseChartInstance.destroy();
        }

        expenseChartInstance = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Expenses by Category",
                    data: values
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    } catch (error) {
        console.error("Chart load error:", error);
    }
}

loadExpenseChart();