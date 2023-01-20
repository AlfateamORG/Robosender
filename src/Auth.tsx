import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { useNavigate } from "react-router-dom";
import {
  Center, 
  Button,
  Image,
  Input,
  HStack,
  VStack,
  Heading


} from "@chakra-ui/react"

const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
}

function App() {
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

export default App;
