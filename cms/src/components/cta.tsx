import React from 'react';
import {Button} from '@mui/material';

export default function CTA(props: any) {
  return (
    <Button variant="contained" color="primary" type={props.type} onSubmit={props.handleSubmit}>
      {props.name}
    </Button>
  )
}
