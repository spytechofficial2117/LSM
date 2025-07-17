import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Create a custom hook for easy context consumption
export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};

// Create the Provider component
export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [userPermissions, setUserPermissions] = useState({});

    // Load users and permissions from localStorage on initial render
    useEffect(() => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const storedPermissions = JSON.parse(localStorage.getItem('userPermissions')) || {};
            setUsers(storedUsers);
            setUserPermissions(storedPermissions);
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            setUsers([]);
            setUserPermissions({});
        }
    }, []);

    // Helper to persist users to state and localStorage
    const persistUsers = (updatedUsers) => {
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
    };

    // Helper to persist permissions to state and localStorage
    const persistPermissions = (updatedPermissions) => {
        localStorage.setItem('userPermissions', JSON.stringify(updatedPermissions));
        setUserPermissions(updatedPermissions);
    };

    const addUser = (newUser) => {
        const updatedUsers = [...users, { id: `user-${Date.now()}-${Math.random()}`, status: 'Active', ...newUser }];
        persistUsers(updatedUsers);
    };

    const addUsers = (newUsers) => {
        const usersToAdd = newUsers.map(user => ({
            ...user,
            id: `user-${Date.now()}-${Math.random()}`,
            status: 'Active'
        }));
        const updatedUsers = [...users, ...usersToAdd];
        persistUsers(updatedUsers);
    };

    const updateUsers = (updatedUsersList) => {
        persistUsers(updatedUsersList);
    };

    const removeUsers = (userIdsToRemove) => {
        const updatedUsers = users.filter(user => !userIdsToRemove.includes(user.id));
        persistUsers(updatedUsers);
    };

    const updateUserPermissions = (userIds, newPermissions) => {
        const updatedPermissions = { ...userPermissions };
        userIds.forEach(userId => {
            updatedPermissions[userId] = newPermissions;
        });
        persistPermissions(updatedPermissions);
    };


    // The value that will be supplied to all consuming components
    const value = {
        users,
        addUser,
        addUsers,
        updateUsers,
        removeUsers,
        userPermissions,
        updateUserPermissions
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
