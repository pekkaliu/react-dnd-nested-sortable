import React from 'react';
import './App.css';
import { Box } from '@mantine/core';
//import ToolContainer from './nestedSortable/ToolContainer';
import RootContainer from './rdnd/RootContainer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from './simpleList/Container';

function App() {
  return (
    <>
      <Box sx={{ display: 'flex', paddingTop: '200px', justifyContent: 'center' }}>
        <DndProvider backend={HTML5Backend}>
          <Container />
        </DndProvider>
      </Box>
      <Box sx={{ display: 'flex', paddingTop: '200px', justifyContent: 'center' }}>
        <DndProvider backend={HTML5Backend}>
          <RootContainer />
        </DndProvider>
      </Box>
    </>

  );
}

export default App;
