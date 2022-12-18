import React from 'react';
import './App.css';
import { Box } from '@mantine/core';
import ToolContainer from './nestedSortable/ToolContainer';

function App() {
  return (
    <Box sx={{display: 'flex', paddingTop: '200px', justifyContent: 'center'}}>
      <ToolContainer />
    </Box>
  );
}

export default App;
