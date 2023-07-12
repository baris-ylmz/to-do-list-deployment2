import { configureStore } from '@reduxjs/toolkit'
import configure from '../components/configure'

export const store = configureStore({
    reducer: {
        addTodo: configure,
        modal: configure,
        doing: configure,
        darkActive: configure,
        loggedIn: configure,
        logout: configure,
    },
})