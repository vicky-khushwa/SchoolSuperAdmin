import { TabView, TabPanel } from "primereact/tabview";
import SchoolForm from "./SchoolForm";
import TeacherTab from "./TeacherTab";
import ThirdParty from "./ThirdParty";
import ImageTest from "./ImageTest";

import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";

import { Password } from "primereact/password";
import { useLayoutEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import {
  SchoolAdminCreate,
  SchoolAdminFind,
  SchoolAdminUpdate,
} from "../Store/Slice/AdminLoginSlice";
import { Toast } from "primereact/toast";
export default function SchoolDasboard({ data }) {
  return (
    <>
      <TabView>
        <TabPanel header="Update School">
          <SchoolForm label="u" data={data} />
        </TabPanel>
        <TabPanel header="Teacher">
          <TeacherTab schoolid={data} />
        </TabPanel>
        <TabPanel header="Third Party">
          <ThirdParty data={data} />
        </TabPanel>
        <TabPanel header="ICard Template">
          <ImageTest data={data?._id} />
        </TabPanel>
        <TabPanel header="School Admin">
          <RegisterForm data={data} />
        </TabPanel>
      </TabView>
    </>
  );
}

const RegisterForm = ({ data }) => {
  const [formData, setFormData] = useState();
  const [checked, setChecked] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const dispatch = useDispatch();

  const formHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useLayoutEffect(() => {
    if (data) {
      dispatch(SchoolAdminFind(data?._id)).then((e) => {
        setChecked(e.payload.data?.status);
        setStartDate(e.payload.data?.startexpired);
        setEndDate(e.payload.data?.expired);
        setFormData(e.payload.data);
      });
    }
  }, [dispatch, data]);

  const toast = useRef(null);

  const showSuccessToast = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success Message",
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (error) => {
    toast.current.show({
      severity: "info",
      summary: "Error Message",
      detail: error,
      life: 3000,
    });
  };

  const onChangeUserPassword = () => {
    dispatch(
      SchoolAdminUpdate({
        ...formData,
        status: checked,
        expired: endDate,
        startexpired: startDate,
      })
    ).then((doc) => {
      if (doc.payload?.message) {
        dispatch(SchoolAdminFind(data?._id)).then((e) => {
          setChecked(e.payload.data?.status);
          setStartDate(e.payload.data?.startexpired);
          setEndDate(e.payload.data?.expired);
          setFormData(e.payload.data);
        });
        showSuccessToast(doc.payload?.message);
      }
      if (doc.payload?.error) {
        showErrorToast(doc.payload?.error);
      }
    });
  };

  const onRegister = () => {
    dispatch(
      SchoolAdminCreate({
        ...formData,
        status: checked,
        auth: true,
        schoolid: data?._id,
        expired: endDate,
        startexpired: startDate,
      })
    ).then((doc) => {
      if (doc.payload?.message) {
        showSuccessToast(doc.payload?.message);
      }
      if (doc.payload?.error) {
        showErrorToast(doc.payload?.error);
      }
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="grid place-content-center">
        <div className="flex gap-3 w-96">
          <span className="p-float-label mt-7 w-full">
            <InputText
              id="username"
              value={data?.name}
              name="email"
              onChange={formHandler}
              disabled
              className="w-full border-gray-300 border px-2 py-3"
            />
          </span>
        </div>
        <span className="p-float-label mt-7 w-96">
          <InputText
            id="username"
            value={formData?.email}
            name="email"
            onChange={formHandler}
            className="w-full border-gray-300 border px-2 py-3"
          />
          <label htmlFor="username">Username</label>
        </span>
        {formData?.auth ? (
          <>
            <span className="p-float-label mt-7 w-full">
              <InputText
                id="username"
                value={formData?.ogpass}
                name="ogpass"
                onChange={formHandler}
                feedback={false}
                disabled
                className="w-full pl-2 border-gray-300 border  h-12 rounded-md"
              />
              <label htmlFor="username">Original Password</label>
            </span>
            <span className="p-float-label mt-7">
              <FloatLabel>
                <Password
                  id="username"
                  value={formData?.newpass}
                  name="newpass"
                  onChange={formHandler}
                  feedback={false}
                  toggleMask
                  inputClassName="pl-3 h-12 w-96"
                  className="border-gray-300 border rounded-md"
                />
                <label htmlFor="username">Enter New Password</label>
              </FloatLabel>
            </span>
          </>
        ) : (
          <span className="p-float-label mt-7 w-full">
            <Password
              id="username"
              value={formData?.pass}
              name="pass"
              onChange={formHandler}
              feedback={false}
              inputClassName="pl-3 h-12 w-96"
              className="border-gray-300 border rounded-md"
              toggleMask
            />
            <label htmlFor="username">Enter Password</label>
          </span>
        )}
        <div className=" flex gap-3 mt-7 hidden">
          <span className="w-full">
            <FloatLabel>
              <Calendar
                invalid="start_date"
                value={startDate}
                dateFormat="dd/mm/yy"
                inputClassName="w-full pl-3"
                onChange={(e) => setStartDate(e.value)}
                className="w-full border-gray-300 border  h-12 rounded-md"
                showIcon
              />
              <label htmlFor="start_date">Start Expired Date</label>
            </FloatLabel>
          </span>
          <span className="w-full">
            <FloatLabel>
              <Calendar
                invalid="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.value)}
                dateFormat="dd/mm/yy"
                inputClassName="w-full pl-3"
                className="w-full border-gray-300 border  h-12 rounded-md"
              />
              <label htmlFor="end_date">End Expired Date</label>
            </FloatLabel>
          </span>
        </div>
        <span className="flex justify-center gap-3 mt-7">
          <Checkbox
            id="status"
            name="status"
            className="outline-gray-300 outline outline-1 rounded-md"
            onChange={(e) => setChecked(e.checked)}
            checked={checked}
          ></Checkbox>
          <label htmlFor="address">Active</label>
        </span>
        {formData?.auth ? (
          <Button
            label="Update"
            onClick={onChangeUserPassword}
            className="mt-7 bg-cyan-500 w-full text-white p-3"
          />
        ) : (
          <Button
            label="Create"
            onClick={onRegister}
            className="mt-7 bg-cyan-500 w-full text-white p-3"
          />
        )}
      </div>
    </>
  );
};
