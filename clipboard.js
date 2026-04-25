var last_image;
var saveTimeout;

function change() {
	document.getElementById("saving").hidden = true;
	document.getElementById("saved").hidden = true;
	clearTimeout(saveTimeout);
	saveTimeout = setTimeout(save, 1000);
}

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();

	auth2.signOut().then(function () {
		document.getElementById("button-group").hidden = true;
		document.getElementById("clipboard").hidden = true;
		document.getElementById("image").hidden = true;
		document.getElementById("google-image-div").innerHTML = "";
		document.getElementById("heading").innerHTML = "Web Clipboard";
		console.log('User signed out.');
	});
}

function onSignIn(googleUser) {
	document.getElementById("button-group").hidden = false;

	var profile = googleUser.getBasicProfile();
	var id_token = googleUser.getAuthResponse().id_token;
	document.getElementById("heading").innerHTML = profile.getName() + "'s Clipboard";
	var img = document.createElement("img");
	img.src = profile.getImageUrl();
	var src = document.getElementById("google-image-div");
	src.innerHTML = "";
	src.appendChild(img);
	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'https://clipboard.waltersmuts.com/backend/sign-in');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onload = function() {
		document.getElementById("clipboard").value = xhr.responseText;
		document.getElementById("clipboard").hidden = false;
		get_image();
	};
	xhr.send('idtoken=' + id_token);
}

function get_image() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://clipboard.waltersmuts.com/backend/image');
	xhr.onload = function() {
		let image = document.getElementById("image");
		image.src = xhr.responseURL;
		document.getElementById('image').hidden = false;
	};
	xhr.send();
}

function save() {
	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'https://clipboard.waltersmuts.com/backend/save');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onloadstart = function() {
		document.getElementById("saving").hidden = false;
		document.getElementById("saved").hidden = true;
	};
	xhr.onload = function() {
		document.getElementById("saving").hidden = true;
		document.getElementById("saved").hidden = false;
	};
	xhr.send('clipboard=' + encodeURIComponent(document.getElementById("clipboard").value));
}

function save_image() {
	var xhr = new XMLHttpRequest();

	let formData = new FormData();
	formData.append("image", last_image);
	xhr.onloadstart = function() {
		document.getElementById("saving").hidden = false;
		document.getElementById("saved").hidden = true;
	};
	xhr.onload = function() {
		document.getElementById("saving").hidden = true;
		document.getElementById("saved").hidden = false;
	};
	xhr.open('POST', 'https://clipboard.waltersmuts.com/backend/save_image');
	xhr.send(formData);
}

document.onpaste = (paste_event) => {
	const clipboard = paste_event.clipboardData || window.clipboardData;
	const file = clipboard.files[0];
	if (file) {
		last_image = file;
		display_image();
		var fb = document.getElementById("paste-feedback");
		fb.innerHTML = "Image pasted!";
		fb.hidden = false;
		setTimeout(function() { fb.hidden = true; }, 2000);
	}
};

function copyToLocal() {
	var text = document.getElementById("clipboard").value;
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text);
	} else {
		var copyText = document.getElementById("clipboard");
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
	}
	var fb = document.getElementById("paste-feedback");
	fb.innerHTML = "Copied to clipboard!";
	fb.hidden = false;
	setTimeout(function() { fb.hidden = true; }, 2000);
}

function outFunc() {}

function display_image_from_selector() {
	let image_file = document.getElementById('image_file');
	last_image = image_file.files[0];
	display_image();
}

function display_image() {
	document.getElementById('image').src = window.URL.createObjectURL(last_image);
	document.getElementById('image').hidden = false;
}
