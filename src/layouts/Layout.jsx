import {Outlet} from 'react-router-dom'
import Modal from 'react-modal';
import Sidebar from '../components/Sidebar'
import Resumen from '../components/Resumen'
import ModalProducto from '../components/ModalProducto';
import useQuiosco from '../hooks/useQuiosco'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from '../hooks/useAuth';


Modal.setAppElement('#root');
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Layout() {

   useAuth({middleware: 'auth'})
  const {modal } = useQuiosco();

  

  return (
    <>
      <div className='md:flex'>
        <Sidebar/>

        <main className='flex-1 h-screen overflow-y-scroll bg-gray-100'>
        <Outlet />

        </main>

        <Resumen />
      </div>

        <Modal isOpen={modal} style={customStyles}>
            <ModalProducto/>
        </Modal>

        <ToastContainer />


    </>
    
  )
}
