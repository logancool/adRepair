import { CardStack, Card } from 'react-cardstack';

<CardStack
    height={500}
    width={400}
    background='#f8f8f8'
    hoverOffset={25}>

    <Card background='#2980B9'>
        <h1>Number 1</h1>
    </Card>

    <Card background='#27AE60'>
        <NumberTwo />
    </Card>

</CardStack>