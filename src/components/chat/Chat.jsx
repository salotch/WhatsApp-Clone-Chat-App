import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../lib/firebase";
import {
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const endRef = useRef(null);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current?.scrollIntoView();
  }, [chat?.messages]);
  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);
  const handleImg = (e) => {
    if (e.target.files[0])
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  };

  const handleSend = async () => {
   
    if (text === "" && !img?.file) return;
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });
      const userIds = [currentUser.id, user.id];
      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatSnapshot = await getDoc(userChatsRef);

        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setImg({ file: null, url: "" });
    setText("");
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            {/* <img src={message.} alt="" /> */}
            <div className="texts">
              <p>
                {" "}
                {message.img && <img src={message.img} alt="" />}
                {message.text}
              </p>
              {/* <span>{message.createdAt}</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="messge own">
            <div className="texts">
              <p>
                <img src={img.url} alt="" />
              </p>
            </div>
          </div>
        )}
        <div ref={endRef}></div>
        {/* <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="message own">
          <div className="texts">
            <p>
              <img
                src="https://images.unsplash.com/photo-1605713288610-00c1c630ca1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D"
                alt=""
              />
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam
              ab sapiente velit illum error blanditiis et. Ad et blanditiis,
              provident voluptatem expedita minima aliquam ex fuga cupiditate
              eaque doloremque saepe?
            </p>
            <span>1 min ago</span>
          </div>
        </div> */}
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            name=""
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          name=""
          id=""
          value={text}
          placeholder="Type a message..."
          onChange={(e) => {
            setText(e.target.value);
            // console.log(e.target.value);
          }}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend}>
          send
        </button>
      </div>
    </div>
  );
};

export default Chat;
