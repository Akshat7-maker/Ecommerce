import React, { useState } from 'react'

function useLoader() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const withLoader = async (asyncFunc) => {
        setError(null);
        setLoading(true);
        try {
            await asyncFunc();
        } catch (err) {
            // console.log(err);
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
  
    return { loading, error, withLoader };
}

export default useLoader



// const useLoader = () => {
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const withLoader = async (asyncFunc) => {
//         setLoading(true);
//         try {
//             await asyncFunc();
//         } catch (err) {
//             setError(err.message || 'An error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return { loading, error, withLoader };
// };