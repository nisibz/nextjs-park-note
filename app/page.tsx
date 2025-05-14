import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1">Park note</Typography>
    </Container>
  );
}
