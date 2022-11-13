export function htmlToString(elem) {
	return `
		<${elem.nodeName.toLowerCase()} class="${elem.className}">
			${elem.innerHTML}
		</${elem.nodeName.toLowerCase()}>
	`;
}

export class $ {
	#elem;
	constructor(name) {
		this.#elem = document.createElement(name);
	}

	addClasses(...names) {
		this.#elem.className = names;
		return this;
	}

	addHTML(html) {
		this.#elem.innerHTML = html;
		return this;
	}

	addTags(tags) {
		tags.forEach(tag => {
			this.#elem.innerHTML += `
				<span class="text-decoration-underline">${tag},</span>
			`;
		});
		return this;
	}

	get elem() {
		return this.#elem;
	}
}