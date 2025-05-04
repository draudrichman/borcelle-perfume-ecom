'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { User } from '@/payload-types'
import { toast } from "sonner"


type ResetPassword = (args: {
    password: string
    passwordConfirm: string
    token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void>

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void>

type Login = (args: { email: string; password: string }) => Promise<User>

type Logout = () => Promise<void>

type AuthContext = {
    user?: User | null
    setUser: (user: User | null) => void
    logout: Logout
    login: Login
    create: Create
    resetPassword: ResetPassword
    forgotPassword: ForgotPassword
    status: undefined | 'loggedOut' | 'loggedIn'
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>()

    // used to track the single event of logging in or logging out
    // useful for `useEffect` hooks that should only run once
    const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()
    const create = useCallback<Create>(async args => {
        try {
            // 1. First create the user
            const createRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: args.email,
                    password: args.password,
                    passwordConfirm: args.passwordConfirm,
                }),
            });

            if (!createRes.ok) {
                const { errors } = await createRes.json();
                throw new Error(errors?.[0]?.message || 'Signup failed');
            }

            // 2. Then log the user in automatically
            const loginRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: args.email,
                    password: args.password,
                }),
            });

            if (loginRes.ok) {
                const { user, errors } = await loginRes.json();
                if (errors) throw new Error(errors[0].message);

                setUser(user);
                setStatus('loggedIn');
                toast.success(`Welcome, ${user?.name || 'User'}! Your account was created successfully! 🎉`);
                return user;
            }

            throw new Error('Automatic login after signup failed');
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Account created but login failed. Please login manually.';
            toast.error(errorMessage);
            throw e;
        }
    }, []);

    const login = useCallback<Login>(async args => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: args.email,
                    password: args.password,
                }),
            })

            if (res.ok) {
                const { user, errors } = await res.json()
                if (errors) {
                    toast.error(errors[0].message || 'Login failed. Please try again.')
                    throw new Error(errors[0].message)
                }
                setUser(user)
                setStatus('loggedIn')
                console.log(user)
                toast.success(`Welcome back, ${user?.name || 'User'}! 🎉`)
                return user
            }

            toast.error('Invalid email or password. Please try again.')
            throw new Error('Invalid login')
        } catch (e) {
            toast.error('Login failed. Please check your credentials and try again.')
            throw new Error('An error occurred while attempting to login.')
        }
    }, [])

    const logout = useCallback<Logout>(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (res.ok) {
                setUser(null)
                setStatus('loggedOut')
                toast.success('Logged out successfully. See you soon! 👋')
            } else {
                toast.error('Logout failed. Please try again.')
                throw new Error('An error occurred while attempting to logout.')
            }
        } catch (e) {
            toast.error('Failed to logout. Please try again.')
            throw new Error('An error occurred while attempting to logout.')
        }
    }, [])

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                if (res.ok) {
                    const { user: meUser } = await res.json()
                    setUser(meUser || null)
                    setStatus(meUser ? 'loggedIn' : undefined)
                } else {
                    throw new Error('An error occurred while fetching your account.')
                }
            } catch (e) {
                setUser(null)
                throw new Error('An error occurred while fetching your account.')
            }
        }

        fetchMe()
    }, [])

    const forgotPassword = useCallback<ForgotPassword>(async args => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: args.email,
                }),
            })

            if (res.ok) {
                const { data, errors } = await res.json()
                if (errors) throw new Error(errors[0].message)
                setUser(data?.loginUser?.user)
            } else {
                throw new Error('Invalid login')
            }
        } catch (e) {
            throw new Error('An error occurred while attempting to login.')
        }
    }, [])

    const resetPassword = useCallback<ResetPassword>(async args => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: args.password,
                    passwordConfirm: args.passwordConfirm,
                    token: args.token,
                }),
            })

            if (res.ok) {
                const { data, errors } = await res.json()
                if (errors) throw new Error(errors[0].message)
                setUser(data?.loginUser?.user)
                setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
            } else {
                throw new Error('Invalid login')
            }
        } catch (e) {
            throw new Error('An error occurred while attempting to login.')
        }
    }, [])

    return (
        <Context.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                create,
                resetPassword,
                forgotPassword,
                status,
            }}
        >
            {children}
        </Context.Provider>
    )
}

type UseAuth<T = User> = () => AuthContext

export const useAuth: UseAuth = () => useContext(Context)