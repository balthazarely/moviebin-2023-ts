import { PageWidthWrapper } from "@/components/layout";
import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore, FirebaseUser } from "../../lib/firebase";
import {
  addOrUpdateCustomUsername,
  updateThemeInFirebase,
} from "../../lib/firebaseUsernames";
import { ModalWrapper } from "@/components/elements/UIElements";
import { UpdateProfilePictureModal } from "@/components/modals";
import { UIContext } from "../../lib/context";

export default function Settings() {
  const { dispatch } = useContext(UIContext);

  // @ts-ignore
  const [user]: FirebaseUser = useAuthState(auth);
  const userDocRef = firestore.collection("users").doc(user?.uid?.toString());
  // @ts-ignore
  const [userDoc] = useDocumentData<any>(userDocRef);
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (userDoc?.username) {
      setUsername(userDoc.username);
    }
  }, [userDoc]);

  async function updateCustomUsername(e: any) {
    e.preventDefault();
    try {
      const isUsernameValid = await checkUsername();
      if (isUsernameValid) {
        await addOrUpdateCustomUsername(username);
        setErrorMsg("");
      }
    } catch (error) {}
  }

  const handleInputChange = (event: any) => {
    const userInput = event.target.value;
    const sanitizedInput = userInput.replace(/[^a-zA-Z0-9\s]/g, "");
    setUsername(sanitizedInput);
  };

  async function checkUsername() {
    if (!username) {
      return false;
    }
    const trimmerUsername = username.trim();
    const userDocRef = firestore.collection("usernames").doc(trimmerUsername);
    const foundDoc = await userDocRef.get();

    if (foundDoc.exists) {
      const doc = foundDoc.data();
      if (doc?.userId === user?.uid?.toString()) {
        setErrorMsg("");
        return true;
      } else {
        setErrorMsg("username already exists");
        return false;
      }
    } else {
      setErrorMsg("");
      return true;
    }
  }

  const themes = [
    { name: "dark", color: "bg-sky-800", textColor: "text-white" },
    { name: "night", color: "bg-blue-800", textColor: "text-white" },
    { name: "business", color: "bg-slate-700 ", textColor: "text-white" },
    { name: "luxury", color: "bg-yellow-800", textColor: "text-white" },
    { name: "synthwave", color: "bg-pink-400", textColor: "text-white" },
    { name: "forest", color: "bg-green-600", textColor: "text-white" },
    { name: "dracula", color: "bg-cyan-900", textColor: "text-white" },
    { name: "light", color: "bg-white", textColor: "text-black" },
    { name: "garden", color: "bg-lime-400", textColor: "text-black" },
    { name: "corporate", color: "bg-blue-500", textColor: "text-white" },
    { name: "pastel", color: "bg-fuchsia-200", textColor: "text-black" },
    { name: "autumn", color: " bg-red-800", textColor: "text-white" },
  ];

  const updateTheme = async (theme: any) => {
    if (theme !== userDoc.theme) {
      localStorage.setItem("moviebin-theme", theme);
      await updateThemeInFirebase(theme);
    }
  };

  return (
    <>
      <PageWidthWrapper>
        <div className=" mt-8 mb-4 text-2xl font-bold">Settings</div>

        <div className="flex flex-col items-center gap-4  sm:flex-row sm:items-start">
          <div className="flex w-full flex-col items-center gap-4   bg-base-100 p-4 sm:w-72">
            <label className="label">
              <span className="label-text-alt">Profile Picture</span>
            </label>
            <img
              className="h-32 w-32 rounded-full object-cover"
              src={
                userDoc?.customProfileImage
                  ? userDoc?.customProfileImage
                  : userDoc?.photoURL
              }
            />
            <div>
              <button
                className="btn-primary btn"
                onClick={() => {
                  dispatch({ type: "OPEN_MODAL" });
                }}
              >
                Update Image
              </button>
            </div>
          </div>

          <div className="flex flex-col  p-4 ">
            <form
              className="form-control w-full sm:w-72"
              onSubmit={(e) => updateCustomUsername(e)}
            >
              <label className="label">
                <span className="label-text-alt">Username</span>
              </label>

              <div className="input-group ">
                <input
                  value={username}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Type here"
                  className={`input-bordered input w-full ${
                    errorMsg === "" ? "" : "input-error"
                  }`}
                />
                <button className="btn-primary btn" type="submit">
                  save
                </button>
              </div>

              <div className=" text-warning"> {errorMsg && errorMsg}</div>
            </form>
            <div className="mt-8">
              <label className="label">
                <span className="label-text-alt">Set Theme</span>
              </label>
              <div className="flex max-w-md flex-wrap gap-2">
                {themes.map((theme: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => updateTheme(theme.name)}
                    className={`btn-sm ${theme.color} ${theme.textColor} `}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageWidthWrapper>
      <ModalWrapper>
        <UpdateProfilePictureModal user={user} userDoc={userDoc} />
      </ModalWrapper>
    </>
  );
}
