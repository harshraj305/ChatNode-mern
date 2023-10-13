import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';

import { ChatState } from '../../Context/ChatProvider';

import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const toast = useToast();

    const handleSearch = async (query) => {

        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

            console.log(data);
        } catch (error) {
            toast({
                title: 'Error occured',
                status: 'error',
                description: 'Failed to load search Result',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
        }
    };
    const handleSubmit = async () => {

        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                isClosable: true,
                duration: 5000,
                position: 'top'
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }
            const { data } = await axios.post(
                '/api/chat/group',
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config,
            );
            setChats([data, ...chats]);
            onClose();

            toast({
                title: 'New Group Chat Created!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
        } catch (error) {
            toast({
                title: 'Failed to Create the Chat!',
                description: error.response.data,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom',
            });
        }
    };
    const handleGroup = (userToAdd) => {
        console.log(userToAdd);
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User Already added',
                status: 'warning',
                isClosable: true,
                duration: 5000,
                position: 'top'
            });
            return;
        }
        console.log('outside if');
        setSelectedUsers([...selectedUsers, userToAdd]);
    };
    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDir='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                mb={1}
                                placeholder='Add Users'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box
                            w='100%'
                            display='flex'
                            flexWrap='wrap'
                        >
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading
                            ? (<div>Loading...</div>)
                            : (
                                searchResult
                                    ?.slice(0, 4)
                                    .map((user) => (
                                        <UserListItem
                                            user={user}
                                            key={user._id}
                                            handleFunction={() => handleGroup(user)}

                                        ></UserListItem>
                                    ))
                            )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );

}

export default GroupChatModal;