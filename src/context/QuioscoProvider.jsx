import { createContext, useState, useEffect} from 'react'
import { toast } from 'react-toastify';
import clienteAxios from '../config/axios';

const QuioscoContext = createContext();


// eslint-disable-next-line react/prop-types
const QuioscoProvider = ({children}) => {
    // eslint-disable-next-line react/prop-types
    
    // eslint-disable-next-line no-unused-vars
    const [categorias, setCategorias]= useState([]);
    const [categoriaActual, setCategoriaActual] = useState({})
    const [modal, setModal] = useState(false)
    const [producto, setProducto] = useState({})

    const [pedido, setPedido] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const nuevoTotal = pedido.reduce((total, producto) => (producto.precio * producto.cantidad) + total, 0 )
        setTotal(nuevoTotal)
    }, [pedido])

    const obtenerCategorias = async () => {
    const token = localStorage.getItem('AUTH_TOKEN')
        try {
            const {data} = await clienteAxios('/api/categorias',{
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            })
            setCategorias(data.data)
            setCategoriaActual(data.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        obtenerCategorias();
    }, [])


    const handleClickCategoria = id => {
        const categoria = categorias.filter(categoria => categoria.id === id)[0]
        setCategoriaActual(categoria)
    }
    console.log(categoriaActual)

    const handleClickModal = () => {
        setModal(!modal)
    }
    
    const handleSetProducto = producto =>{
        setProducto(producto)
    }

    // eslint-disable-next-line no-unused-vars
    const handleAgregarPedido = ({categoria_id, ...producto}) => {

        if(pedido.some(pedidoState => pedidoState.id === producto.id)){
            const pedidoActualizado = pedido.map( pedidoState => pedidoState.id === 
                producto.id ? producto : pedidoState)
            setPedido(pedidoActualizado)
            toast.success('Guardado Correctamente')
          } else
          {
            setPedido([...pedido, producto])
            toast.success('Agregado al Pedido')
          }
    }

    const handleEditarCantidad = id => {
      const productoActualizar = pedido.filter(producto => producto.id === id)[0]
            setProducto(productoActualizar)
            setModal(!modal);
    }

    const handleEliminarProductosPedido = id => {

        const pedidoActualizado = pedido.filter(producto => producto.id !== id)
            setPedido(pedidoActualizado)
            toast.success('Eliminado del pedido')
    }

const handleSubmitNuevaOrden = async (logout) => {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const {data} = await clienteAxios.post('/api/pedidos', 
            {
                total,
                productos: pedido.map(producto => {
                    return {
                        id: producto.id,
                        cantidad: producto.cantidad,
                    }
                }),

        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        toast.success(data.message);
        setTimeout(() => {
            setPedido([])
        }, 1000);
        //cerrar la sesion de usuario
        setTimeout(() =>{
            localStorage.removeItem('AUTH_TOKEN');
            logout();
        }, 3000)
    } catch (error) {
        console.log(error)
    }
} 

    const handleClickCompletarPedido = async id => {
        const token = localStorage.getItem('AUTH_TOKEN')
    try {
         await clienteAxios.put(`/api/pedidos/${id}`,null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickProductoAgotado = async id => {
        const token = localStorage.getItem('AUTH_TOKEN')
    try {
         await clienteAxios.put(`/api/productos/${id}`,null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        // eslint-disable-next-line react/prop-types
            <QuioscoContext.Provider
                value={{ categorias, 
                    categoriaActual,
                    handleClickCategoria,
                    modal,
                    handleClickModal,
                    producto,
                    handleSetProducto,
                    pedido,
                    setPedido,
                    handleAgregarPedido,
                    handleEditarCantidad,
                    handleEliminarProductosPedido,
                    total,
                    handleSubmitNuevaOrden,
                    handleClickCompletarPedido,
                    handleClickProductoAgotado
                }}
            >{children}
            </QuioscoContext.Provider>
    )
}
export {
    QuioscoProvider
}

export default QuioscoContext