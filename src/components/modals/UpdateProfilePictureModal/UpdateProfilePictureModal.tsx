import Image from "next/image";
import React, { useContext, useState } from "react";
import { UIContext } from "../../../../lib/context";
import imageCompression from "browser-image-compression";
import { HiX } from "react-icons/hi";
import { fbstorage, firestore } from "../../../../lib/firebase";

export function UpdateProfilePictureModal({ user, userDoc }: any) {
  const { dispatch } = useContext(UIContext);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const deleteUserImage = async () => {
    const userDocRef = firestore.collection("users").doc(user?.uid?.toString());
    try {
      const userDoc = await userDocRef.get();
      if (userDoc.exists) {
        const ref = userDoc.data();
        const imageURL = ref?.customProfileImage;
        if (imageURL) {
          const imageRef = fbstorage.refFromURL(imageURL);
          await imageRef.delete();
          console.log("Image deleted successfully!");
        }
      } else {
        console.log("User document does not exist");
      }
    } catch (error) {
      console.log("Error deleting image: ", error);
    }
  };

  const uploadCustomProfileImage = async () => {
    if (imageUpload === null) return;
    try {
      setImageUploading(true);
      await deleteUserImage();
      const imageFile = imageUpload;
      const options = {
        maxSizeBytes: 20000,
        maxWidthOrHeight: 350,
      };
      const compressedFile = await imageCompression(imageFile, options);
      console.log(compressedFile.size / 1024 / 1024);
      const storageRef = fbstorage.ref();
      const imageRef = storageRef.child(`images/${imageUpload.name}`);
      const imageBlob = new Blob([compressedFile], {
        type: compressedFile.type,
      });
      const snapshot = await imageRef.put(imageBlob);
      const imageUrl = await snapshot.ref.getDownloadURL();

      const userDocRef = firestore
        .collection("users")
        .doc(user?.uid?.toString());
      await userDocRef.update({
        customProfileImage: imageUrl,
      });
      setImageUploadErrorMsg("");
      setImageUpload(null);
      setImageUploading(false);
      dispatch({ type: "CLOSE_MODAL" });
    } catch (error) {
      setImageUploadErrorMsg("Error uploading image. Check image type");
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 text-center">
      <button
        className="btn-sm btn absolute -top-4 -right-4 border-none bg-base-100 "
        onClick={() => {
          setImageUpload(null);
          dispatch({ type: "CLOSE_MODAL" });
        }}
      >
        <HiX />
      </button>

      <input
        className="file-input-bordered file-input  w-full max-w-xs"
        type="file"
        onChange={(event) => {
          if (event.target.files) {
            setImageUpload(event.target.files[0]);
          }
        }}
      />
      <div className="text-warning">
        {imageUploadErrorMsg && imageUploadErrorMsg}
      </div>
      <button
        className={`btn-primary btn ${imageUploading ? "loading" : ""}`}
        onClick={uploadCustomProfileImage}
      >
        Update Image
      </button>
    </div>
  );
}
