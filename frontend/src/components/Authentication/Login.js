import React, { useState } from 'react';
import { FormControl, FormLabel, VStack, Input, InputRightElement, InputGroup, Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [show, setShow] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => {
        setShow(!show);
    }
    const submitHandler = async () => {

        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please enter the Credentials',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };

            const { data } = await axios.post(
                '/api/user/login',
                { email, password },
                config,
            );
            console.log(data);
            toast({
                title: 'Login Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    }

    return (
        <VStack spacing='5px'>

            <FormControl id='email'>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your Password'
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
            </FormControl>

            <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button
                            height='1.75rem'
                            size='sm'
                            onClick={handleClick}
                        >
                            {show ? 'hide' : 'show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <Button
                colorScheme='blue'
                width='100%'
                style={{ marginTop: 15 }}
                isLoading={loading}
                onClick={submitHandler}
            >
                Login
            </Button>

            <Button
                variant='solid'
                colorScheme='red'
                width='100%'
                style={{ marginTop: 10 }}
                onClick={() => {
                    setEmail('guest@gmail.com');
                    setPassword('123456');
                }}
            >
                Get guest user Credentials
            </Button>
        </VStack>
    );
}

export default Login;