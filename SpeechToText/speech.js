const synth = window.speechSynthesis;

document.addEventListener("DOMContentLoaded", () => {
    setConfigurations();
    voiceToText();
    clearTextArea();
   
  });

  function clearTextArea() {
    let textArea = document.getElementById('text');
    if (textArea) {
      textArea.value = ""; 
    } 
  }

  function browserCompatibility() {
    console.log("esbrave?");
    if (navigator.brave) {
      console.log("tamos en brave");
      return true;
    }
    return false;
  }
  

  function hideMicrophoneButtons() {
    if (browserCompatibility()) {
      let startAndEnd = document.getElementById("microphoneButtons");
      console.log("🚀 ~ hideMicrophoneButtons ~ startAndEnd:", startAndEnd)
      startAndEnd.style.display = "none";
    }
  }
  
  

function addVoiceOptions() {
  const voices = synth.getVoices();
  const language = document.getElementById("language");

  //   languageSelect.innerHTML = "";

  voices.forEach((voice) => {
    console.log("🚀 ~ voices.forEach ~ voice:", voice);

    const option = document.createElement("option");
    option.id = "option";
    option.textContent = voice.name;
    option.value = voice.lang;

    language.appendChild(option);

    console.log("🫤 ~ voices.forEach ~ option:", option);
  });
}

function setConfigurations() {
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = addVoiceOptions;
    //   setTimeout(addVoiceOptions, 100);
  } else {
    addVoiceOptions();
  }
}

function textToVoice() {
  const textArea = document.getElementById("text").value;
  const speed = document.getElementById("speed").value;
  const language = document.getElementById("language").value;
 

  const utterThis = new SpeechSynthesisUtterance(textArea);
  utterThis.lang = language;
  utterThis.rate = speed;
  
  synth.speak(utterThis);
}


// voice

function voiceToText() {
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const textArea = document.getElementById("text");
  
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "es-ES";
    recognition.interimResults = true; // Muestra resultados provisionales
    recognition.continuous = true; // Permite el reconocimiento continuo
  
    voiceButtonController(startBtn, stopBtn, recognition);
  
    recognition.onresult = function (event) {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      textArea.innerText = transcript; // Muestra el texto convertido
    };
  
    recognition.onerror = function (event) {
      console.error("Error de reconocimiento de voz:", event.error);
    };
  }
  
  function voiceButtonController(startBtn, stopBtn, recognition) {
    startBtn.addEventListener("click", () => {
      console.log("inciooooooooooooooooooooo");
      recognition.start();
    });
  
    stopBtn.addEventListener("click", () => {
      console.log("termino");
      recognition.stop();
    });
  }