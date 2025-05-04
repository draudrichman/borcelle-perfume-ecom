'use client';

import { useState, useCallback } from 'react';
import type React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useAuthModal from './hooks/useAuthModal';
// import { useAuth } from './context/AuthContext';
import { useAuth } from '@/app/_providers/AuthProvider';

export function AuthModal({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    const { isOpen, mode, onClose } = useAuthModal();
    const { login, create } = useAuth();
    const isLogin = mode === 'login';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await create({
                    email,
                    password,
                    passwordConfirm: password, // Assuming passwordConfirm matches password
                });
            }
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [isLogin, email, password, login, create, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn('sm:max-w-[425px]', className)} {...props}>
                <DialogHeader>
                    <DialogTitle>{isLogin ? 'Welcome back' : 'Create an account'}</DialogTitle>
                    <DialogDescription>
                        {isLogin ? 'Enter your credentials to login' : 'Fill in your details to sign up'}
                    </DialogDescription>
                </DialogHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            {!isLogin && (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {isLogin && (
                                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                                            Forgot your password?
                                        </a>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                            </Button>
                            <div className="text-center text-sm">
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        useAuthModal.setState({ mode: isLogin ? 'signup' : 'login' });
                                    }}
                                    className="underline underline-offset-4"
                                >
                                    {isLogin ? 'Sign up' : 'Login'}
                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </DialogContent>
        </Dialog>
    );
}