import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';
import { IoReturnDownBack } from 'react-icons/io5';

import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

import { db } from '../../../firebase';
import { setAddTasks } from '../../configure';

import './index.scss';

function RightContent() {
  const active = useSelector((state) => state.darkActive.active);
  const addTask = useSelector((state) => state.addTodo.addTask);
  const popupModel = useSelector((state) => state.modal.popupModal);
  const logoutPopup = useSelector((state) => state.logout.logoutPopup);

  const dispatch = useDispatch();

  const handleDeleteDone = async (taskId) => {
    if (!(popupModel || logoutPopup)) {
      try {
        const taskDocRef = doc(db, 'todos', taskId);
        await deleteDoc(taskDocRef);

        const updatedAddTask = addTask.filter((task) => task.id !== taskId);
        dispatch(setAddTasks(updatedAddTask));
      } catch (error) {
        console.error('Error deleting task: ', error);
      }
    }
  };

  const handleTurnClick = async (taskId) => {
    if (!(popupModel || logoutPopup)) {
      try {
        const taskDocRef = doc(db, 'todos', taskId);
        await updateDoc(taskDocRef, {
          status: 1
        });

        const updatedAddTask = addTask.map((task) =>
          task.id === taskId ? { ...task, status: 1 } : task
        );
        dispatch(setAddTasks(updatedAddTask));
      } catch (error) {
        console.error('Error updating task status: ', error);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = async (event) => {
    if (!(popupModel || logoutPopup)) {
      event.preventDefault();
      event.currentTarget.classList.remove('drag-over');

      const taskId = event.dataTransfer.getData('taskId');

      try {
        const taskDocRef = doc(db, 'todos', taskId);
        await updateDoc(taskDocRef, {
          status: 2,
        });

        const updatedAddTask = addTask.map((task) =>
          task.id === taskId ? { ...task, status: 2 } : task
        );

        dispatch(setAddTasks(updatedAddTask));
      } catch (error) {
        console.error('Error updating task status: ', error);
      }
    }
  };

  const filteredTasks = addTask.filter((task) => task.status === 2);

  return (
    <div
      className={`rightconent ${active ? 'right-conent-active' : 'rightconent'}`}
    >
      <div className="headercontent">
        <h2>DONE</h2>
      </div>
      <div
        className="rightcontent__list"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="rightcontent_list_todoCheck">
          <ul>
            {filteredTasks.map((task, index) => (
              <div
                key={index}
                className="rightcontent__list-box"
                draggable
                onDragStart={(event) => event.dataTransfer.setData('taskId', task.id)}

              >
                <div>
                  <span>{task.text}</span>
                </div>
                <div>
                  <FaTrashAlt
                    className="rigthContnent__box-icon__left"
                    onClick={() => handleDeleteDone(task.id)}
                  />
                  <IoReturnDownBack
                    className="rigthContnent__box-icon__rigth"
                    onClick={() => handleTurnClick(task.id)}
                  />
                </div>

              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RightContent;
