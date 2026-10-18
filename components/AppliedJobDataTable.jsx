import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

export default function AppliedJobDataTable() {
  const router = useRouter();
  const appliedJobData = useSelector((state) => state.AppliedJob.appliedJob);

  const [Data, setData] = useState([]);

  useEffect(() => {
    setData(appliedJobData);
  }, []);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(Data);
  }, [Data]);

  const columns = [
    {
      name: "Apply Date",
      minWidth: "110px",
      selector: (row) => new Date(`${row?.createdAt}`).toLocaleDateString("en-GB"),
    },
    {
      name: "Employer Name",
      minWidth: "170px",
      selector: (row) => row?.job?.company,
      wrap: true,
    },
    {
      name: "Job title",
      minWidth: "200px",
      selector: (row) => row?.job?.title,
      wrap: true,
    },
    {
      name: "Job Salary ",
      minWidth: "110px",
      selector: (row) => "৳" + row?.job?.salary,
    },
    {
      name: "Status",
      minWidth: "110px",
      selector: (row) => (
        <p
          className={`uppercase font-semibold ${
            row?.status === "accepted" ? "text-green-500" : ""
          }  ${row?.status === "rejected" ? "text-red-600" : ""}`}
        >
          {row?.status}
        </p>
      ),
    },
    {
      name: "Action",
      minWidth: "130px",
      cell: (row) => (
        <button
          onClick={() => router.push(`/frontend/jobDetails/${row?.job?._id}`)}
          className="md:px-2 md:py-2 px-1 py-1 text-xs text-sky-700 hover:text-white my-2 hover:bg-indigo-600 border border-sky-700   rounded transition-all duration-700  "
        >
          View Details
        </button>
      ),
    },
  ];

  useEffect(() => {
    if (search === "") {
      setFilteredData(Data);
    } else {
      setFilteredData(
        Data?.filter((item) => {
          const itemData = (item?.job?.company || "").toUpperCase();
          const textData = search.toUpperCase();
          return itemData.indexOf(textData) > -1;
        })
      );
    }
  }, [search, Data]);

  return (
    <>
      <DataTable
        subHeaderAlign={"right"}
        columns={columns}
        data={filteredData}
        keyField="_id"
        pagination
        title={`Total Applied Jobs: ${Data?.length}`}
        fixedHeader
        fixedHeaderScrollHeight="79%"
        selectableRows
        selectableRowsHighlight
        subHeader
        persistTableHead
        subHeaderComponent={
          <input
            className="w-60  py-2 px-2  outline-none  border-b-2 border-sky-700"
            type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Search with company name..."}
          />
        }
        className="h-screen bg-white"
      />
    </>
  );
}
