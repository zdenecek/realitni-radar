import { defineStore } from 'pinia';

import axios from '@/plugins/axios';
import { json } from 'stream/consumers';
import User from '@/class/User';

export const useAuthStore = defineStore('auth', {
    state: () => {
        let user = null;
        const userData =  sessionStorage.getItem('user');
        if (userData) {
            const { username, name, role, email, id } = JSON.parse(userData);
            user = new User(id, name, username, email, role)
        }
        return ({
            user: user as User | null,
            isAuthenticated: !!user
        })
    },
    getters: {
        isAdmin: state => state.user?.role === 'admin',
    },
    actions: {
        async login(username: string, password: string) {
            try {
                const response = await axios.post('/login/password', { username, password });
                this.user = response.data.user;
                this.isAuthenticated = true;
                sessionStorage.user = JSON.stringify(this.user);
                console.debug('Login successful:', this.user);
            } catch (error: any) {
                console.error('Login error:', error.message);
                throw error;
            }
        },
        async logout() {
            try {
                await axios.post('/logout');
                this.user = null;
                this.isAuthenticated = false;
                sessionStorage.removeItem('user');
            }
            catch (error: any) {
                console.error('Logout error:', error.message);
            }
        },
        async changePassword(oldPassword: string, newPassword: string) {
            if (!this.isAuthenticated) {
                throw new Error('Not authenticated');
            }
            try {
                await axios.post('/change-password', { username: this.user?.username, password: newPassword, oldPassword });
            } catch (error: any) {
                console.error('Change password error:', error.message);
                throw error;
            }
        },
        async register(email: string, name: string, password: string) {
            if (this.isAuthenticated) {
                throw new Error('Already authenticated');
            } try {
                const response = await axios.post('/signup', { email, username: email, name, password });
                console.debug('Register successful:', response.data.user);
            } catch (error: any) {
                console.error('Register error:', error.message);
                throw error;
            }
        }   
    }
});