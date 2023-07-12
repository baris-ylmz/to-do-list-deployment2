import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import { FiLogOut } from 'react-icons/fi';

import { getAuth, signOut } from 'firebase/auth';

import { setActive, setIsLoggedIn } from './configure';
import { setLogoutPopup } from './configure';

import Content from './content';
import Footer from './footer';
import Popup from './popup';

function CustomComponent() {
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isChecked, setIsChecked] = useState(true)

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const active = useSelector((state) => state.darkActive.active);
    const popupModel = useSelector((state) => state.modal.popupModal);
    const logoutPopup = useSelector((state) => state.logout.logoutPopup);

    const switchClick = () => {
        if (!(popupModel || logoutPopup)) {
            dispatch(setActive(!active));
        }

    };

    const handleClosePage = () => {
        if (!popupModel) {
            dispatch(setLogoutPopup(true))
        }
    }

    const closePopup = () => {
        dispatch(setLogoutPopup(false))
    }

    const handleLogout = async () => {
        const auth = getAuth();

        try {
            await signOut(auth);
            dispatch(setIsLoggedIn(false))
            dispatch(setLogoutPopup(false))
            sessionStorage.removeItem('auth')
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
          if (event.key === 'Escape') {
            closePopup()
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    useEffect(() => {
        setIsChecked(active);
    }, [active]);

    return (
        <>
            <Helmet>
                <title>Pinsoft To-Do-List</title>
            </Helmet>
            <div className="toast-container">
                <Toast className='toast-container__box' show={logoutPopup}>
                    <div className='toast-container__header' >
                        <strong>Are you sure ?</strong>
                    </div>
                    <Toast.Body>
                        <div className="toast-container__box-buttons">
                            <button className="btn-cancel" onClick={closePopup}>
                                Cancel
                            </button>
                            <button className="btn-continue" onClick={handleLogout}>
                                Continue
                            </button>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
            <span className={`components-span  ${(popupModel || logoutPopup) ? 'components-span-opacity' : ''}`} id='components-span'>
                <div className={`components__icon`}>
                    <Form.Check type="switch" id="custom-switch" className="custom-switch mb-2" checked={isChecked} onChange={switchClick} />
                    <FiLogOut className={`logout__switch ${!active ? 'logout__switch__active' : ''}`} onClick={handleClosePage} />
                </div>
                <div className="row header-container mb-3">
                    <h1 id="header">To Do List</h1>
                </div>
                <Content
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                />
                <Footer />
            </span>
            <div className="popup-container">
                <Popup />
            </div>

        </>
    );
}

export default CustomComponent;
