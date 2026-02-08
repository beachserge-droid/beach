'use client'

import { store } from "@/features/store"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            {children}
            <ToastContainer
                position="bottom-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </Provider>
    )
}
