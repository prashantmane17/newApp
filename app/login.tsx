import React from 'react'
import { useRouter } from 'expo-router';

export default function login() {
    const router = useRouter()
    const redirect = () => {
        router.replace('/')
    }
    redirect();
    return (
        <></>
    )
}
