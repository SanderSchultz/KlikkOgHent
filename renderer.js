
const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {

    ipcRenderer.on("send_data", (event, currentListConents) => {

        Oppdater(currentListConents);
            
        let button = document.querySelector("#button");

        button.style.color = "green";
        button.innerHTML = "Running...";

    });

    ipcRenderer.on("refresh_data", (event, currentListConents) => {
        Remove(currentListConents);
    });

    async function Oppdater(currentListConents) {

        let tablebody = document.querySelector("#tablebody");

        let countcolor = 1;

        for(let i = 0; i < currentListConents.length; i+= 2) {

            const row = tablebody.insertRow();

            const content1 = currentListConents[i].split("\n");
            const content2 = currentListConents[i+1].split("\n");

            for(let j = 0; j < content1.length; j++) {
                const extraCell1 = row.insertCell();
                extraCell1.innerHTML = content1[j];
                if(countcolor % 2 == 0) {
                    extraCell1.style.backgroundColor = "#335a25";
                }
            }
            for(let k = 0; k < content2.length; k++) {
                const extraCell2 = row.insertCell();
                extraCell2.innerHTML = content2[k];
                if(countcolor % 2 == 0) {
                    extraCell2.style.backgroundColor = "#335a25";
                }
            }

            countcolor++;
        }
    }

    function Remove(currentListConents)
    {
        let tablebody = document.querySelector("#tablebody");
        while (tablebody.firstChild) {
            tablebody.removeChild(tablebody.firstChild);
        }

        Oppdater(currentListConents)

    }
});