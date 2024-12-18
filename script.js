const form = document.getElementById("form");

// @POST /plants
form.addEventListener("submit", (e) => {
	e.preventDefault();

	const plantData = {
		name: document.getElementById("createName").value,
		height: document.getElementById("createHeight").value,
		type: document.getElementById("createType").value,
	};

	fetch("http://localhost:3000/plants", {
		method: "POST",
		headers: { "Content-type": "application/json" },
		body: JSON.stringify(plantData),
	})
		.then((res) => res.json())
		.then(() => form.reset());
});

// @GET /plants
function fetchTrees() {
	fetch("http://localhost:300/plants")
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		});
}
fetchTrees();
