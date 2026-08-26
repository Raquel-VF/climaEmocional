
/* =========================================================
   CONFIGURAÇÃO
========================================================= */
const API_KEY = "6da35db01bfebd641903b118f84e30d8"

/* =========================================================
   ELEMENTOS
========================================================= */
const elements = {
    cityName: document.querySelector("#city-name"),
    countryName: document.querySelector("#country-name"),

    currentTime: document.querySelector("#current-time"),

    temperature: document.querySelector("#temperature"),
    weatherDescription: document.querySelector("#weather-description"),
    emotionalMessages: document.querySelector("#emotional-message"),
    weatherPeriod: document.querySelector("#weather-period"),

    sunrise: document.querySelector("#sunrise"),
    sunset: document.querySelector("#sunset"),

    sun: document.querySelector("#sun"),
    moon: document.querySelector("#moon"),
    clouds: document.querySelector("#clouds"),
    sky: document.querySelector("#sky"),
    ambientLight: document.querySelector("#ambient-light"),

    searchPanel: document.querySelector("#search-panel"),
    searchForm: document.querySelector("#search-form"),
    cityInput: document.querySelector("#city-input"),

    detailsPanel: document.querySelector("#details-panel"),
    detailsTemp:document.querySelector("#details-temp"),
    feelsLike: document.querySelector("#feels-like"),
    humidity: document.querySelector("#humidity"),
    wind: document.querySelector("#wind"),
    cloudiness: document.querySelector("#cloudiness"),

    errorMessage: document.querySelector("#error-message")
};

/* =========================================================
   FRASES
========================================================= */
const emotionalMessages = {
    clear:[
        "o céu parece leve hoje.",
        "a luz encontrou seu lugar.",
        "um céu aberto.",
        "há espaço para respirar."
    ],

    cloudy: [
        "um dia silencioso.",
        "as nuvens também desenham o céu.",
        "nem todod céu precisa estar limpo.",
        "a luz ficou mais suave."
    ],

    rain:[
        "o céu resolveu ficar.",
        "a chuva muda o ritmo",
        "um pouco de silencio lá fora.",
        "hoje o céu fala mais baixo."
    ],

    night: [
        "a cidade desacelerou",
        "o céu ficou profundo",
        "a noite também pode trazer calma",
        "agora tudo parece mais quieto."
    ]
};

/* =========================================================
   BUSCAR CLIMA
========================================================= */
async function buscarClima(cidade) {
    if (!cidade){
        mostrarErro("Digite uma cidade.");
        return;
    }

    try{
        const url =
         `https://api.openweathermap.org/data/2.5/weather` +
            `?q=${encodeURIComponent(cidade)}` +
            `&appid=${API_KEY}` +
            `&units=metric` +
            `&lang=pt_br`;

        const resposta = await fetch(url);

        if (!resposta.ok) {
            if(resposta.status === 404){
                throw new Error(
                    "cidade não encontrada."
                );
            }
            throw new Error(
            "Não foi possível consultar o clima."
            );
        }
        const dados = await resposta.json();
        atualizarInterface(dados);
    }
    catch (erro){
        console.error(erro);
        mostrarErro(
            erro.message || "Ocorreu um erro ao buscar p clima."
        );
    }
}

/* =========================================================
   ATUALIZAR INTERFACE
========================================================= */
function atualizarInterface(dados){
    const clima = dados.weather[0];

    const temperature = Math.round(dados.main.temp);

    elements.cityName.textContent = dados.name;

    elements.countryName.textContent = dados.sys.country;

    elements.temperature.textContent = `${temperature}°`;

    elements.detailsTemp.textContent = `${temperature}`;
    
    elements.weatherDescription.textContent = clima.description;

    elements.feelsLike.textContent = `${Math.round(dados.main.feels_like)}°`;

    elements.humidity.textContent = `${dados.main.humidity}%`;

    elements.wind.textContent = `${Math.round(dados.wind.speed * 3.6)}km/h`;

    elements.cloudiness.textContent = `${dados.clouds.all}%`;

    elements.sunrise.textContent = formatarHora(dados.sys.sunrise);

    elements.sunset.textContent = formatarHora(dados.sys.sunset);

    const atmosfera = criarAtmosfera (dados);

    aplicarAtmosfera(atmosfera);

    atualizarFrase(atmosfera);
}

/* =========================================================
   CRIAR ATMOSFERA
========================================================= */
function criarAtmosfera(dados){
    const agora = Math.floor(Date.now() / 1000);
    const climaId = dados.weather[0].id;
    const nuvens = dados.clouds.all;
    const sunrise = dados.sys.sunrise;
    const sunset = dados.sys.sunset;
    const periodo = determinarPeriodo(agora, sunrise, sunset);
    const tipoClima = determinarClima(climaId);
    const intensidade = determinarIntensidade(climaId,nuvens);
    const noite = periodo === "night" || periodo === "dawn" && agora < sunrise;
    return{
        periodo, 
        clima: tipoClima, 
        intensidade, 
        noite, 
        temperature:dados.main.temp, 
        nuvens
    };
}

/* =========================================================
   DETERMINAR PERÍODO
========================================================= */
function determinarPeriodo(
    agora, sunrise, sunset
){
    const hora = 
    new Date(agora * 1000).getHours();

    if (agora < sunrise) {
        return "night";
    }

    if (agora >= sunrise && agora < sunrise + 60 * 60){
        return "dawn";
    }

    if ( agora >= sunrise + 60 * 60 && agora < 12 * 60 * 60){
    return "morning";
    }

    if ( agora >= 12 * 60 * 60 && agora < sunrise - 60 * 60){
    return "afternoon";
    }

    if ( agora >= sunrise - 60 * 60 && agora <= sunset){
    return "sunset";
    }

    return "night";
}

/* =========================================================
   DETERMINAR CLIMA
========================================================= */
function determinarClima(id){
    if (id >= 200 && id < 300){
        return "storm";
    }
    if (id >= 300 && id < 600){
        return "rain";
    }
    if (id >= 600 && id < 700){
        return "snow";
    }
    if (id >= 700 && id < 800){
        return "mist";
    }
    if (id === 800){
        return "clear";
    }
    return "cloudy";
}

/* =========================================================
   INTENSIDADE
========================================================= */
function determinarIntensidade( climaId, nuvens){
    if (climaId >= 200 && climaId < 300){
        return "high";
    }
     if (climaId >= 500 && climaId < 600){
        if(climaId >= 520){
            return "high";
        }
        return "medium";
    }
    if (nuvens >= 40){
        return "heigh";
    }
    return "low";
}

/* =========================================================
   APLICAR ATMOSFERA
========================================================= */
function aplicarAtmosfera (atmosfera){
    /* remove estados antigos*/
    document.body.className = "";

    /* Estado noturno */
    if (atmosfera.noite){
        document.body.classList.add("night");
    }

    /* posicionar a lua */
    posicionarLua(atmosfera.periodo);

    /* Ajusta o ceu */
    ajustarCeu(atmosfera);

    /*ajustar nuvens */
    if (atmosfera.clima === "cloudy"){
        elements.clouds.style.opacity = atmosfera.intensidade === "high" ? "0.8" : "0.45";
    }else {
        elements.clouds.style.opacity = "0";
    }

    /* texto periodo */
    elements.weatherPeriod.textContent = traduzirPeriodo(atmosfera.periodo);
}

/* =========================================================
   POSICIONAR SOL
========================================================= */
function posicionarSol(periodo){
    const posicoes = {
        dawn: {
            left: "15%", top: "70%"
        },
        morning: {
            left: "30%", top: "35%"
        },
        afternoon: {
            left: "70%", top: "28%"
        },
        sunset: {
            left: "85%", top: "65%"
        },
        night: {
            left: "90%", top: "80%"
        }
    };

    const posicao = posicoes[periodo] || posicoes.afternoon;
    elements.sun.style.left = posicao.left;
    elements.sun.style.top = posicao.top;

    elements.sun.style.opacity = periodo === "night" ? "0" : "1";
}

/* =========================================================
   POSICIONAR LUA
========================================================= */
function posicionarLua ( periodo){
    if (
        periodo !== "night"
    ){
        elements.moon.style.opacity = "0";
        return;
    }

    elements.moon.style.opacity = "1";
    elements.moon.style.left = "75%";
    elements.moon.style.top = "28%";
}

/* =========================================================
   AJUSTAR CÉU
========================================================= */
function ajustarCeu(atmosfera){
    let gradient;

    /*ceu limpo */
    if(atmosfera.clima === "clear"){
        switch (atmosfera.periodo){
            case "dawn": gradient = `
            radial-gradient(circle at 20% 70%, rgba(255, 180, 150.0, 0.65), transparent 30%),
            linear-gradient(180deg, #415c8a, #d9a47, #f3d2a2)`;
                break;
            case "morning": gradient =`(180deg, #5596bd, #a8cddd, 
                #e7eeee)`;
                break;
            case "afternoon": gradient = `radial-gradient(circle at 70% 25%, rgba(255, 220, 150, 0.5), transparent 25%),
            linear-gradient(180deg, #4c91ba, #8fc2d7, #d9e8e9)`;
                break;
            case "sunset": gradient = `radial-gradient(circle at 85% 65%, rgba(255, 190, 100, 0.7), transparent 30%),
            linear-gradient(180deg, #596e9d, #d08376, #ddb16d)`;
                break;
            default: gradient = `linear-gradient(180deg, #101a31, #182746)`;

        }
    }

    /* nublado */
    else if(
        atmosfera.clima === "cloudy") { gradient = `linear-gradient(180deg, #566d7b, #84959d, #b8c3c5)`;
    }

    /* chuva */
    else if ( atmosfera.clima === "rain"){ gradient = `linear-gradient(180deg, #293947, #536773, #748993)`;
    }

    /* tempestade */
    else if ( atmosfera.clima === "storm"){ gradient = `radial-gradient(circle at 70% 30%, rgba(110, 90, 150, 0.3), transparent 30%), linear-gradient(180deg, #111722, #252b3c, #3e4652)`;
    }

    /* neblina */
    else if ( atmosfera.clima === "mist"){ gradient = `linear-gradient(180deg, #71848d, #aab8bb, #d3d8d5)`;
    }
    
    /* noite */
     if ( atmosfera.noite){ gradient = `radial-gradient(circle at 75% 25%, rgba(120, 145, 190, 0.12), transparent 25%), linear-gradient(180deg, #0c1428, #182746, #0b1222)`;
    }
elements.sky.style.background = gradient;
}

/* =========================================================
   FRASE EMOCIONAL
========================================================= */
function atualizarFrase( atmosfera){
    let categoria = atmosfera.clima;

    if ( atmosfera.noite){
        categoria = "night";
    }

    const frases = emotionalMessages[categoria] || emotionalMessages.clear;
    const frase = frases[Math.floor(Math.random() * frases.length)];
    
    elements.emotionalMessages.textContent = frase;
}

/* =========================================================
   TRADUZIR PERÍODO
========================================================= */
function traduzirPeriodo(periodo){
    const nomes = {
        night: "NOITE",
        dawn: "AMANHECER",
        morning: "MANHÃ",
        afternoon: "TARDE",
        sunset: "PÔR DO SOL"
    };
    return nomes[periodo] || "AGORA";
}

/* =========================================================
   HORÁRIO
========================================================= */
function atualizarRelogio(){
    const agora = new Date();

    elements.currentTime.textContent = agora.toLocaleTimeString("pt-BR", 
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

/* =========================================================
   FORMATAR HORA
========================================================= */
function formatarHora( timestamp ){
    const data = new Date (timestamp * 1000);
    return data.toLocaleTimeString("pt-BR", 
        {
         hour:"2-digit",
            minute:"2-digit"
        }
    );
}
 

/* =========================================================
   ERROS
========================================================= */
function mostrarErro(mensagem){
    elements.errorMessage.textContent = mensagem;
    elements.errorMessage.classList.add("active");
    setTimeout(() => { elements.errorMessage.classList.remove("active");
    }, 4000);
}

/* =========================================================
   BUSCA
========================================================= */
elements.locationButton = document.querySelector("#location-button");

elements.closeSearch = document.querySelector("#close-search");

elements.locationButton.addEventListener("click", () => {
    elements.searchPanel.classList.add("active");

    elements.cityInput.focus();
});

elements.closeSearch.addEventListener("click", () => {
    elements.searchPanel.classList.remove("active");
});

elements.searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const cidade = elements.cityInput.value.trim();

    buscarClima(cidade);

    elements.searchPanel.classList.remove("active");
});

/* =========================================================
   DETALHES
========================================================= */
const detailsButoon = document.querySelector("#details-button");

const closeDetails = document.querySelector("#close-details");

detailsButoon.addEventListener("click", () => {
    elements.detailsPanel.classList.add("active");
});

closeDetails.addEventListener("click", () => {
    elements.detailsPanel.classList.remove("active");
});

buscarClima("Rio Grande");