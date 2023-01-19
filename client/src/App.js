import "./App.css";

import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import axios from "axios";

const columns = [
    {
        name: "id",
        selector: (row) => row.id,
        sortable: true,
        width: "50px",
    },
    {
        name: "name",
        selector: (row) => row.name,
        sortable: true,
        width: "200px",
    },
    {
        name: "detail",
        selector: (row) => row.detail,
        sortable: true,
        width: "500px",
    },
    {
        name: "coverimage",
        selector: (row) => row.coverimage,
        sortable: true,
        cell: (row) => (
            <img src={row.coverimage} alt={row.coverimage} width={"200px"} />
        ),
        width: "300px",
    },
    {
        name: "latitude",
        selector: (row) => row.latitude,
        sortable: true,
        width: "100px",
    },
    {
        name: "longitude",
        selector: (row) => row.longitude,
        sortable: true,
        width: "100px",
    },
];

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("");
    const [sortColumnDir, setSortColumnDir] = useState("");
    const [search, setSearch] = useState("");

    let url = `http://localhost:5000/api/attractions?page=${page}&per_page=${perPage}`;
    if (search) {
        url += `&search=${search}`;
    }
    if (sortColumn) {
        url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
    }

    const fetchUsers = async () => {
        setLoading(true);
        // http://localhost:5000/api/attractions?page=1&per_page=10&sort_column=id&sort_direction=asc&search=Phi Phi
        const response = await axios.get(url);

        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    const handleSort = (column, sortDirection) => {
        // simulate server sort
        console.log(column, sortDirection);
        setSortColumn(column.name);
        setSortColumnDir(sortDirection);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearchSumnit = (event) => {
        event.preventDefault();
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers(); // fetch page 1 of users
    }, [page, perPage, sortColumn, sortColumnDir, search]);

    return (
        <div className="App">
            <form onSubmit={handleSearchSumnit}>
                <label>
                    searchn name:
                    <input
                        type="text"
                        name="name"
                        onChange={handleSearchChange}
                    />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <DataTable
                title="Attractions"
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                onSort={handleSort}
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
            />
        </div>
    );
}

export default App;
