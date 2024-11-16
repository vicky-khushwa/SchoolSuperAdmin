import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import SchoolForm from "../Utility/SchoolForm";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useDispatch, useSelector } from "react-redux";
import { getAllSchool } from "../Store/Slice/SchoolSlice";
import SchoolDasboard from "../Utility/SchoolDasboard";
import { useNavigate } from "react-router-dom";
export default function School({ data }) {
  const [selectSchool, setSelectSchool] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [lable, setLable] = useState();
  const { School } = useSelector((state) => state.School);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Supertoken")) {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    dispatch(getAllSchool()).then(
      (doc) => {
        if (doc.payload?.response?.status === 403) {
          localStorage.removeItem("email");
          localStorage.removeItem("Admintoken");
          localStorage.removeItem("schoolid");
          localStorage.removeItem("schoolName");
          navigate("/login");
        }
      }
    );;
  }, [dispatch]);

  const [filters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [statuses] = useState([true, false]);

  const statusItemTemplate = (option) => {
    return (
      <Tag
        value={option ? "Active" : "De-active"}
        severity={getSeverity(option)}
      />
    );
  };

  const statusBodyTemplate = (School) => {
    return (
      <Tag
        value={School.status === true ? "Active" : "De-active"}
        severity={getSeverity(School.status)}
      ></Tag>
    );
  };

  const getSeverity = (School) => {
    switch (School) {
      case true:
        return "success";

      case false:
        return "danger";
      default:
        return "no status";
    }
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const header = (
    <div className="flex justify-between items-center">
      <span className="text-xl text-900 font-bold">School List</span>
      <Button
        onClick={() => {
          setVisible(true);
          setLable("s");
        }}
        label="Create School"
        className="bg-cyan-500 p-2 text-white"
      />
    </div>
  );

  const footer = `In total there are ${School ? School.length : 0} Schools.`;

  return (
    <>
      <Dialog
        header={"Create School"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <SchoolForm label={lable} close={() => setVisible(false)} />
      </Dialog>

      <Dialog
        header={selectSchool?.name + " Dashboard"}
        visible={visible2}
        onHide={() => {
          setVisible2(false);
          setSelectSchool();
        }}
        maximized
      >
        <SchoolDasboard data={selectSchool} />
      </Dialog>

      <DataTable
        value={School}
        header={header}
        dataKey="_id"
        stripedRows
        filterDisplay="row"
        filters={filters}
        tableStyle={{ minWidth: "60rem" }}
        selectionMode="single"
        footer={footer}
        selection={selectSchool}
        rows={10}
        paginator
        onSelectionChange={(e) => {
          setSelectSchool(e.value);
          setVisible2(true);
        }}
      >
        <Column
          filter
          filterPlaceholder="Search school"
          field="name"
          header="School Name"
          className="w-[20rem]"
        ></Column>
        <Column field="address" header="Address" className="w-[20rem]"></Column>
        <Column
          filter
          field="city"
          header="City"
          className="w-[10rem]"
          filterPlaceholder="Search city"
        ></Column>
        <Column
          filter
          field="state"
          header="State"
          className="w-[10rem]"
          filterPlaceholder="Search state"
        ></Column>

        <Column
          field="office1"
          header="Office Number"
          className="w-[12rem]"
        ></Column>
        <Column
          field="office2"
          header="Office Number"
          className="w-[12rem]"
        ></Column>
        <Column
          field="status"
          header="Status"
          showFilterMenu={false}
          filterMenuStyle={{ width: "8rem" }}
          style={{ minWidth: "8rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusRowFilterTemplate}
        />
      </DataTable>
    </>
  );
}
