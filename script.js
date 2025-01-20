// Load saved data on page load
window.onload = function () {
    loadFromStorage();
};

function calculateMartingale() {
    // Get input values
    const startingSL = parseInt(document.getElementById("startingSL").value);
    const ratioInput = document.getElementById("ratio").value;
    const steps = parseInt(document.getElementById("steps").value);

    if (isNaN(startingSL) || isNaN(steps) || !ratioInput) {
        alert("Please fill out all fields with valid numbers and ratio.");
        return;
    }

    // Parse the SL:Take Profit ratio
    const ratioParts = ratioInput.split(":");
    if (ratioParts.length !== 2 || isNaN(ratioParts[0]) || isNaN(ratioParts[1])) {
        alert("Invalid ratio format. Use the format '1:2', '1:3', etc.");
        return;
    }

    const ratio = parseInt(ratioParts[1]) / parseInt(ratioParts[0]);

    // Initialize variables
    let sl = startingSL;
    let totalLost = 0;
    const tableBody = document.getElementById("outputTable");
    tableBody.innerHTML = ""; // Clear previous data
    const dataToSave = [];

    // Loop through steps to calculate values
    for (let i = 1; i <= steps; i++) {
        const takeProfit = sl * ratio; // Take Profit based on the ratio
        const netProfit = takeProfit - totalLost;
        totalLost += sl;

        // Save row data for local storage
        dataToSave.push({ sl, totalLost, takeProfit, netProfit, checked: i === 1 });

        // Create a new row for the table
        const row = `
            <tr>
                <td>${sl}</td>
                <td>${totalLost}</td>
                <td>${takeProfit}</td>
                <td>${netProfit}</td>
                <td><input type="checkbox" ${i === 0 ? "checked" : ""} onchange="saveCheckboxState(${i - 1}, this.checked)"></td>
            </tr>
        `;
        tableBody.innerHTML += row;

        // Double SL for the next step
        sl *= 2;
    }

    // Save data to local storage
    localStorage.setItem("martingaleData", JSON.stringify(dataToSave));
}

function loadFromStorage() {
    const savedData = JSON.parse(localStorage.getItem("martingaleData"));

    if (!savedData || savedData.length === 0) {
        return; // No saved data found, exit silently
    }

    const tableBody = document.getElementById("outputTable");
    tableBody.innerHTML = ""; // Clear previous data

    savedData.forEach((row, index) => {
        const tableRow = `
            <tr>
                <td>${row.sl}</td>
                <td>${row.totalLost}</td>
                <td>${row.takeProfit}</td>
                <td>${row.netProfit}</td>
                <td><input type="checkbox" ${row.checked ? "checked" : ""} onchange="saveCheckboxState(${index}, this.checked)"></td>
            </tr>
        `;
        tableBody.innerHTML += tableRow;
    });
}

function saveCheckboxState(index, checked) {
    const savedData = JSON.parse(localStorage.getItem("martingaleData"));

    if (!savedData || index >= savedData.length) {
        return;
    }

    savedData[index].checked = checked;
    localStorage.setItem("martingaleData", JSON.stringify(savedData));
}
