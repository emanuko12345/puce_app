// app_puce/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, usuarioLogeado, allowedRoles }) {
  // Si no hay usuario logeado, redirige a la página de inicio de sesión
  if (!usuarioLogeado) {
    return <Navigate to="/" replace />;
  }

  // Si se especifican roles permitidos y el rol del usuario no está en ellos, redirige al dashboard
  if (allowedRoles && !allowedRoles.includes(usuarioLogeado.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si el usuario está logeado y tiene el rol permitido, renderiza los componentes hijos
  return children;
}

export default ProtectedRoute;