const apiKey = "a3ef51549d1326fb291cab4173345ade";

const botao = document.querySelector("#buscar");
const resultado = document.querySelector("#resultado");

const inputCidade = document.querySelector("#cidade");

inputCidade.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        botao.click();
    }
});

botao.addEventListener("click", async function(){
    const cidade = document.querySelector("#cidade").value;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    const resposta = await fetch(url);

    resultado.innerHTML ="<p>Buscando clima... ⏳</p>";

    const dados = await resposta.json();

    const agora = dados.dt;
    const nascerSol = dados.sys.sunrise;
    const porSol = dados.sys.sunset;

    let periodo = "";
    if(agora >= nascerSol && agora < porSol){
        periodo = "dia";
    }
    else{
        periodo ="noite";
    }

    if(dados.cod == "404"){
        resultado.innerHTML = "<p>Cidade não encontrada. Por favor, tente novamente. ❌</p>";
        return; 
    }

    const clima = dados.weather[0].main;

    const icone = dados.weather[0].icon;

    const urlIcone = `https://openweathermap.org/img/wn/${icone}@2x.png`;

    let emojiClima = "";

    let frase = "";

    // Personalização do clima emocional
    if(clima === "Clear"){

        if(periodo === "dia"){
            document.body.style.background = "linear-gradient(180deg, #FFD166, #F4A261)";
        }
        else{
            document.body.style.background = "linear-gradient(180deg, #1b1b2f, #0B1020)";
        }

        emojiClima = "☀️";
        frase = "O céu parece leve hoje ☀️";
        document.body.style.background = "linear-gradient(180deg, #FFD166, #F4A261)";
    }

    else if(clima === "Rain" || clima === "Drizzle"){
        emojiClima = "🌧️";
            frase = "Dias chuvosos também merecem acolhimento 🌧";
        document.body.style.background = "linear-gradient(180deg, #1B1B2F, #0B1020)";
    }
    else if(clima === "Clouds"){
        emojiClima = "☁️";
        frase = "Nem todo céu precisa estar limpo para ser bonito ☁️!";
        document.body.style.background = "linear-gradient(180deg, #6C757D, #495057)";
    }

    else if(clima === "Rain" || clima === "Drizzle"){
        emojiClima = "🌧️";
    
    }

    console.log(clima);

    resultado.innerHTML = `
    <img src = "${urlIcone}">
    <h2>${dados.name}</h2>
    <p>${dados.main.temp.toFixed(0)}°C</p>
    <p>${dados.weather[0].description}</p>
    <p>${frase}</p>
    `;
});