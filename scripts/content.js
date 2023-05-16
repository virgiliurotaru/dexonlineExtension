chrome.storage.local.clear();

let definitionBoxData = { cursorTop: "", cursorLeft: "" };
let lastSelectedWord = "";

const buttonLogoElement = document.createElement("button");
buttonLogoElement.id = "dexLogo";
buttonLogoElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="30px" role="img" width="30px" viewBox="0 0 80 80"> <title>dexonline logo</title> <style>g { stroke: #000; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.25; } @media (prefers-color-scheme: dark) { g { stroke: #000; } } </style> <g> <path fill="none" stroke-width="2.25" d="M75.3,50.5c-11.2,8-19.3,12.7-32.4,19.8c-6.1-6.2-9.1-8.9-16.6-13.9c12.7-6.5,20.6-10.1,34.2-18c5.9,4.3,10,6.4,15,11.3 M26.3,56.4l0.3,6.9 M42.8,70.6c0.3,1.2,0.6,4.9,0.7,6.1 M75.6,49.8l0.7,7 M26.6,63.3c6.7,6.5,10.7,6.5,16.5,13.7 M43.5,76.8c2.2-1.2,5.4-2.8,8.1-4.2c4.3-2.1,6.7-4.2,11.1-6.2c6.1-2.8,7.7-6.4,13.5-9.7 M2,47.5c7.8-3.8,14.3,0.7,18.2,6c0-8,0.5-12,0.5-20c0-13.2,0.4-18.7-9.2-18.7c-10,0-9.7,3.4-9.7,14.4C1.9,39.5,2,37.2,2,47.5 M7.5,22.6C7.6,28.2,8,40.5,8,46.1 M12.1,20.5v26.4 M15.8,27.1c0.1,6.4,0.3,18.2,0.3,21.8 M5.7,15.5c14.5-6.7,21.8-9,36.2-13.7c0.9-0.3,3.2-0.9,4.4-0.6 M20.2,53.5c10.2-9.2,21.3-10.1,32.7-17.8 M46.3,1.2c6.7,1.1,6.7,2.9,6.7,13.9c0,7.3,0,13.3,0,20.6 M15.1,48.7c-8.5,3.5-14,8.9-14,11.9c0,4.3,3.9,5.5,8.1,5.5c5.2,0,7.7-3.3,12.9-3.3c1.3,0,3.1,0.1,4.4,0.5"></path> <path stroke-width="1.3887" d="M37.5,59.6c1.2,1.7,3.1,2.7,4.6,4.4l0.8-0.4c0,0,3.8-2.2,4.5-2.9l0.3-2.3l-10.1-0.8L37.5,59.6z M48.5,54.6c1.2,1.7,2.7,2.3,4.2,3.9l2.5-1.6c0,0,0.9-0.5,1.6-1.2l0.2-2.3l-8.4-0.9L48.5,54.6z M57.5,48.9c1.2,1.7,2.8,2.8,4.5,4c0,0,1.6-1.1,2.3-1.7c0.7-0.6,1.4-0.8,2.1-1.5l0.2-2.3l-9.1-0.5L57.5,48.9z"></path> <path fill="#3e66b0" d="M43.9,54c1.1,1.7,2.5,2.3,3.8,3.9c-2.1,1.4-3.1,2.3-5.5,3.4c-0.1-0.1-4.3-4.1-4.6-4.2l5.9-3.5L43.9,54z"></path> <path fill="#fff200" d="M52.8,49.2c1.8,1,3.5,2.3,4.2,3.8c-0.6,1-2.4,2-4.2,3c-0.8-0.9-1.5-1.2-2.5-2c-0.7-0.6-1.7-1-1.7-1.9c0-0.3,0.2-0.4,0.2-0.7C49.8,50.6,51.6,49.8,52.8,49.2z"></path> <path fill="#ed1c24" d="M57.6,46.4c1.6-0.8,3.3-2.2,4.7-3.1c1.6,1.2,2.7,2.4,4.4,3.6c-1.1,1.4-2.8,2.2-4.6,3.5C60.4,48.9,59,48,57.6,46.4z"></path>  </g> </svg>`;
buttonLogoElement.style.cssText =
  " position: absolute; padding: 0; border: none; cursor: pointer; z-index: 2047483647; border-radius: 5px; background-color: white; box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.6); ";
buttonLogoElement.addEventListener("click", logoClickHandler);

const definitionBox = document.createElement("div");
definitionBox.id = "definitionBox";
definitionBox.style.cssText =
  "position: absolute; background-color: white; z-index: 2047483647; font-family: Open Sans; height: auto; width: auto; padding: 10px; box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.6); border-radius: 8px; box-sizing: border-box;";

async function logoClickHandler() {
  const response = await fetchDexData(lastSelectedWord);
  const definition = !response ? "Nu s-a găsit definiție" : response[0].htmlRep;

  definitionBox.innerHTML = definition;
  definitionBox.style.top = definitionBoxData.cursorTop;
  definitionBox.style.left = definitionBoxData.cursorLeft;
  document.body.appendChild(definitionBox);
}

async function getData(word) {
  const url = `https://dexonline.ro/definitie/${word}/json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.definitions;
  } catch (error) {
    console.log(error);
  }
}

async function fetchDexData(word) {
  const cachedDefinition = await chrome.storage.local.get("data");
  const data = cachedDefinition.data || [];

  const foundWord = data.find((item) => item.word === word);
  if (foundWord) {
    return foundWord.definition;
  }

  const definition = await getData(word);
  data.push({ word, definition });

  if (data.length > 20) {
    data.shift();
  }

  chrome.storage.local.set({ data });

  return definition;
}

document.body.addEventListener("click", (event) => {
  //get the selected word, trim the white spaces, delete the punctuations, lower case.
  const selection = window.getSelection().toString();

  const selectedWord = selection
    .trim()
    .split(" ")[0]
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .toLowerCase();

  //check page language
  //var pageLanguage = document.documentElement.lang;

  const insertedLogoElement = document.getElementById("dexLogo");
  const insertedDefElement = document.getElementById("definitionBox");

  if (selectedWord.length > 1) {
    console.log(selectedWord);
    const topPosition = window.pageYOffset + event.clientY + 10;
    const leftPosition = window.pageXOffset + event.clientX;

    buttonLogoElement.style.top = `${topPosition}px`;
    buttonLogoElement.style.left = `${leftPosition}px`;

    definitionBoxData.cursorTop = `${topPosition}px`;
    definitionBoxData.cursorLeft = `${leftPosition}px`;

    if (!insertedLogoElement) {
      document.body.appendChild(buttonLogoElement);
    }
  }
  if (insertedLogoElement) {
    insertedLogoElement.remove();
  }

  if (insertedDefElement) {
    insertedDefElement.remove();
  }

  lastSelectedWord = selectedWord;
});
