import { Navigate } from 'react-router-dom';
const PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY;

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const passkey = localStorage.getItem('passkey');

	if (!passkey || passkey !== btoa(PASSKEY)) return <Navigate to='/' replace />;

	return <>{children}</>;
};
