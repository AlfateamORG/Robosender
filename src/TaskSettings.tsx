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
  } from '@chakra-ui/react'

import { Select } from '@chakra-ui/react'
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

function TaskSettings() {
    const navigate = useNavigate();
    function GotoHome(){
      navigate('/home')
    }
  
    return (
      <Center>
        <HStack h='xl' spacing='20vh'>
          <VStack spacing='40px'>
            <Heading>Robosender</Heading>
            <Input placeholder='Your Secret Key' border='1px solid gray' />
            <Button backgroundColor='#89A1FF' onClick={GotoHome}>Log In</Button>
          </VStack>
          
        </HStack>
      </Center>
    );
  }
  
  export default TaskSettings;
  