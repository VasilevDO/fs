import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import LinksPage from './LinksPage';
import CreatePage from './CreatePage';
import DetailPage from './DetailPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import GamesPage from './GamesPage';
import ServicesPage from './ServicesPage';
import ResetPage from './ResetPage.js'
import BioPage from './BioPage';



const useRoutes = isAuthenticated=> {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/home' exact>
                    <HomePage/>
                </Route>
                <Route path='/links' exact>
                    <LinksPage/>
                </Route>
                <Route path='/services' exact>
                    <ServicesPage/>
                </Route>
                <Route path='/games' exact>
                    <GamesPage/>
                </Route>
                <Route path='/bio' exact>
                    <BioPage/>
                </Route>
                <Redirect to='/home'/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/auth' exact>
                <AuthPage/>
            </Route>
            <Route path='/reset/:id' exact>
                <ResetPage />
            </Route>
            <Redirect to ='/auth'/>
        </Switch>
    )
}


export default useRoutes;