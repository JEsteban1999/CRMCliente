import React from 'react';
import Layout from '../../components/Layout';
import {useRouter} from 'next/router';
import {gql, useQuery, useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
    query obtenerProducto($id: ID!) {
        obtenerProducto(id: $id) {
            id
            nombre
            existencia
            precio
        }
    }
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation actualizarProducto($id: ID!, $input: ProductoInput) {
        actualizarProducto(id: $id, input: $input) {
            nombre
            existencia
            precio
        }
    }
`;


const EditarProducto = () => {
    const router = useRouter();
    const {query: {pid}} = router;
    // console.log(pid);
    // Consultar para obtener el producto
    const {data, loading, error} = useQuery(OBTENER_PRODUCTO, {
        variables: {
            id: pid
        }
    });

    // Mutation para modificar el producto
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

    // Schema de validación
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                    .required('El nombre del producto es obligatorio'),
        existencia: Yup.number()
                        .required('Agrega la cantidad disponible')
                        .positive('No se aceptan números negativos')
                        .integer('La existencia deben ser números enteros'),
        precio: Yup.number()
                    .required('El precio es obligatorio')
                    .positive('No se aceptan números negativos')
    });


    if (loading) return 'Cargando...';
    if (!data) {
        return 'Acción no permitida';
    }

    const actualizarInfoProducto = async valores => {
        // console.log(valores);
        const {nombre, existencia, precio} = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    id: pid,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });
            // console.log(data);
            // Redireccionar hacia productos 
            router.push('/productos');
            // Mostrar alerta
            Swal.fire(
                'Actualizado',
                'El producto se actualizó correctamente',
                'success'
            ) 
        } catch (error) {
            console.log(error);
        }
    }
    const {obtenerProducto} = data || {};

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        enableReinitialize
                        initialValues={obtenerProducto ? obtenerProducto : {}}
                        validationSchema={schemaValidacion}
                        onSubmit={valores => {
                            actualizarInfoProducto(valores);
                        }}
                    >
                        {props => {
                            console.log(props);
                            return (
                                <form 
                                    onSubmit={props.handleSubmit} 
                                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'>
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>Nombre</label>
                                        <input id='nombre'
                                                type='text'
                                                placeholder='Nombre del producto'
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.nombre}
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.nombre}</p>
                                            </div>
                                        ) : null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>Cantidad disponible</label>
                                        <input id='existencia'
                                                type='number'
                                                placeholder='Cantidad disponible'
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.existencia}
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                    </div>
                                    {props.touched.existencia && props.errors.existencia ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.existencia}</p>
                                            </div>
                                        ) : null}
                                    <div className='mb-4'>
                                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>Precio</label>
                                        <input id='precio'
                                                type='number'
                                                placeholder='Precio del producto'
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                value={props.values.precio}
                                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'/>
                                    </div>
                                    {props.touched.precio && props.errors.precio ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.precio}</p>
                                            </div>
                                        ) : null}
                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                                        value='Editar producto'
                                    />
                                </form>
                        )
                    }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default EditarProducto;