import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { auth, loading } = useAuth();

    if (loading) {
        return <p>Cargando...</p>
    } else {
        return !auth ? <Navigate to="/login" /> : children;
    }

};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;