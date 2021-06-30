import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import LinksPage from './LinksPage';
import CreatePage from './CreatePage';
import DetailPage from './DetailPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import GamesPage from './GamesPage';



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
                <Route path='/games' exact>
                    <GamesPage/>
                </Route>
                <Route path='/create' exact>
                    <CreatePage/>
                </Route>
                <Route path='/detail/:id'>
                    <DetailPage/>
                </Route>
                <Redirect to='/home'/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/' exact>
                <AuthPage/>
            </Route>
            <Redirect to ='/'/>
        </Switch>
    )
}


export default useRoutes;