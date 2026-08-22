const apiKey = "a3ef51549d1326fb291cab4173345ade";

const botao = document.querySelector("#buscar");
const resultado = document.querySelector("#resultado");

const inputCidade = document.querySelector("#cidade");

inputCidade.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        botao.click();
    }
});

// Função para buscar o clima
botao.addEventListener("click", async function(){
    const cidade = document.querySelector("#cidade").value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    const resposta = await fetch(url);

    resultado.innerHTML ="<p>Buscando clima... ⏳</p>";

// Verificar se a resposta foi bem-sucedida
    const dados = await resposta.json();
    
    if(dados.cod == "404"){
        resultado.innerHTML = "<p>Cidade não encontrada. Por favor, tente novamente. ❌</p>";
        return; 
    }

// Analisar o clima e personalizar a experiência emocional    
    const clima = dados.weather[0].main;
    
    const icone = dados.weather[0].icon;

    let periodo = icone.includes("n") ? "noite" : "dia";
    
    let emojiClima = "";
    
    let frase = "";
    
    const urlIcone = `https://openweathermap.org/img/wn/${icone}@2x.png`;

    // Personalização do clima emocional
    if(clima === "Clear"){

        if(periodo === "dia"){

            const background = document.getElementById("background");
            background.className = "sol";
            emojiClima = "☀️";
            frase = "O céu parece leve hoje ☀️";
        }
        else{
            const background = document.getElementById("background");
            background.className = "noite";
            emojiClima = "🌙";
            frase =
            "A noite também pode trazer calma 🌙";
        }
    }

    else if(clima === "Rain" || clima === "Drizzle"){
        emojiClima = "🌧️";
            frase = "Dias chuvosos também merecem acolhimento 🌧";
        const background = document.getElementById("background");
        background.className = "chuva";
    }
    else if(clima === "Clouds"){
        emojiClima = "☁️";
        frase = "Nem todo céu precisa estar limpo para ser bonito ☁️!";
        const background = document.getElementById("background");
        background.className = "nuvens";
    }

    console.log(clima);

    resultado.innerHTML = `
    <div id="cidade_resultado">
        <h2 id="cidade-resultado">${dados.name}</h2>
    </div>

    <div id="temp_resultado_descricao">
        <img src = "${urlIcone}" id="icone-resultado">
        <p>${dados.main.temp.toFixed(0)}°C</p>
        <p>${dados.weather[0].description}</p>
    </div>
    <p>${frase}</p>
    `;
});