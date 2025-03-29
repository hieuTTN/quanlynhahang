import { ToastContainer, toast } from 'react-toastify';
import {Routes, Route,BrowserRouter as Router} from 'react-router-dom'
import DefaultLayout from './layout/user/defaultLayout/defaultLayout'
import { publicRoutes, adminRoutes, userRoutes } from './router/index';
import AdminLayout from './layout/admin/Layout'
import LoginForm from './layout/user/loginlayout/login'
import login from './pages/public/login'
import { Navigate } from 'react-router-dom';

var token = localStorage.getItem("token");
function App() {
  return (
    <Router>
      <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout
              const Page = route.component
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}

            {userRoutes.map((route, index) => {
              const Layout = route.layout || DefaultLayout
              const Page = route.component
              if (!token) {
                return <Route key={index} path={route.path} element={<Navigate to="/login" />} />;
              }

              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}


            {adminRoutes.map((route, index) => {
              const Layout = route.layout || AdminLayout
              const Page = route.component
              if (!token) {
                return <Route key={index} path={route.path} element={<Navigate to="/login" />} />;
              }
              return <Route key={index} path={route.path} element={
                <Layout>
                  <Page/>
                </Layout>
              }/>
            })}

          </Routes>
      </div>
      <ToastContainer/>
    </Router>

);

}

export default App;
