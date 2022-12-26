import { createStyles, MantineTheme } from "@mantine/core";



const useNestedStyle = createStyles((theme: MantineTheme) => ({
    container: {
         gap: 0,
        margin: 0,
        spacing: 0,
        border: '1px solid black',
        minWidth: '500px',
        display:'flex'
    },

    rootStack: {
        gap: 0,
        margin: 0,
        spacing: 0,
        border: '1px solid black',
        minWidth: '500px',
    },
    groupHeader: {
        background: theme.colors.blue[3],
        borderWidth: "0px 1px 1px 1px",
        borderColor: 'red',
        minHeight: '47px',
        minWidth: '420px',
        display: 'flex',
        justifyContent: 'left',
        gap: '8px',
        paddingLeft: '17px!important',
        paddingRight: '17px!important',
        '> *': {
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    groupGrid: {
        gap: 0,
        margin: 0,
        gutter: 0,
        background: 'red'
    },
    sidebar: {
        margin: 0,
        padding: 0,
        width: '80px',
        background: 'yellow'
    },
    valueRowCol: {
        background: 'lightblue',
        display: 'flex',
        padding: 0,
        margin: 0,
        minHeight: '50px',
        borderBottom: '1px solid black',
        '> *': {
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    /*groupHeader: {
        background: theme.colors.blue[3],
        borderWidth: "0px 1px 1px 1px",
        borderColor: 'red',
        height: '50px',
        minWidth: '420px',
        display: 'flex',
        justifyContent: 'left',
        paddingLeft: '17px!important',
        paddingRight: '17px!important',
        '> *': {
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    valueRowCol: {
        background: 'lightblue',
        display: 'flex',
        padding: 0,
        margin: 0,
        minHeight: '50px',
        borderBottom: '1px solid black',
        '> *': {
            marginTop: 'auto',
            marginBottom: 'auto',
        }
    },
    sidebar: {
        margin: 0,
        padding: 0,
        width: '80px',
        background: 'yellow',
        minHeight: '50px',
    }*/
    
    group: {
        gap: 0,
        gutter: 0,
        border: '1px solid red',
    },
    dropZone: {
        padding: '20px',
        border: '1px solid green',

    }

}))


export default useNestedStyle;