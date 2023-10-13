import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login';


const Homepage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));

        if (user) {
            navigate('/chats');
        }
    }, [navigate]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                d='flex'
                justifyContent='center'
                p={3}
                bg={'white'}
                w='100%'
                m='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text
                    fontSize='4xl'
                    fontFamily='Work sans'
                    color='black'
                    textAlign='center'
                >ChatNode</Text>
            </Box>
            <Box
                bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' textColor='black'
            >
                <Tabs variant='soft-rounded'>
                    <TabList mb='1rem'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>SignUp</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {<Login />}
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>

        </Container>
    );
}

export default Homepage;
