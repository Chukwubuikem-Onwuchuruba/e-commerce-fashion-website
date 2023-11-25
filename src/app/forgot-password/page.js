"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { requestResetPassword } from "@/services/forgot-password";
import { resetPasswordFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const initialFormData = {
//   name: "",
  email: "",
//   password: "",
//   role: "customer",
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false)
  const { pageLevelLoader, setPageLevelLoader , isAuthUser, setIsAuthUser, setUser } = useContext(GlobalContext);

  const router = useRouter()

  console.log(isAuthUser);

  function isFormValid() {
    return formData &&
      formData.email &&
      formData.email.trim() !== ""
      ? true
      : false;
  }

  console.log(isFormValid());

  async function handleVerifyEmail() {
    setPageLevelLoader(true);
    const data = await requestResetPassword(formData);
    console.log(data)

    if (data.success) {
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsVerifiedEmail(true);
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
                {!isVerifiedEmail?
                   "Reset Your Password"
                  : "Link Sent to Email"}
              </p>
              {isVerifiedEmail ? (
                // <button
                //   className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                // text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                // "
                // onClick={()=>router.push('/login')}
                // >
                //   Login
                // </button>
                <p className=" text-center w-full max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">A link has been sent to your email. Follow the instructions to reset your password. The link lasts for only an hour.</p>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  {resetPasswordFormControls.map((controlItem) =>
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
                    onClick={handleVerifyEmail}
                  >
                    {pageLevelLoader ? (
                      <ComponentLevelLoader
                        text={"Verifying Email"}
                        color={"#ffffff"}
                        loading={pageLevelLoader}
                      />
                    ) : (
                      "Verify Email"
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