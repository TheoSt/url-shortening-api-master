let hamIcon = document.querySelector("#ham-icon");
let navMenu = document.querySelector(".nav-menu");
let url_form = document.querySelector("#url-form");
let urlInput = document.querySelector("#url-input");
let errorText = urlInput.nextElementSibling;
let results_section = document.querySelector("#shorten-links");
let nowCopy = null;
let error = true;

hamIcon.addEventListener("click", function() {
	navMenu.classList.toggle("active-dropdown");
});

url_form.addEventListener("submit",function(e) {
	e.preventDefault();
	let url = urlInput.value;
	let result_text ="";

	if(errorCheck(url)) return;

	fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
	.then(res => {
		return res.json();
	})
	.then(data=> {
		try {
			if(data.ok) result_text = data.result.full_short_link;
			addResult(url,result_text);
		}
		catch(e) {
			switch(data.error_code) {
				case 1:
					result_text = "No url found! Please pass a url";
					break;
				case 2:
					result_text = "Something went wrong with the url.Please try again";
					break;
				case 3:
					result_text = "Rate limit reached. Wait a second and try again"
					break;
				case 4:
					result_text = "IP-Address has been blocked because of violating our terms of service(shrtco.de)";
					break;
				case 5:
					result_text = "shrtcode code(slug) already taken/in use";
					break;
				case 6:
					result_text = "Unknown error :(";
					break;
				case 7:
					result_text = "No code specified('code' parameter is empty)";
					break;
				case 8:
					result_text = "Invalid code submitted (code not found/there is no such short-link)"
					break;
				case 9:
					result_text = "Missing required parameters";
					break;
				case 10:
					result_text = "Trying to shorten a disallowed link";
					break;
			}
		}
	})
	.catch(error => {
		console.log("Error! ",error);
	})
});

function errorCheck(url) {
	if(url==="") {
		urlInput.classList.add("border-error");
		errorText.classList.add("link-error");
		return true;
	}
	urlInput.classList.remove("border-error");
	errorText.classList.remove("link-error");

	return false;
}


function addResult(originalLink,shortenLink) {
	const resultDiv = document.createElement("div");
	resultDiv.classList.add("result");

	if(originalLink.length>=25) {
		originalLink = originalLink.slice(0,25)+"...";
	}
	const originalLinkSpan = document.createElement("span");
	originalLinkSpan.classList.add("original-link");
	originalLinkSpan.textContent = originalLink;

	
	const shortenLinkElem = document.createElement("a");
	shortenLinkElem.classList.add("shorten-link");
	shortenLinkElem.setAttribute("href",shortenLink);
	shortenLinkElem.textContent = shortenLink;

	const copyButton = document.createElement("button");
	copyButton.classList.add("copy-button");
	copyButton.textContent = "Copy";
	copyButton.addEventListener("click",copyText);

	resultDiv.appendChild(originalLinkSpan);
	resultDiv.appendChild(shortenLinkElem);
	resultDiv.appendChild(copyButton);
	results_section.appendChild(resultDiv);
}

function copyText() {
	if(this===nowCopy) {
		return;
	}
	
	navigator.permissions.query({name: "clipboard-write"}).then(result => {
	  	if (result.state == "granted" || result.state == "prompt") {
	    	navigator.clipboard.writeText(this.previousElementSibling.textContent);
	  	}
	});

	if(nowCopy){
		nowCopy.textContent = "Copy";
		nowCopy.disabled = false;
		nowCopy.classList.toggle("copied-button");
	}
	nowCopy = this;
	nowCopy.textContent = "Copied!";
	nowCopy.classList.toggle("copied-button");
	nowCopy.disabled = true;
}