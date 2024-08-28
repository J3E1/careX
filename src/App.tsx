import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import AppointmentPage from './pages/AppointmentPage';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/register',
		element: <RegistrationPage />,
	},
	{
		path: '/:patientId/new-appointment',
		element: <AppointmentPage />,
	},
	{
		path: '/:patientId/appointment/:appointmentId',
		element: <AppointmentPage />,
	},
	{
		path: '/dashboard',
		element: <Dashboard />,
	},
]);

function App() {
	return (
		<div className='bg-background min-h-screen'>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
