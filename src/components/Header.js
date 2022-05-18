import Typography from '@mui/material/Typography';

const Header = () => {
    return(
        <Typography variant="h2" gutterBottom marginTop={3} sx={{
            fontWeight: "bold",
            color: "#e82771"
        }}>Token Gated dApp</Typography>
    )
}

export default Header;