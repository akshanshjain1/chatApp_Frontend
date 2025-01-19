import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
function NotFound(){
    return (
        <Container height={"100vh"}>
            <Stack>
                <ErrorIcon/>
                <Typography variant="h1">404 

                </Typography>
                <Typography variant="h3">
                    Not found
                </Typography>
                <Link to={"/"} > Go Back to Home
                </Link>
            </Stack>
        </Container>
    )
}
export default NotFound