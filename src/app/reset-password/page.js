"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { requestResetPassword } from "@/services/forgot-password";
import { resetPassword } from "@/services/reset-password";
import { setNewPasswordFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
newPassword: "",
confirmPassword: "",
};



// async function handleResetPassword() {
  
// // }
//     setPageLevelLoader(true);
//     const data = await requestResetPassword(formData);
//     console.log(data)

//     if (data.success) {
//       toast.success(data.message, {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//       setIsVerifiedEmail(true);
//       setPageLevelLoader(false);
//       setFormData(initialFormData);
//     } else {
//       toast.error(data.message, {
//         position: toast.POSITION.TOP_RIGHT,
//       });
//       setPageLevelLoader(false);
//       setFormData(initialFormData);
//     }

//     console.log(data);
// }

//   useEffect(() => {
//     if (isAuthUser) router.push("/login");
//   }, [isAuthUser]);


export default function NewPassword() {
  const [formData, setFormData] = useState(initialFormData);
  const [isUpdated, setIsUpdated] = useState(false)
  const { pageLevelLoader, setPageLevelLoader , isAuthUser, setIsAuthUser, setUser } = useContext(GlobalContext);
  const router = useRouter()
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const id = urlParams.get('id');

  console.log(isAuthUser);
  

  function isFormValid() {
    return formData &&
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.confirmPassword == formData.newPassword
      ? true
      : false;
  }

  console.log(isFormValid());

  async function handleSetNewPassword() {
    if (!id || !token) {
        console.error("Missing id or token from URL");
        return;
      }
      const resetDetails = {
        userId:id,
        token,
        newPassword: formData.newPassword,
      };
  
    setPageLevelLoader(true);
    const data = await resetPassword(resetDetails);
    console.log(data)

    if (data.success) {
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsUpdated(true);
      setPageLevelLoader(false);
      setFormData(initialFormData);
    } else {
      toast.error(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setPageLevelLoader(false);
      setFormData(initialFormData);
    }

    console.log(data);
  }

  useEffect(() => {
    if (isAuthUser) router.push("/login");
  }, [isAuthUser]);

  return (
    <div className="bg-white relative">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                {!isUpdated?
                   "Set Up Your New Password"
                  : "Password Reset Successful!"}
              </p>
              {isUpdated ? (
                // <button
                //   className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                // text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                // "
                // onClick={()=>router.push('/login')}
                // >
                //   Login
                // </button>
                <>
                <p className=" text-center mx-auto w-full max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">Your password has been updated!</p>
                <button className="hover:bg-stone-600 hover:text-stone-100 shadow-1g border-2 border-padding px-4 py-2 border-gray-500" onClick={() => router.push("/login")}>Login</button>
                </>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  {setNewPasswordFormControls.map((controlItem) =>
                    controlItem.componentType === "input" ? (
                      <InputComponent
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        label={controlItem.label}
                        onChange={(event) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: event.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
                      />
                    ) : controlItem.componentType === "select" ? (
                      <SelectComponent
                        options={controlItem.options}
                        label={controlItem.label}
                        onChange={(event) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: event.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
                      />
                    ) : null
                  )}
                  <button
                    className=" disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                   text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                   "
                    disabled={!isFormValid()}
                    onClick={handleSetNewPassword}
                  >
                    {pageLevelLoader ? (
                      <ComponentLevelLoader
                        text={"Resetting Password"}
                        color={"#ffffff"}
                        loading={pageLevelLoader}
                      />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}