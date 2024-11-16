import { useDispatch } from "react-redux";
import { createPartyLogin, findlogger, updatePartyLogin } from "../Store/Slice/PartySlice";
import { useLayoutEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

export default function ThirdParty({ data }) {
  const [formData, setFormData] = useState();
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  const formHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useLayoutEffect(() => {
    if (data) {
      dispatch(findlogger(data?._id)).then((e) => {
        setChecked(e.payload.data?.status);
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
    dispatch(updatePartyLogin({ ...formData, status: checked })).then(
      (doc) => {
        if (doc.payload?.message) {
          showSuccessToast(doc.payload?.message);
        }
        if (doc.payload?.error) {
          showErrorToast(doc.payload?.error);
        }
      }
    );
  };

  const onRegister = () => {
    dispatch(
      createPartyLogin({
        ...formData,
        status: checked,
        auth: true,
        schoolid: data?._id,
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
      <div className="flex gap-3">
        <span className="p-float-label mt-7 w-full">
          <InputText
            id="username"
            value={data?.name}
            name="email"
            onChange={formHandler}
            disabled
            className="w-full border-gray-300 border px-2 py-3"
          />
          <label htmlFor="username">First Name</label>
        </span>    
      </div>
      <span className="p-float-label mt-7">
        <InputText
          id="username"
          value={formData?.email}
          name="email"
          onChange={formHandler}
          className="w-full border-gray-300 border px-2 py-3"
        />
        <label htmlFor="username">Username</label>
      </span>
      {formData?.auth ? (<>
        <span className="p-float-label mt-7 w-full">
          <InputText
            id="username"
            value={formData?.ogpass}
            name="ogpass"
            onChange={formHandler}
            disabled
            feedback={false}
            className="w-full pl-2 border-gray-300 border  h-12 rounded-md"
          />
          <label htmlFor="username">Original Password</label>
        </span>
        <span className="p-float-label mt-7 w-full">
          <Password
            id="username"
            value={formData?.newpass}
            name="newpass"
            onChange={formHandler}
            feedback={false}
            toggleMask
            inputClassName="w-full pl-3"
            className="w-full border-gray-300 border  h-12 rounded-md"
          />
          <label htmlFor="username">Enter Password</label>
        </span>
      </>) : (
        <span className="p-float-label mt-7 w-full">
          <Password
            id="username"
            value={formData?.pass}
            name="pass"
            onChange={formHandler}
            feedback={false}
            inputClassName="w-full pl-3"
            toggleMask
            className="w-full border-gray-300 border  h-12 rounded-md"
          />
          <label htmlFor="username">Enter Password</label>
        </span>
      )}

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
    </>
  );
}
