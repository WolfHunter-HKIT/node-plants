const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "plantsdatabase",
	port: 3308,
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

// app.get("/:id", (req, res) => {
//   res.send("Hello World!!!");
//   console.log(req.params.id);
// });

// @ POST
// app.post("/trees", (req, res) => {
//   let sql;

//   sql = `
//     INSERT INTO trees
//     (name, height, type)
//     VALUES (
//         '${req.body.name}',
//         '${req.body.height}',
//         '${req.body.type}'
//     )
//     `;
//   connection.query(sql);

//   res.json({ message: "OK " });
// });

app.post("/trees", (req, res) => {
	let sql;

	sql = `
    INSERT INTO trees
    (name, height, type)
    VALUES (
        ?,?,?
    )
    `;
	connection.query(sql, [req.body.name, req.body.height, req.body.type]);

	res.json({ message: "OK " });
});

// @ GET all
app.get("/plants", (req, res) => {
	let sql;

	sql = `
    SELECT * FROM plants
    `;

	connection.query(sql, function (err, result) {
		if (err) throw err;
		res.json(result);
	});
});

// @ GET /:id
app.get("/plants/:id", (req, res) => {
	let sql;

	sql = `
    SELECT * FROM plants
    WHERE id = ?;
    `;

	connection.query(sql, [req.params.id], function (err, result) {
		if (err) {
			console.log("Error while fetching");
			return res
				.status(500)
				.json({ message: "Error while fetching", error: err.message });
		}

		if (result.length === 0) {
			return res.status(404).json({ message: "Data not found" });
		}

		res.json(result[0]);
	});
});

// @PUT update /:id
app.put("/plants/:id", function (req, res) {
	let sql = `
    UPDATE plants
    SET name = ?, height = ?, type = ?
    WHERE id = ?
    `;
	connection.query(
		sql,
		[req.body.name, req.body.height, req.body.type, req.params.id],
		(err, result) => {
			const selectSQL = `SELECT * FROM plants WHERE id = ?`;

			connection.query(selectSQL, [req.params.id], (err, updatedResult) => {
				res.json({
					message: "Record updated",
					updatedResult: updatedResult[0],
				});
			});
		}
	);
});

// @DELETE /:id
app.delete("/plants/:id", (req, res) => {
	let sql = `
    DELETE FROM plants
    WHERE id = ?
    `;

	connection.query(sql, [req.params.id], function (err, result) {
		if (err) {
			return res
				.status(500)
				.json({ message: "Error deleting data", error: err.message });
		}

		res.json({
			message: "Record deleted",
			result: {
				id: req.params.id,
				name: req.body.name,
				height: req.body.height,
				type: req.body.type,
			},
		});
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
