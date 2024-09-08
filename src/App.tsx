import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import AppointmentPage from './pages/AppointmentPage';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './components/protected-route';
import SuccessPage from './pages/SuccessPage';
import { Toaster } from './components/ui/toaster';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/:userId/register',
		element: <RegistrationPage />,
	},
	{
		path: '/:userId/new-appointment',
		element: <AppointmentPage />,
	},
	{
		path: '/:userId/appointment/:appointmentId',
		element: <AppointmentPage />,
	},
	{
		path: '/:userId/appointment/:appointmentId/success',
		element: <SuccessPage />,
	},
	{
		path: '/dashboard',
		element: (
			<ProtectedRoute>
				<Dashboard />
			</ProtectedRoute>
		),
	},
]);

function App() {
	return (
		<div className='bg-background min-h-screen'>
			<RouterProvider router={router} />
			<Toaster />
		</div>
	);
}

export default App;
