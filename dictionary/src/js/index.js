import { $, htmlToString } from "./domFunctions.js";

const currentInfo = document.getElementById("info");
const clearBtn = document.getElementById("clear_btn");
const input = document.getElementById("input");
const audioBox = document.getElementById("audio_box");
const searchedWord = document.getElementById("searched_word");
const wordPhonetics = document.getElementById("word_phonetics");
const meaningBoxes = document.getElementById("meaning_boxes");

async function fetchWord(word) {
	if(word.length) {
		currentInfo.innerText = `Searching the meaning of "${word.length > 25 ? word.slice(0, 25) + "..." : word}"`;
		const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
		await fetch(url)
		.then(resp => resp.json())
		.then(resp => {
			render(resp);
		})
		.catch(err => {
			currentInfo.innerText = "No Definitions Found";
			reset();
		});
	} else {
		reset();
		currentInfo.innerText = "Type a word and press enter to get meaning, pronunciation and synomyms of that typed word.";
	}
};

function reset() {
	searchedWord.innerText = "";
	wordPhonetics.innerText = "";
	meaningBoxes.innerHTML = "";
	audioBox.innerHTML = "";
}

function render([data]) {
	// Clearing the elements
	reset();
	currentInfo.innerText = "";

	// Rendering the searched word
	searchedWord.innerText = data.word;
	// Rendering the searched words phonetics
	wordPhonetics.innerText = data.phonetic || data.phonetics.find(phonetic => phonetic.text.length > 0).text;

	// Creating audio box for the word
	const audioURL = data.phonetics.find(phonetic => phonetic.audio.length > 0).audio;

	if (audioURL) {
		audioBox.innerHTML = `<i class="sound_btn fa-solid fa-volume-high"></i>`
		try {
			const audio = new Audio(audioURL);
			audioBox.querySelector("i").addEventListener("click", () => {
				audio.currentTime = 0;
				audio.play();
			});
		} catch {}
	}

	// info boxes
	if(data.meanings[0].definitions[0].definition) {
		const meaningBox = new $("div")
			.addClasses("box p-2 mb-3")
			.addHTML(`
				<h4 class="mb-1 fw-bolder">Meaning</h4>
				<span class="fw-light">${data.meanings[0].definitions[0].definition}</span>
			`).elem;
		meaningBoxes.appendChild(meaningBox);
	}
	if(data.meanings[0].synonyms.length) {
		const synonymBox = new $("div")
		.addClasses("box p-2 mb-3")
		.addHTML(`
			<h4 class="mb-1 fw-bolder">Synonyms</h4>
			${htmlToString(
				new $("span")
				.addClasses("fw-light")
				.addTags(data.meanings[0].synonyms)
				.elem
			)}
		`
		).elem
		meaningBoxes.appendChild(synonymBox);
	}
}

let FETCH_INTERVAL_ID;
let FETCH_INTERVAL = 1000;
input.addEventListener("keyup", e => {
	if(FETCH_INTERVAL_ID) {
		clearTimeout(FETCH_INTERVAL_ID);
	}
	FETCH_INTERVAL_ID = setTimeout(() => {
		const word = e.target.value.trim();
		fetchWord(word);
	}, FETCH_INTERVAL);
});

clearBtn.addEventListener("click", () => {
	input.value = "";
	fetchWord(input.value);
});