import { change_application_status, download_cv } from "@/Services/job";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";

const statusClass = (status) =>
  `uppercase font-semibold ${status === "accepted" ? "text-green-500" : ""} ${
    status === "rejected" ? "text-red-600" : ""
  }`;

export default function ApplicationsDataTable({ application }) {
  const router = useRouter();

  const [Data, setData] = useState([]);

  useEffect(() => {
    setData(application);
  }, [application]);

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(Data);
  }, [Data]);

  const updateStatus = async (id, status) => {
    const res = await change_application_status({ id, status });
    if (res.success) {
      setData((prev) =>
        prev.map((item) => (item?._id === id ? { ...item, status } : item))
      );
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const handleDownloadCV = async (name) => {
    const res = await download_cv(name);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    const fileUrl = URL.createObjectURL(res.blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  };

  const columns = [
    {
      name: "Name",
      minWidth: "150px",
      selector: (row) => row?.user?.name,
      wrap: true,
    },
    {
      name: "Email",
      minWidth: "200px",
      selector: (row) => row?.user?.email,
      wrap: true,
      style: { overflowWrap: "anywhere" },
    },
    {
      name: "CV",
      minWidth: "120px",
      selector: (row) => (
        <button
          onClick={() => handleDownloadCV(row?.cv)}
          className=" w-20 py-2 text-xs text-sky-700 hover:text-white my-2 hover:bg-indigo-600 border border-sky-700 rounded transition-all duration-700"
        >
          Download CV
        </button>
      ),
    },
    {
      name: "Status",
      minWidth: "110px",
      selector: (row) => <p className={statusClass(row?.status)}>{row?.status}</p>,
    },
    {
      name: "Action",
      minWidth: "320px",
      cell: (row) => (
        <div className="flex items-center justify-start w-72 h-20">
          <button
            onClick={() =>
              router.push(`/frontend/applicationDetail/${row?._id}`)
            }
            className=" w-20 py-2 mx-2 text-xs text-sky-700 hover:text-white my-2 hover:bg-indigo-600 border border-sky-700 rounded transition-all duration-700"
          >
            Details
          </button>
          <button
            onClick={() => updateStatus(row?._id, "accepted")}
            className=" w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus(row?._id, "rejected")}
            className=" w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (search === "") {
      setFilteredData(Data);
    } else {
      setFilteredData(
        Data?.filter((item) => {
          const itemData = (item?.user?.name || "").toUpperCase();
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
        title={`Total Applications : ${Data?.length}`}
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
            placeholder={"Search with Applicant  name..."}
          />
        }
        className="h-screen bg-white"
      />
    </>
  );
}
