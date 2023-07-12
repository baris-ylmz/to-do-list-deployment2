import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BsCheckCircleFill } from 'react-icons/bs';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { IoReturnDownBack } from 'react-icons/io5';

import { doc, updateDoc, deleteDoc, collection, getDocs, where, query } from 'firebase/firestore';

import { db } from '../../../firebase';
import { setAddTasks } from '../../configure';

import './index.scss';
import {getAuth} from "firebase/auth";

function MiddleContent({ selectedTasks, setSelectedTasks }) {
  const user = getAuth().currentUser
  const active = useSelector((state) => state.darkActive.active);
  const addTask = useSelector((state) => state.addTodo.addTask);
  const popupModel = useSelector((state) => state.modal.popupModal);
  const logoutPopup = useSelector((state) => state.logout.logoutPopup);
  
  const dispatch = useDispatch();

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedTask, setEditedTask] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDeleteTask = async (taskId) => {
    if (!(popupModel || logoutPopup)) {
      try {
        const taskDocRef = doc(db, 'todos', taskId);
        await deleteDoc(taskDocRef);

        const updatedAddTask = addTask.filter((task) => task.id !== taskId);
        dispatch(setAddTasks(updatedAddTask));
        setSelectedTasks(selectedTasks.filter((task) => task !== taskId));
      } catch (error) {
        console.error('Error deleting task: ', error);
      }
    }
  };

  const handleTaskDoneClick = async (taskId) => {
    if (!(popupModel || logoutPopup)) {
      const taskDocRef = doc(db, 'todos', taskId);

      try {
        await updateDoc(taskDocRef, {
          status: 2
        });

        const updatedAddTask = addTask.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              status: 2
            };
          }
          return task;
        });

        dispatch(setAddTasks(updatedAddTask));
      } catch (error) {
        console.error('Error updating task status: ', error);
      }
    }
  };

  const handleEditClick = (index, taskText) => {
    if (!(popupModel || logoutPopup)) {
      setEditingIndex(index);
      setEditedTask(taskText);
    }
  };

  const handleSaveEdit = async (taskId) => {
    try {
      const taskDocRef = doc(db, 'todos', taskId);
      await updateDoc(taskDocRef, {
        text: editedTask,
      });
      const updatedAddTask = addTask.map((task) =>
        task.id === taskId ? { ...task, text: editedTask } : task
      );
      dispatch(setAddTasks(updatedAddTask));

      setEditingIndex(-1);
      setEditedTask('');
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleTurnClick = async (taskId) => {
    if (!(popupModel || logoutPopup)) {
      try {
        const taskDocRef = doc(db, 'todos', taskId);

        await updateDoc(taskDocRef, {
          status: 0
        });

        const updatedAddTask = addTask.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              status: 0
            };
          }
          return task;
        });

        dispatch(setAddTasks(updatedAddTask));
      } catch (error) {
        console.error('Error updating task status: ', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'todos'), where('userId', '==', user?.uid));
        const snapshot = await getDocs(q);
        const todoList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setAddTasks(todoList));
      } catch (error) {
        console.error('Error fetching tasks: ', error);
      }
    };

    if (user?.uid) {
      fetchData();
    }
  }, [user?.uid]);

  const handleDragStart = (event, task) => {
    event.dataTransfer.setData('taskId', task.id);
    setDraggedTask(task);
  };

  const handleDragEnter = (event) => {
    event.preventDefault()
    event.currentTarget.classList.add('drag-over');
  }
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    if (!(popupModel || logoutPopup)) {
      event.preventDefault();
      event.currentTarget.classList.remove('drag-over');

      const taskId = event.dataTransfer.getData('taskId');

      try {
        const taskDocRef = doc(db, 'todos', taskId);
        await updateDoc(taskDocRef, {
          status: 1,
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

  const handleDragEnd = async (event) => {
    event.preventDefault();
    if (draggedTask) {
      try {
        const taskDocRef = doc(db, 'todos', draggedTask.id);

        let newStatus = null;
        let updatedAddTask = null;

        if (event.currentTarget.classList.contains('leftcontent__list')) {
          newStatus = 0;
          updatedAddTask = addTask.map((t) => {
            if (t.id === draggedTask.id) {
              return {
                ...t,
                status: 0
              };
            }
            return t;
          });
        } else if (event.currentTarget.classList.contains('rightconent')) {
          newStatus = 2;
          updatedAddTask = addTask.map((t) => {
            if (t.id === draggedTask.id) {
              return {
                ...t,
                status: 2
              };
            }
            return t;
          });
        }

        if (newStatus !== null && updatedAddTask !== null) {
          await updateDoc(taskDocRef, {
            status: newStatus
          });
          dispatch(setAddTasks(updatedAddTask));
        }
      } catch (error) {
        console.error('Error updating task status: ', error);
      }
    }
  };

  const filteredTasks = addTask.filter((task) => task.status === 1);

  return (
    <div className={`middleconent ${active ? 'middle-conent-active' : 'middleconent'}`}>
      <div className="headercontent">
        <h2>DOING</h2>
      </div>
      <div className="middlecontent__list" onDragOver={handleDragOver} onDrop={handleDrop} onDragEnter={handleDragEnter}>
        <div className="middlecontent_list_todoCheck">
          <ul>
            {filteredTasks.map((task, index) => (
              <div
                className="middleContent__box"
                key={index}
                draggable
                onDragStart={(event) => handleDragStart(event, task)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
              >
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      onBlur={() => handleSaveEdit(task.id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(task.id);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <span
                        style={{
                          textDecoration: selectedTasks.includes(task.id) ? 'line-through' : 'none'
                        }}
                      >
                        {task.text}
                      </span>
                    </div>
                    <div >
                      <FaTrashAlt
                        className="middleContent_box-icon_left"
                        onClick={() => handleDeleteTask(task.id)}
                      />
                      <FaEdit
                        className="middleContent_box_edit-icon"
                        onClick={() => handleEditClick(index, task.textF
                        )}
                      />
                      <IoReturnDownBack
                        className="leftContnent_box-icon_rigth"
                        onClick={() => handleTurnClick(task.id)}
                      />
                      <BsCheckCircleFill
                        className="container__altBox-doneClick"
                        onClick={() => handleTaskDoneClick(task.id)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MiddleContent;