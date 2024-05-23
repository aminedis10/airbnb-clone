import React, { useState } from "react";
import { Form, Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoLink, setPhotolink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [extrainfo, setExtrainfo] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [maxguests, setMaxguests] = useState(1);
  const [redirect, setRedirect] = useState("");

  // async function addPhotoByLink(ev) {
  //   ev.preventDefault();
  //   await axios.post("/upload-by-link", { link: photoLink });
  // }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      setPhotos([...photos, filename]); // Update the photos state with the newly uploaded photo
      setPhotolink(""); // Reset the photo link input field
    } catch (error) {
      console.error("Error uploading photo:", error);
      // Handle error, show error message to the user, etc.
    }
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]); // Change "files" to "photos"
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setPhotos((prev) => {
          return [...prev, ...filenames];
        });
      });
  }
  function handleCb(name) {
    // alert(name);
  }

  async function addnewPlace(ev) {
    ev.preventDefault();
    const placedata = { title, address, photos, description };
    await axios.post("/places", placedata);
    setRedirect("/account/places");
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      {action !== "new" && (
        <div className="text-center">
          <Link
            className=" inline-flex bg-primary text-white py-2 px-4 rounded-full"
            to={"/account/places/new"}
          >
            Add new place
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form onSubmit={addnewPlace}>
            <h2 className="text-xl">Title</h2>
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <h2 className="text-xl">Address</h2>
            <input
              type="text"
              placeholder="address"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
            />
            <h2 className="text-xl">Photos</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="add link"
                value={photoLink}
                onChange={(ev) => setPhotolink(ev.target.value)}
              />
              <button
                onClick={addPhotoByLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Add&nbsp;photo
              </button>
            </div>
            <div className=" mt3 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 ">
              {photos.length > 0 &&
                photos.map((link) => (
                  <div>
                    <img
                      className="rounded-2xl"
                      src={"http://localhost:4000/uploads/" + link}
                      alt=""
                    />
                  </div>
                ))}
              <label className=" cursor-pointer flex justify-center border bg-transparent rounded-2xl text-2xl p-8">
                <input type="file" className="hidden" onChange={uploadPhoto} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                Upload
              </label>
            </div>
            <h2 className="text-xl">description</h2>
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            <h2 className="text-xl">Perks</h2>
            <div className="gap-2 grid grid-cols-2">
              <label className="border p-4 ">
                <input type="checkbox" onChange={() => handleCb("wifi")} />
                <span>Wifi</span>
              </label>
              <label className="border p-4 ">
                <input type="checkbox" onChange={() => handleCb("wifi")} />
                <span>free parking</span>
              </label>
              <label className="border p-4">
                <input type="checkbox" onChange={() => handleCb("wifi")} />
                <span>TV </span>
              </label>
              <label className="border p-4">
                <input type="checkbox" onChange={() => handleCb("wifi")} />
                <span>Pets</span>
              </label>
              <label className="border p-4">
                <input type="checkbox" onChange={() => handleCb("wifi")} />
                <span>private entrance</span>
              </label>
            </div>
            <h2>Extra info</h2>
            <textarea
              value={extrainfo}
              onChange={(ev) => setExtrainfo(ev.target.value)}
            />
            <h2>Check in & out times</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3>Check in time</h3>
                <input
                  type="text"
                  placeholder="14:00"
                  value={checkin}
                  onChange={(ev) => setCheckin(ev.target.value)}
                />
              </div>
              <div>
                <h3>Check out time</h3>
                <input
                  type="text"
                  value={checkout}
                  onChange={(ev) => setCheckout(ev.target.value)}
                />
              </div>
              <div>
                <h3>max number of guests</h3>
                <input
                  type="text"
                  value={maxguests}
                  onChange={(ev) => setMaxguests(ev.target.value)}
                />
              </div>
            </div>

            <button className="primary my-4">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PlacesPage;
