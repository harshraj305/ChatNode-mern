import React, { useState } from 'react';
import axios from 'axios';
import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';

import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (userToRemove) => {

        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: 'Only Admin can add someone!',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(
                '/api/chat/groupremove',
                {
                    chatId: selectedChat._id,
                    userId: userToRemove._id,
                },
                config,
            );

            // if groupadmin remove himself
            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);

            setFetchAgain(!fetchAgain);

            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'error',
                description: error.response.data,
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    };
    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: 'User Already in the group',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom'
            });
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin can add someone!',
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'bottom'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(
                '/api/chat/groupadd',
                {
                    chatId: selectedChat._id,
                    userId: userToAdd._id,
                },
                config,
            );

            setSelectedChat(data);
            console.log(data);
            setFetchAgain(!fetchAgain);
            console.log('setFetchCalled');
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'error',
                description: error.response.data,
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }
    };
    const handleRename = async () => {

        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(
                '/api/chat/rename',
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            setSelectedChat(data);
            console.log(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured',
                status: 'error',
                description: error.response.data,
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setRenameLoading(false);
        }
        setGroupChatName('');
    };
    const handleSearch = async (query) => {

        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)

            setSearchResult(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error occured',
                status: 'error',
                description: 'Failed to load search Result',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoading(false);
        }

    };

    return (
        <>
            <IconButton
                display={{ base: 'flex' }}
                icon={<ViewIcon />}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        display='flex'
                        justifyContent='center'
                        fontSize='35px'
                        fontFamily='Work sans'
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {
                                selectedChat.users.map((u) => (
                                    <UserBadgeItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => handleRemove(u)}
                                    />
                                ))
                            }
                        </Box>
                        <FormControl display='flex'>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant='solid'
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl display='flex'>
                            <Input
                                placeholder='Add user to group'
                                mb={3}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (
                            <Spinner size='lg' />
                        ) :
                            (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleAddUser(user)}
                                    />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='red'
                            onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModal;