import { delete_book_mark_job } from "@/Services/job/bookmark";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiFillDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export default function SavedJobDataTable() {
  const router = useRouter();
  const bookMarkJobData = useSelector((state) => state.AppliedJob.bookMark);

  const [Data, setData] = useState([]);

  useEffect(() => {
    setData(bookMarkJobData);
  }, []);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(Data);
  }, [Data]);

  const columns = [
    {
      name: "Saved Date",
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
      name: "Action",
      minWidth: "90px",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row?._id)}
          className="md:px-2 md:py-2 px-1 py-1 text-xl text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600   rounded transition-all duration-700  "
        >
          <AiFillDelete />
        </button>
      ),
    },
    {
      name: "",
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

  const handleDelete = async (id) => {
    const res = await delete_book_mark_job(id);
    if (res?.success) {
      toast.success(res.message || "Job removed from saved bookmarks");
      setData((prev) => prev.filter((item) => item?._id !== id));
      setFilteredData((prev) => prev.filter((item) => item?._id !== id));
    } else {
      toast.error(res?.message || "Failed to remove saved job");
    }
  };

  return (
    <>
      <DataTable
        subHeaderAlign={"right"}
        columns={columns}
        data={filteredData}
        keyField="_id"
        pagination
        title={`Total Saved Jobs: ${Data?.length}`}
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

      <ToastContainer />
    </>
  );
}
