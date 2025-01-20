import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const CompanyPolicy = () => {
    // Extended policy data with long content
    const policies = [
        {
            title: 'Company Rules',
            content: 'These are the company rules. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum. Suspendisse interdum elit libero, ac facilisis nunc congue at Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum.'
        },
        {
            title: 'Non-Disclosure Agreement (NDA)',
            content: 'This is the NDA content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum. Suspendisse interdum elit libero, ac facilisis nunc congue at Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula.'
        },
        {
            title: 'Code of Conduct',
            content: 'This is the code of conduct. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum. Suspendisse interdum elit libero, ac facilisis nunc congue at Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat.'
        },
        {
            title: 'Leave Policy',
            content: 'This is the leave policy content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum. Suspendisse interdum elit libero, ac facilisis nunc congue at Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum.'
        },
        {
            title: 'Workplace Safety Guidelines',
            content: 'These are the workplace safety guidelines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum. Suspendisse interdum elit libero, ac facilisis nunc congue at Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis.'
        },
        {
            title: 'Remote Work Policy',
            content: 'This is the remote work policy content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus. Proin tristique et nisl ut lacinia. Sed malesuada turpis a lectus convallis fermentum. Integer at tincidunt ipsum. Curabitur eget felis nec purus fermentum volutpat. Etiam fringilla, mi sit amet hendrerit iaculis, augue ligula cursus nunc, ut porttitor turpis orci sit amet ligula. Duis feugiat tincidunt ex sit amet fermentum. Suspendisse interdum elit libero, ac facilisis nunc congue at Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula erat vitae nibh ultrices, id venenatis elit cursus.'
        },
    ];

    return (
        <div style={{ padding: '30px', margin: "50px" }}>
            <Typography variant="h4" gutterBottom>
                Company Policies
            </Typography>

            {/* First Row */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '300px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            {policies[0].title}
                        </Typography>
                        <Typography variant="body1">{policies[0].content}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '300px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            {policies[1].title}
                        </Typography>
                        <Typography variant="body1">{policies[1].content}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Second Row */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '300px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            {policies[2].title}
                        </Typography>
                        <Typography variant="body1">{policies[2].content}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '300px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            {policies[3].title}
                        </Typography>
                        <Typography variant="body1">{policies[3].content}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Third Row */}
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '300px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            {policies[4].title}
                        </Typography>
                        <Typography variant="body1">{policies[4].content}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '300px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            {policies[5].title}
                        </Typography>
                        <Typography variant="body1">{policies[5].content}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default CompanyPolicy;
