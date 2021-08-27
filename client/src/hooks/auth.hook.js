import { useState, useCallback, useEffect } from 'react';

const storageName = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [ready, setReady] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userRights, setUserRights] = useState(null);

    const login = useCallback(async (jwtToken, id, name) => {
        setUserRights(await getRights(id, jwtToken));
        setToken(jwtToken);
        setUserId(id);
        setUserName(name);
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, userName: name
        }));
        setReady(true);
    }, []);

    const getRights = async (id, token) => {
        const method = 'POST';
        const body = JSON.stringify({
            id: id
        });
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        };
        const userRights = await fetch('/api/auth/userRights', { method, body, headers })
            .then(data => data.json());
        return userRights;
    }

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setUserName(null);
        setUserRights(null);
        localStorage.removeItem(storageName);
    }, []);

    useEffect(() => {
        const storageLogin= async()=>{
            const data = JSON.parse(localStorage.getItem(storageName));
            if (data && data.token) {
                await login(data.token, data.userId, data.userName);
            }
            setReady(true);
        }
        storageLogin();
    }, [login]);

    return { login, logout, token, userId, userName, ready, userRights }
}