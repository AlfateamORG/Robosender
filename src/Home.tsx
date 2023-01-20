import React from "react";
import { Button, ButtonGroup, Center, HStack, Image, VStack, Heading, Input, border} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Stack} from '@chakra-ui/react'
import { PhoneIcon, AddIcon, WarningIcon, MoonIcon} from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Textarea,
  } from '@chakra-ui/react'

import { Select } from '@chakra-ui/react'
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

function Home(){
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure()
  const { isOpen: TisOpen, onOpen: TonOpen, onClose: TonClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const [greetMsg, setGreetMsg] = useState([]);
  const [name, setName] = useState("")

  const [names, setNames] = useState("")
  const [messages, setMessages] = useState("")
  const [newAccType, setNewAccType] = useState("")
  const [buttonName, setButtonName] = useState("")
  const [buttonName2, setButtonName2] = useState("")
  const [selected, setSelected] = useState("");
 
  const handleAuthCkick = event => {
    setButtonName2(event.currentTarget.id)
    auth(event.currentTarget.id);
  }
  const handleClick = event => {
    console.log(event.currentTarget.id);
    setButtonName2(event.currentTarget.id);
    deleteAcc(event.currentTarget.id);
  };

  const handleRunClick = event => {
    console.log(event.currentTarget.id);
    run(event.currentTarget.id);
  };

  const handleChange = event => {
    console.log(event.target.value);
    setSelected(event.target.value);
  };

  const handleSettingsClick = event => {
    console.log(event.currentTarget.id)
    setName(event.currentTarget.id)
    TonOpen()
  }

  async function run(nameB) {
    let users = names;
    let accName = nameB;
    console.log((await invoke("startTask", {users, accName ,messages})));
  }
  async function auth(nameB) {
    let social = "telegram"
    let name = nameB.replace("_auth", "");
    console.log((await invoke("auth_selenium", {name, social})));
  }


  async function createAcc() {
    let element = document.querySelector('#new_acc_name');
    element.style.borderColor = 'green'
    let name = element.value;
    let social = selected
    if (name != ''){
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        if (social != ''){
            console.log((await invoke("greet", { name, social})));
            element.value = ''
        }
        
    } else {
        element.style.borderColor = 'red'
    }
    await getAccs();
    
  }

  async function getAccs(){
    let accs = await invoke("get_my_accs", {});
    let new_accs = accs.slice(0, accs.length -3) + "]}"
    let obj = JSON.parse(new_accs);
    console.log(obj["accounts"])
    setGreetMsg(obj["accounts"])
  }

  async function deleteAcc(Bname) {
    
    let name = Bname.replace("_trash", "");
    console.log((await invoke("delete_my_acc", { name })));
    await getAccs();
    
  }

  function close(){
    let messages = document.querySelector('#modal_messages').value;
    let users = document.querySelector('#modal_names').value
    setMessages(messages)
    setNames(users)
    TonClose()
  }

  return(
  <Tabs variant='unstyled' fontFamily="Inter, sans-serif">
    <TabList h='4em'>
        <Tab color='gray' _selected={{ color: 'black'}}> Home</Tab>
        <Tab color='gray' _selected={{ color: 'black'}}> Accounts</Tab>
        <Tab color='gray' _selected={{ color: 'black'}}> Updates</Tab>
        <Button marginTop='10px' width='90%' alignItems='center' textColor='gray' border='1px solid #D4D4D4' onClick={onOpen}>
            <Image src='/search.png' boxSize='12px' marginRight='10px'/>
                Seach the accounts
        </Button>
        
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
                <ModalContent  width={"40em"}>
                <ModalCloseButton />
                <ModalBody>
                    <Input placeholder="Account name" fontSize='xl' border='1px solid gray' width={'19em'}></Input>
                </ModalBody>
            </ModalContent>
        </Modal>

        <Modal isOpen={TisOpen} onClose={TonClose}>
            <ModalOverlay />
                <ModalContent  width={"40em"}>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Account name:{name}</Text>
                    <Text paddingTop='20px'>Messages example</Text>
                    <Textarea
                        id = "modal_messages"
                        placeholder='{Hello|Friend|How are you}'
                        size='sm'
                    />

                    <Text paddingTop='20px'>Users</Text>
                    <Textarea
                        id = "modal_names"
                        placeholder='@username1, @username2'
                        size='sm'
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={close}>
                    Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    
        <Tab color='gray' _selected={{ color: 'black'}}>Settings</Tab>
        <Button marginTop='12px'><MoonIcon/></Button>
    </TabList>

    <TabPanels>
        <TabPanel>
            <Center h='2xl'>
                <HStack spacing="20vh">
                    <VStack alignItems="left">
                        <Heading>Robosender</Heading>
                    </VStack>
                    <Image src='/home.png' />
                </HStack>
            </Center>
        </TabPanel>
        <TabPanel>

            <Center>
                <VStack w='100%'>
                    <Box w='100%' p={4} color='white' border='1px solid gray' borderRadius='8px' marginBottom='50px'>
                        <HStack>
                            <Input placeholder="Account name" border='1px solid gray' color='black' id='new_acc_name' ></Input>
                            <Select color='black' id='social_type' placeholder='Select option' w='200px' border='1px solid #5A52E7' onChange={handleChange}>
                                <option value="tg">Telegram</option>
                                <option value="vk">Vk</option>
                                <option value="inst">Instagram</option>
                            </Select>
                            <Button border='1px solid gray' color='white' backgroundColor='#8E89E2' onClick={() => createAcc()}_hover={{bakgroundColor: '#5A52E7'}}>Save</Button>
                        </HStack>
                    </Box>
                    {
                        greetMsg.map((acc) =>
                        <Box w='100%' p={4} color='white' border='1px solid gray' borderRadius='8px'>
                            <HStack spacing='50%' >
                                <VStack align='left' width='20%'>
                                    <Text color="black">Account name: {acc["name"]} - {acc["social"]}</Text>
                                    <Text color="black">Status: Not Work</Text>
                                    <Select color='black' placeholder='Select option' w='200px' border='1px solid #5A52E7' >
                                        <option value="option1">Send message to users</option>
                                    </Select>
                                </VStack>
                                
                                <Box>
                                    <HStack>
                                        <VStack>
                                            <Button id={acc["name"] + '_auth'} backgroundColor='#8E89E2' _hover={{bakgroundColor: '#5A52E7', border: '1px solid gray'}} width="100px" onClick={handleAuthCkick}>Auth</Button>
                                            <Button id={acc["name"] + '_run'} backgroundColor='#8E89E2' _hover={{bakgroundColor: '#5A52E7', border: '1px solid gray'}} width="100px" onClick={handleRunClick}>Run Task</Button>
                                        </VStack>
                                        <VStack>
                                            <Button id={acc["name"] + '_trash'} backgroundColor='#8E89E2' _hover={{bakgroundColor: '#5A52E7', border: '1px solid gray'}} width="100px" onClick={handleClick}>Delete</Button>
                                            <Button id={acc["name"] + '_settings'} backgroundColor='#8E89E2' _hover={{bakgroundColor: '#5A52E7', border: '1px solid gray'}} width="100px" onClick={handleSettingsClick}>Task Settings</Button>
                                        </VStack>
                                    </HStack>
                                    
                                    
                                </Box>
                            </HStack>
                            

                            
                            
                        </Box>)
                    }
                </VStack>
            </Center>



        </TabPanel>
        <TabPanel>
        <Center h='2xl'>
            <VStack spacing="1px">
                <Heading>Nothing for update</Heading>
                <Image src='/updates.png' boxSize='400px' />
            </VStack>
        </Center>
    </TabPanel>
  </TabPanels>
  </Tabs>



)}

export default Home;
