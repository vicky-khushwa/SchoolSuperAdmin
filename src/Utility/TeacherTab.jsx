import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeacherBySchool } from "../Store/Slice/TeacherSlice";
import TeacherLogin from "../Utility/TeacherLoginUpdate";
import TeacherForm from "./TeacherForm";
export default function TeacherTab({ schoolid }) {
  const [selectSchool, setSelectSchool] = useState();
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [lable, setLable] = useState();
  const { Teacher } = useSelector((state) => state.Teacher);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTeacherBySchool(schoolid?._id));
  }, [dispatch, schoolid]);

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
        return "NO Satus";
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
      <span className="text-xl text-900 font-bold">Teacher List</span>
      <Button
        onClick={() => {
          setVisible(true);
          setLable("s");
        }}
        label="Create Teacher"
        className="bg-cyan-500 p-2 text-white"
      />
    </div>
  );
  const footer = `In total there are ${
    Teacher ? Teacher.length : 0
  }  Teacher's.`;

  return (
    <>
      <Dialog
        header={"Create Teacher"}
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vh" }}
      >
        <TeacherForm
          data={schoolid}
          label={lable}
          close={() => setVisible(false)}
        />
      </Dialog>

      <Dialog
        header={selectSchool?.name + " Dashboard"}
        visible={visible2}
        onHide={() => {
          setSelectSchool();
          setVisible2(false);
        }}
        maximized
      >
        <TeacherLogin data={selectSchool} />
      </Dialog>

      <DataTable
        value={Teacher}
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
          filterPlaceholder="First Name"
          field="name"
          header="First Name"
          className="w-[20rem]"
        ></Column>
        <Column
          filter
          filterPlaceholder="Search school"
          field="lastnm"
          header="Last Name"
          className="w-[20rem]"
        ></Column>
        <Column field="address" header="Address" className="w-[20rem]"></Column>
        <Column
          filter
          field="classs"
          header="Class"
          className="w-[10rem]"
          filterPlaceholder="Search city"
        ></Column>
        <Column
          filter
          field="section"
          header="Section"
          className="w-[10rem]"
          filterPlaceholder="Search state"
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
