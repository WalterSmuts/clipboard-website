var last_image;
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();

	auth2.signOut().then(function () {
		document.getElementById("signout_button").hidden = true;
		document.getElementById("save_button").hidden = true;
		document.getElementById("save_image_button").hidden = true;
		document.getElementById("signout_button").hidden = true;
		document.getElementById("image_file").hidden = true;
		document.getElementById("myTooltip").hidden = true;
		document.getElementById("clipboard").hidden = true;
		document.getElementById("image").hidden = true;
		document.getElementById("google-image-div").innerHTML = "";

		document.getElementById("heading").innerHTML = "Web Clipboard";
		console.log('User signed out.');
	});
}

function onSignIn(googleUser) {
	document.getElementById("signout_button").hidden = false;
	document.getElementById("save_button").hidden = false;
	document.getElementById("save_image_button").hidden = false;
	document.getElementById("signout_button").hidden = false;
	document.getElementById("image_file").hidden = false;
	document.getElementById("myTooltip").hidden = false;

	var profile = googleUser.getBasicProfile();
	var id_token = googleUser.getAuthResponse().id_token;
	document.getElementById("heading").innerHTML = profile.getName() + "'s Web Clipboard";
	var img = document.createElement("img");
	img.src = profile.getImageUrl();
	var src = document.getElementById("google-image-div");
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
	last_image = file;
	display_image();
};

function change() {
	document.getElementById("saving").hidden = true;
	document.getElementById("saved").hidden = true;
}

function copyToLocal() {
	var copyText = document.getElementById("clipboard");
	copyText.select();
	copyText.setSelectionRange(0, 99999)
	document.execCommand("copy");
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = "Copied!";
}

function outFunc() {
	var tooltip = document.getElementById("myTooltip");
	tooltip.innerHTML = "Click to Copy";
}

function display_image_from_selector() {
	let image_file = document.getElementById('image_file');
	last_image = image_file.files[0];
	display_image();
}

function display_image(image) {
	document.getElementById('image').src = window.URL.createObjectURL(last_image);
	document.getElementById('image').hidden = false;
}
