const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "travel",
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/attractions", function (req, res, next) {
    //
    const page = parseInt(req.query.page);
    const per_page = parseInt(req.query.per_page);
    const start_page = (page - 1) * per_page;
    const sort_column = req.query.sort_column;
    const sort_direction = req.query.sort_direction;
    const search = req.query.search;

    let params = [];
    let sql = "SELECT * FROM attractions ";
    if (search) {
        sql += `WHERE name LIKE ? `;
        params.push(`%${search}%`);
    }
    if (sort_column) {
        sql += `ORDER BY ${sort_column} ${sort_direction}`;
    }
    sql += " LIMIT ? , ?";
    params.push(start_page);
    params.push(per_page);

    console.log(sql, params);

    // execute will internally call prepare and query
    connection.execute(sql, params, function (err, results, fields) {
        let tsql = "SELECT COUNT(id) AS total FROM attractions";
        connection.query(tsql, function (err, rs, fields) {
            const total = rs[0]["total"];
            const total_pages = Math.ceil(total / per_page);
            res.json({
                page: page,
                total: total,
                total_pages: total_pages,
                per_page: per_page,
                data: results,
            });
        });
    });
});

app.listen(5000, function () {
    console.log("CORS-enabled web server listening on port 5000");
});
