import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { collection, addDoc } from 'firebase/firestore';

import { db } from '../../firebase';
import { setPopupModal, setAddTasks } from '../configure';

import './index.scss';
import {getAuth} from "firebase/auth";

function Popup() {
  const [input, setInput] = useState('');

  const dispatch = useDispatch();

  const active = useSelector((state) => state.darkActive.active);
  const popupModal = useSelector((state) => state.modal.popupModal);
  const addTask = useSelector((state) => state.addTodo.addTask);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const addTodo = async () => {
    if (input.trim() !== '') {
      try {
        const user = getAuth().currentUser;
        const todoCollection = collection(db, 'todos');
        const docRef = await addDoc(todoCollection, { text: input, status: 0, userId: user.uid});
        const updatedTasks = [...addTask, { id: docRef.id, text: input, status: 0 }];
        dispatch(setAddTasks(updatedTasks));
        setInput('');
        console.log('Veri Firebase\'e gönderildi. Doküman ID:', docRef.id);
        console.log('userId: ', user.uid);
      } catch (error) {
        console.error('Veri gönderme hatası:', error);
      }
    }
  };

  const handleDoingClick = async () => {
    if (input.trim() !== '') {
      try {
        const user = getAuth().currentUser;
        const todoCollection = collection(db, 'todos');
        const docRef = await addDoc(todoCollection, { text: input, status: 1, userId: user.uid });
        const updatedTasks = [...addTask, { id: docRef.id, text: input, status: 1, uid: user.uid }];
        dispatch(setAddTasks(updatedTasks));
        setInput('');
        console.log('Veri Firebase\'e gönderildi. Doküman ID:', docRef.id);
      } catch (error) {
        console.error('Veri gönderme hatası:', error);
      }
    }
  };

  const handleHideModal = () => {
    dispatch(setPopupModal(false));
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleHideModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {popupModal && (
        <div className={`modal-container  ${active ? 'modal-container-active' : 'modal-container'}`}>
          <div className="modal-content">
            <span className="modal-close" onClick={handleHideModal}>
              &times;
            </span>
            <input name="task" onChange={handleChange} value={input} placeholder="New Item" />
            <div className="modal-content__options">
              <button onClick={addTodo}>ToDo</button>
              <button onClick={handleDoingClick}>Doing</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Popup;
