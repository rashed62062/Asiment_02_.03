import { createBrowserRouter } from 'react-router-dom'
import Home from '../pages/Home/Home'
import ErrorPage from '../pages/ErrorPage'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'

import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Profile from '../pages/Dashboard/Common/Profile'
import Statistics from '../pages/Dashboard/Common/Statistics'
import MainLayout from '../layouts/MainLayout'

import Asset from '../components/Dashboard/Sidebar/Menu/NorEmployee/Asset'
import TeamMembers from '../components/Dashboard/Sidebar/Menu/NorEmployee/TeamMembers'
import AssetPage from '../components/Dashboard/Sidebar/Menu/NorEmployee/AssetPage'
import AssetListpage from '../components/Dashboard/HRManager/AssetListpage'
import AllRequestsPage from '../components/Dashboard/Sidebar/Menu/NorEmployee/AllRequestsPage'
import MyEmployee from '../components/Dashboard/HRManager/MyEmployee'


import PackagesPage from '../components/Dashboard/HRManager/PackagesPage'
import EmployeeRegistration from '../pages/Login/Logins/EmployeeRegistration'
import JoinAsHRManager from '../pages/Login/Logins/JoinAsHRManager'
import PackageSection from '../components/Homes/PackageSection'
import AddAssetFrom from '../components/Form/AddAssetFrom'
import EmployeeDashboard from '../components/Dashboard/Sidebar/Menu/NorEmployee/EmployeeDashboard'
import HrHome from '../components/Dashboard/HRManager/HrHome'





export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/employeeRegistration', element: <EmployeeRegistration /> },
  { path: '/joinAsHRManager', element: <JoinAsHRManager /> },

  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Statistics /> },
      { path: 'inventory', element: <Asset /> },
      { path: 'normalEmploy', element: <EmployeeDashboard /> },
      { path: 'my-team', element: <TeamMembers /> },
      { path: 'request-asset', element: <AssetPage /> },
      { path: 'asset-list', element: <AssetListpage /> },
      { path: 'add-an-asset', element: <AddAssetFrom /> },
      { path: 'all-requests', element: <AllRequestsPage /> },
      { path: 'HrHome', element: <HrHome /> },
      { path: 'my-employee', element: <MyEmployee /> },
      { path: 'add-employee', element: <PackageSection /> },
      { path: 'packages', element: <PackagesPage /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <ErrorPage /> }, // Optional catch-all inside dashboard
    ],
  },
]);

