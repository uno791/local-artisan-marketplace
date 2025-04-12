import {render,screen} from '@testing-library/react'
import { Hello } from './Hello';
import React from 'react';
it('renders hellow world',()=>{
    render(<Hello/>);
    const myElement=screen.getByText(/Hello World/);
    expect(myElement).toBeInTheDocument();
})