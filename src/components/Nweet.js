import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetobj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetobj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this Nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetobj.id}`).delete();
      await storageService.refFromURL(nweetobj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetobj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Nweet" />
            <button onClick={toggleEditing}>Cancel</button>
          </form>
        </>
      ) : (
        <>
          <h4>{nweetobj.text}</h4>
          {nweetobj.attachmentUrl && (
            <img src={nweetobj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
